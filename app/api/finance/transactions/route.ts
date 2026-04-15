import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - Recent Transactions
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
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")
    const propertyId = searchParams.get("propertyId")
    const status = searchParams.get("status")

    let transactionsQuery = `
      SELECT 
        p.id,
        p.amount,
        p.currency,
        p.status,
        p.payment_type,
        p.payment_method,
        p.payment_reference,
        p.due_date,
        p.paid_date,
        p.created_at,
        u.first_name,
        u.last_name,
        u.email,
        prop.title as property_title,
        prop.address as property_address
      FROM payments p
      JOIN users u ON p.tenant_id = u.id
      JOIN properties prop ON p.property_id = prop.id
      WHERE p.landlord_id = ?
    `
    const queryParams: any[] = [session.userId]

    if (propertyId) {
      transactionsQuery += ` AND p.property_id = ?`
      queryParams.push(propertyId)
    }

    if (status) {
      transactionsQuery += ` AND p.status = ?`
      queryParams.push(status)
    }

    transactionsQuery += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`
    queryParams.push(limit, offset)

    const transactions = await query<{
      id: string
      amount: number
      currency: string
      status: string
      payment_type: string
      payment_method: string
      payment_reference: string
      due_date: string
      paid_date: string
      created_at: string
      first_name: string
      last_name: string
      email: string
      property_title: string
      property_address: string
    }>(transactionsQuery, queryParams)

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM payments p
      WHERE p.landlord_id = ?
    `
    const countParams: any[] = [session.userId]

    if (propertyId) {
      countQuery += ` AND p.property_id = ?`
      countParams.push(propertyId)
    }

    if (status) {
      countQuery += ` AND p.status = ?`
      countParams.push(status)
    }

    const countResult = await query<{ total: number }>(countQuery, countParams)
    const total = countResult[0]?.total || 0

    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      amount: t.amount,
      currency: t.currency || "TZS",
      status: t.status,
      paymentType: t.payment_type,
      paymentMethod: t.payment_method,
      reference: t.payment_reference,
      dueDate: t.due_date,
      paidDate: t.paid_date,
      createdAt: t.created_at,
      tenant: {
        name: `${t.first_name} ${t.last_name}`,
        email: t.email,
      },
      property: {
        title: t.property_title,
        address: t.property_address,
      },
    }))

    return NextResponse.json({
      success: true,
      transactions: formattedTransactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
