// API Route: Properties - Get/Create Properties
import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query as dbQuery } from "@/lib/db/neon"
import { getAvailableProperties, getPropertiesByLandlord } from "@/lib/db/queries"

interface DBProperty {
  id: string
  landlord_id: string
  title: string
  description: string | null
  property_type: string
  status: string
  address: string
  city: string
  state: string
  country: string
  bedrooms: number
  bathrooms: number
  area_sqft: number | null
  rent_amount: number
  currency: string
  security_deposit: number | null
  is_furnished: boolean
  parking_spaces: number
  amenities: string | null
  media: string | null
  available_from: string | null
  min_lease_months: number
  pet_policy: string
  is_published: boolean
  views_count: number
  created_at: string
  updated_at: string
}

// GET - Fetch properties
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)

    // Query parameters
    const city = searchParams.get("city")
    const propertyType = searchParams.get("type")
    const minRent = searchParams.get("minRent")
    const maxRent = searchParams.get("maxRent")
    const bedrooms = searchParams.get("bedrooms")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    let sql = `
      SELECT p.*, 
        u."first_name" || ' ' || u."last_name" as landlord_name,
        u."phone" as landlord_phone,
        u."is_verified" as landlord_verified,
        u."avatar_url" as landlord_avatar
      FROM "properties" p
      JOIN "users" u ON p."landlord_id" = u."id"
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    // Role-based filtering
    if (session?.role === "landlord") {
      sql += ` AND p."landlord_id" = $${++paramCount}`
      params.push(session.userId)

      if (searchParams.get("available") === "true") {
        sql += ` AND p."status" = 'available'`
      }
    } else {
      // For tenants/public, show all published properties
      sql += ` AND p."is_published" = 1`
    }

    // Apply filters
    if (city) {
      sql += ` AND p."city" ILIKE $${++paramCount}`
      params.push(`%${city}%`)
    }
    if (propertyType) {
      sql += ` AND p."property_type" = $${++paramCount}`
      params.push(propertyType)
    }
    if (minRent) {
      sql += ` AND p."rent_amount" >= $${++paramCount}`
      params.push(parseFloat(minRent))
    }
    if (maxRent) {
      sql += ` AND p."rent_amount" <= $${++paramCount}`
      params.push(parseFloat(maxRent))
    }
    if (bedrooms) {
      sql += ` AND p."bedrooms" >= $${++paramCount}`
      params.push(parseInt(bedrooms))
    }
    if (search) {
      sql += ` AND (p."title" ILIKE $${++paramCount} OR p."address" ILIKE $${++paramCount} OR p."city" ILIKE $${++paramCount})`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
      paramCount += 2
    }

    sql += ` ORDER BY p."created_at" DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`
    params.push(limit, offset)

    const result = await dbQuery(sql, params)
    const properties = result.rows

    // Parse JSON fields
    const formattedProperties = properties.map((p: any) => ({
      ...p,
      amenities: p.amenities ? JSON.parse(p.amenities) : [],
      media: p.media ? JSON.parse(p.media) : [],
      rent_amount: parseFloat(p.rent_amount),
      security_deposit: p.security_deposit ? parseFloat(p.security_deposit) : null,
    }))

    return NextResponse.json({
      success: true,
      count: formattedProperties.length,
      properties: formattedProperties,
    })
  } catch (error) {
    console.error("[Properties GET] Error:", error)
    return NextResponse.json(
      {
        message: "Failed to fetch properties",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// POST - Create new property
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "landlord") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.address || !data.city || !data.state || !data.rent_amount) {
      return NextResponse.json(
        {
          message: "Missing required fields: title, address, city, state, rent_amount",
        },
        { status: 400 }
      )
    }

    // Parse media
    let mediaToStore: string[] = []
    if (Array.isArray(data.media)) {
      mediaToStore = data.media.filter(Boolean)
    } else if (typeof data.media === "string" && data.media.trim() !== "") {
      mediaToStore = [data.media.trim()]
    }

    const propertyId = crypto.randomUUID()
    const now = new Date().toISOString()

    const insertSql = `
      INSERT INTO "properties" (
        "id", "landlord_id", "title", "description", "property_type", "status", 
        "address", "city", "state", "country", "bedrooms", "bathrooms", "area_sqft", 
        "rent_amount", "currency", "security_deposit", "is_furnished", "parking_spaces", 
        "amenities", "media", "available_from", "min_lease_months", "pet_policy", 
        "is_published", "created_at", "updated_at"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 
        $19, $20, $21, $22, $23, $24, $25, $26
      )
      RETURNING *
    `

    const result = await dbQuery(insertSql, [
      propertyId,
      session.userId,
      data.title,
      data.description || null,
      data.property_type || "house",
      "available",
      data.address,
      data.city,
      data.state,
      data.country || "Tanzania",
      data.bedrooms || 1,
      data.bathrooms || 1,
      data.area_sqft || null,
      data.rent_amount,
      data.currency || "TZS",
      data.security_deposit || null,
      data.is_furnished || false,
      data.parking_spaces || 0,
      data.amenities ? JSON.stringify(data.amenities) : null,
      mediaToStore.length > 0 ? JSON.stringify(mediaToStore) : null,
      data.available_from || null,
      data.min_lease_months || 12,
      data.pet_policy || "not_allowed",
      true,
      now,
      now,
    ])

    const newProperty = result.rows[0]

    return NextResponse.json(
      {
        success: true,
        message: "Property created successfully",
        property: {
          ...newProperty,
          amenities: newProperty.amenities
            ? JSON.parse(newProperty.amenities)
            : [],
          media: newProperty.media ? JSON.parse(newProperty.media) : [],
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[Properties POST] Error:", error)
    return NextResponse.json(
      {
        message: "Failed to create property",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
