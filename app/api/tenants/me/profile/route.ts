import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query, queryOne } from "@/lib/db/mysql"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const tenantId = session.userId

    // Get tenant user data
    const user = await queryOne(
      `SELECT id, email, first_name, last_name, phone, is_verified, avatar_url,
              date_of_birth, address, city, state, country, created_at
       FROM users 
       WHERE id = ? AND role = 'tenant'`,
      [tenantId]
    )
    if (!user) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get tenant profile
    const profile = await queryOne(
      `SELECT nida_number, employer_name, employment_status, job_title, annual_income, income_verified,
              previous_landlord_name, previous_landlord_phone, previous_address, 
              rental_history_years, has_pets, pet_details, number_of_occupants,
              emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, bio
       FROM tenant_profiles 
       WHERE user_id = ?`,
      [tenantId]
    )

    // Get verification status
    const verification = await queryOne(
      `SELECT verification_status, nin_verified, bvn_verified, id_verified
       FROM verifications 
       WHERE user_id = ?`,
      [tenantId]
    )

    // Get background checks
    const backgroundChecks = await query(
      `SELECT check_type, status, result, completed_at
       FROM background_checks 
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [tenantId]
    )

    // Get documents (excluding sensitive ones)
    const documents = await query(
      `SELECT id, document_type, file_name, is_verified, created_at
       FROM documents 
       WHERE user_id = ? AND document_type NOT IN ('bank_statement', 'pay_slip')
       ORDER BY created_at DESC`,
      [tenantId]
    )

    return NextResponse.json({
      success: true,
      tenant: {
        id: user.id,
        email: user.email,
        full_name: `${user.first_name} ${user.last_name}`.trim(),
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        is_verified: user.is_verified,
        avatar_url: user.avatar_url,
        date_of_birth: user.date_of_birth,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        member_since: user.created_at,
        profile: profile
          ? {
              nida_number: profile.nida_number,
              employer_name: profile.employer_name,
              employment_status: profile.employment_status,
              job_title: profile.job_title,
              annual_income: profile.annual_income,
              income_verified: profile.income_verified,
              previous_landlord_name: profile.previous_landlord_name,
              previous_landlord_phone: profile.previous_landlord_phone,
              previous_address: profile.previous_address,
              rental_history_years: profile.rental_history_years,
              has_pets: profile.has_pets,
              pet_details: profile.pet_details,
              number_of_occupants: profile.number_of_occupants,
              emergency_contact: profile.emergency_contact_name
                ? {
                    name: profile.emergency_contact_name,
                    phone: profile.emergency_contact_phone,
                    relationship: profile.emergency_contact_relationship,
                  }
                : null,
              bio: profile.bio,
            }
          : null,
        verification: verification
          ? {
              status: verification.verification_status,
              nin_verified: verification.nin_verified,
              bvn_verified: verification.bvn_verified,
              id_verified: verification.id_verified,
            }
          : null,
        background_checks: backgroundChecks,
        documents: documents,
      },
    })
  } catch (error) {
    console.error("Error fetching tenant profile:", error)
    return NextResponse.json({ error: "Failed to fetch tenant profile" }, { status: 500 })
  }
}
