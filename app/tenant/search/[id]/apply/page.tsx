"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ApplyPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [acknowledgedWarning, setAcknowledgedWarning] = useState(false)

  // Mock property data
  const property = {
    id: params.id,
    title: "Modern Downtown Loft",
    address: "Masaki Peninsula, Dar es Salaam",
    rent: 625000,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.isVerified && !acknowledgedWarning) {
      toast({
        title: "Verification Required",
        description: "Please verify your account to increase your chances of approval.",
        variant: "destructive",
      })
      setAcknowledgedWarning(true)
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)

      if (!user?.isVerified) {
        toast({
          title: "Application Submitted with Limited Status",
          description:
            "Your application has been submitted, but landlords prefer verified tenants. Please verify your account to improve your chances.",
          variant: "default",
        })
      } else {
        toast({
          title: "Application Submitted!",
          description: "Your rental application has been submitted successfully. The landlord will review it soon.",
        })
      }

      router.push("/tenant/applications")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href={`/tenant/search/${params.id}`}>
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Property
          </Button>
        </Link>

        {user && !user.isVerified && (
          <Alert className="mb-6 border-amber-500 bg-amber-50">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-900">Verification Recommended</AlertTitle>
            <AlertDescription className="text-amber-800">
              You can submit this application without verification, but landlords strongly prefer verified tenants.{" "}
              <Link href="/tenant/verification" className="font-medium underline">
                Verify your account now
              </Link>{" "}
              to significantly improve your chances of approval.
            </AlertDescription>
          </Alert>
        )}

        {/* Property Summary */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{property.title}</h2>
                <p className="text-sm text-muted-foreground mb-2">{property.address}</p>
                <p className="text-lg font-bold text-primary">Tsh {property.rent.toLocaleString()}/month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" required placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" required placeholder="Doe" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" required placeholder="+255 712 345 678" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentAddress">Current Address *</Label>
                <Textarea id="currentAddress" required placeholder="Street, City, Postal Code" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Information</CardTitle>
              <CardDescription>Your current employment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select required>
                  <SelectTrigger id="employmentStatus">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed Full-Time</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="part-time">Part-Time</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employer">Employer Name</Label>
                  <Input id="employer" placeholder="Company name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" placeholder="Your position" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (Tsh) *</Label>
                <Input id="monthlyIncome" type="number" required placeholder="1000000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employerContact">Employer Contact (Optional)</Label>
                <Input id="employerContact" placeholder="+255 712 345 678" />
              </div>
            </CardContent>
          </Card>

          {/* Rental History */}
          <Card>
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
              <CardDescription>Information about your previous rentals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="previousLandlord">Previous Landlord Name</Label>
                <Input id="previousLandlord" placeholder="Name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousLandlordContact">Previous Landlord Contact</Label>
                <Input id="previousLandlordContact" placeholder="+255 712 345 678" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="previousRent">Previous Monthly Rent (Tsh)</Label>
                  <Input id="previousRent" type="number" placeholder="500000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsRented">Years Rented</Label>
                  <Input id="yearsRented" type="number" placeholder="2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reasonForLeaving">Reason for Leaving (Optional)</Label>
                <Textarea id="reasonForLeaving" placeholder="Tell us why you're moving" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Move-in Details */}
          <Card>
            <CardHeader>
              <CardTitle>Move-in Details</CardTitle>
              <CardDescription>When would you like to move in?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="moveInDate">Desired Move-in Date *</Label>
                  <Input id="moveInDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentalDuration">How Long Do You Want to Rent? *</Label>
                  <Select required>
                    <SelectTrigger id="rentalDuration">
                      <SelectValue placeholder="Select rental duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="9">9 Months</SelectItem>
                      <SelectItem value="12">1 Year</SelectItem>
                      <SelectItem value="18">1.5 Years</SelectItem>
                      <SelectItem value="24">2 Years</SelectItem>
                      <SelectItem value="36">3 Years</SelectItem>
                      <SelectItem value="48">4 Years</SelectItem>
                      <SelectItem value="60">5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfOccupants">Number of Occupants *</Label>
                <Input id="numberOfOccupants" type="number" required placeholder="2" min="1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pets">Do you have pets?</Label>
                <Select>
                  <SelectTrigger id="pets">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="dog">Yes - Dog(s)</SelectItem>
                    <SelectItem value="cat">Yes - Cat(s)</SelectItem>
                    <SelectItem value="other">Yes - Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Upload the following documents to complete your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Government ID / Passport *</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB)</p>
                  <Input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Proof of Income (Pay stubs, bank statements) *</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB)</p>
                  <Input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>References (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB)</p>
                  <Input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Is there anything else you'd like the landlord to know?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Any additional comments..." rows={4} />
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" required />
                <div className="space-y-1">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions *
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    I certify that all information provided is true and accurate. I authorize the landlord to verify
                    this information and conduct background and credit checks.
                  </p>
                </div>
              </div>

              {user && !user.isVerified && (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="verification-acknowledgment"
                    checked={acknowledgedWarning}
                    onCheckedChange={(checked) => setAcknowledgedWarning(checked as boolean)}
                    required
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="verification-acknowledgment"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I understand that my application may be less competitive without verification *
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I acknowledge that verified tenants are prioritized by landlords. I can{" "}
                      <Link href="/tenant/verification" className="text-primary underline">
                        verify my account
                      </Link>{" "}
                      anytime to improve my standing.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Link href={`/tenant/search/${params.id}`} className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
