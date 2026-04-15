"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, CreditCard, Loader2, Settings, ChevronRight, Check, Eye, EyeOff, Lock, Smartphone, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

/* ========================================== */
/* --- Translations for settings page        */
/* ========================================== */
const translations = {
  en: {
    // Header
    settings: "Settings",
    manageAccount: "Manage your account and preferences",
    
    // Section Tabs
    profile: "Profile",
    notifications: "Notifications",
    security: "Security",
    payment: "Payment",
    
    // Profile Section
    profileInformation: "Profile Information",
    updatePersonalDetails: "Update your personal details",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phoneNumber: "Phone Number",
    readOnly: "Read Only",
    saveChanges: "Save Changes",
    
    // Notifications Section
    configureUpdates: "Configure how you receive updates",
    enabled: "of 4 enabled", // keep this
    applicationUpdates: "Application Updates",
    applicationDesc: "Status changes on your applications",
    paymentReminders: "Payment Reminders",
    paymentDesc: "Rent payment due date reminders",
    maintenanceRequests: "Maintenance Requests",
    maintenanceDesc: "Maintenance request alerts",
    monthlyReports: "Monthly Reports",
    monthlyDesc: "Monthly performance summary",
    saveNotifications: "Save Notifications",
    
    // Security Section
    passwordSecurity: "Password and account security",
    secured: "Secured",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    passwordsDoNotMatch: "Passwords do not match",
    updatePassword: "Update Password",
    
    // Payment Section
    paymentInformation: "Payment Information",
    paymentMethods: "Payment methods for rent and deposits",
    bankDetails: "Bank Details",
    bankName: "Bank Name",
    accountNumber: "Account Number",
    accountHolderName: "Account Holder Name",
    mobileMoney: "Mobile Money",
    mobileMoneyNumber: "Mobile Money Number",
    savePaymentInfo: "Save Payment Info",
    
    // Quick Nav
    quickNav: "Quick Navigation",
    
    // Loading
    loading: "Loading settings...",
    
    // Language toggle
    switchLanguage: "Switch language",
    
    // User name display
    userInitials: "User initials",
    
    // Misc
    of: "of",
    // enabled: "enabled", // remove duplicate
  },
  sw: {
    // Header
    settings: "Mipangilio",
    manageAccount: "Dhibiti akaunti yako na mapendeleo",
    
    // Section Tabs
    profile: "Wasifu",
    notifications: "Arifa",
    security: "Usalama",
    payment: "Malipo",
    
    // Profile Section
    profileInformation: "Taarifa za Wasifu",
    updatePersonalDetails: "Sasisha maelezo yako ya kibinafsi",
    firstName: "Jina la Kwanza",
    lastName: "Jina la Mwisho",
    email: "Barua pepe",
    phoneNumber: "Namba ya Simu",
    readOnly: "Usomaji tu",
    saveChanges: "Hifadhi Mabadiliko",
    
    // Notifications Section
    configureUpdates: "Sanidi jinsi unavyopokea taarifa",
    enabled: "kati ya 4 zimewashwa", // keep this
    applicationUpdates: "Taarifa za Maombi",
    applicationDesc: "Mabadiliko ya hali kwenye maombi yako",
    paymentReminders: "Vikumbusho vya Malipo",
    paymentDesc: "Vikumbusho vya tarehe ya malipo ya kodi",
    maintenanceRequests: "Maombi ya Matengenezo",
    maintenanceDesc: "Arifa za maombi ya matengenezo",
    monthlyReports: "Ripoti za Kila Mwezi",
    monthlyDesc: "Muhtasari wa utendaji wa kila mwezi",
    saveNotifications: "Hifadhi Arifa",
    
    // Security Section
    passwordSecurity: "Nenosiri na usalama wa akaunti",
    secured: "Salama",
    currentPassword: "Nenosiri la Sasa",
    newPassword: "Nenosiri Jipya",
    confirmNewPassword: "Thibitisha Nenosiri Jipya",
    passwordsDoNotMatch: "Nyosiri hazifanani",
    updatePassword: "Sasisha Nenosiri",
    
    // Payment Section
    paymentInformation: "Taarifa za Malipo",
    paymentMethods: "Njia za malipo ya kodi na amana",
    bankDetails: "Taarifa za Benki",
    bankName: "Jina la Benki",
    accountNumber: "Namba ya Akaunti",
    accountHolderName: "Jina la Mwenye Akaunti",
    mobileMoney: "M-Pesa",
    mobileMoneyNumber: "Namba ya M-Pesa",
    savePaymentInfo: "Hifadhi Taarifa za Malipo",
    
    // Quick Nav
    quickNav: "Urambazaji wa Haraka",
    
    // Loading
    loading: "Inapakia mipangilio...",
    
    // Language toggle
    switchLanguage: "Badilisha lugha",
    
    // User name display
    userInitials: "Herufi za kwanza za mtumiaji",
    
    // Misc
    of: "kati ya",
    // enabled: "zimewashwa", // remove duplicate
  }
}

export default function TenantSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any>({})
  const [paymentInfo, setPaymentInfo] = useState<any>({})
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")
  const { language, setLanguage, t } = useLanguage()
  
  // Get current language translations
  const currentT = language === 'en' ? translations.en : translations.sw

  useEffect(() => {
    fetchSettings()
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en')
  }

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/settings")
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
        setNotifications(data.notifications)
        setPaymentInfo(data.paymentInfo)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    setSaving("profile")
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "profile",
          data: {
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
          },
        }),
      })
      await res.json()
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(null)
      fetchSettings()
    }
  }

  const saveNotifications = async () => {
    setSaving("notifications")
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "notifications",
          data: notifications,
        }),
      })
      await res.json()
    } catch (error) {
      console.error("Error saving notifications:", error)
    } finally {
      setSaving(null)
      fetchSettings()
    }
  }

  const savePaymentInfo = async () => {
    setSaving("payment")
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "payment",
          data: paymentInfo,
        }),
      })
      await res.json()
    } catch (error) {
      console.error("Error saving payment info:", error)
    } finally {
      setSaving(null)
      fetchSettings()
    }
  }

  const updatePassword = async () => {
    setSaving("password")
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "password",
          data: {
            current_password: passwords.current,
            new_password: passwords.new,
            confirm_password: passwords.confirm,
          },
        }),
      })
      await res.json()
    } catch (error) {
      console.error("Error updating password:", error)
    } finally {
      setSaving(null)
    }
  }

  const sections = [
    { id: "profile", label: currentT.profile, icon: User },
    { id: "notifications", label: currentT.notifications, icon: Bell },
    { id: "security", label: currentT.security, icon: Shield },
    { id: "payment", label: currentT.payment, icon: CreditCard },
  ]

  const notifEnabled = notifications
    ? Object.values(notifications).filter(Boolean).length
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full border-2 border-primary/20" />
            <Loader2 className="h-10 w-10 animate-spin text-primary absolute inset-0" />
          </div>
          <p className="text-[11px] text-muted-foreground tracking-wide uppercase font-medium">
            {currentT.loading}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground tracking-tight">{currentT.settings}</h1>
              <p className="text-[10px] text-muted-foreground">{currentT.manageAccount}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
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
            
            {user?.first_name && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/60 border border-border/50">
                <div className="h-4 w-4 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-primary">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {user.first_name} {user.last_name}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Section Tabs */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                }`}
              >
                <Icon className="h-3 w-3" />
                {section.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-5">
          {/* Profile Settings */}
          {activeSection === "profile" && (
            <Card className="border-border/60 shadow-none overflow-hidden">
              <CardHeader className="pb-3 pt-4 px-4 bg-gradient-to-r from-primary/[0.03] to-transparent border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xs font-semibold tracking-tight">{currentT.profileInformation}</CardTitle>
                      <CardDescription className="text-[10px] mt-0.5">{currentT.updatePersonalDetails}</CardDescription>
                    </div>
                  </div>
                  {user?.email && (
                    <div className="px-2 py-0.5 rounded-full bg-muted/60 border border-border/50">
                      <span className="text-[9px] text-muted-foreground font-medium">{user.email}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-5 pt-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                      {currentT.firstName}
                    </Label>
                    <Input
                      id="firstName"
                      value={user?.first_name || ""}
                      onChange={e => setUser({ ...user, first_name: e.target.value })}
                      className="h-9 text-xs border-border/60 focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                      {currentT.lastName}
                    </Label>
                    <Input
                      id="lastName"
                      value={user?.last_name || ""}
                      onChange={e => setUser({ ...user, last_name: e.target.value })}
                      className="h-9 text-xs border-border/60 focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                      {currentT.email}
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="h-9 text-xs border-border/60 bg-muted/30 text-muted-foreground pr-16"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-muted border border-border/50">
                        <span className="text-[8px] text-muted-foreground font-medium uppercase tracking-wider">{currentT.readOnly}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                      {currentT.phoneNumber}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={user?.phone || ""}
                      onChange={e => setUser({ ...user, phone: e.target.value })}
                      className="h-9 text-xs border-border/60 focus-visible:ring-primary/30"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <Button onClick={saveProfile} disabled={saving === "profile"} size="sm" className="h-8 text-[11px] px-4 rounded-lg font-medium">
                    {saving === "profile" ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Check className="mr-1.5 h-3 w-3" />}
                    {currentT.saveChanges}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeSection === "notifications" && (
            <Card className="border-border/60 shadow-none overflow-hidden">
              <CardHeader className="pb-3 pt-4 px-4 bg-gradient-to-r from-amber-500/[0.03] to-transparent border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Bell className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xs font-semibold tracking-tight">{currentT.notifications}</CardTitle>
                      <CardDescription className="text-[10px] mt-0.5">{currentT.configureUpdates}</CardDescription>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/60">
                    <span className="text-[9px] text-amber-700 font-medium">{notifEnabled} {currentT.of} 4 {currentT.enabled}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-5 pt-2">
                <div className="divide-y divide-border/40">
                  {[
                    { key: "new_applications", label: currentT.applicationUpdates, desc: currentT.applicationDesc, color: "bg-blue-100 text-blue-600" },
                    { key: "payment_reminders", label: currentT.paymentReminders, desc: currentT.paymentDesc, color: "bg-emerald-100 text-emerald-600" },
                    { key: "maintenance_requests", label: currentT.maintenanceRequests, desc: currentT.maintenanceDesc, color: "bg-orange-100 text-orange-600" },
                    { key: "monthly_reports", label: currentT.monthlyReports, desc: currentT.monthlyDesc, color: "bg-violet-100 text-violet-600" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3.5 group">
                      <div className="flex items-center gap-3">
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${item.color.split(" ")[0]}`}>
                          <Bell className={`h-3 w-3 ${item.color.split(" ")[1]}`} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={!!notifications?.[item.key]}
                        onCheckedChange={checked => setNotifications({ ...notifications, [item.key]: checked })}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border/40">
                  <Button onClick={saveNotifications} disabled={saving === "notifications"} size="sm" className="h-8 text-[11px] px-4 rounded-lg font-medium">
                    {saving === "notifications" ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Check className="mr-1.5 h-3 w-3" />}
                    {currentT.saveNotifications}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeSection === "security" && (
            <Card className="border-border/60 shadow-none overflow-hidden">
              <CardHeader className="pb-3 pt-4 px-4 bg-gradient-to-r from-emerald-500/[0.03] to-transparent border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Shield className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xs font-semibold tracking-tight">{currentT.security}</CardTitle>
                      <CardDescription className="text-[10px] mt-0.5">{currentT.passwordSecurity}</CardDescription>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60">
                    <span className="text-[9px] text-emerald-700 font-medium flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" /> {currentT.secured}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-5 pt-5">
                <div className="flex flex-col gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                      {currentT.currentPassword}
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPw ? "text" : "password"}
                        value={passwords.current}
                        onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                        className="h-9 text-xs border-border/60 focus-visible:ring-primary/30 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showCurrentPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                        {currentT.newPassword}
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPw ? "text" : "password"}
                          value={passwords.new}
                          onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                          className="h-9 text-xs border-border/60 focus-visible:ring-primary/30 pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNewPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                        {currentT.confirmNewPassword}
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPw ? "text" : "password"}
                          value={passwords.confirm}
                          onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                          className="h-9 text-xs border-border/60 focus-visible:ring-primary/30 pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw(!showConfirmPw)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {passwords.new && passwords.confirm && passwords.new !== passwords.confirm && (
                    <p className="text-[10px] text-destructive font-medium">{currentT.passwordsDoNotMatch}</p>
                  )}
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <Button
                    onClick={updatePassword}
                    disabled={saving === "password" || !passwords.current || !passwords.new || passwords.new !== passwords.confirm}
                    size="sm"
                    className="h-8 text-[11px] px-4 rounded-lg font-medium"
                  >
                    {saving === "password" ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Shield className="mr-1.5 h-3 w-3" />}
                    {currentT.updatePassword}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Settings */}
          {activeSection === "payment" && (
            <Card className="border-border/60 shadow-none overflow-hidden">
              <CardHeader className="pb-3 pt-4 px-4 bg-gradient-to-r from-blue-500/[0.03] to-transparent border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xs font-semibold tracking-tight">{currentT.paymentInformation}</CardTitle>
                      <CardDescription className="text-[10px] mt-0.5">{currentT.paymentMethods}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-5 pt-5">
                {/* Bank Section */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-border/40" />
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-medium">{currentT.bankDetails}</span>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="bankName" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                        {currentT.bankName}
                      </Label>
                      <Input
                        id="bankName"
                        value={paymentInfo?.bank_name || ""}
                        onChange={e => setPaymentInfo({ ...paymentInfo, bank_name: e.target.value })}
                        className="h-9 text-xs border-border/60 focus-visible:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="accountNumber" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                        {currentT.accountNumber}
                      </Label>
                      <Input
                        id="accountNumber"
                        value={paymentInfo?.account_number || ""}
                        onChange={e => setPaymentInfo({ ...paymentInfo, account_number: e.target.value })}
                        className="h-9 text-xs border-border/60 focus-visible:ring-primary/30"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="accountName" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                        {currentT.accountHolderName}
                      </Label>
                      <Input
                        id="accountName"
                        value={paymentInfo?.account_name || ""}
                        onChange={e => setPaymentInfo({ ...paymentInfo, account_name: e.target.value })}
                        className="h-9 text-xs border-border/60 focus-visible:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Money Section */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-border/40" />
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-medium flex items-center gap-1.5">
                      <Smartphone className="h-2.5 w-2.5" /> {currentT.mobileMoney}
                    </span>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="mobileMoney" className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                      {currentT.mobileMoneyNumber}
                    </Label>
                    <Input
                      id="mobileMoney"
                      value={paymentInfo?.mobile_money || ""}
                      onChange={e => setPaymentInfo({ ...paymentInfo, mobile_money: e.target.value })}
                      className="h-9 text-xs border-border/60 focus-visible:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={savePaymentInfo} disabled={saving === "payment"} size="sm" className="h-8 text-[11px] px-4 rounded-lg font-medium">
                    {saving === "payment" ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Check className="mr-1.5 h-3 w-3" />}
                    {currentT.savePaymentInfo}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Nav */}
          <Card className="border-border/60 shadow-none">
            <CardContent className="p-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        activeSection === section.id
                          ? "border-primary/20 bg-primary/[0.03]"
                          : "border-border/40 hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 ${activeSection === section.id ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-[11px] font-medium ${activeSection === section.id ? "text-foreground" : "text-muted-foreground"}`}>
                          {section.label}
                        </span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}