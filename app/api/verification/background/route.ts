import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { performBackgroundCheck } from "@/lib/services/credit-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const backgroundCheck = performBackgroundCheck(session.userId)

    return NextResponse.json({ backgroundCheck })
  } catch (error) {
    console.error("Background check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
