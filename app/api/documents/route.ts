import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { query, insert, execute } from "@/lib/db/mysql";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Get user from session token
  const token = req.cookies.get("session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let user;
  try {
    user = verifyToken(token);
  } catch (err) {
    return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
  }

  const userId = user.userId || user.id;
  if (!userId) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  try {
    const documents = await query(
      `SELECT id, document_type, file_name, file_url, file_size, mime_type, is_verified, expires_at, created_at FROM documents WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return NextResponse.json({ success: true, documents });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch documents", details: String(err) }, { status: 500 });
  }
}
