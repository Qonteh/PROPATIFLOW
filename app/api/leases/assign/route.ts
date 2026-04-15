import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/session";

// POST: Assign lease template to a tenant
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "landlord") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { tenantId, template } = await request.json();
    if (!tenantId || !template) {
      return NextResponse.json({ message: "Missing tenant or template" }, { status: 400 });
    }
    // Store lease for tenant (upsert)
    await query(
      `INSERT INTO leases (tenant_id, landlord_id, template, status) VALUES (?, ?, ?, 'sent')
       ON DUPLICATE KEY UPDATE template = VALUES(template), status = 'sent'`,
      [tenantId, session.userId, template]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
