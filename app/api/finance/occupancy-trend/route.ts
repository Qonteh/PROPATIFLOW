import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - Occupancy Trend (alias for compatibility)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }
    // Query all months in the last 6 months (PostgreSQL)
    const monthsRes = await query<{ month_start: string; month: string }>(
      `SELECT DISTINCT
         DATE_TRUNC('month', start_date)::date as month_start,
         TO_CHAR(DATE_TRUNC('month', start_date), 'Mon') as month
       FROM leases
       WHERE landlord_id = ?
         AND status = 'active'
         AND start_date >= (CURRENT_DATE - INTERVAL '6 months')
       ORDER BY month_start`,
      [session.userId]
    )

    // Get total properties for denominator
    const propRes = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM properties WHERE landlord_id = ?',
      [session.userId]
    )
    const totalProps = propRes[0]?.count || 1

    // For each month, count all leases active during that month
    const trend = []
    for (const m of monthsRes) {
      const monthStart = m.month_start
      const monthEnd = m.month_start
      const occRes = await query<{ count: number }>(
        `SELECT COUNT(*) as count
         FROM leases
         WHERE landlord_id = ?
           AND status = 'active'
           AND start_date <= (?::date + INTERVAL '1 month - 1 day')
           AND (end_date IS NULL OR end_date >= ?::date)`,
        [session.userId, monthEnd, monthStart]
      )
      const occCount = occRes[0]?.count || 0
      trend.push({ month: m.month, rate: Math.round((occCount / totalProps) * 100) })
    }
    return NextResponse.json({ success: true, trend })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch occupancy trend" }, { status: 500 })
  }
}
