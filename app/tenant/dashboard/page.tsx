"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  FileText,
  Home,
  CreditCard,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Building,
  Loader2,
  Calendar,
  MapPin,
  ArrowUpRight,
  ChevronRight,
  Eye,
  Heart,
  UserCheck,
  Bell,
  Filter,
  Star,
  Sparkles,
  ArrowRight,
  DollarSign,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useLanguage } from "@/contexts/language-context"

/* ========================================== */
/* --- Translations for the dashboard        */
/* ========================================== */
const translations = {
  en: {
    // Header
    dashboard: "Dashboard",
    tenantPortal: "Tenant Portal",
    notifications: "Notifications",
    new: "new",
    noNotifications: "No notifications yet",
    
    // Profile Banner
    completeProfile: "Complete Your Profile to Get Verified",
    profileDescription: "Verified profiles get more responses from landlords. Complete your profile now!",
    completeProfileBtn: "Complete Profile",
    
    // Stats Cards
    creditScore: "Credit Score",
    updatedToday: "Updated today",
    applications: "Applications",
    activeSubmissions: "Active submissions",
    noActive: "No active",
    savedProperties: "Saved Properties",
    propertiesYouLiked: "Properties you liked",
    profileStatus: "Profile Status",
    identityConfirmed: "Identity confirmed",
    needsVerification: "Needs verification",
    inProgress: "In Progress",
    
    // Active Lease
    activeLease: "Active Lease",
    leaseSubtitle: "Your current rental agreement",
    viewLease: "View Lease",
    property: "Property",
    address: "Address",
    startDate: "Start Date",
    endDate: "End Date",
    monthlyRent: "Monthly Rent",
    daysRemaining: "Days Remaining",
    leaseExpired: "Lease Expired",
    contactLandlord: "Contact your landlord",
    renewalNeeded: "Renewal needed soon",
    leaseActive: "Lease is active",
    
    // Applications Section
    myApplications: "My Applications",
    applicationsSubtitle: "Track the status of your rental applications",
    filter: "Filter",
    viewAll: "View All",
    noApplications: "No Active Applications",
    noApplicationsDesc: "Start your rental journey by applying to properties that match your needs.",
    searchProperties: "Search Properties",
    
    // Status Badges
    approved: "Approved",
    underReview: "Under Review",
    rejected: "Rejected",
    
    // Payments Section
    upcomingPayments: "Upcoming Payments",
    paymentsSubtitle: "Your next payment obligations",
    rentPayment: "Rent Payment",
    overdue: "Overdue",
    pending: "Pending",
    due: "Due",
    
    // Saved Properties
    savedPropertiesTitle: "Saved Properties",
    savedSubtitle: "Properties you've bookmarked",
    browseMore: "Browse More",
    noSavedProperties: "No Saved Properties",
    noSavedDesc: "Save properties you like to quickly access them later.",
    exploreProperties: "Explore Properties",
    
    // Property Card
    bd: "bd",
    ba: "ba",
    sqft: "sqft",
    perMonth: "/mo",
    
    // Loading
    loading: "Loading dashboard...",
    
    // Common
    tsh: "Tsh",
  },
  sw: {
    // Header
    dashboard: "Dashibodi",
    tenantPortal: "Lango la Mpangaji",
    notifications: "Arifa",
    new: "mpya",
    noNotifications: "Hakuna arifa bado",
    
    // Profile Banner
    completeProfile: "Kamilisha Wasifu Wako Ili Uthibitishwe",
    profileDescription: "Wasifu uliothibitishwa hupata majibu zaidi kutoka kwa wamiliki. Kamilisha wasifu wako sasa!",
    completeProfileBtn: "Kamilisha Wasifu",
    
    // Stats Cards
    creditScore: "Alama ya Mikopo",
    updatedToday: "Imesasishwa leo",
    applications: "Maombi",
    activeSubmissions: "Maombi yanayoendelea",
    noActive: "Hakuna yanayoendelea",
    savedProperties: "Mali Zilizohifadhiwa",
    propertiesYouLiked: "Mali ulizozipenda",
    profileStatus: "Hali ya Wasifu",
    identityConfirmed: "Utambulisho umethibitishwa",
    needsVerification: "Inahitaji uthibitisho",
    inProgress: "Inaendelea",
    
    // Active Lease
    activeLease: "Mkataba Unaotumika",
    leaseSubtitle: "Mkataba wako wa sasa wa kukodi",
    viewLease: "Angalia Mkataba",
    property: "Mali",
    address: "Anuani",
    startDate: "Tarehe ya Kuanza",
    endDate: "Tarehe ya Kuisha",
    monthlyRent: "Kodi ya Mwezi",
    daysRemaining: "Siku Zilizobaki",
    leaseExpired: "Mkataba Umeisha",
    contactLandlord: "Wasiliana na mmiliki",
    renewalNeeded: "Inahitaji kufanyiwa upya hivi karibuni",
    leaseActive: "Mkataba unatumika",
    
    // Applications Section
    myApplications: "Maombi Yangu",
    applicationsSubtitle: "Fuatilia hali ya maombi yako ya kukodi",
    filter: "Chuja",
    viewAll: "Angalia Yote",
    noApplications: "Hakuna Maombi Yanayoendelea",
    noApplicationsDesc: "Anza safari yako ya kukodi kwa kuomba mali zinazokidhi mahitaji yako.",
    searchProperties: "Tafuta Mali",
    
    // Status Badges
    approved: "Imekubaliwa",
    underReview: "Inakaguliwa",
    rejected: "Imekataliwa",
    
    // Payments Section
    upcomingPayments: "Malipo Yajayo",
    paymentsSubtitle: "Malipo yako yajayo",
    rentPayment: "Malipo ya Kodi",
    overdue: "Imechelewa",
    pending: "Inasubiri",
    due: "Tarehe ya malipo",
    
    // Saved Properties
    savedPropertiesTitle: "Mali Zilizohifadhiwa",
    savedSubtitle: "Mali ulizoziweka alama",
    browseMore: "Tafuta Zaidi",
    noSavedProperties: "Hakuna Mali Zilizohifadhiwa",
    noSavedDesc: "Hifadhi mali unazozipenda ili kuzipata kwa urahisi baadaye.",
    exploreProperties: "Chunguza Mali",
    
    // Property Card
    bd: "ch",
    ba: "baf",
    sqft: "futi²",
    perMonth: "/mwezi",
    
    // Loading
    loading: "Inapakia dashibodi...",
    
    // Common
    tsh: "Tsh",
  }
}

/* ========================================== */
/* --- Stub hooks (same pattern as all pages) */
/* ========================================== */
const useAuth = () => ({ user: { id: "demo-user-1" } })

/* ========================================== */
/* --- Sub-components (matching design lang)  */
/* ========================================== */

function StatCard({
  icon,
  value,
  label,
  subtitle,
  accentColor,
  extra,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  subtitle?: string
  accentColor?: string
  extra?: React.ReactNode
}) {
  return (
    <Card className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
              {extra}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>
            )}
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${accentColor || "bg-primary/10 text-primary group-hover:bg-primary/15"}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ApplicationStatusBadge({ status, t }: { status: string, t: any }) {
  if (status === "approved") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15 gap-1 text-[10px] uppercase tracking-wider font-medium">
        <CheckCircle className="h-3 w-3" />
        {t.approved}
      </Badge>
    )
  }
  if (status === "under_review") {
    return (
      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/15 gap-1 text-[10px] uppercase tracking-wider font-medium">
        <Clock className="h-3 w-3" />
        {t.underReview}
      </Badge>
    )
  }
  return (
    <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15 gap-1 text-[10px] uppercase tracking-wider font-medium">
      <AlertCircle className="h-3 w-3" />
      {t.rejected}
    </Badge>
  )
}

function SectionHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground text-center max-w-xs mb-4 leading-relaxed">{description}</p>
      {action}
    </div>
  )
}

/* ========================================== */
/* --- Main Page                              */
/* ========================================== */
export default function TenantDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>({
    applications: [],
    upcomingPayments: [],
    savedProperties: [],
    activeLease: null,
    profile: {},
    statistics: {},
    recentActivities: [],
  })
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationDropdownRef = useRef<HTMLDivElement>(null)
  const { language, setLanguage, t } = useLanguage()
  
  // Get current language translations
  const currentT = language === 'en' ? translations.en : translations.sw

  const profileCompletion = data.profile?.completion || 0
  const creditScore =
    typeof data.profile?.credit_score === "number" && !isNaN(data.profile.credit_score)
      ? data.profile.credit_score
      : 0
  const leaseEndDate = data.activeLease?.end_date ? new Date(data.activeLease.end_date) : null
  const daysUntilLeaseEnd = leaseEndDate
    ? Math.ceil((leaseEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  useEffect(() => {
    fetchDashboardData()
    fetchNotifications()
    const handleClick = (e: MouseEvent) => {
      if (
        showNotifications &&
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showNotifications])

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      const result = await res.json()
      console.log("[DEBUG] /api/notifications result (tenant):", result)
      if (result.success) {
        setNotifications(result.notifications || [])
      } else if (result.notifications) {
        setNotifications(result.notifications)
      } else {
        setNotifications([])
      }
    } catch (err) {
      setNotifications([])
      console.error("[DEBUG] Error fetching notifications (tenant):", err)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/tenant/dashboard")
      let result: any = {}
      try {
        result = await res.json()
      } catch (err) {
        // If JSON parsing fails, set result to empty object
        result = {}
      }
      if ((result as any).success) {
        setData((result as any).data)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en')
  }

  const applications = data.applications || []
  const upcomingPayments = data.upcomingPayments || []
  const savedProperties = data.savedProperties || []
  const unreadCount = notifications.filter((n: any) => !n.is_read).length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
        <p className="text-xs text-muted-foreground tracking-widest uppercase">{currentT.loading}</p>
      </div>
    )
  }

  const userName = (() => {
    const p = data.profile || {}
    if (
      (p.first_name && p.first_name.toLowerCase() !== "user") ||
      (p.last_name && p.last_name.toLowerCase() !== "user")
    ) {
      return `${p.first_name || ""}${p.last_name ? ` ${p.last_name}` : ""}`.trim()
    }
    if (p.name && p.name.toLowerCase() !== "user") return p.name
    if (p.email) return p.email.split("@")[0]
    return ""
  })()

  const userInitials = userName
    ? userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <div className="min-h-screen bg-background">
      {/* Header with notification bell and language toggle */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md w-full">
        <div className="flex w-full items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-primary">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground truncate">{currentT.dashboard}</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{currentT.tenantPortal}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
            {/* Language Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-muted h-8 w-8 sm:h-9 sm:w-9"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-primary text-primary-foreground rounded-full h-3.5 w-3.5 flex items-center justify-center">
                {language === 'en' ? 'SW' : 'EN'}
              </span>
            </Button>

            {/* Notification Bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-muted h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setShowNotifications((v) => !v)}
                aria-label="Show notifications"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
              {showNotifications && (
                <div
                  ref={notificationDropdownRef}
                  className="absolute right-0 top-11 sm:top-12 z-50 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-border px-3 sm:px-4 py-2.5 sm:py-3">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm text-foreground">{currentT.notifications}</span>
                    </div>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">{unreadCount} {currentT.new}</Badge>
                    )}
                  </div>
                  <div className="max-h-72 sm:max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">{currentT.noNotifications}</div>
                    ) : (
                      <ul className="divide-y divide-border">
                        {notifications.map((n, i) => (
                          <li key={n.id || i} className={`px-3 sm:px-4 py-2.5 sm:py-3 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}>
                            <div className="font-medium text-sm text-foreground">{n.title || n.type || 'Notification'}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 break-words">{n.message || n.body}</div>
                            <div className="text-[11px] text-muted-foreground/60 mt-1">
                              {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-6">

        {/* ─── Profile Completion Banner ─── */}
        {profileCompletion < 100 && (
          <Card className="border-border/60 shadow-sm mb-6 overflow-hidden">
            <div className="h-1 bg-primary/20">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
            </div>
            <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground mb-0.5">{currentT.completeProfile}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {currentT.profileDescription}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <Progress value={profileCompletion} className="h-2 flex-1" />
                  <span className="text-xs font-bold text-primary tabular-nums">{profileCompletion}%</span>
                </div>
              </div>
              {/* Profile completion button removed: profile page deleted */}
            </CardContent>
          </Card>
        )}

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            value={creditScore}
            label={currentT.creditScore}
            subtitle={currentT.updatedToday}
            accentColor="bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/15"
            extra={
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15 text-[10px] px-1.5 py-0 gap-0.5 font-medium">
                <ArrowUpRight className="h-2.5 w-2.5" />
                +24
              </Badge>
            }
          />
          <StatCard
            icon={<FileText className="h-5 w-5" />}
            value={applications.length}
            label={currentT.applications}
            subtitle={applications.length > 0 ? currentT.activeSubmissions : currentT.noActive}
            accentColor="bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/15"
            extra={
              applications.length > 0 ? (
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/15 text-[10px] px-1.5 py-0 font-medium">
                  {currentT.inProgress}
                </Badge>
              ) : undefined
            }
          />
          <StatCard
            icon={<Heart className="h-5 w-5" />}
            value={savedProperties.length}
            label={currentT.savedProperties}
            subtitle={currentT.propertiesYouLiked}
            accentColor="bg-rose-500/10 text-rose-600 group-hover:bg-rose-500/15"
          />
          <StatCard
            icon={<Shield className="h-5 w-5" />}
            value={data.profile?.is_verified ? "Verified" : "Unverified"}
            label={currentT.profileStatus}
            subtitle={data.profile?.is_verified ? currentT.identityConfirmed : currentT.needsVerification}
            accentColor={
              data.profile?.is_verified
                ? "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/15"
                : "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/15"
            }
            extra={
              <div className={`h-2 w-2 rounded-full ${data.profile?.is_verified ? "bg-emerald-500" : "bg-amber-500"}`} />
            }
          />
        </div>

        {/* ─── Active Lease Section ─── */}
        {data.activeLease && (
          <Card className="border-border/60 shadow-sm mb-6 overflow-hidden">
            <div className="h-1 bg-primary" />
            <SectionHeader
              icon={<Home className="h-4 w-4" />}
              title={currentT.activeLease}
              subtitle={currentT.leaseSubtitle}
              action={
                <Link href="/tenant/lease">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-border/60">
                    {currentT.viewLease}
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              }
            />
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    {data.activeLease.property_title || currentT.property}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {data.activeLease.property_address || currentT.address}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <Calendar className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                      <p className="text-[10px] text-muted-foreground mb-0.5">{currentT.startDate}</p>
                      <p className="text-xs font-semibold">
                        {data.activeLease.start_date
                          ? new Date(data.activeLease.start_date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <Calendar className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                      <p className="text-[10px] text-muted-foreground mb-0.5">{currentT.endDate}</p>
                      <p className="text-xs font-semibold">
                        {leaseEndDate ? leaseEndDate.toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <DollarSign className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-1" />
                      <p className="text-[10px] text-muted-foreground mb-0.5">{currentT.monthlyRent}</p>
                      <p className="text-xs font-semibold">
                        {currentT.tsh} {Number(data.activeLease.rent_amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                {daysUntilLeaseEnd !== null && (
                  <div className="flex flex-col items-center justify-center sm:border-l sm:border-border/60 sm:pl-5">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-2 ${
                      daysUntilLeaseEnd <= 0
                        ? "bg-destructive/10"
                        : daysUntilLeaseEnd <= 30
                          ? "bg-amber-500/10"
                          : "bg-primary/10"
                    }`}>
                      <span className={`text-2xl font-bold ${
                        daysUntilLeaseEnd <= 0
                          ? "text-destructive"
                          : daysUntilLeaseEnd <= 30
                            ? "text-amber-600"
                            : "text-primary"
                      }`}>
                        {daysUntilLeaseEnd <= 0 ? 0 : daysUntilLeaseEnd}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground">
                      {daysUntilLeaseEnd <= 0 ? currentT.leaseExpired : currentT.daysRemaining}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {daysUntilLeaseEnd <= 0
                        ? currentT.contactLandlord
                        : daysUntilLeaseEnd <= 30
                          ? currentT.renewalNeeded
                          : currentT.leaseActive}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ─── Applications Section ─── */}
        <Card className="border-border/60 shadow-sm mb-6 overflow-hidden">
          <div className="h-1 bg-blue-500" />
          <SectionHeader
            icon={<FileText className="h-4 w-4" />}
            title={currentT.myApplications}
            subtitle={currentT.applicationsSubtitle}
            action={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-border/60">
                  <Filter className="h-3 w-3" />
                  <span className="hidden sm:inline">{currentT.filter}</span>
                </Button>
                <Link href="/tenant/applications">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-border/60">
                    {currentT.viewAll}
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            }
          />
          <CardContent className="p-0">
            {applications.length > 0 ? (
              <div className="divide-y divide-border/60">
                {applications.slice(0, 3).map((app: any) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 shrink-0">
                      <Building className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">{app.property}</span>
                        <ApplicationStatusBadge status={app.status} t={currentT} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(app.submittedDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {app.location}
                        </span>
                        <span className="font-semibold text-foreground">
                          {currentT.tsh} {Number(app.rent).toLocaleString()}{currentT.perMonth}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FileText className="h-6 w-6 text-muted-foreground" />}
                title={currentT.noApplications}
                description={currentT.noApplicationsDesc}
                action={
                  <Link href="/tenant/search">
                    <Button size="sm" className="h-9 text-xs gap-1.5">
                      <Search className="h-3.5 w-3.5" />
                      {currentT.searchProperties}
                    </Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* ─── Upcoming Payments Section ─── */}
        {upcomingPayments.length > 0 && (
          <Card className="border-border/60 shadow-sm mb-6 overflow-hidden">
            <div className="h-1 bg-amber-500" />
            <SectionHeader
              icon={<CreditCard className="h-4 w-4" />}
              title={currentT.upcomingPayments}
              subtitle={currentT.paymentsSubtitle}
              action={
                <Link href="/tenant/payments">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-border/60">
                    {currentT.viewAll}
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              }
            />
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                {upcomingPayments.slice(0, 3).map((pmt: any) => {
                  const dueDate = pmt.due_date ? new Date(pmt.due_date) : null
                  const isOverdue = dueDate ? dueDate < new Date() : false
                  return (
                    <div
                      key={pmt.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                        isOverdue
                          ? "bg-destructive/10 text-destructive"
                          : "bg-amber-500/10 text-amber-600"
                      }`}>
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium truncate">
                            {pmt.property_title || pmt.property || currentT.rentPayment}
                          </span>
                          {isOverdue ? (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15 gap-1 text-[10px] uppercase tracking-wider font-medium">
                              <AlertCircle className="h-3 w-3" />
                              {currentT.overdue}
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15 gap-1 text-[10px] uppercase tracking-wider font-medium">
                              <Clock className="h-3 w-3" />
                              {currentT.pending}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {currentT.due}: {dueDate ? dueDate.toLocaleDateString() : "N/A"}
                          </span>
                          <span className="font-semibold text-foreground">
                            {currentT.tsh} {Number(pmt.amount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ─── Saved Properties Section ─── */}
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <div className="h-1 bg-rose-500" />
          <SectionHeader
            icon={<Heart className="h-4 w-4" />}
            title={currentT.savedPropertiesTitle}
            subtitle={currentT.savedSubtitle}
            action={
              <Link href="/tenant/search">
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-border/60">
                  <Eye className="h-3 w-3" />
                  {currentT.browseMore}
                </Button>
              </Link>
            }
          />
          <CardContent className="p-5">
            {savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedProperties.slice(0, 4).map((property: any) => (
                  <div
                    key={property.id}
                    className="group cursor-pointer rounded-xl border border-border/60 overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                      {property.image ? (
                        <img
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/60">
                          <Home className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-2.5 right-2.5">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm shadow-sm"
                          aria-label="Saved"
                        >
                          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                        </button>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5">
                        <Badge className="bg-card/90 backdrop-blur-sm text-foreground border-0 text-[10px] px-2 py-0.5 font-medium">
                          {property.property_type}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-foreground mb-0.5 truncate">{property.title}</p>
                      <p className="text-xs text-muted-foreground mb-3 truncate flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {property.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{property.bedrooms} {currentT.bd}</span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span>{property.bathrooms} {currentT.ba}</span>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span>{property.square_feet} {currentT.sqft}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {currentT.tsh} {Number(property.rent).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Heart className="h-6 w-6 text-muted-foreground" />}
                title={currentT.noSavedProperties}
                description={currentT.noSavedDesc}
                action={
                  <Link href="/tenant/search">
                    <Button size="sm" className="h-9 text-xs gap-1.5">
                      <Search className="h-3.5 w-3.5" />
                      {currentT.exploreProperties}
                    </Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}