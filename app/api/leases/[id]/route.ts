import { NextRequest, NextResponse } from "next/server"
import { queryOne, execute } from "@/lib/db/mysql"

// PATCH /api/leases/[id]
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await request.json()
  // Only allow updating status or lease_document_url or signed_at
  const allowed = ["status", "lease_document_url", "signed_at"]
  const updates = Object.keys(data).filter((k) => allowed.includes(k))
  if (updates.length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }
  const setClause = updates.map((k) => `${k} = ?`).join(", ")
  const paramsArr = updates.map((k) => data[k])
  paramsArr.push(id)
  await execute(`UPDATE leases SET ${setClause} WHERE id = ?`, paramsArr)
  return NextResponse.json({ success: true })
}

// GET /api/leases/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lease = await queryOne(
    `SELECT * FROM leases WHERE id = ?`,
    [id]
  )
  if (!lease) return NextResponse.json({ error: "Lease not found" }, { status: 404 })
  return NextResponse.json({ success: true, lease })
}
