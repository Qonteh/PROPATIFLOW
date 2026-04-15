"use client"
import { Card, CardContent } from "@/components/ui/card"
import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, MapPin, FileText, ArrowUpRight, ChevronRight, Inbox, CalendarDays, Banknote, Eye, Undo2, Globe } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"

/* ========================================== */
/* --- Translations for applications page    */
/* ========================================== */
const translations = {
  en: {
    // Header
    myApplications: "My Applications",
    trackStatus: "Track the status of your rental applications",
    active: "Active",
    past: "Past",
    
    // Status Badges
    underReview: "Under Review",
    pending: "Pending",
    approved: "Approved",
    notSelected: "Not Selected",
    rejected: "Rejected",
    
    // Stat Cards
    monthlyRent: "Monthly Rent",
    submitted: "Submitted",
    nextStep: "Next Step",
    awaitingReview: "Awaiting review",
    landlordReviewing: "Landlord reviewing",
    
    // Buttons
    viewDetails: "View Details",
    withdraw: "Withdraw",
    details: "Details",
    
    // Sections
    activeApplications: "Active Applications",
    pastApplications: "Past Applications",
    
    // Empty States
    noActiveFound: "No active applications found.",
    noPastFound: "No past applications found.",
    
    // Loading
    loading: "Loading applications...",
    
    // Divider
    history: "History",
    
    // Property Card
    landlord: "Landlord",
    
    // Toast Messages
    withdrawSuccess: "Application withdrawn",
    withdrawDesc: "Your application has been withdrawn.",
    withdrawFailed: "Failed to withdraw",
    withdrawError: "Error withdrawing application",
    viewDetailsTitle: "View Details",
    
    // Language toggle
    switchLanguage: "Switch language",
    
    // Currency
    tsh: "Tsh",
  },
  sw: {
    // Header
    myApplications: "Maombi Yangu",
    trackStatus: "Fuatilia hali ya maombi yako ya kukodi",
    active: "Yanayoendelea",
    past: "Yaliyopita",
    
    // Status Badges
    underReview: "Inakaguliwa",
    pending: "Inasubiri",
    approved: "Imekubaliwa",
    notSelected: "Haukuchaguliwa",
    rejected: "Imekataliwa",
    
    // Stat Cards
    monthlyRent: "Kodi ya Mwezi",
    submitted: "Iliwasilishwa",
    nextStep: "Hatua Inayofuata",
    awaitingReview: "Inasubiri kukaguliwa",
    landlordReviewing: "Mmiliki anakagua",
    
    // Buttons
    viewDetails: "Angalia Maelezo",
    withdraw: "Ondoa",
    details: "Maelezo",
    
    // Sections
    activeApplications: "Maombi Yanayoendelea",
    pastApplications: "Maombi Yaliyopita",
    
    // Empty States
    noActiveFound: "Hakuna maombi yanayoendelea.",
    noPastFound: "Hakuna maombi yaliyopita.",
    
    // Loading
    loading: "Inapakia maombi...",
    
    // Divider
    history: "Historia",
    
    // Property Card
    landlord: "Mmiliki",
    
    // Toast Messages
    withdrawSuccess: "Maombi yameondolewa",
    withdrawDesc: "Maombi yako yameondolewa.",
    withdrawFailed: "Imeshindwa kuondoa",
    withdrawError: "Hitilafu katika kuondoa maombi",
    viewDetailsTitle: "Angalia Maelezo",
    
    // Language toggle
    switchLanguage: "Badilisha lugha",
    
    // Currency
    tsh: "Tsh",
  }
}

interface Application {
  id: string
  property_id: string
  property_title: string
  property_address: string
  property_rent: number
  landlord_name: string
  status: string
  application_date: string
  desired_move_in?: string
  lease_duration_months?: number
  rejection_reason?: string | null
  property_images?: string[] | string
}

function PropertyImage({
  propertyId,
  propertyImages,
  propertyTitle
}: {
  propertyId: string
  propertyImages?: string[] | string
  propertyTitle: string
}) {
  const [fallbackImages, setFallbackImages] = useState<string[] | null>(null)

  let images: string[] = []
  if (propertyImages) {
    try {
      images = typeof propertyImages === "string" ? JSON.parse(propertyImages) : propertyImages
    } catch {
      images = Array.isArray(propertyImages) ? propertyImages : []
    }
  }

  useEffect(() => {
    if (images.length === 0 && propertyId) {
      fetch(`/api/properties/${propertyId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.property && data.property.images) {
            let imgs: string[] = []
            try {
              imgs = typeof data.property.images === "string" ? JSON.parse(data.property.images) : data.property.images
            } catch {
              imgs = Array.isArray(data.property.images) ? data.property.images : []
            }
            setFallbackImages(imgs)
          }
        })
    }
  }, [propertyId])

  const allImages = images.length > 0 ? images : fallbackImages || []
  if (allImages.length > 0) {
    const img = allImages[0]
    const imageUrl = img.startsWith("http")
      ? img
      : img.startsWith("/")
        ? img
        : `/uploads/${img}`
    return (
      <img
        src={imageUrl || "/placeholder.svg"}
        alt={propertyTitle}
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
      />
    )
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-secondary">
      <FileText className="h-8 w-8 text-muted-foreground/40" />
    </div>
  )
}

function StatusBadge({ status, t }: { status: string; t: typeof translations.en }) {
  if (status === "under_review") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="h-2.5 w-2.5" />
        {t.underReview}
      </span>
    )
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200">
        <Clock className="h-2.5 w-2.5" />
        {t.pending}
      </span>
    )
  }
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="h-2.5 w-2.5" />
        {t.approved}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-red-50 text-red-600 border border-red-200">
      <XCircle className="h-2.5 w-2.5" />
      {t.notSelected}
    </span>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2.5 bg-secondary/60 rounded-lg px-3 py-2">
      <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className="text-xs font-semibold text-foreground leading-tight">{value}</p>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="border-dashed border-2 border-border bg-card">
      <CardContent className="py-12 flex flex-col items-center justify-center gap-3">
        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
          <Inbox className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}

export default function TenantApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { language, setLanguage, t } = useLanguage()
  
  // Get current language translations
  const currentT = language === 'en' ? translations.en : translations.sw

  useEffect(() => {
    fetchApplications()
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en')
  }

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/applications")
      const data = await res.json()
      if (data.success) {
        const active = (data.applications || []).filter((a: Application) => a.status === "pending" || a.status === "under_review")
        const past = (data.applications || []).filter((a: Application) => a.status === "approved" || a.status === "rejected")
        setApplications([...active, ...past])
      } else {
        toast({
          title: "Failed to fetch applications",
          description: data.error || "Unknown error",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error fetching applications",
        description: String(error),
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const activeApplications = applications.filter(app => app.status === "pending" || app.status === "under_review")
  const pastApplications = applications.filter(app => app.status === "approved" || app.status === "rejected")

  const handleWithdraw = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "withdrawn" })
      })
      const data = await res.json()
      if (data.success) {
        toast({
          title: currentT.withdrawSuccess,
          description: currentT.withdrawDesc
        })
        fetchApplications()
      } else {
        toast({
          title: currentT.withdrawFailed,
          description: data.error || "Unknown error",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: currentT.withdrawError,
        description: String(error),
        variant: "destructive"
      })
    }
  }

  const handleViewDetails = (app: Application) => {
    toast({
      title: currentT.viewDetailsTitle,
      description: `Application for ${app.property_title}`
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground font-serif">{currentT.myApplications}</h1>
              <p className="text-[11px] text-muted-foreground">{currentT.trackStatus}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs h-7 px-2 rounded-full bg-secondary/50 hover:bg-secondary"
              onClick={toggleLanguage}
            >
              <Globe className="h-3 w-3" />
              <span>{currentT.switchLanguage}</span>
              <Badge variant="outline" className="h-4 px-1 text-[8px] ml-1">
                {language === 'en' ? 'SW' : 'EN'}
              </Badge>
            </Button>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-xs text-muted-foreground">{currentT.loading}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground font-serif">{currentT.myApplications}</h1>
            <p className="text-[11px] text-muted-foreground">{currentT.trackStatus}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs h-7 px-2 rounded-full bg-secondary/50 hover:bg-secondary"
              onClick={toggleLanguage}
            >
              <Globe className="h-3 w-3" />
              <span className="hidden sm:inline">{currentT.switchLanguage}</span>
              <Badge variant="outline" className="h-4 px-1 text-[8px] ml-1">
                {language === 'en' ? 'SW' : 'EN'}
              </Badge>
            </Button>
            
            <div className="hidden sm:flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-medium text-foreground">{activeApplications.length} {currentT.active}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1.5">
              <span className="text-[10px] font-medium text-muted-foreground">{pastApplications.length} {currentT.past}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Active Applications */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
              <FileText className="h-3 w-3 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">{currentT.activeApplications}</h2>
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 ml-1">{activeApplications.length}</Badge>
          </div>

          <div className="flex flex-col gap-3">
            {activeApplications.length === 0 ? (
              <EmptyState message={currentT.noActiveFound} />
            ) : (
              activeApplications.map((app) => (
                <Card key={app.id} className="overflow-hidden border-border bg-card text-card-foreground hover:shadow-md transition-shadow duration-300 group">
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="w-full md:w-44 h-36 md:h-auto shrink-0 overflow-hidden relative">
                      <PropertyImage
                        propertyId={app.property_id}
                        propertyImages={app.property_images}
                        propertyTitle={app.property_title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-foreground/10 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col gap-3">
                      {/* Top row: title + status */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1 font-serif">
                            {app.property_title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                            <span className="text-[11px] text-muted-foreground line-clamp-1">{app.property_address}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{currentT.landlord}: <span className="font-medium text-foreground">{app.landlord_name}</span></p>
                        </div>
                        <StatusBadge status={app.status} t={currentT} />
                      </div>

                      {/* Stat pills */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <StatCard icon={Banknote} label={currentT.monthlyRent} value={`${currentT.tsh} ${app.property_rent?.toLocaleString?.() ?? "-"}`} />
                        <StatCard icon={CalendarDays} label={currentT.submitted} value={app.application_date?.slice(0, 10) || "--"} />
                        <StatCard
                          icon={ChevronRight}
                          label={currentT.nextStep}
                          value={app.status === "pending" ? currentT.awaitingReview : currentT.landlordReviewing}
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          className="h-7 text-[11px] gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                          onClick={() => handleViewDetails(app)}
                        >
                          <Eye className="h-3 w-3" />
                          {currentT.viewDetails}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] gap-1.5 bg-transparent rounded-lg"
                          onClick={() => handleWithdraw(app.id)}
                        >
                          <Undo2 className="h-3 w-3" />
                          {currentT.withdraw}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">{currentT.history}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Past Applications */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center">
              <Clock className="h-3 w-3 text-muted-foreground" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">{currentT.pastApplications}</h2>
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 ml-1">{pastApplications.length}</Badge>
          </div>

          <div className="flex flex-col gap-3">
            {pastApplications.length === 0 ? (
              <EmptyState message={currentT.noPastFound} />
            ) : (
              pastApplications.map((app) => (
                <Card key={app.id} className="border-border bg-card text-card-foreground hover:shadow-sm transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="text-sm font-semibold text-card-foreground font-serif">{app.property_title}</h3>
                          <StatusBadge status={app.status} t={currentT} />
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <MapPin className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">{app.property_address}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 text-[11px]">
                          <span className="text-muted-foreground">
                            {currentT.submitted}: <span className="font-medium text-foreground">{app.application_date?.slice(0, 10)}</span>
                          </span>
                          <span className="text-muted-foreground">
                            {app.status === "approved" ? currentT.approved : currentT.rejected}:{" "}
                            <span className="font-medium text-foreground">
                              {app.status === "approved" ? app.application_date?.slice(0, 10) : app.rejection_reason || "-"}
                            </span>
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[11px] gap-1 text-muted-foreground hover:text-primary rounded-lg shrink-0"
                        onClick={() => handleViewDetails(app)}
                      >
                        <ArrowUpRight className="h-3 w-3" />
                        {currentT.details}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}