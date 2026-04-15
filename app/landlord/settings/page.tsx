"use client"

import React, { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/lib/auth/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Loader2,
  CheckCircle,
  Settings,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Building2,
  FileText,
  BellRing,
  Wallet,
  Landmark,
  Save,
  Crown,
} from "lucide-react"

/* ========================================== */
/* --- Stub hooks (same pattern as all pages) */
/* ========================================== */
const useToast = () => ({
  toast: ({
    title,
    description,
    variant,
  }: {
    title: string
    description: string
    variant?: string
  }) => {
    console.log(`[Toast] ${title}: ${description}`)
  },
})

/* ========================================== */
/* --- Types                                  */
/* ========================================== */
interface UserSettings {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  role: string
  is_verified: boolean
  avatar_url?: string
  full_name?: string
}
interface NotificationSettings {
  new_applications: boolean
  payment_reminders: boolean
  maintenance_requests: boolean
  monthly_reports: boolean
}
interface PaymentSettings {
  bank_name: string
  account_number: string
  account_name: string
  mobile_money: string
}

/* ========================================== */
/* --- Sub-components (matching design lang)  */
/* ========================================== */

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  description: string
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 p-4 transition-all hover:bg-muted/60">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          checked ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}

function InputField({
  id,
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}: {
  id: string
  label: string
  icon: React.ReactNode
  type?: string
  value: string
  onChange?: (val: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-10 pl-10 text-sm border-border/60 focus:border-primary/40 ${
            disabled ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : "bg-background"
          }`}
        />
      </div>
    </div>
  )
}

function SaveButton({
  onClick,
  saving,
  label,
}: {
  onClick: () => void
  saving: boolean
  label: string
}) {
  return (
    <Button
      onClick={onClick}
      disabled={saving}
      size="sm"
      className="gap-2 shadow-sm hover:shadow-md transition-all"
    >
      {saving ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </Button>
  )
}

/* ========================================== */
/* --- Main Page                              */
/* ========================================== */

export default function LandlordSettingsPage() {
  const ctx = useContext(AuthContext);
  const [user, setUser] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    new_applications: true,
    payment_reminders: true,
    maintenance_requests: true,
    monthly_reports: false,
  })
  const [paymentInfo, setPaymentInfo] = useState<PaymentSettings>({
    bank_name: "",
    account_number: "",
    account_name: "",
    mobile_money: "",
  })
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (ctx && ctx.refreshVerificationStatus) {
      ctx.refreshVerificationStatus();
    }
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
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
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
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
            first_name: user?.first_name,
            last_name: user?.last_name,
            phone: user?.phone,
          },
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        if (ctx && ctx.refreshVerificationStatus) {
          ctx.refreshVerificationStatus();
        }
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  const savePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }
    if (passwords.new.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }
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
          },
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Password updated successfully",
        })
        setPasswords({ current: "", new: "", confirm: "" })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
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
      const data = await res.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Notification settings updated",
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update notifications",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
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
      const data = await res.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Payment information updated",
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update payment info",
        variant: "destructive",
      })
    } finally {
      setSaving(null)
    }
  }

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Loading Settings
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Please wait while we fetch your preferences...
          </p>
        </div>
      </div>
    )
  }

  const enabledCount = Object.values(notifications).filter(Boolean).length
  const totalNotifs = Object.keys(notifications).length

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        {/* ─── Page Header ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/20 text-yellow-600">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              {/* Removed GOLD Landlord Settings and description as requested */}
            </div>
          </div>

          {/* Quick info badges */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {user && (
              <Badge
                variant="secondary"
                className="gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
              >
                <CheckCircle className="h-3 w-3" />
                {user.is_verified ? "Verified Account" : "Unverified"}
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="gap-1.5 bg-muted text-muted-foreground border-border/40"
            >
              <Bell className="h-3 w-3" />
              {enabledCount}/{totalNotifs} Notifications Active
            </Badge>
            {user && (
              <Badge
                variant="secondary"
                className="gap-1.5 bg-muted text-muted-foreground border-border/40"
              >
                <Shield className="h-3 w-3" />
                {user.role === "landlord" ? "Landlord" : user.role}
              </Badge>
            )}
          </div>
        </div>

        {/* ─── Profile Settings ─── */}
        <Card className="mb-6 overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="h-1 bg-primary" />
          <CardContent className="p-6">
            <SectionHeader
              icon={<User className="h-5 w-5" />}
              title="Profile Information"
              subtitle="Update your personal details and contact information"
            />

            {/* User avatar preview */}
                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-muted/40">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || "Profile"}
                      className="h-14 w-14 rounded-full object-cover border-2 border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-lg ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                      {user?.first_name?.[0] || "U"}
                      {user?.last_name?.[0] || ""}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    {user?.role && (
                      <Badge
                        variant="secondary"
                        className="mt-1.5 text-[10px] uppercase tracking-wider font-medium bg-primary/10 text-primary border-primary/20"
                      >
                        {user.role === "landlord" ? "Landlord" : user.role}
                      </Badge>
                    )}
                  </div>
                </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                id="firstName"
                label="First Name"
                icon={<User className="h-4 w-4" />}
                value={user?.first_name || ""}
                onChange={(val) =>
                  setUser(user ? { ...user, first_name: val } : null)
                }
              />
              <InputField
                id="lastName"
                label="Last Name"
                icon={<User className="h-4 w-4" />}
                value={user?.last_name || ""}
                onChange={(val) =>
                  setUser(user ? { ...user, last_name: val } : null)
                }
              />
              <InputField
                id="email"
                label="Email Address"
                icon={<Mail className="h-4 w-4" />}
                type="email"
                value={user?.email || ""}
                disabled
              />
              <InputField
                id="phone"
                label="Phone Number"
                icon={<Phone className="h-4 w-4" />}
                type="tel"
                value={user?.phone || ""}
                onChange={(val) =>
                  setUser(user ? { ...user, phone: val } : null)
                }
                placeholder="+255 XXX XXX XXX"
              />
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex justify-end">
              <SaveButton
                onClick={saveProfile}
                saving={saving === "profile"}
                label="Save Profile"
              />
            </div>
          </CardContent>
        </Card>

        {/* ─── Notification Settings ─── */}
        <Card className="mb-6 overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="h-1 bg-blue-500" />
          <CardContent className="p-6">
            <SectionHeader
              icon={<Bell className="h-5 w-5" />}
              title="Notifications"
              subtitle="Configure how you receive updates and alerts"
            />

            <div className="space-y-3">
              <ToggleRow
                icon={<FileText className="h-4 w-4" />}
                label="New Applications"
                description="Get notified when tenants apply for your properties"
                checked={notifications.new_applications}
                onChange={(val) =>
                  setNotifications({
                    ...notifications,
                    new_applications: val,
                  })
                }
              />
              <ToggleRow
                icon={<Wallet className="h-4 w-4" />}
                label="Payment Reminders"
                description="Receive alerts for upcoming rent payment deadlines"
                checked={notifications.payment_reminders}
                onChange={(val) =>
                  setNotifications({
                    ...notifications,
                    payment_reminders: val,
                  })
                }
              />
              <ToggleRow
                icon={<Building2 className="h-4 w-4" />}
                label="Maintenance Requests"
                description="Stay informed when tenants submit maintenance requests"
                checked={notifications.maintenance_requests}
                onChange={(val) =>
                  setNotifications({
                    ...notifications,
                    maintenance_requests: val,
                  })
                }
              />
              <ToggleRow
                icon={<BellRing className="h-4 w-4" />}
                label="Monthly Reports"
                description="Receive a monthly performance summary report"
                checked={notifications.monthly_reports}
                onChange={(val) =>
                  setNotifications({
                    ...notifications,
                    monthly_reports: val,
                  })
                }
              />
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {enabledCount} of {totalNotifs} notifications enabled
              </p>
              <SaveButton
                onClick={saveNotifications}
                saving={saving === "notifications"}
                label="Save Notifications"
              />
            </div>
          </CardContent>
        </Card>

        {/* ─── Security Settings ─── */}
        <Card className="mb-6 overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="h-1 bg-amber-500" />
          <CardContent className="p-6">
            <SectionHeader
              icon={<Shield className="h-5 w-5" />}
              title="Security"
              subtitle="Password and account security settings"
            />

            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                    placeholder="Enter current password"
                    className="h-10 pl-10 pr-10 text-sm border-border/60 focus:border-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  New Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    placeholder="Enter new password"
                    className="h-10 pl-10 pr-10 text-sm border-border/60 focus:border-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    placeholder="Confirm new password"
                    className="h-10 pl-10 pr-10 text-sm border-border/60 focus:border-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password strength hint */}
              {passwords.new && (
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Password strength
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          passwords.new.length >= level * 3
                            ? passwords.new.length >= 12
                              ? "bg-primary"
                              : passwords.new.length >= 8
                                ? "bg-amber-500"
                                : "bg-destructive"
                            : "bg-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    {passwords.new.length < 6
                      ? "Too short - minimum 6 characters"
                      : passwords.new.length < 8
                        ? "Fair - consider adding more characters"
                        : passwords.new.length < 12
                          ? "Good - strong password"
                          : "Excellent - very strong password"}
                  </p>
                </div>
              )}

              {/* Password mismatch warning */}
              {passwords.confirm &&
                passwords.new !== passwords.confirm && (
                  <div className="flex items-center gap-2 rounded-xl bg-destructive/5 border border-destructive/20 p-3">
                    <Shield className="h-4 w-4 text-destructive shrink-0" />
                    <p className="text-xs text-destructive">
                      Passwords do not match
                    </p>
                  </div>
                )}
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex justify-end">
              <Button
                onClick={savePassword}
                disabled={
                  saving === "password" ||
                  !passwords.current ||
                  !passwords.new ||
                  passwords.new !== passwords.confirm
                }
                size="sm"
                className="gap-2 shadow-sm hover:shadow-md transition-all"
              >
                {saving === "password" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ─── Payment Settings ─── */}
        <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="h-1 bg-primary" />
          <CardContent className="p-6">
            <SectionHeader
              icon={<CreditCard className="h-5 w-5" />}
              title="Payment Information"
              subtitle="Where you receive rent payments from tenants"
            />

            <div className="space-y-4">
              <InputField
                id="bankName"
                label="Bank Name"
                icon={<Landmark className="h-4 w-4" />}
                value={paymentInfo.bank_name}
                onChange={(val) =>
                  setPaymentInfo({ ...paymentInfo, bank_name: val })
                }
                placeholder="e.g. CRDB Bank"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  id="accountNumber"
                  label="Account Number"
                  icon={<CreditCard className="h-4 w-4" />}
                  value={paymentInfo.account_number}
                  onChange={(val) =>
                    setPaymentInfo({ ...paymentInfo, account_number: val })
                  }
                  placeholder="Enter account number"
                />
                <InputField
                  id="accountName"
                  label="Account Holder Name"
                  icon={<User className="h-4 w-4" />}
                  value={paymentInfo.account_name}
                  onChange={(val) =>
                    setPaymentInfo({ ...paymentInfo, account_name: val })
                  }
                  placeholder="Enter account holder name"
                />
              </div>

              <div className="rounded-xl bg-muted/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Mobile Money (Optional)
                  </p>
                </div>
                <Input
                  id="mobileMoney"
                  value={paymentInfo.mobile_money}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      mobile_money: e.target.value,
                    })
                  }
                  placeholder="+255 7XX XXX XXX"
                  className="h-10 text-sm border-border/60 focus:border-primary/40 bg-background"
                />
                <p className="text-[10px] text-muted-foreground mt-2">
                  Add your mobile money number as an alternative payment method
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/40 flex justify-end">
              <SaveButton
                onClick={savePaymentInfo}
                saving={saving === "payment"}
                label="Save Payment Info"
              />
            </div>
          </CardContent>
        </Card>

        {/* ─── Footer spacer ─── */}
        <div className="h-8" />
      </div>
    </div>
  )
}