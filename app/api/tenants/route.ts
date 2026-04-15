import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query, insert } from "@/lib/db/mysql"
import { v4 as uuidv4 } from "uuid"
import { getSession } from "@/lib/auth/session"

// GET - List all tenants for a landlord
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.role !== "landlord") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    // Get all tenants with their lease and property info for this landlord, including location
    let sql = `
      SELECT 
        u.id as user_id, u.first_name, u.last_name, u.email, u.phone, u.is_verified,
        l.id as lease_id, l.start_date as lease_start, l.end_date as lease_end, l.rent_amount, l.status as lease_status,
        p.title as property_title, p.address as property_address, p.city as property_city, p.state as property_state, p.country as property_country
      FROM users u
      JOIN leases l ON l.tenant_id = u.id
      JOIN properties p ON l.property_id = p.id
      WHERE l.landlord_id = ? AND u.role = 'tenant'
    `
    const params: (string | number)[] = [session.userId]

    if (search) {
      sql += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR p.title LIKE ? OR p.address LIKE ?)`
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern)
    }

    const tenantsWithLease = await query(sql, params)

    // Optionally, also fetch tenants without a lease if you want (not shown in rent roll)

    const formattedTenants = (tenantsWithLease as any[]).map(t => {
      let location = ""
      if (t.property_address && t.property_city) {
        location = `${t.property_address}, ${t.property_city}`
      } else if (t.property_city) {
        location = t.property_city
      } else if (t.property_address) {
        location = t.property_address
      }
      // Calculate lease period in months
      let leasePeriod = 0
      if (t.lease_start && t.lease_end) {
        const start = new Date(t.lease_start)
        const end = new Date(t.lease_end)
        leasePeriod = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
        // If the end date's day is >= start date's day, count as a full month
        if (end.getDate() >= start.getDate()) leasePeriod++
      }
      return {
        id: t.user_id,
        name: `${t.first_name} ${t.last_name}`,
        firstName: t.first_name,
        lastName: t.last_name,
        email: t.email,
        phone: t.phone || "",
        isVerified: t.is_verified,
        property: t.property_title || "Not assigned",
        propertyAddress: t.property_address || "",
        propertyLocation: location,
        rent: t.rent_amount || 0,
        leaseStart: t.lease_start ? new Date(t.lease_start).toISOString().split('T')[0] : "",
        leaseEnd: t.lease_end ? new Date(t.lease_end).toISOString().split('T')[0] : "",
        leasePeriod,
        status: t.lease_status === "active" ? "Active" : t.lease_status || "Inactive",
        paymentStatus: "Pending",
      }
    })

    return NextResponse.json({ success: true, tenants: formattedTenants })
  } catch (error) {
    console.error("Error fetching tenants:", error)
    // Always return JSON, never HTML
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch tenants", details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

// POST - Add a new tenant
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session || session.role !== "landlord") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { email, first_name, last_name, phone, nida_number, property_id, rent_amount, lease_start, lease_end, lease_period, otp } = await request.json()

    // Validate input
    if (!email || !first_name || !last_name) {
      return NextResponse.json({ message: "Email, first name and last name are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await query(
      "SELECT id, role FROM users WHERE email = ?",
      [email.toLowerCase()]
    )
    if (existingUser.length > 0) {
      // If user is already a tenant, block duplicate
      if (existingUser[0].role === "tenant") {
        return NextResponse.json({ message: "A tenant with this email already exists." }, { status: 409 })
      } else {
        return NextResponse.json({ message: "This email is registered as a landlord" }, { status: 400 })
      }
    }
    let tenantId: string
    // Use OTP as the initial password
    if (!otp) {
      return NextResponse.json({ message: "OTP is required for new tenant" }, { status: 400 })
    }
    const password_hash = await bcrypt.hash(otp, 10)
    tenantId = uuidv4()
    await insert(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_verified, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'tenant', 0, 1, NOW())`,
      [tenantId, email.toLowerCase(), password_hash, first_name, last_name, phone || null]
    )
    // Insert tenant profile with NIDA number
    await insert(
      `INSERT INTO tenant_profiles (id, user_id, nida_number, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [uuidv4(), tenantId, nida_number || null]
    )

    // If property_id is provided, create a lease
    if (property_id) {
      const leaseId = uuidv4()
      const startDate = lease_start || new Date().toISOString().split('T')[0]
      let endDate = lease_end
      // If lease_period is provided, calculate lease_end from lease_start + lease_period (months)
      if (!endDate && lease_period && startDate) {
        const start = new Date(startDate)
        start.setMonth(start.getMonth() + Number(lease_period))
        endDate = start.toISOString().split('T')[0]
      }
      if (!endDate) {
        // Default to 12 months if not provided
        const start = new Date(startDate)
        start.setMonth(start.getMonth() + 12)
        endDate = start.toISOString().split('T')[0]
      }

      // Get property rent amount if not provided
      const propertyData = await query(
        "SELECT rent_amount, security_deposit FROM properties WHERE id = ?",
        [property_id]
      )

      const finalRent = rent_amount || propertyData[0]?.rent_amount || 0
      const deposit = propertyData[0]?.security_deposit || 0

      await insert(
        `INSERT INTO leases (id, property_id, tenant_id, landlord_id, start_date, end_date, rent_amount, security_deposit, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
        [leaseId, property_id, tenantId, session.userId, startDate, endDate, finalRent, deposit]
      )

      // Mark property as rented
      await query(
        `UPDATE properties SET status = 'rented' WHERE id = ?`,
        [property_id]
      )
    }

    return NextResponse.json({
      success: true,
      message: "Tenant added successfully",
      tenant: {
        id: tenantId,
        email: email.toLowerCase(),
        first_name,
        last_name,
        phone: phone || null,
        nida_number: nida_number || null,
      }
    })
  } catch (error) {
    console.error("Error adding tenant:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
