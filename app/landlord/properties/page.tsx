"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Plus,
  Search,
  AlertCircle,
  Building,
  Loader2,
  TrendingUp,
  DollarSign,
  Home,
  CheckCircle2,
  BedDouble,
  Bath,
  Eye,
  Pencil,
  Trash2,
  ImageOff,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Stub translations (same pattern as tenant + applications pages)
// ─── Translations ───
type Language = "en" | "sw"
const translations: Record<Language, Record<string, string>> = {
  en: {
    properties_title: "Properties",
    manage_your_property_portfolio: "Manage your property portfolio, track availability and monitor rental income.",
    add_property: "Add Property",
    search_properties_placeholder: "Search by title, address, type, or city...",
    total_properties: "Total Properties",
    rented: "Rented",
    available: "Available",
    avg_rent: "Avg. Rent",
    per_month: "per month",
    no_properties: "No properties found",
    no_properties_desc: "Start by adding your first property to manage your portfolio.",
    delete_property: "Delete Property",
    delete_property_desc: "Are you sure you want to delete this property? This action cannot be undone.",
    cancel: "Cancel",
    delete: "Delete",
    beds: "Beds",
    baths: "Baths",
    type: "Type",
    view: "View",
    edit: "Edit",
    deleting: "Deleting...",
    occupied: "% occupied",
    ready: "ready",
    listed: "listed",
    monthly_average: "Monthly average",
    loading_properties: "Loading properties...",
  },
  sw: {
    properties_title: "Mali",
    manage_your_property_portfolio: "Simamia mali zako, fuatilia upatikanaji na angalia mapato ya kodi.",
    add_property: "Ongeza Mali",
    search_properties_placeholder: "Tafuta kwa kichwa, anwani, aina, au jiji...",
    total_properties: "Jumla ya Mali",
    rented: "Imekodishwa",
    available: "Inapatikana",
    avg_rent: "Wastani wa Kodi",
    per_month: "kwa mwezi",
    no_properties: "Hakuna mali zilizopatikana",
    no_properties_desc: "Anza kwa kuongeza mali yako ya kwanza ili kusimamia mali zako.",
    delete_property: "Futa Mali",
    delete_property_desc: "Una uhakika unataka kufuta mali hii? Hatua hii haiwezi kubatilishwa.",
    cancel: "Ghairi",
    delete: "Futa",
    beds: "Vitanda",
    baths: "Bafu",
    type: "Aina",
    view: "Angalia",
    edit: "Hariri",
    deleting: "Inafuta...",
    occupied: "% imekodishwa",
    ready: "ipo tayari",
    listed: "imeorodheshwa",
    monthly_average: "Wastani wa kila mwezi",
    loading_properties: "Inapakia mali...",
  },
}
const useAuth = () => ({ user: { id: "demo-user-1", isVerified: true } })

interface Property {
  id: string
  title: string
  address: string
  city: string
  state: string
  property_type: string
  bedrooms: number
  bathrooms: number
  rent_amount: number
  status: string
  media?: string[] // unified media (images/videos)
  images?: string[] // fallback for legacy data
  created_at: string
  extra_features?: string | null
}

/* ========================================== */
/* ─── Sub-components (matching design lang) ─ */
/* ========================================== */

function StatCard({
  icon,
  value,
  label,
  trend,
  trendUp,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <Card className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trendUp ? "text-primary" : "text-destructive"}`}>
                <TrendingUp className={`h-3 w-3 ${!trendUp ? "rotate-180" : ""}`} />
                {trend}
              </div>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
            <div className="h-4 w-4 flex items-center justify-center">{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status, t }: { status: string, t: (key: string) => string }) {
  if (status === "available") {
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 gap-1 text-[10px] uppercase tracking-wider font-medium">
        <CheckCircle2 className="h-3 w-3" />
        {t("available")}
      </Badge>
    )
  }
  if (status === "rented") {
    return (
      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/15 gap-1 text-[10px] uppercase tracking-wider font-medium">
        <Home className="h-3 w-3" />
        {t("rented")}
      </Badge>
    )
  }
  return (
    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15 gap-1 text-[10px] uppercase tracking-wider font-medium">
      <AlertCircle className="h-3 w-3" />
      {status}
    </Badge>
  )
}

function PropertyCard({
  property,
  imgError,
  onImgError,
  onDelete,
  t,
  getImageUrl,
}: {
  property: Property
  imgError: boolean
  onImgError: () => void
  onDelete: () => void
  t: (key: string) => string
  getImageUrl: (path: string | undefined) => string | null
}) {
  // Helper to check if file is video (by extension or by MIME type if available)
  const isVideo = (file: string) => {
    if (!file) return false;
    // Check extension
    if (/\.(mp4|webm|ogg|mov)$/i.test(file)) return true;
    // Check for common video URLs (e.g. with ?type=video/mp4)
    if (/type=video\//i.test(file)) return true;
    return false;
  }
  // Prefer media array, fallback to images
  const mediaArr = property.media && property.media.length > 0 ? property.media : property.images || [];
  // Find the first image (not video) in mediaArr, even if videos come first
  let firstImage = null;
  let firstVideo = null;
  for (const file of mediaArr) {
    if (!firstImage && !isVideo(file)) firstImage = file;
    if (!firstVideo && isVideo(file)) firstVideo = file;
    if (firstImage && firstVideo) break;
  }
  // Debug: log media URLs
  if (mediaArr.length > 0) {
    // eslint-disable-next-line no-console
    console.log('Property media:', mediaArr);
  }
  // Parse extra_features JSON
  let roomTypes: string[] = [];
  let customFeatures: string[] = [];
  if (property.extra_features) {
    try {
      const parsed = JSON.parse(property.extra_features);
      roomTypes = Array.isArray(parsed.room_types) ? parsed.room_types : [];
      customFeatures = Array.isArray(parsed.custom_features) ? parsed.custom_features : [];
    } catch {}
  }
  const accentColor =
    property.status === "available"
      ? "bg-primary"
      : property.status === "rented"
        ? "bg-blue-500"
        : "bg-amber-500"

  return (
    <Card className="group border-border/60 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Top accent bar */}
        <div className={`h-1 w-full ${accentColor}`} />

        {/* Media section (image or video) */}
        <div className="relative aspect-[16/10] bg-muted overflow-hidden">
          {firstImage && !imgError ? (
            <img
              src={getImageUrl(firstImage) || ""}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={onImgError}
            />
          ) : firstVideo && !imgError ? (
            <video
              src={getImageUrl(firstVideo) || ""}
              controls
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={onImgError as any}
              poster={getVideoPoster(firstVideo) || "/video-placeholder.png"}
            >
              Sorry, your browser doesn't support embedded videos.
            </video>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted/60">
              <ImageOff className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <span className="text-xs text-muted-foreground/50">No media</span>
            </div>
          )}

          {/* Status overlay badge */}
          <div className="absolute top-3 left-3">
            <StatusBadge status={property.status} t={t} />
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-3 right-3">
            <div className="bg-card/90 backdrop-blur-sm border border-border/60 rounded-lg px-3 py-1.5 shadow-sm">
              <p className="text-sm font-bold text-foreground">
                Tsh {property.rent_amount?.toLocaleString()}
              </p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                {t("per_month")}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title + Address */}
          <div className="mb-4">
            <h3 className="font-semibold text-foreground text-base mb-1 truncate text-balance">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate">
                {property.address}
                {property.city ? `, ${property.city}` : ""}
              </span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-muted/40 border border-border/40">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BedDouble className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-foreground">{property.bedrooms}</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{t("beds")}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bath className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-foreground">{property.bathrooms}</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{t("baths")}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-foreground truncate max-w-full text-center text-xs">
                {property.property_type ? t(property.property_type.toLowerCase()) : t("n_a")}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{t("type")}</span>
            </div>
           {/* Room Types */}
           {roomTypes.length > 0 && (
             <div className="col-span-3 mt-2">
               <div className="flex flex-wrap gap-2">
                 {roomTypes.map((rt, idx) => (
                   <Badge key={idx} className="bg-primary/10 text-primary border-primary/20">
                     <Sparkles className="h-3 w-3 mr-1" />
                     {rt}
                   </Badge>
                 ))}
               </div>
             </div>
           )}
           {/* Custom Features */}
           {customFeatures.length > 0 && (
             <div className="col-span-3 mt-2">
               <div className="flex flex-wrap gap-2">
                 {customFeatures.map((cf, idx) => (
                   <Badge key={idx} className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                     <Sparkles className="h-3 w-3 mr-1" />
                     {cf}
                   </Badge>
                 ))}
               </div>
             </div>
           )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Link href={`/landlord/properties/${property.id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 border-border/60 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                {t("view")}
              </Button>
            </Link>
            <Link href={`/landlord/properties/${property.id}/edit`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 border-border/60 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                {t("edit")}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border/60 hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive transition-colors"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ t }: { t: (key: string) => string }) {
  return (
    <Card className="border-border/60 border-dashed shadow-none">
      <CardContent className="py-16 flex flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 mb-4">
          <Building className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{t("no_properties")}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {t("no_properties_desc")}
        </p>
        <Link href="/landlord/properties/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("add_property")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

/* ========================================== */
/* ─── Main Page ──────────────────────────── */
/* ========================================== */

export default function PropertiesPage() {
  const [language, setLanguage] = useState<Language>("en")
  const [searchQuery, setSearchQuery] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; propertyId?: string; propertyTitle?: string }>({ open: false })
  const [deleting, setDeleting] = useState(false)
  const { user } = useAuth()

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("app-language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "sw")) {
      setLanguage(savedLang)
    }
  }, [])

  // Save language to localStorage
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("app-language", lang)
  }

  // Memoized translation function for reactivity
  const t = useMemo(() => (key: string) => translations[language][key] || key, [language])

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties")
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
        throw new Error(`Failed to fetch properties: ${message}`)
      }
      if (!contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please check your backend logs.")
      }
      const data = await res.json()
      if (data.success) {
        setProperties(data.properties || [])
      }
    } catch (error: unknown) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http")) return imagePath
    if (imagePath.startsWith("/")) return imagePath
    return `/uploads/${imagePath}`
  }

  const handleDelete = async () => {
    if (!deleteDialog.propertyId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/properties/${deleteDialog.propertyId}`, { method: "DELETE" })
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== deleteDialog.propertyId))
        setDeleteDialog({ open: false })
      } else {
        alert("Failed to delete property")
      }
    } catch {
      alert("Failed to delete property")
    } finally {
      setDeleting(false)
    }
  }

  const filteredProperties = properties.filter((property) => {
    const query = searchQuery.toLowerCase()
    return (
      property.title?.toLowerCase().includes(query) ||
      property.address?.toLowerCase().includes(query) ||
      property.property_type?.toLowerCase().includes(query) ||
      property.city?.toLowerCase().includes(query)
    )
  })

  const totalProperties = properties.length
  const rentedCount = properties.filter((p) => p.status === "rented").length
  const availableCount = properties.filter((p) => p.status === "available").length
  const avgRent =
    totalProperties > 0
      ? `Tsh ${Math.round(properties.reduce((a, b) => a + (b.rent_amount || 0), 0) / totalProperties / 1000)}K`
      : "Tsh 0"

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-2 border-primary/20" />
            <Loader2 className="h-12 w-12 animate-spin text-primary absolute inset-0" />
          </div>
          <p className="text-sm text-muted-foreground">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-8">
        {/* Header */}
        <div className="sticky top-0 z-20 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-5 bg-background/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-7xl mx-auto relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
                    {t("properties_title")}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t("manage_your_property_portfolio")}
                  </p>
                </div>
              </div>
              {/* Big Plus Button (mobile and desktop) */}
              <div className="flex items-center gap-2">
                <Link href="/landlord/properties/new">
                  <button
                    className="group relative flex items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 w-14 h-14 md:w-12 md:h-12 hover:scale-110 hover:rotate-12 hover:bg-gradient-to-tr hover:from-primary hover:to-emerald-500 animate-pulse"
                    aria-label="Add Property"
                  >
                    <Plus className="h-8 w-8 md:h-6 md:w-6 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-45" />
                  </button>
                </Link>
              </div>
            </div>
            {/* Language Switcher: absolutely top right on mobile, normal on desktop */}
            <div className="absolute right-4 top-0 md:static md:right-auto md:top-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("en")}
                    className="flex items-center justify-between"
                  >
                    English
                    {language === "en" && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("sw")}
                    className="flex items-center justify-between"
                  >
                    Kiswahili
                    {language === "sw" && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Building className="h-5 w-5" />}
            value={totalProperties}
            label={t("total_properties")}
            trend={totalProperties > 0 ? `${totalProperties} listed` : undefined}
            trendUp
          />
          <StatCard
            icon={<Home className="h-5 w-5" />}
            value={rentedCount}
            label={t("rented")}
            trend={totalProperties > 0 ? `${Math.round((rentedCount / totalProperties) * 100)}% occupied` : undefined}
            trendUp
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            value={availableCount}
            label={t("available")}
            trend={availableCount > 0 ? `${availableCount} ready` : undefined}
            trendUp={availableCount > 0}
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            value={avgRent}
            label={t("avg_rent")}
            trend={totalProperties > 0 ? "Monthly average" : undefined}
            trendUp
          />
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search_properties_placeholder")}
              className="pl-10 border-border/60 bg-card focus:border-primary/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground">
              Showing {filteredProperties.length} of {totalProperties} properties
            </p>
          )}
        </div>

        {/* Property Grid */}
        {filteredProperties.length === 0 ? (
          <EmptyState t={t} />
        ) : (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                imgError={!!imgErrors[property.id]}
                onImgError={() => setImgErrors((prev) => ({ ...prev, [property.id]: true }))}
                onDelete={() =>
                  setDeleteDialog({ open: true, propertyId: property.id, propertyTitle: property.title })
                }
                t={t}
                getImageUrl={getImageUrl}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
          <AlertDialogContent className="border-border/60">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">{t("delete_property")}</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                {t("delete_property_desc")}
                {deleteDialog.propertyTitle && (
                  <span className="block mt-2 font-medium text-foreground">
                    {`"${deleteDialog.propertyTitle}"`}
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border/60">{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("delete")}
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

// Add this helper function at the top level of the file (outside the component):
function getVideoPoster(videoUrl: string): string | undefined {
  // If you have a backend that generates thumbnails, return the thumbnail URL here.
  // For now, return undefined to use the default placeholder.
  // Example: return videoUrl.replace(/\.(mp4|webm|ogg|mov)$/i, '.jpg');
  return undefined;
}
