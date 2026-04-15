import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Shield, CheckCircle, AlertTriangle } from "lucide-react"
import type { FinancialStrength } from "@/lib/services/credit-service"

interface FinancialStrengthCardProps {
  strength: FinancialStrength
}

export function FinancialStrengthCard({ strength }: FinancialStrengthCardProps) {
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "strong":
        return "bg-accent/10 text-accent"
      case "acceptable":
        return "bg-primary/10 text-primary"
      case "risky":
        return "bg-yellow-500/10 text-yellow-500"
      case "decline":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case "strong":
        return <CheckCircle className="h-4 w-4" />
      case "acceptable":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Financial Strength Score
            </CardTitle>
            <CardDescription>Comprehensive financial assessment</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{strength.score}</div>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Rating</span>
            <Badge className={getRecommendationColor(strength.recommendation)}>
              {getRecommendationIcon(strength.recommendation)}
              <span className="ml-1 capitalize">{strength.recommendation}</span>
            </Badge>
          </div>
          <Progress value={strength.score} className="h-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Credit Score</p>
            <p className="text-2xl font-bold">{strength.creditScore}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Debt-to-Income</p>
            <p className="text-2xl font-bold">{strength.debtToIncomeRatio.toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Rent-to-Income</p>
            <p className="text-2xl font-bold">{strength.rentToIncomeRatio.toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Employment</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <p className="font-semibold">Stable</p>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div>
          <h4 className="font-semibold mb-3">Verification Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Savings Verified</span>
              {strength.savingsVerified ? (
                <CheckCircle className="h-4 w-4 text-accent" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Employment Stable</span>
              {strength.employmentStable ? (
                <CheckCircle className="h-4 w-4 text-accent" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </div>
        </div>

        {/* Recommendation Details */}
        <div
          className={`p-4 rounded-lg ${strength.recommendation === "strong" || strength.recommendation === "acceptable" ? "bg-accent/10" : "bg-yellow-500/10"}`}
        >
          <h4 className="font-semibold mb-2">Landlord Recommendation</h4>
          <p className="text-sm text-muted-foreground">
            {strength.recommendation === "strong" &&
              "This applicant demonstrates strong financial stability with excellent creditworthiness. Highly recommended for approval."}
            {strength.recommendation === "acceptable" &&
              "This applicant shows acceptable financial standing. May require additional security deposit or co-signer."}
            {strength.recommendation === "risky" &&
              "This applicant presents higher risk. Consider requiring a co-signer, higher security deposit, or additional verification."}
            {strength.recommendation === "decline" &&
              "This applicant does not meet minimum financial requirements. Declining is recommended."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
