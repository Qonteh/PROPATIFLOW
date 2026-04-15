import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { queryOne, execute, query } from "@/lib/db/mysql"
import { randomUUID } from "crypto"

// GET - Fetch single application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id: applicationId } = await params

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const application = await queryOne<any>(
      `SELECT a.*, 
              p.title as property_title, 
              p.address as property_address,
              p.rent_amount as property_rent,
              p.images as property_images,
              CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
              t.email as tenant_email,
              t.phone as tenant_phone,
              t.is_verified as tenant_verified,
              CONCAT(ll.first_name, ' ', ll.last_name) as landlord_name,
              ll.email as landlord_email
       FROM applications a
       JOIN properties p ON a.property_id = p.id
       JOIN users t ON a.tenant_id = t.id
       JOIN users ll ON a.landlord_id = ll.id
       WHERE a.id = ?`,
      [applicationId]
    )

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Check access rights
    if (session.userId !== application.tenant_id && session.userId !== application.landlord_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      application,
    })
  } catch (error) {
    console.error("Application fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update application status (landlord only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id: applicationId } = await params

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const data = await request.json()

    // Get application
    const application = await queryOne<{
      landlord_id: string
      tenant_id: string
      property_id: string
      status: string
    }>(
      "SELECT landlord_id, tenant_id, property_id, status FROM applications WHERE id = ?",
      [applicationId]
    )

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Handle tenant withdrawal
    if (session.role === "tenant" && data.status === "withdrawn") {
      if (application.tenant_id !== session.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      await execute(
        "UPDATE applications SET status = 'withdrawn', updated_at = NOW() WHERE id = ?",
        [applicationId]
      )

      return NextResponse.json({
        success: true,
        message: "Application withdrawn",
      })
    }

    // Landlord actions
    if (session.role !== "landlord" || application.landlord_id !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const validStatuses = ["under_review", "approved", "rejected"]
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await execute(
      `UPDATE applications 
       SET status = ?, 
           landlord_notes = COALESCE(?, landlord_notes),
           rejection_reason = COALESCE(?, rejection_reason),
           reviewed_at = NOW(),
           reviewed_by = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        data.status,
        data.landlord_notes || null,
        data.rejection_reason || null,
        session.userId,
        applicationId,
      ]
    )

    // Create notification for tenant
    const notificationId = randomUUID()
    let notificationTitle = ""
    let notificationContent = ""

    if (data.status === "approved") {
      notificationTitle = "Application Approved!"
      notificationContent = "Congratulations! Your rental application has been approved."
    } else if (data.status === "rejected") {
      notificationTitle = "Application Update"
      notificationContent = "Your rental application status has been updated."
    } else {
      notificationTitle = "Application Under Review"
      notificationContent = "Your rental application is now being reviewed."
    }

    await query(
      `INSERT INTO notifications (id, user_id, type, title, content, link, created_at)
       VALUES (?, ?, 'application', ?, ?, '/tenant/applications', NOW())`,
      [notificationId, application.tenant_id, notificationTitle, notificationContent]
    )

    // If approved, update property status
    if (data.status === "approved") {
      await execute(
        "UPDATE properties SET status = 'rented' WHERE id = ?",
        [application.property_id]
      )
    }

    return NextResponse.json({
      success: true,
      message: `Application ${data.status}`,
    })
  } catch (error) {
    console.error("Application update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
