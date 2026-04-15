import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { queryOne, insert } from "@/lib/db/mysql"
import { createSession } from "@/lib/auth/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, phone_number, avatar_url, role } = await request.json()
    // Default to landlord if not provided, but allow tenant/agent
    const userRole = role === "tenant" || role === "agent" ? role : "landlord"

    console.log("[REGISTER] New registration attempt:", { email, full_name, userRole, phone_number })

    // Validate input
    if (!email || !password || !full_name) {
      console.log("[REGISTER] Validation failed: Missing required fields")
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await queryOne<{ id: string }>(
      "SELECT id FROM users WHERE email = ?",
      [email.toLowerCase()]
    )
    
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Parse full name
    const nameParts = full_name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    // Generate user ID
    const userId = crypto.randomUUID()

    // Create user in MySQL
    console.log("[REGISTER] Creating user in database with ID:", userId)
    await insert(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_verified, is_active, avatar_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, FALSE, TRUE, ?, NOW())`,
      [userId, email.toLowerCase(), password_hash, firstName, lastName, phone_number || null, userRole, avatar_url || null]
    )
    console.log("[REGISTER] User created successfully:", { userId, email, userRole })

    // Do NOT create session - user must login after registration
    console.log("[REGISTER] Registration complete - user must login")

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: userId,
        email: email.toLowerCase(),
        full_name: full_name,
        first_name: firstName,
        last_name: lastName,
        role: userRole,
        phone_number: phone_number || null,
        is_verified: false,
        avatar_url: avatar_url || null,
      },
    })
  } catch (error) {
    console.error("[REGISTER] ERROR:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
