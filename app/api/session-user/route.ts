import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const user = verifyToken(token);
    return NextResponse.json({ userId: user.userId || user.id || null });
  } catch (err) {
    return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
  }
}
