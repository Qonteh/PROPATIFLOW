import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query, queryOne } from "@/lib/db/mysql"
import { v4 as uuidv4 } from "uuid"

interface DBApplication {
  id: string
  property_id: string
  tenant_id: string
  landlord_id: string
  status: string
  application_date: string
  desired_move_in: string
  proposed_rent: number | null
  lease_duration_months: number
  message: string | null
  credit_score_shared: boolean
  landlord_notes: string | null
  rejection_reason: string | null
  property_title?: string
  property_address?: string
  property_rent?: number
  tenant_name?: string
  tenant_email?: string
  tenant_phone?: string
  tenant_verified?: boolean
}

// GET - Fetch applications (tenant sees their own, landlord sees applications to their properties)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    let applications: DBApplication[] = []

    if (session.role === "tenant") {
      // Tenants see their own applications
      applications = await query(
        `SELECT a.*, 
                p.title as property_title, 
                p.address as property_address,
                p.rent_amount as property_rent,
                p.images as property_images,
                CONCAT(u.first_name, ' ', u.last_name) as landlord_name
         FROM applications a
         JOIN properties p ON a.property_id = p.id
         JOIN users u ON a.landlord_id = u.id
         WHERE a.tenant_id = ?
         ORDER BY a.application_date DESC`,
        [session.userId]
      )
    } else if (session.role === "landlord") {
      // Landlords see applications to their properties
      applications = await query(
        `SELECT a.*, 
                p.title as property_title, 
                p.address as property_address,
                p.rent_amount as property_rent,
                CONCAT(t.first_name, ' ', t.last_name) as tenant_name,
                t.email as tenant_email,
                t.phone as tenant_phone,
                t.is_verified as tenant_verified
         FROM applications a
         JOIN properties p ON a.property_id = p.id
         JOIN users t ON a.tenant_id = t.id
         WHERE a.landlord_id = ?
         ORDER BY a.application_date DESC`,
        [session.userId]
      )
    }

    return NextResponse.json({
      success: true,
      applications,
    })
  } catch (error) {
    console.error("Applications fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new application (tenant only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "tenant") {
      return NextResponse.json({ error: "Only tenants can apply" }, { status: 403 })
    }

    const data = await request.json()

    if (!data.property_id || !data.desired_move_in) {
      return NextResponse.json(
        { error: "Property ID and desired move-in date are required" },
        { status: 400 }
      )
    }

    // Get property details
    const property = await queryOne<{ id: string; landlord_id: string; status: string }>(
      "SELECT id, landlord_id, status FROM properties WHERE id = ?",
      [data.property_id]
    )

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (property.status !== "available") {
      return NextResponse.json({ error: "Property is not available" }, { status: 400 })
    }

    // Check if tenant already applied
    const existingApplication = await queryOne<{ id: string }>(
      "SELECT id FROM applications WHERE tenant_id = ? AND property_id = ? AND status NOT IN ('rejected', 'withdrawn', 'expired')",
      [session.userId, data.property_id]
    )

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this property" },
        { status: 400 }
      )
    }

    const applicationId = uuidv4()

    await query(
      `INSERT INTO applications (
        id, property_id, tenant_id, landlord_id, status, application_date,
        desired_move_in, proposed_rent, lease_duration_months, message,
        credit_score_shared, background_check_consent, income_verification_consent,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'pending', NOW(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        applicationId,
        data.property_id,
        session.userId,
        property.landlord_id,
        data.desired_move_in,
        data.proposed_rent || null,
        data.lease_duration_months || 12,
        data.message || null,
        data.credit_score_shared || false,
        data.background_check_consent || false,
        data.income_verification_consent || false,
      ]
    )

    // Create notification for landlord
    const notificationId = uuidv4()
    await query(
      `INSERT INTO notifications (id, user_id, type, title, content, link, created_at)
       VALUES (?, ?, 'application', 'New Application', 'You have a new rental application', '/landlord/applications', NOW())`,
      [notificationId, property.landlord_id]
    )

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      application_id: applicationId,
    }, { status: 201 })
  } catch (error) {
    console.error("Application creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
