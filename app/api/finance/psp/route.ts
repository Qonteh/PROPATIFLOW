import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - PSP Distribution
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }
    // Query payment provider distribution
    const pspResults = await query<{
      psp: string
      count: number
    }>(
      `SELECT psp, COUNT(*) as count FROM payments WHERE landlord_id = ? GROUP BY psp`,
      [session.userId]
    )
    // Map to chart format
    const colorMap: Record<string, string> = {
      ClickPesa: "hsl(199, 89%, 38%)",
      AzamPay: "hsl(168, 71%, 39%)",
      Selcom: "hsl(38, 92%, 50%)",
      Cash: "hsl(var(--muted-foreground))",
      Manual: "hsl(var(--muted-foreground))",
    }
    const total = pspResults.reduce((sum, p) => sum + p.count, 0)
    const distribution = pspResults.map(p => ({
      name: p.psp,
      value: total > 0 ? Math.round((p.count / total) * 100) : 0,
      color: colorMap[p.psp] || "hsl(var(--muted-foreground))"
    }))
    return NextResponse.json({ success: true, distribution })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch PSP distribution" }, { status: 500 })
  }
}
