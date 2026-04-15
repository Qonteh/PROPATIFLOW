"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, CheckCircle, Loader2, AlertCircle, User, Mail, CreditCard, ArrowRight, Home, Star } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TenantVerificationPage() {
  const router = useRouter()
  const [step, setStep] = useState<"nin" | "processing" | "success">("nin")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    ninNumber: "",
  })
  const [ninError, setNinError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ninData, setNinData] = useState<any>(null)

  const validateNIN = (nin: string) => {
    const ninRegex = /^\d{20}$/
    return ninRegex.test(nin)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleNINSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNinError("")

    if (!formData.firstName || !formData.lastName) {
      setNinError("Please enter your full name")
      return
    }

    if (!validateEmail(formData.email)) {
      setNinError("Please enter a valid email address")
      return
    }

    if (!validateNIN(formData.ninNumber)) {
      setNinError("Please enter a valid 20-digit NIN number")
      return
    }

    setIsSubmitting(true)
    setStep("processing")

    try {
      const response = await fetch("/api/verification/nin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ninNumber: formData.ninNumber,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setNinData(data.data)
        const completeResponse = await fetch("/api/verification/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ninNumber: formData.ninNumber,
            ninData: data.data,
          }),
        })

        if (completeResponse.ok) {
          setStep("success")
          setTimeout(() => {
            router.push("/tenant/dashboard")
          }, 3000)
        } else {
          const errorData = await completeResponse.json()
          setNinError(errorData.message || "Verification failed. Please try again.")
          setStep("nin")
        }
      } else {
        setNinError(data.message || "Failed to verify NIN. Please check the number and try again.")
        setStep("nin")
      }
    } catch (error) {
      setNinError("An error occurred. Please try again.")
      setStep("nin")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="container max-w-lg mx-auto px-4 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Verify Your Identity</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Complete verification to apply for properties and build your rental profile
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            step === "nin" ? "bg-primary text-primary-foreground" : "bg-green-500 text-white"
          }`}>
            {step !== "nin" ? <CheckCircle className="h-3 w-3" /> : <span>1</span>}
            <span>Details</span>
          </div>
          <div className="w-8 h-0.5 bg-muted" />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            step === "success" ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
          }`}>
            {step === "success" ? <CheckCircle className="h-3 w-3" /> : <span>2</span>}
            <span>Complete</span>
          </div>
        </div>

        {/* Form Step */}
        {step === "nin" && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleNINSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => {
                          setFormData({ ...formData, firstName: e.target.value })
                          setNinError("")
                        }}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => {
                          setFormData({ ...formData, lastName: e.target.value })
                          setNinError("")
                        }}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        setNinError("")
                      }}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                {/* NIN Field */}
                <div className="space-y-2">
                  <Label htmlFor="nin" className="text-sm font-medium">
                    National ID Number (NIN)
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nin"
                      type="text"
                      placeholder="Enter 20-digit NIN"
                      value={formData.ninNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, ninNumber: e.target.value.replace(/\D/g, "").slice(0, 20) })
                        setNinError("")
                      }}
                      maxLength={20}
                      className="pl-10 h-11 font-mono tracking-wider"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your 20-digit Tanzania National ID number
                  </p>
                </div>

                {/* Error Message */}
                {ninError && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <p className="text-sm">{ninError}</p>
                  </div>
                )}

                {/* Info Box */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your data is encrypted and securely verified with NIDA. We never store your NIN.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={
                    isSubmitting ||
                    formData.ninNumber.length !== 20 ||
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.email
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Identity
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Processing Step */}
        {step === "processing" && (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verifying Your Identity</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your information with NIDA...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {step === "success" && (
          <Card className="border-0 shadow-lg border-t-4 border-t-green-500">
            <CardContent className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Verification Complete!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your identity has been verified successfully.
              </p>
              {ninData && (
                <div className="inline-block px-4 py-2 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-sm font-medium text-green-800">{ninData.fullName}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Redirecting to dashboard...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Benefits Section */}
        {step === "nin" && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-2">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-foreground">Apply Faster</p>
              <p className="text-xs text-muted-foreground">Quick applications</p>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs font-medium text-foreground">Trusted Profile</p>
              <p className="text-xs text-muted-foreground">Build credibility</p>
            </div>
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 mb-2">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-xs font-medium text-foreground">Priority Access</p>
              <p className="text-xs text-muted-foreground">Stand out to landlords</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
