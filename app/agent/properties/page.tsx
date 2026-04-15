"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Filter, Building2, Users, DollarSign, Eye } from "lucide-react"
import { useState } from "react"

export default function AgentPropertiesPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Mock data for properties
  const properties = [
    {
      id: "1",
      title: "Sunset Apartments",
      address: "123 Sunset Blvd, Dar es Salaam",
      type: "Apartment",
      units: 24,
      availableUnits: 2,
      rent: 450000,
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      ],
      status: "available",
      landlord: "John Smith",
      commission: 5,
      views: 124,
    },
    {
      id: "2",
      title: "Downtown Lofts",
      address: "456 Main Street, Dar es Salaam",
      type: "Loft",
      units: 12,
      availableUnits: 3,
      rent: 625000,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      ],
      status: "available",
      landlord: "Lisa Anderson",
      commission: 5,
      views: 98,
    },
    {
      id: "3",
      title: "Garden View Condos",
      address: "789 Garden Ave, Arusha",
      type: "Condo",
      units: 16,
      availableUnits: 0,
      rent: 550000,
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      ],
      status: "rented",
      landlord: "Robert Brown",
      commission: 5,
      views: 156,
    },
    {
      id: "4",
      title: "Riverside Townhomes",
      address: "321 River Road, Mwanza",
      type: "Townhouse",
      units: 8,
      availableUnits: 2,
      rent: 700000,
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      ],
      status: "available",
      landlord: "Mary Johnson",
      commission: 5,
      views: 87,
    },
    {
      id: "5",
      title: "Ocean View Apartments",
      address: "555 Beach Road, Zanzibar",
      type: "Apartment",
      units: 20,
      availableUnits: 4,
      rent: 800000,
      images: [
        "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800&q=80",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      ],
      status: "available",
      landlord: "Ahmed Hassan",
      commission: 6,
      views: 203,
    },
    {
      id: "6",
      title: "Highlands Estate",
      address: "888 Mountain View, Arusha",
      type: "House",
      units: 5,
      availableUnits: 1,
      rent: 950000,
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
      ],
      status: "available",
      landlord: "Grace Mtui",
      commission: 6,
      views: 145,
    },
  ]

  const filteredProperties = properties.filter((property) => {
    if (activeTab === "available") return property.status === "available"
    if (activeTab === "rented") return property.status === "rented"
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/10 text-green-500"
      case "rented":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const stats = {
    total: properties.length,
    available: properties.filter((p) => p.status === "available").length,
    rented: properties.filter((p) => p.status === "rented").length,
    totalViews: properties.reduce((sum, p) => sum + p.views, 0),
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Properties</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Browse and manage available properties for your clients
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="p-3 md:p-4 lg:p-6 pb-2 md:pb-3">
              <CardDescription className="text-xs md:text-sm">Total Properties</CardDescription>
              <CardTitle className="text-xl md:text-2xl lg:text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-3 md:p-4 lg:p-6 pb-2 md:pb-3">
              <CardDescription className="text-xs md:text-sm">Available</CardDescription>
              <CardTitle className="text-xl md:text-2xl lg:text-3xl text-green-500">{stats.available}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-3 md:p-4 lg:p-6 pb-2 md:pb-3">
              <CardDescription className="text-xs md:text-sm">Rented</CardDescription>
              <CardTitle className="text-xl md:text-2xl lg:text-3xl text-muted-foreground">{stats.rented}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-3 md:p-4 lg:p-6 pb-2 md:pb-3">
              <CardDescription className="text-xs md:text-sm">Total Views</CardDescription>
              <CardTitle className="text-xl md:text-2xl lg:text-3xl text-primary">{stats.totalViews}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties..." className="pl-10 text-sm md:text-base" />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm md:text-base font-medium border-b-2 transition-colors ${
              activeTab === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 text-sm md:text-base font-medium border-b-2 transition-colors ${
              activeTab === "available"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Available ({stats.available})
          </button>
          <button
            onClick={() => setActiveTab("rented")}
            className={`px-4 py-2 text-sm md:text-base font-medium border-b-2 transition-colors ${
              activeTab === "rented"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Rented ({stats.rented})
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {filteredProperties.map((property) => {
          const potentialCommission = (property.rent * property.commission) / 100
          return (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Two-column image grid */}
              <div className="grid grid-cols-2 gap-1 h-48 md:h-56 lg:h-64 bg-muted relative">
                {property.images.map((image, idx) => (
                  <div key={idx} className="relative overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${property.title} - View ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
                <Badge
                  className={`absolute top-2 md:top-3 right-2 md:right-3 ${getStatusColor(property.status)} text-xs`}
                >
                  {property.status}
                </Badge>
                <Badge className="absolute top-2 md:top-3 left-2 md:left-3 bg-background/90 text-foreground border border-border text-xs">
                  {property.type}
                </Badge>
              </div>

              <CardHeader className="p-4 md:p-5 lg:p-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base md:text-lg lg:text-xl mb-1 truncate">{property.title}</CardTitle>
                    <CardDescription className="flex items-start gap-1 text-xs md:text-sm">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{property.address}</span>
                    </CardDescription>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg md:text-xl lg:text-2xl font-bold text-primary">
                      Tsh {property.rent.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 md:p-5 lg:p-6 pt-0">
                <div className="grid gap-3 grid-cols-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Units</p>
                      <p className="text-sm md:text-base font-medium">
                        {property.availableUnits}/{property.units}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Commission</p>
                      <p className="text-sm md:text-base font-medium truncate">
                        Tsh {potentialCommission.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Landlord</p>
                      <p className="text-sm md:text-base font-medium truncate">{property.landlord}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Eye className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Views</p>
                      <p className="text-sm md:text-base font-medium">{property.views}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent text-xs md:text-sm">
                    View Details
                  </Button>
                  <Button className="flex-1 text-xs md:text-sm" disabled={property.status === "rented"}>
                    {property.status === "available" ? "Show to Client" : "Fully Rented"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No properties found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  )
}
