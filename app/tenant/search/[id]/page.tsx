"use client"

import Link from "next/link"
import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  Calendar,
  DollarSign,
  Home,
  Shield,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Wind,
  ArrowLeft,
  Heart,
} from "lucide-react"

const LandlordProfileModal = dynamic(() => import("@/components/LandlordProfileModal"), { ssr: false })

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  // Mock property data - in real app, fetch based on params.id
  // Mock landlord ID for demonstration
  const landlordId = "john-mwangi"; // In real app, use property.landlord.id or similar
  const [showLandlordModal, setShowLandlordModal] = useState(false)
  const property = {
    id: params.id,
    title: "Modern Downtown Loft",
    address: "Masaki Peninsula, Dar es Salaam",
    rent: 625000,
    securityDeposit: 625000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: "Loft",
    available: "Available Now",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&q=80",
    ],
    amenities: [
      { name: "High-Speed WiFi", icon: Wifi },
      { name: "Parking Included", icon: Car },
      { name: "Swimming Pool", icon: Waves },
      { name: "Fitness Center", icon: Dumbbell },
      { name: "Air Conditioning", icon: Wind },
      { name: "Security", icon: Shield },
    ],
    description:
      "Beautiful modern loft in the heart of Masaki Peninsula. This spacious 2-bedroom apartment features high ceilings, large windows with natural light, and a contemporary open floor plan. The unit has been recently renovated with premium finishes throughout.",
    features: [
      "Hardwood floors throughout",
      "Stainless steel appliances",
      "In-unit washer and dryer",
      "Walk-in closets",
      "Private balcony with city views",
      "Central heating and cooling",
      "Pet friendly (with deposit)",
      "24/7 maintenance support",
    ],
    landlord: {
      name: "John Mwangi",
      phone: "+255 712 345 678",
      email: "john.mwangi@propertyflow.co.tz",
      responseTime: "Within 2 hours",
      rating: 4.8,
      properties: 12,
    },
    neighborhood:
      "Masaki Peninsula is one of Dar es Salaam's most prestigious neighborhoods, known for its diplomatic residences, international schools, and vibrant dining scene. Located along the coast, it offers beautiful ocean views and easy access to the city center.",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/tenant/search">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </Link>

        {/* Image Gallery - Main image opens landlord modal */}
        <div className="grid grid-cols-4 gap-2 mb-6 h-[300px] md:h-[400px] rounded-xl overflow-hidden">
          <div className="col-span-4 md:col-span-2 md:row-span-2 relative">
            <img
              src={property.images[0] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
              title="View all properties by this landlord"
              onClick={() => setShowLandlordModal(true)}
            />
          </div>
          {property.images.slice(1).map((image, idx) => (
            <div key={idx} className="hidden md:block relative">
              <img
                src={image || "/placeholder.svg"}
                alt={`${property.title} view ${idx + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Landlord Profile Modal */}
        <LandlordProfileModal isOpen={showLandlordModal} onClose={() => setShowLandlordModal(false)} landlordId={landlordId} />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{property.type}</Badge>
                    <Badge variant="secondary">{property.available}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {property.address}
                  </p>
                </div>
                <Button size="icon" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-6 mt-4 text-lg">
                <span className="flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  {property.bedrooms} Bedrooms
                </span>
                <span className="flex items-center gap-2">
                  <Bath className="h-5 w-5" />
                  {property.bathrooms} Bathrooms
                </span>
                <span className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  {property.sqft} sqft
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-3">About This Property</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold mb-3">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, idx) => {
                  const Icon = amenity.icon
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{amenity.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Neighborhood */}
            <div>
              <h2 className="text-2xl font-bold mb-3">About the Neighborhood</h2>
              <p className="text-muted-foreground leading-relaxed">{property.neighborhood}</p>
            </div>

            {/* Landlord Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{property.landlord.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{property.landlord.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{property.landlord.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Response Time</p>
                      <p className="font-medium">{property.landlord.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Properties Listed</p>
                      <p className="font-medium">{property.landlord.properties}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Rental Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-primary">Tsh {property.rent.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Security Deposit
                    </span>
                    <span className="font-medium">Tsh {property.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Available
                    </span>
                    <span className="font-medium">{property.available}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Property Type
                    </span>
                    <span className="font-medium">{property.type}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Link href={`/tenant/search/${property.id}/apply`}>
                    <Button className="w-full" size="lg">
                      Rent Now
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full bg-transparent">
                    Schedule Tour
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Heart className="h-4 w-4 mr-2" />
                    Save Property
                  </Button>
                </div>

                <div className="pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground">
                    By applying, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
