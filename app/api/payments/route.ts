import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query, queryOne, generateUUID } from "@/lib/db/mysql"

interface DBPayment {
  id: string
  lease_id: string
  tenant_id: string
  landlord_id: string
  property_id: string
  payment_type: string
  amount: number
  currency: string
  status: string
  payment_method: string
  payment_reference: string | null
  transaction_id: string | null
  due_date: string | null
  paid_date: string | null
  payment_period_start: string | null
  payment_period_end: string | null
  late_fee_applied: number
  notes: string | null
  created_at: string
  property_title?: string
  property_address?: string
  tenant_name?: string
  landlord_name?: string
}

// GET - Fetch payments
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    let payments: DBPayment[] = []

    if (session.role === "tenant") {
      // Tenants see their payments
      payments = await query<DBPayment>(
        `SELECT pay.*, 
                p.title as property_title, 
                p.address as property_address,
                CONCAT(ll.first_name, ' ', ll.last_name) as landlord_name
         FROM payments pay
         JOIN properties p ON pay.property_id = p.id
         JOIN users ll ON pay.landlord_id = ll.id
         WHERE pay.tenant_id = ?
         ORDER BY pay.created_at DESC`,
        [session.userId]
      )
    } else if (session.role === "landlord") {
      // Landlords see payments to their properties
      payments = await query<DBPayment>(
        `SELECT pay.*, 
                p.title as property_title, 
                p.address as property_address,
                CONCAT(t.first_name, ' ', t.last_name) as tenant_name
         FROM payments pay
         JOIN properties p ON pay.property_id = p.id
         JOIN users t ON pay.tenant_id = t.id
         WHERE pay.landlord_id = ?
         ORDER BY pay.created_at DESC`,
        [session.userId]
      )
    }

    // Calculate summary
    const totalReceived = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + parseFloat(p.amount as any), 0)
    
    const totalPending = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + parseFloat(p.amount as any), 0)

    return NextResponse.json({
      success: true,
      payments,
      summary: {
        total_received: totalReceived,
        total_pending: totalPending,
        total_transactions: payments.length,
      },
    })
  } catch (error) {
    console.error("Payments fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create payment (for tenant making payment)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "tenant") {
      return NextResponse.json({ error: "Only tenants can make payments" }, { status: 403 })
    }

    const data = await request.json()

    if (!data.lease_id || !data.amount || !data.payment_type || !data.payment_method) {
      return NextResponse.json(
        { error: "Lease ID, amount, payment type, and payment method are required" },
        { status: 400 }
      )
    }

    // Get lease details
    const lease = await queryOne<{
      id: string
      tenant_id: string
      landlord_id: string
      property_id: string
      status: string
    }>(
      "SELECT id, tenant_id, landlord_id, property_id, status FROM leases WHERE id = ?",
      [data.lease_id]
    )

    if (!lease) {
      return NextResponse.json({ error: "Lease not found" }, { status: 404 })
    }

    if (lease.tenant_id !== session.userId) {
      return NextResponse.json({ error: "This is not your lease" }, { status: 403 })
    }

    if (lease.status !== "active") {
      return NextResponse.json({ error: "Lease is not active" }, { status: 400 })
    }

    const paymentId = generateUUID()
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    await query(
      `INSERT INTO payments (
        id, lease_id, tenant_id, landlord_id, property_id, payment_type, amount, currency,
        status, payment_method, payment_reference, due_date, payment_period_start,
        payment_period_end, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        paymentId,
        data.lease_id,
        session.userId,
        lease.landlord_id,
        lease.property_id,
        data.payment_type,
        data.amount,
        data.currency || "NGN",
        data.payment_method,
        paymentReference,
        data.due_date || null,
        data.payment_period_start || null,
        data.payment_period_end || null,
        data.notes || null,
      ]
    )

    // In real app, integrate with Paystack/Flutterwave here
    // For now, return payment reference for processing

    // Notify landlord (payment received)
    await query(
      `INSERT INTO notifications (id, user_id, type, title, content, link, created_at)
       VALUES (?, ?, 'payment', ?, ?, '/landlord/payments', NOW())`,
      [generateUUID(), lease.landlord_id, 'Payment Received', `A payment of ${data.amount} ${data.currency || 'NGN'} was made for your property.`, null]
    )
    // Notify tenant (payment successful)
    await query(
      `INSERT INTO notifications (id, user_id, type, title, content, link, created_at)
       VALUES (?, ?, 'payment', ?, ?, '/tenant/payments', NOW())`,
      [generateUUID(), session.userId, 'Payment Successful', `Your payment of ${data.amount} ${data.currency || 'NGN'} was received.`, null]
    )

    return NextResponse.json({
      success: true,
      message: "Payment initiated",
      payment: {
        id: paymentId,
        reference: paymentReference,
        amount: data.amount,
        currency: data.currency || "NGN",
      },
    }, { status: 201 })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
