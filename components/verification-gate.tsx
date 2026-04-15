"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"

interface VerificationGateProps {
  userRole: "landlord" | "tenant"
  action: string
}

export function VerificationGate({ userRole, action }: VerificationGateProps) {
  const { user } = useAuth()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show if user is loaded and not verified
    if (user && !user.isVerified) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [user])

  if (!show) {
    return null
  }

  const verificationPath = `/${userRole}/verification`

  return (
    <Card className="mb-6 border-amber-500 bg-amber-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-amber-900 mb-1">Verify Your Account to {action}</h3>
                <p className="text-sm text-amber-800 mb-3">
                  {userRole === "landlord"
                    ? "You must complete identity verification before you can post or manage properties. This helps maintain trust and security on our platform."
                    : "Verify your identity to increase your chances of getting approved by landlords. Verified tenants are prioritized in applications."}
                </p>
              </div>
              <Link href={verificationPath}>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 whitespace-nowrap">
                  <ShieldCheck className="h-4 w-4 mr-2" />
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
