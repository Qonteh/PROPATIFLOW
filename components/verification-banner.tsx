"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface VerificationBannerProps {
  userRole: "landlord" | "tenant"
}

export function VerificationBanner({ userRole }: VerificationBannerProps) {
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "rejected" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch("/api/verification/status")
      if (response.ok) {
        const data = await response.json()
        setVerificationStatus(data.status)
      }
    } catch (error) {
      console.error("Failed to fetch verification status:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || verificationStatus === "verified") {
    return null
  }

  const verificationPath = `/${userRole}/verification`

  return (
    <Card className="mb-4 md:mb-6 border-amber-500 bg-amber-50">
      <CardContent className="p-3 md:pt-6 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
          <div className="hidden sm:flex h-8 w-8 md:h-10 md:w-10 rounded-full bg-amber-500/20 items-center justify-center shrink-0">
            <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 md:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:block">
                  <div className="sm:hidden h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="h-3 w-3 text-amber-600" />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-amber-900">Verify Your Account</h3>
                </div>
                <p className="text-xs md:text-sm text-amber-800 mt-1 mb-2 md:mb-3 leading-relaxed">
                  Complete identity verification with NIN and face ID to unlock all features.
                </p>
                {verificationStatus === "rejected" && (
                  <p className="text-xs md:text-sm text-destructive mb-2 md:mb-3">
                    Your previous verification was rejected. Please try again.
                  </p>
                )}
              </div>
              <Link href={verificationPath} className="shrink-0">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 whitespace-nowrap text-xs md:text-sm h-8 md:h-9 px-3 md:px-4 w-full sm:w-auto">
                  <ShieldCheck className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                  Verify Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
