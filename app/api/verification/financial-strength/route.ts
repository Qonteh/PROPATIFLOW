import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { calculateFinancialStrength } from "@/lib/services/credit-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { creditScore, annualIncome, monthlyRent, totalDebt } = await request.json()

    const financialStrength = calculateFinancialStrength(creditScore, annualIncome, monthlyRent, totalDebt)

    return NextResponse.json({ financialStrength })
  } catch (error) {
    console.error("Financial strength calculation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
