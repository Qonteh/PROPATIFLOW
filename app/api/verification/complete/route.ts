import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { queryOne, execute, transaction } from "@/lib/db/mysql"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { ninNumber, ninData } = await request.json()

    if (!ninNumber || !ninData) {
      return NextResponse.json({ message: "Missing required data" }, { status: 400 })
    }

    // Check if NIN was verified
    const verification = await queryOne<{ nin_verified: boolean }>(
      "SELECT nin_verified FROM verifications WHERE user_id = ?",
      [session.userId]
    )

    if (!verification?.nin_verified) {
      return NextResponse.json(
        { message: "Please complete NIN verification first" },
        { status: 400 }
      )
    }

    // Complete verification - update both verifications and users tables
    await transaction(async (connection) => {
      // Update verifications table
      await connection.execute(
        `UPDATE verifications 
         SET verification_status = 'verified',
             updated_at = NOW()
         WHERE user_id = ?`,
        [session.userId]
      )

      // Update user's is_verified status
      await connection.execute(
        `UPDATE users 
         SET is_verified = TRUE,
             updated_at = NOW()
         WHERE id = ?`,
        [session.userId]
      )
    })

    return NextResponse.json({
      success: true,
      message: "Verification completed successfully! Your account is now verified.",
    })
  } catch (error) {
    console.error("Verification completion error:", error)
    return NextResponse.json({ message: "Verification failed. Please try again." }, { status: 500 })
  }
}
