import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - Arrears Aging Report
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const scope = searchParams.get("scope") || "portfolio"
    const propertyId = searchParams.get("propertyId")
    const asOfDate = searchParams.get("asOfDate") || new Date().toISOString().split('T')[0]

    // Get all pending/overdue payments with their due dates
    let arrearsQuery = `
      SELECT 
        p.id,
        p.tenant_id,
        p.property_id,
        p.amount,
        p.due_date,
        p.status,
        GREATEST(0, (?::date - p.due_date::date))::int as days_overdue,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        prop.title as property_title
      FROM payments p
      JOIN users u ON p.tenant_id = u.id
      JOIN properties prop ON p.property_id = prop.id
      WHERE p.landlord_id = ? 
        AND p.status IN ('pending', 'overdue')
        AND p.due_date IS NOT NULL
        AND p.due_date <= ?
    `
    const arrearsParams: any[] = [asOfDate, session.userId, asOfDate]

    if (scope === "property" && propertyId) {
      arrearsQuery += ` AND p.property_id = ?`
      arrearsParams.push(propertyId)
    }

    arrearsQuery += ` ORDER BY p.due_date ASC`

    const arrearsData = await query<{
      id: string
      tenant_id: string
      property_id: string
      amount: number
      due_date: string
      status: string
      days_overdue: number
      first_name: string
      last_name: string
      email: string
      phone: string
      property_title: string
    }>(arrearsQuery, arrearsParams)

    // Categorize by aging buckets
    const buckets = {
      "0-30": { count: 0, amount: 0, tenants: [] as any[] },
      "31-60": { count: 0, amount: 0, tenants: [] as any[] },
      "61-90": { count: 0, amount: 0, tenants: [] as any[] },
      "90+": { count: 0, amount: 0, tenants: [] as any[] },
    }

    for (const payment of arrearsData) {
      const daysOverdue = payment.days_overdue || 0
      let bucket: keyof typeof buckets

      if (daysOverdue <= 30) {
        bucket = "0-30"
      } else if (daysOverdue <= 60) {
        bucket = "31-60"
      } else if (daysOverdue <= 90) {
        bucket = "61-90"
      } else {
        bucket = "90+"
      }

      buckets[bucket].count++
      buckets[bucket].amount += payment.amount
      buckets[bucket].tenants.push({
        id: payment.tenant_id,
        name: `${payment.first_name} ${payment.last_name}`,
        email: payment.email,
        phone: payment.phone,
        property: payment.property_title,
        amount: payment.amount,
        daysOverdue,
        dueDate: payment.due_date,
      })
    }

    // Calculate totals
    const totalArrears = Object.values(buckets).reduce((sum, b) => sum + b.amount, 0)
    const totalCount = Object.values(buckets).reduce((sum, b) => sum + b.count, 0)

    return NextResponse.json({
      success: true,
      arrears: {
        buckets,
        summary: {
          totalArrears,
          totalCount,
          asOfDate,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching arrears aging:", error)
    return NextResponse.json({ error: "Failed to fetch arrears" }, { status: 500 })
  }
}
