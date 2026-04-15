"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, DollarSign, TrendingUp, TrendingDown, Download } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function LandlordReportsPage() {
  // Mock data for reports
  const financialData = {
    totalRevenue: 13125000,
    totalExpenses: 2850000,
    netIncome: 10275000,
    occupancyRate: 86.5,
    averageRent: 291667,
  }

  const monthlyData = [
    { month: "Jan", revenue: 12500000, expenses: 2500000 },
    { month: "Feb", revenue: 12800000, expenses: 2600000 },
    { month: "Mar", revenue: 13000000, expenses: 2700000 },
    { month: "Apr", revenue: 13125000, expenses: 2850000 },
  ]

  const propertyPerformance = [
    {
      name: "Sunset Apartments",
      units: 24,
      occupied: 22,
      revenue: 5200000,
      occupancyRate: 91.7,
    },
    {
      name: "Downtown Lofts",
      units: 18,
      occupied: 16,
      revenue: 4800000,
      occupancyRate: 88.9,
    },
    {
      name: "Garden View Condos",
      units: 10,
      occupied: 7,
      revenue: 3125000,
      occupancyRate: 70.0,
    },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Financial Reports</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Track your property performance and financial metrics
            </p>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-6 md:mb-8">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              Tsh {(financialData.totalRevenue / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">+12.5% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tsh {(financialData.totalExpenses / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-1">Maintenance & utilities</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Tsh {(financialData.netIncome / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-1">After expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.occupancyRate}%</div>
            <Progress value={financialData.occupancyRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tsh {financialData.averageRent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Per unit/month</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="mb-6 md:mb-8 bg-white">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Monthly Financial Trend</CardTitle>
          <CardDescription>Revenue vs Expenses over the last 4 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{data.month} 2025</span>
                  <span className="text-muted-foreground">
                    Net: Tsh {((data.revenue - data.expenses) / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-8 bg-primary/10 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-lg flex items-center justify-end pr-2"
                          style={{ width: `${(data.revenue / 15000000) * 100}%` }}
                        >
                          <span className="text-xs font-medium text-white">
                            Tsh {(data.revenue / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-16">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-red-500/80 rounded-lg flex items-center justify-end pr-2"
                          style={{ width: `${(data.expenses / 15000000) * 100}%` }}
                        >
                          <span className="text-xs font-medium text-white">
                            Tsh {(data.expenses / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-16">Expenses</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Performance */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Property Performance</CardTitle>
          <CardDescription>Individual property metrics and comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {propertyPerformance.map((property, index) => (
              <div key={index} className="p-4 rounded-lg border-2 border-border hover:border-primary transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg">{property.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {property.occupied} of {property.units} units occupied
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl md:text-2xl font-bold text-primary">
                      Tsh {(property.revenue / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-muted-foreground">Monthly revenue</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Occupancy Rate</span>
                    <span className="font-medium">{property.occupancyRate}%</span>
                  </div>
                  <Progress value={property.occupancyRate} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
