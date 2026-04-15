"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, CreditCard, Wallet, Crown, Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Match structure from finance page
type SubscriptionTier = "bronze" | "silver" | "gold"
interface TierConfig {
  name: string
  icon: string
  units: string
  price: string
  annual: string
  color: string
  bgColor: string
  borderColor: string
}
const TIER_CONFIG: Record<SubscriptionTier, TierConfig> = {
  bronze: {
    name: "BRONZE",
    icon: "🥉",
    units: "3-10 Units",
    price: "TSh 35,000/month",
    annual: "TSh 420,000/year",
    color: "text-amber-700",
    bgColor: "bg-amber-100/50",
    borderColor: "border-amber-300",
  },
  silver: {
    name: "SILVER",
    icon: "🥈",
    units: "10-50 Units",
    price: "TSh 75,000/month",
    annual: "TSh 900,000/year",
    color: "text-slate-600",
    bgColor: "bg-slate-100/50",
    borderColor: "border-slate-300",
  },
  gold: {
    name: "GOLD",
    icon: "🥇",
    units: "50+ Units",
    price: "TSh 180,000/month",
    annual: "TSh 2,160,000/year",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100/50",
    borderColor: "border-yellow-400",
  },
}

function UpgradePaymentContent() {
  const searchParams = useSearchParams()
  const initialTier = (searchParams?.get("tier") as SubscriptionTier) || "silver"
  const [tier, setTier] = useState<SubscriptionTier>(initialTier)
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    paymentMethod: "",
    transactionId: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleTierChange = (value: string) => {
    setTier(value as SubscriptionTier)
  }

  // Update tier if query string changes
  useEffect(() => {
    if (searchParams) {
      const qTier = searchParams.get("tier") as SubscriptionTier
      if (qTier && qTier !== tier) setTier(qTier)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1800)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 relative">
      <div className="flex w-full justify-start items-center absolute top-0 left-0 p-4 z-50">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
          <ArrowLeft className="w-7 h-7 text-primary" />
        </Button>
        <span className="ml-2 text-base font-semibold text-primary">Back</span>
      </div>
      <Card className="w-full max-w-lg shadow-xl border-0 rounded-3xl mt-16">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold text-primary mb-2">Upgrade Your Plan</CardTitle>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">{TIER_CONFIG[tier].icon}</span>
            <span className={`text-lg font-bold ${TIER_CONFIG[tier].color}`}>Unlock {TIER_CONFIG[tier].name} Features</span>
          </div>
          <p className="text-sm text-muted-foreground">Choose your desired plan and complete payment to upgrade instantly.</p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h2 className="text-xl font-bold text-green-700">Upgrade Successful!</h2>
              <p className="text-sm text-muted-foreground">Your account has been upgraded to <span className={TIER_CONFIG[tier].color}>{TIER_CONFIG[tier].icon} {TIER_CONFIG[tier].name}</span> tier.</p>
              <Button className="mt-4" onClick={() => setSuccess(false)}>Upgrade Another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="mb-1 font-semibold text-xs uppercase">Select Plan</Label>
                <Select value={tier} onValueChange={handleTierChange}>
                  <SelectTrigger className="w-full rounded-xl h-12 text-base font-semibold">
                    <SelectValue placeholder="Choose plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TIER_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.icon} {config.name} — {config.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="mb-1 font-semibold text-xs uppercase">Full Name</Label>
                  <Input name="fullName" value={form.fullName} onChange={handleChange} required className="rounded-xl h-12 text-base" />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1 font-semibold text-xs uppercase">Email</Label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} required className="rounded-xl h-12 text-base" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="mb-1 font-semibold text-xs uppercase">Phone</Label>
                  <Input name="phone" value={form.phone} onChange={handleChange} required className="rounded-xl h-12 text-base" />
                </div>
                <div>
                  <Label htmlFor="paymentMethod" className="mb-1 font-semibold text-xs uppercase">Payment Method</Label>
                  <Input name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required className="rounded-xl h-12 text-base" placeholder="e.g. M-Pesa, Card, Bank" />
                </div>
              </div>
              <div>
                <Label htmlFor="transactionId" className="mb-1 font-semibold text-xs uppercase">Transaction ID</Label>
                <Input name="transactionId" value={form.transactionId} onChange={handleChange} required className="rounded-xl h-12 text-base" placeholder="Enter payment reference" />
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="text-lg font-bold text-primary">Amount: <span className={TIER_CONFIG[tier].color}>{TIER_CONFIG[tier].price}</span></div>
                <Button type="submit" className="rounded-xl h-12 px-8 text-base font-semibold flex items-center gap-2" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                  {loading ? "Processing..." : "Pay & Upgrade"}
                </Button>
              </div>
              <div className={`mt-4 p-3 rounded-xl ${TIER_CONFIG[tier].bgColor} ${TIER_CONFIG[tier].borderColor} border`}> 
                <div className="flex items-center gap-2">
                  <span className="text-xl">{TIER_CONFIG[tier].icon}</span>
                  <span className={`font-bold ${TIER_CONFIG[tier].color}`}>{TIER_CONFIG[tier].name} Plan</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{TIER_CONFIG[tier].units} • {TIER_CONFIG[tier].annual}</div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function UpgradePaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <UpgradePaymentContent />
    </Suspense>
  )
}
