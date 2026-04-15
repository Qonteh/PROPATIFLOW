"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, CheckCircle, Clock, Download, Calendar } from "lucide-react"
import { useState } from "react"

export default function CommissionsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Mock data showing relationships between tenant, landlord, and agent
  const commissionStats = {
    thisMonth: 4625000,
    lastMonth: 3787500,
    pending: 1125000,
    paid: 3500000,
    yearToDate: 18750000,
  }

  const growthRate = ((commissionStats.thisMonth - commissionStats.lastMonth) / commissionStats.lastMonth) * 100

  const commissionHistory = [
    {
      id: "1",
      property: "Sunset Apartments - Unit 204",
      tenant: "Sarah Johnson",
      landlord: "John Smith",
      dealType: "New Lease",
      rent: 450000,
      commissionRate: 5,
      commission: 22500,
      status: "paid",
      date: "Dec 28, 2024",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "2",
      property: "Downtown Lofts - Unit 12",
      tenant: "Michael Chen",
      landlord: "Lisa Anderson",
      dealType: "New Lease",
      rent: 625000,
      commissionRate: 5,
      commission: 31250,
      status: "paid",
      date: "Dec 25, 2024",
      paymentMethod: "Mobile Money",
    },
    {
      id: "3",
      property: "Garden View Condos - Unit 5A",
      tenant: "Emma Wilson",
      landlord: "Robert Brown",
      dealType: "Renewal",
      rent: 550000,
      commissionRate: 5,
      commission: 27500,
      status: "paid",
      date: "Dec 20, 2024",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "4",
      property: "Riverside Townhomes - Unit 8",
      tenant: "David Martinez",
      landlord: "Patricia Lee",
      dealType: "New Lease",
      rent: 700000,
      commissionRate: 5,
      commission: 35000,
      status: "pending",
      date: "Dec 30, 2024",
      paymentMethod: "Pending",
    },
    {
      id: "5",
      property: "Lakeside Apartments - Unit 15",
      tenant: "Jessica Taylor",
      landlord: "James Wilson",
      dealType: "New Lease",
      rent: 475000,
      commissionRate: 5,
      commission: 23750,
      status: "pending",
      date: "Dec 29, 2024",
      paymentMethod: "Pending",
    },
    {
      id: "6",
      property: "City Center Condos - Unit 22",
      tenant: "Christopher Lee",
      landlord: "Nancy Garcia",
      dealType: "New Lease",
      rent: 575000,
      commissionRate: 5,
      commission: 28750,
      status: "paid",
      date: "Dec 15, 2024",
      paymentMethod: "Bank Transfer",
    },
  ]

  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all")

  const filteredCommissions = commissionHistory.filter((commission) => {
    if (filter === "all") return true
    return commission.status === filter
  })

  const monthlyBreakdown = [
    { month: "Jan", amount: 2875000 },
    { month: "Feb", amount: 3125000 },
    { month: "Mar", amount: 3625000 },
    { month: "Apr", amount: 3875000 },
    { month: "May", amount: 4125000 },
    { month: "Jun", amount: 3950000 },
    { month: "Jul", amount: 4225000 },
    { month: "Aug", amount: 4375000 },
    { month: "Sep", amount: 3787500 },
    { month: "Oct", amount: 4125000 },
    { month: "Nov", amount: 3787500 },
    { month: "Dec", amount: 4625000 },
  ]

  const maxAmount = Math.max(...monthlyBreakdown.map((m) => m.amount))

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Commission Report</h1>
            <p className="text-sm md:text-base text-muted-foreground">Track your earnings from completed deals</p>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-5 mb-6 md:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Tsh {(commissionStats.thisMonth / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-accent flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />+{growthRate.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Last Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Tsh {(commissionStats.lastMonth / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Tsh {(commissionStats.paid / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-accent">Received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Tsh {(commissionStats.pending / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Year to Date</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              Tsh {(commissionStats.yearToDate / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">2024 total</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card className="mb-6 md:mb-8">
        <CardHeader>
          <CardTitle>Monthly Commission Trend</CardTitle>
          <CardDescription>Your commission earnings over the past 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {monthlyBreakdown.map((item) => (
              <div key={item.month} className="flex items-center gap-3">
                <span className="text-sm font-medium w-10">{item.month}</span>
                <div className="flex-1 flex items-center gap-2">
                  <Progress value={(item.amount / maxAmount) * 100} className="flex-1" />
                  <span className="text-sm font-medium w-24 text-right">Tsh {(item.amount / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Commission History</CardTitle>
              <CardDescription>Detailed breakdown of your commission payments</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={filter !== "all" ? "bg-transparent" : ""}
              >
                All
              </Button>
              <Button
                variant={filter === "paid" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("paid")}
                className={filter !== "paid" ? "bg-transparent" : ""}
              >
                Paid
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
                className={filter !== "pending" ? "bg-transparent" : ""}
              >
                Pending
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {filteredCommissions.map((commission) => (
              <Card key={commission.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="min-w-0">
                          <h3 className="font-bold text-base md:text-lg mb-1">{commission.property}</h3>
                          <div className="flex flex-wrap gap-2 text-xs md:text-sm text-muted-foreground">
                            <span>Tenant: {commission.tenant}</span>
                            <span>•</span>
                            <span>Landlord: {commission.landlord}</span>
                          </div>
                        </div>
                        <Badge variant={commission.status === "paid" ? "default" : "secondary"} className="self-start">
                          {commission.status === "paid" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Paid
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Deal Type</p>
                          <p className="font-medium">{commission.dealType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Monthly Rent</p>
                          <p className="font-medium">Tsh {commission.rent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Rate</p>
                          <p className="font-medium">{commission.commissionRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-medium">{commission.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 lg:gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-6">
                      <div className="text-left lg:text-right">
                        <p className="text-xs text-muted-foreground mb-1">Commission</p>
                        <p className="text-xl md:text-2xl font-bold text-primary">
                          Tsh {commission.commission.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{commission.paymentMethod}</p>
                      </div>
                      {commission.status === "pending" && (
                        <Button size="sm" variant="outline" className="bg-transparent">
                          Request Payment
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCommissions.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No commission records found for this filter</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
