import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'

const parseStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return []

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map((v) => String(v).trim()).filter(Boolean)
        }
      } catch {
        // Fall through to simple parsing
      }
    }

    if (trimmed.includes(',')) {
      return trimmed.split(',').map((v) => v.trim()).filter(Boolean)
    }

    return [trimmed]
  }

  return []
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const landlordId = params.id
    const sql = `
      SELECT p.*, 
        CONCAT(u.first_name, ' ', u.last_name) as landlord_name,
        u.phone as landlord_phone,
        u.is_verified as landlord_verified,
        u.avatar_url as landlord_avatar
      FROM properties p
      JOIN users u ON p.landlord_id = u.id
      WHERE p.landlord_id = ?
      ORDER BY p.created_at DESC
    `
    const properties = await query(sql, [landlordId])

    // Parse JSON fields
    const formattedProperties = properties.map((p: any) => {
      const media = parseStringArray(p.media)
      const imageList = parseStringArray(p.images)

      let amenities: string[] = []
      if (Array.isArray(p.amenities)) {
        amenities = p.amenities
      } else if (typeof p.amenities === 'string' && p.amenities.trim()) {
        try {
          const parsedAmenities = JSON.parse(p.amenities)
          amenities = Array.isArray(parsedAmenities) ? parsedAmenities : []
        } catch {
          amenities = []
        }
      }

      return {
        ...p,
        amenities,
        media: media.length > 0 ? media : imageList,
        image: typeof p.image === 'string' && p.image.trim() ? p.image : imageList[0] || null,
        rent_amount: p.rent_amount ? parseFloat(p.rent_amount) : 0,
        security_deposit: p.security_deposit ? parseFloat(p.security_deposit) : null,
      }
    })

    return NextResponse.json({
      success: true,
      properties: formattedProperties
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch landlord properties',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
