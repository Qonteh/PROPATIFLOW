"use client";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/auth-context";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ShieldCheck,
  Plus,
  Building,
  Home,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Bell,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Vault,
  ChevronRight,
  Globe,
  Check,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ==================== TRANSLATIONS ====================
type Language = "en" | "sw";

// Define translations as a constant object
const translations = {
  en: {
    // Header
    dashboard: "Dashboard",
    propertyManagement: "Property Management",
    verifyAccount: "Verify Account",
    verifyTooltip: "Verifying your account increases trust and unlocks all features.",
    notifications: "Notifications",
    newNotifications: "new",
    noNotifications: "No notifications yet",
    notification: "Notification",

    // Welcome
    welcomeBack: "Welcome back,",
    welcomeSubtitle: "Here's what's happening with your properties today.",

    // Loading & Error
    loading: "Loading...",
    failedToFetch: "Failed to fetch dashboard data",

    // Stats Cards
    totalProperties: "Total Properties",
    acrossAllLocations: "Across all locations",
    occupancyRate: "Occupancy Rate",
    healthy: "Healthy",
    moderate: "Moderate",
    low: "Low",
    ofUnits: "of",
    units: "units",
    monthlyRevenue: "Monthly Revenue",
    comparedToLastMonth: "Compared to last month",
    pendingApplications: "Pending Applications",
    requireYourReview: "Require your review",
    listed: "listed",

    // Recent Applications
    recentApplications: "Recent Applications",
    newTenantApplications: "New tenant applications awaiting review",
    viewAll: "View All",
    noRecentApplications: "No recent applications",
    pending: "pending",
    showLess: "Show Less",
    viewAllApplications: "View All",
    applications: "applications",

    // Upcoming Payments
    upcomingPayments: "Upcoming Payments",
    rentPaymentsDueSoon: "Rent payments due soon",
    noUpcomingPayments: "No upcoming payments",
    overdue: "Overdue",
    due: "Due",

    // Quick Actions
    quickActions: "Quick Actions",
    commonTasks: "Common tasks and shortcuts",
    addProperty: "Add Property",
    tenants: "Tenants",
    reports: "Reports",
    vaults: "Vaults",

    // Lease Template
    leaseTemplate: "Lease Template",
    manageLeaseTemplate: "Manage your lease template for tenants",
    open: "Open",

    // Language
    language: "Language",
    english: "English",
    swahili: "Swahili",
    
    // Notifications dropdown
    markAllAsRead: "Mark all as read",
  },
  sw: {
    // Header
    dashboard: "Dashibodi",
    propertyManagement: "Usimamizi wa Mali",
    verifyAccount: "Thibitisha Akaunti",
    verifyTooltip: "Kuthibitisha akaunti yako kunaongeza uaminifu na kufungua vipengele vyote.",
    notifications: "Arifa",
    newNotifications: "mpya",
    noNotifications: "Hakuna arifa bado",
    notification: "Arifa",

    // Welcome
    welcomeBack: "Karibu tena,",
    welcomeSubtitle: "Hivi ndivyo inavyoendelea na mali zako leo.",

    // Loading & Error
    loading: "Inapakia...",
    failedToFetch: "Imeshindwa kupata data ya dashibodi",

    // Stats Cards
    totalProperties: "Jumla ya Mali",
    acrossAllLocations: "Katika maeneo yote",
    occupancyRate: "Kiwango cha Ukazi",
    healthy: "Nzuri",
    moderate: "Wastani",
    low: "Chini",
    ofUnits: "kati ya",
    units: "vitengo",
    monthlyRevenue: "Mapato ya Mwezi",
    comparedToLastMonth: "Ikilinganishwa na mwezi uliopita",
    pendingApplications: "Maombi Yanayosubiri",
    requireYourReview: "Yanahitaji ukaguzi wako",
    listed: "imeorodheshwa",

    // Recent Applications
    recentApplications: "Maombi ya Hivi Karibuni",
    newTenantApplications: "Maombi mapya ya wapangaji yanayosubiri ukaguzi",
    viewAll: "Tazama Yote",
    noRecentApplications: "Hakuna maombi ya hivi karibuni",
    pending: "inasubiri",
    showLess: "Onyesha Kidogo",
    viewAllApplications: "Tazama Yote",
    applications: "Maombi",

    // Upcoming Payments
    upcomingPayments: "Malipo Yanayokuja",
    rentPaymentsDueSoon: "Malipo ya kodi yanayotarajiwa hivi karibuni",
    noUpcomingPayments: "Hakuna malipo yanayokuja",
    overdue: "Imechelewa",
    due: "Inatakiwa",

    // Quick Actions
    quickActions: "Vitendo vya Haraka",
    commonTasks: "Kazi za kawaida na njia za mkato",
    addProperty: "Ongeza Mali",
    tenants: "Wapangaji",
    reports: "Ripoti",
    vaults: "Hazina",

    // Lease Template
    leaseTemplate: "Kiolezo cha Mkataba wa Kukodisha",
    manageLeaseTemplate: "Simamia kiolezo cha mkataba wako kwa wapangaji",
    open: "Fungua",

    // Language
    language: "Lugha",
    english: "English",
    swahili: "Kiswahili",
    
    // Notifications dropdown
    markAllAsRead: "Zote kama zimesomwa",
  },
};

export default function LandlordDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllApplications, setShowAllApplications] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Language state
  const [language, setLanguage] = useState<Language>("en");
  
  // Get translations based on current language - this will update when language changes
  const t = translations[language];

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("app-language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "sw")) {
      setLanguage(savedLang);
    }
  }, []);

  // Save language to localStorage when changed
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) throw new Error(t.failedToFetch);
        const data = await res.json();
        setStats(data.stats);
        setRecentApplications(data.recentApplications);
        setUpcomingPayments(data.recentPayments);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
    fetchNotifications();
    // Debug: Log current landlord user_id
    if (user && user.id) {
      console.log("[DEBUG] Landlord user_id:", user.id);
    }
    const handleClick = (e: MouseEvent) => {
      if (
        showNotifications &&
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showNotifications]); // Note: t is not in dependencies because it changes with language

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const result = await res.json();
      console.log("[DEBUG] /api/notifications result:", result);
      if (result.success) {
        setNotifications(result.notifications || []);
      } else if (result.notifications) {
        setNotifications(result.notifications);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      setNotifications([]);
      console.error("[DEBUG] Error fetching notifications:", err);
    }
  };

  const occupancyRate = stats && stats.totalUnits > 0 ? (stats.occupiedUnits / stats.totalUnits) * 100 : 0;
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;
  const displayName = (stats?.first_name || "") + (stats?.last_name ? (" " + stats.last_name) : "") || user?.full_name || "";

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-start justify-between px-3 py-3 sm:px-6 sm:py-4">
          <div className="text-center ml-2 sm:ml-0">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">{t.dashboard}</h1>
            <p className="text-xs text-muted-foreground">{t.propertyManagement}</p>
          </div>
          <div className="flex items-start gap-2">
            {/* Language Switcher */}
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
                  {t.english}
                  {language === "en" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange("sw")}
                  className="flex items-center justify-between"
                >
                  {t.swahili}
                  {language === "sw" && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-col items-end gap-2">
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-muted"
                  onClick={() => setShowNotifications((v) => !v)}
                  aria-label={t.notifications}
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                {showNotifications && (
                  <div
                    ref={notificationDropdownRef}
                    className="absolute right-0 top-12 z-50 w-[calc(100vw-1rem)] max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-xl sm:w-80"
                  >
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">{t.notifications}</span>
                      </div>
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {unreadCount} {t.newNotifications}
                        </Badge>
                      )}
                      {unreadCount > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2 px-2 py-1 text-xs"
                          onClick={async () => {
                            await fetch("/api/notifications/mark-all-read", { method: "POST" });
                            fetchNotifications();
                          }}
                        >
                          {t.markAllAsRead}
                        </Button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                          {t.noNotifications}
                        </div>
                      ) : (
                        <ul className="divide-y divide-border">
                          {notifications.map((n, i) => (
                            <li
                              key={n.id || i}
                              className={`px-4 py-3 transition-colors ${!n.is_read ? "bg-primary/5" : ""}`}
                            >
                              <div className="font-medium text-sm text-foreground">
                                {n.title || n.type || t.notification}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 break-words">
                                {n.content || n.message || n.body}
                              </div>
                              <div className="text-[11px] text-muted-foreground/60 mt-1">
                                {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {user && !user.isVerified && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-primary/30 text-primary hover:bg-primary/5"
                      onClick={() => router.push("/landlord/verification")}
                      aria-label={t.verifyAccount}
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>{t.verifyTooltip}</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl overflow-x-hidden px-3 py-6 sm:px-6 sm:py-8">
        {/* Welcome Section */}
        <section className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance md:text-3xl">
            {t.welcomeBack} <span className="text-primary">{displayName}</span>
          </h2>
          <p className="mt-1 text-muted-foreground">{t.welcomeSubtitle}</p>
        </section>

        {/* Stats Grid */}
        {loading ? (
          <div className="mb-8 grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-3 w-20 rounded bg-muted mb-2" />
                      <div className="h-7 w-12 rounded bg-muted mb-2" />
                      <div className="h-3 w-16 rounded bg-muted" />
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-muted flex-shrink-0 ml-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="mb-8 border-destructive/30 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : stats ? (
          <div className="mb-8 grid grid-cols-2 gap-3">
            {/* Total Properties */}
            <Card className="group relative overflow-hidden border-border/60 transition-all hover:shadow-md hover:border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium mb-1">{t.totalProperties}</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalProperties}</p>
                    <p className="mt-1.5 text-xs text-primary">📊 {stats.totalProperties} {t.listed}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ml-2 flex-shrink-0">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Occupancy Rate */}
            <Card className="group relative overflow-hidden border-border/60 transition-all hover:shadow-md hover:border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium mb-1">{t.occupancyRate}</p>
                    <p className="text-2xl font-bold text-foreground">{occupancyRate.toFixed(1)}%</p>
                    <p className="mt-1.5 text-xs text-primary">📈 {occupancyRate >= 80 ? t.healthy : occupancyRate >= 50 ? t.moderate : t.low}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ml-2 flex-shrink-0">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Revenue */}
            <Card className="group relative overflow-hidden border-border/60 transition-all hover:shadow-md hover:border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium mb-1">{t.monthlyRevenue}</p>
                    <p className="text-2xl font-bold text-foreground">Tsh {(stats.monthlyIncome / 1000000).toFixed(1)}M</p>
                    <p className="mt-1.5 text-xs text-primary">📈 +12.5%</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ml-2 flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Applications */}
            <Card className="group relative overflow-hidden border-border/60 transition-all hover:shadow-md hover:border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium mb-1">{t.pendingApplications}</p>
                    <p className="text-2xl font-bold text-foreground">{stats.pendingApplications}</p>
                    <p className="mt-1.5 text-xs text-primary">⏳ {stats.pendingApplications} {t.pending}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ml-2 flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Recent Applications */}
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-primary" />
                    {t.recentApplications}
                  </CardTitle>
                  <CardDescription className="mt-1">{t.newTenantApplications}</CardDescription>
                </div>
                <Link href="/landlord/applications">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs text-muted-foreground hover:text-primary"
                  >
                    {t.viewAll} <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div className="flex-1">
                          <div className="h-4 w-32 rounded bg-muted mb-2" />
                          <div className="h-3 w-48 rounded bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                ) : (Array.isArray(recentApplications) ? recentApplications.length === 0 : true) ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{t.noRecentApplications}</p>
                  </div>
                ) : (
                  <>
                    {(showAllApplications ? recentApplications : recentApplications.slice(0, 3)).map(
                      (app) => (
                        <div
                          key={app.id}
                          className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3 transition-colors hover:bg-muted/30"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                              {app.tenantName
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {app.tenantName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {app.propertyTitle}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              variant="outline"
                              className="text-[11px] capitalize border-primary/20 text-primary bg-primary/5"
                            >
                              {app.status?.replace("_", " ") || t.pending}
                            </Badge>
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                              <Clock className="h-3 w-3" />
                              {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                    {recentApplications.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-muted-foreground hover:text-primary"
                        onClick={() => setShowAllApplications(!showAllApplications)}
                      >
                        {showAllApplications
                          ? t.showLess
                          : `${t.viewAllApplications} ${recentApplications.length} ${t.applications}`}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Payments */}
          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="h-4 w-4 text-primary" />
                    {t.upcomingPayments}
                  </CardTitle>
                  <CardDescription className="mt-1">{t.rentPaymentsDueSoon}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-muted-foreground hover:text-primary"
                >
                  {t.viewAll} <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div className="flex-1">
                          <div className="h-4 w-32 rounded bg-muted mb-2" />
                          <div className="h-3 w-48 rounded bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                ) : upcomingPayments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{t.noUpcomingPayments}</p>
                  </div>
                ) : (
                  upcomingPayments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            payment.status === "overdue" ? "bg-destructive/10" : "bg-primary/10"
                          }`}
                        >
                          <DollarSign
                            className={`h-5 w-5 ${
                              payment.status === "overdue" ? "text-destructive" : "text-primary"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{payment.tenantName}</p>
                          <p className="text-xs text-muted-foreground">{payment.propertyTitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          Tsh {payment.amount?.toLocaleString()}
                        </p>
                        {payment.status === "overdue" ? (
                          <Badge variant="destructive" className="mt-1 text-[10px]">
                            {t.overdue}
                          </Badge>
                        ) : (
                          <span className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {payment.paymentDate
                              ? `${t.due} ${new Date(payment.paymentDate).toLocaleDateString()}`
                              : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{t.quickActions}</CardTitle>
            <CardDescription>{t.commonTasks}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <Link href="/landlord/properties/new" className="group">
                <div className="flex flex-col items-center gap-2.5 rounded-xl border border-border/60 bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm hover:bg-primary/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{t.addProperty}</span>
                </div>
              </Link>
              <Link href="/landlord/applications" className="group">
                <div className="flex flex-col items-center gap-2.5 rounded-xl border border-border/60 bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm hover:bg-primary/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{t.applications}</span>
                </div>
              </Link>
              <Link href="/landlord/tenants" className="group">
                <div className="flex flex-col items-center gap-2.5 rounded-xl border border-border/60 bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm hover:bg-primary/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{t.tenants}</span>
                </div>
              </Link>
              <div className="group cursor-pointer">
                <div className="flex flex-col items-center gap-2.5 rounded-xl border border-border/60 bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm hover:bg-primary/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{t.reports}</span>
                </div>
              </div>
              <Link href="/landlord/vaults" className="group">
                <div className="flex flex-col items-center gap-2.5 rounded-xl border border-border/60 bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-sm hover:bg-primary/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Vault className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{t.vaults}</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Lease Template */}
        <Card className="border-border/60 overflow-hidden">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t.leaseTemplate}</h3>
                <p className="text-sm text-muted-foreground">{t.manageLeaseTemplate}</p>
              </div>
            </div>
            <Button asChild size="sm" className="gap-1.5">
              <Link href="/landlord/lease-template">
                {t.open} <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}