// This file already uses named imports from mysql.ts, no changes needed.
import { NextRequest, NextResponse } from "next/server";
import { execute, query, queryOne, insert } from "@/lib/db/mysql";
import { verifyToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";

// Add or remove a favorite property for the logged-in user
export async function POST(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const user = verifyToken(token);
  const userId = user.userId || user.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { propertyId, action } = await req.json();
  if (!propertyId || !["add", "remove"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    if (action === "add") {
      await execute(
        `INSERT INTO favorites (user_id, property_id, created_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, property_id) DO NOTHING`,
        [userId, propertyId]
      );
    } else if (action === "remove") {
      await execute(
        `DELETE FROM favorites WHERE user_id = ? AND property_id = ?`,
        [userId, propertyId]
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update favorite", details: String(err) }, { status: 500 });
  }
}
