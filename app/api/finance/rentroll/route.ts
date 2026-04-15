import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"
import { Buffer } from "buffer"
const { jsPDF } = require("jspdf")

// POST - Generate Rent Roll PDF
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Fetch rent roll data (tenants, properties, rent, arrears)
    const tenantsQuery = `
      SELECT 
        u.first_name, u.last_name, u.email, u.phone,
        l.rent_amount, l.start_date, l.end_date, l.status as lease_status,
        p.title as property_title, p.address as property_address,
        (SELECT COALESCE(SUM(pay.amount), 0) FROM payments pay WHERE pay.tenant_id = u.id AND pay.landlord_id = ? AND pay.status = 'completed') as total_paid,
        (SELECT COALESCE(SUM(pay.amount), 0) FROM payments pay WHERE pay.tenant_id = u.id AND pay.landlord_id = ? AND pay.status IN ('pending', 'overdue')) as outstanding
      FROM leases l
      JOIN users u ON l.tenant_id = u.id
      JOIN properties p ON l.property_id = p.id
      WHERE l.landlord_id = ?
      ORDER BY u.last_name, u.first_name
    `
    const tenants = await query(tenantsQuery, [session.userId, session.userId, session.userId])

    // Generate PDF
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Rent Roll Report", 10, 15)
    doc.setFontSize(10)
    let y = 25
      if (tenants.length === 0) {
        doc.text("No tenants found for rent roll.", 10, y)
      } else {
        tenants.forEach((t: any, i: number) => {
      doc.text(
        `${i + 1}. ${t.first_name} ${t.last_name} | ${t.property_title} | Rent: ${t.rent_amount} | Paid: ${t.total_paid} | Outstanding: ${t.outstanding}`,
        10,
        y
      )
      y += 7
      if (y > 270) {
        doc.addPage()
        y = 15
      }
    })
      }
    // Output as Uint8Array for binary response
    const pdfUint8 = doc.output("uint8array")
    if (!pdfUint8) {
      return NextResponse.json({ error: "PDF generation failed" }, { status: 500 })
    }
    return new NextResponse(Buffer.from(pdfUint8), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=rent-roll.pdf`,
      },
    })
  } catch (error) {
    console.error("Rent roll PDF error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
