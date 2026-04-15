"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp, Calendar, CreditCard, AlertCircle } from "lucide-react"

interface CreditScoreReportDialogProps {
  creditScore: number
  children?: React.ReactNode
}

export function CreditScoreReportDialog({ creditScore, children }: CreditScoreReportDialogProps) {
  // Credit score breakdown factors
  const creditFactors = [
    {
      name: "Payment History",
      score: 98,
      weight: 35,
      status: "excellent",
      description: "No missed payments in 24 months",
      icon: CheckCircle,
    },
    {
      name: "Credit Utilization",
      score: 85,
      weight: 30,
      status: "good",
      description: "Using 25% of available credit",
      icon: CreditCard,
    },
    {
      name: "Length of Credit History",
      score: 72,
      weight: 15,
      status: "good",
      description: "5 years average account age",
      icon: Calendar,
    },
    {
      name: "Credit Mix",
      score: 80,
      weight: 10,
      status: "good",
      description: "Good variety of credit types",
      icon: TrendingUp,
    },
    {
      name: "New Credit Inquiries",
      score: 90,
      weight: 10,
      status: "excellent",
      description: "Only 1 inquiry in last 6 months",
      icon: AlertCircle,
    },
  ]

  const getStatusColor = (status: string) => {
    if (status === "excellent") return "text-green-600 bg-green-50"
    if (status === "good") return "text-blue-600 bg-blue-50"
    if (status === "fair") return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getStatusBadgeVariant = (status: string) => {
    if (status === "excellent") return "default"
    return "secondary"
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children || <Button variant="outline">View Full Report</Button>}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Credit Score Breakdown</DialogTitle>
          <DialogDescription>
            Detailed breakdown of your credit score components and how they contribute to your overall score
          </DialogDescription>
        </DialogHeader>

        {/* Overall Score */}
        <Card className="border-2 bg-gradient-to-br from-accent/10 to-white">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-accent mb-2">{creditScore}</div>
              <Badge className="mb-2 font-semibold">Excellent</Badge>
              <p className="text-sm text-muted-foreground">Last updated: Dec 24, 2024</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">Score Range</p>
              <div className="flex items-center gap-2 text-xs">
                <span>300</span>
                <Progress value={(creditScore - 300) / 5.5} className="flex-1 h-2" />
                <span>850</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Factors Breakdown */}
        <div className="space-y-3 mt-4">
          <h3 className="font-bold text-base">What Makes Up Your Score</h3>
          {creditFactors.map((factor, index) => {
            const Icon = factor.icon
            return (
              <Card key={index} className="border-2">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${getStatusColor(factor.status)}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{factor.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{factor.score}/100</span>
                          <Badge variant={getStatusBadgeVariant(factor.status)} className="text-xs font-semibold">
                            {factor.weight}% weight
                          </Badge>
                        </div>
                      </div>
                      <Progress value={factor.score} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">{factor.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tips Section */}
        <Card className="border-2 bg-blue-50/50 mt-4">
          <CardContent className="pt-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              How to Improve Your Score
            </h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>Continue making all payments on time to maintain excellent payment history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>Keep credit utilization below 30% by paying down balances</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>Avoid opening new credit accounts unless necessary to minimize hard inquiries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>Maintain a mix of credit types for a well-rounded credit profile</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
