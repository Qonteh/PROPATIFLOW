import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db/neon";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ message: "Password required" }, { status: 400 });
    }
    // Get user from Neon
    const result = await query(
      `SELECT "password_hash" FROM "users" WHERE "id" = $1 LIMIT 1`,
      [session.userId]
    );
    if (result.rows.length === 0 || !result.rows[0].password_hash) {
      return NextResponse.json({ message: "User not found or no password set" }, { status: 404 });
    }
    // Compare password
    const isValid = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 200 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
