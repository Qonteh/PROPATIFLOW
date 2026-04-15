import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db/mysql";

// GET /api/notifications - Fetch notifications for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized", notifications: [] }, { status: 401 });
    }
    // Fetch notifications for the logged-in user
    const notifications = await query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [session.userId]
    );
    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    return NextResponse.json({ success: false, notifications: [], message: "Failed to fetch notifications" }, { status: 500 });
  }
}
