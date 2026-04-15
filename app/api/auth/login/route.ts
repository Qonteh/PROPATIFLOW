import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { queryOne, query } from "@/lib/db/mysql"
import { createSession } from "@/lib/auth/session"

interface DBUser {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  phone: string | null
  role: "tenant" | "landlord" | "agent"
  is_verified: boolean
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[LOGIN] Login attempt for:", email)

    // Validate input
    if (!email || !password) {
      console.log("[LOGIN] Validation failed: Missing email or password")
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user in database
    console.log("[LOGIN] Looking up user in database...")
    const user = await queryOne<DBUser>(
      `SELECT id, email, password_hash, first_name, last_name, phone, role, is_verified
       FROM users WHERE email = ?`,
      [email.toLowerCase()]
    )

    if (!user) {
      console.log("[LOGIN] User not found:", email)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }
    console.log("[LOGIN] User found:", { id: user.id, email: user.email, role: user.role })


    // IMPORTANT: Check if password exists
    if (!user.password_hash) {
      console.log('[LOGIN] No password set for user:', email)
      return NextResponse.json(
        { message: 'Account setup not completed. Please reset password.' },
        { status: 401 }
      );
    }

    console.log('[LOGIN] Comparing password...');
    console.log('[LOGIN] Provided password length:', password.length);
    console.log('[LOGIN] Hashed password length:', user.password_hash.length);
    console.log('[LOGIN] Hashed password starts with:', user.password_hash.substring(0, 10));

    // Compare password with bcrypt
    const isValid = await bcrypt.compare(password, user.password_hash)
    console.log('[LOGIN] Password comparison result:', isValid);
    if (!isValid) {
      console.log('[LOGIN] Invalid password for user:', email)
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    // Create session
    console.log("[LOGIN] Creating session for user:", user.id)
    await createSession(user.id, user.role, user.is_verified)
    console.log("[LOGIN] Login successful for:", { id: user.id, email: user.email, role: user.role })

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        full_name: `${user.first_name} ${user.last_name}`.trim(),
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        phone_number: user.phone,
        is_verified: user.is_verified,
      },
    })
  } catch (error) {
    console.error("[LOGIN] ERROR:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
