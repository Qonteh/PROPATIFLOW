
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth/jwt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {

  // Allow uploads for all users (including unauthenticated)

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // @ts-ignore
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`.replace(/\s+/g, "-");
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  // Get extra fields from query params
  const { searchParams } = new URL(req.url);
  const document_type = searchParams.get("document_type") || "other";

  // Get file info
  // @ts-ignore
  const file_size = file.size;
  // @ts-ignore
  const mime_type = file.type;
  const file_url = `/uploads/${filename}`;

  // Insert into database
  try {
    const { query } = await import("@/lib/db/mysql");
    // Generate a UUID for document id
    const { v4: uuidv4 } = (await import("uuid"));
    const id = uuidv4();
    // If user is undefined, set user_id to null
    // No user context available, set userId to null
    let userId = null;
    await query(
      `INSERT INTO documents (id, user_id, document_type, file_name, file_url, file_size, mime_type, is_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW())`,
      [id, userId, document_type, file.name, file_url, file_size, mime_type]
    );
    return NextResponse.json({ success: true, filename, file_url });
  } catch (err) {
    return NextResponse.json({ error: "File saved but DB insert failed", details: String(err), filename }, { status: 500 });
  }
}
