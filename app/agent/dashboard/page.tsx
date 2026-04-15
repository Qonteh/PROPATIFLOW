import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Briefcase, Users, DollarSign, TrendingUp, CheckCircle, Home, Target, Award, Calendar } from "lucide-react"
import Link from "next/link"

export default function AgentDashboardPage() {
  // Mock data
  const stats = {
    activeDeals: 12,
    totalClients: 45,
    monthlyCommission: 4625000,
    closedDeals: 8,
    averageCommissionRate: 3.5,
  }

  const monthlyGoal = 6250000
  const goalProgress = (stats.monthlyCommission / monthlyGoal) * 100

  const activeDeals = [
    {
      id: "1",
      property: "Sunset Apartments - Unit 204",
      client: "Sarah Johnson (Tenant)",
      landlord: "John Smith",
      status: "negotiation",
      rent: 450000,
      commission: 22500,
      stage: "Under Review",
      lastUpdate: "2 hours ago",
    },
    {
      id: "2",
      property: "Downtown Lofts - Unit 12",
      client: "Michael Chen (Tenant)",
      landlord: "Lisa Anderson",
      status: "application",
      rent: 625000,
      commission: 31250,
      stage: "Application Submitted",
      lastUpdate: "1 day ago",
    },
    {
      id: "3",
      property: "Garden View Condos - Unit 5A",
      client: "Robert Brown (Landlord)",
      tenant: "Emma Wilson",
      status: "closing",
      rent: 550000,
      commission: 27500,
      stage: "Lease Signing",
      lastUpdate: "3 hours ago",
    },
  ]

  const recentActivity = [
    {
      type: "deal_closed",
      message: "Deal closed for Riverside Townhomes",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-accent",
    },
    {
      type: "new_client",
      message: "New client inquiry from David Martinez",
      time: "5 hours ago",
      icon: Users,
      color: "text-primary",
    },
    {
      type: "commission",
      message: "Commission payment received - Tsh 525,000",
      time: "1 day ago",
      icon: DollarSign,
      color: "text-accent",
    },
    {
      type: "meeting",
      message: "Meeting scheduled with Sarah Johnson",
      time: "2 days ago",
      icon: Calendar,
      color: "text-primary",
    },
  ]

  const topProperties = [
    { property: "Sunset Apartments", deals: 5, revenue: 2362500 },
    { property: "Downtown Lofts", deals: 3, revenue: 1968750 },
    { property: "Garden View Condos", deals: 4, revenue: 2310000 },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Agent Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Track your deals, commissions, and client relationships
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeals}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-accent">+5 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tsh {(stats.monthlyCommission / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-accent">+22% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Deals</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closedDeals}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goal Progress */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Monthly Goal
              </CardTitle>
              <CardDescription>Track your progress towards your commission goal</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {goalProgress.toFixed(0)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={goalProgress} className="mb-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Tsh {stats.monthlyCommission.toLocaleString()} / Tsh {monthlyGoal.toLocaleString()}
            </span>
            <span className="font-medium text-accent">
              Tsh {(monthlyGoal - stats.monthlyCommission).toLocaleString()} to go
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 mb-6 md:mb-8">
        {/* Active Deals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Deals</CardTitle>
                <CardDescription>Deals currently in progress</CardDescription>
              </div>
              <Link href="/agent/deals">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="font-medium">{deal.property}</p>
                        <p className="text-sm text-muted-foreground">{deal.client}</p>
                      </div>
                      <Badge
                        variant={
                          deal.status === "closing"
                            ? "default"
                            : deal.status === "negotiation"
                              ? "secondary"
                              : "outline"
                        }
                        className="whitespace-nowrap"
                      >
                        {deal.stage}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-muted-foreground">{deal.lastUpdate}</span>
                      <span className="font-medium text-accent">
                        Commission: Tsh {deal.commission.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 mb-6 md:mb-8">
        {/* Top Performing Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing Properties
            </CardTitle>
            <CardDescription>Properties with most deals this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProperties.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{item.property}</p>
                    <p className="text-sm text-muted-foreground">{item.deals} deals closed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">Tsh {item.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Your key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="text-sm font-bold">68%</span>
                </div>
                <Progress value={68} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Client Satisfaction</span>
                  <span className="text-sm font-bold">92%</span>
                </div>
                <Progress value={92} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm font-bold">95%</span>
                </div>
                <Progress value={95} />
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Commission Rate</span>
                  <span className="text-lg font-bold text-primary">{stats.averageCommissionRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-xs md:text-sm">Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
            <Link href="/agent/clients/new">
              <Button className="w-full h-auto flex-col gap-2 py-6 bg-transparent" variant="outline">
                <Users className="h-6 w-6" />
                <span>Add New Client</span>
              </Button>
            </Link>
            <Link href="/agent/deals">
              <Button className="w-full h-auto flex-col gap-2 py-6 bg-transparent" variant="outline">
                <Briefcase className="h-6 w-6" />
                <span>View All Deals</span>
              </Button>
            </Link>
            <Link href="/agent/properties">
              <Button className="w-full h-auto flex-col gap-2 py-6 bg-transparent" variant="outline">
                <Home className="h-6 w-6" />
                <span>Browse Properties</span>
              </Button>
            </Link>
            <Link href="/agent/commissions">
              <Button className="w-full h-auto flex-col gap-2 py-6 bg-transparent" variant="outline">
                <DollarSign className="h-6 w-6" />
                <span>Commission Report</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
