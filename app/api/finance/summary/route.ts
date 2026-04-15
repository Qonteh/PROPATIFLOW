import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

// GET - Financial Summary KPIs
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
    const startDate = searchParams.get("startDate") || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    const endDate = searchParams.get("endDate") || new Date().toISOString().split('T')[0]

    // Get total rent due (from active leases)
    let rentDueQuery = `
      SELECT COALESCE(SUM(l.rent_amount), 0) as total_due
      FROM leases l
      WHERE l.landlord_id = ? AND l.status = 'active'
    `
    const rentDueParams: any[] = [session.userId]

    if (scope === "property" && propertyId) {
      rentDueQuery += ` AND l.property_id = ?`
      rentDueParams.push(propertyId)
    }

    const rentDueResult = await query<{ total_due: number }>(rentDueQuery, rentDueParams)
    const totalRentDue = rentDueResult[0]?.total_due || 0

    // Get cash collected (completed payments in period)
    let cashCollectedQuery = `
      SELECT COALESCE(SUM(p.amount), 0) as total_collected
      FROM payments p
      WHERE p.landlord_id = ? AND p.status = 'completed'
    `
    const cashCollectedParams: any[] = [session.userId]

    if (scope === "property" && propertyId) {
      cashCollectedQuery += ` AND p.property_id = ?`
      cashCollectedParams.push(propertyId)
    }

    const cashCollectedResult = await query<{ total_collected: number }>(cashCollectedQuery, cashCollectedParams)
    const cashCollected = cashCollectedResult[0]?.total_collected || 0

    // Calculate collection rate
    const collectionRate = totalRentDue > 0 ? (cashCollected / totalRentDue) * 100 : 0

    // Get arrears (unpaid/pending payments)
    let arrearsQuery = `
      SELECT COALESCE(SUM(p.amount), 0) as total_arrears
      FROM payments p
      WHERE p.landlord_id = ? AND p.status IN ('pending', 'overdue')
    `
    const arrearsParams: any[] = [session.userId]

    if (scope === "property" && propertyId) {
      arrearsQuery += ` AND p.property_id = ?`
      arrearsParams.push(propertyId)
    }

    const arrearsResult = await query<{ total_arrears: number }>(arrearsQuery, arrearsParams)
    
    // Calculate arrears from rent due - cash collected
    const totalArrears = Math.max(0, totalRentDue - cashCollected)

    // Get total properties and occupied count
    let propertiesQuery = `
      SELECT COUNT(*) as total
      FROM properties
      WHERE landlord_id = ?
    `
    const propertiesParams: any[] = [session.userId]

    if (scope === "property" && propertyId) {
      propertiesQuery = `SELECT 1 as total FROM properties WHERE id = ? AND landlord_id = ?`
      propertiesParams.unshift(propertyId)
    }

    const totalPropertiesResult = await query<{ total: number }>(propertiesQuery, propertiesParams)
    const totalProperties = totalPropertiesResult[0]?.total || 0

    // Get occupied units (properties with active leases)
    let occupiedQuery = `
      SELECT COUNT(DISTINCT l.property_id) as occupied
      FROM leases l
      JOIN properties p ON l.property_id = p.id
      WHERE l.landlord_id = ? AND l.status = 'active'
    `
    const occupiedParams: any[] = [session.userId]

    if (scope === "property" && propertyId) {
      occupiedQuery += ` AND l.property_id = ?`
      occupiedParams.push(propertyId)
    }

    const occupiedResult = await query<{ occupied: number }>(occupiedQuery, occupiedParams)
    const occupiedUnits = occupiedResult[0]?.occupied || 0

    // Calculate occupancy rate
    const occupancyRate = totalProperties > 0 ? (occupiedUnits / totalProperties) * 100 : 0

    // Get total tenants
    const tenantsResult = await query<{ count: number }>(
      `SELECT COUNT(DISTINCT l.tenant_id) as count FROM leases l WHERE l.landlord_id = ?`,
      [session.userId]
    )
    const totalTenants = tenantsResult[0]?.count || 0


    // Calculate total expenses for the period
    // Note: expenses table is optional; if missing, default to 0
    let totalExpenses = 0
    try {
      let expensesQuery = `
        SELECT COALESCE(SUM(e.amount), 0) as total_expenses
        FROM expenses e
        WHERE e.landlord_id = ? AND e.created_at >= ? AND e.created_at <= ?
      `
      const expensesParams: any[] = [session.userId, startDate, endDate]
      if (scope === "property" && propertyId) {
        expensesQuery += ` AND e.property_id = ?`
        expensesParams.push(propertyId)
      }
      const expensesResult = await query<{ total_expenses: number }>(expensesQuery, expensesParams)
      totalExpenses = expensesResult[0]?.total_expenses || 0
    } catch (err: any) {
      // Table might not exist; continue with 0 expenses
      if (err?.code !== "ER_NO_SUCH_TABLE") {
        throw err
      }
      totalExpenses = 0
    }

    // NOI = Cash Collected - Expenses
    const noi = cashCollected - totalExpenses

    return NextResponse.json({
      success: true,
      summary: {
        collectionRate: Math.round(collectionRate * 10) / 10,
        totalArrears,
        occupancyRate: Math.round(occupancyRate * 10) / 10,
        noi,
        cashCollected,
        totalExpenses,
        totalRentDue,
        totalProperties,
        occupiedUnits,
        totalTenants,
        currency: "TZS",
      },
      period: {
        startDate,
        endDate,
      },
    })
  } catch (error) {
    console.error("Error fetching financial summary:", error)
    return NextResponse.json({ error: "Failed to fetch financial summary" }, { status: 500 })
  }
}
