import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"
import * as XLSX from "xlsx"

// POST - Export P&L Excel
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Fetch P&L data (properties, rent, collected, outstanding)
    const propertiesQuery = `
      SELECT 
        p.title, p.address, p.rent_amount as expected_rent,
        (SELECT COALESCE(SUM(pay.amount), 0) FROM payments pay WHERE pay.property_id = p.id AND pay.status = 'completed') as collected,
        (SELECT COALESCE(SUM(pay.amount), 0) FROM payments pay WHERE pay.property_id = p.id AND pay.status IN ('pending', 'overdue')) as outstanding
      FROM properties p
      WHERE p.landlord_id = ?
      ORDER BY p.title
    `
    const properties = await query<any>(propertiesQuery, [session.userId])

    // Prepare worksheet data
    const wsData = [
      ["Property", "Address", "Expected Rent", "Collected", "Outstanding"]
    ]
    for (const p of properties) {
      wsData.push([
        p.title,
        p.address,
        p.expected_rent,
        p.collected,
        p.outstanding
      ])
    }

    // Generate Excel file
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, "P&L")
    const excelBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" })
    return new NextResponse(Buffer.from(excelBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=pl-report.xlsx`,
      },
    })
  } catch (error) {
    console.error("Error generating P&L Excel:", error)
    return NextResponse.json({ error: "Failed to generate Excel" }, { status: 500 })
  }
}
