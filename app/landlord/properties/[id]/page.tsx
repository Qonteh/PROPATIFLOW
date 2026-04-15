"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  DollarSign,
  Edit,
  Trash2,
  Users,
  Loader2,
  ArrowLeft,
  Calendar,
  Building2,
  Shield,
  Zap,
  Droplets,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  Home,
} from "lucide-react"
import Link from "next/link"

/* ───────────────────────── Image Gallery ───────────────────────── */

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  if (!images || images.length === 0) return null

  const resolveImg = (img: string) =>
    img && !img.startsWith("http") && !img.startsWith("/uploads/")
      ? `/uploads/${img}`
      : img || "/placeholder.svg"

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative group overflow-hidden rounded-2xl bg-muted aspect-[16/9]">
        <img
          src={resolveImg(images[activeIndex])}
          alt={`${title} ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent pointer-events-none" />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={resolveImg(img)}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ───────────────────────── Stat Card ───────────────────────── */

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType
  value: string | number
  label: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Info Row ───────────────────────── */

function InfoRow({ label, value, icon: Icon }: { label: string; value: string | React.ReactNode; icon?: React.ElementType }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

/* ───────────────────────── Application Card ───────────────────────── */

function ApplicationCard({ app, index }: { app: any; index: number }) {
  return (
    <div className="group rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {app.tenant?.charAt(0) || "?"}
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">{app.tenant}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                <Clock className="inline h-3 w-3 mr-1" />
                Submitted {app.submittedDate}
              </p>
            </div>
            <Badge variant={app.status === "under_review" ? "default" : "secondary"}>
              {app.status.replace("_", " ")}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Shield className="h-3 w-3" />
              Credit: {app.creditScore}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              Income: {app.income}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm">View Application</Button>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-primary/5 hover:border-primary hover:text-primary"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-destructive/5 hover:border-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Tenant Card ───────────────────────── */

function TenantCard({
  tenant,
  property,
}: {
  tenant: any
  property: any
}) {
  return (
    <div className="group rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {tenant.name?.charAt(0) || "?"}
          </div>
          <div>
            <p className="font-semibold text-foreground">{tenant.name}</p>
            <p className="text-sm text-muted-foreground">{tenant.unit}</p>
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                tenant.leaseSigned
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${tenant.leaseSigned ? "bg-primary" : "bg-muted-foreground"}`} />
              {tenant.leaseSigned ? "Registered" : "Pending"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="text-left sm:text-right">
            <p className="text-lg font-bold text-foreground">{"$"}{tenant.rent}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <p className="text-xs text-muted-foreground mt-0.5">
              <Calendar className="inline h-3 w-3 mr-1" />
              {tenant.leaseStart || "-"} to {tenant.leaseEnd || "-"}
            </p>
          </div>
          <Button
            size="sm"
            variant={tenant.leaseSigned ? "secondary" : "default"}
            disabled={tenant.leaseSigned}
            className="w-full sm:w-auto"
            onClick={async () => {
              await fetch("/api/leases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  property_id: property.id,
                  landlord_id: property.landlord_id,
                  tenant_id: tenant.id,
                  start_date: tenant.leaseStart,
                  end_date: tenant.leaseEnd,
                  monthly_rent: tenant.rent,
                }),
              })
              alert("Lease sent to tenant dashboard!")
            }}
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            {tenant.leaseSigned ? "Lease Sent" : "Send Lease"}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
/*                       MAIN PAGE                                */
/* ═══════════════════════════════════════════════════════════════ */

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [property, setProperty] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [applications, setApplications] = React.useState<any[]>([])
  const [tenants, setTenants] = React.useState<any[]>([])
  const router = useRouter()

  const unwrappedParams = React.use(params)

  React.useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/properties/${unwrappedParams.id}`)
        const contentType = res.headers.get("content-type") || ""
        if (!res.ok) {
          let message = res.statusText
          if (contentType.includes("application/json")) {
            try {
              const errData = await res.json()
              message = errData.message || message
            } catch {}
          } else {
            const text = await res.text()
            message = `Server error: ${text.slice(0, 100)}...`
          }
          throw new Error(`Failed to fetch property: ${message}`)
        }
        if (!contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response. Please check your backend logs.")
        }
        const data = await res.json()
        if (!data.success) throw new Error(data.error || "Property not found")
        setProperty({
          ...data.property,
          rentAmount: Math.round(data.property.rent_amount),
          securityDeposit: Math.round(data.property.security_deposit ?? 0),
          propertyType: data.property.property_type,
          availableDate: data.property.available_from,
          squareFeet: data.property.area_sqft,
          occupiedUnits: data.property.occupied_units ?? 0,
          totalUnits: data.property.total_units ?? 1,
        })
        setApplications(data.applications || [])
        setTenants(data.tenants || [])
      } catch (err: any) {
        setError(err.message || "Error loading property")
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [unwrappedParams.id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) return
    try {
      const res = await fetch(`/api/properties/${unwrappedParams.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete property")
      router.push("/landlord/properties")
    } catch (err: any) {
      alert(err.message || "Error deleting property")
    }
  }

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading property...</p>
        </div>
      </div>
    )
  }

  /* ── Error state ── */
  if (error || !property) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Home className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Property not found</p>
            <p className="mt-1 text-sm text-muted-foreground">{error || "The property you are looking for does not exist."}</p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-8 lg:py-10">
        {/* ── Back button ── */}
        <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/landlord/properties">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Properties
          </Link>
        </Button>

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left — Gallery */}
          <ImageGallery images={property.images} title={property.title} />

          {/* Right — Key info card */}
          <Card className="h-fit sticky top-6">
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <Badge
                    variant={property.status === "available" ? "default" : "secondary"}
                    className="mb-3"
                  >
                    {property.status === "available" ? "Available" : "Rented"}
                  </Badge>
                  <CardTitle className="text-xl md:text-2xl leading-tight text-balance">
                    {property.title}
                  </CardTitle>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {property.address}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-5">
              {/* Price */}
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                  Tsh {property.rentAmount?.toLocaleString()}
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/60 p-3">
                  <Bed className="h-4 w-4 text-primary" />
                  <span className="text-lg font-bold text-foreground">{property.bedrooms}</span>
                  <span className="text-xs text-muted-foreground">Beds</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/60 p-3">
                  <Bath className="h-4 w-4 text-primary" />
                  <span className="text-lg font-bold text-foreground">{property.bathrooms}</span>
                  <span className="text-xs text-muted-foreground">Baths</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/60 p-3">
                  <Ruler className="h-4 w-4 text-primary" />
                  <span className="text-lg font-bold text-foreground">{property.squareFeet}</span>
                  <span className="text-xs text-muted-foreground">Sq Ft</span>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" asChild>
                  <Link href={`/landlord/properties/${property.id}/edit`}>
                    <Edit className="h-4 w-4" />
                    Edit Property
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="shrink-0 hover:bg-destructive/10 hover:border-destructive hover:text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete property</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══════════════ STATS ROW ═══════════════ */}
        <div className="mt-8 grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Bed} value={property.bedrooms} label="Bedrooms" />
          <StatCard icon={Bath} value={property.bathrooms} label="Bathrooms" />
          <StatCard icon={Ruler} value={property.squareFeet} label="Square Feet" />
          <StatCard icon={DollarSign} value={`Tsh ${property.rentAmount?.toLocaleString()}`} label="Per Month" />
        </div>

        {/* ═══════════════ TABBED CONTENT ═══════════════ */}
        <Tabs defaultValue="details" className="mt-8">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="applications">
              Applications
              {applications.length > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {applications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="tenants">
              Tenants
              {tenants.length > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {tenants.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Details Tab ── */}
          <TabsContent value="details" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Property Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border">
                    <InfoRow icon={Home} label="Property Type" value={property.propertyType} />
                    <InfoRow icon={DollarSign} label="Monthly Rent" value={`Tsh ${property.rentAmount?.toLocaleString()}`} />
                    <InfoRow icon={Shield} label="Security Deposit" value={`Tsh ${property.securityDeposit?.toLocaleString()}`} />
                    <InfoRow
                      icon={Calendar}
                      label="Available Date"
                      value={property.availableDate ? new Date(property.availableDate).toLocaleDateString() : "N/A"}
                    />
                    <InfoRow
                      icon={Users}
                      label="Occupancy"
                      value={
                        <span className="flex items-center gap-2">
                          {property.occupiedUnits ?? 0}/{property.totalUnits ?? 1} units
                          <span className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                            <span
                              className="block h-full rounded-full bg-primary transition-all"
                              style={{
                                width: `${((property.occupiedUnits ?? 0) / (property.totalUnits ?? 1)) * 100}%`,
                              }}
                            />
                          </span>
                        </span>
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Extra Features */}
              {property.extra_features && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Extra Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-border">
                      {property.extra_features.hasPublicToilet !== undefined && (
                        <InfoRow
                          label="Public Toilet"
                          value={
                            <Badge variant={property.extra_features.hasPublicToilet ? "default" : "secondary"}>
                              {property.extra_features.hasPublicToilet ? "Yes" : "No"}
                            </Badge>
                          }
                        />
                      )}
                      {property.extra_features.hasSubmeters !== undefined && (
                        <InfoRow
                          label="Submeters"
                          value={
                            <Badge variant={property.extra_features.hasSubmeters ? "default" : "secondary"}>
                              {property.extra_features.hasSubmeters ? "Yes" : "No"}
                            </Badge>
                          }
                        />
                      )}
                      {property.extra_features.electricityBillType && (
                        <InfoRow
                          icon={Zap}
                          label="Electricity Bill Type"
                          value={property.extra_features.electricityBillType === "shared" ? "Shared/Main Meter" : "Individual Meter"}
                        />
                      )}
                      {property.extra_features.electricityBillAmount &&
                        property.extra_features.electricityBillType === "shared" && (
                          <InfoRow
                            icon={Zap}
                            label="Electricity Bill"
                            value={`Tsh ${property.extra_features.electricityBillAmount}`}
                          />
                        )}
                      {property.extra_features.waterBillAmount && (
                        <InfoRow icon={Droplets} label="Water Bill" value={`Tsh ${property.extra_features.waterBillAmount}`} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card className={property.extra_features ? "" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {property.description}
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Amenities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities?.map((amenity: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="rounded-lg px-3 py-1.5 text-xs"
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Applications Tab ── */}
          <TabsContent value="applications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>Review applications from potential tenants</CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="mt-4 font-medium text-foreground">No applications yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">Applications will appear here when tenants apply.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {applications.map((app, index) => (
                      <ApplicationCard key={app.id} app={app} index={index} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tenants Tab ── */}
          <TabsContent value="tenants" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Tenants</CardTitle>
                <CardDescription>Active leases for this property</CardDescription>
              </CardHeader>
              <CardContent>
                {tenants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <Home className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="mt-4 font-medium text-foreground">No tenants yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">Tenants will appear here once leases are active.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {tenants.map((tenant) => (
                      <TenantCard key={tenant.id} tenant={tenant} property={property} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
