"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Mail, Phone, MapPin, Plus, UserPlus, Loader2, Calendar, DollarSign, Clock, AlertTriangle, Users, TrendingUp, CheckCircle2, AlertCircle, Building2, ArrowRight, Shield, ChevronRight, Globe } from "lucide-react"
import { PreviewCard } from "@/components/lease-template-preview"
import Link from "next/link"
import { useState, useEffect } from "react"

// =========================
// TRANSLATIONS
// =========================
type Language = "en" | "sw"

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    tenants: "Tenants",
    manage_tenants: "Manage your tenants, leases, and payment statuses all in one place.",
    add_tenant: "Add Tenant",
    add_new_tenant: "Add New Tenant",
    
    // Form labels
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    phone: "Phone",
    phone_placeholder: "+255 XXX XXX XXX",
    nida_number: "NIDA Number",
    enter_nida_number: "Enter NIDA number",
    assign_to_property: "Assign to Property",
    select_property: "Select a property",
    no_available_properties: "No available properties",
    no_properties_message: "No available properties. Add properties first or mark existing ones as vacant.",
    monthly_rent: "Monthly Rent",
    monthly_payment_info: "This amount will be charged monthly to the tenant.",
    lease_start: "Lease Start",
    lease_end: "Lease End",
    lease_end_date: "Lease End Date",
    lease_end_auto_calc: "Automatically calculated based on start date and lease period",
    lease_period: "Lease Period",
    select_period: "Select period",
    months: "months",
    otp_label: "One-Time Password",
    generate_otp_for_tenant: "Click generate to create OTP",
    generated: "Generated",
    generate: "Generate",
    otp_sent_info: "This OTP will be sent to the tenant's email for verification.",
    cancel: "Cancel",
    adding: "Adding...",
    
    // Stats
    total_tenants: "Total Tenants",
    active_leases: "Active Leases",
    paid_this_month: "Paid This Month",
    overdue: "Overdue",
    this_month: "this month",
    on_track: "On track",
    needs_attention: "Needs attention",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    paid: "Paid",
    
    // Actions
    call: "Call",
    view_profile: "View Profile",
    send_lease: "Send Lease",
    send_reminder: "Send Reminder",
    
    // Lease info
    time_remaining: "Time Remaining",
    lease_expired: "Lease Expired",
    days_left: "days left",
    expiring_soon: "Expiring soon",
    action_needed: "Action needed",
    
    // Other labels
    percent: "%",
    total: "Total",
    registered: "Registered",
    status: "Status",
    location: "Location",
    
    // Dialog
    property_occupied: "Property Occupied",
    property_occupied_desc: "This property already has an active tenant. Please select a different property.",
    close: "Close",
    
    // Empty state
    no_tenants_yet: "No tenants yet",
    empty_state_description: "Start managing your properties by adding your first tenant. They will receive an email with login credentials.",
    
    // Search
    search_placeholder: "Search by name, email, property...",
    
    // Loading
    loading_tenants: "Loading tenants...",
    
    // Toast messages
    using_demo_data: "Using Demo Data",
    api_not_responding: "API endpoint not responding. Showing demo tenants.",
    api_error: "API Error",
    failed_load_tenants: "Failed to load tenants. Showing demo data.",
    network_error: "Network Error",
    could_not_connect: "Could not connect to server. Showing demo data.",
    using_demo_properties: "Using Demo Properties",
    properties_api_not_responding: "Properties API not responding. Showing demo data.",
    properties_api_error: "Properties API Error",
    failed_load_properties: "Failed to load properties. Showing demo data.",
    properties_error: "Properties Error",
    could_not_load_properties: "Could not load properties. Showing demo data.",
    duplicate_tenant: "Duplicate Tenant",
    tenant_exists: "A tenant with this email already exists.",
    success: "Success",
    tenant_added: "Tenant added successfully.",
    error: "Error",
    failed_add_tenant: "Failed to add tenant",
    tenant_added_demo: "Tenant Added (Demo Mode)",
    added_locally: "Added tenant locally (API unavailable).",
    lease_sent: "Lease Sent",
    lease_sent_desc: "Lease sent to tenant dashboard for signing.",
    reminder_sent: "Reminder Sent",
    reminder_sent_desc: "Reminder sent to tenant successfully.",
    failed_send_reminder: "Failed to send reminder.",
    landlord_not_authenticated: "Landlord not authenticated.",
    
    // Language
    language: "Language",
    english: "English",
    swahili: "Kiswahili",
  },
  sw: {
    // Header
    tenants: "Wapangaji",
    manage_tenants: "Simamia wapangaji wako, mikataba, na hali za malipo mahali pamoja.",
    add_tenant: "Ongeza Mpangaji",
    add_new_tenant: "Ongeza Mpangaji Mpya",
    
    // Form labels
    first_name: "Jina la Kwanza",
    last_name: "Jina la Mwisho",
    email: "Barua Pepe",
    phone: "Simu",
    phone_placeholder: "+255 XXX XXX XXX",
    nida_number: "Nambari ya NIDA",
    enter_nida_number: "Weka nambari ya NIDA",
    assign_to_property: "Weka kwa Mali",
    select_property: "Chagua mali",
    no_available_properties: "Hakuna mali zinazopatikana",
    no_properties_message: "Hakuna mali zinazopatikana. Ongeza mali kwanza au weka zilizo sasa kuwa tupu.",
    monthly_rent: "Kodi ya Kila Mwezi",
    monthly_payment_info: "Kiasi hiki kitalipiwa kila mwezi na mpangaji.",
    lease_start: "Kuanza Mkataba",
    lease_end: "Mwisho wa Mkataba",
    lease_end_date: "Tarehe ya Mwisho wa Mkataba",
    lease_end_auto_calc: "Imehesabiwa kiotomatiki kulingana na tarehe ya kuanza na kipindi cha mkataba",
    lease_period: "Kipindi cha Mkataba",
    select_period: "Chagua kipindi",
    months: "miezi",
    otp_label: "Nenosiri la Mara Moja",
    generate_otp_for_tenant: "Bonyeza tengeneza kuunda OTP",
    generated: "Imetengenezwa",
    generate: "Tengeneza",
    otp_sent_info: "OTP hii itatumwa kwa barua pepe ya mpangaji kwa uthibitisho.",
    cancel: "Ghairi",
    adding: "Inaongeza...",
    
    // Stats
    total_tenants: "Jumla ya Wapangaji",
    active_leases: "Mikataba Inayofanya Kazi",
    paid_this_month: "Wamelipa Mwezi Huu",
    overdue: "Wamechelewa",
    this_month: "mwezi huu",
    on_track: "Iko sawa",
    needs_attention: "Inahitaji umakini",
    
    // Status
    active: "Inafanya Kazi",
    inactive: "Haifanyi Kazi",
    pending: "Inasubiri",
    paid: "Amelipa",
    
    // Actions
    call: "Piga Simu",
    view_profile: "Angalia Wasifu",
    send_lease: "Tuma Mkataba",
    send_reminder: "Tuma Kikumbusho",
    
    // Lease info
    time_remaining: "Muda Uliobaki",
    lease_expired: "Mkataba Umeisha",
    days_left: "siku zimebaki",
    expiring_soon: "Inakaribia kuisha",
    action_needed: "Hatua inahitajika",
    
    // Other labels
    percent: "%",
    total: "Jumla",
    registered: "Amesajiliwa",
    status: "Hali",
    location: "Mahali",
    
    // Dialog
    property_occupied: "Mali Imekaliwa",
    property_occupied_desc: "Mali hii tayari ina mpangaji anayefanya kazi. Tafadhali chagua mali nyingine.",
    close: "Funga",
    
    // Empty state
    no_tenants_yet: "Hakuna wapangaji bado",
    empty_state_description: "Anza kusimamia mali zako kwa kuongeza mpangaji wako wa kwanza. Watapokea barua pepe yenye vitambulisho vya kuingia.",
    
    // Search
    search_placeholder: "Tafuta kwa jina, barua pepe, mali...",
    
    // Loading
    loading_tenants: "Inapakia wapangaji...",
    
    // Toast messages
    using_demo_data: "Inatumia Data ya Mfano",
    api_not_responding: "API haijibu. Inaonyesha wapangaji wa mfano.",
    api_error: "Kosa la API",
    failed_load_tenants: "Imeshindwa kupakia wapangaji. Inaonyesha data ya mfano.",
    network_error: "Kosa la Mtandao",
    could_not_connect: "Haikuweza kuungana na seva. Inaonyesha data ya mfano.",
    using_demo_properties: "Inatumia Mali za Mfano",
    properties_api_not_responding: "API ya mali haijibu. Inaonyesha data ya mfano.",
    properties_api_error: "Kosa la API ya Mali",
    failed_load_properties: "Imeshindwa kupakia mali. Inaonyesha data ya mfano.",
    properties_error: "Kosa la Mali",
    could_not_load_properties: "Haikuweza kupakia mali. Inaonyesha data ya mfano.",
    duplicate_tenant: "Mpangaji Anayejirudia",
    tenant_exists: "Mpangaji mwenye barua pepe hii tayari yupo.",
    success: "Imefanikiwa",
    tenant_added: "Mpangaji ameongezwa kwa mafanikio.",
    error: "Kosa",
    failed_add_tenant: "Imeshindwa kuongeza mpangaji",
    tenant_added_demo: "Mpangaji Ameongezwa (Hali ya Mfano)",
    added_locally: "Mpangaji ameongezwa ndani (API haipatikani).",
    lease_sent: "Mkataba Umetumwa",
    lease_sent_desc: "Mkataba umetumwa kwa dashibodi ya mpangaji kwa saini.",
    reminder_sent: "Kikumbusho Kimetumwa",
    reminder_sent_desc: "Kikumbusho kimetumwa kwa mpangaji kwa mafanikio.",
    failed_send_reminder: "Imeshindwa kutuma kikumbusho.",
    landlord_not_authenticated: "Mmiliki hajahibitishwa.",
    
    // Language
    language: "Lugha",
    english: "English",
    swahili: "Kiswahili",
  }
}

// =========================
// HOOKS
// =========================
const useLanguage = (lang: Language) => ({
  t: (key: string) => translations[lang][key] || key,
})

const useToast = () => ({
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`[Toast] ${title}: ${description}`)
  },
})

// Removed demo useAuth. We'll fetch the real user from /api/auth/me

// =========================
// TYPES
// =========================
interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  property: string
  propertyAddress?: string
  city?: string
  region?: string
  rent: number
  leaseStart: string
  leaseEnd: string
  leasePeriod: number
  status: "Active" | "Inactive" | "Pending"
  paymentStatus: "Paid" | "Pending" | "Overdue"
  isVerified: boolean
}

interface Property {
  id: string
  title: string
  address: string
  rent_amount: number
  status: "Occupied" | "Vacant" | "Maintenance"
}

interface FormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  nida_number: string
  property_id: string
  lease_start: string
  lease_period: string
  otp: string
}

// =========================
// SUB-COMPONENTS
// =========================
function StatCard({ icon, value, label, trend, trendUp }: { icon: React.ReactNode; value: string | number; label: string; trend?: string; trendUp?: boolean }) {
  return (
    <Card className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-primary' : 'text-destructive'}`}>
                <TrendingUp className={`h-3 w-3 ${!trendUp ? 'rotate-180' : ''}`} />
                {trend}
              </div>
            )}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LeaseProgressRing({ percentage, daysRemaining, isNearEnd, isExpired }: { percentage: number; daysRemaining: number; isNearEnd: boolean; isExpired: boolean }) {
  const size = 56
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  let strokeColor = "stroke-primary"
  let textColor = "text-primary"
  if (isNearEnd) { strokeColor = "stroke-amber-500"; textColor = "text-amber-500" }
  if (isExpired) { strokeColor = "stroke-destructive"; textColor = "text-destructive" }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`${strokeColor} transition-all duration-500`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${textColor}`}>
        <span className="text-[9px] font-bold leading-none">{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}

function PaymentBadge({ status, t }: { status: string; t: (key: string) => string }) {
  if (status === "Paid") {
    return (
      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        {t("paid")}
      </Badge>
    )
  }
  if (status === "Overdue") {
    return (
      <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15 gap-1">
        <AlertCircle className="h-3 w-3" />
        {t("overdue")}
      </Badge>
    )
  }
  return (
    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15 gap-1">
      <Clock className="h-3 w-3" />
      {t("pending")}
    </Badge>
  )
}

function TenantCard({
  tenant,
  properties,
  user,
  toast,
  t,
  calculateDaysRemaining,
  getLeaseTimePercentage,
  idx,
}: {
  tenant: Tenant
  properties: Property[]
  user: any
  toast: (args: { title: string; description: string; variant?: string }) => void
  t: (key: string) => string
  calculateDaysRemaining: (leaseEnd: string) => number
  getLeaseTimePercentage: (tenant: Tenant) => number
  idx: number
}) {
  const daysRemaining = calculateDaysRemaining(tenant.leaseEnd)
  const timePercentage = getLeaseTimePercentage(tenant)
  const isNearEnd = daysRemaining <= 30 && daysRemaining > 0
  const isExpired = daysRemaining <= 0
  const totalRent = tenant.rent * tenant.leasePeriod

  const initials = tenant.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const statusKey = tenant.status.toLowerCase() as "active" | "inactive" | "pending"

  return (
    <Card className="group border-border/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Top row: avatar + name + rent */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <Avatar className="h-11 w-11 border-2 border-primary/20 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground text-base truncate">{tenant.name}</h3>
                  <Badge
                    variant={tenant.status === "Active" ? "default" : "secondary"}
                    className="text-[10px] uppercase tracking-wider"
                  >
                    {t(statusKey)}
                  </Badge>
                  {tenant.isVerified && (
                    <Shield className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{tenant.email}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {tenant.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1">
              <p className="text-xl font-bold text-foreground tracking-tight">
                Tsh {tenant.rent.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("monthly_rent")}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 rounded-xl bg-muted/40 border border-border/40">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t("lease_start")}</span>
              <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3 text-primary" />
                {tenant.leaseStart}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t("lease_end")}</span>
              <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                {tenant.leaseEnd}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t("lease_period")}</span>
              <span className="text-xs font-semibold text-foreground">{tenant.leasePeriod} {t("months")}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t("location")}</span>
              <span className="text-xs font-semibold text-foreground flex items-center gap-1 truncate">
                <Building2 className="h-3 w-3 text-primary shrink-0" />
                {tenant.propertyAddress ? `${tenant.propertyAddress}${tenant.city ? ", " + tenant.city : ""}${tenant.region ? ", " + tenant.region : ""}` : tenant.property}
              </span>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <PaymentBadge status={tenant.paymentStatus} t={t} />
              <span className={`text-xs font-semibold ${tenant.isVerified ? 'text-primary' : 'text-amber-600'}`}>
                {tenant.isVerified ? t("registered") : t("pending")}
              </span>

              {/* Mobile rent */}
              <span className="sm:hidden text-xs font-bold text-foreground ml-auto">
                Tsh {tenant.rent.toLocaleString()}/mo
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Lease timer section */}
              <div className="flex items-center gap-3 flex-1 sm:flex-none">
                <LeaseProgressRing
                  percentage={timePercentage}
                  daysRemaining={daysRemaining}
                  isNearEnd={isNearEnd}
                  isExpired={isExpired}
                />
                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${isExpired ? 'text-destructive' : isNearEnd ? 'text-amber-500' : 'text-foreground'}`}>
                    {isExpired ? t("lease_expired") : `${daysRemaining} ${t("days_left")}`}
                  </span>
                  {isNearEnd && !isExpired && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      {t("expiring_soon")}
                    </span>
                  )}
                  {isExpired && (
                    <span className="flex items-center gap-1 text-[10px] text-destructive">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                      {t("action_needed")}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  onClick={() => { window.location.href = `mailto:${tenant.email}` }}
                  aria-label={t("email")}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  onClick={() => { window.location.href = `tel:${tenant.phone}` }}
                  aria-label={t("call")}
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Link href={`/landlord/tenants/${tenant.id}/profile`}>
                  <Button size="sm" className="h-8 gap-1 text-xs font-medium">
                    {t("view_profile")}
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Conditionally show Send Lease and Send Reminder */}
          <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-border/40">
            <div className="flex flex-wrap gap-2">
              {!tenant.isVerified && (
                <Button
                  size="sm"
                  className="text-xs h-7 bg-primary text-primary-foreground hover:bg-primary/90 gap-1"
                  onClick={async () => {
                    // Render PreviewCard to HTML and send to tenant
                    const container = document.createElement('div');
                    document.body.appendChild(container);
                    // Dynamically import ReactDOM for client-side rendering
                    const { createRoot } = await import('react-dom/client');
                    const root = createRoot(container);
                    root.render(React.createElement(PreviewCard));
                    setTimeout(async () => {
                      const html = container.innerHTML;
                      document.body.removeChild(container);
                      let realLandlordId = user?.userId || user?.id || user?.user?.id || user?.user?.userId;
                      if (!realLandlordId) {
                        toast({ title: t("error"), description: "Could not determine landlord_id from session. Please re-login." });
                        return;
                      }
                      // Robust property matching
                      let property_id = properties.find(p => p.title === tenant.property)?.id;
                      if (!property_id) {
                        // Try matching by address
                        property_id = properties.find(p => p.address === tenant.propertyAddress)?.id;
                      }
                      if (!property_id) {
                        // Try matching by partial title
                        property_id = properties.find(p => tenant.property && p.title && p.title.toLowerCase().includes(tenant.property.toLowerCase()))?.id;
                      }
                      if (!property_id) {
                        console.error("No property_id match for tenant:", tenant, properties);
                        toast({ title: t("error"), description: `Property ID not found for this tenant (${tenant.property}). Please check property assignments.` });
                        return;
                      }
                      // Always use real landlord_id from /api/auth/me
                      console.log('[Send Lease] user object:', user);
                      const payload = {
                        property_id,
                        landlord_id: realLandlordId,
                        tenant_id: tenant.id,
                        start_date: tenant.leaseStart,
                        end_date: tenant.leaseEnd,
                        monthly_rent: tenant.rent,
                        template: html
                      };
                      // Check for missing fields
                      const missingFields = [];
                      if (!payload.property_id) missingFields.push('property_id');
                      if (!payload.landlord_id) missingFields.push('landlord_id');
                      if (!payload.tenant_id) missingFields.push('tenant_id');
                      if (!payload.start_date) missingFields.push('start_date');
                      if (!payload.end_date) missingFields.push('end_date');
                      if (!payload.monthly_rent) missingFields.push('monthly_rent');
                      if (!payload.template) missingFields.push('template');
                      if (missingFields.length > 0) {
                        console.error("[Send Lease] Missing required fields:", missingFields, payload);
                        toast({
                          title: t("error"),
                          description: `Missing required fields: ${missingFields.join(", ")}`,
                          variant: "destructive"
                        });
                        return;
                      }
                      console.log("Sending lease payload:", payload);
                      const res = await fetch('/api/leases', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      if (!res.ok) {
                        let msg = t("api_error");
                        try {
                          const data = await res.json();
                          msg = data.message || msg;
                        } catch {}
                        toast({ title: t("error"), description: msg });
                        return;
                      }
                      toast({
                        title: t("lease_sent"),
                        description: t("lease_sent_desc")
                      });
                    }, 100);
                  }}
                >
                  <ArrowRight className="h-3 w-3" />
                  {t("send_lease")}
                </Button>
              )}
              {isNearEnd && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 border-amber-500/40 text-amber-600 hover:bg-amber-50 hover:text-amber-700 gap-1"
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/tenants/send-reminder`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tenantId: tenant.id })
                      });
                      if (res.ok) {
                        toast({
                          title: t("reminder_sent"),
                          description: t("reminder_sent_desc"),
                        });
                      } else {
                        toast({
                          title: t("error"),
                          description: t("failed_send_reminder"),
                          variant: "destructive"
                        });
                      }
                    } catch {
                      toast({
                        title: t("error"),
                        description: t("failed_send_reminder"),
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  {t("send_reminder")}
                </Button>
              )}
            </div>
            <span className="text-xs font-semibold text-primary">
              {t("total")}: Tsh {totalRent.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ onAdd, t }: { onAdd: () => void; t: (key: string) => string }) {
  return (
    <Card className="border-dashed border-2 border-border/60">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-5">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg text-foreground mb-2">{t("no_tenants_yet")}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
          {t("empty_state_description")}
        </p>
        <Button onClick={onAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("add_tenant")}
        </Button>
      </CardContent>
    </Card>
  )
}

// =========================
// MAIN PAGE COMPONENT
// =========================
export default function TenantsPage() {
  const [language, setLanguage] = useState<Language>("en")
  const { t } = useLanguage(language)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addingTenant, setAddingTenant] = useState(false)
  const [otpGenerated, setOtpGenerated] = useState(false)
  const [calculatedEndDate, setCalculatedEndDate] = useState("")
  const [showOccupiedDialog, setShowOccupiedDialog] = useState(false)
  const { toast } = useToast()
  // Always fetch real user from /api/auth/me for correct landlord_id
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data && (data.user || data));
        }
      } catch {}
    }
    fetchUser();
  }, [])

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nida_number: "",
    property_id: "",
    lease_start: "",
    lease_period: "12",
    otp: ""
  })

  const selectedProperty = properties.find(p => p.id === formData.property_id)
  const monthlyRent = selectedProperty?.rent_amount || 0

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("app-language") as Language | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "sw")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("app-language", newLanguage)
  }

  useEffect(() => {
    fetchTenants()
    fetchProperties()
    checkLeaseReminders()
  }, [])

  const fetchTenants = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/tenants")
      const contentType = res.headers.get("content-type") || ""
      if (!res.ok || !contentType.includes("application/json")) {
        const mockTenants: Tenant[] = [
          { id: "1", name: "John Doe", email: "john@example.com", phone: "+255 123 456 789", property: "Sunrise Apartment", rent: 350000, leaseStart: "2024-01-01", leaseEnd: "2024-12-31", leasePeriod: 12, status: "Active", paymentStatus: "Paid", isVerified: true },
          { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+255 987 654 321", property: "Luxury Villa", rent: 850000, leaseStart: "2024-03-15", leaseEnd: "2025-03-14", leasePeriod: 12, status: "Active", paymentStatus: "Pending", isVerified: false },
          { id: "3", name: "Robert Johnson", email: "robert@example.com", phone: "+255 456 789 123", property: "City Center Studio", rent: 250000, leaseStart: "2024-02-01", leaseEnd: "2024-08-01", leasePeriod: 6, status: "Active", paymentStatus: "Overdue", isVerified: true }
        ]
        setTenants(mockTenants)
        return
      }
      const data = await res.json()
      if (data.success) { setTenants(data.tenants || []) }
      else {
        const mockTenants: Tenant[] = [{ id: "1", name: "Demo Tenant", email: "demo@example.com", phone: "+255 000 000 000", property: "Demo Property", rent: 500000, leaseStart: "2024-01-01", leaseEnd: "2024-12-31", leasePeriod: 12, status: "Active", paymentStatus: "Paid", isVerified: true }]
        setTenants(mockTenants)
      }
    } catch (error: any) {
      console.error("Error fetching tenants:", error)
      const mockTenants: Tenant[] = [{ id: "1", name: "Error Fallback Tenant", email: "fallback@example.com", phone: "+255 111 222 333", property: "Fallback Property", rent: 300000, leaseStart: "2024-01-01", leaseEnd: "2024-12-31", leasePeriod: 12, status: "Active", paymentStatus: "Paid", isVerified: true }]
      setTenants(mockTenants)
    } finally { setLoading(false) }
  }

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties")
      const contentType = res.headers.get("content-type") || ""
      if (!contentType.includes("application/json")) {
        const mockProperties: Property[] = [
          { id: "1", title: "Sunrise Apartment", address: "123 Main St, Dar es Salaam", rent_amount: 350000, status: "Occupied" },
          { id: "2", title: "Luxury Villa", address: "456 Beach Road, Zanzibar", rent_amount: 850000, status: "Occupied" },
          { id: "3", title: "City Center Studio", address: "789 CBD, Dar es Salaam", rent_amount: 250000, status: "Vacant" }
        ]
        setProperties(mockProperties)
        return
      }
      if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`) }
      const data = await res.json()
      if (data.success) { setProperties(data.properties || []) }
      else {
        const mockProperties: Property[] = [{ id: "1", title: "Demo Property", address: "Demo Address, City", rent_amount: 500000, status: "Vacant" }]
        setProperties(mockProperties)
      }
    } catch (error: any) {
      console.error("Error fetching properties:", error)
      const mockProperties: Property[] = [{ id: "1", title: "Error Fallback Property", address: "Fallback Address", rent_amount: 400000, status: "Vacant" }]
      setProperties(mockProperties)
    }
  }

  const checkLeaseReminders = async () => {
    try {
      const res = await fetch("/api/tenants/check-reminders", { method: "POST", headers: { "Content-Type": "application/json" } })
      const contentType = res.headers.get("content-type") || ""
      if (!contentType.includes("application/json")) { console.log("Reminders API not available"); return }
      const data = await res.json()
      if (data.success && data.remindersSent > 0) { console.log(`Sent ${data.remindersSent} lease reminders`) }
    } catch (error) { console.error("Error checking reminders:", error) }
  }

  useEffect(() => {
    if (formData.lease_start && formData.lease_period) {
      const startDate = new Date(formData.lease_start)
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + parseInt(formData.lease_period))
      setCalculatedEndDate(endDate.toISOString().split('T')[0])
    } else { setCalculatedEndDate("") }
  }, [formData.lease_start, formData.lease_period])

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingTenant(true)
    try {
      const tenantData = { ...formData, lease_end: calculatedEndDate, lease_period: parseInt(formData.lease_period), rent_amount: monthlyRent }
      const res = await fetch("/api/tenants", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tenantData) })
      const contentType = res.headers.get("content-type") || ""
      if (!contentType.includes("application/json")) { throw new Error("Server returned non-JSON response") }
      const data = await res.json()

      if (res.status === 409 && (data.message || "").toLowerCase().includes("occupied")) { setShowOccupiedDialog(true); setAddingTenant(false); return }
      if (res.status === 409) { toast({ title: t("duplicate_tenant"), description: data.message || t("tenant_exists"), variant: "destructive" }); setAddingTenant(false); return }

      if (res.ok && data.success) {
        try { await fetch("/api/tenants/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.email, otp: formData.otp, tenantName: `${formData.first_name} ${formData.last_name}`, propertyTitle: properties.find(p => p.id === formData.property_id)?.title || "Property", leaseStart: formData.lease_start, leaseEnd: calculatedEndDate, leasePeriod: formData.lease_period }) }) } catch {}
        try { await fetch("/api/email/send-lease-welcome", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: formData.email, tenantName: `${formData.first_name} ${formData.last_name}`, property: properties.find(p => p.id === formData.property_id)?.title || "Property", propertyAddress: properties.find(p => p.id === formData.property_id)?.address || "", leaseStart: formData.lease_start, leaseEnd: calculatedEndDate, leasePeriod: `${formData.lease_period} months`, monthlyRent }) }) } catch {}

        const newTenant: Tenant = { id: Date.now().toString(), name: `${formData.first_name} ${formData.last_name}`, email: formData.email, phone: formData.phone, property: selectedProperty?.title || "Unknown Property", rent: monthlyRent, leaseStart: formData.lease_start, leaseEnd: calculatedEndDate, leasePeriod: parseInt(formData.lease_period), status: "Active", paymentStatus: "Pending", isVerified: false }
        setTenants(prev => [newTenant, ...prev])
        toast({ title: t("success"), description: t("tenant_added") })
        setDialogOpen(false)
        setFormData({ first_name: "", last_name: "", email: "", phone: "", nida_number: "", property_id: "", lease_start: "", lease_period: "12", otp: "" })
        setCalculatedEndDate(""); setOtpGenerated(false)
        fetchTenants()
        if (window.parent) { window.parent.postMessage({ type: "REFRESH_DASHBOARD_STATS" }, "*") }
      } else {
        toast({ title: t("error"), description: data.message || t("failed_add_tenant"), variant: "destructive" })
      }
    } catch (error: any) {
      console.error("Error adding tenant:", error)
      const newTenant: Tenant = { id: Date.now().toString(), name: `${formData.first_name} ${formData.last_name}`, email: formData.email, phone: formData.phone, property: selectedProperty?.title || "Demo Property", rent: monthlyRent, leaseStart: formData.lease_start, leaseEnd: calculatedEndDate, leasePeriod: parseInt(formData.lease_period), status: "Active", paymentStatus: "Pending", isVerified: false }
      setTenants(prev => [newTenant, ...prev])
      toast({ title: t("tenant_added_demo"), description: t("added_locally"), variant: "default" })
      setDialogOpen(false)
      setFormData({ first_name: "", last_name: "", email: "", phone: "", nida_number: "", property_id: "", lease_start: "", lease_period: "12", otp: "" })
      setCalculatedEndDate(""); setOtpGenerated(false)
    } finally { setAddingTenant(false) }
  }

  const calculateDaysRemaining = (leaseEnd: string) => {
    try { const endDate = new Date(leaseEnd); const now = new Date(); return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) } catch { return 0 }
  }

  const getLeaseTimePercentage = (tenant: Tenant) => {
    try {
      const leaseStart = new Date(tenant.leaseStart); const endDate = new Date(tenant.leaseEnd); const now = new Date()
      const totalLeaseTime = endDate.getTime() - leaseStart.getTime(); const timePassed = now.getTime() - leaseStart.getTime()
      if (timePassed <= 0) return 0; if (timePassed >= totalLeaseTime) return 100
      return Math.min(100, Math.max(0, (timePassed / totalLeaseTime) * 100))
    } catch { return 0 }
  }

  const filteredTenants = tenants.filter((tenant) => {
    const query = searchQuery.toLowerCase()
    return tenant.name.toLowerCase().includes(query) || tenant.email.toLowerCase().includes(query) || tenant.property.toLowerCase().includes(query) || tenant.phone.includes(query)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-muted" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">{t("loading_tenants")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Property Occupied Dialog */}
      <Dialog open={showOccupiedDialog} onOpenChange={setShowOccupiedDialog}>
        <DialogContent className="max-w-sm border-amber-500/30 bg-card">
          <DialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 mb-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <DialogTitle className="text-foreground">{t("property_occupied")}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t("property_occupied_desc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="w-full">{t("close")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Page header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{t("tenants")}</h1>
              </div>
              <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">{t("manage_tenants")}</p>
            </div>


            <div className="flex items-center gap-3">
              {/* Language Switcher (icon-only, dropdown) */}
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

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-sm">
                    <UserPlus className="h-4 w-4" />
                    {t("add_tenant")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto border-border/60">
                  <DialogHeader className="pb-4 border-b border-border/40">
                    <DialogTitle className="text-lg">{t("add_new_tenant")}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddTenant} className="space-y-5 pt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="first_name" className="text-xs font-medium">{t("first_name")} *</Label>
                        <Input id="first_name" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required className="h-9" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name" className="text-xs font-medium">{t("last_name")} *</Label>
                        <Input id="last_name" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required className="h-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-medium">{t("email")} *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-medium">{t("phone")}</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={t("phone_placeholder")} className="h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nida_number" className="text-xs font-medium">{t("nida_number")}</Label>
                      <Input id="nida_number" value={formData.nida_number} onChange={(e) => setFormData({ ...formData, nida_number: e.target.value })} placeholder={t("enter_nida_number")} className="h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="property" className="text-xs font-medium">{t("assign_to_property")} *</Label>
                      <Select value={formData.property_id} onValueChange={(value) => setFormData({ ...formData, property_id: value })}>
                        <SelectTrigger className="h-9"><SelectValue placeholder={t("select_property")} /></SelectTrigger>
                        <SelectContent>
                          {properties.length === 0 ? (
                            <SelectItem value="none" disabled>{t("no_available_properties")}</SelectItem>
                          ) : (
                            properties.map((prop) => (
                              <SelectItem key={prop.id} value={prop.id}>{prop.title} - Tsh {prop.rent_amount?.toLocaleString()}/mo</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {properties.length === 0 && <p className="text-xs text-destructive">{t("no_properties_message")}</p>}
                    </div>

                    {formData.property_id && monthlyRent > 0 && (
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/15">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                              <DollarSign className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{t("monthly_rent")}</span>
                          </div>
                          <span className="text-xl font-bold text-primary">Tsh {monthlyRent.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{t("monthly_payment_info")}</p>
                      </div>
                    )}

                    {formData.property_id && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="lease_start" className="text-xs font-medium">{t("lease_start")}</Label>
                            <Input id="lease_start" type="date" value={formData.lease_start} onChange={(e) => setFormData({ ...formData, lease_start: e.target.value })} required min={new Date().toISOString().split('T')[0]} className="h-9" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lease_period" className="text-xs font-medium">{t("lease_period")}</Label>
                            <Select value={formData.lease_period} onValueChange={(value) => setFormData({ ...formData, lease_period: value })}>
                              <SelectTrigger className="h-9"><SelectValue placeholder={t("select_period")} /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="6">6 {t("months")}</SelectItem>
                                <SelectItem value="12">12 {t("months")}</SelectItem>
                                <SelectItem value="18">18 {t("months")}</SelectItem>
                                <SelectItem value="24">24 {t("months")}</SelectItem>
                                <SelectItem value="36">36 {t("months")}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {calculatedEndDate && (
                          <div className="p-3 bg-muted/50 rounded-xl border border-border/40">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">{t("lease_end_date")}</span>
                              <span className="text-sm font-bold text-foreground">{calculatedEndDate}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">{t("lease_end_auto_calc")}</p>
                          </div>
                        )}
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-xs font-medium">{t("otp_label")} *</Label>
                      <div className="flex gap-2">
                        <Input id="otp" type="text" value={formData.otp} readOnly placeholder={t("generate_otp_for_tenant")} className="font-mono h-9" />
                        <Button type="button" variant="secondary" size="sm" className="h-9 px-4" onClick={() => {
                          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
                          let otp = ''
                          for (let i = 0; i < 10; i++) { otp += chars.charAt(Math.floor(Math.random() * chars.length)) }
                          setFormData({ ...formData, otp })
                          setOtpGenerated(true)
                        }} disabled={otpGenerated}>
                          {otpGenerated ? t("generated") : t("generate")}
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{t("otp_sent_info")}</p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/40">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t("cancel")}</Button>
                      <Button type="submit" disabled={addingTenant || !formData.otp || !formData.property_id}>
                        {addingTenant ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("adding")}</>) : t("add_tenant")}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Stats cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            icon={<Users className="h-5 w-5" />}
            value={tenants.length}
            label={t("total_tenants")}
            trend={`+2 ${t("this_month")}`}
            trendUp
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            value={tenants.filter((tenant) => tenant.status === "Active").length}
            label={t("active_leases")}
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            value={tenants.filter((tenant) => tenant.paymentStatus === "Paid").length}
            label={t("paid_this_month")}
            trend={t("on_track")}
            trendUp
          />
          <StatCard
            icon={<AlertCircle className="h-5 w-5" />}
            value={tenants.filter((tenant) => tenant.paymentStatus === "Overdue").length}
            label={t("overdue")}
            trend={tenants.filter(tenant => tenant.paymentStatus === "Overdue").length > 0 ? t("needs_attention") : undefined}
            trendUp={false}
          />
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search_placeholder")}
              className="pl-10 h-10 bg-card border-border/60 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tenant list */}
        <div className="space-y-4">
          {filteredTenants.length === 0 && !loading && (
            <EmptyState onAdd={() => setDialogOpen(true)} t={t} />
          )}

          {filteredTenants.map((tenant, idx) => {
            const uniqueKey = `${tenant.id}-${tenant.email}-${tenant.leaseStart}-${idx}`;
            return (
              <TenantCard
                key={uniqueKey}
                tenant={tenant}
                properties={properties}
                user={user}
                toast={toast}
                t={t}
                calculateDaysRemaining={calculateDaysRemaining}
                getLeaseTimePercentage={getLeaseTimePercentage}
                idx={idx}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
