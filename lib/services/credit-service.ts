// Credit scoring and financial verification service
// In production, this would integrate with actual credit bureaus

export interface CreditReport {
  score: number
  reportDate: Date
  accountHistory: {
    type: string
    status: string
    balance: number
    paymentHistory: string
  }[]
  publicRecords: {
    type: string
    date: Date
    status: string
  }[]
  inquiries: {
    creditor: string
    date: Date
    type: string
  }[]
  riskFactors: string[]
  scoreFactors: {
    factor: string
    impact: "positive" | "negative" | "neutral"
  }[]
}

export interface IncomeVerification {
  verified: boolean
  annualIncome: number
  monthlyIncome: number
  employer: string
  employmentType: string
  yearsEmployed: number
  payStubs: {
    date: string
    grossPay: number
    netPay: number
    verified: boolean
  }[]
  bankStatements: {
    month: string
    averageBalance: number
    verified: boolean
  }[]
}

export interface BackgroundCheck {
  passed: boolean
  criminalHistory: boolean
  evictionHistory: boolean
  rentalHistory: {
    landlord: string
    address: string
    duration: string
    rating: "excellent" | "good" | "fair" | "poor"
  }[]
  completedDate: Date
}

export interface FinancialStrength {
  score: number // 0-100
  creditScore: number
  debtToIncomeRatio: number
  rentToIncomeRatio: number
  savingsVerified: boolean
  employmentStable: boolean
  recommendation: "strong" | "acceptable" | "risky" | "decline"
}

// Mock credit report generator
export function generateCreditReport(userId: string, creditScore: number): CreditReport {
  return {
    score: creditScore,
    reportDate: new Date(),
    accountHistory: [
      {
        type: "Credit Card",
        status: "Open",
        balance: 2500,
        paymentHistory: "Current",
      },
      {
        type: "Auto Loan",
        status: "Open",
        balance: 15000,
        paymentHistory: "Current",
      },
      {
        type: "Student Loan",
        status: "Open",
        balance: 25000,
        paymentHistory: "Current",
      },
    ],
    publicRecords: [],
    inquiries: [
      {
        creditor: "ABC Bank",
        date: new Date(2024, 10, 15),
        type: "Hard Inquiry",
      },
    ],
    riskFactors: creditScore < 650 ? ["High credit utilization", "Recent inquiries"] : [],
    scoreFactors: [
      {
        factor: "Payment history",
        impact: creditScore > 700 ? "positive" : "negative",
      },
      {
        factor: "Credit utilization",
        impact: "neutral",
      },
      {
        factor: "Length of credit history",
        impact: "positive",
      },
    ],
  }
}

// Calculate financial strength score
export function calculateFinancialStrength(
  creditScore: number,
  annualIncome: number,
  monthlyRent: number,
  totalDebt = 0,
): FinancialStrength {
  const monthlyIncome = annualIncome / 12
  const rentToIncomeRatio = (monthlyRent / monthlyIncome) * 100
  const debtToIncomeRatio = (totalDebt / 12 / monthlyIncome) * 100

  let score = 0

  // Credit score component (40%)
  if (creditScore >= 750) score += 40
  else if (creditScore >= 700) score += 35
  else if (creditScore >= 650) score += 25
  else if (creditScore >= 600) score += 15
  else score += 5

  // Rent to income ratio component (30%)
  if (rentToIncomeRatio <= 25) score += 30
  else if (rentToIncomeRatio <= 30) score += 25
  else if (rentToIncomeRatio <= 35) score += 15
  else if (rentToIncomeRatio <= 40) score += 10
  else score += 5

  // Debt to income ratio component (30%)
  if (debtToIncomeRatio <= 20) score += 30
  else if (debtToIncomeRatio <= 35) score += 25
  else if (debtToIncomeRatio <= 43) score += 15
  else score += 5

  let recommendation: "strong" | "acceptable" | "risky" | "decline"
  if (score >= 85) recommendation = "strong"
  else if (score >= 65) recommendation = "acceptable"
  else if (score >= 45) recommendation = "risky"
  else recommendation = "decline"

  return {
    score,
    creditScore,
    debtToIncomeRatio,
    rentToIncomeRatio,
    savingsVerified: true,
    employmentStable: true,
    recommendation,
  }
}

// Verify income from documents
export function verifyIncome(annualIncome: number, documents: any[]): IncomeVerification {
  return {
    verified: true,
    annualIncome,
    monthlyIncome: annualIncome / 12,
    employer: "Tech Corp Inc.",
    employmentType: "Full-time",
    yearsEmployed: 3,
    payStubs: [
      {
        date: "2024-12-15",
        grossPay: annualIncome / 24,
        netPay: (annualIncome / 24) * 0.75,
        verified: true,
      },
      {
        date: "2024-11-30",
        grossPay: annualIncome / 24,
        netPay: (annualIncome / 24) * 0.75,
        verified: true,
      },
      {
        date: "2024-11-15",
        grossPay: annualIncome / 24,
        netPay: (annualIncome / 24) * 0.75,
        verified: true,
      },
    ],
    bankStatements: [
      {
        month: "December 2024",
        averageBalance: annualIncome / 6,
        verified: true,
      },
      {
        month: "November 2024",
        averageBalance: annualIncome / 6,
        verified: true,
      },
    ],
  }
}

// Perform background check
export function performBackgroundCheck(userId: string): BackgroundCheck {
  return {
    passed: true,
    criminalHistory: false,
    evictionHistory: false,
    rentalHistory: [
      {
        landlord: "Previous Property Management",
        address: "456 Oak St, Los Angeles, CA",
        duration: "2 years",
        rating: "excellent",
      },
    ],
    completedDate: new Date(),
  }
}
