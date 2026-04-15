import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { queryOne, query } from "@/lib/db/mysql"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Fetch TrustScore from database (fallback to 0 when missing)
    const trustScore = await queryOne(
      `SELECT total_score AS score FROM credit_scores WHERE user_id = ?`,
      [session.userId]
    )

    // Fetch payment history with schema-tolerant PSP mapping.
    // Different environments may use payment_gateway, provider, or neither.
    let paymentHistory: any[] = []
    const paymentHistoryQueries = [
      `SELECT id, payment_period_start AS month, amount, status, paid_date AS date, landlord_id, payment_method, payment_gateway AS psp, property_id FROM payments WHERE tenant_id = ? ORDER BY paid_date DESC`,
      `SELECT id, payment_period_start AS month, amount, status, paid_date AS date, landlord_id, payment_method, provider AS psp, property_id FROM payments WHERE tenant_id = ? ORDER BY paid_date DESC`,
      `SELECT id, payment_period_start AS month, amount, status, paid_date AS date, landlord_id, payment_method, NULL AS psp, property_id FROM payments WHERE tenant_id = ? ORDER BY paid_date DESC`,
    ]

    for (const sql of paymentHistoryQueries) {
      try {
        paymentHistory = await query(sql, [session.userId])
        break
      } catch (err: any) {
        if (err?.code !== "ER_BAD_FIELD_ERROR") {
          throw err
        }
      }
    }

    // --- Behavior signals ---
    const totalPayments = paymentHistory.length
    const verifiedPayments = paymentHistory.filter(p => p.status === 'completed').length
    const onTimePayments = paymentHistory.filter(p => p.status === 'completed').length
    const onTimeRate = totalPayments > 0 ? Math.round((onTimePayments / totalPayments) * 100) : 0

    // Arrears severity: count overdue payments
    const arrearsPayments = paymentHistory.filter(p => p.status === 'overdue')
    const arrearsSeverity = arrearsPayments.length

    // Continuity: months with at least one payment
    const monthsSet = new Set(paymentHistory.map(p => p.month && p.month.toISOString ? p.month.toISOString().slice(0,7) : p.month))
    const monthsObserved = monthsSet.size

    // Landlord reliability: count unique landlords
    const uniqueLandlords = new Set(paymentHistory.map(p => p.landlord_id)).size

    // Dispute outcomes: count payments with status 'disputed' or similar
    const disputePayments = paymentHistory.filter(p => p.status === 'disputed').length

    // --- Evidence quality (confidence band) ---
    // PSP-matched: count payments with payment_method or psp indicating PSP
    const pspPayments = paymentHistory.filter(p => (p.psp && p.psp !== 'Manual' && p.psp !== 'Cash') || (p.payment_method && p.payment_method !== 'Manual' && p.payment_method !== 'Cash')).length

    // Property/landlord transitions: count unique property_id and landlord_id
    const uniqueProperties = new Set(paymentHistory.map(p => p.property_id)).size
    const propertyTransitions = uniqueProperties

    // Recent activity freshness: days since last payment
    let recentActivityDays = null
    if (paymentHistory.length > 0 && paymentHistory[0].date) {
      const lastPaymentDate = new Date(paymentHistory[0].date)
      const now = new Date()
      recentActivityDays = Math.floor((now.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24))
    }

    // Data provenance: true if all payments are PSP-verified
    const allPSP = totalPayments > 0 && pspPayments === totalPayments

    // Confidence band: Low/Medium/High
    let confidence = 'Low'
    if (monthsObserved >= 12 && verifiedPayments >= 12 && allPSP) confidence = 'High'
    else if (monthsObserved >= 6 && verifiedPayments >= 6) confidence = 'Medium'

    const trustScoreValue = Number(trustScore?.score ?? 0)

    // Compose the two-layer TrustScore object
    const trustScoreObject = {
      score: {
        value: totalPayments === 0 ? 0 : trustScoreValue,
        onTimeRate,
        arrearsSeverity,
        continuity: monthsObserved,
        landlordReliability: uniqueLandlords,
        disputeOutcomes: disputePayments,
      },
      confidence: {
        band: confidence,
        monthsObserved,
        verifiedPayments,
        pspMatched: pspPayments,
        propertyTransitions,
        recentActivityDays,
        dataProvenance: allPSP ? 'PSP-verified' : 'Mixed',
      },
      paymentHistory,
    }

    return NextResponse.json({ trustScore: trustScoreObject })
  } catch (error) {
    console.error("Credit report error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}