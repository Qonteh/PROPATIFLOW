"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Bell,
  Building2,
  Calendar,
  CreditCard,
  ChevronRight,
  FileText,
  Wallet,
  Banknote,
  CheckCircle2,
  Globe,
} from "lucide-react"

/* ========================================== */
/* ─── Stub hooks (same pattern as all pages) */
/* ========================================== */
const useToast = () => ({
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`[Toast] ${title}: ${description}`)
  },
})
const useAuth = () => ({ user: { id: "demo-user-1" } })

/* ========================================== */
/* ─── Types                                  */
/* ========================================== */
interface Payment {
  id: string
  tenant_name: string
  property_title: string
  property_address: string
  amount: number
  currency: string
  due_date: string | null
  paid_date: string | null
  status: string
  payment_method: string
  payment_type: string
  created_at: string
} // <-- This closing brace was missing!

interface PaymentSummary {
  total_received: number
  total_pending: number
  total_transactions: number
}

/* ========================================== */
/* ─── Sub-components (matching design lang)  */
/* ========================================== */

function StatCard({
  icon,
  value,
  label,
  subtitle,
  accentColor,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  subtitle?: string
  accentColor?: string
}) {
  return (
    <Card className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
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

/* ─── Status Badge ─── */
function PaymentStatusBadge({ status, dueDate, t }: { status: string; dueDate: string | null; t: (key: string) => string }) {
  const isOverdue = status === "pending" && dueDate && new Date(dueDate) < new Date()

  if (isOverdue) {
    return (
      <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15 gap-1 text-[10px] uppercase tracking-wider font-medium">
        <AlertCircle className="h-3 w-3" />
        {t("overdue_status")}
      </Badge>
    )
  }

  const config: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    completed: {
      label: t("completed"),
      icon: <CheckCircle className="h-3 w-3" />,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15",
    },
    pending: {
      label: t("pending_status"),
      icon: <Clock className="h-3 w-3" />,
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15",
    },
  }

  const c = config[status] || config.pending

  return (
    <Badge className={`${c.className} gap-1 text-[10px] uppercase tracking-wider font-medium`}>
      {c.icon}
      {c.label}
    </Badge>
  )
}

/* ─── Payment Method Badge ─── */
function MethodBadge({ method }: { method: string }) {
  const label = method || "Unknown"
  const icon = method?.toLowerCase().includes("bank")
    ? <Building2 className="h-3 w-3" />
    : method?.toLowerCase().includes("mobile")
      ? <CreditCard className="h-3 w-3" />
      : method?.toLowerCase().includes("cash")
        ? <Banknote className="h-3 w-3" />
        : <Wallet className="h-3 w-3" />

  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/50 rounded-md px-2 py-0.5">
      {icon}
      {label}
    </span>
  )
}

/* ─── Payment Card ─── */
function PaymentCard({
  payment,
  formatCurrency,
  formatDate,
  t,
}: {
  payment: Payment
  formatCurrency: (amount: number, currency?: string) => string
  formatDate: (dateStr: string | null) => string
  t: (key: string) => string
}) {
  const isOverdue = payment.status === "pending" && payment.due_date && new Date(payment.due_date) < new Date()
  const isCompleted = payment.status === "completed"

  const accentColor = isCompleted
    ? "bg-emerald-500"
    : isOverdue
      ? "bg-destructive"
      : "bg-amber-500"

  const initials = payment.tenant_name
    ? payment.tenant_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  return (
    <Card className="group relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentColor}`} />

      <CardContent className="p-0">
        <div className="p-5 pt-4">
          {/* Top row: tenant + amount */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-card ring-border/40">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isCompleted && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center ring-2 ring-card">
                    <CheckCircle className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {payment.tenant_name || "Unknown Tenant"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {payment.property_title || "No property"}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-lg font-bold tracking-tight ${isCompleted ? "text-emerald-600" : isOverdue ? "text-destructive" : "text-foreground"}`}>
                {formatCurrency(payment.amount, payment.currency)}
              </p>
              <PaymentStatusBadge status={payment.status} dueDate={payment.due_date} t={t} />
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 px-2 py-2.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Due</span>
              <span className="text-xs font-semibold text-foreground">{formatDate(payment.due_date)}</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 px-2 py-2.5">
              <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Paid</span>
              <span className="text-xs font-semibold text-foreground">{formatDate(payment.paid_date)}</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 px-2 py-2.5">
              <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Method</span>
              <span className="text-xs font-semibold text-foreground truncate">{payment.payment_method || "N/A"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs bg-transparent border-border/60 hover:bg-muted/50"
              >
                <Receipt className="h-3.5 w-3.5" />
                {t("view_receipt")}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 text-xs bg-transparent border-border/60 hover:bg-muted/50"
              >
                <Bell className="h-3.5 w-3.5" />
                {t("send_reminder")}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Mini Row Card (for tab sub-lists) ─── */
function MiniPaymentRow({
  payment,
  formatCurrency,
  formatDate,
  variant,
  t,
}: {
  payment: Payment
  formatCurrency: (amount: number, currency?: string) => string
  formatDate: (dateStr: string | null) => string
  variant: "pending" | "completed" | "overdue"
  t: (key: string) => string
}) {
  const initials = payment.tenant_name
    ? payment.tenant_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  const accentBar =
    variant === "completed"
      ? "bg-emerald-500"
      : variant === "overdue"
        ? "bg-destructive"
        : "bg-amber-500"

  const amountColor =
    variant === "completed"
      ? "text-emerald-600"
      : variant === "overdue"
        ? "text-destructive"
        : "text-foreground"

  return (
    <div className="group relative flex items-center gap-4 p-4 rounded-xl border border-border/60 hover:shadow-sm transition-all duration-200 overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBar}`} />
      <Avatar className="h-9 w-9 ring-2 ring-offset-1 ring-offset-card ring-border/30 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground truncate">{payment.tenant_name}</p>
        <p className="text-xs text-muted-foreground truncate">{payment.property_title}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-bold ${amountColor}`}>
          {formatCurrency(payment.amount, payment.currency)}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {variant === "completed"
            ? `Paid ${formatDate(payment.paid_date)}`
            : variant === "overdue"
              ? `Due ${formatDate(payment.due_date)}`
              : `Due ${formatDate(payment.due_date)}`}
        </p>
      </div>
      {variant === "overdue" && (
        <Button size="sm" variant="destructive" className="shrink-0 gap-1 text-xs h-7 px-2.5">
          <Bell className="h-3 w-3" />
          {t("notice")}
        </Button>
      )}
    </div>
  )
}

/* ─── Empty State ─── */
function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 mb-4">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground text-center max-w-xs">{subtitle}</p>
    </div>
  )
}

/* ========================================== */
/* ─── Main Page                              */
/* ========================================== */

export default function LandlordPaymentsPage() {
  const [language, setLanguage] = useState<Language>("en")
  const [payments, setPayments] = useState<Payment[]>([])
  const [summary, setSummary] = useState<PaymentSummary>({ total_received: 0, total_pending: 0, total_transactions: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Utility: Format currency
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat(language === "sw" ? "sw-KE" : "en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Utility: Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return t("n_a")
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === "sw" ? "sw-KE" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Filtering logic
  const filteredPayments = payments.filter(
    (payment: Payment) =>
      payment.tenant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.property_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.payment_method?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingPayments = filteredPayments.filter((p: Payment) => p.status === "pending")
  const completedPayments = filteredPayments.filter((p: Payment) => p.status === "completed")
  const overduePayments = filteredPayments.filter(
    (p: Payment) => p.status === "pending" && p.due_date && new Date(p.due_date) < new Date()
  )

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

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/payments")
      const data = await res.json()
      if (data.success) {
        setPayments(data.payments || [])
        setSummary(data.summary || { total_received: 0, total_pending: 0, total_transactions: 0 })
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Loading payments...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center gap-1.5 py-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
                {t("payments_title")}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {t("payments_desc")}
            </p>
            {/* Language Switcher (icon-only, dropdown) */}
            <div className="flex items-center gap-2 mt-2">
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
          <div className="flex gap-3 pb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search_placeholder")}
                className="pl-10 h-10 bg-card border-border/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 bg-card border-border/60 h-10" size="sm">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t("filters")}</span>
            </Button>
            <Button variant="outline" className="gap-2 bg-card border-border/60 h-10" size="sm">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{t("export")}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* ─── Stats ─── */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            icon={<CheckCircle className="h-5 w-5" />}
            value={formatCurrency(summary.total_received)}
            label={t("total_received")}
            subtitle={t("this_month")}
            accentColor="bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/15"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            value={formatCurrency(summary.total_pending)}
            label={t("pending")}
            subtitle={t("awaiting_payment")}
            accentColor="bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/15"
          />
          <StatCard
            icon={<AlertCircle className="h-5 w-5" />}
            value={overduePayments.length}
            label={t("overdue")}
            subtitle={t("requires_attention")}
            accentColor="bg-destructive/10 text-destructive group-hover:bg-destructive/15"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            value={summary.total_transactions}
            label={t("transactions")}
            subtitle={t("total_records")}
            accentColor="bg-primary/10 text-primary group-hover:bg-primary/15"
          />
        </div>

        {/* ─── Tabs ─── */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-card border border-border/60 p-1 h-auto">
            <TabsTrigger value="all" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t("all")}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4 min-w-[20px] justify-center">
                {filteredPayments.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t("pending")}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4 min-w-[20px] justify-center">
                {pendingPayments.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t("completed")}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4 min-w-[20px] justify-center">
                {completedPayments.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {t("overdue")}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0 h-4 min-w-[20px] justify-center">
                {overduePayments.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* All Tab */}
          <TabsContent value="all" className="mt-0">
            {filteredPayments.length === 0 ? (
              <Card className="border-border/60">
                <CardContent className="p-0">
                  <EmptyState
                    icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
                    title={t("no_payments_found")}
                    subtitle={t("payments_empty_desc")}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment as Payment}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    t={t}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="mt-0">
            {pendingPayments.length === 0 ? (
              <Card className="border-border/60">
                <CardContent className="p-0">
                  <EmptyState
                    icon={<Clock className="h-8 w-8 text-muted-foreground" />}
                    title={t("no_pending_payments")}
                    subtitle={t("pending_payments_desc")}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/60 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                <div className="p-5 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-semibold text-foreground">{t("pending_payments_title")}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("pending_payments_subdesc")}</p>
                </div>
                <CardContent className="p-4 space-y-3">
                  {pendingPayments.map((payment) => (
                    <MiniPaymentRow
                      key={payment.id}
                      payment={payment as Payment}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      variant="pending"
                      t={t}
                    />
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="mt-0">
            {completedPayments.length === 0 ? (
              <Card className="border-border/60">
                <CardContent className="p-0">
                  <EmptyState
                    icon={<CheckCircle className="h-8 w-8 text-muted-foreground" />}
                    title={t("no_completed_payments")}
                    subtitle={t("completed_payments_desc")}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/60 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                <div className="p-5 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-sm font-semibold text-foreground">{t("completed_payments_title")}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("completed_payments_subdesc")}</p>
                </div>
                <CardContent className="p-4 space-y-3">
                  {completedPayments.map((payment) => (
                    <MiniPaymentRow
                      key={payment.id}
                      payment={payment as Payment}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      variant="completed"
                      t={t}
                    />
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Overdue Tab */}
          <TabsContent value="overdue" className="mt-0">
            {overduePayments.length === 0 ? (
              <Card className="border-border/60">
                <CardContent className="p-0">
                  <EmptyState
                    icon={<AlertCircle className="h-8 w-8 text-muted-foreground" />}
                    title={t("no_overdue_payments")}
                    subtitle={t("overdue_payments_desc")}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/60 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
                <div className="p-5 pb-3 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <h3 className="text-sm font-semibold text-foreground">{t("overdue_payments_title")}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("overdue_payments_subdesc")}</p>
                </div>
                <CardContent className="p-4 space-y-3">
                  {overduePayments.map((payment) => (
                    <MiniPaymentRow
                      key={payment.id}
                      payment={payment as Payment}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      variant="overdue"
                      t={t}
                    />
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ─── Translations ───
type Language = "en" | "sw"
const translations: Record<Language, Record<string, string>> = {
  en: {
    payments_title: "Payments",
    payments_desc: "Track and manage all rental payment transactions for your properties.",
    search_placeholder: "Search by tenant, property, or method...",
    filters: "Filters",
    export: "Export",
    total_received: "Total Received",
    pending: "Pending",
    overdue: "Overdue",
    transactions: "Transactions",
    this_month: "This month",
    awaiting_payment: "Awaiting payment",
    requires_attention: "Requires attention",
    total_records: "Total records",
    all: "All",
    no_payments_found: "No Payments Found",
    payments_empty_desc: "Payments will appear here when tenants make them. Try adjusting your search filters.",
    no_pending_payments: "No Pending Payments",
    pending_payments_desc: "All payments are up to date. Great job!",
    pending_payments_title: "Pending Payments",
    pending_payments_subdesc: "Payments awaiting tenant action",
    no_completed_payments: "No Completed Payments",
    completed_payments_desc: "Completed payments will show here once received.",
    completed_payments_title: "Completed Payments",
    completed_payments_subdesc: "Successfully received payments",
    no_overdue_payments: "No Overdue Payments",
    overdue_payments_desc: "No payments are past their due date. Everything is on track!",
    overdue_payments_title: "Overdue Payments",
    overdue_payments_subdesc: "Payments past their due date requiring attention",
    due: "Due",
    paid: "Paid",
    method: "Method",
    view_receipt: "View Receipt",
    send_reminder: "Send Reminder",
    notice: "Notice",
    completed: "Completed",
    overdue_status: "Overdue",
    pending_status: "Pending",
    unknown_tenant: "Unknown Tenant",
    no_property: "No property",
    n_a: "N/A",
    loading_payments: "Loading payments...",
    english: "English",
    swahili: "Kiswahili",
  },
  sw: {
    payments_title: "Malipo",
    payments_desc: "Fuatilia na simamia miamala yote ya malipo ya kodi kwa mali zako.",
    search_placeholder: "Tafuta kwa mpangaji, mali, au njia...",
    filters: "Vichujio",
    export: "Hamisha",
    total_received: "Jumla Iliyopokelewa",
    pending: "Inasubiri",
    overdue: "Imechelewa",
    transactions: "Miamala",
    this_month: "Mwezi huu",
    awaiting_payment: "Inasubiri malipo",
    requires_attention: "Inahitaji uangalizi",
    total_records: "Jumla ya rekodi",
    all: "Zote",
    no_payments_found: "Hakuna Malipo",
    payments_empty_desc: "Malipo yataonekana hapa wapangaji watakapolipa. Jaribu kurekebisha vichujio vya utafutaji.",
    no_pending_payments: "Hakuna Malipo Yanayosubiri",
    pending_payments_desc: "Malipo yote yako sawa. Kazi nzuri!",
    pending_payments_title: "Malipo Yanayosubiri",
    pending_payments_subdesc: "Malipo yanayosubiri hatua ya mpangaji",
    no_completed_payments: "Hakuna Malipo Yaliyokamilika",
    completed_payments_desc: "Malipo yaliyokamilika yataonekana hapa baada ya kupokelewa.",
    completed_payments_title: "Malipo Yaliyokamilika",
    completed_payments_subdesc: "Malipo yaliyopokelewa kwa mafanikio",
    no_overdue_payments: "Hakuna Malipo Yaliyochelewa",
    overdue_payments_desc: "Hakuna malipo yaliyopitisha tarehe. Kila kitu kiko sawa!",
    overdue_payments_title: "Malipo Yaliyochelewa",
    overdue_payments_subdesc: "Malipo yaliyopitisha tarehe yanahitaji uangalizi",
    due: "Tarehe ya Malipo",
    paid: "Imelipwa",
    method: "Njia",
    view_receipt: "Angalia Risiti",
    send_reminder: "Tuma Kumbusho",
    notice: "Arifa",
    completed: "Imekamilika",
    overdue_status: "Imechelewa",
    pending_status: "Inasubiri",
    unknown_tenant: "Mpangaji Asiyejulikana",
    no_property: "Hakuna mali",
    n_a: "N/A",
    loading_payments: "Inapakia malipo...",
    english: "Kiingereza",
    swahili: "Kiswahili",
  }
}