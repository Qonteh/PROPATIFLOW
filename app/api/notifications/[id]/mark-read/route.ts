import { NextResponse } from "next/server";
import { execute } from "@/lib/db";

// PATCH or POST /api/notifications/[id]/mark-read
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing notification id" },
        { status: 400 }
      );
    }

    await execute("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}

// Also handle PATCH method if you want
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  return POST(request, { params });
}