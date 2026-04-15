import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { queryOne } from "@/lib/db/mysql"

interface UserVerification {
  is_verified: boolean
  role: string
  verification_status: string | null
  nin_verified: boolean | null
  bvn_verified: boolean | null
  id_verified: boolean | null
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Fetch verification status from database
    const userData = await queryOne<UserVerification>(
      `SELECT u.is_verified, u.role, 
              v.verification_status, v.nin_verified, v.bvn_verified, v.id_verified
       FROM users u
       LEFT JOIN verifications v ON u.id = v.user_id
       WHERE u.id = ?`,
      [session.userId]
    )

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      is_verified: userData.is_verified,
      role: userData.role,
      verification: {
        status: userData.verification_status || "pending",
        nin_verified: userData.nin_verified || false,
        bvn_verified: userData.bvn_verified || false,
        id_verified: userData.id_verified || false,
      },
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ message: "Failed to check status" }, { status: 500 })
  }
}
