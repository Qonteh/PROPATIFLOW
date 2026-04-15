// POST - Add Expense
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    const body = await request.json();
    const { category, amount, created_at, notes, property_id } = body;
    if (!category || !amount || isNaN(amount) || !property_id) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    await query(
      `INSERT INTO expenses (landlord_id, category, amount, created_at, notes, property_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [session.userId, category, amount, created_at || new Date(), notes || null, property_id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add expense" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - Expense Breakdown
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }
    // Query all expenses for landlord
    const allExpenses = await query<{
      id: number,
      category: string,
      amount: number,
      created_at: string,
      notes?: string,
      property_id?: string,
      property_title?: string
    }>(
      `SELECT e.id, e.category, e.amount, e.created_at, e.notes, e.property_id, p.title as property_title
       FROM expenses e
       LEFT JOIN properties p ON e.property_id = p.id
       WHERE e.landlord_id = ?
       ORDER BY e.created_at DESC`,
      [session.userId]
    )
    // Group for pie chart
    const colorMap: Record<string, string> = {
      Maintenance: "hsl(199, 89%, 38%)",
      Management: "hsl(168, 71%, 39%)",
      Insurance: "hsl(38, 92%, 50%)",
      Utilities: "hsl(25, 95%, 53%)",
      Taxes: "hsl(262, 52%, 47%)",
    }
    const breakdownMap: Record<string, { value: number; color: string }> = {}
    for (const exp of allExpenses) {
      if (!breakdownMap[exp.category]) {
        breakdownMap[exp.category] = {
          value: 0,
          color: colorMap[exp.category] || "hsl(var(--muted-foreground))"
        }
      }
      breakdownMap[exp.category].value += exp.amount
    }
    const breakdown = Object.entries(breakdownMap).map(([name, { value, color }]) => ({ name, value, color }))

    // Calculate monthly total
    const now = new Date()
    const thisMonth = now.getMonth() + 1
    const thisYear = now.getFullYear()
    const monthlyTotal = allExpenses
      .filter(exp => {
        const dt = new Date(exp.created_at)
        return dt.getMonth() + 1 === thisMonth && dt.getFullYear() === thisYear
      })
      .reduce((sum, exp) => sum + exp.amount, 0)

    return NextResponse.json({ success: true, breakdown, expenses: allExpenses, monthlyTotal })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}
