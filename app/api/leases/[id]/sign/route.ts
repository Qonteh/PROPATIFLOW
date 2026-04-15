import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { queryOne, execute } from "@/lib/db/mysql"

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const lease = await queryOne<{
      id: string
      tenant_id: string | null
      landlord_id: string | null
      status: string | null
    }>("SELECT id, tenant_id, landlord_id, status FROM leases WHERE id = ?", [id])

    if (!lease) {
      return NextResponse.json({ message: "Lease not found" }, { status: 404 })
    }

    if (session.role !== "tenant" || lease.tenant_id !== session.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const nowSql = "CURRENT_TIMESTAMP"

    // Prefer schema variants that include signature flags, but fall back gracefully.
    try {
      await execute(
        `UPDATE leases
         SET signed_by_tenant = TRUE,
             tenant_signed_at = ${nowSql},
             status = CASE
               WHEN COALESCE(signed_by_landlord, FALSE) = TRUE THEN 'active'
               ELSE COALESCE(status, 'pending_signature')
             END
         WHERE id = ?`,
        [id]
      )
    } catch (signatureColumnError: any) {
      if (
        signatureColumnError?.code !== "42703" &&
        signatureColumnError?.code !== "42P01"
      ) {
        throw signatureColumnError
      }

      await execute(
        `UPDATE leases
         SET status = CASE
           WHEN status = 'draft' THEN 'active'
           ELSE status
         END
         WHERE id = ?`,
        [id]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error signing lease:", error)
    return NextResponse.json({ message: "Failed to sign lease" }, { status: 500 })
  }
}
