"use client"
import React, { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Building, Briefcase } from "lucide-react"
import Link from "next/link"
import { PFLogo } from "./pf-logo"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type UserRole = "landlord" | "tenant" | "agent"

export default function RegisterPage() {
  // Multi-step registration state
  const [step, setStep] = useState(1)
  const [profilePhoto, setProfilePhoto] = useState<string>("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast()
  const router = require('next/navigation').useRouter();

  // Password strength (simple)
  const passwordStrength = password.length >= 8 ? "Strong" : password.length >= 6 ? "Medium" : "Weak"

  // Step 1: Choose account type
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <PFLogo className="object-contain mx-auto" size={200} />
            <h1 className="text-2xl font-bold mt-4 mb-2">What brings you to PropertyFlow Tz?</h1>
            <p className="text-muted-foreground text-sm">Choose your account type</p>
          </div>
          <div className="space-y-4">
            <button type="button" className={`w-full flex items-center gap-3 rounded-xl bg-card px-4 py-4 text-left border border-border hover:bg-primary/5 transition-all ${role === "tenant" ? "border-primary" : ""}`} onClick={() => { setRole("tenant"); setStep(2); }}>
              <User className="h-5 w-5 text-primary" />
              <span className="font-semibold">Tenant</span>
              <span className="ml-auto text-xs text-muted-foreground">Browse & rent properties</span>
            </button>
            <button type="button" className={`w-full flex items-center gap-3 rounded-xl bg-card px-4 py-4 text-left border border-border hover:bg-primary/5 transition-all ${role === "landlord" ? "border-primary" : ""}`} onClick={() => { setRole("landlord"); setStep(2); }}>
              <Building className="h-5 w-5 text-primary" />
              <span className="font-semibold">Landlord</span>
              <span className="ml-auto text-xs text-muted-foreground">List & manage rentals</span>
            </button>
          </div>
          <div className="mt-6 text-center">
            <Link href="/login" className="text-primary font-medium hover:underline">Already have an account? Sign In</Link>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Credentials
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <PFLogo className="object-contain mx-auto" size={200} />
            <h1 className="text-2xl font-bold mt-4 mb-2">Set up your account</h1>
            <p className="text-muted-foreground text-sm">Create your login credentials</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); setStep(3); }} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <div className="flex gap-2 mt-2">
                <div className={`flex-1 h-2 rounded bg-${passwordStrength === "Strong" ? "emerald-500" : passwordStrength === "Medium" ? "amber-500" : "destructive"}/30`} />
                <div className={`flex-1 h-2 rounded bg-${passwordStrength === "Strong" ? "emerald-500" : passwordStrength === "Medium" ? "amber-500" : "destructive"}/30`} />
                <div className={`flex-1 h-2 rounded bg-${passwordStrength === "Strong" ? "emerald-500" : passwordStrength === "Medium" ? "amber-500" : "destructive"}/30`} />
                <span className="ml-2 text-xs font-medium text-muted-foreground">{passwordStrength}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

    // Step 3: Profile Photo Upload
    if (step === 3) {
      const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const result = await res.json();
          if (result.file_url) {
            setProfilePhoto(result.file_url);
          } else {
            toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
          }
        } catch {
          toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
        } finally {
          setUploading(false);
        }
      };
      return (
        <div className="min-h-screen flex items-center justify-center bg-muted p-4">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mt-4 mb-2">Add a profile photo</h1>
              <p className="text-muted-foreground text-sm">Help others recognize you</p>
              <p className="text-xs text-muted-foreground mt-2">A photo helps landlords trust you<br />Also skips selfie verification later</p>
            </div>
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="h-32 w-32 rounded-full object-cover border-4 border-primary" />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                {profilePhoto && (
                  <button type="button" className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1" onClick={() => setProfilePhoto("")}>✕</button>
                )}
              </div>
              <label htmlFor="profilePhotoUpload" className="text-primary font-medium cursor-pointer">Change photo</label>
              <input id="profilePhotoUpload" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} required />
              {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary mt-2" />}
            </div>
            <div className="flex flex-col gap-3">
              <Button className="w-full" onClick={() => setStep(4)} disabled={!profilePhoto}>Continue</Button>
            </div>
            <div className="mt-6 text-center">
              <Link href="/login" className="text-primary font-medium hover:underline">Already have an account? Sign In</Link>
            </div>
          </div>
        </div>
      );
    }

  // Step 3: Review & Confirm
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call real backend API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName, phone_number: phone, role, username, avatar_url: profilePhoto })
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: "Success", description: "Your account has been created successfully. Please login." });
        router.push("/login");
      } else {
        toast({ title: "Error", description: result.message || "Registration failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Registration failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  // Step 4: Review & Confirm
  if (step === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="rounded-xl bg-card p-4 mb-4 flex items-center gap-4 shadow-lg border border-border">
              <div className="flex-shrink-0">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="h-14 w-14 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <User className="h-7 w-7 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base mb-1 truncate">{fullName}</div>
                <div className="text-sm text-muted-foreground mb-1 truncate">{email}</div>
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">{role === "tenant" ? "I am a Tenant" : "I am a Landlord"}</span>
                  <span className="px-2 py-0.5 rounded bg-muted/40 text-muted-foreground text-xs font-medium">{phone}</span>
                  <span className="px-2 py-0.5 rounded bg-muted/40 text-muted-foreground text-xs font-medium">Dar es Salaam</span>
                </div>
                {username && <div className="text-xs text-muted-foreground mb-1">@{username}</div>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username (optional)</Label>
              <Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="@username" />
              <p className="text-xs text-muted-foreground">Others can find you by your username</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="terms" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} required />
              <label htmlFor="terms" className="text-xs text-muted-foreground">I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>, including data processing under the Tanzania Personal Data Protection Act 2022.</label>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading || !acceptedTerms}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Account
            </Button>
            <div className="mt-4 text-center">
              <Link href="/login" className="text-primary font-medium hover:underline">Already have an account? Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
