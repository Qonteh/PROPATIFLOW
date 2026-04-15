import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { verifyIncome } from "@/lib/services/credit-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { annualIncome, documents } = await request.json()

    const verification = verifyIncome(annualIncome, documents)

    return NextResponse.json({ verification })
  } catch (error) {
    console.error("Income verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
