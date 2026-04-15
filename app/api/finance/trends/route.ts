import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - Financial Trends (Charts data)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const scope = searchParams.get("scope") || "portfolio"
    const propertyId = searchParams.get("propertyId")
    const interval = searchParams.get("interval") || "month"

    // Get payment status breakdown
    const statusQuery = `
      SELECT 
        p.status,
        COUNT(*) as count,
        COALESCE(SUM(p.amount), 0) as total
      FROM payments p
      WHERE p.landlord_id = ?
      ${scope === "property" && propertyId ? `AND p.property_id = ?` : ""}
      GROUP BY p.status
    `
    const statusParams: any[] = [session.userId]
    if (scope === "property" && propertyId) {
      statusParams.push(propertyId)
    }

    const statusResults = await query<{ status: string; count: number; total: number }>(statusQuery, statusParams)

    // Calculate payment status distribution
    const paymentStatus = {
      onTime: 0,
      late: 0,
      partial: 0,
      unpaid: 0,
    }

    const totalPayments = statusResults.reduce((sum, row) => sum + row.count, 0);
    for (const row of statusResults) {
      if (row.status === "completed") {
        paymentStatus.onTime += row.count;
      } else if (row.status === "late") {
        paymentStatus.late += row.count;
      } else if (row.status === "partial") {
        paymentStatus.partial += row.count;
      } else if (row.status === "pending" || row.status === "overdue") {
        paymentStatus.unpaid += row.count;
      }
    }
    // Convert counts to percentages for graph
    if (totalPayments > 0) {
      paymentStatus.onTime = Math.round((paymentStatus.onTime / totalPayments) * 100);
      paymentStatus.late = Math.round((paymentStatus.late / totalPayments) * 100);
      paymentStatus.partial = Math.round((paymentStatus.partial / totalPayments) * 100);
      paymentStatus.unpaid = Math.round((paymentStatus.unpaid / totalPayments) * 100);
    }

    // Generate cash flow data for last 6 months, only up to current month
    const cashflow: { period: string; revenue: number; expense: number }[] = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      // Only include months <= current month/year
      if (
        monthDate.getFullYear() > currentYear ||
        (monthDate.getFullYear() === currentYear && monthDate.getMonth() > currentMonth)
      ) {
        continue;
      }
      const monthName = monthDate.toLocaleString("default", { month: "long", year: "numeric" });
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString().split("T")[0];
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).toISOString().split("T")[0];
      // Revenue (payments)
      const revenueQuery = `
        SELECT COALESCE(SUM(amount), 0) as revenue
        FROM payments
        WHERE landlord_id = ? AND status = 'completed'
          AND paid_date >= ? AND paid_date <= ?
        ${scope === "property" && propertyId ? `AND property_id = ?` : ""}
      `;
      const revenueParams: any[] = [session.userId, monthStart, monthEnd];
      if (scope === "property" && propertyId) {
        revenueParams.push(propertyId);
      }
      const revenueResult = await query<{ revenue: number }>(revenueQuery, revenueParams);
      // Expenses (from expenses table)
      const expenseQuery = `
        SELECT COALESCE(SUM(amount), 0) as expense
        FROM expenses
        WHERE landlord_id = ?
          AND created_at >= ? AND created_at <= ?
        ${scope === "property" && propertyId ? `AND property_id = ?` : ""}
      `;
      const expenseParams: any[] = [session.userId, monthStart, monthEnd];
      if (scope === "property" && propertyId) {
        expenseParams.push(propertyId);
      }
      const expenseResult = await query<{ expense: number }>(expenseQuery, expenseParams);
      cashflow.push({
        period: monthName,
        revenue: revenueResult[0]?.revenue || 0,
        expense: expenseResult[0]?.expense || 0,
      });
    }

    return NextResponse.json({
      success: true,
      trends: {
        cashflow,
        paymentStatus,
      },
    })
  } catch (error) {
    console.error("Error fetching financial trends:", error)
    return NextResponse.json({ error: "Failed to fetch financial trends" }, { status: 500 })
  }
}
