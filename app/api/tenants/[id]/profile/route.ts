import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query, queryOne } from "@/lib/db/mysql"

interface TenantUser {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  is_verified: boolean
  avatar_url: string | null
  date_of_birth: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  created_at: string
}

interface TenantProfile {
  nida_number: string | null
  employer_name: string | null
  employment_status: string | null
  job_title: string | null
  annual_income: number | null
  income_verified: boolean
  previous_landlord_name: string | null
  previous_landlord_phone: string | null
  previous_address: string | null
  rental_history_years: number
  has_pets: boolean
  pet_details: string | null
  number_of_occupants: number
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relationship: string | null
  bio: string | null
}

interface Verification {
  verification_status: string
  nin_verified: boolean
  bvn_verified: boolean
  id_verified: boolean
}

interface BackgroundCheck {
  check_type: string
  status: string
  result: string | null
  completed_at: string | null
}

interface Document {
  id: string
  document_type: string
  file_name: string
  is_verified: boolean
  created_at: string
}

interface Application {
  id: string
  property_title: string
  property_address: string
  status: string
  application_date: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id: tenantId } = await params

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Only landlords can view tenant profiles (or tenants viewing their own)
    if (session.role !== "landlord" && session.userId !== tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get tenant user data
    const user = await queryOne<TenantUser>(
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
    const profile = await queryOne<TenantProfile>(
      `SELECT nida_number, employer_name, employment_status, job_title, annual_income, income_verified,
              previous_landlord_name, previous_landlord_phone, previous_address, 
              rental_history_years, has_pets, pet_details, number_of_occupants,
              emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, bio
       FROM tenant_profiles 
       WHERE user_id = ?`,
      [tenantId]
    )

    // Get verification status
    const verification = await queryOne<Verification>(
      `SELECT verification_status, nin_verified, bvn_verified, id_verified
       FROM verifications 
       WHERE user_id = ?`,
      [tenantId]
    )

    // Get background checks
    const backgroundChecks = await query<BackgroundCheck>(
      `SELECT check_type, status, result, completed_at
       FROM background_checks 
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [tenantId]
    )

    // Get documents (excluding sensitive ones)
    const documents = await query<Document>(
      `SELECT id, document_type, file_name, is_verified, created_at
       FROM documents 
       WHERE user_id = ? AND document_type NOT IN ('bank_statement', 'pay_slip')
       ORDER BY created_at DESC`,
      [tenantId]
    )

    // Get rental applications (only for this landlord's properties)
    let applications: Application[] = []
    if (session.role === "landlord") {
      applications = await query<Application>(
        `SELECT a.id, p.title as property_title, p.address as property_address, 
                a.status, a.application_date
         FROM applications a
         JOIN properties p ON a.property_id = p.id
         WHERE a.tenant_id = ? AND p.landlord_id = ?
         ORDER BY a.application_date DESC`,
        [tenantId, session.userId]
      )
    }

    // Note: Credit score is intentionally excluded to protect tenant privacy
    // Landlords cannot see credit score unless tenant shares it

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
        applications: applications,
        credit_score: {
          status: "private",
          message: "Credit score is private. Tenant must share it with you.",
        },
      },
    })
  } catch (error) {
    console.error("Error fetching tenant profile:", error)
    return NextResponse.json({ error: "Failed to fetch tenant profile" }, { status: 500 })
  }
}
