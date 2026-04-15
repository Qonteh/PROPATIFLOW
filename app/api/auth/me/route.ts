import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query } from "@/lib/db/neon"

interface DBUser {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  role: "tenant" | "landlord" | "agent"
  is_verified: boolean
  is_active: boolean
  avatar_url: string | null
  date_of_birth: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  created_at: string
  last_login: string | null
}

interface Verification {
  verification_status: string
  nin_verified: boolean
  bvn_verified: boolean
  id_verified: boolean
}

interface TenantProfile {
  employer_name: string | null
  employment_status: string | null
  job_title: string | null
  annual_income: number | null
  income_verified: boolean
}

interface CreditScore {
  total_score: number
  score_rating: string
  payment_history_score: number
  credit_utilization_score: number
  credit_history_length_score: number
  credit_mix_score: number
  new_inquiries_score: number
}

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Get user from Neon
    const userResult = await query(
      `SELECT "id", "email", "first_name", "last_name", "phone", "role", "is_verified", "is_active", 
              "avatar_url", "date_of_birth", "address", "city", "state", "country", "created_at", "last_login"
       FROM "users" WHERE "id" = $1 LIMIT 1`,
      [session.userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const user = userResult.rows[0] as DBUser

    if (!user.is_active) {
      return NextResponse.json({ message: "Account deactivated" }, { status: 403 })
    }

    // Get verification status
    const verificationResult = await query(
      `SELECT "verification_status", "nin_verified", "bvn_verified", "id_verified"
       FROM "verifications" WHERE "user_id" = $1 LIMIT 1`,
      [user.id]
    )

    // Build response
    const response: any = {
      id: user.id,
      email: user.email,
      full_name: `${user.first_name} ${user.last_name}`.trim(),
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone,
      role: user.role,
      is_verified: user.is_verified,
      is_active: user.is_active,
      avatar_url: user.avatar_url,
      date_of_birth: user.date_of_birth,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      created_at: user.created_at,
      last_login: user.last_login,
      verification: verificationResult.rows.length > 0
        ? {
            status: verification.verification_status,
            nin_verified: verification.nin_verified,
            bvn_verified: verification.bvn_verified,
            id_verified: verification.id_verified,
          }
        : null,
    }

    // If tenant, get additional profile info
    if (user.role === "tenant") {
      const profile = await queryOne<TenantProfile>(
        `SELECT employer_name, employment_status, job_title, annual_income, income_verified
         FROM tenant_profiles WHERE user_id = ?`,
        [user.id]
      )

      const creditScore = await queryOne<CreditScore>(
        `SELECT total_score, score_rating, payment_history_score, credit_utilization_score, 
                credit_history_length_score, credit_mix_score, new_inquiries_score
         FROM credit_scores WHERE user_id = ?`,
        [user.id]
      )

      if (profile) {
        response.tenant_profile = {
          employer_name: profile.employer_name,
          employment_status: profile.employment_status,
          job_title: profile.job_title,
          annual_income: profile.annual_income,
          income_verified: profile.income_verified,
        }
      }

      if (creditScore) {
        response.credit_score = {
          total_score: creditScore.total_score,
          rating: creditScore.score_rating,
          payment_history_score: creditScore.payment_history_score,
          credit_utilization_score: creditScore.credit_utilization_score,
          credit_history_length_score: creditScore.credit_history_length_score,
          credit_mix_score: creditScore.credit_mix_score,
          new_inquiries_score: creditScore.new_inquiries_score,
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: response,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
