import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/mysql";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Fetch all available properties added by landlords
    const properties = await db.query(
      `SELECT p.id, p.title, p.address, p.rent_amount as rent, p.bedrooms, p.bathrooms, p.area_sqft as sqft, p.property_type as type, p.is_available, p.images, p.amenities, u.first_name as landlord_first, u.last_name as landlord_last
       FROM properties p
       LEFT JOIN users u ON p.landlord_id = u.id
       WHERE p.is_available = 1
       ORDER BY p.created_at DESC`
    );
    return NextResponse.json({ success: true, properties });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch properties", details: String(err) }, { status: 500 });
  }
}
