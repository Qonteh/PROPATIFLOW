import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { queryOne, execute } from "@/lib/db/mysql"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { ninNumber, email, firstName, lastName } = await request.json()

    // Validate NIN format (20 digits for Tanzania/Nigeria)
    if (!ninNumber || !/^\d{11,20}$/.test(ninNumber)) {
      return NextResponse.json({ message: "Invalid NIN format. Must be 11-20 digits." }, { status: 400 })
    }

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json({ message: "Email, first name, and last name are required." }, { status: 400 })
    }

    // Check if NIN is already used by another user
    const existingNin = await queryOne<{ user_id: string }>(
      "SELECT user_id FROM verifications WHERE nin_number = ? AND user_id != ?",
      [ninNumber, session.userId]
    )

    if (existingNin) {
      return NextResponse.json(
        { message: "This NIN is already registered to another account." },
        { status: 400 }
      )
    }

    // TODO: Integrate with actual NIDA/NIMC API
    // const nidaResponse = await fetch(process.env.NIDA_API_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.NIDA_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ nin: ninNumber })
    // })

    // Simulated response for development
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

    // Mock successful NIN verification
    const mockNinData = {
      nin: ninNumber,
      fullName: `${firstName} ${lastName}`,
      email: email,
      dateOfBirth: "1990-01-15",
      gender: "Male",
      nationality: "Tanzanian",
      verified: true,
    }

    // Update verification record with NIN data
    await execute(
      `UPDATE verifications 
       SET nin_number = ?, 
           nin_verified = TRUE, 
           nin_verified_at = NOW(),
           verification_status = 'in_progress',
           updated_at = NOW()
       WHERE user_id = ?`,
      [ninNumber, session.userId]
    )

    return NextResponse.json({
      success: true,
      message: "NIN verified successfully",
      data: mockNinData,
    })
  } catch (error) {
    console.error("NIN verification error:", error)
    return NextResponse.json({ message: "Verification failed. Please try again." }, { status: 500 })
  }
}
