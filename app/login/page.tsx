"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { PFLogo } from "./pf-logo"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Success",
        description: "You have been logged in successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <PFLogo className="object-contain mx-auto" size={160} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("welcome_back")}</h1>
          <p className="text-muted-foreground text-sm md:text-base">{t("sign_in_to_continue")}</p>
        </div>

        <Card className="shadow-lg border-2 border-border">
          <CardHeader>
            <CardTitle>{t("sign_in")}</CardTitle>
            <CardDescription>{t("enter_email_password")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("email_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    {t("forgot_password")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("password_placeholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("signing_in")}
                  </>
                ) : (
                  t("sign_in")
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                {t("dont_have_account")}{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  {t("sign_up")}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Demo accounts section removed */}
      </div>
    </div>
  )
}
