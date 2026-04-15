"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Loader2,
  FileText,
  Building,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  Eye,
  Download,
  Home,
  Car,
  Shield,
  CheckCircle2,
  Globe,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

// ─── Translations ───
type Language = "en" | "sw"

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    tenant_applications_title: "Applications",
    review_and_manage_rental_applications: "Review and manage incoming rental applications from prospective tenants.",
    search_applications_placeholder: "Search by name, property, or email...",
    loading_applications: "Loading applications...",
    
    // Tabs & Status
    pending: "Pending",
    in_review: "In Review",
    approved: "Approved",
    rejected: "Rejected",
    
    // Stats
    total: "Total",
    approval_rate: "Approval Rate",
    avg_response: "Avg Response",
    days: "days",
    
    // Card labels
    move_in: "Move-in",
    rent: "Rent",
    email: "Email",
    phone: "Phone",
    duration: "Duration",
    months: "months",
    not_available: "N/A",
    credit_score: "Credit Score",
    shared: "Shared",
    not_shared: "Not Shared",
    rejection_reason: "Rejection Reason",
    
    // Actions
    approve: "Approve",
    reject: "Reject",
    send_lease: "Send Lease",
    review: "Review",
    view_details: "View Details",
    details: "Details",
    generate_lease_agreement: "Generate Lease",
    
    // Empty states
    no_pending_applications: "No Pending Applications",
    pending_applications_empty_desc: "Applications will appear here when tenants submit their rental applications",
    no_review_applications: "No Applications Under Review",
    review_applications_empty_desc: "Move applications here when you're actively reviewing them",
    no_approved_applications: "No Approved Applications",
    approved_applications_empty_desc: "Approved applications will appear here",
    no_rejected_applications: "No Rejected Applications",
    rejected_applications_empty_desc: "Rejected applications will appear here",
    
    // Dialog
    application_details: "Application Details",
    review_all_information: "Review all information submitted by the applicant",
    applicant_info: "Applicant Info",
    full_name: "Full Name",
    submitted: "Submitted",
    gender: "Gender",
    nationality: "Nationality",
    employment: "Employment",
    occupation: "Occupation",
    salary_range: "Salary Range",
    job_type: "Job Type",
    living_situation: "Living Situation",
    family_members: "Family Members",
    children: "Children",
    elders: "Elders",
    financial: "Financial",
    bank: "Bank",
    mobile_network: "Mobile Network",
    religion: "Religion",
    car_ownership: "Car Ownership",
    has_car: "Has Car",
    number_of_cars: "Number of Cars",
    applicant_message: "Applicant Message",
    no_message_provided: "No message provided.",
    failed_to_load_details: "Failed to load application details.",
    
    // Toast messages
    application_approved: "Application approved",
    tenant_will_be_notified: "Tenant will be notified.",
    failed_to_approve: "Failed to approve application",
    error_approving: "Error approving application",
    something_went_wrong: "Something went wrong.",
    application_rejected: "Application rejected",
    failed_to_reject: "Failed to reject application",
    error_rejecting: "Error rejecting application",
    lease_sent: "Lease sent",
    lease_sent_to_tenant: "Lease sent to tenant dashboard!",
    failed_to_send_lease: "Failed to send lease",
    could_not_send_lease: "Could not send lease.",
    error_sending_lease: "Error sending lease",
    error_move_to_review: "Error moving to review",
    unknown_error: "Unknown error",
    
    // Language
    english: "English",
    swahili: "Kiswahili",
  },
  sw: {
    // Header
    tenant_applications_title: "Maombi",
    review_and_manage_rental_applications: "Kagua na kusimamia maombi ya kukodisha kutoka kwa wapangaji watarajiwa.",
    search_applications_placeholder: "Tafuta kwa jina, mali, au barua pepe...",
    loading_applications: "Inapakia maombi...",
    
    // Tabs & Status
    pending: "Inasubiri",
    in_review: "Inakaguliwa",
    approved: "Imeidhinishwa",
    rejected: "Imekataliwa",
    
    // Stats
    total: "Jumla",
    approval_rate: "Kiwango cha Idhini",
    avg_response: "Wastani wa Majibu",
    days: "siku",
    
    // Card labels
    move_in: "Kuhamia",
    rent: "Kodi",
    email: "Barua pepe",
    phone: "Simu",
    duration: "Muda",
    months: "miezi",
    not_available: "Haipo",
    credit_score: "Alama ya Mkopo",
    shared: "Imeshirikiwa",
    not_shared: "Haijashirikiwa",
    rejection_reason: "Sababu ya Kukataa",
    
    // Actions
    approve: "Idhinisha",
    reject: "Kataa",
    send_lease: "Tuma Mkataba",
    review: "Kagua",
    view_details: "Angalia Maelezo",
    details: "Maelezo",
    generate_lease_agreement: "Tengeneza Mkataba",
    
    // Empty states
    no_pending_applications: "Hakuna Maombi Yanayosubiri",
    pending_applications_empty_desc: "Maombi yataonekana hapa wapangaji watakapotuma maombi yao ya kukodisha",
    no_review_applications: "Hakuna Maombi Yanayokaguliwa",
    review_applications_empty_desc: "Hamisha maombi hapa unapoyakagua kikamilifu",
    no_approved_applications: "Hakuna Maombi Yaliyoidhinishwa",
    approved_applications_empty_desc: "Maombi yaliyoidhinishwa yataonekana hapa",
    no_rejected_applications: "Hakuna Maombi Yaliyokataliwa",
    rejected_applications_empty_desc: "Maombi yaliyokataliwa yataonekana hapa",
    
    // Dialog
    application_details: "Maelezo ya Ombi",
    review_all_information: "Kagua taarifa zote zilizotumwa na mwombaji",
    applicant_info: "Taarifa za Mwombaji",
    full_name: "Jina Kamili",
    submitted: "Imetumwa",
    gender: "Jinsia",
    nationality: "Uraia",
    employment: "Ajira",
    occupation: "Kazi",
    salary_range: "Kipimo cha Mshahara",
    job_type: "Aina ya Kazi",
    living_situation: "Hali ya Kuishi",
    family_members: "Wanafamilia",
    children: "Watoto",
    elders: "Wazee",
    financial: "Fedha",
    bank: "Benki",
    mobile_network: "Mtandao wa Simu",
    religion: "Dini",
    car_ownership: "Umiliki wa Gari",
    has_car: "Ana Gari",
    number_of_cars: "Idadi ya Magari",
    applicant_message: "Ujumbe wa Mwombaji",
    no_message_provided: "Hakuna ujumbe uliotolewa.",
    failed_to_load_details: "Imeshindwa kupakia maelezo ya ombi.",
    
    // Toast messages
    application_approved: "Ombi limeidhinishwa",
    tenant_will_be_notified: "Mpangaji ataarifiwa.",
    failed_to_approve: "Imeshindwa kuidhinisha ombi",
    error_approving: "Hitilafu katika kuidhinisha ombi",
    something_went_wrong: "Kuna kitu kimeenda vibaya.",
    application_rejected: "Ombi limekataliwa",
    failed_to_reject: "Imeshindwa kukataa ombi",
    error_rejecting: "Hitilafu katika kukataa ombi",
    lease_sent: "Mkataba umetumwa",
    lease_sent_to_tenant: "Mkataba umetumwa kwenye dashibodi ya mpangaji!",
    failed_to_send_lease: "Imeshindwa kutuma mkataba",
    could_not_send_lease: "Haikuweza kutuma mkataba.",
    error_sending_lease: "Hitilafu katika kutuma mkataba",
    error_move_to_review: "Hitilafu katika kuhamisha kwa ukaguzi",
    unknown_error: "Hitilafu isiyojulikana",
    
    // Language
    english: "English",
    swahili: "Kiswahili",
  },
}

type StatusType = "pending" | "under_review" | "approved" | "rejected"

interface Application {
  id: string
  tenant_id: string
  property_id: string
  tenant_name: string
  tenant_email: string
  tenant_phone?: string
  tenant_verified: boolean
  property_title: string
  property_rent: number
  status: StatusType
  desired_move_in: string | null
  application_date: string | null
  lease_duration_months: number
  message?: string
  credit_score_shared: boolean
  rejection_reason?: string
}

/* ─── Stat Card ─── */
function StatCard({
  icon,
  value,
  label,
  accentColor,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  accentColor: string
}) {
  return (
    <Card className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentColor} transition-colors`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Status Badge ─── */
function StatusBadge({ status, t }: { status: StatusType; t: (key: string) => string }) {
  const config: Record<StatusType, { labelKey: string; icon: React.ReactNode; className: string }> = {
    pending: {
      labelKey: "pending",
      icon: <Clock className="h-3 w-3" />,
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15",
    },
    under_review: {
      labelKey: "in_review",
      icon: <TrendingUp className="h-3 w-3" />,
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/15",
    },
    approved: {
      labelKey: "approved",
      icon: <CheckCircle className="h-3 w-3" />,
      className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
    },
    rejected: {
      labelKey: "rejected",
      icon: <XCircle className="h-3 w-3" />,
      className: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
    },
  }
  const c = config[status]
  return (
    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider gap-1 font-medium ${c.className}`}>
      {c.icon}
      {t(c.labelKey)}
    </Badge>
  )
}

/* ─── Credit Score Indicator ─── */
function CreditIndicator({ shared, t }: { shared: boolean; t: (key: string) => string }) {
  return (
    <div className="flex items-center gap-2">
      {shared ? (
        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 gap-1 text-[10px]">
          <CheckCircle2 className="h-3 w-3" />
          {t("shared")}
        </Badge>
      ) : (
        <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground">
          <Lock className="h-3 w-3" />
          {t("not_shared")}
        </Badge>
      )}
      <div className="flex-1 max-w-[100px]">
        <Progress value={shared ? 100 : 30} className="h-1.5" />
      </div>
    </div>
  )
}

/* ─── Application Card ─── */
function ApplicationCard({
  app,
  variant,
  formatDate,
  getInitials,
  onApprove,
  onReject,
  onSendLease,
  onShowDetails,
  onMoveToReview,
  t,
}: {
  app: Application
  variant: "pending" | "review" | "approved" | "rejected"
  formatDate: (d: string | null) => string
  getInitials: (n: string) => string
  onApprove: () => void
  onReject: () => void
  onSendLease: () => void
  onShowDetails: (id: string) => void
  onMoveToReview: () => void
  t: (key: string) => string
}) {
  const statusMap: Record<string, StatusType> = {
    pending: "pending",
    review: "under_review",
    approved: "approved",
    rejected: "rejected",
  }

  const accentColor =
    variant === "approved"
      ? "bg-primary"
      : variant === "rejected"
        ? "bg-destructive"
        : variant === "review"
          ? "bg-blue-500"
          : "bg-amber-500"

  return (
    <Card className="group border-border/60 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Top accent bar */}
        <div className={`h-1 w-full ${accentColor}`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-card">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {getInitials(app.tenant_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-foreground text-base truncate">{app.tenant_name}</h3>
                <StatusBadge status={statusMap[variant]} t={t} />
                {app.tenant_verified && <Shield className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span className="truncate">{app.property_title}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(app.application_date)}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1">
              <p className="text-xl font-bold text-foreground tracking-tight">
                Tsh {app.property_rent?.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("rent")}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 rounded-xl bg-muted/40 border border-border/40">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {t("move_in")}
              </span>
              <span className="text-sm font-medium text-foreground">{formatDate(app.desired_move_in)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {t("duration")}
              </span>
              <span className="text-sm font-medium text-foreground">{app.lease_duration_months} {t("months")}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {t("email")}
              </span>
              <span className="text-sm font-medium text-foreground truncate">{app.tenant_email}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {t("phone")}
              </span>
              <span className="text-sm font-medium text-foreground">{app.tenant_phone || t("not_available")}</span>
            </div>
          </div>

          {/* Credit score */}
          <div className="flex items-center gap-3 mb-3 text-xs">
            <span className="text-muted-foreground font-medium">{t("credit_score")}</span>
            <CreditIndicator shared={app.credit_score_shared} t={t} />
          </div>

          {/* Message */}
          {app.message && (
            <div className="mb-3">
              <div className="bg-muted/60 rounded-xl px-4 py-3 flex items-start gap-2.5 border border-border/30">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{app.message}</p>
              </div>
            </div>
          )}

          {/* Rejection reason */}
          {variant === "rejected" && app.rejection_reason && (
            <div className="mb-3">
              <div className="bg-destructive/5 border border-destructive/10 rounded-xl px-4 py-3 flex items-start gap-2.5">
                <XCircle className="h-3.5 w-3.5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-medium text-destructive uppercase tracking-wider">{t("rejection_reason")}</span>
                  <p className="text-xs text-destructive/80 mt-0.5">{app.rejection_reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/40">
            {(variant === "pending" || variant === "review") && (
              <>
                <Button
                  size="sm"
                  className="h-8 text-xs rounded-lg gap-1.5 px-3 font-medium shadow-sm"
                  onClick={onApprove}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  {t("approve")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs rounded-lg gap-1.5 px-3 text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive font-medium"
                  onClick={onReject}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  {t("reject")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs rounded-lg gap-1.5 px-3 font-medium"
                  onClick={onSendLease}
                >
                  <FileText className="h-3.5 w-3.5" />
                  {t("send_lease")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs rounded-lg gap-1.5 px-3 bg-blue-500/5 text-blue-600 border-blue-500/20 hover:bg-blue-500/10 font-medium"
                  onClick={onMoveToReview}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  {t("review")}
                </Button>
              </>
            )}
            {variant === "approved" && (
              <>
                <Button size="sm" className="h-8 text-xs rounded-lg gap-1.5 px-3 font-medium shadow-sm" onClick={onSendLease}>
                  <FileText className="h-3.5 w-3.5" />
                  {t("send_lease")}
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg gap-1.5 px-3 font-medium">
                  <Download className="h-3.5 w-3.5" />
                  {t("generate_lease_agreement")}
                </Button>
              </>
            )}
            {variant === "rejected" && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-lg gap-1.5 px-3 font-medium"
                onClick={() => onShowDetails(app.id)}
              >
                <Eye className="h-3.5 w-3.5" />
                {t("view_details")}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs rounded-lg gap-1 px-2 text-muted-foreground hover:text-foreground ml-auto"
              onClick={() => onShowDetails(app.id)}
            >
              {t("details")}
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Empty State ─── */
function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 border border-border/40 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">{description}</p>
    </div>
  )
}

/* ─── App List ─── */
function AppList({
  apps,
  variant,
  emptyIcon,
  emptyTitle,
  emptyDesc,
  formatDate,
  getInitials,
  onApprove,
  onReject,
  onSendLease,
  onShowDetails,
  onMoveToReview,
  t,
}: {
  apps: Application[]
  variant: "pending" | "review" | "approved" | "rejected"
  emptyIcon: React.ReactNode
  emptyTitle: string
  emptyDesc: string
  formatDate: (d: string | null) => string
  getInitials: (n: string) => string
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onSendLease: (app: Application) => void
  onShowDetails: (id: string) => void
  onMoveToReview: (id: string) => void
  t: (key: string) => string
}) {
  if (apps.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDesc} />
  }
  return (
    <div className="grid gap-4 p-4">
      {apps.map((app) => (
        <ApplicationCard
          key={app.id}
          app={app}
          variant={variant}
          formatDate={formatDate}
          getInitials={getInitials}
          onApprove={() => onApprove(app.id)}
          onReject={() => onReject(app.id)}
          onSendLease={() => onSendLease(app)}
          onShowDetails={onShowDetails}
          onMoveToReview={() => onMoveToReview(app.id)}
          t={t}
        />
      ))}
    </div>
  )
}

/* ─── Detail Section ─── */
function DetailSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">{children}</div>
    </section>
  )
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="text-sm font-medium text-foreground mt-0.5">{value}</div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function ApplicationsPage() {
  const [language, setLanguage] = useState<Language>("en")
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<StatusType>("pending")
  const [selectedApp, setSelectedApp] = useState<any | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

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
  const t = React.useMemo(() => (key: string) => translations[language][key] || key, [language])

  const toast = ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`[Toast] ${title}: ${description}`)
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications")
      const data = await res.json()
      if (data.success) {
        setApplications(data.applications || [])
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      })
      const data = await res.json()
      if (data.success) {
        fetchApplications()
        toast({ title: t("application_approved"), description: t("tenant_will_be_notified") })
      } else {
        toast({ title: t("failed_to_approve"), description: data.error || t("unknown_error"), variant: "destructive" })
      }
    } catch (error) {
      toast({ title: t("error_approving"), description: t("something_went_wrong"), variant: "destructive" })
      console.error("Error approving application:", error)
    }
  }

  const handleReject = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", rejection_reason: "Application does not meet requirements" }),
      })
      const data = await res.json()
      if (data.success) {
        fetchApplications()
        toast({ title: t("application_rejected"), description: t("tenant_will_be_notified") })
      } else {
        toast({ title: t("failed_to_reject"), description: data.error || t("unknown_error"), variant: "destructive" })
      }
    } catch (error) {
      toast({ title: t("error_rejecting"), description: t("something_went_wrong"), variant: "destructive" })
      console.error("Error rejecting application:", error)
    }
  }

  const handleMoveToReview = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "under_review" }),
      })
      const data = await res.json()
      if (data.success) {
        fetchApplications()
      }
    } catch (error) {
      alert(t("error_move_to_review"))
    }
  }

  const handleSendLease = async (app: Application) => {
    try {
      const res = await fetch("/api/leases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: app.tenant_id,
          property_id: app.property_id,
          application_id: app.id,
          lease_start: new Date().toISOString().slice(0, 10),
          lease_duration_months: app.lease_duration_months,
          rent: app.property_rent,
        }),
      })
      if (res.ok) {
        toast({ title: t("lease_sent"), description: t("lease_sent_to_tenant") })
      } else {
        toast({ title: t("failed_to_send_lease"), description: t("could_not_send_lease"), variant: "destructive" })
      }
    } catch (err) {
      toast({ title: t("error_sending_lease"), description: String(err), variant: "destructive" })
    }
  }

  const filteredApplications = applications.filter((app) => {
    const query = searchQuery.toLowerCase()
    return (
      app.tenant_name?.toLowerCase().includes(query) ||
      app.property_title?.toLowerCase().includes(query) ||
      app.tenant_email?.toLowerCase().includes(query)
    )
  })

  const pendingApps = filteredApplications.filter((a) => a.status === "pending")
  const reviewApps = filteredApplications.filter((a) => a.status === "under_review")
  const approvedApps = filteredApplications.filter((a) => a.status === "approved")
  const rejectedApps = filteredApplications.filter((a) => a.status === "rejected")

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return t("not_available")
    return new Date(dateStr).toLocaleDateString(language === "sw" ? "sw-TZ" : "en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleShowDetails = async (appId: string) => {
    setDetailsOpen(true)
    try {
      const res = await fetch(`/api/applications/${appId}`)
      const data = await res.json()
      if (data.success) {
        setSelectedApp(data.application)
      } else {
        setSelectedApp(null)
      }
    } catch {
      setSelectedApp(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium">{t("loading_applications")}</p>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
                    {t("tenant_applications_title")}
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("review_and_manage_rental_applications")}
                  </p>
                </div>
              </div>
              
              {/* Language Switcher (icon-only, dropdown, consistent with payments page) */}
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
                    {t("english")}
                    {language === "en" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("sw")}
                    className="flex items-center justify-between"
                  >
                    {t("swahili")}
                    {language === "sw" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-md mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search_applications_placeholder")}
              className="pl-10 h-10 text-sm rounded-xl bg-card border-border/60 shadow-sm focus-visible:ring-primary/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<Clock className="h-5 w-5" />}
              value={pendingApps.length}
              label={t("pending")}
              accentColor="bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/15"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              value={reviewApps.length}
              label={t("in_review")}
              accentColor="bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/15"
            />
            <StatCard
              icon={<CheckCircle className="h-5 w-5" />}
              value={approvedApps.length}
              label={t("approved")}
              accentColor="bg-primary/10 text-primary group-hover:bg-primary/15"
            />
            <StatCard
              icon={<XCircle className="h-5 w-5" />}
              value={rejectedApps.length}
              label={t("rejected")}
              accentColor="bg-destructive/10 text-destructive group-hover:bg-destructive/15"
            />
          </div>

          {/* Tabs */}
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <Tabs defaultValue="pending" value={activeTab} onValueChange={(v) => setActiveTab(v as StatusType)}>
              <div className="border-b border-border/40 px-4 pt-3 bg-card">
                <TabsList className="bg-transparent p-0 h-auto gap-6">
                  {([
                    { value: "pending" as StatusType, labelKey: "pending", count: pendingApps.length },
                    { value: "under_review" as StatusType, labelKey: "in_review", count: reviewApps.length },
                    { value: "approved" as StatusType, labelKey: "approved", count: approvedApps.length },
                    { value: "rejected" as StatusType, labelKey: "rejected", count: rejectedApps.length },
                  ] as const).map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-1 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent transition-colors"
                    >
                      {t(tab.labelKey)}
                      <span className="ml-2 text-[10px] tabular-nums bg-muted/80 text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                        {tab.count}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="pending" className="mt-0">
                <AppList
                  apps={pendingApps}
                  variant="pending"
                  emptyIcon={<Clock className="h-7 w-7 text-amber-400" />}
                  emptyTitle={t("no_pending_applications")}
                  emptyDesc={t("pending_applications_empty_desc")}
                  formatDate={formatDate}
                  getInitials={getInitials}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onSendLease={handleSendLease}
                  onShowDetails={handleShowDetails}
                  onMoveToReview={handleMoveToReview}
                  t={t}
                />
              </TabsContent>
              <TabsContent value="under_review" className="mt-0">
                <AppList
                  apps={reviewApps}
                  variant="review"
                  emptyIcon={<TrendingUp className="h-7 w-7 text-blue-400" />}
                  emptyTitle={t("no_review_applications")}
                  emptyDesc={t("review_applications_empty_desc")}
                  formatDate={formatDate}
                  getInitials={getInitials}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onSendLease={handleSendLease}
                  onShowDetails={handleShowDetails}
                  onMoveToReview={handleMoveToReview}
                  t={t}
                />
              </TabsContent>
              <TabsContent value="approved" className="mt-0">
                <AppList
                  apps={approvedApps}
                  variant="approved"
                  emptyIcon={<CheckCircle className="h-7 w-7 text-primary" />}
                  emptyTitle={t("no_approved_applications")}
                  emptyDesc={t("approved_applications_empty_desc")}
                  formatDate={formatDate}
                  getInitials={getInitials}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onSendLease={handleSendLease}
                  onShowDetails={handleShowDetails}
                  onMoveToReview={handleMoveToReview}
                  t={t}
                />
              </TabsContent>
              <TabsContent value="rejected" className="mt-0">
                <AppList
                  apps={rejectedApps}
                  variant="rejected"
                  emptyIcon={<XCircle className="h-7 w-7 text-destructive" />}
                  emptyTitle={t("no_rejected_applications")}
                  emptyDesc={t("rejected_applications_empty_desc")}
                  formatDate={formatDate}
                  getInitials={getInitials}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onSendLease={handleSendLease}
                  onShowDetails={handleShowDetails}
                  onMoveToReview={handleMoveToReview}
                  t={t}
                />
              </TabsContent>
            </Tabs>
          </Card>

          {/* Footer Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t("total")}</p>
                <p className="text-2xl font-bold text-foreground mt-1 tracking-tight">{applications.length}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t("approval_rate")}</p>
                <p className="text-2xl font-bold text-foreground mt-1 tracking-tight">
                  {applications.length > 0 ? `${Math.round((approvedApps.length / applications.length) * 100)}%` : "0%"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t("avg_response")}</p>
                <p className="text-2xl font-bold text-foreground mt-1 tracking-tight">2.4 {t("days")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-border/60">
          <div className="h-1.5 w-full bg-primary" />
          <DialogHeader className="px-8 pt-6 pb-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Eye className="w-4 h-4" />
              </div>
              {t("application_details")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mt-1">
              {t("review_all_information")}
            </DialogDescription>
          </DialogHeader>
          <div className="px-8 pb-8 pt-2 max-h-[70vh] overflow-y-auto">
            {selectedApp ? (
              <div className="space-y-6">
                <DetailSection
                  icon={
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                        {selectedApp.full_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  }
                  title={t("applicant_info")}
                >
                  <DetailField label={t("full_name")} value={selectedApp.full_name} />
                  <DetailField
                    label={t("submitted")}
                    value={selectedApp.created_at ? new Date(selectedApp.created_at).toLocaleString(language === "sw" ? "sw-TZ" : "en-US") : t("not_available")}
                  />
                  <DetailField
                    label={t("email")}
                    value={
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        {selectedApp.email}
                      </span>
                    }
                  />
                  <DetailField
                    label={t("phone")}
                    value={
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-primary" />
                        {selectedApp.phone}
                      </span>
                    }
                  />
                  <DetailField label={t("gender")} value={selectedApp.gender} />
                  <DetailField label={t("nationality")} value={selectedApp.nationality} />
                </DetailSection>

                <div className="border-t border-border/40" />

                <DetailSection icon={<Building className="w-4 h-4" />} title={t("employment")}>
                  <DetailField label={t("occupation")} value={selectedApp.occupation} />
                  <DetailField label={t("salary_range")} value={selectedApp.salary_range} />
                  <DetailField label={t("job_type")} value={selectedApp.job_type} />
                </DetailSection>

                <div className="border-t border-border/40" />

                <DetailSection icon={<Home className="w-4 h-4" />} title={t("living_situation")}>
                  <DetailField label={t("living_situation")} value={selectedApp.living_situation} />
                  {selectedApp.living_situation === "family" && (
                    <>
                      <DetailField label={t("family_members")} value={selectedApp.family_count} />
                      <DetailField label={t("children")} value={selectedApp.children_count} />
                      <DetailField label={t("elders")} value={selectedApp.elders_count} />
                    </>
                  )}
                </DetailSection>

                <div className="border-t border-border/40" />

                <DetailSection icon={<DollarSign className="w-4 h-4" />} title={t("financial")}>
                  <DetailField label={t("bank")} value={selectedApp.bank} />
                  <DetailField label={t("mobile_network")} value={selectedApp.mobile_network} />
                  <DetailField label={t("religion")} value={selectedApp.religion} />
                </DetailSection>

                <div className="border-t border-border/40" />

                <DetailSection icon={<Car className="w-4 h-4" />} title={t("car_ownership")}>
                  <DetailField label={t("has_car")} value={selectedApp.has_car} />
                  {selectedApp.has_car === "yes" && (
                    <DetailField label={t("number_of_cars")} value={selectedApp.car_count} />
                  )}
                </DetailSection>

                <div className="border-t border-border/40" />

                <section>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-primary">
                    <MessageSquare className="w-4 h-4" />
                    {t("applicant_message")}
                  </h3>
                  <div className="bg-muted/40 rounded-xl p-4 text-sm text-foreground whitespace-pre-line min-h-[48px] border border-border/40 leading-relaxed">
                    {selectedApp.message || (
                      <span className="italic text-muted-foreground">{t("no_message_provided")}</span>
                    )}
                  </div>
                </section>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 mb-3">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <p className="text-sm text-destructive font-medium">{t("failed_to_load_details")}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
