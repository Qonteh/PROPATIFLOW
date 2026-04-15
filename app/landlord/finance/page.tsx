"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  RefreshCw,
  Download,
  Send,
  Shield,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Layers,
  ChevronRight,
  Crown,
  CheckCircle2,
  Clock,
  XCircle,
  Lightbulb,
  Users,
  Home,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Wallet,
  CalendarDays,
  Filter,
  Lock,
  Sparkles,
  Globe,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts"
import Link from "next/link"

// ─── Language Types ──────────────────────────────────────────────────
type Language = "en" | "sw"

// ─── Translations ────────────────────────────────────────────────────
const translations = {
  en: {
    // Header
    financialDashboard: "Financial Dashboard",
    financialDashboardDesc: "Real-time overview of your property portfolio finances",
    
    // Loading
    loadingFinancialDashboard: "Loading Financial Dashboard",
    fetchingPortfolioData: "Fetching your portfolio data...",
    
    // Tier Switcher
    previewPlanFeatures: "Preview Plan Features",
    popular: "POPULAR",
    plan: "Plan",
    
    // Mini Stats
    cashThisMonth: "Cash This Month",
    cashAllTime: "Cash All-Time",
    thisMonthExpenses: "This Month Expenses",
    properties: "Properties",
    activeTenants: "Active Tenants",
    totalExpenses: "Total Expenses",
    
    // Cash Collected Filter
    cashCollectedSummary: "Cash Collected Summary",
    cashCollectedSummaryDesc: "Filter by date range to see cash collected for a specific period",
    fromDate: "From Date",
    toDate: "To Date",
    clearFilter: "Clear Filter",
    thisMonth: "This Month",
    allTimeTotal: "All-Time Total",
    sinceFirstTransaction: "Since first transaction recorded",
    filteredPeriod: "Filtered Period",
    selectDatesToFilter: "Select dates above to filter",
    
    // KPI Cards
    collectionRate: "Collection Rate",
    rentDue: "rent due",
    totalArrears: "Total Arrears",
    outstandingBalances: "outstanding balances",
    occupancyRate: "Occupancy Rate",
    ofUnits: "of",
    units: "units",
    netOperatingIncome: "Net Operating Income",
    cashBasisNOI: "cash basis NOI",
    
    // Charts
    plReportsCashFlow: "P&L Reports & Cash Flow Analysis",
    cashFlowAnalysis: "Cash Flow Analysis",
    revenueVsExpenses: "Revenue vs Expenses (Monthly)",
    revenue: "Revenue",
    expenses: "Expenses",
    noCashflowData: "No cashflow data available.",
    revenueGrew: "Revenue grew",
    from: "from",
    to: "to",
    expensesSpiked: "expenses spiked — investigate.",
    netCashflowMargin: "Net cashflow margin averages",
    
    paymentStatus: "Payment Status",
    paymentStatusDesc: "Distribution of payment timeliness",
    onTime: "On Time",
    late: "Late",
    partial: "Partial",
    unpaid: "Unpaid",
    noPaymentData: "No payment data available",
    noPaymentStatusData: "No payment status data available.",
    onTimePayments: "on-time payments is good but",
    unpaidNeedsAttention: "unpaid needs attention. Target: reduce late payments below 15% (currently",
    throughReminders: ") through automated reminders.",
    
    // Vacancy Tracking
    vacancyTrackingTrend: "Vacancy Tracking & Trend Analysis",
    collectionRateTrend: "Collection Rate Trend",
    collectionRateTrendDesc: "% of rent due that was paid monthly",
    noCollectionTrendData: "No collection trend data available.",
    collectionRateImproved: "Collection rate improved from",
    aPointGain: "a point gain in",
    months: "months",
    upward: "upward",
    downward: "downward",
    consistent: "Consistent",
    trajectorySuggests: "trajectory suggests payment reminders and PSP integrations are working.",
    
    occupancyOverview: "Occupancy Overview",
    occupancyOverviewDesc: "Active leases / active units",
    noOccupancyData: "No occupancy data available.",
    occupancyIs: "occupancy is",
    aboveIndustry: "above",
    belowIndustry: "below",
    industryAverage: "industry average",
    vacantUnits: "vacant units represent",
    potentialRevenue: "potential revenue. Consider marketplace listing optimization.",
    occupied: "occupied",
    total: "total",
    
    noiTrend: "NOI Trend (Cash Basis)",
    noiTrendDesc: "cash_collected - cash_expenses monthly",
    noNOIData: "No NOI data available.",
    noiPeakedAt: "NOI peaked at",
    in: "in",
    thenDroppedTo: "then dropped to",
    dueToExpenseSpike: "due to expense spike.",
    ytdAverage: "Year-to-date average:",
    perMonth: "/month.",
    strongPositiveCashflow: "Strong positive cashflow.",
    cashflowIsNegative: "Cashflow is negative.",
    
    // Arrears Aging
    arrearsAging: "Arrears Aging",
    arrearsAgingDesc: "Outstanding balances by age (FIFO allocated)",
    noArrearsData: "No arrears data available.",
    ofArrears: "of arrears",
    are030Days: "are 0-30 days — still recoverable. Focus collection efforts on 90+ day arrears",
    tenantsToPrevent: "tenants) to prevent write-offs.",
    
    // Gold Features
    trustScoreAnalytics: "TrustScore Analytics & Reconciliation",
    occupancyTrend: "Occupancy Trend",
    occupancyTrendDesc: "Monthly occupancy rate performance",
    noOccupancyTrendData: "No occupancy trend data available.",
    occupancySteadily: "Occupancy steadily",
    rose: "rose",
    fell: "fell",
    marketplaceStrategy: "Marketplace listings and pricing are driving demand. Maintain current strategy.",
    
    paymentReconciliation: "Payment Reconciliation",
    pspWebhooks: "PSP Webhooks > Match > FIFO > Ledger",
    auto: "auto",
    totalProcessed: "Total",
    autoMatched: "Auto-Matched",
    manualReview: "Manual Review",
    unmatched: "Unmatched",
    noReconciliationData: "No reconciliation data available.",
    autoMatchRate: "auto-match rate.",
    unmatchedPayments: "unmatched payments need manual review. Algorithm improving monthly.",
    
    efdTaxCompliance: "EFD Tax Compliance",
    efdTaxComplianceDesc: "Electronic Fiscal Device receipt status",
    complianceRate: "Compliance Rate",
    issued: "Issued",
    pending: "Pending",
    failed: "Failed",
    noEFDData: "No EFD data available.",
    efdCompliance: "EFD compliance.",
    pendingReceipts: "pending receipts likely awaiting PSP confirmation.",
    failedReceipts: "failed receipts need manual resubmission to TRA portal. Ensure 100% before quarter-end.",
    
    // Multi-Property Management Tables
    multiPropertyManagement: "Multi-Property Management",
    propertyPerformance: "Property Performance",
    allTimeNOI: "All-Time NOI",
    arrearsAgingTab: "Arrears Aging",
    ledgerTransactions: "Ledger Transactions",
    
    propertyPerformanceDrillDown: "Property Performance Drill-Down",
    propertyPerformanceDrillDownDesc: "Financial breakdown by property and unit",
    property: "Property",
    status: "Status",
    tenant: "Tenant",
    monthlyRent: "Monthly Rent",
    collected: "Collected",
    pendingAmount: "Pending",
    expensesCol: "Expenses",
    noi: "NOI",
    noPropertyData: "No property performance data available.",
    allPropertiesPositive: "All properties have positive NOI.",
    prioritizeFilling: "Prioritize filling",
    vacantNegativeNOI: "(vacant, negative NOI).",
    escalateCollection: "Escalate collection on",
    occupiedNonPaying: "(occupied, non-paying tenant).",
    somePropertiesNegative: "Some properties have negative NOI. Prioritize filling vacant units and escalating collection on non-paying tenants.",
    
    allTimeNOIPerProperty: "All-Time NOI Per Property",
    allTimeNOIPerPropertyDesc: "Total Cash Collected since property posted minus Total Expenses from start",
    period: "Period",
    totalCollected: "Total Collected",
    totalExpensesCol: "Total Expenses",
    allTimeNOICol: "All-Time NOI",
    grandTotal: "Grand Total",
    allTimeNOIInsight: "All-Time NOI is calculated as Total Cash Collected (since property was first posted) minus Total Expenses (from the very start) for each individual property. Only completed/paid transactions count toward collected revenue.",
    
    arrearsAgingReport: "Arrears Aging Report",
    arrearsAgingReportDesc: "Outstanding balances by age bucket (FIFO allocated)",
    totalOutstanding: "Total Outstanding",
    days030: "0-30 Days",
    days3160: "31-60 Days",
    days6190: "61-90 Days",
    days90Plus: "90+ Days",
    tenants: "tenants",
    contact: "Contact",
    amountDue: "Amount Due",
    daysOverdue: "Days Overdue",
    actions: "Actions",
    days: "days",
    remind: "Remind",
    tenantsAre90Plus: "tenants are 90+ days overdue — consider sending final notices or legal action.",
    moreAre3190: "more are between 31-90 days overdue; automated reminders are active.",
    
    ledgerTransactionsTitle: "Ledger Transactions",
    ledgerTransactionsDesc: "Recent payment activity with reconciliation confidence scores",
    transactions: "transactions",
    date: "Date",
    dueDate: "Due Date",
    psp: "PSP",
    method: "Method",
    amount: "Amount",
    fee: "Fee",
    confidence: "Confidence",
    efd: "EFD",
    ledgerInsight: "Hassan Juma's payment has a 72% confidence score — likely MSISDN mismatch. Review in manual reconciliation queue. All other matches are 95%+.",
    
    // TrustScore Privacy
    trustScoreAnalyticsTrends: "TrustScore Analytics & Trends",
    privacyNoticeTrustScore: "Privacy Notice: TrustScore",
    privacyNoticeDesc: "Individual tenant TrustScores are not displayed in the Financial Dashboard. Tenant credit data follows a consent-based pull model (similar to bank/credit bureau practices) and is only accessible during the application process in the Marketplace (Layer 2). For portfolio-level insight, aggregated anonymized metrics such as average TrustScore may be enabled separately with appropriate privacy safeguards.",
    
    // Reports & Actions
    customReportingAPI: "Custom Reporting & API Access",
    reportsExportActions: "Reports & Export Actions",
    reportsExportActionsDesc: "Generate reports, export data, and send reminders",
    downloadRentRoll: "Download Rent Roll (PDF)",
    exportPL: "Export P&L (Excel)",
    efdComplianceReport: "EFD Compliance Report",
    sendArrearsReminders: "Send Arrears Reminders",
    sentRemindersTo: "Sent reminders to",
    tenantsWithArrears: "tenants with arrears.",
    failedDownloadRentRoll: "Failed to download Rent Roll PDF",
    failedDownloadPL: "Failed to download P&L Excel file",
    failedDownloadEFD: "Failed to download EFD report",
    failedSendReminders: "Failed to send arrears reminders",
    
    // Subscription Footer
    landlordPlan: "Landlord Plan",
    bronzeDesc: "3-10 units, automated rent collection, payment reminders, basic TrustScore (view only), transaction history, email support",
    silverDesc: "10-50 units, P&L reports, TrustScore sharing, priority support, multi-property management, vacancy tracking, WhatsApp alerts",
    goldDesc: "50+ units, multi-property dashboard, TrustScore analytics, dedicated account manager, API access, custom reporting, phone support",
    rentCollection: "Rent Collection",
    paymentReminders: "Payment Reminders",
    transactionHistory: "Transaction History",
    plReports: "P&L Reports",
    multiProperty: "Multi-Property",
    whatsAppAlerts: "WhatsApp Alerts",
    fullDashboard: "Full Dashboard",
    apiAccess: "API Access",
    prioritySupport: "Priority Support",
    upgradePlan: "Upgrade Plan",
    managePlan: "Manage Plan",
    upgradeNow: "Upgrade Now",
    upgradeToUnlock: "to unlock",
  },
  sw: {
    // Header
    financialDashboard: "Dashibodi ya Fedha",
    financialDashboardDesc: "Muhtasari wa wakati halisi wa fedha za portfolio yako ya mali",
    
    // Loading
    loadingFinancialDashboard: "Inapakia Dashibodi ya Fedha",
    fetchingPortfolioData: "Inapata data ya portfolio yako...",
    
    // Tier Switcher
    previewPlanFeatures: "Kagua Vipengele vya Mpango",
    popular: "MAARUFU",
    plan: "Mpango",
    
    // Mini Stats
    cashThisMonth: "Pesa Mwezi Huu",
    cashAllTime: "Pesa Wakati Wote",
    thisMonthExpenses: "Gharama za Mwezi Huu",
    properties: "Mali",
    activeTenants: "Wapangaji Hai",
    totalExpenses: "Jumla ya Gharama",
    
    // Cash Collected Filter
    cashCollectedSummary: "Muhtasari wa Pesa Zilizokusanywa",
    cashCollectedSummaryDesc: "Chuja kwa kipindi cha tarehe kuona pesa zilizokusanywa kwa kipindi maalum",
    fromDate: "Kuanzia Tarehe",
    toDate: "Hadi Tarehe",
    clearFilter: "Futa Kichujio",
    thisMonth: "Mwezi Huu",
    allTimeTotal: "Jumla ya Wakati Wote",
    sinceFirstTransaction: "Tangu muamala wa kwanza kurekodiwa",
    filteredPeriod: "Kipindi Kilichochujwa",
    selectDatesToFilter: "Chagua tarehe hapo juu kuchuja",
    
    // KPI Cards
    collectionRate: "Kiwango cha Ukusanyaji",
    rentDue: "kodi inayodaiwa",
    totalArrears: "Jumla ya Madeni",
    outstandingBalances: "salio zinazobaki",
    occupancyRate: "Kiwango cha Ukaaji",
    ofUnits: "kati ya",
    units: "vyumba",
    netOperatingIncome: "Mapato Halisi ya Uendeshaji",
    cashBasisNOI: "NOI ya msingi wa pesa",
    
    // Charts
    plReportsCashFlow: "Ripoti za P&L na Uchambuzi wa Mtiririko wa Pesa",
    cashFlowAnalysis: "Uchambuzi wa Mtiririko wa Pesa",
    revenueVsExpenses: "Mapato dhidi ya Gharama (Kila Mwezi)",
    revenue: "Mapato",
    expenses: "Gharama",
    noCashflowData: "Hakuna data ya mtiririko wa pesa.",
    revenueGrew: "Mapato yaliongezeka",
    from: "kutoka",
    to: "hadi",
    expensesSpiked: "gharama zilipanda — chunguza.",
    netCashflowMargin: "Wastani wa ukingo wa mtiririko wa pesa ni",
    
    paymentStatus: "Hali ya Malipo",
    paymentStatusDesc: "Usambazaji wa wakati wa malipo",
    onTime: "Kwa Wakati",
    late: "Imechelewa",
    partial: "Sehemu",
    unpaid: "Haijalipwa",
    noPaymentData: "Hakuna data ya malipo",
    noPaymentStatusData: "Hakuna data ya hali ya malipo.",
    onTimePayments: "malipo kwa wakati ni nzuri lakini",
    unpaidNeedsAttention: "haijalipwa inahitaji uangalifu. Lengo: punguza malipo ya kuchelewa chini ya 15% (sasa ni",
    throughReminders: ") kupitia vikumbusho vya kiotomatiki.",
    
    // Vacancy Tracking
    vacancyTrackingTrend: "Ufuatiliaji wa Nafasi na Uchambuzi wa Mwenendo",
    collectionRateTrend: "Mwenendo wa Kiwango cha Ukusanyaji",
    collectionRateTrendDesc: "% ya kodi inayodaiwa iliyolipwa kila mwezi",
    noCollectionTrendData: "Hakuna data ya mwenendo wa ukusanyaji.",
    collectionRateImproved: "Kiwango cha ukusanyaji kiliboreshwa kutoka",
    aPointGain: "ongezeko la pointi katika",
    months: "miezi",
    upward: "juu",
    downward: "chini",
    consistent: "Thabiti",
    trajectorySuggests: "mwelekeo unaonyesha vikumbusho vya malipo na muunganisho wa PSP vinafanya kazi.",
    
    occupancyOverview: "Muhtasari wa Ukaaji",
    occupancyOverviewDesc: "Mikataba hai / vyumba hai",
    noOccupancyData: "Hakuna data ya ukaaji.",
    occupancyIs: "ukaaji ni",
    aboveIndustry: "juu ya",
    belowIndustry: "chini ya",
    industryAverage: "wastani wa sekta",
    vacantUnits: "vyumba tupu vinawakilisha",
    potentialRevenue: "mapato yanayowezekana. Fikiria kuboresha orodha ya soko.",
    occupied: "imekaaliwa",
    total: "jumla",
    
    noiTrend: "Mwenendo wa NOI (Msingi wa Pesa)",
    noiTrendDesc: "pesa_zilizokusanywa - gharama_za_pesa kila mwezi",
    noNOIData: "Hakuna data ya NOI.",
    noiPeakedAt: "NOI ilifikia kilele cha",
    in: "katika",
    thenDroppedTo: "kisha ikashuka hadi",
    dueToExpenseSpike: "kutokana na ongezeko la gharama.",
    ytdAverage: "Wastani wa mwaka hadi sasa:",
    perMonth: "/mwezi.",
    strongPositiveCashflow: "Mtiririko wa pesa chanya wenye nguvu.",
    cashflowIsNegative: "Mtiririko wa pesa ni hasi.",
    
    // Arrears Aging
    arrearsAging: "Umri wa Madeni",
    arrearsAgingDesc: "Salio zinazobaki kwa umri (FIFO iliyotengwa)",
    noArrearsData: "Hakuna data ya madeni.",
    ofArrears: "ya madeni",
    are030Days: "ni siku 0-30 — bado zinaweza kupatikana. Lenga juhudi za ukusanyaji kwa madeni ya siku 90+",
    tenantsToPrevent: "wapangaji) kuzuia kuandikwa kama hasara.",
    
    // Gold Features
    trustScoreAnalytics: "Uchambuzi wa TrustScore na Upatanisho",
    occupancyTrend: "Mwenendo wa Ukaaji",
    occupancyTrendDesc: "Utendaji wa kiwango cha ukaaji kila mwezi",
    noOccupancyTrendData: "Hakuna data ya mwenendo wa ukaaji.",
    occupancySteadily: "Ukaaji kwa uthabiti",
    rose: "ulipanda",
    fell: "ulishuka",
    marketplaceStrategy: "Orodha za soko na bei zinaendeleza mahitaji. Endelea na mkakati wa sasa.",
    
    paymentReconciliation: "Upatanisho wa Malipo",
    pspWebhooks: "Webhooks za PSP > Linganisha > FIFO > Leja",
    auto: "otomatiki",
    totalProcessed: "Jumla",
    autoMatched: "Zilizolinganishwa Auto",
    manualReview: "Ukaguzi wa Mikono",
    unmatched: "Hazijaoana",
    noReconciliationData: "Hakuna data ya upatanisho.",
    autoMatchRate: "kiwango cha kulinganisha otomatiki.",
    unmatchedPayments: "malipo ambayo hayajaoana yanahitaji ukaguzi wa mikono. Kanuni inaboreshwa kila mwezi.",
    
    efdTaxCompliance: "Uzingatiaji wa Kodi ya EFD",
    efdTaxComplianceDesc: "Hali ya risiti ya Kifaa cha Fedha cha Elektroniki",
    complianceRate: "Kiwango cha Uzingatiaji",
    issued: "Imetolewa",
    pending: "Inasubiri",
    failed: "Imeshindwa",
    noEFDData: "Hakuna data ya EFD.",
    efdCompliance: "uzingatiaji wa EFD.",
    pendingReceipts: "risiti zinazosubiri labda zinasubiri uthibitisho wa PSP.",
    failedReceipts: "risiti zilizoshindwa zinahitaji kuwasilishwa upya kwa portal ya TRA. Hakikisha 100% kabla ya mwisho wa robo.",
    
    // Multi-Property Management Tables
    multiPropertyManagement: "Usimamizi wa Mali Nyingi",
    propertyPerformance: "Utendaji wa Mali",
    allTimeNOI: "NOI ya Wakati Wote",
    arrearsAgingTab: "Umri wa Madeni",
    ledgerTransactions: "Miamala ya Leja",
    
    propertyPerformanceDrillDown: "Uchambuzi wa Utendaji wa Mali",
    propertyPerformanceDrillDownDesc: "Mgawanyo wa fedha kwa mali na chumba",
    property: "Mali",
    status: "Hali",
    tenant: "Mpangaji",
    monthlyRent: "Kodi ya Mwezi",
    collected: "Imekusanywa",
    pendingAmount: "Inasubiri",
    expensesCol: "Gharama",
    noi: "NOI",
    noPropertyData: "Hakuna data ya utendaji wa mali.",
    allPropertiesPositive: "Mali zote zina NOI chanya.",
    prioritizeFilling: "Kipaumbele kujaza",
    vacantNegativeNOI: "(tupu, NOI hasi).",
    escalateCollection: "Ongeza ukusanyaji kwa",
    occupiedNonPaying: "(imekaaliwa, mpangaji asiyolipa).",
    somePropertiesNegative: "Baadhi ya mali zina NOI hasi. Kipaumbele kujaza vyumba tupu na kuongeza ukusanyaji kwa wapangaji wasiolipa.",
    
    allTimeNOIPerProperty: "NOI ya Wakati Wote Kwa Kila Mali",
    allTimeNOIPerPropertyDesc: "Jumla ya Pesa Zilizokusanywa tangu mali iliwekwa minus Jumla ya Gharama kutoka mwanzo",
    period: "Kipindi",
    totalCollected: "Jumla Iliyokusanywa",
    totalExpensesCol: "Jumla ya Gharama",
    allTimeNOICol: "NOI ya Wakati Wote",
    grandTotal: "Jumla Kuu",
    allTimeNOIInsight: "NOI ya Wakati Wote inahesabiwa kama Jumla ya Pesa Zilizokusanywa (tangu mali iliwekwa kwanza) minus Jumla ya Gharama (kutoka mwanzo kabisa) kwa kila mali moja. Miamala iliyokamilika/iliyolipwa pekee ndiyo inayohesabiwa kuelekea mapato yaliyokusanywa.",
    
    arrearsAgingReport: "Ripoti ya Umri wa Madeni",
    arrearsAgingReportDesc: "Salio zinazobaki kwa kundi la umri (FIFO iliyotengwa)",
    totalOutstanding: "Jumla Inayobaki",
    days030: "Siku 0-30",
    days3160: "Siku 31-60",
    days6190: "Siku 61-90",
    days90Plus: "Siku 90+",
    tenants: "wapangaji",
    contact: "Mawasiliano",
    amountDue: "Kiasi Kinachohitajika",
    daysOverdue: "Siku Zilizochelewa",
    actions: "Vitendo",
    days: "siku",
    remind: "Kumbusha",
    tenantsAre90Plus: "wapangaji wamechelewa siku 90+ — fikiria kutuma notisi za mwisho au hatua za kisheria.",
    moreAre3190: "zaidi wako kati ya siku 31-90 zilizochelewa; vikumbusho vya kiotomatiki vinafanya kazi.",
    
    ledgerTransactionsTitle: "Miamala ya Leja",
    ledgerTransactionsDesc: "Shughuli za hivi karibuni za malipo na alama za kujiamini za upatanisho",
    transactions: "miamala",
    date: "Tarehe",
    dueDate: "Tarehe ya Kulipa",
    psp: "PSP",
    method: "Njia",
    amount: "Kiasi",
    fee: "Ada",
    confidence: "Kujiamini",
    efd: "EFD",
    ledgerInsight: "Malipo ya Hassan Juma yana alama ya kujiamini ya 72% — labda kutofautiana kwa MSISDN. Kagua katika foleni ya upatanisho wa mikono. Mechi zingine zote ni 95%+.",
    
    // TrustScore Privacy
    trustScoreAnalyticsTrends: "Uchambuzi na Mwenendo wa TrustScore",
    privacyNoticeTrustScore: "Notisi ya Faragha: TrustScore",
    privacyNoticeDesc: "TrustScore za wapangaji mmoja mmoja hazionyeshwi katika Dashibodi ya Fedha. Data ya mkopo wa mpangaji inafuata mfano wa kuvuta kwa idhini (sawa na mazoea ya benki/ofisi ya mkopo) na inapatikana tu wakati wa mchakato wa maombi katika Soko (Layer 2). Kwa ufahamu wa kiwango cha portfolio, metriki zilizounganishwa zisizo na majina kama wastani wa TrustScore zinaweza kuwezeshwa kwa kujitegemea na ulinzi unaofaa wa faragha.",
    
    // Reports & Actions
    customReportingAPI: "Ripoti za Desturi na Ufikiaji wa API",
    reportsExportActions: "Ripoti na Vitendo vya Kusafirisha",
    reportsExportActionsDesc: "Tengeneza ripoti, safirisha data, na tuma vikumbusho",
    downloadRentRoll: "Pakua Orodha ya Kodi (PDF)",
    exportPL: "Safirisha P&L (Excel)",
    efdComplianceReport: "Ripoti ya Uzingatiaji wa EFD",
    sendArrearsReminders: "Tuma Vikumbusho vya Madeni",
    sentRemindersTo: "Imetuma vikumbusho kwa",
    tenantsWithArrears: "wapangaji wenye madeni.",
    failedDownloadRentRoll: "Imeshindwa kupakua PDF ya Orodha ya Kodi",
    failedDownloadPL: "Imeshindwa kupakua faili ya Excel ya P&L",
    failedDownloadEFD: "Imeshindwa kupakua ripoti ya EFD",
    failedSendReminders: "Imeshindwa kutuma vikumbusho vya madeni",
    
    // Subscription Footer
    landlordPlan: "Mpango wa Mmiliki",
    bronzeDesc: "Vyumba 3-10, ukusanyaji wa kodi otomatiki, vikumbusho vya malipo, TrustScore ya msingi (kuangalia tu), historia ya miamala, msaada wa barua pepe",
    silverDesc: "Vyumba 10-50, ripoti za P&L, kushiriki TrustScore, msaada wa kipaumbele, usimamizi wa mali nyingi, ufuatiliaji wa nafasi, arifa za WhatsApp",
    goldDesc: "Vyumba 50+, dashibodi ya mali nyingi, uchambuzi wa TrustScore, meneja wa akaunti aliyejitolea, ufikiaji wa API, ripoti za desturi, msaada wa simu",
    rentCollection: "Ukusanyaji wa Kodi",
    paymentReminders: "Vikumbusho vya Malipo",
    transactionHistory: "Historia ya Miamala",
    plReports: "Ripoti za P&L",
    multiProperty: "Mali Nyingi",
    whatsAppAlerts: "Arifa za WhatsApp",
    fullDashboard: "Dashibodi Kamili",
    apiAccess: "Ufikiaji wa API",
    prioritySupport: "Msaada wa Kipaumbele",
    upgradePlan: "Boresha Mpango",
    managePlan: "Simamia Mpango",
    upgradeNow: "Boresha Sasa",
    upgradeToUnlock: "kufungua",
  }
}

// ─── Subscription Tier Types ─────────────────────────────────────────
type SubscriptionTier = "bronze" | "silver" | "gold"

interface TierConfig {
  name: string
  nameSw: string
  icon: string
  units: string
  unitsSw: string
  price: string
  annual: string
  color: string
  bgColor: string
  borderColor: string
  features: {
    automatedRentCollection: boolean
    paymentReminders: boolean
    basicTrustScore: boolean
    transactionHistory: boolean
    plReports: boolean
    trustScoreSharing: boolean
    prioritySupport: boolean
    multiPropertyManagement: boolean
    vacancyTracking: boolean
    whatsAppAlerts: boolean
    multiPropertyDashboard: boolean
    trustScoreAnalytics: boolean
    dedicatedAccountManager: boolean
    apiAccess: boolean
    customReporting: boolean
    phoneSupport: boolean
  }
}

const TIER_CONFIG: Record<SubscriptionTier, TierConfig> = {
  bronze: {
    name: "BRONZE",
    nameSw: "SHABA",
    icon: "🥉",
    units: "3-10 Units",
    unitsSw: "Vyumba 3-10",
    price: "TSh 35,000/month",
    annual: "TSh 420,000/year",
    color: "text-amber-700",
    bgColor: "bg-amber-100/50",
    borderColor: "border-amber-300",
    features: {
      automatedRentCollection: true,
      paymentReminders: true,
      basicTrustScore: true,
      transactionHistory: true,
      plReports: false,
      trustScoreSharing: false,
      prioritySupport: false,
      multiPropertyManagement: false,
      vacancyTracking: false,
      whatsAppAlerts: false,
      multiPropertyDashboard: false,
      trustScoreAnalytics: false,
      dedicatedAccountManager: false,
      apiAccess: false,
      customReporting: false,
      phoneSupport: false,
    },
  },
  silver: {
    name: "SILVER",
    nameSw: "FEDHA",
    icon: "🥈",
    units: "10-50 Units",
    unitsSw: "Vyumba 10-50",
    price: "TSh 75,000/month",
    annual: "TSh 900,000/year",
    color: "text-slate-600",
    bgColor: "bg-slate-100/50",
    borderColor: "border-slate-300",
    features: {
      automatedRentCollection: true,
      paymentReminders: true,
      basicTrustScore: true,
      transactionHistory: true,
      plReports: true,
      trustScoreSharing: true,
      prioritySupport: true,
      multiPropertyManagement: true,
      vacancyTracking: true,
      whatsAppAlerts: true,
      multiPropertyDashboard: false,
      trustScoreAnalytics: false,
      dedicatedAccountManager: false,
      apiAccess: false,
      customReporting: false,
      phoneSupport: false,
    },
  },
  gold: {
    name: "GOLD",
    nameSw: "DHAHABU",
    icon: "🥇",
    units: "50+ Units",
    unitsSw: "Vyumba 50+",
    price: "TSh 180,000/month",
    annual: "TSh 2,160,000/year",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100/50",
    borderColor: "border-yellow-400",
    features: {
      automatedRentCollection: true,
      paymentReminders: true,
      basicTrustScore: true,
      transactionHistory: true,
      plReports: true,
      trustScoreSharing: true,
      prioritySupport: true,
      multiPropertyManagement: true,
      vacancyTracking: true,
      whatsAppAlerts: true,
      multiPropertyDashboard: true,
      trustScoreAnalytics: true,
      dedicatedAccountManager: true,
      apiAccess: true,
      customReporting: true,
      phoneSupport: true,
    },
  },
}

// ─── Types ───────────────────────────────────────────────────────────
interface FinanceSummary {
  collectionRate: number
  collectionRateDelta: number
  totalArrears: number
  arrearsDelta: number
  occupancyRate: number
  occupiedUnits: number
  totalUnits: number
  totalProperties: number
  totalTenants: number
  cashCollected: number
  currency: string
  noi: number
  noiDelta: number
  totalExpenses: number
  rentDue: number
}

interface CashflowEntry {
  month: string
  revenue: number
  expense: number
  net: number
}

interface CollectionTrendEntry {
  month: string
  rate: number
}

interface PaymentStatusEntry {
  name: string
  value: number
  color: string
}

interface PropertyBreakdown {
  id: string
  title: string
  address: string
  status: string
  tenantName: string | null
  monthlyRent: number
  collected: number
  pending: number
  propertyExpenses: number
  noi: number
}

interface ArrearsTenant {
  id: string
  tenantName: string
  propertyTitle: string
  tenantEmail: string
  tenantPhone: string
  amount: number
  daysOverdue: number
}

interface ArrearsBucket {
  amount: number
  count: number
  tenants: ArrearsTenant[]
}

interface Transaction {
  id: string
  paidDate: string | null
  dueDate: string
  tenantName: string
  propertyTitle: string
  paymentMethod: string | null
  psp: string | null
  amount: number
  fee: number
  status: string
  confidenceScore: number | null
  efdStatus: string | null
}

interface ReconciliationStats {
  autoMatched: number
  manualReview: number
  unmatched: number
  totalProcessed: number
}

interface EFDSummary {
  issued: number
  pending: number
  failed: number
  total: number
}

interface RawTransaction {
  id: string
  paidDate: string | null
  dueDate: string
  amount: number | string
  fee: number | string
  status: string
  paymentMethod: string | null
  paymentType: string | null
  confidenceScore: number | null
  efdStatus: string | null
  tenant: { name: string } | null
  property: { id?: string; title: string } | null
  propertyId?: string
}

// Utility: map API payment status to chart color
const paymentStatusColors: Record<string, string> = {
  onTime: "hsl(168, 71%, 39%)",
  late: "hsl(38, 92%, 50%)",
  partial: "hsl(25, 95%, 53%)",
  unpaid: "hsl(0, 72%, 51%)",
}

// ─── Formatters ──────────────────────────────────────────────────────
const formatCurrency = (value: number | string): string => {
  const num = Number(value)
  if (isNaN(num)) return "0"
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toLocaleString()
}

const formatCurrencyFull = (value: number | string): string => {
  const num = Number(value)
  if (isNaN(num)) return "0 TZS"
  return new Intl.NumberFormat("en-TZ", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num) + " TZS"
}

// ─── Insight Box ─────────────────────────────────────────────────────
function InsightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-primary/[0.04] border border-primary/[0.08] px-4 py-3.5 mt-6">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
        <Lightbulb className="h-3.5 w-3.5 text-primary" />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

// ─── KPI Card ────────────────────────────────────────────────────────
function KPICard({
  title,
  value,
  subtitle,
  delta,
  icon: Icon,
  trend,
  accentColor,
}: {
  title: string
  value: string
  subtitle: string
  delta?: number
  icon: React.ElementType
  trend?: "up" | "down"
  accentColor: string
}) {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 rounded-2xl bg-card">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: `linear-gradient(145deg, ${accentColor}, transparent 70%)` }} />
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60" style={{ background: accentColor }} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">{title}</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: `${accentColor}10` }}>
            <Icon className="h-4 w-4" style={{ color: accentColor }} />
          </div>
        </div>
        <div className="text-[26px] font-extrabold tracking-tight text-foreground leading-none">{value}</div>
        <div className="flex items-center gap-2 mt-3">
          {delta !== undefined && (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${trend === "up" ? "bg-[hsl(168,71%,39%)]/10 text-[hsl(168,71%,39%)]" : "bg-destructive/10 text-destructive"}`}>
              {trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
              {Math.abs(delta)}%
            </span>
          )}
          <span className="text-[11px] text-muted-foreground/80">{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Mini Stat ───────────────────────────────────────────────────────
function MiniStat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.06] shrink-0">
        <Icon className="h-4 w-4 text-primary/80" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{label}</div>
        <div className="text-sm font-bold text-foreground tabular-nums truncate">{value}</div>
      </div>
    </div>
  )
}

// ─── Section Header ──────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <CardHeader className="pb-4 pt-5 px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/[0.06]">
          <Icon className="h-4 w-4 text-primary/80" />
        </div>
        <div>
          <CardTitle className="text-[13px] font-bold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-[11px] mt-0.5">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
  )
}

// ─── Tier Switcher ───────────────────────────────────────────────────
function TierSwitcher({ 
  currentTier, 
  onTierChange,
  language
}: { 
  currentTier: SubscriptionTier
  onTierChange: (tier: SubscriptionTier) => void
  language: Language
}) {
  const tiers: SubscriptionTier[] = ["bronze", "silver", "gold"]
  const t = translations[language]
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t.previewPlanFeatures}
        </span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {tiers.map((tier) => {
          const config = TIER_CONFIG[tier]
          const isActive = currentTier === tier
          const tierName = language === "sw" ? config.nameSw : config.name
          return (
            <button
              key={tier}
              onClick={() => onTierChange(tier)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive 
                  ? `${config.bgColor} ${config.borderColor} border-2 shadow-sm` 
                  : "bg-muted/30 border border-border/50 hover:bg-muted/50"
                }
              `}
            >
              <span className="text-lg">{config.icon}</span>
              <span className={isActive ? config.color : "text-muted-foreground"}>
                {tierName}
              </span>
              {tier === "silver" && (
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 rounded-full bg-primary/10 text-primary border-0">
                  {t.popular}
                </Badge>
              )}
            </button>
          )
        })}
      </div>
      <div className={`flex items-center gap-3 p-3 rounded-xl ${TIER_CONFIG[currentTier].bgColor} ${TIER_CONFIG[currentTier].borderColor} border`}>
        <span className="text-2xl">{TIER_CONFIG[currentTier].icon}</span>
        <div>
          <div className={`text-sm font-bold ${TIER_CONFIG[currentTier].color}`}>
            {language === "sw" ? TIER_CONFIG[currentTier].nameSw : TIER_CONFIG[currentTier].name} {t.plan} — {TIER_CONFIG[currentTier].price}
          </div>
          <div className="text-xs text-muted-foreground">
            {language === "sw" ? TIER_CONFIG[currentTier].unitsSw : TIER_CONFIG[currentTier].units} • {TIER_CONFIG[currentTier].annual}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Locked Feature Overlay ──────────────────────────────────────────
function LockedFeatureOverlay({ 
  requiredTier, 
  currentTier,
  children,
  featureName,
  language
}: { 
  requiredTier: SubscriptionTier
  currentTier: SubscriptionTier
  children: React.ReactNode
  featureName: string
  language: Language
}) {
  const tierOrder: SubscriptionTier[] = ["bronze", "silver", "gold"]
  const currentIndex = tierOrder.indexOf(currentTier)
  const requiredIndex = tierOrder.indexOf(requiredTier)
  const isLocked = currentIndex < requiredIndex
  const t = translations[language]
  
  if (!isLocked) return <>{children}</>
  
  const config = TIER_CONFIG[requiredTier]
  const tierName = language === "sw" ? config.nameSw : config.name
  
  return (
    <div className="relative">
      <div className="opacity-30 pointer-events-none blur-[2px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-2xl">
        <div className="flex flex-col items-center gap-3 p-6 text-center max-w-[280px]">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${config.bgColor}`}>
            <Lock className={`h-6 w-6 ${config.color}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{featureName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t.upgradeToUnlock} <span className={`font-bold ${config.color}`}>{config.icon} {tierName}</span>
            </p>
          </div>
          <Button size="sm" className="rounded-xl text-xs gap-1.5 mt-1" asChild>
            <Link href="/landlord/upgrade_payment">
              {t.upgradeNow} <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────
export default function FinanceDashboardPage() {
  // ─── Language State ─────────────────────────────────────────────────
  const [language, setLanguage] = useState<Language>("en")
  
  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("app-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "sw")) {
      setLanguage(savedLanguage)
    }
  }, [])
  
  // Save language to localStorage when changed
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("app-language", newLanguage)
  }
  
  const t = translations[language]

  // ─── Subscription Tier State ────────────────────────────────────────
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("bronze")
  const tierFeatures = TIER_CONFIG[currentTier].features
  
  const [monthlyExpenseTotal, setMonthlyExpenseTotal] = useState<number>(0)
  const [expenseBreakdown, setExpenseBreakdown] = useState<{ name: string; value: number; color: string }[]>([])
  const [pspDistribution, setPspDistribution] = useState<{ name: string; value: number; color: string }[]>([])
  const [occupancyTrend, setOccupancyTrend] = useState<{ month: string; rate: number }[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState("30d")
  const [summary, setSummary] = useState<FinanceSummary | null>(null)
  const [cashflow, setCashflow] = useState<CashflowEntry[]>([])
  const [collectionTrend, setCollectionTrend] = useState<CollectionTrendEntry[]>([])
  const [paymentStatusData, setPaymentStatusData] = useState<PaymentStatusEntry[]>([])
  const [propertyBreakdown, setPropertyBreakdown] = useState<PropertyBreakdown[]>([])
  const [propertyExpensesMap, setPropertyExpensesMap] = useState<Record<string, number>>({})
  const [arrearsBuckets, setArrearsBuckets] = useState<Record<string, ArrearsBucket>>({})
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [monthlyNOI, setMonthlyNOI] = useState<{ month: string; noi: number }[]>([])
  const [reconStats, setReconStats] = useState<ReconciliationStats>({ autoMatched: 0, manualReview: 0, unmatched: 0, totalProcessed: 0 })
  const [efd, setEfd] = useState<EFDSummary>({ issued: 0, pending: 0, failed: 0, total: 0 })

  // ─── Cash Collected date range filter ───────────────────────────
  const [cashFromDate, setCashFromDate] = useState("")
  const [cashToDate, setCashToDate] = useState("")

  // ─── Compute cash collected totals ──────────────────────────────
  const cashCollectedThisMonth = useMemo(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    return allTransactions
      .filter(tx => {
        if (tx.status !== "completed" && tx.status !== "paid") return false
        const d = new Date(tx.paidDate || tx.dueDate)
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear
      })
      .reduce((sum, tx) => sum + tx.amount, 0)
  }, [allTransactions])

  const cashCollectedAllTime = useMemo(() => {
    return allTransactions
      .filter(tx => tx.status === "completed" || tx.status === "paid")
      .reduce((sum, tx) => sum + tx.amount, 0)
  }, [allTransactions])

  const cashCollectedFiltered = useMemo(() => {
    if (!cashFromDate && !cashToDate) return null
    return allTransactions
      .filter(tx => {
        if (tx.status !== "completed" && tx.status !== "paid") return false
        const d = new Date(tx.paidDate || tx.dueDate)
        if (cashFromDate && d < new Date(cashFromDate)) return false
        if (cashToDate) {
          const to = new Date(cashToDate)
          to.setHours(23, 59, 59, 999)
          if (d > to) return false
        }
        return true
      })
      .reduce((sum, tx) => sum + tx.amount, 0)
  }, [allTransactions, cashFromDate, cashToDate])

  const cashFilteredLabel = useMemo(() => {
    if (!cashFromDate && !cashToDate) return ""
    const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    if (cashFromDate && cashToDate) return `${fmt(cashFromDate)} - ${fmt(cashToDate)}`
    if (cashFromDate) return `${t.from} ${fmt(cashFromDate)}`
    return `${t.to} ${fmt(cashToDate)}`
  }, [cashFromDate, cashToDate, t])

  // ─── Per-property: Total Collected & Total Expenses ───
  const propertyAllTimeTotals = useMemo(() => {
    const map: Record<string, {
      propertyId: string
      propertyTitle: string
      totalCollected: number
      totalExpenses: number
      firstDate: string
      lastDate: string
    }> = {}

    allTransactions.forEach(tx => {
      if (tx.status !== "completed" && tx.status !== "paid") return
      const key = (tx as Transaction & { propertyId?: string }).propertyId || tx.propertyTitle || "Unknown"
      const paidDate = tx.paidDate || tx.dueDate
      if (!map[key]) {
        map[key] = {
          propertyId: key,
          propertyTitle: tx.propertyTitle || key,
          totalCollected: 0,
          totalExpenses: 0,
          firstDate: paidDate,
          lastDate: paidDate,
        }
      }
      map[key].totalCollected += tx.amount
      if (new Date(paidDate) < new Date(map[key].firstDate)) map[key].firstDate = paidDate
      if (new Date(paidDate) > new Date(map[key].lastDate)) map[key].lastDate = paidDate
    })

    Object.entries(propertyExpensesMap).forEach(([pid, total]) => {
      if (!map[pid]) {
        const prop = propertyBreakdown.find(p => p.id === pid)
        map[pid] = {
          propertyId: pid,
          propertyTitle: prop?.title || pid,
          totalCollected: 0,
          totalExpenses: 0,
          firstDate: new Date().toISOString(),
          lastDate: new Date().toISOString(),
        }
      }
      map[pid].totalExpenses = total
    })

    propertyBreakdown.forEach(p => {
      if (map[p.id]) {
        map[p.id].propertyTitle = p.title
        if (!map[p.id].totalExpenses && p.propertyExpenses > 0) {
          map[p.id].totalExpenses = p.propertyExpenses
        }
      } else if (map[p.title]) {
        if (!map[p.title].totalExpenses && p.propertyExpenses > 0) {
          map[p.title].totalExpenses = p.propertyExpenses
        }
      }
    })

    return Object.values(map)
  }, [allTransactions, propertyExpensesMap, propertyBreakdown])

  // Fetch all finance data
  useEffect(() => {
    async function fetchFinanceData() {
      try {
        const summaryRes = await fetch("/api/finance/summary")
        if (!summaryRes.ok) throw new Error("API unavailable")
        const summaryJson = await summaryRes.json()
        setSummary(summaryJson.summary)

        const expensesRes = await fetch("/api/finance/expenses")
        if (expensesRes.ok) {
          const expensesJson = await expensesRes.json()
          const now = new Date()
          const thisMonth = now.getMonth() + 1
          const thisYear = now.getFullYear()
          const realTotal = Array.isArray(expensesJson.expenses) ? expensesJson.expenses.filter((exp: { created_at: string }) => {
            const dt = new Date(exp.created_at)
            return dt.getMonth() + 1 === thisMonth && dt.getFullYear() === thisYear
          }).reduce((sum: number, exp: { amount: number | string }) => sum + Number(exp.amount), 0) : 0
          setMonthlyExpenseTotal(realTotal)
          const propExpMap: Record<string, number> = {}
          if (Array.isArray(expensesJson.expenses)) {
            expensesJson.expenses.forEach((exp: { property_id?: string; propertyId?: string; amount: number | string }) => {
              const pid = exp.property_id || exp.propertyId
              if (pid) {
                propExpMap[String(pid)] = (propExpMap[String(pid)] || 0) + Number(exp.amount)
              }
            })
          }
          setPropertyExpensesMap(propExpMap)
        }

        const trendsRes = await fetch("/api/finance/trends")
        const trendsJson = await trendsRes.json()
        setCashflow((trendsJson.trends.cashflow || []).map((c: Record<string, number | string>) => ({
          month: c.period,
          revenue: Number(c.revenue) || 0,
          expense: Number(c.expense) || 0,
          net: (Number(c.revenue) || 0) - (Number(c.expense) || 0),
        })))
        setMonthlyNOI((trendsJson.trends.cashflow || []).map((c: Record<string, number | string>) => ({
          month: c.period,
          noi: (Number(c.revenue) || 0) - (Number(c.expense) || 0)
        })))
        if (trendsJson.trends.collectionTrend) {
          setCollectionTrend(trendsJson.trends.collectionTrend.map((c: Record<string, string | number>) => ({
            month: c.month,
            rate: Number(c.rate) || 0
          })))
        }
        const ps = trendsJson.trends.paymentStatus || {}
        setPaymentStatusData([
          { name: "On Time", value: Number(ps.onTime) || 0, color: paymentStatusColors.onTime },
          { name: "Late", value: Number(ps.late) || 0, color: paymentStatusColors.late },
          { name: "Partial", value: Number(ps.partial) || 0, color: paymentStatusColors.partial },
          { name: "Unpaid", value: Number(ps.unpaid) || 0, color: paymentStatusColors.unpaid },
        ])

        const breakdownRes = await fetch("/api/finance/breakdown")
        const breakdownJson = await breakdownRes.json()
        setPropertyBreakdown((breakdownJson.breakdown || []).map((p: Record<string, string | number | boolean | null>) => {
          return {
            id: typeof p.id === "string" ? p.id : String(p.id),
            title: typeof p.name === "string" ? p.name : typeof p.title === "string" ? p.title : "",
            address: typeof p.address === "string" ? p.address : "",
            status: p.isOccupied ? "occupied" : "vacant",
            tenantName: typeof p.tenantName === "string" ? p.tenantName : null,
            monthlyRent: Number(p.expectedRent) || 0,
            collected: Number(p.collected) || 0,
            pending: Number(p.outstanding) || 0,
            propertyExpenses: Number(p.propertyExpenses) || 0,
            noi: Number(p.collected) - (Number(p.propertyExpenses) || 0),
          }
        }))

        const arrearsRes = await fetch("/api/finance/arrears")
        const arrearsJson = await arrearsRes.json()
        setArrearsBuckets(arrearsJson.arrears?.buckets || {})

        const txRes = await fetch("/api/finance/transactions?limit=50")
        const txJson = await txRes.json()
        const mappedTx = (txJson.transactions || []).map((tx: RawTransaction) => ({
          id: tx.id,
          paidDate: tx.paidDate,
          dueDate: tx.dueDate,
          tenantName: tx.tenant?.name || "",
          propertyTitle: tx.property?.title || "",
          propertyId: tx.property?.id || tx.propertyId || "",
          paymentMethod: tx.paymentMethod,
          psp: tx.paymentType,
          amount: Number(tx.amount) || 0,
          fee: Number(tx.fee) || 0,
          status: tx.status as string,
          confidenceScore: tx.confidenceScore as number | null,
          efdStatus: tx.efdStatus as string | null,
        }))
        setTransactions(mappedTx)

        try {
          const allTxRes = await fetch("/api/finance/transactions?limit=10000")
          const allTxJson = await allTxRes.json()
          const allMapped = (allTxJson.transactions || []).map((tx: RawTransaction) => ({
            id: tx.id,
            paidDate: tx.paidDate,
            dueDate: tx.dueDate,
            tenantName: tx.tenant?.name || "",
            propertyTitle: tx.property?.title || "",
            propertyId: tx.property?.id || tx.propertyId || "",
            paymentMethod: tx.paymentMethod,
            psp: tx.paymentType,
            amount: Number(tx.amount) || 0,
            fee: Number(tx.fee) || 0,
            status: tx.status as string,
            confidenceScore: tx.confidenceScore as number | null,
            efdStatus: tx.efdStatus as string | null,
          }))
          setAllTransactions(allMapped)
        } catch {
          setAllTransactions(mappedTx)
        }

        try {
          const reconRes = await fetch("/api/finance/reconciliation")
          if (reconRes.ok) {
            const reconJson = await reconRes.json()
            if (reconJson.stats) setReconStats(reconJson.stats)
            else setReconStats({ autoMatched: 0, manualReview: 0, unmatched: 0, totalProcessed: 0 })
          } else {
            setReconStats({ autoMatched: 0, manualReview: 0, unmatched: 0, totalProcessed: 0 })
          }
        } catch {
          setReconStats({ autoMatched: 0, manualReview: 0, unmatched: 0, totalProcessed: 0 })
        }

        try {
          const efdRes = await fetch("/api/finance/efd")
          if (efdRes.ok) {
            const efdJson = await efdRes.json()
            if (efdJson.summary) setEfd(efdJson.summary)
          }
        } catch { /* use defaults */ }

        try {
          const expRes = await fetch("/api/finance/expenses")
          if (expRes.ok) {
            const expJson = await expRes.json()
            if (expJson.breakdown) setExpenseBreakdown(expJson.breakdown)
          }
        } catch { /* use defaults */ }

        try {
          const pspRes = await fetch("/api/finance/psp")
          if (pspRes.ok) {
            const pspJson = await pspRes.json()
            if (pspJson.distribution) setPspDistribution(pspJson.distribution)
          }
        } catch { /* use defaults */ }

        try {
          const occRes = await fetch("/api/finance/occupancy-trend")
          if (occRes.ok) {
            const occJson = await occRes.json()
            if (occJson.trend) setOccupancyTrend(occJson.trend)
          }
        } catch { /* use defaults */ }

      } catch {
        // API unavailable
      }
    }

    fetchFinanceData()
  }, [period])

  // Set default tier to bronze on login
  useEffect(() => {
    setCurrentTier("bronze")
  }, [])

  // Derived computed values
  const occupancyRadial = summary
    ? [{ name: "Occupied", value: summary.occupancyRate, fill: "hsl(168, 71%, 39%)" }]
    : []

  const reconMatchRate = reconStats.totalProcessed > 0
    ? Math.round((reconStats.autoMatched / reconStats.totalProcessed) * 100)
    : 0

  const efdComplianceRate = efd.total > 0
    ? Math.round((efd.issued / efd.total) * 100)
    : 0

  const totalArrearsAll = Object.values(arrearsBuckets).reduce((sum, b) => sum + Number(b.amount), 0)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const summaryRes = await fetch("/api/finance/summary")
      if (summaryRes.ok) {
        const summaryJson = await summaryRes.json()
        setSummary(summaryJson.summary)
      }
    } catch { /* ignore */ }
    setRefreshing(false)
  }, [])

  const displayCashCollectedAllTime = cashCollectedAllTime > 0 ? cashCollectedAllTime : (summary?.cashCollected || 0)

  // Translated payment status names
  const getPaymentStatusName = (name: string) => {
    if (language === "sw") {
      switch (name) {
        case "On Time": return t.onTime
        case "Late": return t.late
        case "Partial": return t.partial
        case "Unpaid": return t.unpaid
        default: return name
      }
    }
    return name
  }

  if (!summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/[0.06]">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">{t.loadingFinancialDashboard}</p>
            <p className="text-xs text-muted-foreground mt-1.5">{t.fetchingPortfolioData}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1360px] px-5 py-10 space-y-7">

        {/* ──────────────────────────────────────────────────────────
            HEADER
        ────────────────────────────────────────────────────────── */}
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/[0.06]">
                <BarChart3 className="h-5.5 w-5.5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground text-balance">{t.financialDashboard}</h1>
                <p className="text-[13px] text-muted-foreground mt-0.5">{t.financialDashboardDesc}</p>
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
          
          {/* ─── TIER SWITCHER ─────────────────────────────────────── */}
          <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
            <CardContent className="py-5 px-6">
              <TierSwitcher currentTier={currentTier} onTierChange={setCurrentTier} language={language} />
            </CardContent>
          </Card>
        </header>

        {/* ──────────────────────────────────────────────────────────
            MINI STATS BAR
        ────────────────────────────────────────────────────────── */}
        <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
          <CardContent className="py-5 px-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-3 lg:grid-cols-6">
              <MiniStat label={t.cashThisMonth} value={formatCurrencyFull(cashCollectedThisMonth > 0 ? cashCollectedThisMonth : summary.cashCollected)} icon={Wallet} />
              <MiniStat label={t.cashAllTime} value={formatCurrencyFull(displayCashCollectedAllTime)} icon={DollarSign} />
              <MiniStat label={t.thisMonthExpenses} value={formatCurrencyFull(monthlyExpenseTotal)} icon={Receipt} />
              <MiniStat label={t.properties} value={`${summary.totalProperties}`} icon={Building2} />
              <MiniStat label={t.activeTenants} value={`${summary.totalTenants}`} icon={Users} />
              <MiniStat label={t.totalExpenses} value={`${formatCurrency(summary.totalExpenses)} TZS`} icon={Receipt} />
            </div>
          </CardContent>
        </Card>

        {/* ──────────────────────────────────────────────────────────
            CASH COLLECTED FILTER CARD
        ────────────────────────────────────────────────────────── */}
        <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
          <SectionHeader icon={Filter} title={t.cashCollectedSummary} description={t.cashCollectedSummaryDesc} />
          <CardContent className="px-6 pb-6">
            {/* Date range filters */}
            <div className="flex flex-wrap items-end gap-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.fromDate}</Label>
                <Input
                  type="date"
                  value={cashFromDate}
                  onChange={(e) => setCashFromDate(e.target.value)}
                  className="w-[170px] rounded-xl text-sm h-10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.toDate}</Label>
                <Input
                  type="date"
                  value={cashToDate}
                  onChange={(e) => setCashToDate(e.target.value)}
                  className="w-[170px] rounded-xl text-sm h-10"
                />
              </div>
              {(cashFromDate || cashToDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs text-muted-foreground h-10"
                  onClick={() => { setCashFromDate(""); setCashToDate("") }}
                >
                  {t.clearFilter}
                </Button>
              )}
            </div>

            {/* Results grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {/* This Month */}
              <div className="rounded-2xl border border-border/40 p-5 bg-muted/[0.15]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted">
                    <CalendarDays className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70">{t.thisMonth}</span>
                </div>
                <div className="text-xl font-extrabold text-foreground tabular-nums font-mono leading-none">
                  {formatCurrencyFull(cashCollectedThisMonth > 0 ? cashCollectedThisMonth : summary.cashCollected)}
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-2">
                  {new Date().toLocaleDateString(language === "sw" ? "sw-TZ" : "en-GB", { month: "long", year: "numeric" })}
                </p>
              </div>

              {/* All-Time */}
              <div className="rounded-2xl border border-border/40 p-5 bg-muted/[0.15]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted">
                    <Wallet className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70">{t.allTimeTotal}</span>
                </div>
                <div className="text-xl font-extrabold text-foreground tabular-nums font-mono leading-none">
                  {formatCurrencyFull(displayCashCollectedAllTime)}
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-2">
                  {t.sinceFirstTransaction}
                </p>
              </div>

              {/* Filtered Period */}
              <div className={`rounded-2xl border p-5 transition-all duration-300 ${cashCollectedFiltered !== null ? "border-primary/20 bg-primary/[0.04] shadow-[0_0_0_1px_rgba(0,0,0,0.02)]" : "border-border/40 bg-muted/[0.15]"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${cashCollectedFiltered !== null ? "bg-primary/10" : "bg-muted"}`}>
                    <Filter className={`h-3 w-3 ${cashCollectedFiltered !== null ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70">{t.filteredPeriod}</span>
                </div>
                {cashCollectedFiltered !== null ? (
                  <>
                    <div className="text-xl font-extrabold text-foreground tabular-nums font-mono leading-none">
                      {formatCurrencyFull(cashCollectedFiltered)}
                    </div>
                    <p className="text-[11px] text-muted-foreground/70 mt-2">{cashFilteredLabel}</p>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-extrabold text-muted-foreground/25 tabular-nums font-mono leading-none">--</div>
                    <p className="text-[11px] text-muted-foreground/50 mt-2">{t.selectDatesToFilter}</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ──────────────────────────────────────────────────────────
            KPI CARDS
        ────────────────────────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title={t.collectionRate}
            value={`${summary.collectionRate}%`}
            subtitle={`${formatCurrency(summary.rentDue)} TZS ${t.rentDue}`}
            delta={summary.collectionRateDelta}
            icon={TrendingUp}
            trend="up"
            accentColor="hsl(199, 89%, 38%)"
          />
          <KPICard
            title={t.totalArrears}
            value={`${formatCurrency(summary.totalArrears)} TZS`}
            subtitle={t.outstandingBalances}
            delta={summary.arrearsDelta}
            icon={AlertTriangle}
            trend="down"
            accentColor="hsl(0, 72%, 51%)"
          />
          <KPICard
            title={t.occupancyRate}
            value={`${summary.occupancyRate}%`}
            subtitle={`${summary.occupiedUnits} ${t.ofUnits} ${summary.totalUnits} ${t.units}`}
            icon={Building2}
            accentColor="hsl(168, 71%, 39%)"
          />
          <KPICard
            title={t.netOperatingIncome}
            value={`${formatCurrency(summary.noi)} TZS`}
            subtitle={t.cashBasisNOI}
            delta={summary.noiDelta}
            icon={DollarSign}
            trend="up"
            accentColor="hsl(38, 92%, 50%)"
          />
        </div>

        {/* ──────────────────────────────────────────────────────────
            CHART ROW 1: Cashflow + Payment Status (Silver+)
        ────────────────────────────────────────────────────────── */}
        <LockedFeatureOverlay 
          requiredTier="silver" 
          currentTier={currentTier} 
          featureName={t.plReportsCashFlow}
          language={language}
        >
        <div className="grid gap-5 lg:grid-cols-5">
          {/* Cash Flow Bar Chart */}
          <Card className="lg:col-span-3 border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
            <SectionHeader icon={BarChart3} title={t.cashFlowAnalysis} description={t.revenueVsExpenses} />
            <CardContent className="px-6 pb-6">
              <ChartContainer
                config={{
                  revenue: { label: t.revenue, color: "hsl(168, 71%, 39%)" },
                  expense: { label: t.expenses, color: "hsl(0, 72%, 51%)" },
                }}
                className="h-[260px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashflow} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}M`} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const month = payload[0].payload.month || payload[0].payload.period
                        const expense = payload[0].payload.expense
                        return (
                          <div className="rounded-xl border bg-card p-3 shadow-lg text-xs">
                            <div className="font-bold text-foreground mb-1.5">{month}</div>
                            <div className="text-muted-foreground">{t.revenue}: <span className="font-semibold text-foreground">{formatCurrencyFull(payload[0].payload.revenue)}</span></div>
                            <div className="text-muted-foreground mt-0.5">{t.expenses}: <span className="font-semibold text-foreground">{formatCurrencyFull(expense)}</span></div>
                          </div>
                        )
                      }
                      return null
                    }} />
                    <Bar dataKey="revenue" name={t.revenue} fill="hsl(168, 71%, 39%)" radius={[6, 6, 0, 0]} barSize={20} />
                    <Bar dataKey="expense" name={t.expenses} fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <InsightBox>
                {(() => {
                  if (!cashflow || cashflow.length === 0) return t.noCashflowData;
                  const first = cashflow[0];
                  const last = cashflow[cashflow.length - 1];
                  const revenueGrowth = first.revenue && last.revenue ? Math.round(((last.revenue - first.revenue) / first.revenue) * 100) : 0;
                  const expenseSpike = cashflow.reduce((max, cur) => cur.expense > max.expense ? cur : max, first);
                  const avgMargin = cashflow.length > 0 ? Math.round(cashflow.reduce((sum, cur) => sum + ((cur.revenue - cur.expense) / (cur.revenue || 1)), 0) / cashflow.length * 100) : 0;
                  return `${t.revenueGrew} ${revenueGrowth}% ${t.from} ${first.month} ${t.to} ${last.month}. ${expenseSpike.month} ${t.expensesSpiked} ${t.netCashflowMargin} ${avgMargin}%.`;
                })()}
              </InsightBox>
            </CardContent>
          </Card>

          {/* Payment Status Donut */}
          <Card className="lg:col-span-2 border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
            <SectionHeader icon={PieChartIcon} title={t.paymentStatus} description={t.paymentStatusDesc} />
            <CardContent className="px-6 pb-6">
              {paymentStatusData.length > 0 ? (
                <>
                  <div className="flex items-center justify-center" style={{ height: 210 }}>
                    <PieChart width={210} height={210}>
                      <Pie
                        data={paymentStatusData}
                        cx={105}
                        cy={105}
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="hsl(var(--card))"
                        strokeWidth={3}
                      >
                        {paymentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [`${value}%`, getPaymentStatusName(name)]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "12px",
                          color: "hsl(var(--card-foreground))",
                          fontSize: "12px",
                          padding: "8px 14px",
                        }}
                      />
                    </PieChart>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4">
                    {paymentStatusData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-2 text-xs">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="text-muted-foreground">{getPaymentStatusName(entry.name)}</span>
                        <span className="font-bold text-foreground tabular-nums">{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                    <PieChartIcon className="h-5 w-5 opacity-40" />
                  </div>
                  <p className="text-sm font-medium">{t.noPaymentData}</p>
                </div>
              )}
              <InsightBox>
                {(() => {
                  if (!paymentStatusData || paymentStatusData.length === 0) return t.noPaymentStatusData;
                  const onTime = paymentStatusData.find(p => p.name === "On Time")?.value || 0;
                  const unpaid = paymentStatusData.find(p => p.name === "Unpaid")?.value || 0;
                  const late = paymentStatusData.find(p => p.name === "Late")?.value || 0;
                  return `${onTime}% ${t.onTimePayments} ${unpaid}% ${t.unpaidNeedsAttention} ${late}%${t.throughReminders}`;
                })()}
              </InsightBox>
            </CardContent>
          </Card>
        </div>
        </LockedFeatureOverlay>

        {/* ──────────────────────────────────────────────────────────
            CHART ROW 2: Collection Trend + Occupancy + NOI (Silver+)
        ────────────────────────────────────────────────────────── */}
        <LockedFeatureOverlay 
          requiredTier="silver" 
          currentTier={currentTier} 
          featureName={t.vacancyTrackingTrend}
          language={language}
        >
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Collection Rate Trend */}
          <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
            <SectionHeader icon={TrendingUp} title={t.collectionRateTrend} description={t.collectionRateTrendDesc} />
            <CardContent className="px-6 pb-6">
              <ChartContainer
                config={{ rate: { label: t.collectionRate, color: "hsl(199, 89%, 38%)" } }}
                className="h-[180px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={collectionTrend} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
                    <defs>
                      <linearGradient id="collGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(199, 89%, 38%)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="hsl(199, 89%, 38%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis domain={[70, 100]} tickFormatter={(v: number) => `${v}%`} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="rate" stroke="hsl(199, 89%, 38%)" fill="url(#collGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              <InsightBox>
                {(() => {
                  if (!collectionTrend || collectionTrend.length < 2) return t.noCollectionTrendData;
                  const first = collectionTrend[0];
                  const last = collectionTrend[collectionTrend.length - 1];
                  const gain = last.rate - first.rate;
                  const trajectory = gain > 0 ? t.upward : t.downward;
                  return `${t.collectionRateImproved} ${first.rate}% ${t.to} ${last.rate}% — ${t.aPointGain} ${collectionTrend.length} ${t.months}. ${t.consistent} ${trajectory} ${t.trajectorySuggests}`;
                })()}
              </InsightBox>
            </CardContent>
          </Card>

          {/* Occupancy Radial */}
          <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
            <SectionHeader icon={Home} title={t.occupancyOverview} description={t.occupancyOverviewDesc} />
            <CardContent className="flex flex-col items-center px-6 pb-6">
              <ChartContainer
                config={{ occupied: { label: t.occupied, color: "hsl(168, 71%, 39%)" } }}
                className="h-[180px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={16} data={occupancyRadial} startAngle={180} endAngle={0}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="hsl(168, 71%, 39%)" background={{ fill: "hsl(var(--muted))" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="text-center -mt-5">
                <div className="text-[32px] font-extrabold text-foreground tabular-nums leading-none">{summary.occupancyRate}%</div>
                <div className="text-[11px] text-muted-foreground mt-1.5">{summary.occupiedUnits} {t.occupied} / {summary.totalUnits} {t.total}</div>
              </div>
              <InsightBox>
                {(() => {
                  if (!summary) return t.noOccupancyData;
                  const industryAvg = 85;
                  const vacant = summary.totalUnits - summary.occupiedUnits;
                  const potentialRevenue = vacant * ((summary as FinanceSummary & { avgRent?: number }).avgRent || 0);
                  return `${summary.occupancyRate}% ${t.occupancyIs} ${summary.occupancyRate > industryAvg ? t.aboveIndustry : t.belowIndustry} ${t.industryAverage} (${industryAvg}%). ${vacant} ${t.vacantUnits} ${formatCurrencyFull(potentialRevenue)} ${t.potentialRevenue}`;
                })()}
              </InsightBox>
            </CardContent>
          </Card>

          {/* NOI Trend */}
          <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
            <SectionHeader icon={DollarSign} title={t.noiTrend} description={t.noiTrendDesc} />
            <CardContent className="px-6 pb-6">
              <ChartContainer
                config={{ noi: { label: "NOI", color: "hsl(168, 71%, 39%)" } }}
                className="h-[180px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyNOI} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
                    <defs>
                      <linearGradient id="noiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(168, 71%, 39%)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="hsl(168, 71%, 39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}M`} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="noi" stroke="hsl(168, 71%, 39%)" fill="url(#noiGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              <InsightBox>
                {(() => {
                  if (!monthlyNOI || monthlyNOI.length === 0) return t.noNOIData;
                  const peak = monthlyNOI.reduce((max, cur) => Number(cur.noi) > Number(max.noi) ? cur : max, monthlyNOI[0]);
                  const drop = monthlyNOI.reduce((min, cur) => Number(cur.noi) < Number(min.noi) ? cur : min, monthlyNOI[0]);
                  const avg = monthlyNOI.reduce((sum, cur) => sum + Number(cur.noi), 0) / monthlyNOI.length;
                  const peakIdx = monthlyNOI.findIndex(m => m.month === peak.month);
                  const dropIdx = monthlyNOI.findIndex(m => m.month === drop.month);
                  let dropMsg = "";
                  if (dropIdx > peakIdx && peakIdx !== -1 && dropIdx !== -1) {
                    dropMsg = `${t.thenDroppedTo} ${Number(drop.noi).toLocaleString()} TZS ${t.in} ${drop.month} ${t.dueToExpenseSpike}`;
                  }
                  const cashflowMsg = avg > 0 ? t.strongPositiveCashflow : t.cashflowIsNegative;
                  return `${t.noiPeakedAt} ${Number(peak.noi).toLocaleString()} TZS ${t.in} ${peak.month} ${dropMsg} ${t.ytdAverage} ${avg.toLocaleString(undefined, { maximumFractionDigits: 0 })} TZS${t.perMonth} ${cashflowMsg}`;
                })()}
              </InsightBox>
            </CardContent>
          </Card>
        </div>
        </LockedFeatureOverlay>

        {/* ──────────────────────────────────────────────────────────
            CHART ROW 3: Arrears Aging
        ────────────────────────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
            <SectionHeader icon={AlertTriangle} title={t.arrearsAging} description={t.arrearsAgingDesc} />
            <CardContent className="px-6 pb-6">
              <ChartContainer
                config={{ amount: { label: t.totalArrears, color: "hsl(0, 72%, 51%)" } }}
                className="h-[220px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(arrearsBuckets).map(([bucket, data]) => ({
                    bucket,
                    amount: Number(data.amount),
                    fill:
                      bucket === "0-30" ? "hsl(168, 71%, 39%)" :
                      bucket === "31-60" ? "hsl(38, 92%, 50%)" :
                      bucket === "61-90" ? "hsl(25, 95%, 53%)" :
                      bucket === "90+" ? "hsl(0, 72%, 51%)" : "hsl(var(--muted-foreground))"
                  }))} margin={{ top: 8, right: 12, left: 12, bottom: 8 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis type="number" tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis type="category" dataKey="bucket" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={50} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={20}>
                      {Object.entries(arrearsBuckets).map(([bucket], index) => (
                        <Cell key={`arr-${index}`} fill={
                          bucket === "0-30" ? "hsl(168, 71%, 39%)" :
                          bucket === "31-60" ? "hsl(38, 92%, 50%)" :
                          bucket === "61-90" ? "hsl(25, 95%, 53%)" :
                          bucket === "90+" ? "hsl(0, 72%, 51%)" : "hsl(var(--muted-foreground))"
                        } />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <InsightBox>
                {(() => {
                  if (!arrearsBuckets || Object.keys(arrearsBuckets).length === 0) return t.noArrearsData;
                  const total = Object.values(arrearsBuckets).reduce((sum, b) => sum + Number(b.amount), 0);
                  const bucket = arrearsBuckets["0-30"] || { amount: 0, count: 0 };
                  const bucketPct = total > 0 ? Math.round((Number(bucket.amount) / total) * 100) : 0;
                  const focus = arrearsBuckets["90+"] || { amount: 0, count: 0 };
                  return `${bucketPct}% ${t.ofArrears} (${formatCurrencyFull(bucket.amount)}) ${t.are030Days} (${formatCurrencyFull(focus.amount)}, ${focus.count} ${t.tenantsToPrevent}`;
                })()}
              </InsightBox>
            </CardContent>
          </Card>
        </div>

        {/* ──────────────────────────────────────────────────────────
            CHART ROW 4: Occupancy Trend + Reconciliation + EFD (Gold)
        ────────────────────────────────────────────────────────── */}
        <LockedFeatureOverlay 
          requiredTier="gold" 
          currentTier={currentTier} 
          featureName={t.trustScoreAnalytics}
          language={language}
        >
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Occupancy Trend */}
          <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
            <SectionHeader icon={Activity} title={t.occupancyTrend} description={t.occupancyTrendDesc} />
            <CardContent className="px-6 pb-6">
              <ChartContainer
                config={{ rate: { label: t.occupancyRate, color: "hsl(168, 71%, 39%)" } }}
                className="h-[180px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={occupancyTrend} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
                    <defs>
                      <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(168, 71%, 39%)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="hsl(168, 71%, 39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis domain={[80, 100]} tickFormatter={(v: number) => `${v}%`} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="rate" stroke="hsl(168, 71%, 39%)" fill="url(#occGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
              <InsightBox>
                {(() => {
                  if (!occupancyTrend || occupancyTrend.length < 2) return t.noOccupancyTrendData;
                  const first = occupancyTrend[0];
                  const last = occupancyTrend[occupancyTrend.length - 1];
                  const rise = last.rate - first.rate;
                  return `${t.occupancySteadily} ${rise > 0 ? t.rose : t.fell} ${t.from} ${first.rate}% ${t.to} ${last.rate}%. ${t.marketplaceStrategy}`;
                })()}
              </InsightBox>
            </CardContent>
          </Card>

          {/* Reconciliation Pipeline */}
          <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
            <CardHeader className="pb-4 pt-5 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/[0.06]">
                    <Layers className="h-4 w-4 text-primary/80" />
                  </div>
                  <div>
                    <CardTitle className="text-[13px] font-bold tracking-tight">{t.paymentReconciliation}</CardTitle>
                    <CardDescription className="text-[11px] mt-0.5">{t.pspWebhooks}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] font-bold rounded-full px-2.5">{reconMatchRate}% {t.auto}</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: t.totalProcessed, value: reconStats.totalProcessed, color: "text-foreground" },
                  { label: t.autoMatched, value: reconStats.autoMatched, color: "text-[hsl(168,71%,39%)]" },
                  { label: t.manualReview, value: reconStats.manualReview, color: "text-[hsl(38,92%,50%)]" },
                  { label: t.unmatched, value: reconStats.unmatched, color: "text-destructive" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/30 p-4 bg-muted/[0.12]">
                    <div className={`text-xl font-extrabold tabular-nums ${stat.color}`}>{stat.value}</div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-muted/50">
                {reconStats.totalProcessed > 0 && (
                  <>
                    <div className="bg-[hsl(168,71%,39%)] h-full transition-all duration-500" style={{ width: `${(reconStats.autoMatched / reconStats.totalProcessed) * 100}%` }} />
                    <div className="bg-[hsl(38,92%,50%)] h-full transition-all duration-500" style={{ width: `${(reconStats.manualReview / reconStats.totalProcessed) * 100}%` }} />
                    <div className="bg-destructive h-full transition-all duration-500" style={{ width: `${(reconStats.unmatched / reconStats.totalProcessed) * 100}%` }} />
                  </>
                )}
              </div>
              <div className="flex items-center gap-5 text-[11px] text-muted-foreground mt-3">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[hsl(168,71%,39%)]" /> {t.auto}</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[hsl(38,92%,50%)]" /> {t.manualReview}</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> {t.unmatched}</span>
              </div>
              <InsightBox>
                {(() => {
                  if (!reconStats || reconStats.totalProcessed === 0) return t.noReconciliationData;
                  const matchRate = Math.round((reconStats.autoMatched / reconStats.totalProcessed) * 100);
                  return `${matchRate}% ${t.autoMatchRate} ${reconStats.unmatched} ${t.unmatchedPayments}`;
                })()}
              </InsightBox>
            </CardContent>
          </Card>

          {/* EFD Tax Compliance */}
          <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
            <SectionHeader icon={Receipt} title={t.efdTaxCompliance} description={t.efdTaxComplianceDesc} />
            <CardContent className="px-6 pb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-semibold text-foreground">{t.complianceRate}</span>
                <span className="text-[13px] font-extrabold text-foreground tabular-nums">{efdComplianceRate}%</span>
              </div>
              <Progress value={efdComplianceRate} className="h-2.5 mb-6 rounded-full" />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: CheckCircle2, value: efd.issued, label: t.issued, color: "text-[hsl(168,71%,39%)]" },
                  { icon: Clock, value: efd.pending, label: t.pending, color: "text-[hsl(38,92%,50%)]" },
                  { icon: XCircle, value: efd.failed, label: t.failed, color: "text-destructive" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2 rounded-2xl border border-border/30 p-4 bg-muted/[0.12]">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <div className="text-xl font-extrabold text-foreground tabular-nums">{item.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{item.label}</div>
                  </div>
                ))}
              </div>
              <InsightBox>
                {(() => {
                  if (!efd || efd.total === 0) return t.noEFDData;
                  return `${efdComplianceRate}% ${t.efdCompliance} ${efd.pending} ${t.pendingReceipts} ${efd.failed} ${t.failedReceipts}`;
                })()}
              </InsightBox>
            </CardContent>
          </Card>
        </div>
        </LockedFeatureOverlay>

        {/* ──────────────────────────────────────────────────────────
            DRILL-DOWN TABLES (Silver+ for Multi-Property Management)
        ────────────────────────────────────────────────────────── */}
        <LockedFeatureOverlay 
          requiredTier="silver" 
          currentTier={currentTier} 
          featureName={t.multiPropertyManagement}
          language={language}
        >
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="mb-6 bg-muted/30 rounded-2xl p-1.5 h-auto flex-wrap">
            <TabsTrigger value="properties" className="rounded-xl text-xs font-bold px-4 py-2 data-[state=active]:shadow-sm">{t.propertyPerformance}</TabsTrigger>
            <TabsTrigger value="noi" className="rounded-xl text-xs font-bold px-4 py-2 data-[state=active]:shadow-sm">{t.allTimeNOI}</TabsTrigger>
            <TabsTrigger value="arrears" className="rounded-xl text-xs font-bold px-4 py-2 data-[state=active]:shadow-sm">{t.arrearsAgingTab}</TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-xl text-xs font-bold px-4 py-2 data-[state=active]:shadow-sm">{t.ledgerTransactions}</TabsTrigger>
          </TabsList>

          {/* Property Performance */}
          <TabsContent value="properties">
            <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
              <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[13px] font-bold tracking-tight">{t.propertyPerformanceDrillDown}</CardTitle>
                    <CardDescription className="text-[11px] mt-0.5">{t.propertyPerformanceDrillDownDesc}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px] font-bold">{propertyBreakdown.length} {t.properties}</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="overflow-x-auto rounded-2xl border border-border/30">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.property}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.status}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.tenant}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.monthlyRent}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.collected}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.pendingAmount}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.expensesCol}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.noi}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertyBreakdown.map((property) => {
                        const allTimeExpenses = propertyExpensesMap[property.id] || property.propertyExpenses
                        const realNoi = property.collected - allTimeExpenses
                        const statusText = property.status === "occupied" ? (language === "sw" ? "imekaaliwa" : "occupied") : (language === "sw" ? "tupu" : "vacant")
                        return (
                          <TableRow key={property.id} className="hover:bg-muted/[0.08] transition-colors">
                            <TableCell className="py-3.5">
                              <div>
                                <p className="font-semibold text-foreground text-[13px]">{property.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{property.address}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={property.status === "occupied" ? "default" : "secondary"} className={`rounded-full text-[10px] font-bold ${property.status === "occupied" ? "bg-[hsl(168,71%,39%)] text-[hsl(0,0%,100%)]" : ""}`}>
                                {statusText}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[13px] text-foreground">
                              {property.status === "occupied" && property.tenantName ? property.tenantName : <span className="text-muted-foreground">-</span>}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[13px] tabular-nums">{formatCurrencyFull(property.monthlyRent)}</TableCell>
                            <TableCell className="text-right font-mono text-[13px] tabular-nums text-[hsl(168,71%,39%)] font-semibold">{formatCurrencyFull(property.collected)}</TableCell>
                            <TableCell className="text-right font-mono text-[13px] tabular-nums text-[hsl(38,92%,50%)]">{formatCurrencyFull(property.pending)}</TableCell>
                            <TableCell className="text-right font-mono text-[13px] tabular-nums text-destructive">{formatCurrencyFull(allTimeExpenses)}</TableCell>
                            <TableCell className={`text-right font-mono text-[13px] font-bold tabular-nums ${realNoi >= 0 ? "text-[hsl(168,71%,39%)]" : "text-destructive"}`}>
                              {realNoi < 0 ? "-" : ""}{formatCurrencyFull(Math.abs(realNoi))}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
                <InsightBox>
                  {(() => {
                    if (!propertyBreakdown || propertyBreakdown.length === 0) return t.noPropertyData;
                    const negativeNOI = propertyBreakdown.filter(p => p.noi < 0);
                    if (negativeNOI.length === 0) return t.allPropertiesPositive;
                    const vacant = negativeNOI.filter(p => p.status === "vacant");
                    const nonPaying = negativeNOI.filter(p => p.status === "occupied" && !p.collected);
                    let msg = "";
                    if (vacant.length > 0) msg += `${t.prioritizeFilling} ${vacant.map(p => p.title).join(", ")} ${t.vacantNegativeNOI} `;
                    if (nonPaying.length > 0) msg += `${t.escalateCollection} ${nonPaying.map(p => p.title).join(", ")} ${t.occupiedNonPaying}`;
                    if (!msg) msg = t.somePropertiesNegative;
                    return msg;
                  })()}
                </InsightBox>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ──── ALL-TIME NOI PER PROPERTY TAB ──── */}
          <TabsContent value="noi">
            <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
              <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[13px] font-bold tracking-tight">{t.allTimeNOIPerProperty}</CardTitle>
                    <CardDescription className="text-[11px] mt-0.5">{t.allTimeNOIPerPropertyDesc}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px] font-bold">{propertyAllTimeTotals.length} {t.properties}</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="overflow-x-auto rounded-2xl border border-border/30">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.property}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.period}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.totalCollected}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.totalExpensesCol}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.allTimeNOICol}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {propertyAllTimeTotals.map((prop) => {
                        const noi = prop.totalCollected - prop.totalExpenses
                        return (
                          <TableRow key={prop.propertyId} className="hover:bg-muted/[0.08] transition-colors">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/[0.05]">
                                  <Building2 className="h-4 w-4 text-primary/70" />
                                </div>
                                <span className="text-[13px] font-semibold text-foreground">{prop.propertyTitle}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-[11px] text-muted-foreground whitespace-nowrap py-4">
                              {new Date(prop.firstDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                              {" - "}
                              {new Date(prop.lastDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[13px] font-bold whitespace-nowrap py-4 tabular-nums">
                              <span className="text-[hsl(168,71%,39%)]">{formatCurrencyFull(prop.totalCollected)}</span>
                            </TableCell>
                            <TableCell className="text-right font-mono text-[13px] font-bold whitespace-nowrap py-4 tabular-nums">
                              <span className="text-destructive">{formatCurrencyFull(prop.totalExpenses)}</span>
                            </TableCell>
                            <TableCell className="text-right font-mono text-[13px] font-bold whitespace-nowrap py-4 tabular-nums">
                              <span className={noi >= 0 ? "text-[hsl(168,71%,39%)]" : "text-destructive"}>
                                {noi >= 0 ? "" : "-"}{formatCurrencyFull(Math.abs(noi))}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="bg-muted/30 font-semibold hover:bg-muted/30">
                        <TableCell colSpan={2} className="text-[10px] uppercase tracking-[0.1em] font-bold text-foreground py-4">
                          {t.grandTotal} ({propertyAllTimeTotals.length} {t.properties})
                        </TableCell>
                        <TableCell className="text-right font-mono text-[13px] font-bold text-[hsl(168,71%,39%)] tabular-nums py-4">
                          {formatCurrencyFull(propertyAllTimeTotals.reduce((s, p) => s + p.totalCollected, 0))}
                        </TableCell>
                        <TableCell className="text-right font-mono text-[13px] font-bold text-destructive tabular-nums py-4">
                          {formatCurrencyFull(propertyAllTimeTotals.reduce((s, p) => s + p.totalExpenses, 0))}
                        </TableCell>
                        {(() => {
                          const grandNoi = propertyAllTimeTotals.reduce((s, p) => s + p.totalCollected, 0) - propertyAllTimeTotals.reduce((s, p) => s + p.totalExpenses, 0)
                          return (
                            <TableCell className="text-right font-mono text-[13px] font-bold tabular-nums py-4">
                              <span className={grandNoi >= 0 ? "text-[hsl(168,71%,39%)]" : "text-destructive"}>
                                {grandNoi >= 0 ? "" : "-"}{formatCurrencyFull(Math.abs(grandNoi))}
                              </span>
                            </TableCell>
                          )
                        })()}
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
                <InsightBox>
                  {t.allTimeNOIInsight}
                </InsightBox>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Arrears Aging */}
          <TabsContent value="arrears">
            <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
              <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[13px] font-bold tracking-tight">{t.arrearsAgingReport}</CardTitle>
                    <CardDescription className="text-[11px] mt-0.5">{t.arrearsAgingReportDesc}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.totalOutstanding}</div>
                    <div className="text-lg font-extrabold text-destructive tabular-nums mt-0.5">{formatCurrencyFull(totalArrearsAll)}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 mb-4">
                  {[ 
                    { key: "0-30", label: t.days030, color: "hsl(168,71%,39%)" },
                    { key: "31-60", label: t.days3160, color: "hsl(38,92%,50%)" },
                    { key: "61-90", label: t.days6190, color: "hsl(25,95%,53%)" },
                    { key: "90+", label: t.days90Plus, color: "hsl(0,72%,51%)" },
                  ].map((bucket) => (
                    <div key={bucket.key} className="rounded-xl border border-border/30 px-3 py-2 relative overflow-hidden bg-muted/[0.03] flex flex-col items-center justify-center min-h-[70px]">
                      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" style={{ backgroundColor: bucket.color }} />
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mt-1 mb-1">{bucket.label}</p>
                      <p className="text-base font-extrabold text-foreground tabular-nums mb-0.5">{formatCurrencyFull(arrearsBuckets[bucket.key]?.amount ?? 0)}</p>
                      <p className="text-[10px] text-muted-foreground">{arrearsBuckets[bucket.key]?.count ?? 0} {t.tenants}</p>
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto rounded-2xl border border-border/30">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.tenant}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.property}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.contact}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.amountDue}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.daysOverdue}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(arrearsBuckets).flatMap(([, data]) =>
                        data.tenants.map((tenant) => (
                          <TableRow key={tenant.id} className="hover:bg-muted/[0.08] transition-colors">
                            <TableCell className="font-semibold text-foreground text-[13px]">{tenant.tenantName}</TableCell>
                            <TableCell className="text-[13px] text-foreground">{tenant.propertyTitle}</TableCell>
                            <TableCell>
                              <div>
                                <p className="text-[13px] text-foreground">{tenant.tenantEmail}</p>
                                <p className="text-muted-foreground text-[11px] mt-0.5">{tenant.tenantPhone}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-[13px] font-bold text-destructive tabular-nums">
                              {formatCurrencyFull(tenant.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant={tenant.daysOverdue <= 30 ? "outline" : tenant.daysOverdue <= 60 ? "secondary" : "destructive"} className="rounded-full text-[10px] font-bold">
                                {tenant.daysOverdue} {t.days}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl text-[11px] h-8">
                                <Send className="h-3.5 w-3.5" />
                                {t.remind}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <InsightBox>
                  {(() => {
                    if (!arrearsBuckets || Object.keys(arrearsBuckets).length === 0) return t.noArrearsData;
                    const thirtyPlus = arrearsBuckets["31-60"]?.count || 0;
                    const sixtyPlus = arrearsBuckets["61-90"]?.count || 0;
                    const ninetyPlus = arrearsBuckets["90+"]?.count || 0;
                    const urgentCount = ninetyPlus;
                    return `${urgentCount} ${t.tenantsAre90Plus} ${thirtyPlus + sixtyPlus} ${t.moreAre3190}`;
                  })()}
                </InsightBox>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ledger Transactions */}
          <TabsContent value="transactions">
            <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
              <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[13px] font-bold tracking-tight">{t.ledgerTransactionsTitle}</CardTitle>
                    <CardDescription className="text-[11px] mt-0.5">{t.ledgerTransactionsDesc}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px] font-bold">{transactions.length} {t.transactions}</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="overflow-x-auto rounded-2xl border border-border/30">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.date}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.dueDate}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.tenant}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.property}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.psp}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.method}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.amount}</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.fee}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.confidence}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.efd}</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t.status}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.slice(0, 15).map((tx) => (
                        <TableRow key={tx.id} className="hover:bg-muted/[0.08] transition-colors">
                          <TableCell className="whitespace-nowrap">
                            {tx.paidDate
                              ? new Date(tx.paidDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                              : <span className="text-muted-foreground">-</span>}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-[13px]">
                            {new Date(tx.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </TableCell>
                          <TableCell className="font-semibold text-foreground text-[13px]">{tx.tenantName}</TableCell>
                          <TableCell className="text-[13px] text-foreground">{tx.propertyTitle}</TableCell>
                          <TableCell>
                            {tx.psp ? (
                              <Badge variant="outline" className="text-[10px] rounded-full font-semibold">{tx.psp}</Badge>
                            ) : <span className="text-muted-foreground text-[11px]">-</span>}
                          </TableCell>
                          <TableCell className="capitalize text-[13px] text-foreground">{tx.paymentMethod?.replace("_", " ") || <span className="text-muted-foreground">-</span>}</TableCell>
                          <TableCell className="text-right font-mono text-[13px] text-foreground tabular-nums font-semibold">{formatCurrencyFull(tx.amount)}</TableCell>
                          <TableCell className="text-right font-mono text-[13px] text-muted-foreground tabular-nums">{tx.fee > 0 ? formatCurrencyFull(tx.fee) : "-"}</TableCell>
                          <TableCell>
                            {tx.confidenceScore !== null ? (
                              <Badge variant={tx.confidenceScore >= 0.9 ? "default" : "secondary"} className={`rounded-full text-[10px] font-bold ${tx.confidenceScore >= 0.9 ? "bg-[hsl(168,71%,39%)] text-[hsl(0,0%,100%)]" : ""}`}>
                                {Math.round(tx.confidenceScore * 100)}%
                              </Badge>
                            ) : <span className="text-muted-foreground text-[11px]">-</span>}
                          </TableCell>
                          <TableCell>
                            {tx.efdStatus === "issued" ? (
                              <CheckCircle2 className="h-4 w-4 text-[hsl(168,71%,39%)]" />
                            ) : tx.efdStatus === "pending" ? (
                              <Clock className="h-4 w-4 text-[hsl(38,92%,50%)]" />
                            ) : (
                              <span className="text-muted-foreground text-[11px]">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={tx.status === "completed" ? "default" : tx.status === "pending" ? "secondary" : "destructive"}
                              className={`rounded-full text-[10px] font-bold ${tx.status === "completed" ? "bg-[hsl(168,71%,39%)] text-[hsl(0,0%,100%)]" : ""}`}
                            >
                              {tx.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <InsightBox>
                  {t.ledgerInsight}
                </InsightBox>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </LockedFeatureOverlay>

        {/* ──────────────────────────────────────────────────────────
            TRUSTSCORE PRIVACY NOTICE (Gold for TrustScore Analytics)
        ────────────────────────────────────────────────────────── */}
        <LockedFeatureOverlay 
          requiredTier="gold" 
          currentTier={currentTier} 
          featureName={t.trustScoreAnalyticsTrends}
          language={language}
        >
        <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl border-l-[3px] border-l-primary overflow-hidden">
          <CardContent className="py-5 px-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.06]">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-foreground">{t.privacyNoticeTrustScore}</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {t.privacyNoticeDesc}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </LockedFeatureOverlay>

        {/* ──────────────────────────────────────────────────────────
            REPORTS & ACTIONS (Gold for Custom Reporting)
        ────────────────────────────────────────────────────────── */}
        <LockedFeatureOverlay 
          requiredTier="gold" 
          currentTier={currentTier} 
          featureName={t.customReportingAPI}
          language={language}
        >
        <Card className="border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] rounded-2xl">
          <SectionHeader icon={FileText} title={t.reportsExportActions} description={t.reportsExportActionsDesc} />
          <CardContent className="px-6 pb-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2 rounded-xl h-10 text-[13px]" onClick={async () => {
                try {
                  const res = await fetch("/api/finance/rentroll", { method: "POST" })
                  if (!res.ok) throw new Error("Failed")
                  const blob = await res.blob()
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "rent-roll.pdf"
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  window.URL.revokeObjectURL(url)
                } catch { alert(t.failedDownloadRentRoll) }
              }}>
                <Download className="h-4 w-4" />
                {t.downloadRentRoll}
              </Button>
              <Button variant="outline" className="gap-2 rounded-xl h-10 text-[13px]" onClick={async () => {
                try {
                  const res = await fetch("/api/finance/pl-export", { method: "POST" })
                  if (!res.ok) throw new Error("Failed")
                  const blob = await res.blob()
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "pl-report.xlsx"
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  window.URL.revokeObjectURL(url)
                } catch { alert(t.failedDownloadPL) }
              }}>
                <Download className="h-4 w-4" />
                {t.exportPL}
              </Button>
              <Button variant="outline" className="gap-2 rounded-xl h-10 text-[13px]" onClick={async () => {
                try {
                  const res = await fetch("/api/finance/efd-report", { method: "POST" })
                  if (!res.ok) throw new Error("Failed")
                  const blob = await res.blob()
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "efd-compliance-report.pdf"
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                  window.URL.revokeObjectURL(url)
                } catch { alert(t.failedDownloadEFD) }
              }}>
                <Receipt className="h-4 w-4" />
                {t.efdComplianceReport}
              </Button>
              <Button className="gap-2 bg-primary text-primary-foreground rounded-xl h-10 text-[13px]" onClick={async () => {
                try {
                  const res = await fetch("/api/finance/arrears/remind", { method: "POST" })
                  const data = await res.json()
                  if (!data.success) throw new Error("Failed")
                  alert(`${t.sentRemindersTo} ${data.sent} ${t.tenantsWithArrears}`)
                } catch { alert(t.failedSendReminders) }
              }}>
                <Send className="h-4 w-4" />
                {t.sendArrearsReminders}
              </Button>
            </div>
          </CardContent>
        </Card>
        </LockedFeatureOverlay>

        {/* ──────────────────────────────────────────────────────────
            SUBSCRIPTION TIER FOOTER (Dynamic based on currentTier)
        ────────────────────────────────────────────────────────── */}
        {(() => {
          const config = TIER_CONFIG[currentTier]
          const tierName = language === "sw" ? config.nameSw : config.name
          const tierDescriptions: Record<SubscriptionTier, string> = {
            bronze: language === "sw" ? t.bronzeDesc : t.bronzeDesc,
            silver: language === "sw" ? t.silverDesc : t.silverDesc,
            gold: language === "sw" ? t.goldDesc : t.goldDesc
          }
          const tierHighlights: Record<SubscriptionTier, string[]> = {
            bronze: [t.rentCollection, t.paymentReminders, t.transactionHistory],
            silver: [t.plReports, t.multiProperty, t.whatsAppAlerts],
            gold: [t.fullDashboard, t.apiAccess, t.prioritySupport]
          }
          return (
            <Card className={`border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl ${config.bgColor} overflow-hidden`}>
              <CardContent className="py-6 px-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-3xl">
                      {config.icon}
                    </div>
                    <div>
                      <p className={`text-[13px] font-bold ${config.color}`}>{tierName} {t.landlordPlan} — {config.price}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{tierDescriptions[currentTier]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className={`flex items-center gap-5 text-[11px] ${config.color}`}>
                      {tierHighlights[currentTier].map((highlight) => (
                        <span key={highlight} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> {highlight}
                        </span>
                      ))}
                    </div>
                    {currentTier !== "gold" && (
                      <Button size="sm" className="gap-1.5 rounded-xl h-9 text-[12px] font-semibold">
                        {t.upgradePlan} <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                    {currentTier === "gold" && (
                      <Button variant="outline" size="sm" className="gap-1.5 rounded-xl h-9 text-[12px] font-semibold">
                        {t.managePlan} <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })()}

      </div>
    </div>
  )
}
