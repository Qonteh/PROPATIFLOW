"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Home,
  Shield,
  Lock,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type TenantProfileApi = {
  success: boolean
  tenant: {
    id: string
    email: string
    full_name: string
    first_name: string
    last_name: string
    phone: string | null
    is_verified: boolean
    avatar_url: string | null
    date_of_birth: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    member_since: string
    profile?: {
      nida_number?: string | null
      employer_name?: string | null
      employment_status?: string | null
      job_title?: string | null
      annual_income?: number | null
      income_verified?: boolean
      previous_landlord_name?: string | null
      previous_landlord_phone?: string | null
      previous_address?: string | null
      rental_history_years?: number | null
      has_pets?: boolean
      pet_details?: string | null
      number_of_occupants?: number | null
      emergency_contact?: {
        name: string
        phone: string
        relationship: string
      } | null
      bio?: string | null
    }
    verification?: {
      status: string
      nin_verified: boolean
      bvn_verified: boolean
      id_verified: boolean
    }
    background_checks?: Array<{
      check_type: string
      status: string
      result: string | null
      completed_at: string | null
    }>
    documents?: Array<{
      id: string
      document_type: string
      file_name: string
      is_verified: boolean
      created_at: string
    }>
    applications?: Array<{
      id: string
      property_title: string
      property_address: string
      status: string
      application_date: string
    }>
    credit_score?: { status: string; message: string }
  }
}

export default function TenantProfileViewPage() {
  const params = useParams()
  const tenantId = params?.id ? String(params.id) : ""
  const [tenant, setTenant] = useState<TenantProfileApi["tenant"] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTenantProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/tenants/${tenantId}/profile`)
        if (response.ok) {
          const data: TenantProfileApi = await response.json()
          if (data.success && data.tenant) setTenant(data.tenant)
        }
      } catch (error) {
        console.error("Error fetching tenant profile:", error)
      } finally {
        setLoading(false)
      }
    }

    if (tenantId) {
      fetchTenantProfile()
    }
  }, [tenantId])

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <Card className="border-2">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Tenant profile not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getInitials = (name?: string | null) => {
    if (!name || typeof name !== "string") return "?"
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Derive verification status from the nested verification object
  const verificationStatus = tenant.verification?.status ?? (tenant.is_verified ? "verified" : "pending")

  // Derive background check status from the background_checks array
  const latestBackgroundCheck = tenant.background_checks?.[0]
  const backgroundCheckStatus = latestBackgroundCheck?.status ?? "pending"

  // Access profile fields safely
  const profile = tenant.profile

  const getVerificationBadge = (status: string) => {
    if (status === "verified") {
      return (
        <Badge className="bg-green-500/10 text-green-700 font-semibold">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      )
    } else if (status === "pending") {
      return (
        <Badge variant="secondary" className="font-semibold">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive" className="font-semibold">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    }
  }

  const getBackgroundCheckBadge = (status: string) => {
    if (status === "passed") {
      return (
        <Badge className="bg-green-500/10 text-green-700 font-semibold">
          <CheckCircle className="h-3 w-3 mr-1" />
          Passed
        </Badge>
      )
    } else if (status === "pending") {
      return (
        <Badge variant="secondary" className="font-semibold">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive" className="font-semibold">
          <XCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      )
    }
  }

  // Build a rental history summary from profile fields
  const rentalHistorySummary = (() => {
    const parts: string[] = []
    if (profile?.rental_history_years != null) {
      parts.push(`${profile.rental_history_years} year(s) of rental history`)
    }
    if (profile?.previous_address) {
      parts.push(`Previously lived at: ${profile.previous_address}`)
    }
    if (profile?.previous_landlord_name) {
      let ref = `Previous landlord: ${profile.previous_landlord_name}`
      if (profile?.previous_landlord_phone) {
        ref += ` (${profile.previous_landlord_phone})`
      }
      parts.push(ref)
    }
    return parts.length > 0 ? parts.join(". ") + "." : null
  })()

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-background min-h-screen">
      {/* Header with Avatar */}
      <div className="mb-6">
        <Button variant="ghost" className="mb-4 -ml-4" onClick={() => window.history.back()}>
          {"<-"} Back to Tenants
        </Button>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 border-4 border-background shadow-lg rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
            {tenant.avatar_url ? (
              <img
                src={tenant.avatar_url}
                alt={tenant.full_name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-primary">
                {getInitials(tenant.full_name)}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">{tenant.full_name}</h1>
            <p className="text-sm text-muted-foreground">Tenant Profile</p>
          </div>
        </div>
      </div>

      {/* Verification Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>{getVerificationBadge(verificationStatus)}</CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Background Check
            </CardTitle>
          </CardHeader>
          <CardContent>{getBackgroundCheckBadge(backgroundCheckStatus)}</CardContent>
        </Card>
      </div>

      {/* Main Profile Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Personal Information */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-xs">Basic contact and personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Email Address</p>
                <p className="text-sm font-medium">{tenant.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Phone Number</p>
                <p className="text-sm font-medium">{tenant.phone || "Not provided"}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Date of Birth</p>
                <p className="text-sm font-medium">
                  {tenant.date_of_birth
                    ? new Date(tenant.date_of_birth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not provided"}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Member Since</p>
                <p className="text-sm font-medium">
                  {new Date(tenant.member_since).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5 text-primary" />
              Employment Information
            </CardTitle>
            <CardDescription className="text-xs">Current employment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Employer</p>
                <p className="text-sm font-medium">{profile?.employer_name || "Not provided"}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Employment Status</p>
                <Badge variant="secondary" className="font-semibold text-xs">
                  {profile?.employment_status || "Not specified"}
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Job Title</p>
                <p className="text-sm font-medium">{profile?.job_title || "Not provided"}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Annual Income</p>
                <p className="text-sm font-bold text-primary">
                  {profile?.annual_income ? formatCurrency(profile.annual_income) : "Not disclosed"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Score - Locked */}
        <Card className="border-2 shadow-lg bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Credit Score
            </CardTitle>
            <CardDescription className="text-xs">Tenant privacy protected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-bold text-lg mb-1 text-foreground">
                {tenant.credit_score?.status === "available" ? "Credit Score Available" : "Credit Score Hidden"}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                {tenant.credit_score?.message ||
                  "The tenant has not shared their credit score. They can share it with you from their profile."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rental History */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Home className="h-5 w-5 text-primary" />
              Rental History
            </CardTitle>
            <CardDescription className="text-xs">Previous rental experience</CardDescription>
          </CardHeader>
          <CardContent>
            {rentalHistorySummary ? (
              <p className="text-sm leading-relaxed">{rentalHistorySummary}</p>
            ) : (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No rental history provided yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents Section */}
      <Card className="mt-5 border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Uploaded Documents
          </CardTitle>
          <CardDescription className="text-xs">Verification and financial documents</CardDescription>
        </CardHeader>
        <CardContent>
          {tenant.documents && tenant.documents.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {tenant.documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                  {doc.is_verified ? (
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{doc.document_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.is_verified ? "Verified" : "Pending review"}
                      {" - "}
                      {new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications Section */}
      {tenant.applications && tenant.applications.length > 0 && (
        <Card className="mt-5 border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Rental Applications
            </CardTitle>
            <CardDescription className="text-xs">Properties this tenant has applied for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tenant.applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div>
                    <p className="text-sm font-semibold">{app.property_title}</p>
                    <p className="text-xs text-muted-foreground">{app.property_address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {new Date(app.application_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <Badge
                      variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
