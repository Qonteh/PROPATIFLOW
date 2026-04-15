"use client";


import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Bed, Bath, Ruler, DollarSign, Users, Loader2, ArrowLeft, Heart, Share2, Mail, Phone, Home, Wifi, Car, Waves, Dumbbell, Wind, Shield, Clock } from "lucide-react";

import { use } from "react";


export default function TenantPropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [landlordProperties, setLandlordProperties] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/properties/${id}`);
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok) throw new Error("Failed to fetch property");
        if (!contentType.includes("application/json")) throw new Error("Server returned non-JSON response.");
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Property not found");
        setProperty({
          ...data.property,
          rentAmount: Math.round(data.property.rent_amount),
          securityDeposit: Math.round(data.property.security_deposit ?? 0),
          propertyType: data.property.property_type,
          availableDate: data.property.available_from,
          squareFeet: data.property.area_sqft,
          occupiedUnits: data.property.occupied_units ?? 0,
          totalUnits: data.property.total_units ?? 1,
        });
        setApplications(data.applications || []);
        setTenants(data.tenants || []);
        setLandlordProperties(data.landlordProperties || []);
      } catch (err: any) {
        setError(err.message || "Error loading property");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Skeleton className="w-3/4 h-72 mb-8 rounded-2xl" />
        <div className="flex gap-4 w-full max-w-2xl">
          <Skeleton className="h-16 w-1/3 rounded-xl" />
          <Skeleton className="h-16 w-1/3 rounded-xl" />
          <Skeleton className="h-16 w-1/3 rounded-xl" />
        </div>
        <Skeleton className="w-full max-w-2xl h-40 mt-8 rounded-xl" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-500 font-semibold text-lg mb-2">{error || "Property not found."}</div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  // Helper: check if property is occupied
  const isOccupied = property && (property.status === "rented" || (property.occupiedUnits ?? 0) >= (property.totalUnits ?? 1));

  // Handler for Rent Now button
  const handleRentNow = () => {
    if (isOccupied) {
      alert("This property is already rented. You cannot rent an occupied property.");
      return;
    }
    // Proceed to form or application
    router.push(`/tenant/properties/${id}/apply`);
  };

  return (
    <div className="relative p-2 md:p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Hero Carousel & Actions */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl mb-8">
        <Carousel className="w-full h-80 md:h-[28rem]">
          <CarouselContent>
            {property.images?.length ? property.images.map((img: string, idx: number) => (
              <CarouselItem key={idx} className="h-80 md:h-[28rem]">
                <img
                  src={img && !img.startsWith('http') && !img.startsWith('/uploads/') ? `/uploads/${img}` : (img || "/placeholder.svg")}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              </CarouselItem>
            )) : (
              <CarouselItem className="h-80 md:h-[28rem] flex items-center justify-center bg-muted">
                <Home className="h-16 w-16 text-muted-foreground opacity-30" />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        {/* Overlayed Actions */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" className="backdrop-blur bg-white/70 hover:bg-primary/90 hover:text-white shadow">
                <Heart className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save to Favorites</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" className="backdrop-blur bg-white/70 hover:bg-primary/90 hover:text-white shadow">
                <Share2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
          <Button className="bg-primary text-white ml-2" onClick={handleRentNow} disabled={isOccupied}>
            Rent Now
          </Button>
        </div>
        {/* Overlayed Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/tenant/search">
            <Button size="icon" variant="outline" className="backdrop-blur bg-white/70 hover:bg-primary/90 hover:text-white shadow">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        {/* Overlayed Title & Address */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{property.title}</h1>
            <Badge
              variant={property.status === "available" ? "default" : "secondary"}
              className="bg-primary text-white text-base px-4 py-1 rounded-full shadow"
            >
              {property.status === "available" ? "Available" : "Rented"}
            </Badge>
          </div>
          <p className="text-white/90 flex items-center gap-2 text-lg drop-shadow">
            <MapPin className="h-5 w-5" />
            {property.address}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white/80 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <Bed className="h-7 w-7 text-primary mb-2" />
            <span className="text-2xl font-bold">{property.bedrooms}</span>
            <span className="text-sm text-muted-foreground">Bedrooms</span>
          </CardContent>
        </Card>
        <Card className="bg-white/80 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <Bath className="h-7 w-7 text-primary mb-2" />
            <span className="text-2xl font-bold">{property.bathrooms}</span>
            <span className="text-sm text-muted-foreground">Bathrooms</span>
          </CardContent>
        </Card>
        <Card className="bg-white/80 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <Ruler className="h-7 w-7 text-primary mb-2" />
            <span className="text-2xl font-bold">{property.squareFeet}</span>
            <span className="text-sm text-muted-foreground">Sq Ft</span>
          </CardContent>
        </Card>
        <Card className="bg-white/80 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-6">
            <DollarSign className="h-7 w-7 text-primary mb-2" />
            <span className="text-2xl font-bold">Tsh {property.rentAmount}</span>
            <span className="text-sm text-muted-foreground">Per Month</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-white/80 shadow rounded-xl">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="tenants">Current Tenants ({tenants.length})</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Property Info Card */}
            <Card className="bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Rent</span>
                  <span className="font-medium">Tsh {property.rentAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Security Deposit</span>
                  <span className="font-medium">Tsh {property.securityDeposit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available Date</span>
                  <span className="font-medium">{property.availableDate ? new Date(property.availableDate).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Occupancy</span>
                  <span className="font-medium">
                    {property.occupiedUnits ?? 0}/{property.totalUnits ?? 1} units
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Landlord Profile Card + All Properties */}
            {property.landlord && (
              <div className="space-y-4">
                <Card className="bg-white/90 shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={property.landlord.avatar || undefined} alt={property.landlord.name} />
                      <AvatarFallback>{property.landlord.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{property.landlord.name}</CardTitle>
                      <CardDescription className="text-xs">Landlord</CardDescription>
                      <div className="flex flex-col gap-1 mt-2">
                        <span className="text-sm"><Mail className="inline h-4 w-4 mr-1 text-primary" /> {property.landlord.email}</span>
                        <span className="text-sm"><Phone className="inline h-4 w-4 mr-1 text-primary" /> {property.landlord.phone}</span>
                        {property.landlord.responseTime && (
                          <span className="text-sm"><Clock className="inline h-4 w-4 mr-1 text-primary" /> Response: {property.landlord.responseTime}</span>
                        )}
                        <span className="text-sm"><Home className="inline h-4 w-4 mr-1 text-primary" /> Properties: {property.landlord.properties}</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                {/* All Properties by Landlord */}
                {landlordProperties.length > 0 && (
                  <Card className="bg-white/90 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base">Other Properties by {property.landlord.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {landlordProperties.map((lp) => (
                          <Link key={lp.id} href={`/tenant/properties/${lp.id}`} className="block group">
                            <div className="rounded-lg overflow-hidden h-40 mb-2 bg-muted">
                              <img
                                src={lp.images && lp.images.length > 0 ? (lp.images[0].startsWith('http') ? lp.images[0] : `/uploads/${lp.images[0]}`) : "/placeholder.svg"}
                                alt={lp.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-semibold text-primary text-base line-clamp-1">{lp.title}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {lp.address}</span>
                              <span className="text-xs text-muted-foreground">Tsh {lp.rent_amount?.toLocaleString()}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Extra Features Accordion */}
            {property.extra_features && (
              <Accordion type="single" collapsible className="bg-white/90 shadow-lg rounded-xl">
                <AccordionItem value="features">
                  <AccordionTrigger className="text-base font-semibold">Extra Features</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {property.extra_features.hasPublicToilet !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Public Toilet</span>
                        <span className="font-medium">{property.extra_features.hasPublicToilet ? 'Yes' : 'No'}</span>
                      </div>
                    )}
                    {property.extra_features.hasSubmeters !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Submeters</span>
                        <span className="font-medium">{property.extra_features.hasSubmeters ? 'Yes' : 'No'}</span>
                      </div>
                    )}
                    {property.extra_features.electricityBillType && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Electricity Bill Type</span>
                        <span className="font-medium">{property.extra_features.electricityBillType === 'shared' ? 'Shared/Main Meter' : 'Individual Meter'}</span>
                      </div>
                    )}
                    {property.extra_features.electricityBillAmount && property.extra_features.electricityBillType === 'shared' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Electricity Bill Amount</span>
                        <span className="font-medium">Tsh {property.extra_features.electricityBillAmount}</span>
                      </div>
                    )}
                    {property.extra_features.waterBillAmount && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Water Bill Amount</span>
                        <span className="font-medium">Tsh {property.extra_features.waterBillAmount}</span>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Description Card */}
            <Card className="bg-white/90 shadow-lg md:col-span-2">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">{property.description}</p>
              </CardContent>
            </Card>

            {/* Amenities Card */}
            <Card className="bg-white/90 shadow-lg md:col-span-2">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {property.amenities?.map((amenity: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center gap-1 px-3 py-1 rounded-full"
                    >
                      {(() => {
                        switch (amenity.toLowerCase()) {
                          case 'wifi': return <Wifi className="h-4 w-4" />
                          case 'parking': return <Car className="h-4 w-4" />
                          case 'pool': return <Waves className="h-4 w-4" />
                          case 'gym': return <Dumbbell className="h-4 w-4" />
                          case 'security': return <Shield className="h-4 w-4" />
                          case 'air conditioning': return <Wind className="h-4 w-4" />
                          default: return null
                        }
                      })()}
                      <span>{amenity}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <div className="space-y-4">
            {applications.length === 0 ? (
              <Card className="bg-white/90 shadow-lg">
                <CardContent className="py-8 flex flex-col items-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground">No applications yet.</span>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="multiple" className="space-y-2">
                {applications.map((app) => (
                  <AccordionItem key={app.id} value={String(app.id)} className="bg-white/90 shadow-lg rounded-xl">
                    <AccordionTrigger className="text-base font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {app.tenant}
                      <Badge
                        variant={app.status === "under_review" ? "default" : "secondary"}
                        className="ml-2 bg-primary text-white capitalize"
                      >
                        {app.status.replace("_", " ")}
                      </Badge>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                        <span>Credit: {app.creditScore}</span>
                        <span>Income: {app.income}</span>
                        <span>Submitted: {app.submittedDate}</span>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        View Application
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </TabsContent>

        {/* Tenants Tab */}
        <TabsContent value="tenants">
          <div className="space-y-4">
            {tenants.length === 0 ? (
              <Card className="bg-white/90 shadow-lg">
                <CardContent className="py-8 flex flex-col items-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground">No tenants yet.</span>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="multiple" className="space-y-2">
                {tenants.map((tenant) => (
                  <AccordionItem key={tenant.id} value={String(tenant.id)} className="bg-white/90 shadow-lg rounded-xl">
                    <AccordionTrigger className="text-base font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {tenant.name}
                      <Badge
                        variant={tenant.leaseSigned ? "default" : "secondary"}
                        className={tenant.leaseSigned ? "ml-2 bg-green-500 text-white" : "ml-2 bg-orange-400 text-white"}
                      >
                        {tenant.leaseSigned ? "Registered" : "Pending"}
                      </Badge>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                        <span>Unit: {tenant.unit}</span>
                        <span>Rent: ${tenant.rent}/mo</span>
                        <span>Lease: {tenant.leaseStart ? tenant.leaseStart : "-"} - {tenant.leaseEnd ? tenant.leaseEnd : "-"}</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
