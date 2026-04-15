import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - EFD Summary
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }
    // Query EFD summary
    const summary = await query<{
      issued: number | null
      pending: number | null
      failed: number | null
      total: number | null
    }>(
      `SELECT
         SUM(CASE WHEN status = 'issued' THEN 1 ELSE 0 END) as issued,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
         SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
         COUNT(*) as total
       FROM efd_receipts
       WHERE landlord_id = ?`,
      [session.userId]
    )

    const row = summary[0] || { issued: 0, pending: 0, failed: 0, total: 0 }
    return NextResponse.json({
      success: true,
      summary: {
        issued: Number(row.issued || 0),
        pending: Number(row.pending || 0),
        failed: Number(row.failed || 0),
        total: Number(row.total || 0),
      },
    })
  } catch (error) {
    if ((error as any)?.code === "42P01") {
      return NextResponse.json({
        success: true,
        summary: {
          issued: 0,
          pending: 0,
          failed: 0,
          total: 0,
        },
      })
    }
    return NextResponse.json({ error: "Failed to fetch EFD summary" }, { status: 500 })
  }
}
