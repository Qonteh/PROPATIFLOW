import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/mysql"

export async function GET() {
	try {
		const session = await getSession()
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		if (session.role !== "tenant") {
			return NextResponse.json({ error: "Access denied" }, { status: 403 })
		}

		const applicationsResult = (await query(
			"SELECT COUNT(*) as count FROM applications WHERE tenant_id = ?",
			[session.userId]
		)) as any[]

		const activeLeaseResult = (await query(
			`SELECT l.*, p.title, p.address, p.rent_amount, u.first_name as landlord_first, u.last_name as landlord_last
			 FROM leases l
			 JOIN properties p ON l.property_id = p.id
			 JOIN users u ON l.landlord_id = u.id
			 WHERE l.tenant_id = ? AND l.status = 'active'
			 LIMIT 1`,
			[session.userId]
		)) as any[]

		const paymentsResult = (await query(
			`SELECT pay.*
			 FROM payments pay
			 WHERE pay.tenant_id = ?
			 ORDER BY pay.due_date DESC
			 LIMIT 5`,
			[session.userId]
		)) as any[]

		const verificationResult = (await query(
			"SELECT * FROM verifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
			[session.userId]
		)) as any[]

		return NextResponse.json({
			stats: {
				totalApplications: applicationsResult[0]?.count || 0,
				hasActiveLease: activeLeaseResult.length > 0,
				isVerified: verificationResult[0]?.verification_status === "verified",
			},
			activeLease: activeLeaseResult[0]
				? {
						id: activeLeaseResult[0].id,
						propertyTitle: activeLeaseResult[0].title,
						propertyAddress: activeLeaseResult[0].address,
						rentAmount: activeLeaseResult[0].rent_amount,
						leaseStart: activeLeaseResult[0].start_date,
						leaseEnd: activeLeaseResult[0].end_date,
						landlordName: `${activeLeaseResult[0].landlord_first} ${activeLeaseResult[0].landlord_last}`,
					}
				: null,
			recentPayments: paymentsResult.map((p: any) => ({
				id: p.id,
				amount: p.amount,
				status: p.status,
				dueDate: p.due_date,
				paymentDate: p.paid_date,
			})),
			verification: verificationResult[0] || null,
		})
	} catch (error) {
		console.error("Error fetching tenant dashboard:", error)
		return NextResponse.json({ error: "Failed to fetch tenant dashboard" }, { status: 500 })
	}
}
