import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query, queryOne, execute } from "@/lib/db/mysql"
import { getSession } from "@/lib/auth/session"

// GET - Fetch user settings
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    console.log("[SETTINGS] Fetching settings for user:", session.userId)

    // Get user profile
    const user = await queryOne<{
      id: string
      email: string
      first_name: string
      last_name: string
      phone: string | null
      role: string
      is_verified: boolean
      avatar_url: string | null
    }>(
      `SELECT id, email, first_name, last_name, phone, role, is_verified, avatar_url
       FROM users WHERE id = ?`,
      [session.userId]
    )

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get notification settings
    const notifications = await queryOne<{
      new_applications: boolean
      payment_reminders: boolean
      maintenance_requests: boolean
      monthly_reports: boolean
    }>(
      `SELECT new_applications, payment_reminders, maintenance_requests, monthly_reports
       FROM notification_settings WHERE user_id = ?`,
      [session.userId]
    )

    // Get payment settings (for landlords)
    let paymentInfo = null
    if (session.role === "landlord") {
      paymentInfo = await queryOne<{
        bank_name: string | null
        account_number: string | null
        account_name: string | null
        mobile_money: string | null
      }>(
        `SELECT bank_name, account_number, account_name, mobile_money
         FROM payment_settings WHERE user_id = ?`,
        [session.userId]
      )
    }

    console.log("[SETTINGS] Settings fetched successfully")

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        is_verified: user.is_verified,
        avatar_url: user.avatar_url,
      },
      notifications: notifications || {
        new_applications: true,
        payment_reminders: true,
        maintenance_requests: true,
        monthly_reports: false,
      },
      paymentInfo: paymentInfo || {
        bank_name: "",
        account_number: "",
        account_name: "",
        mobile_money: "",
      },
    })
  } catch (error) {
    console.error("[SETTINGS] GET ERROR:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    console.log("[SETTINGS] Updating settings:", { type, userId: session.userId })

    switch (type) {
      case "profile":
        await execute(
          `UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = NOW()
           WHERE id = ?`,
          [data.first_name, data.last_name, data.phone, session.userId]
        )
        console.log("[SETTINGS] Profile updated successfully")
        break

      case "password":
        // Verify current password
        const user = await queryOne<{ password_hash: string }>(
          `SELECT password_hash FROM users WHERE id = ?`,
          [session.userId]
        )
        
        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const isValid = await bcrypt.compare(data.current_password, user.password_hash)
        if (!isValid) {
          return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
        }

        // Hash new password
        const newHash = await bcrypt.hash(data.new_password, 10)
        await execute(
          `UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?`,
          [newHash, session.userId]
        )
        console.log("[SETTINGS] Password updated successfully")
        break

      case "notifications":
        // Check if notification settings exist
        const existingNotif = await queryOne<{ user_id: string }>(
          `SELECT user_id FROM notification_settings WHERE user_id = ?`,
          [session.userId]
        )

        if (existingNotif) {
          await execute(
            `UPDATE notification_settings 
             SET new_applications = ?, payment_reminders = ?, maintenance_requests = ?, monthly_reports = ?
             WHERE user_id = ?`,
            [
              data.new_applications ? 1 : 0,
              data.payment_reminders ? 1 : 0,
              data.maintenance_requests ? 1 : 0,
              data.monthly_reports ? 1 : 0,
              session.userId,
            ]
          )
        } else {
          await execute(
            `INSERT INTO notification_settings (user_id, new_applications, payment_reminders, maintenance_requests, monthly_reports)
             VALUES (?, ?, ?, ?, ?)`,
            [
              session.userId,
              data.new_applications ? 1 : 0,
              data.payment_reminders ? 1 : 0,
              data.maintenance_requests ? 1 : 0,
              data.monthly_reports ? 1 : 0,
            ]
          )
        }
        console.log("[SETTINGS] Notification settings updated successfully")
        break

      case "payment":
        // Check if payment settings exist
        const existingPayment = await queryOne<{ user_id: string }>(
          `SELECT user_id FROM payment_settings WHERE user_id = ?`,
          [session.userId]
        )

        if (existingPayment) {
          await execute(
            `UPDATE payment_settings 
             SET bank_name = ?, account_number = ?, account_name = ?, mobile_money = ?
             WHERE user_id = ?`,
            [data.bank_name, data.account_number, data.account_name, data.mobile_money, session.userId]
          )
        } else {
          await execute(
            `INSERT INTO payment_settings (user_id, bank_name, account_number, account_name, mobile_money)
             VALUES (?, ?, ?, ?, ?)`,
            [session.userId, data.bank_name, data.account_number, data.account_name, data.mobile_money]
          )
        }
        console.log("[SETTINGS] Payment settings updated successfully")
        break

      default:
        return NextResponse.json({ message: "Invalid settings type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("[SETTINGS] PUT ERROR:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
