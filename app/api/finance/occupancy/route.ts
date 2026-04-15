import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - Occupancy Trend
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }
    // Query occupancy rate by month
    const results = await query<{
      month: string
      rate: number
    }>(
      `SELECT DATE_FORMAT(start_date, '%b') as month, ROUND(COUNT(*) / (SELECT COUNT(*) FROM properties WHERE landlord_id = ?) * 100) as rate FROM leases WHERE landlord_id = ? AND status = 'active' GROUP BY month ORDER BY start_date`,
      [session.userId, session.userId]
    )
    return NextResponse.json({ success: true, trend: results })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch occupancy trend" }, { status: 500 })
  }
}
