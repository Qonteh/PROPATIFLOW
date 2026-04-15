"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, DollarSign, TrendingUp, CheckCircle, Clock } from "lucide-react"

export default function AgentPaymentsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const payments = [
    {
      id: "1",
      deal: "Sunset Apartments - Unit 204",
      client: "Sarah Johnson",
      type: "Commission",
      amount: 22500,
      status: "paid",
      paidDate: "Dec 20, 2024",
      method: "Bank Transfer",
    },
    {
      id: "2",
      deal: "Downtown Lofts - Unit 12",
      client: "Michael Chen",
      type: "Commission",
      amount: 31250,
      status: "pending",
      dueDate: "Jan 5, 2025",
      method: "Mobile Money",
    },
    {
      id: "3",
      deal: "Garden View Condos - Unit 5A",
      client: "Emma Wilson",
      type: "Commission",
      amount: 27500,
      status: "processing",
      expectedDate: "Dec 28, 2024",
      method: "Bank Transfer",
    },
    {
      id: "4",
      deal: "Riverside Townhomes - Unit 8",
      client: "David Martinez",
      type: "Bonus",
      amount: 15000,
      status: "paid",
      paidDate: "Dec 18, 2024",
      method: "Cash",
    },
  ]

  const stats = {
    totalEarned: 4625000,
    pendingPayments: 685000,
    thisMonth: 962500,
    lastMonth: 858750,
  }

  const growthRate = ((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100

  const filteredPayments =
    activeTab === "all"
      ? payments
      : activeTab === "pending"
        ? payments.filter((p) => p.status === "pending" || p.status === "processing")
        : payments.filter((p) => p.status === "paid")

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Payments & Commissions</h1>
            <p className="text-sm md:text-base text-muted-foreground">Track your earnings and payment history</p>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search payments..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4 mb-6 md:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tsh {(stats.totalEarned / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tsh {(stats.pendingPayments / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tsh {(stats.thisMonth / 1000).toFixed(0)}K</div>
            <p className="text-xs text-accent">+{growthRate.toFixed(1)}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tsh {(stats.lastMonth / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Previous period</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="space-y-4 md:space-y-6">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "all" ? "bg-background text-foreground shadow-sm" : ""
            }`}
          >
            All Payments
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "pending" ? "bg-background text-foreground shadow-sm" : ""
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "paid" ? "bg-background text-foreground shadow-sm" : ""
            }`}
          >
            Paid
          </button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {activeTab === "all" ? "Recent Payments" : activeTab === "pending" ? "Pending Payments" : "Paid Payments"}
            </CardTitle>
            <CardDescription className="text-sm">
              {activeTab === "all"
                ? "All commission and bonus payments"
                : activeTab === "pending"
                  ? "Payments awaiting processing"
                  : "Successfully received payments"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col lg:flex-row lg:items-center gap-4 p-3 md:p-4 rounded-lg border border-border"
                >
                  <div className="flex items-start gap-3 md:gap-4 flex-1">
                    <div
                      className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center shrink-0 ${
                        payment.status === "paid"
                          ? "bg-accent/10"
                          : payment.status === "processing"
                            ? "bg-primary/10"
                            : "bg-muted"
                      }`}
                    >
                      <DollarSign
                        className={`h-5 w-5 md:h-6 md:w-6 ${
                          payment.status === "paid"
                            ? "text-accent"
                            : payment.status === "processing"
                              ? "text-primary"
                              : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-medium text-sm md:text-base">{payment.client}</p>
                        <Badge
                          variant={
                            payment.status === "paid"
                              ? "default"
                              : payment.status === "processing"
                                ? "secondary"
                                : "outline"
                          }
                          className={`text-xs ${payment.status === "paid" ? "bg-accent/10 text-accent" : ""}`}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground">{payment.deal}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {payment.type} • {payment.method}
                        {payment.paidDate && ` • Paid: ${payment.paidDate}`}
                        {payment.dueDate && ` • Due: ${payment.dueDate}`}
                        {payment.expectedDate && ` • Expected: ${payment.expectedDate}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 lg:gap-2">
                    <p className="text-lg md:text-xl font-bold">Tsh {payment.amount.toLocaleString()}</p>
                    <Button size="sm" variant="outline" className="bg-transparent text-xs md:text-sm">
                      {payment.status === "paid" ? "Receipt" : "Details"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
