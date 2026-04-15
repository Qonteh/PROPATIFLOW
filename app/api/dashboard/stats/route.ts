import { NextResponse } from "next/server"
import { query } from "@/lib/db/mysql"
import { getSession } from "@/lib/auth/session"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }


    if (session.role === "landlord") {
      // Get landlord name
      const landlordResult = await query(
        "SELECT first_name, last_name FROM users WHERE id = ?",
        [session.userId]
      ) as any[]
      const landlordFirstName = landlordResult[0]?.first_name || null;
      const landlordLastName = landlordResult[0]?.last_name || null;

      // Get landlord stats - count ALL properties for this landlord
      const propertiesResult = await query(
        "SELECT COUNT(*) as count FROM properties WHERE landlord_id = ?",
        [session.userId]
      ) as any[]

      // Count occupied units as number of active leases for this landlord
      const occupiedUnitsResult = await query(
        `SELECT COUNT(*) as count FROM leases WHERE landlord_id = ? AND status = 'active'`,
        [session.userId]
      ) as any[]

      // For compatibility, totalUnits = totalProperties
      const totalUnits = propertiesResult[0]?.count || 0;
      const occupiedUnits = occupiedUnitsResult[0]?.count || 0;

      // Count tenants from active leases for this landlord
      const tenantsResult = await query(
        `SELECT COUNT(DISTINCT l.tenant_id) as count 
         FROM leases l 
         WHERE l.landlord_id = ? AND l.status = 'active'`,
        [session.userId]
      ) as any[]

      // Count pending applications
      const applicationsResult = await query(
        `SELECT COUNT(*) as count 
         FROM applications a 
         WHERE a.landlord_id = ? AND a.status = 'pending'`,
        [session.userId]
      ) as any[]

      // Calculate monthly income from completed payments
      const incomeResult = await query(
        `SELECT COALESCE(SUM(amount), 0) as total 
         FROM payments pay 
         WHERE pay.landlord_id = ? AND pay.status = 'completed' 
         AND EXTRACT(MONTH FROM pay.paid_date) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(YEAR FROM pay.paid_date) = EXTRACT(YEAR FROM CURRENT_DATE)`,
        [session.userId]
      ) as any[]

      // Also calculate expected monthly income from active leases
      const expectedIncomeResult = await query(
        `SELECT COALESCE(SUM(rent_amount), 0) as total 
         FROM leases 
         WHERE landlord_id = ? AND status = 'active'`,
        [session.userId]
      ) as any[]

      // Get recent applications
      const recentApplications = await query(
        `SELECT a.*, u.first_name, u.last_name, u.email, p.title as property_title
         FROM applications a
         JOIN users u ON a.tenant_id = u.id
         JOIN properties p ON a.property_id = p.id
         WHERE a.landlord_id = ?
         ORDER BY a.created_at DESC
         LIMIT 5`,
        [session.userId]
      ) as any[]

      // Get recent payments
      const recentPayments = await query(
        `SELECT pay.*, u.first_name, u.last_name, p.title as property_title
         FROM payments pay
         JOIN users u ON pay.tenant_id = u.id
         JOIN properties p ON pay.property_id = p.id
         WHERE pay.landlord_id = ?
         ORDER BY pay.created_at DESC
         LIMIT 5`,
        [session.userId]
      ) as any[]

      // Use expected income if no actual payments yet
      const monthlyIncome = incomeResult[0]?.total > 0 
        ? incomeResult[0].total 
        : expectedIncomeResult[0]?.total || 0

      return NextResponse.json({
        stats: {
          totalProperties: propertiesResult[0]?.count || 0,
          totalUnits,
          occupiedUnits,
          totalTenants: tenantsResult[0]?.count || 0,
          pendingApplications: applicationsResult[0]?.count || 0,
          monthlyIncome: monthlyIncome,
          first_name: landlordFirstName,
          last_name: landlordLastName
        },
        recentApplications: recentApplications.map((a: any) => ({
          id: a.id,
          tenantName: `${a.first_name} ${a.last_name}`,
          tenantEmail: a.email,
          propertyTitle: a.property_title,
          status: a.status,
          createdAt: a.created_at
        })),
        recentPayments: recentPayments.map((p: any) => ({
          id: p.id,
          tenantName: `${p.first_name} ${p.last_name}`,
          propertyTitle: p.property_title,
          amount: p.amount,
          status: p.status,
          paymentDate: p.paid_date
        }))
      })
    } else {
      // Tenant stats
      const applicationsResult = await query(
        "SELECT COUNT(*) as count FROM applications WHERE tenant_id = ?",
        [session.userId]
      ) as any[]

      const activeLeaseResult = await query(
        `SELECT l.*, p.title, p.address, p.rent_amount, u.first_name as landlord_first, u.last_name as landlord_last
         FROM leases l
         JOIN properties p ON l.property_id = p.id
         JOIN users u ON l.landlord_id = u.id
         WHERE l.tenant_id = ? AND l.status = 'active'
         LIMIT 1`,
        [session.userId]
      ) as any[]

      const paymentsResult = await query(
        `SELECT pay.*
         FROM payments pay
         WHERE pay.tenant_id = ?
         ORDER BY pay.due_date DESC
         LIMIT 5`,
        [session.userId]
      ) as any[]

      const verificationResult = await query(
        "SELECT * FROM verifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [session.userId]
      ) as any[]

      return NextResponse.json({
        stats: {
          totalApplications: applicationsResult[0]?.count || 0,
          hasActiveLease: activeLeaseResult.length > 0,
          isVerified: verificationResult[0]?.verification_status === 'verified'
        },
        activeLease: activeLeaseResult[0] ? {
          id: activeLeaseResult[0].id,
          propertyTitle: activeLeaseResult[0].title,
          propertyAddress: activeLeaseResult[0].address,
          rentAmount: activeLeaseResult[0].rent_amount,
          leaseStart: activeLeaseResult[0].start_date,
          leaseEnd: activeLeaseResult[0].end_date,
          landlordName: `${activeLeaseResult[0].landlord_first} ${activeLeaseResult[0].landlord_last}`
        } : null,
        recentPayments: paymentsResult.map((p: any) => ({
          id: p.id,
          amount: p.amount,
          status: p.status,
          dueDate: p.due_date,
          paymentDate: p.paid_date
        })),
        verification: verificationResult[0] || null
      })
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
