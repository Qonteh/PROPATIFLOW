import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/mysql";
import { getSession } from "@/lib/auth/session";

// GET /api/leases - List all leases for the current user
export async function GET(request: NextRequest) {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	let leases = [];
	if (session.role === "tenant") {
		leases = await query(
			`SELECT *, document_url as template FROM leases WHERE tenant_id = ?`,
			[session.userId]
		);
	} else if (session.role === "landlord") {
		leases = await query(
			`SELECT *, document_url as template FROM leases WHERE landlord_id = ?`,
			[session.userId]
		);
	}
	return NextResponse.json({ success: true, leases });
}

// POST /api/leases - Create a new lease (landlord only)
export async function POST(request: NextRequest) {
	const session = await getSession();
	console.log("[LEASES API] Session:", session);
	let body;
	try {
		body = await request.json();
	} catch (e) {
		console.log("[LEASES API] Invalid JSON body", e);
		return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
	}
	console.log("[LEASES API] Request body:", body);
	if (!session || session.role !== "landlord") {
		return NextResponse.json({ message: "Unauthorized", session }, { status: 401 });
	}
	const { property_id, landlord_id, tenant_id, start_date, end_date, monthly_rent, template } = body;
	if (!property_id || !landlord_id || !tenant_id || !start_date || !end_date || !monthly_rent || !template) {
		return NextResponse.json({ message: "Missing required fields", property_id, landlord_id, tenant_id, start_date, end_date, monthly_rent, template }, { status: 400 });
	}
	// Validate landlord_id matches session user
	if (landlord_id !== session.userId) {
		return NextResponse.json({ message: "landlord_id does not match session user" }, { status: 400 });
	}
	// Check if landlord and tenant exist in users table BEFORE inserting lease
	const landlordUser = await query('SELECT id FROM users WHERE id = ?', [landlord_id]);
	const tenantUser = await query('SELECT id FROM users WHERE id = ?', [tenant_id]);
	if (!landlordUser.length || !tenantUser.length) {
		console.error('[LEASES API] User not found:', { landlord_id, tenant_id, landlordUser, tenantUser });
		return NextResponse.json({ message: 'Landlord or tenant user does not exist in users table', landlord_id, tenant_id }, { status: 400 });
	}

	// Allow multiple leases for the same property (no blocking)
	// Generate a UUID for the lease id
	const leaseId = crypto.randomUUID ? crypto.randomUUID() : (await import('uuid')).v4();
	await query(
		`INSERT INTO leases (id, property_id, landlord_id, tenant_id, start_date, end_date, rent_amount, status, document_url) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
		[leaseId, property_id, landlord_id, tenant_id, start_date, end_date, monthly_rent, template]
	);
	try {
		// Notify landlord
		await query(
			`INSERT INTO notifications (id, user_id, type, title, content, link, created_at)
			 VALUES (?, ?, 'lease', ?, ?, '/landlord/leases', NOW())`,
			[crypto.randomUUID(), landlord_id, 'New Lease Created', `A new lease has been created for your property.`, null]
		);
		// Notify tenant
		await query(
			`INSERT INTO notifications (id, user_id, type, title, content, link, created_at)
			 VALUES (?, ?, 'lease', ?, ?, '/tenant/leases', NOW())`,
			[crypto.randomUUID(), tenant_id, 'New Lease Created', `A new lease has been created for you.`, null]
		);
	} catch (err) {
		console.error('[LEASES API] Notification insert error:', err);
		return NextResponse.json({ message: 'Failed to insert notification', error: String(err) }, { status: 500 });
	}
	return NextResponse.json({ success: true });
}
