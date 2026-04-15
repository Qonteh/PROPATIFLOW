import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { execute } from "@/lib/db/mysql";

// POST /api/notifications/mark-all-read - Mark all notifications as read for current user
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await execute(
    "UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0",
    [session.userId]
  );
  return NextResponse.json({ success: true });
}
