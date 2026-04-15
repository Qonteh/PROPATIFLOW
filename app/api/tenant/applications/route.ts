

import { NextResponse } from "next/server";
import { queryOne, insert } from "@/lib/db";
import { getSession } from "@/lib/auth/session";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, message, propertyId } = body;

    // Validate required fields
    if (!fullName || !email || !phone || !propertyId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get tenantId from session
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const tenantId = session.userId;

    // Find property and landlord
    const property = await queryOne<any>("SELECT * FROM properties WHERE id = ?", [propertyId]);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    const landlordId = property.landlord_id;

    // Create application
    const applicationId = crypto.randomUUID();
    await insert(
      "INSERT INTO applications (id, property_id, tenant_id, landlord_id, status, message, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [applicationId, propertyId, tenantId, landlordId, "pending", message || ""]
    );

    // Create notification for landlord
    const notificationId = crypto.randomUUID();
    await insert(
      "INSERT INTO notifications (id, user_id, type, title, content, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [
        notificationId,
        landlordId,
        "application",
        "New Application",
        `New rental application from ${fullName} for property ${property.title}`,
        0
      ]
    );

    // Return success response
    return NextResponse.json({ success: true, applicationId });
  } catch (error) {
    // Log error for debugging
    console.error("Application creation error:", error);
    // Return error response
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}