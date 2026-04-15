"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Wallet,
  Plus,
  Search,
  TrendingUp,
  CalendarDays,
  Building2,
  ChevronDown,
  ArrowLeft,
  Lightbulb,
  FileText,
  DollarSign,
  BarChart3,
  Receipt,
  Layers,
  Filter,
  X,
  Globe,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// ─── Types ───────────────────────────────────────────────────────────
interface Expense {
  id: number;
  category: string;
  amount: number;
  created_at: string;
  notes?: string;
  property_id?: string;
  property_title?: string;
}

interface Payment {
  id: number;
  amount: number;
  created_at: string;
  property_id?: string;
  property_title?: string;
  status?: string;
}

type Language = "en" | "sw"

// ─── Translations ────────────────────────────────────────────────────
const translations = {
  en: {
    // Header
    backToDashboard: "Back to dashboard",
    expenseManagement: "Expense Management",
    expenseManagementDesc: "Track, analyze, and manage all property expenses",
    
    // Stat Cards
    allTimeTotalExpenses: "All-Time Total Expenses",
    recordsSinceInception: "records since inception",
    thisMonth: "This Month",
    filteredPeriodTotal: "Filtered Period Total",
    categories: "Categories",
    
    // Add Expense Form
    recordNewExpense: "Record New Expense",
    fillInDetails: "Fill in any details about the expense — all fields are free text",
    typeCategory: "Type / Category",
    selectCategory: "Select category",
    property: "Property",
    selectProperty: "Select property",
    amountTZS: "Amount (TZS)",
    amountPlaceholder: "e.g. 450000",
    date: "Date",
    description: "Description",
    descriptionPlaceholder: "Describe this expense...",
    saveExpense: "Save Expense",
    
    // Categories
    maintenance: "Maintenance",
    management: "Management",
    insurance: "Insurance",
    utilities: "Utilities",
    taxes: "Taxes",
    security: "Security",
    cleaning: "Cleaning",
    legal: "Legal",
    
    // Charts
    monthlyTrends: "Monthly Trends",
    other: "Other",
    noExpenseData: "No expense data",
    addExpensesToSeeTrends: "Add expenses to see category trends",
    
    // Table
    allExpenses: "All Expenses",
    clearFilters: "Clear Filters",
    searchExpenses: "Search expenses, properties, notes...",
    allCategories: "All Categories",
    allProperties: "All Properties",
    fromDate: "From Date",
    toDate: "To Date",
    showing: "Showing",
    of: "of",
    expenses: "expenses",
    filtered: "(filtered)",
    filteredTotal: "Filtered Total",
    totalExpenses: "Total Expenses",
    noExpensesFound: "No expenses found",
    tryAdjustingFilters: "Try adjusting your filters or search query",
    category: "Category",
    amount: "Amount",
    notes: "Notes",
    total: "Total",
    
    // Property Summary
    perPropertyExpenses: "Per-Property Expenses & All-Time NOI",
    perPropertyDesc: "Total expenses for each property since first recorded expense, with Net Operating Income",
    noPropertyExpenseData: "No property expense data",
    addExpensesWithProperty: "Add expenses with property info to see per-property totals",
    records: "Records",
    period: "Period",
    totalCollected: "Total Collected",
    allTimeNOI: "All-Time NOI",
    grandTotal: "Grand Total",
    properties: "properties",
    
    // Insights
    insightExpenses: "expenses",
    insightVsPrevMonth: "vs previous month",
    insightMaintenance: "Maintenance remains the largest cost driver at",
    insightIncreased: "increased",
    insightDecreased: "decreased",
    insightBy: "by",
    
    // NOI Insight
    noiInsight: "All-Time NOI is calculated as Total Collected (revenue) minus Total Expenses for each property, from the date the first record was posted. If no payment data is available yet, the NOI will reflect expenses only.",
    
    // Filter labels
    allTime: "All Time",
    from: "From",
    until: "Until",
  },
  sw: {
    // Header
    backToDashboard: "Rudi kwenye dashibodi",
    expenseManagement: "Usimamizi wa Gharama",
    expenseManagementDesc: "Fuatilia, changanua, na simamia gharama zote za mali",
    
    // Stat Cards
    allTimeTotalExpenses: "Jumla ya Gharama Zote",
    recordsSinceInception: "rekodi tangu kuanzishwa",
    thisMonth: "Mwezi Huu",
    filteredPeriodTotal: "Jumla ya Kipindi Kilichochujwa",
    categories: "Makundi",
    
    // Add Expense Form
    recordNewExpense: "Rekodi Gharama Mpya",
    fillInDetails: "Jaza maelezo yoyote kuhusu gharama — sehemu zote ni maandishi huru",
    typeCategory: "Aina / Kundi",
    selectCategory: "Chagua kundi",
    property: "Mali",
    selectProperty: "Chagua mali",
    amountTZS: "Kiasi (TZS)",
    amountPlaceholder: "mfano 450000",
    date: "Tarehe",
    description: "Maelezo",
    descriptionPlaceholder: "Eleza gharama hii...",
    saveExpense: "Hifadhi Gharama",
    
    // Categories
    maintenance: "Matengenezo",
    management: "Usimamizi",
    insurance: "Bima",
    utilities: "Huduma",
    taxes: "Kodi",
    security: "Ulinzi",
    cleaning: "Usafi",
    legal: "Kisheria",
    
    // Charts
    monthlyTrends: "Mwenendo wa Kila Mwezi",
    other: "Nyingine",
    noExpenseData: "Hakuna data ya gharama",
    addExpensesToSeeTrends: "Ongeza gharama kuona mwenendo wa makundi",
    
    // Table
    allExpenses: "Gharama Zote",
    clearFilters: "Futa Vichujio",
    searchExpenses: "Tafuta gharama, mali, maelezo...",
    allCategories: "Makundi Yote",
    allProperties: "Mali Zote",
    fromDate: "Kuanzia Tarehe",
    toDate: "Hadi Tarehe",
    showing: "Inaonyesha",
    of: "kati ya",
    expenses: "gharama",
    filtered: "(imechujwa)",
    filteredTotal: "Jumla Iliyochujwa",
    totalExpenses: "Jumla ya Gharama",
    noExpensesFound: "Hakuna gharama zilizopatikana",
    tryAdjustingFilters: "Jaribu kurekebisha vichujio vyako au swali la utafutaji",
    category: "Kundi",
    amount: "Kiasi",
    notes: "Maelezo",
    total: "Jumla",
    
    // Property Summary
    perPropertyExpenses: "Gharama za Kila Mali na NOI ya Wakati Wote",
    perPropertyDesc: "Jumla ya gharama kwa kila mali tangu gharama ya kwanza kurekodishwa, pamoja na Mapato Halisi ya Uendeshaji",
    noPropertyExpenseData: "Hakuna data ya gharama za mali",
    addExpensesWithProperty: "Ongeza gharama na taarifa za mali kuona jumla za kila mali",
    records: "Rekodi",
    period: "Kipindi",
    totalCollected: "Jumla Iliyokusanywa",
    allTimeNOI: "NOI ya Wakati Wote",
    grandTotal: "Jumla Kuu",
    properties: "mali",
    
    // Insights
    insightExpenses: "gharama",
    insightVsPrevMonth: "dhidi ya mwezi uliopita",
    insightMaintenance: "Matengenezo bado ni gharama kubwa zaidi kwa",
    insightIncreased: "imeongezeka",
    insightDecreased: "imepungua",
    insightBy: "kwa",
    
    // NOI Insight
    noiInsight: "NOI ya Wakati Wote inahesabiwa kama Jumla Iliyokusanywa (mapato) minus Jumla ya Gharama kwa kila mali, kutoka tarehe rekodi ya kwanza ilipoandikwa. Ikiwa hakuna data ya malipo bado, NOI itaonyesha gharama pekee.",
    
    // Filter labels
    allTime: "Wakati Wote",
    from: "Kuanzia",
    until: "Hadi",
  }
}

// Category translations map
const categoryTranslations = {
  en: {
    Maintenance: "Maintenance",
    Management: "Management",
    Insurance: "Insurance",
    Utilities: "Utilities",
    Taxes: "Taxes",
    Security: "Security",
    Cleaning: "Cleaning",
    Legal: "Legal",
  },
  sw: {
    Maintenance: "Matengenezo",
    Management: "Usimamizi",
    Insurance: "Bima",
    Utilities: "Huduma",
    Taxes: "Kodi",
    Security: "Ulinzi",
    Cleaning: "Usafi",
    Legal: "Kisheria",
  }
}

// ─── Constants ───────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Maintenance", color: "hsl(199, 89%, 38%)", icon: "wrench" },
  { name: "Management", color: "hsl(168, 71%, 39%)", icon: "users" },
  { name: "Insurance", color: "hsl(38, 92%, 50%)", icon: "shield" },
  { name: "Utilities", color: "hsl(25, 95%, 53%)", icon: "zap" },
  { name: "Taxes", color: "hsl(262, 52%, 47%)", icon: "file" },
  { name: "Security", color: "hsl(340, 65%, 47%)", icon: "lock" },
  { name: "Cleaning", color: "hsl(150, 60%, 40%)", icon: "sparkle" },
  { name: "Legal", color: "hsl(210, 60%, 45%)", icon: "scale" },
] as const

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_SW = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep", "Okt", "Nov", "Des"];

// ─── Helpers ─────────────────────────────────────────────────────────
function formatCurrency(value: number | string): string {
  const num = Number(value)
  if (isNaN(num)) return "0"
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toLocaleString()
}

function formatCurrencyFull(value: number | string): string {
  const num = Number(value)
  if (isNaN(num)) return "0"
  return num.toLocaleString("en-TZ", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function getCategoryColor(category: string): string {
  return CATEGORIES.find((c) => c.name === category)?.color ?? "hsl(0,0%,50%)"
}

function translateCategory(category: string, language: Language): string {
  return categoryTranslations[language][category as keyof typeof categoryTranslations.en] || category
}

// ─── Insight Box ─────────────────────────────────────────────────────
function InsightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200/60 px-4 py-3.5 text-sm leading-relaxed text-foreground/80">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100">
        <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
      </div>
      <span className="pt-0.5">{children}</span>
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  subValue?: string
  icon: React.ElementType
  accent: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
      <div className="absolute inset-0 opacity-[0.03]" style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground font-mono">{value}</p>
          {subValue && (
            <p className="text-[11px] font-medium text-muted-foreground">{subValue}</p>
          )}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════
export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [properties, setProperties] = useState<{ id: string, title: string }[]>([]);

  // ─── Language state ──────────────────────────────────────────────
  const [language, setLanguage] = useState<Language>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("app-language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "sw")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("app-language", newLanguage);
  };

  const t = translations[language];
  const monthNames = language === "sw" ? MONTHS_SW : MONTHS;

  // ─── Filter state ────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ─── Form state ──────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(true);
  const [formCategory, setFormCategory] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formPropertyId, setFormPropertyId] = useState("");

  // ─── Monthly trends ──────────────────────────────────────────────
  const MONTHLY_TRENDS = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth() + 1}`,
        label: monthNames[d.getMonth()],
        year: d.getFullYear(),
        month: d.getMonth() + 1,
      });
    }
    return months.map(({ label, year, month }) => {
      const monthExpenses = expenses.filter(e => {
        const d = new Date(e.created_at);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });
      let maintenance = 0, utilities = 0, other = 0;
      monthExpenses.forEach(e => {
        if (e.category === "Maintenance") maintenance += Number(e.amount);
        else if (e.category === "Utilities") utilities += Number(e.amount);
        else other += Number(e.amount);
      });
      return {
        month: label,
        total: maintenance + utilities + other,
        maintenance,
        utilities,
        other,
      };
    });
  }, [expenses, monthNames]);

  // Fetch properties, expenses & payments
  useEffect(() => {
    fetchProperties();
    fetchExpenses();
    fetchPayments();
  }, []);

  async function fetchProperties() {
    const res = await fetch("/api/properties");
    if (res.ok) {
      const data = await res.json();
      setProperties((data.properties || []).map((p: any) => ({ id: p.id, title: p.title })));
    }
  }

  async function fetchExpenses() {
    const res = await fetch("/api/finance/expenses");
    if (res.ok) {
      const data = await res.json();
      setExpenses(data.expenses);
    }
  }

  async function fetchPayments() {
    try {
      const res = await fetch("/api/finance/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch {
      // Payments API may not exist yet - that's OK
    }
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/finance/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: formCategory,
        amount: parseFloat(formAmount),
        created_at: formDate,
        notes: formNotes,
        property_id: formPropertyId,
      }),
    });
    if (res.ok) {
      setFormCategory("");
      setFormAmount("");
      setFormDate("");
      setFormNotes("");
      setFormPropertyId("");
      fetchExpenses();
    } else {
      alert(language === "sw" ? "Imeshindwa kuongeza gharama" : "Failed to add expense");
    }
  }

  // ─── Filtering (with date range) ────────────────────────────────
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.category.toLowerCase().includes(q) ||
          (e.notes?.toLowerCase().includes(q) ?? false) ||
          (e.property_title?.toLowerCase().includes(q) ?? false)
      );
    }
    // Category
    if (categoryFilter !== "all") {
      result = result.filter((e) => e.category === categoryFilter);
    }
    // Property
    if (propertyFilter !== "all") {
      result = result.filter((e) => (e.property_id || e.property_title || "") === propertyFilter);
    }
    // Date from
    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((e) => new Date(e.created_at) >= from);
    }
    // Date to
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((e) => new Date(e.created_at) <= to);
    }
    return result;
  }, [expenses, searchQuery, categoryFilter, propertyFilter, dateFrom, dateTo]);

  // ─── Computed stats ─────────────────────────────────────────
  // All-time total
  const totalExpensesAllTime = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount), 0), [expenses])

  // Filtered total (auto-calculated based on all active filters)
  const filteredTotal = useMemo(() => filteredExpenses.reduce((s, e) => s + Number(e.amount), 0), [filteredExpenses])

  // This month
  const thisMonthExpenses = useMemo(() => {
    const now = new Date()
    return expenses
      .filter((e) => {
        const d = new Date(e.created_at)
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      })
      .reduce((s, e) => s + Number(e.amount), 0)
  }, [expenses])

  const categoryCount = useMemo(() => new Set(expenses.map((e) => e.category)).size, [expenses])

  // Check if any filter is active
  const hasActiveFilters = searchQuery || categoryFilter !== "all" || propertyFilter !== "all" || dateFrom || dateTo;

  // Filtered period label
  const filteredPeriodLabel = useMemo(() => {
    const parts: string[] = [];
    if (dateFrom && dateTo) {
      parts.push(`${new Date(dateFrom).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} – ${new Date(dateTo).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`);
    } else if (dateFrom) {
      parts.push(`${t.from} ${new Date(dateFrom).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`);
    } else if (dateTo) {
      parts.push(`${t.until} ${new Date(dateTo).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`);
    }
    if (categoryFilter !== "all") parts.push(translateCategory(categoryFilter, language));
    if (propertyFilter !== "all") {
      const prop = properties.find(p => p.id === propertyFilter);
      if (prop) parts.push(prop.title);
    }
    if (searchQuery) parts.push(`"${searchQuery}"`);
    return parts.length > 0 ? parts.join(" | ") : t.allTime;
  }, [dateFrom, dateTo, categoryFilter, propertyFilter, searchQuery, properties, t, language]);

  // ─── Per-property all-time totals & NOI ───────────────────────
  const propertyExpenseTotals = useMemo(() => {
    const map: Record<string, { propertyId: string; propertyTitle: string; totalExpenses: number; totalCollected: number; firstDate: string; lastDate: string }> = {};
    // Aggregate expenses per property
    expenses.forEach((e) => {
      const key = e.property_id || e.property_title || "Unknown";
      if (!map[key]) {
        map[key] = {
          propertyId: e.property_id || "",
          propertyTitle: e.property_title || key,
          totalExpenses: 0,
          totalCollected: 0,
          firstDate: e.created_at,
          lastDate: e.created_at,
        };
      }
      map[key].totalExpenses += Number(e.amount);
      if (new Date(e.created_at) < new Date(map[key].firstDate)) map[key].firstDate = e.created_at;
      if (new Date(e.created_at) > new Date(map[key].lastDate)) map[key].lastDate = e.created_at;
    });
    // Aggregate payments (revenue) per property
    payments.forEach((p) => {
      const key = p.property_id || p.property_title || "Unknown";
      if (!map[key]) {
        map[key] = {
          propertyId: p.property_id || "",
          propertyTitle: p.property_title || key,
          totalExpenses: 0,
          totalCollected: 0,
          firstDate: p.created_at,
          lastDate: p.created_at,
        };
      }
      // Only count confirmed/paid payments as revenue
      if (!p.status || p.status === "paid" || p.status === "confirmed" || p.status === "completed") {
        map[key].totalCollected += Number(p.amount);
      }
      if (new Date(p.created_at) < new Date(map[key].firstDate)) map[key].firstDate = p.created_at;
      if (new Date(p.created_at) > new Date(map[key].lastDate)) map[key].lastDate = p.created_at;
    });
    return Object.values(map);
  }, [expenses, payments]);

  // Category spending by month for line chart
  const categoryMonthlyData = useMemo(() => {
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        label: monthNames[d.getMonth()],
        year: d.getFullYear(),
        month: d.getMonth() + 1,
      })
    }
    const cats = Array.from(new Set(expenses.map((e) => e.category)))
    return months.map(({ label, year, month }) => {
      const row: Record<string, string | number> = { month: label }
      cats.forEach((cat) => {
        row[cat] = expenses
          .filter((e) => {
            const d = new Date(e.created_at)
            return d.getFullYear() === year && d.getMonth() + 1 === month && e.category === cat
          })
          .reduce((sum, e) => sum + Number(e.amount), 0)
      })
      return row
    })
  }, [expenses, monthNames])

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(expenses.map((e) => e.category))).map((name) => ({
      name,
      color: getCategoryColor(name),
    }))
  }, [expenses])

  // Clear all filters
  function clearFilters() {
    setSearchQuery("");
    setCategoryFilter("all");
    setPropertyFilter("all");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-accent">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">{t.backToDashboard}</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-border/60" />
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">{t.expenseManagement}</h1>
              <p className="text-xs text-muted-foreground">{t.expenseManagementDesc}</p>
            </div>
          </div>
          
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
                English
                {language === "en" && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange("sw")}
                className="flex items-center justify-between"
              >
                Kiswahili
                {language === "sw" && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ─── Stat Cards Row ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label={t.allTimeTotalExpenses}
            value={`${formatCurrency(totalExpensesAllTime)} TZS`}
            subValue={`${expenses.length} ${t.recordsSinceInception}`}
            icon={DollarSign}
            accent="hsl(199, 89%, 38%)"
          />
          <StatCard
            label={t.thisMonth}
            value={`${formatCurrency(thisMonthExpenses)} TZS`}
            subValue={`${new Date().toLocaleDateString(language === "sw" ? "sw-TZ" : "en-GB", { month: "long", year: "numeric" })}`}
            icon={CalendarDays}
            accent="hsl(168, 71%, 39%)"
          />
          <StatCard
            label={t.filteredPeriodTotal}
            value={`${formatCurrency(filteredTotal)} TZS`}
            subValue={filteredPeriodLabel}
            icon={Filter}
            accent="hsl(38, 92%, 50%)"
          />
          <StatCard
            label={t.categories}
            value={String(categoryCount)}
            icon={Layers}
            accent="hsl(262, 52%, 47%)"
          />
        </div>

        {/* ─── Add Expense Form ───────────────────────────────────── */}
        <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm">
          <div
            className="cursor-pointer select-none"
            onClick={() => setFormOpen((o) => !o)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setFormOpen((o) => !o) }}
            role="button"
            tabIndex={0}
            aria-expanded={formOpen}
          >
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">{t.recordNewExpense}</CardTitle>
                    <CardDescription className="text-xs">{t.fillInDetails}</CardDescription>
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors">
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${formOpen ? "rotate-180" : ""}`} />
                </div>
              </div>
            </CardHeader>
          </div>
          <div
            className={`grid transition-all duration-300 ease-in-out ${formOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
          >
            <div className="overflow-hidden">
              <CardContent className="pt-6 pb-6">
                <form className="space-y-5" onSubmit={handleAddExpense}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exp-category" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.typeCategory}</Label>
                      <Select value={formCategory} onValueChange={setFormCategory} required>
                        <SelectTrigger id="exp-category" className="w-full h-11 rounded-xl">
                          <SelectValue placeholder={t.selectCategory} />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>
                              <span className="inline-flex items-center gap-2.5">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} /> {translateCategory(cat.name, language)}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exp-property" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.property}</Label>
                      <select
                        id="exp-property"
                        className="flex h-11 w-full items-center rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={formPropertyId}
                        onChange={e => setFormPropertyId(e.target.value)}
                        required
                      >
                        <option value="">{t.selectProperty}</option>
                        {properties.map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exp-amount" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.amountTZS}</Label>
                      <Input
                        id="exp-amount"
                        type="number"
                        placeholder={t.amountPlaceholder}
                        value={formAmount}
                        onChange={(e) => setFormAmount(e.target.value)}
                        className="h-11 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exp-date" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.date}</Label>
                      <Input
                        id="exp-date"
                        type="date"
                        placeholder="dd/mm/yyyy"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="h-11 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exp-notes" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.description}</Label>
                    <Textarea
                      id="exp-notes"
                      placeholder={t.descriptionPlaceholder}
                      rows={2}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="resize-none rounded-xl"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <Button type="submit" className="gap-2 px-6 h-11 rounded-xl font-medium shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 transition-all duration-300">
                      <Plus className="h-4 w-4" />
                      {t.saveExpense}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* ─── Charts Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Category Spending Line Chart */}
          <Card className="lg:col-span-2 rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <div>
                  {/* Removed By Category and Category spending over time chart for migration to finance page */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {uniqueCategories.length > 0 ? (
                <>
                  <div style={{ width: "100%", height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={categoryMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => formatCurrency(v)}
                          width={45}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [`${formatCurrencyFull(value)} TZS`, translateCategory(name, language)]}
                          contentStyle={{
                            backgroundColor: "var(--color-card, #fff)",
                            borderColor: "var(--color-border, #e5e7eb)",
                            borderRadius: "12px",
                            color: "var(--color-card-foreground, #111)",
                            fontSize: "12px",
                            padding: "10px 14px",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                          }}
                        />
                        {uniqueCategories.map((cat) => (
                          <Line
                            key={cat.name}
                            type="monotone"
                            dataKey={cat.name}
                            stroke={cat.color}
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: cat.color, strokeWidth: 0 }}
                            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-border/40">
                    {uniqueCategories.map((cat) => (
                      <div key={cat.name} className="flex items-center gap-2 text-xs">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-muted-foreground font-medium">{translateCategory(cat.name, language)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 mb-3">
                    <Wallet className="h-6 w-6 opacity-40" />
                  </div>
                  <p className="text-sm font-medium">{t.noExpenseData}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.addExpensesToSeeTrends}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="lg:col-span-3 rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{t.monthlyTrends}</CardTitle>
                  {/* Removed Expense trends over the last 6 months chart for migration to finance page */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_TRENDS} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => formatCurrency(v)}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        const translatedName = name === "maintenance" ? translateCategory("Maintenance", language) :
                          name === "utilities" ? translateCategory("Utilities", language) : t.other;
                        return [`${formatCurrencyFull(value)} TZS`, translatedName];
                      }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "12px",
                        color: "hsl(var(--card-foreground))",
                        fontSize: "12px",
                        padding: "10px 14px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="maintenance" stackId="a" fill="hsl(199, 89%, 38%)" radius={[0, 0, 0, 0]} name="maintenance" />
                    <Bar dataKey="utilities" stackId="a" fill="hsl(25, 95%, 53%)" radius={[0, 0, 0, 0]} name="utilities" />
                    <Bar dataKey="other" stackId="a" fill="hsl(262, 52%, 47%)" radius={[6, 6, 0, 0]} name="other" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-5 mt-4 pt-4 border-t border-border/40">
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "hsl(199, 89%, 38%)" }} />
                  <span className="text-muted-foreground font-medium">{translateCategory("Maintenance", language)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "hsl(25, 95%, 53%)" }} />
                  <span className="text-muted-foreground font-medium">{translateCategory("Utilities", language)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "hsl(262, 52%, 47%)" }} />
                  <span className="text-muted-foreground font-medium">{t.other}</span>
                </div>
              </div>
              <InsightBox>
                {(() => {
                  const last = MONTHLY_TRENDS[MONTHLY_TRENDS.length - 1]
                  const prev = MONTHLY_TRENDS[MONTHLY_TRENDS.length - 2]
                  const change = prev.total > 0 ? ((last.total - prev.total) / prev.total * 100).toFixed(1) : "0"
                  const direction = last.total >= prev.total ? t.insightIncreased : t.insightDecreased
                  return `${last.month} ${t.insightExpenses} ${direction} ${t.insightBy} ${Math.abs(Number(change))}% ${t.insightVsPrevMonth}. ${t.insightMaintenance} ${formatCurrency(last.maintenance)} TZS.`
                })()}
              </InsightBox>
            </CardContent>
          </Card>
        </div>

        {/* ─── All Expenses Table ─────────────────────────────────── */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
                  <FileText className="h-4 w-4 text-chart-3" />
                </div>
                <div className="flex items-center gap-2.5">
                  <CardTitle className="text-sm font-semibold">{t.allExpenses}</CardTitle>
                  <Badge variant="secondary" className="rounded-full text-[11px] font-mono px-2.5 py-0.5">{filteredExpenses.length}</Badge>
                </div>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-muted-foreground hover:text-foreground" onClick={clearFilters}>
                  <X className="h-3.5 w-3.5" />
                  {t.clearFilters}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    placeholder={t.searchExpenses}
                    className="pl-10 h-11 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px] h-11 text-xs rounded-xl">
                      <SelectValue placeholder={t.category} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allCategories}</SelectItem>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                            {translateCategory(c.name, language)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                    <SelectTrigger className="w-[180px] h-11 text-xs rounded-xl">
                      <SelectValue placeholder={t.property} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allProperties}</SelectItem>
                      {properties.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Date range filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex gap-3 flex-1">
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{t.fromDate}</Label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{t.toDate}</Label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>
                </div>
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
                    <Filter className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {filteredPeriodLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ─── Filtered Total Summary (auto-calculates) ─── */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">
                    {t.showing} <span className="font-semibold text-foreground">{filteredExpenses.length}</span> {t.of} {expenses.length} {t.expenses}
                    {hasActiveFilters && (
                      <span className="text-primary font-medium"> {t.filtered}</span>
                    )}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{filteredPeriodLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    {hasActiveFilters ? t.filteredTotal : t.totalExpenses}
                  </p>
                  <p className="text-xl font-bold text-foreground font-mono">
                    {formatCurrencyFull(filteredTotal)} <span className="text-sm font-medium text-muted-foreground">TZS</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-[110px] text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.date}</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.category}</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.property}</TableHead>
                      <TableHead className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.amount}</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.notes}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-16">
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
                              <Search className="h-6 w-6 opacity-40" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{t.noExpensesFound}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t.tryAdjustingFilters}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses.map((expense) => (
                        <TableRow key={expense.id} className="group transition-colors hover:bg-accent/40">
                          <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap py-3.5">
                            {new Date(expense.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-2.5">
                              <span className="h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-offset-2 ring-offset-card" style={{ backgroundColor: getCategoryColor(expense.category), boxShadow: `0 0 0 1px ${getCategoryColor(expense.category)}30` }} />
                              <span className="text-xs font-semibold text-foreground">{translateCategory(expense.category, language)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-foreground/80 max-w-[180px] truncate py-3.5">
                            {expense.property_title || expense.property_id || "-"}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm font-bold text-foreground whitespace-nowrap py-3.5 tabular-nums">
                            {formatCurrencyFull(Number(expense.amount))}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[280px] truncate py-3.5">
                            {expense.notes || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  {filteredExpenses.length > 0 && (
                    <TableFooter>
                      <TableRow className="bg-muted/60 font-semibold">
                        <TableCell colSpan={3} className="text-xs uppercase tracking-wider text-foreground">
                          {t.total} ({filteredExpenses.length} {t.expenses})
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-bold text-foreground tabular-nums">
                          {formatCurrencyFull(filteredTotal)} TZS
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Per-Property Expense Summary & All-Time NOI ─────────── */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Building2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">{t.perPropertyExpenses}</CardTitle>
                <CardDescription className="text-xs">{t.perPropertyDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {propertyExpenseTotals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 mb-3">
                  <Building2 className="h-6 w-6 opacity-40" />
                </div>
                <p className="text-sm font-medium">{t.noPropertyExpenseData}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.addExpensesWithProperty}</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.property}</TableHead>
                        <TableHead className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.records}</TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.period}</TableHead>
                        <TableHead className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.totalCollected}</TableHead>
                        <TableHead className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.totalExpenses}</TableHead>
                        <TableHead className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.allTimeNOI}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertyExpenseTotals.map((prop) => {
                        const propExpenses = expenses.filter(e => (e.property_id || e.property_title || "Unknown") === (prop.propertyId || prop.propertyTitle));
                        const recordCount = propExpenses.length;
                        const noi = prop.totalCollected - prop.totalExpenses;
                        return (
                          <TableRow key={prop.propertyId || prop.propertyTitle} className="group transition-colors hover:bg-accent/40">
                            <TableCell className="py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5">
                                  <Building2 className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <span className="text-xs font-semibold text-foreground">{prop.propertyTitle}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="rounded-full text-[11px] font-mono px-2.5 py-0.5">{recordCount}</Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap py-3.5">
                              {new Date(prop.firstDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                              {" – "}
                              {new Date(prop.lastDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm font-bold whitespace-nowrap py-3.5 tabular-nums">
                              <span className="text-emerald-600">
                                {formatCurrencyFull(prop.totalCollected)} TZS
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm font-bold whitespace-nowrap py-3.5 tabular-nums">
                              <span className="text-red-500">
                                {formatCurrencyFull(prop.totalExpenses)} TZS
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm font-bold whitespace-nowrap py-3.5 tabular-nums">
                              <span className={noi >= 0 ? "text-emerald-600" : "text-red-500"}>
                                {noi >= 0 ? "" : "-"}{formatCurrencyFull(Math.abs(noi))} TZS
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="bg-muted/60 font-semibold">
                        <TableCell colSpan={3} className="text-xs uppercase tracking-wider text-foreground">
                          {t.grandTotal} ({propertyExpenseTotals.length} {t.properties})
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-bold text-emerald-600 tabular-nums">
                          {formatCurrencyFull(propertyExpenseTotals.reduce((s, p) => s + p.totalCollected, 0))} TZS
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-bold text-red-500 tabular-nums">
                          {formatCurrencyFull(propertyExpenseTotals.reduce((s, p) => s + p.totalExpenses, 0))} TZS
                        </TableCell>
                        {(() => {
                          const grandNoi = propertyExpenseTotals.reduce((s, p) => s + p.totalCollected, 0) - propertyExpenseTotals.reduce((s, p) => s + p.totalExpenses, 0);
                          return (
                            <TableCell className="text-right font-mono text-sm font-bold tabular-nums">
                              <span className={grandNoi >= 0 ? "text-emerald-600" : "text-red-500"}>
                                {grandNoi >= 0 ? "" : "-"}{formatCurrencyFull(Math.abs(grandNoi))} TZS
                              </span>
                            </TableCell>
                          );
                        })()}
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
            )}
            <InsightBox>
              {t.noiInsight}
            </InsightBox>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
