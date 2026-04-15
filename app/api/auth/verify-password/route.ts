import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { queryOne } from "@/lib/db/mysql";
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
    // Get user from DB
    const user = await queryOne<any>(
      `SELECT password_hash FROM users WHERE id = ?`,
      [session.userId]
    );
    if (!user || !user.password_hash) {
      return NextResponse.json({ message: "User not found or no password set" }, { status: 404 });
    }
    // Compare password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 200 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
