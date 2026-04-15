import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Shield, AlertCircle } from "lucide-react"
import type { CreditReport } from "@/lib/services/credit-service"

interface CreditReportCardProps {
  report: CreditReport
}

export function CreditReportCard({ report }: CreditReportCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 740) return "text-accent"
    if (score >= 670) return "text-primary"
    if (score >= 580) return "text-yellow-500"
    return "text-destructive"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 740) return "Excellent"
    if (score >= 670) return "Good"
    if (score >= 580) return "Fair"
    return "Poor"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Credit Report
            </CardTitle>
            <CardDescription>Last updated: {report.reportDate.toLocaleDateString()}</CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(report.score)}`}>{report.score}</div>
            <Badge variant="secondary" className="mt-1">
              {getScoreLabel(report.score)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Factors */}
        <div>
          <h4 className="font-semibold mb-3">Score Factors</h4>
          <div className="space-y-2">
            {report.scoreFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{factor.factor}</span>
                <div className="flex items-center gap-2">
                  {factor.impact === "positive" ? (
                    <TrendingUp className="h-4 w-4 text-accent" />
                  ) : factor.impact === "negative" ? (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Neutral</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Summary */}
        <div>
          <h4 className="font-semibold mb-3">Account Summary</h4>
          <div className="space-y-3">
            {report.accountHistory.map((account, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{account.type}</span>
                  <Badge variant={account.status === "Open" ? "default" : "secondary"}>{account.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Balance: ${account.balance.toLocaleString()}</span>
                  <span>{account.paymentHistory}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        {report.riskFactors.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              Risk Factors
            </h4>
            <div className="space-y-2">
              {report.riskFactors.map((risk, index) => (
                <div
                  key={index}
                  className="p-3 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm"
                >
                  {risk}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Inquiries */}
        {report.inquiries.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Recent Inquiries</h4>
            <div className="space-y-2">
              {report.inquiries.map((inquiry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{inquiry.creditor}</span>
                  <span className="text-xs">{inquiry.date.toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
