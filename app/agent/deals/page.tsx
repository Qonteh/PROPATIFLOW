import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Home, Users, DollarSign, Clock, CheckCircle } from "lucide-react"

export default function AgentDealsPage() {
  // Mock data
  const deals = {
    active: [
      {
        id: "1",
        property: "Sunset Apartments - Unit 204",
        client: "Sarah Johnson",
        clientType: "Tenant",
        landlord: "John Smith",
        status: "negotiation",
        stage: "Under Review",
        rent: 450000,
        commission: 22500,
        startDate: "Dec 15, 2024",
        expectedClose: "Jan 5, 2025",
        progress: 60,
      },
      {
        id: "2",
        property: "Downtown Lofts - Unit 12",
        client: "Michael Chen",
        clientType: "Tenant",
        landlord: "Lisa Anderson",
        status: "application",
        stage: "Application Submitted",
        rent: 625000,
        commission: 31250,
        startDate: "Dec 18, 2024",
        expectedClose: "Jan 8, 2025",
        progress: 40,
      },
      {
        id: "3",
        property: "Garden View Condos - Unit 5A",
        client: "Emma Wilson",
        clientType: "Tenant",
        landlord: "Robert Brown",
        status: "closing",
        stage: "Lease Signing",
        rent: 550000,
        commission: 27500,
        startDate: "Dec 10, 2024",
        expectedClose: "Dec 28, 2024",
        progress: 90,
      },
    ],
    pending: [
      {
        id: "4",
        property: "Riverside Townhomes - Unit 8",
        client: "David Martinez",
        clientType: "Tenant",
        status: "pending",
        stage: "Initial Contact",
        rent: 700000,
        commission: 35000,
        startDate: "Dec 22, 2024",
        progress: 10,
      },
    ],
    closed: [
      {
        id: "5",
        property: "Oak Street Houses - Unit 3",
        client: "Jennifer Lee",
        clientType: "Tenant",
        landlord: "Mark Wilson",
        status: "closed",
        stage: "Completed",
        rent: 475000,
        commission: 23750,
        startDate: "Nov 15, 2024",
        closeDate: "Dec 15, 2024",
      },
      {
        id: "6",
        property: "Park Avenue Apartments - Unit 12B",
        client: "Thomas Brown",
        clientType: "Landlord",
        tenant: "Alice Johnson",
        status: "closed",
        stage: "Completed",
        rent: 575000,
        commission: 28750,
        startDate: "Nov 20, 2024",
        closeDate: "Dec 18, 2024",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "closing":
        return "bg-accent/10 text-accent"
      case "negotiation":
        return "bg-primary/10 text-primary"
      case "application":
        return "bg-blue-500/10 text-blue-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "closed":
        return "bg-green-500/10 text-green-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Deals Pipeline</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage all your active and completed deals</p>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <Users className="h-4 w-4" />
            New Deal
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search deals..." className="pl-10 text-sm md:text-base" />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4 md:space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-grid">
          <TabsTrigger value="active" className="text-xs md:text-sm">
            Active ({deals.active.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs md:text-sm">
            Pending ({deals.pending.length})
          </TabsTrigger>
          <TabsTrigger value="closed" className="text-xs md:text-sm">
            Closed ({deals.closed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3 md:space-y-4">
          {deals.active.map((deal) => (
            <Card key={deal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start flex-col sm:flex-row sm:items-center gap-2 md:gap-3 mb-2">
                      <CardTitle className="text-base md:text-xl">{deal.property}</CardTitle>
                      <Badge className={`${getStatusColor(deal.status)} text-xs`}>{deal.stage}</Badge>
                    </div>
                    <CardDescription className="text-xs md:text-sm">
                      Started {deal.startDate} • Expected: {deal.expectedClose}
                    </CardDescription>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xl md:text-2xl font-bold text-primary">Tsh {deal.commission.toLocaleString()}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Commission</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm text-muted-foreground">Client ({deal.clientType})</p>
                      <p className="font-medium text-sm md:text-base truncate">{deal.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Home className="h-5 w-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm text-muted-foreground">Landlord</p>
                      <p className="font-medium text-sm md:text-base truncate">{deal.landlord}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm text-muted-foreground">Monthly Rent</p>
                      <p className="font-medium text-sm md:text-base">Tsh {deal.rent.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground">Deal Progress</span>
                    <span className="font-medium">{deal.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${deal.progress}%` }} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button variant="outline" className="flex-1 bg-transparent text-sm">
                    View Details
                  </Button>
                  <Button className="flex-1 text-sm">Update Status</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {deals.pending.map((deal) => (
            <Card key={deal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{deal.property}</CardTitle>
                      <Badge className={getStatusColor(deal.status)}>
                        <Clock className="h-3 w-3 mr-1" />
                        {deal.stage}
                      </Badge>
                    </div>
                    <CardDescription>Started {deal.startDate}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">Tsh {deal.commission.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Potential Commission</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Client ({deal.clientType})</p>
                      <p className="font-medium">{deal.client}</p>
                    </div>
                  </div>
                  <Button>Follow Up</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          {deals.closed.map((deal) => (
            <Card key={deal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{deal.property}</CardTitle>
                      <Badge className={getStatusColor(deal.status)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {deal.stage}
                      </Badge>
                    </div>
                    <CardDescription>
                      {deal.startDate} - {deal.closeDate}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">Tsh {deal.commission.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Commission Earned</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-medium">{deal.client}</p>
                    </div>
                    {deal.landlord && (
                      <div>
                        <p className="text-sm text-muted-foreground">Landlord</p>
                        <p className="font-medium">{deal.landlord}</p>
                      </div>
                    )}
                    {deal.tenant && (
                      <div>
                        <p className="text-sm text-muted-foreground">Tenant</p>
                        <p className="font-medium">{deal.tenant}</p>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="bg-transparent">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
