"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Share2,
  QrCode,
  Info,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Send,
  Bell,
  Settings,
  HelpCircle,
  FileText,
  CreditCard,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Star,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Copy,
  CheckCheck,
  Edit,
  Download,
  Printer,
  Home,
  Wallet,
  TrendingUp,
  Award,
  Calendar,
  Globe,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

/* ========================================== */
/* --- Translations for trust score page    */
/* ========================================== */
const translations = {
  en: {
    // Header
    myTrustScore: "MY TRUSTSCORE",
    
    // Navigation
    dashboard: "Dashboard",
    paymentHistory: "Payment History",
    benefits: "Benefits",
    profile: "Profile",
    
    // Notifications
    notifications: "Notifications",
    markAllAsRead: "Mark all as read",
    noNotifications: "No notifications",
    
    // Trust Score Hero
    yourTrustScore: "Your TrustScore™",
    thisMonth: "this month",
    updated: "Updated",
    shareScore: "Share Score",
    qrCode: "QR Code",
    
    // Score Level
    veryLow: "Very Low",
    low: "Low",
    medium: "Medium",
    high: "High",
    excellent: "Excellent",
    
    // Stats Cards
    onTimeRate: "On-Time Rate",
    monthsObserved: "Months Observed",
    verifiedPayments: "Verified Payments",
    // loanEligibility: "Loan Eligibility", // Removed duplicate
    
    // Score Breakdown
    scoreBreakdown: "Score Breakdown",
    whatAffectsScore: "What affects your TrustScore",
    onTimeRateDesc: "Based on your on-time payments",
    arrearsSeverity: "Arrears Severity",
    arrearsDesc: "No missed payments = good score",
    continuity: "Continuity (Months)",
    continuityDesc: "months of payment history",
    landlordReliability: "Landlord Reliability",
    landlordReliabilityDesc: "Last 3 months payment pattern",
    disputeOutcomes: "Dispute Outcomes",
    disputeOutcomesDesc: "property changes",
    
    // Score History
    scoreHistory: "Score History",
    lastMonths: "Last 8 months",
    noHistory: "No score history available",
    
    // Current Property
    currentProperty: "Current Property",
    whereRenting: "Where you're renting now",
    noProperty: "No current property information",
    
    // Score Guide
    scoreGuide: "Score Guide",
    whatScoreMeans: "What your score means",
    range: "Range",
    level: "Level",
    
    // Quick Actions
    quickActions: "Quick Actions",
    downloadReport: "Download Report",
    printScore: "Print Score",
    getHelp: "Get Help",
    tipsToImprove: "Tips to Improve",
    
    // Payment History Tab
    allPayments: "All your rental payments",
    export: "Export",
    last12Months: "Last 12 months",
    paidTo: "Paid to",
    onTime: "On Time",
    late: "Late",
    pending: "Pending",
    noPaymentHistory: "No payment history available",
    
    // Benefits Tab
    yourBenefits: "Your Benefits",
    whatUnlocks: "What your TrustScore unlocks",
    loanEligibility: "Loan Eligibility",
    interestRate: "Interest Rate",
    partnerLenders: "Partner Lenders",
    recommendedProducts: "Recommended Products",
    applyNow: "Apply Now →",
    personalLoan: "Personal Loan",
    homeImprovementLoan: "Home Improvement Loan",
    businessLoan: "Business Loan",
    
    // Profile Tab
    personalInfo: "Personal Information",
    fullName: "Full Name",
    nationalId: "National ID",
    email: "Email",
    phone: "Phone",
    securitySettings: "Security Settings",
    twoFactorAuth: "Two-factor authentication",
    enable: "Enable",
    changePassword: "Change password",
    update: "Update",
    editProfile: "Edit Profile",
    memberSince: "Member since",
    
    // Share Modal
    shareYourScore: "Share Your TrustScore",
    shareDesc: "Share your score with a landlord or lender",
    landlordNameEmail: "Landlord/Lender Name or Email",
    enterEmailName: "Enter email or name",
    shareDuration: "Share Duration",
    day: "day",
    days: "days",
    shareInfo: "They'll receive a request. You can revoke access anytime.",
    sendRequest: "Send Request",
    sending: "Sending...",
    cancel: "Cancel",
    
    // QR Modal
    yourQRCode: "Your TrustScore QR Code",
    qrDesc: "Scan to share your score instantly",
    copyId: "Copy ID",
    copied: "Copied!",
    save: "Save",
    qrInfo: "Landlords can scan this code to request access to your TrustScore",
    close: "Close",
    
    // Loading & Error
    loading: "Loading TrustScore...",
    error: "Error",
    noData: "No TrustScore data found.",
    
    // Language toggle
    switchLanguage: "Switch language",
    
    // Currency
    tsh: "TSh",
    
    // Months
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
  },
  sw: {
    // Header
    myTrustScore: "ALAMA YANGU YA UAMINIFU",
    
    // Navigation
    dashboard: "Dashibodi",
    paymentHistory: "Historia ya Malipo",
    benefits: "Faida",
    profile: "Wasifu",
    
    // Notifications
    notifications: "Arifa",
    markAllAsRead: "Weka zote kama zimesomwa",
    noNotifications: "Hakuna arifa",
    
    // Trust Score Hero
    yourTrustScore: "Alama yako ya Uaminifu™",
    thisMonth: "mwezi huu",
    updated: "Imesasishwa",
    shareScore: "Shiriki Alama",
    qrCode: "Msimbo wa QR",
    
    // Score Level
    veryLow: "Chini Sana",
    low: "Chini",
    medium: "Wastani",
    high: "Juu",
    excellent: "Bora",
    
    // Stats Cards
    onTimeRate: "Kiwango cha Malipo kwa Wakati",
    monthsObserved: "Miezi Iliyozingatiwa",
    verifiedPayments: "Malipo Yaliyothibitishwa",
    // loanEligibility: "Ustahiki Mkopo", // Removed duplicate
    
    // Score Breakdown
    scoreBreakdown: "Uchanganuzi wa Alama",
    whatAffectsScore: "Nini kinaathiri Alama yako",
    onTimeRateDesc: "Kulingana na malipo yako ya wakati",
    arrearsSeverity: "Ukali wa Malipo Yaliyochelewa",
    arrearsDesc: "Hakuna malipo yaliyokosa = alama nzuri",
    continuity: "Mwendelezo (Miezi)",
    continuityDesc: "miezi ya historia ya malipo",
    landlordReliability: "Kuegemeka kwa Mmiliki",
    landlordReliabilityDesc: "Mfumo wa malipo wa miezi 3 iliyopita",
    disputeOutcomes: "Matokeo ya Migogoro",
    disputeOutcomesDesc: "mabadiliko ya mali",
    
    // Score History
    scoreHistory: "Historia ya Alama",
    lastMonths: "Miezi 8 iliyopita",
    noHistory: "Hakuna historia ya alama inayopatikana",
    
    // Current Property
    currentProperty: "Mali ya Sasa",
    whereRenting: "Unakodi wapi sasa",
    noProperty: "Hakuna taarifa ya mali ya sasa",
    
    // Score Guide
    scoreGuide: "Mwongozo wa Alama",
    whatScoreMeans: "Maana ya alama yako",
    range: "Masafa",
    level: "Kiwango",
    
    // Quick Actions
    quickActions: "Vitendo vya Haraka",
    downloadReport: "Pakua Ripoti",
    printScore: "Chapisha Alama",
    getHelp: "Pata Msaada",
    tipsToImprove: "Vidokezo vya Kuboresha",
    
    // Payment History Tab
    allPayments: "Malipo yako yote ya kodi",
    export: "Hamisha",
    last12Months: "Miezi 12 iliyopita",
    paidTo: "Imelipwa kwa",
    onTime: "Kwa Wakati",
    late: "Imechelewa",
    pending: "Inasubiri",
    noPaymentHistory: "Hakuna historia ya malipo",
    
    // Benefits Tab
    yourBenefits: "Faida Zako",
    whatUnlocks: "Nini alama yako inafungua",
    loanEligibility: "Ustahiki Mkopo",
    interestRate: "Kiwango cha Riba",
    partnerLenders: "Wakopeshaji Washirika",
    recommendedProducts: "Bidhaa Zinazopendekezwa",
    applyNow: "Tuma Ombi Sasa →",
    personalLoan: "Mkopo wa Kibinafsi",
    homeImprovementLoan: "Mkopo wa Uboreshaji wa Nyumba",
    businessLoan: "Mkopo wa Biashara",
    
    // Profile Tab
    personalInfo: "Taarifa za Kibinafsi",
    fullName: "Jina Kamili",
    nationalId: "Kitambulisho cha Taifa",
    email: "Barua pepe",
    phone: "Simu",
    securitySettings: "Mipangilio ya Usalama",
    twoFactorAuth: "Uthibitishaji wa vipengele viwili",
    enable: "Washa",
    changePassword: "Badilisha nenosiri",
    update: "Sasisha",
    editProfile: "Hariri Wasifu",
    memberSince: "Mwanachama tangu",
    
    // Share Modal
    shareYourScore: "Shiriki Alama yako",
    shareDesc: "Shiriki alama yako na mmiliki au mkopeshaji",
    landlordNameEmail: "Jina la Mmiliki/Mkopeshaji au Barua pepe",
    enterEmailName: "Weka barua pepe au jina",
    shareDuration: "Muda wa Kushiriki",
    day: "siku",
    days: "siku",
    shareInfo: "Watapokea ombi. Unaweza kuondoa ufikiaji wakati wowote.",
    sendRequest: "Tuma Ombi",
    sending: "Inatuma...",
    cancel: "Ghairi",
    
    // QR Modal
    yourQRCode: "Msimbo wako wa QR wa Alama",
    qrDesc: "Changanua ili kushiriki alama yako papo hapo",
    copyId: "Nakili Kitambulisho",
    copied: "Imenakiliwa!",
    save: "Hifadhi",
    qrInfo: "Wamiliki wanaweza kuchanganua msimbo huu kuomba ufikiaji wa Alama yako",
    close: "Funga",
    
    // Loading & Error
    loading: "Inapakia Alama ya Uaminifu...",
    error: "Hitilafu",
    noData: "Hakuna data ya Alama ya Uaminifu.",
    
    // Language toggle
    switchLanguage: "Badilisha lugha",
    
    // Currency
    tsh: "TSh",
    
    // Months
    january: "Januari",
    february: "Februari",
    march: "Machi",
    april: "Aprili",
    may: "Mei",
    june: "Juni",
    july: "Julai",
    august: "Agosti",
    september: "Septemba",
    october: "Oktoba",
    november: "Novemba",
    december: "Desemba",
  }
}

// Score ranges for reference
const scoreRanges = [
  { range: "300-579", level: "veryLow", color: "bg-red-500", textColor: "text-red-600", description: "High risk, multiple payment issues" },
  { range: "580-669", level: "low", color: "bg-orange-500", textColor: "text-orange-600", description: "Some payment concerns" },
  { range: "670-739", level: "medium", color: "bg-yellow-500", textColor: "text-yellow-600", description: "Generally reliable" },
  { range: "740-799", level: "high", color: "bg-green-500", textColor: "text-green-600", description: "Very reliable tenant" },
  { range: "800-850", level: "excellent", color: "bg-emerald-500", textColor: "text-emerald-600", description: "Exceptional payment history" },
]

export default function TenantTrustScorePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showShareModal, setShowShareModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareWithLandlord, setShareWithLandlord] = useState("")
  const [shareDuration, setShareDuration] = useState("7")
  const [isLoading, setIsLoading] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  
  // Get current language translations
  const currentT = language === 'en' ? translations.en : translations.sw

  interface TrustScore {
    score: {
      value: number
      onTimeRate: number
      arrearsSeverity: number
      continuity: number
      landlordReliability: number
      disputeOutcomes: number
    }
    confidence: {
      band: string
      monthsObserved: number
      verifiedPayments: number
      pspMatched: number
      propertyTransitions: number
      recentActivityDays: number | null
      dataProvenance: string
    }
    paymentHistory: Array<any>
  }
  
  interface Profile {
    id: string
    email: string
    full_name: string
    first_name: string
    last_name: string
    phone: string | null
    member_since: string
    nationalId?: string
    avatar_url?: string | null
  }
  
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState<Profile | null>(null)

  // Fetch tenant profile
  React.useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/tenants/me/profile")
        if (!res.ok) return
        const data = await res.json()
        if (data.success && data.tenant) setProfile(data.tenant)
      } catch {}
    }
    fetchProfile()
  }, [])

  // Fetch real trust score
  React.useEffect(() => {
    async function fetchTrustScore() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/verification/credit")
        if (!res.ok) {
          throw new Error("Failed to fetch TrustScore data")
        }
        const data = await res.json()
        setTrustScore(data.trustScore)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Unknown error")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTrustScore()
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en')
  }

  // Get score level styling
  const getScoreLevel = (score: number) => {
    if (score < 580) return { 
      level: currentT.veryLow, 
      color: "bg-red-500", 
      textColor: "text-red-600", 
      bg: "bg-red-50", 
      border: "border-red-200" 
    }
    if (score < 670) return { 
      level: currentT.low, 
      color: "bg-orange-500", 
      textColor: "text-orange-600", 
      bg: "bg-orange-50", 
      border: "border-orange-200" 
    }
    if (score < 740) return { 
      level: currentT.medium, 
      color: "bg-yellow-500", 
      textColor: "text-yellow-600", 
      bg: "bg-yellow-50", 
      border: "border-yellow-200" 
    }
    if (score < 800) return { 
      level: currentT.high, 
      color: "bg-green-500", 
      textColor: "text-green-600", 
      bg: "bg-green-50", 
      border: "border-green-200" 
    }
    return { 
      level: currentT.excellent, 
      color: "bg-emerald-500", 
      textColor: "text-emerald-600", 
      bg: "bg-emerald-50", 
      border: "border-emerald-200" 
    }
  }

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle share trust score
  const handleShareTrustScore = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowShareModal(false)
      setShareWithLandlord("")
    }, 2000)
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    // No notifications in trustScore object
  }

  // Get unread notifications count
  const unreadNotifications = 0

  // Render loading, error, or TrustScore dashboard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary mr-2" />
        <span className="text-lg font-semibold text-primary">{currentT.loading}</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
        <span className="text-lg font-semibold text-red-500">{currentT.error}: {error}</span>
      </div>
    )
  }
  
  if (!trustScore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-yellow-500 mr-2" />
        <span className="text-lg font-semibold text-yellow-500">{currentT.noData}</span>
      </div>
    )
  }

  const scoreLevel = getScoreLevel(trustScore.score.value)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-primary">{currentT.myTrustScore}</span>
                </div>
              </div>
              
              {/* Language Toggle Button - Mobile */}
              <div className="ml-2 md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs h-8 px-2"
                  onClick={toggleLanguage}
                >
                  <Globe className="h-3 w-3" />
                  <Badge variant="outline" className="h-4 px-1 text-[8px]">
                    {language === 'en' ? 'SW' : 'EN'}
                  </Badge>
                </Button>
              </div>
              
              {/* Responsive Navigation: select for mobile, buttons for desktop */}
              <div className="ml-2 w-full">
                {/* Mobile: Select dropdown */}
                <div className="block md:hidden w-full my-2">
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={activeTab}
                    onClick={e => e.stopPropagation()}
                    onChange={e => setActiveTab(e.target.value)}
                  >
                    <option value="dashboard">{currentT.dashboard}</option>
                    <option value="history">{currentT.paymentHistory}</option>
                    <option value="benefits">{currentT.benefits}</option>
                    <option value="profile">{currentT.profile}</option>
                  </select>
                </div>
                {/* Desktop: Button group */}
                <div className="hidden md:flex items-center space-x-1">
                  <Button 
                    variant={activeTab === "dashboard" ? "default" : "ghost"} 
                    onClick={() => setActiveTab("dashboard")}
                  >
                    {currentT.dashboard}
                  </Button>
                  <Button 
                    variant={activeTab === "history" ? "default" : "ghost"} 
                    onClick={() => setActiveTab("history")}
                  >
                    {currentT.paymentHistory}
                  </Button>
                  <Button 
                    variant={activeTab === "benefits" ? "default" : "ghost"} 
                    onClick={() => setActiveTab("benefits")}
                  >
                    {currentT.benefits}
                  </Button>
                  <Button 
                    variant={activeTab === "profile" ? "default" : "ghost"} 
                    onClick={() => setActiveTab("profile")}
                  >
                    {currentT.profile}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Language Toggle Button - Desktop */}
              <div className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs h-8 px-3 rounded-full bg-secondary/50 hover:bg-secondary"
                  onClick={toggleLanguage}
                >
                  <Globe className="h-3 w-3" />
                  <span>{currentT.switchLanguage}</span>
                  <Badge variant="outline" className="h-4 px-1 text-[8px] ml-1">
                    {language === 'en' ? 'SW' : 'EN'}
                  </Badge>
                </Button>
              </div>
              
              {/* Notifications: hide on mobile (show only on md and up) */}
              <div className="hidden md:block">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </div>
              
              {/* Settings */}
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              
              {/* User profile */}
              <div className="flex items-center gap-3 ml-2 pl-2 border-l">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {profile?.first_name?.[0] || "T"}
                    {profile?.last_name?.[0] || "S"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  {profile ? (
                    <>
                      <p className="text-sm font-medium">{profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                      <p className="text-xs text-muted-foreground">{currentT.memberSince} {new Date(profile.member_since).getFullYear()}</p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">{currentT.loading}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotificationPanel && (
        <div className="absolute right-4 top-16 w-80 z-20">
          <Card>
            <CardHeader className="py-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm">{currentT.notifications}</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                  {currentT.markAllAsRead}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-auto">
                <div className="p-3 text-sm text-muted-foreground">{currentT.noNotifications}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Trust Score Hero Section */}
            <div className="mb-8">
              <Card className={`border-l-4 ${scoreLevel.border}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">{currentT.yourTrustScore}</span>
                      </div>
                      
                      <div className="flex items-end gap-4">
                        <h1 className="text-7xl font-bold">{trustScore.score.value}</h1>
                        <div className="mb-2">
                          <Badge className={`${scoreLevel.color} text-white text-lg px-4 py-1`}>
                            {scoreLevel.level}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Trend and update info */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground ml-1">{currentT.thisMonth}</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300" />
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {currentT.updated} {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => setShowShareModal(true)} className="gap-2">
                        <Share2 className="h-4 w-4" />
                        {currentT.shareScore}
                      </Button>
                      <Button variant="outline" onClick={() => setShowQRModal(true)} className="gap-2">
                        <QrCode className="h-4 w-4" />
                        {currentT.qrCode}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{currentT.onTimeRate}</p>
                      <p className="text-2xl font-bold text-emerald-600">{trustScore.score.onTimeRate !== undefined && trustScore.score.onTimeRate !== null ? `${trustScore.score.onTimeRate}%` : '0%'}</p>
                    </div>
                    <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{currentT.monthsObserved}</p>
                      <p className="text-2xl font-bold">{trustScore.confidence.monthsObserved !== undefined && trustScore.confidence.monthsObserved !== null ? trustScore.confidence.monthsObserved : 0}</p>
                    </div>
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{currentT.verifiedPayments}</p>
                      <p className="text-2xl font-bold">{trustScore.confidence.verifiedPayments || 0}/{trustScore.paymentHistory.length || 0}</p>
                    </div>
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{currentT.loanEligibility}</p>
                      <p className="text-2xl font-bold text-primary">
                        {currentT.tsh} {trustScore.score.value >= 800 ? '5,000,000' : trustScore.score.value >= 700 ? '2,500,000' : trustScore.score.value >= 600 ? '1,000,000' : '0'}
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score Breakdown */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{currentT.scoreBreakdown}</CardTitle>
                    <CardDescription>{currentT.whatAffectsScore}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{currentT.onTimeRate}</span>
                          <span className="text-sm font-bold">{trustScore.score.onTimeRate || 0}/100</span>
                        </div>
                        <Progress value={trustScore.score.onTimeRate || 0} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{currentT.onTimeRateDesc}</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{currentT.arrearsSeverity}</span>
                          <span className="text-sm font-bold">{trustScore.score.arrearsSeverity || 0}/100</span>
                        </div>
                        <Progress value={trustScore.score.arrearsSeverity || 0} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{currentT.arrearsDesc}</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{currentT.continuity}</span>
                          <span className="text-sm font-bold">{trustScore.score.continuity || 0}/12</span>
                        </div>
                        <Progress value={trustScore.score.continuity ? Math.min(trustScore.score.continuity, 12) * 100 / 12 : 0} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{trustScore.confidence.monthsObserved || 0} {currentT.continuityDesc}</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{currentT.landlordReliability}</span>
                          <span className="text-sm font-bold">{trustScore.score.landlordReliability || 0}/5</span>
                        </div>
                        <Progress value={trustScore.score.landlordReliability ? Math.min(trustScore.score.landlordReliability, 5) * 100 / 5 : 0} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{currentT.landlordReliabilityDesc}</p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{currentT.disputeOutcomes}</span>
                          <span className="text-sm font-bold">{trustScore.score.disputeOutcomes || 0}/5</span>
                        </div>
                        <Progress value={trustScore.score.disputeOutcomes ? Math.min(trustScore.score.disputeOutcomes, 5) * 100 / 5 : 0} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{trustScore.confidence.propertyTransitions || 0} {currentT.disputeOutcomesDesc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Score History Chart */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>{currentT.scoreHistory}</CardTitle>
                    <CardDescription>{currentT.lastMonths}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end h-40 gap-2">
                      <div className="w-full text-center text-muted-foreground py-8">
                        {currentT.noHistory}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Current Property */}
                <Card>
                  <CardHeader>
                    <CardTitle>{currentT.currentProperty}</CardTitle>
                    <CardDescription>{currentT.whereRenting}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{currentT.noProperty}</p>
                  </CardContent>
                </Card>

                {/* Score Guide */}
                <Card>
                  <CardHeader>
                    <CardTitle>{currentT.scoreGuide}</CardTitle>
                    <CardDescription>{currentT.whatScoreMeans}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scoreRanges.map((range) => {
                        const levelKey = range.level as keyof typeof translations.en
                        return (
                          <div key={range.range} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                            <div className={`w-1 h-12 rounded-full ${range.color} mt-1`} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{range.range}</span>
                                <Badge className={range.textColor + " bg-gray-100 text-xs"}>
                                  {currentT[levelKey]}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{range.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>{currentT.quickActions}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span className="text-xs">{currentT.downloadReport}</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1">
                        <Printer className="h-4 w-4" />
                        <span className="text-xs">{currentT.printScore}</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1">
                        <HelpCircle className="h-4 w-4" />
                        <span className="text-xs">{currentT.getHelp}</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-3 flex flex-col items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-xs">{currentT.tipsToImprove}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Payment History Tab */}
        {activeTab === "history" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{currentT.paymentHistory}</CardTitle>
                  <CardDescription>{currentT.allPayments}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {currentT.export}
                  </Button>
                  <select className="px-3 py-1 border rounded-md text-sm">
                    <option>{currentT.last12Months}</option>
                    <option>2024</option>
                    <option>2023</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trustScore.paymentHistory && trustScore.paymentHistory.length > 0 ? (
                  trustScore.paymentHistory.map((payment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded-full ${
                          payment.status === 'paid' ? 'bg-emerald-500' : 
                          payment.status === 'late' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium">{payment.month} 2024</p>
                          <p className="text-sm text-muted-foreground">
                            {currentT.paidTo}: {payment.landlord}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{currentT.tsh} {payment.amount?.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.date ? new Date(payment.date).toLocaleDateString() : currentT.pending}
                        </p>
                      </div>
                      <div>
                        {payment.status === 'paid' && (
                          <Badge className="bg-emerald-100 text-emerald-700">{currentT.onTime}</Badge>
                        )}
                        {payment.status === 'late' && (
                          <Badge className="bg-amber-100 text-amber-700">{currentT.late}</Badge>
                        )}
                        {payment.status === 'pending' && (
                          <Badge className="bg-blue-100 text-blue-700">{currentT.pending}</Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">{currentT.noPaymentHistory}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits Tab */}
        {activeTab === "benefits" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{currentT.yourBenefits}</CardTitle>
                <CardDescription>{currentT.whatUnlocks}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Wallet className="h-8 w-8 mx-auto text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">{currentT.loanEligibility}</p>
                      <p className="text-xl font-bold">
                        {currentT.tsh} {trustScore.score.value >= 800 ? '5,000,000' : trustScore.score.value >= 700 ? '2,500,000' : trustScore.score.value >= 600 ? '1,000,000' : '0'}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">{currentT.interestRate}</p>
                      <p className="text-xl font-bold">{trustScore.score.value >= 800 ? '8.5%' : trustScore.score.value >= 700 ? '10%' : trustScore.score.value >= 600 ? '12%' : 'N/A'}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Building className="h-8 w-8 mx-auto text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">{currentT.partnerLenders}</p>
                      <p className="text-xl font-bold">{trustScore.score.value >= 800 ? 3 : trustScore.score.value >= 700 ? 2 : trustScore.score.value >= 600 ? 1 : 0}</p>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="font-semibold mb-3">{currentT.recommendedProducts}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[currentT.personalLoan, currentT.homeImprovementLoan, currentT.businessLoan].map((product, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <p className="font-medium">{product}</p>
                        <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                          {currentT.applyNow}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator className="my-6" />

                <h3 className="font-semibold mb-3">{currentT.partnerLenders}</h3>
                <div className="flex flex-wrap gap-2">
                  {['NMB Bank', 'CRDB Bank', 'Exim Bank', 'Azania Bank'].map((lender, idx) => (
                    <Badge key={idx} variant="outline" className="px-3 py-1">
                      {lender}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {profile?.first_name?.[0] || "T"}{profile?.last_name?.[0] || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{profile?.full_name || 'Tenant'}</h2>
                  <p className="text-sm text-muted-foreground">{currentT.memberSince} {profile?.member_since ? new Date(profile.member_since).getFullYear() : '2024'}</p>
                  
                  <div className="mt-4 flex justify-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      {currentT.editProfile}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{currentT.personalInfo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">{currentT.fullName}</Label>
                        <p className="font-medium">{profile?.full_name || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">{currentT.nationalId}</Label>
                        <p className="font-medium">{profile?.nationalId ? `••••••${profile.nationalId.slice(-4)}` : 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">{currentT.email}</Label>
                        <p className="font-medium">{profile?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">{currentT.phone}</Label>
                        <p className="font-medium">{profile?.phone || 'N/A'}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3">{currentT.securitySettings}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>{currentT.twoFactorAuth}</span>
                          <Button variant="outline" size="sm">{currentT.enable}</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{currentT.changePassword}</span>
                          <Button variant="outline" size="sm">{currentT.update}</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Share Score Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{currentT.shareYourScore}</CardTitle>
              <CardDescription>
                {currentT.shareDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>{currentT.landlordNameEmail}</Label>
                  <Input 
                    placeholder={currentT.enterEmailName}
                    value={shareWithLandlord}
                    onChange={(e) => setShareWithLandlord(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>{currentT.shareDuration}</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={shareDuration}
                    onChange={(e) => setShareDuration(e.target.value)}
                  >
                    <option value="1">1 {currentT.day}</option>
                    <option value="7">7 {currentT.days}</option>
                    <option value="14">14 {currentT.days}</option>
                    <option value="30">30 {currentT.days}</option>
                    <option value="90">90 {currentT.days}</option>
                  </select>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{currentT.shareInfo}</span>
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={handleShareTrustScore}
                    disabled={!shareWithLandlord || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {currentT.sending}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {currentT.sendRequest}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowShareModal(false)}
                  >
                    {currentT.cancel}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>{currentT.yourQRCode}</CardTitle>
              <CardDescription>
                {currentT.qrDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block mx-auto mb-4 border-2 border-dashed">
                <QrCode className="h-48 w-48" />
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="font-medium">{profile?.full_name || 'Tenant'}</p>
                <p className="text-sm text-muted-foreground">{currentT.yourTrustScore}: {trustScore.score.value} - {scoreLevel.level}</p>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(profile?.id || '')}
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-4 w-4 mr-2" />
                      {currentT.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      {currentT.copyId}
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {currentT.save}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mb-4">
                {currentT.qrInfo}
              </p>
              
              <Button variant="outline" className="w-full" onClick={() => setShowQRModal(false)}>
                {currentT.close}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}