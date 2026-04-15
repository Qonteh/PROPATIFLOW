import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// POST - Send Arrears Reminders
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get all tenants with overdue payments
    const arrearsQuery = `
      SELECT u.email, u.first_name, u.last_name, p.amount, p.due_date, prop.title as property_title
      FROM payments p
      JOIN users u ON p.tenant_id = u.id
      JOIN properties prop ON p.property_id = prop.id
      WHERE p.landlord_id = ? AND p.status IN ('pending', 'overdue') AND p.due_date <= CURDATE()`
    const tenants = await query<any>(arrearsQuery, [session.userId])

    // Simulate sending reminders (replace with real email logic)
    let sent = 0
    for (const t of tenants) {
      // Here you would send an email/SMS
      sent++
    }
    return NextResponse.json({ success: true, sent, total: tenants.length })
  } catch (error) {
    console.error("Error sending arrears reminders:", error)
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 })
  }
}
