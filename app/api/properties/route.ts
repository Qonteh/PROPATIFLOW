import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query, queryOne } from "@/lib/db/mysql" // Removed generateUUID

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

// GET - Fetch properties (for landlord: their properties, for tenant: available properties)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    console.log("[PROPERTIES API] Session:", session)

    // Public property search for tenants
    const city = searchParams.get("city")
    const propertyType = searchParams.get("type")
    const minRent = searchParams.get("minRent")
    const maxRent = searchParams.get("maxRent")
    const bedrooms = searchParams.get("bedrooms")
    const search = searchParams.get("search")

    let sql = `
            SELECT p.*, 
              CONCAT(u.first_name, ' ', u.last_name) as landlord_name,
              u.phone as landlord_phone,
              u.is_verified as landlord_verified,
              u.avatar_url as landlord_avatar
      FROM properties p
      JOIN users u ON p.landlord_id = u.id
      WHERE 1=1
    `
    const params: any[] = []

    // If landlord, show only their properties
    if (session?.role === "landlord") {
      sql += " AND p.landlord_id = ?"
      params.push(session.userId)
      
      // If requesting only available properties
      if (searchParams.get("available") === "true") {
        sql += " AND p.status = 'available'"
      }
    } else {
      // For tenants/public, show all published properties (regardless of status)
      sql += " AND p.is_published = 1"
    }
    console.log("[PROPERTIES API] SQL:", sql)
    console.log("[PROPERTIES API] Params:", params)

    // Apply filters
    if (city) {
      sql += " AND p.city LIKE ?"
      params.push(`%${city}%`)
    }
    if (propertyType) {
      sql += " AND p.property_type = ?"
      params.push(propertyType)
    }
    if (minRent) {
      sql += " AND p.rent_amount >= ?"
      params.push(parseFloat(minRent))
    }
    if (maxRent) {
      sql += " AND p.rent_amount <= ?"
      params.push(parseFloat(maxRent))
    }
    if (bedrooms) {
      sql += " AND p.bedrooms >= ?"
      params.push(parseInt(bedrooms))
    }
    if (search) {
      sql += " AND (p.title LIKE ? OR p.address LIKE ? OR p.city LIKE ?)"
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    sql += " ORDER BY p.created_at DESC"

    const properties = await query(sql, params)

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
      properties: formattedProperties 
    })
  } catch (error) {
    console.error("Properties fetch error:", error)
    return NextResponse.json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

// POST - Create new property (landlord only)
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
        { message: "Missing required fields: title, address, city, state, rent_amount" },
        { status: 400 }
      )
    }

    // Ensure media is always an array of strings
    let mediaToStore: string[] = [];
    if (Array.isArray(data.media)) {
      mediaToStore = data.media.filter(Boolean);
    } else if (typeof data.media === "string" && data.media.trim() !== "") {
      mediaToStore = [data.media.trim()];
    }

    const propertyId = crypto.randomUUID()

    // Combine room_types and custom_features into extra_features JSON
    let extraFeatures = null;
    if (Array.isArray(data.room_types) || Array.isArray(data.custom_features)) {
      extraFeatures = JSON.stringify({
        room_types: Array.isArray(data.room_types) ? data.room_types : [],
        custom_features: Array.isArray(data.custom_features) ? data.custom_features : [],
      });
    }

    await query(
      `INSERT INTO properties (
        id, landlord_id, title, description, property_type, status, address, city, state, country,
        bedrooms, bathrooms, area_sqft, rent_amount, currency, security_deposit, is_furnished,
        parking_spaces, amenities, media, available_from, min_lease_months, pet_policy, is_published,
        extra_features, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'available', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, NOW(), NOW())`,
      [
        propertyId,
        session.userId,
        data.title,
        data.description || null,
        data.property_type || "apartment",
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
        extraFeatures,
      ]
    )

    // Fetch the created property
    const property = await queryOne(
      "SELECT * FROM properties WHERE id = ?",
      [propertyId]
    )

    // Parse JSON fields to match GET format
    const formattedProperty = property ? {
      ...property,
      amenities: property.amenities ? JSON.parse(property.amenities as string) : [],
      media: property.media ? JSON.parse(property.media as string) : [],
      rent_amount: property.rent_amount ? parseFloat(property.rent_amount as string) : null,
      security_deposit: property.security_deposit ? parseFloat(property.security_deposit as string) : null,
    } : null

    return NextResponse.json({ 
      success: true,
      message: "Property created successfully",
      property: formattedProperty
    }, { status: 201 })
  } catch (error) {
    console.error("Property creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}