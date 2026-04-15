import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - Property/Unit Performance Breakdown
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
    const groupBy = searchParams.get("groupBy") || "property"

    if (groupBy === "property") {
      // Get property-level breakdown
      const propertiesQuery = `
        SELECT 
          p.id,
          p.title,
          p.address,
          p.rent_amount as expected_rent,
          p.status,
          (SELECT COUNT(*) FROM leases l WHERE l.property_id = p.id AND l.status = 'active') as active_leases,
          (SELECT COALESCE(SUM(pay.amount), 0) FROM payments pay WHERE pay.property_id = p.id AND pay.status = 'completed') as collected,
          (SELECT COALESCE(SUM(pay.amount), 0) FROM payments pay WHERE pay.property_id = p.id AND pay.status IN ('pending', 'overdue')) as outstanding,
          (
            SELECT CONCAT(u.first_name, ' ', u.last_name)
            FROM leases l
            JOIN users u ON l.tenant_id = u.id
            WHERE l.property_id = p.id AND l.status = 'active'
            LIMIT 1
          ) as tenant_name,
          (
            SELECT COUNT(*) FROM payments pay WHERE pay.property_id = p.id AND pay.status = 'completed'
          ) as months_rented,
          (
            SELECT COALESCE(SUM(pay.amount), 0) FROM payments pay WHERE pay.property_id = p.id AND pay.status = 'completed'
          ) as total_rent,
          (
            SELECT COALESCE(SUM(e.amount), 0) FROM expenses e WHERE e.property_id = p.id
          ) as property_expenses
        FROM properties p
        WHERE p.landlord_id = ?
        ORDER BY p.title
      `

      const properties = await query<{
        id: string
        title: string
        address: string
        expected_rent: number
        status: string
        active_leases: number
        collected: number
        outstanding: number
        tenant_name: string | null
        months_rented: number
        total_rent: number
        property_expenses: number
      }>(propertiesQuery, [session.userId])

      const breakdown = properties.map((p) => ({
        id: p.id,
        name: p.title,
        address: p.address,
        expectedRent: p.expected_rent,
        status: p.status,
        isOccupied: p.active_leases > 0,
        collected: p.collected,
        outstanding: p.outstanding,
        tenantName: p.tenant_name || null,
        monthsRented: p.months_rented,
        totalRent: p.total_rent,
        propertyExpenses: p.property_expenses,
        propertyNOI: p.total_rent - p.property_expenses,
        collectionRate: p.expected_rent > 0 ? Math.round((p.collected / p.expected_rent) * 100) : 0,
      }))

      return NextResponse.json({
        success: true,
        breakdown,
        groupBy: "property",
      })
    }

    if (groupBy === "tenant") {
      // Get tenant-level breakdown (rent roll)
      const tenantsQuery = `
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          l.rent_amount,
          l.start_date,
          l.end_date,
          l.status as lease_status,
          p.title as property_title,
          p.address as property_address,
          (SELECT COALESCE(SUM(pay.amount), 0) FROM payments pay WHERE pay.tenant_id = u.id AND pay.landlord_id = ? AND pay.status = 'completed') as total_paid,
          (SELECT COALESCE(SUM(pay.amount), 0) FROM payments pay WHERE pay.tenant_id = u.id AND pay.landlord_id = ? AND pay.status IN ('pending', 'overdue')) as outstanding,
          (SELECT COALESCE(SUM(e.amount), 0) FROM expenses e WHERE e.property_id = p.id) as property_expenses
        FROM leases l
        JOIN users u ON l.tenant_id = u.id
        JOIN properties p ON l.property_id = p.id
        WHERE l.landlord_id = ?
        ORDER BY u.last_name, u.first_name
      `

      const tenants = await query<{
        id: string
        first_name: string
        last_name: string
        email: string
        phone: string
        rent_amount: number
        start_date: string
        end_date: string
        lease_status: string
        property_title: string
        property_address: string
        total_paid: number
        outstanding: number
        property_expenses: number
      }>(tenantsQuery, [session.userId, session.userId, session.userId])

      const breakdown = tenants.map((t) => ({
        id: t.id,
        name: `${t.first_name} ${t.last_name}`,
        email: t.email,
        phone: t.phone,
        rentAmount: t.rent_amount,
        leaseStart: t.start_date,
        leaseEnd: t.end_date,
        leaseStatus: t.lease_status,
        property: t.property_title,
        propertyAddress: t.property_address,
        totalPaid: t.total_paid,
        outstanding: t.outstanding,
        propertyExpenses: t.property_expenses,
        paymentStatus: t.outstanding > 0 ? "Has Arrears" : "Current",
      }))

      return NextResponse.json({
        success: true,
        breakdown,
        groupBy: "tenant",
      })
    }

    return NextResponse.json({ error: "Invalid groupBy parameter" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching financial breakdown:", error)
    return NextResponse.json({ error: "Failed to fetch breakdown" }, { status: 500 })
  }
}
