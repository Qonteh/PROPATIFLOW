import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { query, queryOne, execute } from "@/lib/db/mysql"

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
  images: string | null
  available_from: string | null
  min_lease_months: number
  pet_policy: string
  is_published: boolean
  views_count: number
  created_at: string
  updated_at: string
  landlord_name?: string
  landlord_phone?: string
  landlord_email?: string
  landlord_verified?: boolean
}

// GET - Fetch single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: propertyId } = await params

    const property = await queryOne<DBProperty>(
      `SELECT p.*, 
              CONCAT(u.first_name, ' ', u.last_name) as landlord_name,
              u.phone as landlord_phone,
              u.email as landlord_email,
              u.is_verified as landlord_verified,
              u.id as landlord_id
       FROM properties p
       JOIN users u ON p.landlord_id = u.id
       WHERE p.id = ?`,
      [propertyId]
    )

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Fetch all properties by this landlord (excluding the current property)
    const landlordProperties = await query<DBProperty>(
      `SELECT p.*, 
              CONCAT(u.first_name, ' ', u.last_name) as landlord_name,
              u.phone as landlord_phone,
              u.email as landlord_email,
              u.is_verified as landlord_verified
       FROM properties p
       JOIN users u ON p.landlord_id = u.id
       WHERE p.landlord_id = ? AND p.id != ? AND p.is_published = 1 AND p.status = 'available'`,
      [property.landlord_id, propertyId]
    )

    // Increment view count
    await execute(
      "UPDATE properties SET views_count = views_count + 1 WHERE id = ?",
      [propertyId]
    )

    // Parse JSON fields and ensure all extra_features fields are present
    const defaultExtraFeatures = {
      hasPublicToilet: null,
      hasSubmeters: null,
      electricityBillType: null,
      electricityBillAmount: null,
      waterBillAmount: null,
    }
    let parsedExtraFeatures = {}
    try {
      parsedExtraFeatures = property.extra_features ? JSON.parse(property.extra_features) : {}
    } catch {
      parsedExtraFeatures = {}
    }
    const extra_features = { ...defaultExtraFeatures, ...parsedExtraFeatures }

    const formattedProperty = {
      title: property.title,
      imageUrl: property.images ? JSON.parse(property.images)[0] : undefined,
      reference: property.reference,
      price: property.rent_amount ? parseFloat(property.rent_amount) : undefined,
      location: property.address || property.location || '',
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.area_sqft,
      type: property.property_type,
      status: property.status,
    }

    // Format landlord properties
    const formattedLandlordProperties = landlordProperties.map((p) => ({
      ...p,
      amenities: (() => {
        if (!p.amenities) return [];
        try {
          return JSON.parse(p.amenities);
        } catch {
          return typeof p.amenities === 'string' ? p.amenities.split(',') : [];
        }
      })(),
      images: (() => {
        if (!p.images) return [];
        try {
          return JSON.parse(p.images);
        } catch {
          return typeof p.images === 'string' ? p.images.split(',') : [];
        }
      })(),
      rent_amount: parseFloat(p.rent_amount as any),
      security_deposit: p.security_deposit ? parseFloat(p.security_deposit as any) : null,
      extra_features: (() => {
        if (!p.extra_features) return {};
        try {
          return JSON.parse(p.extra_features);
        } catch {
          return {};
        }
      })(),
    }));

    return NextResponse.json({
      success: true,
      property: formattedProperty,
    })
  } catch (error) {
    console.error("Property fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update property (landlord only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id: propertyId } = await params

    if (!session || session.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check property ownership
    const property = await queryOne<{ landlord_id: string }>(
      "SELECT landlord_id FROM properties WHERE id = ?",
      [propertyId]
    )

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (property.landlord_id !== session.userId) {
      return NextResponse.json({ error: "You don't own this property" }, { status: 403 })
    }

    const data = await request.json()

    await execute(
      `UPDATE properties SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        property_type = COALESCE(?, property_type),
        status = COALESCE(?, status),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        bedrooms = COALESCE(?, bedrooms),
        bathrooms = COALESCE(?, bathrooms),
        area_sqft = COALESCE(?, area_sqft),
        rent_amount = COALESCE(?, rent_amount),
        security_deposit = COALESCE(?, security_deposit),
        is_furnished = COALESCE(?, is_furnished),
        parking_spaces = COALESCE(?, parking_spaces),
        amenities = COALESCE(?, amenities),
        images = COALESCE(?, images),
        available_from = COALESCE(?, available_from),
        min_lease_months = COALESCE(?, min_lease_months),
        pet_policy = COALESCE(?, pet_policy),
        is_published = COALESCE(?, is_published),
        extra_features = COALESCE(?, extra_features),
        updated_at = NOW()
       WHERE id = ?`,
      [
        data.title || null,
        data.description || null,
        data.property_type || null,
        data.status || null,
        data.address || null,
        data.city || null,
        data.state || null,
        data.bedrooms || null,
        data.bathrooms || null,
        data.area_sqft || null,
        data.rent_amount || null,
        data.security_deposit || null,
        data.is_furnished !== undefined ? data.is_furnished : null,
        data.parking_spaces || null,
        data.amenities ? JSON.stringify(data.amenities) : null,
        data.images ? JSON.stringify(data.images) : null,
        data.available_from || null,
        data.min_lease_months || null,
        data.pet_policy || null,
        data.is_published !== undefined ? data.is_published : null,
        data.extra_features ? JSON.stringify(data.extra_features) : null,
        propertyId,
      ]
    )

    return NextResponse.json({
      success: true,
      message: "Property updated successfully",
    })
  } catch (error) {
    console.error("Property update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete property (landlord only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    const { id: propertyId } = await params

    if (!session || session.role !== "landlord") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check property ownership
    const property = await queryOne<{ landlord_id: string }>(
      "SELECT landlord_id FROM properties WHERE id = ?",
      [propertyId]
    )

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    if (property.landlord_id !== session.userId) {
      return NextResponse.json({ error: "You don't own this property" }, { status: 403 })
    }

    await execute("DELETE FROM properties WHERE id = ?", [propertyId])

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    })
  } catch (error) {
    console.error("Property delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
