import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - Reconciliation Stats
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }
    // Query reconciliation stats
    const stats = await query<{
      automatched: number | null
      manualreview: number | null
      unmatched: number | null
      totalprocessed: number | null
    }>(
      `SELECT 
         SUM(CASE WHEN match_type = 'auto' THEN 1 ELSE 0 END) as automatched,
         SUM(CASE WHEN match_type = 'manual' THEN 1 ELSE 0 END) as manualreview,
         SUM(CASE WHEN match_type = 'unmatched' THEN 1 ELSE 0 END) as unmatched,
         COUNT(*) as totalprocessed
       FROM reconciliations
       WHERE landlord_id = ?`,
      [session.userId]
    )

    const row = stats[0] || {
      automatched: 0,
      manualreview: 0,
      unmatched: 0,
      totalprocessed: 0,
    }

    return NextResponse.json({
      success: true,
      stats: {
        autoMatched: Number(row.automatched || 0),
        manualReview: Number(row.manualreview || 0),
        unmatched: Number(row.unmatched || 0),
        totalProcessed: Number(row.totalprocessed || 0),
      },
    })
  } catch (error) {
    if ((error as any)?.code === "42P01") {
      return NextResponse.json({
        success: true,
        stats: {
          autoMatched: 0,
          manualReview: 0,
          unmatched: 0,
          totalProcessed: 0,
        },
      })
    }
    return NextResponse.json({ error: "Failed to fetch reconciliation stats" }, { status: 500 })
  }
}
