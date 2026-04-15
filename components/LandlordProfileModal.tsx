"use client"

import { useEffect, useState } from "react"
import { X, Star, Phone, Mail, Home, MapPin, Bed, Bath, Ruler, DollarSign, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface Landlord {
  id: string
  name: string
  email: string
  phone: string
  rating: number
  totalProperties: number
  responseTime: string
  joinDate: string
  verified: boolean
  avatar?: string
}

interface Property {
  id: string
  title: string
  address: string
  rent: number
  bedrooms: number
  bathrooms: number
  sqft: number
  type: string
  status: 'available' | 'rented'
  image: string
}

interface LandlordProfileModalProps {
  isOpen: boolean
  onClose: () => void
  landlordId: string
}

export default function LandlordProfileModal({ isOpen, onClose, landlordId }: LandlordProfileModalProps) {
  const [landlord, setLandlord] = useState<Landlord | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && landlordId) {
      fetchLandlordData()
    }
    // eslint-disable-next-line
  }, [isOpen, landlordId])

  const fetchLandlordData = async () => {
    setLoading(true)
    try {
      // Fetch landlord data
      const landlordRes = await fetch(`/api/landlords/${landlordId}`)
      const landlordData = await landlordRes.json()
      
      if (landlordData.success) {
        setLandlord(landlordData.landlord)
      }

      // Fetch landlord's properties
      const propertiesRes = await fetch(`/api/landlords/${landlordId}/properties`)
      const propertiesData = await propertiesRes.json()
      
      if (propertiesData.success) {
        setProperties(propertiesData.properties)
      }
    } catch (error) {
      // Mock data for demo
      setLandlord({
        id: landlordId,
        name: "John Mwangi",
        email: "john.mwangi@propertyflow.co.tz",
        phone: "+255 712 345 678",
        rating: 4.8,
        totalProperties: 12,
        responseTime: "Within 2 hours",
        joinDate: "2022",
        verified: true,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
      })
      setProperties([
        {
          id: "1",
          title: "Modern Downtown Loft",
          address: "Masaki Peninsula, Dar es Salaam",
          rent: 625000,
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1200,
          type: "Loft",
          status: "available",
          image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
        },
        {
          id: "2",
          title: "Beachfront Villa",
          address: "Kunduchi, Dar es Salaam",
          rent: 1200000,
          bedrooms: 4,
          bathrooms: 3,
          sqft: 2800,
          type: "Villa",
          status: "rented",
          image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80"
        },
        {
          id: "3",
          title: "City View Apartment",
          address: "Mikocheni, Dar es Salaam",
          rent: 450000,
          bedrooms: 1,
          bathrooms: 1,
          sqft: 850,
          type: "Apartment",
          status: "available",
          image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
        },
        {
          id: "4",
          title: "Garden Studio",
          address: "Oysterbay, Dar es Salaam",
          rent: 350000,
          bedrooms: 1,
          bathrooms: 1,
          sqft: 650,
          type: "Studio",
          status: "available",
          image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold">Landlord Profile</h2>
                <p className="text-muted-foreground">Properties listed by this landlord</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {loading ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Landlord Info */}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={landlord?.avatar || `https://ui-avatars.com/api/?name=${landlord?.name}&background=4F46E5&color=fff&size=200`}
                        alt={landlord?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {landlord?.verified && (
                      <div className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-white">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-3xl font-bold mb-2">{landlord?.name}</h3>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(landlord?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="ml-2 font-medium">{landlord?.rating}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">Landlord since {landlord?.joinDate}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                          <Phone className="h-4 w-4" />
                          Call
                        </Button>
                        <Button className="gap-2">
                          <Mail className="h-4 w-4" />
                          Message
                        </Button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        {landlord?.totalProperties ? (
                          <div className="text-2xl font-bold text-primary">{landlord.totalProperties}</div>
                        ) : null}
                        <div className="text-sm text-muted-foreground">Properties</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {properties.filter(p => p.status === 'rented').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Rented</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {properties.filter(p => p.status === 'available').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Available</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{landlord?.responseTime}</div>
                        <div className="text-sm text-muted-foreground">Response Time</div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{landlord?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{landlord?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">All Properties</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {properties.length} properties
                    </Badge>
                  </div>
                </div>

                <Separator className="mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-b from-white to-primary/5">
                      {/* Property Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <Badge 
                          className={`absolute top-3 right-3 ${property.status === 'available' ? 'bg-green-500' : 'bg-amber-500'} border-0`}
                        >
                          {property.status === 'available' ? 'Available' : 'Rented'}
                        </Badge>
                      </div>

                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{property.address}</span>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-0">
                        {/* Property Stats */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Bed className="h-4 w-4 text-primary" />
                              <span className="font-medium">{property.bedrooms}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="h-4 w-4 text-primary" />
                              <span className="font-medium">{property.bathrooms}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Ruler className="h-4 w-4 text-primary" />
                              <span className="font-medium">{property.sqft}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-white/80">
                            {property.type}
                          </Badge>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-primary">
                              Tsh {property.rent.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">per month</p>
                          </div>
                          <Link href={`/tenant/properties/${property.id}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
