"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/auth-context"
import Link from "next/link"
import Image from "next/image"

export default function NewPropertyPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  // Store both image and video URLs
  const [media, setMedia] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    address: "",
    city: "",
    electricityBillAmount: "",
    state: "",
    zipCode: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    rentAmount: "",
    securityDeposit: "",
    availableDate: "",
    amenities: [] as string[],
    hasPublicToilet: false,
    electricityBillType: "individual",
    waterBillAmount: "",
    hasSubmeters: false,
  })
  const { t } = useLanguage();

  const amenitiesList = [
    "Parking",
    "Gym",
    "Pool",
    "Dishwasher",
    "AC",
    "Heating",
    "Pet Friendly",
    "Balcony",
    "Yard",
    "Furnished",
    "Utilities Included",
  ]

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  // Unified handler for both images and videos
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploadingImages(true)
    const uploaded: string[] = []

    for (const file of files) {
      const formDataData = new FormData()
      formDataData.append("file", file)
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataData,
        })
        if (!res.ok) {
          const errorText = await res.text()
          console.error("Upload error:", errorText)
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          })
          continue
        }
        const data = await res.json()
        if (data.success && data.url) {
          uploaded.push(data.url)
        } else if (data.success && data.filename) {
          uploaded.push(`/uploads/${data.filename}`)
        } else {
          toast({
            title: "Upload Failed",
            description: data.error || "Could not upload file",
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Upload error:", err)
        toast({
          title: "Upload Error",
          description: err instanceof Error ? err.message : "Failed to upload file",
          variant: "destructive",
        })
      }
    }

    if (uploaded.length > 0) {
      setMedia((prev) => [...prev, ...uploaded])
      toast({
        title: "Success",
        description: `Uploaded ${uploaded.length} file${uploaded.length > 1 ? 's' : ''}`,
      })
    }

    setUploadingImages(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (
        !formData.title ||
        !formData.description ||
        !formData.propertyType ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.rentAmount
      ) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields: Title, Description, Property Type, Address, City, State, Rent Amount",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          property_type: formData.propertyType,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          bedrooms: Number.parseInt(formData.bedrooms) || 0,
          bathrooms: Number.parseFloat(formData.bathrooms) || 0,
          area_sqft: Number.parseInt(formData.squareFeet) || 0,
          rent_amount: Number.parseFloat(formData.rentAmount) || 0,
          security_deposit: Number.parseFloat(formData.securityDeposit) || 0,
          available_from: formData.availableDate,
          amenities: formData.amenities,
          media: media, // send both images and videos
        }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to create property")
      }
      toast({
        title: "Success",
        description: "Property created successfully",
      })
      router.push("/landlord/properties")
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMediaUrl = (file: string) => {
    if (file.startsWith('http')) return file
    if (file.startsWith('/uploads/')) return file
    return `/uploads/${file}`
  }

  // Helper to check if file is video
  const isVideo = (file: string) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(file)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("add_new_property")}</h1>
        <p className="text-muted-foreground">{t("list_a_new_property_for_rent")}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("basic_information")}</CardTitle>
              <CardDescription>{t("provide_main_details_about_property")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("property_title")} *</Label>
                <Input
                  id="title"
                  placeholder={t("eg_modern_downtown_apartment")}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("description")} *</Label>
                <Textarea
                  id="description"
                  placeholder={t("describe_your_property")}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(v) => setFormData({ ...formData, propertyType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableDate">Available Date *</Label>
                  <Input
                    id="availableDate"
                    type="date"
                    value={formData.availableDate}
                    onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>{t("location")}</CardTitle>
              <CardDescription>{t("where_is_your_property_located")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">{t("street_address")} *</Label>
                <Input
                  id="address"
                  placeholder={t("eg_123_main_street")}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">{t("city")} *</Label>
                  <Select value={formData.city} onValueChange={(v) => setFormData({ ...formData, city: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("select_city")}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dar-es-salaam">Dar es Salaam</SelectItem>
                      <SelectItem value="arusha">Arusha</SelectItem>
                      <SelectItem value="mwanza">Mwanza</SelectItem>
                      <SelectItem value="dodoma">Dodoma</SelectItem>
                      <SelectItem value="zanzibar">Zanzibar</SelectItem>
                      <SelectItem value="mbeya">Mbeya</SelectItem>
                      <SelectItem value="morogoro">Morogoro</SelectItem>
                      <SelectItem value="tanga">Tanga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">{t("region")} *</Label>
                  <Input
                    id="state"
                    placeholder={t("eg_kinondoni")}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">{t("postal_code")}</Label>
                  <Input
                    id="zipCode"
                    placeholder={t("optional")}
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t("property_details")}</CardTitle>
              <CardDescription>{t("specifications_and_features")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">{t("bedrooms")} *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    placeholder={t("eg_2")}
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">{t("bathrooms")} *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder={t("eg_2")}
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="squareFeet">{t("squareFeet")} *</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    min="0"
                    placeholder={t("eg_1200")}
                    value={formData.squareFeet}
                    onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* New Features Section */}
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPublicToilet"
                    checked={formData.hasPublicToilet}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasPublicToilet: !!checked })}
                  />
                  <label htmlFor="hasPublicToilet" className="text-sm font-medium">{t("public_toilet_available")}</label>
                </div>
                <div className="space-y-2">
                  <Label>{t("electricity_bill_type")}</Label>
                  <Select
                    value={formData.electricityBillType}
                    onValueChange={(v) => setFormData({ ...formData, electricityBillType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select_type")}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">{t("individual_meter")}</SelectItem>
                      <SelectItem value="shared">{t("shared_main_meter")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Show electricity bill amount only if shared meter is selected */}
                {formData.electricityBillType === 'shared' && (
                  <div className="space-y-2">
                    <Label htmlFor="electricityBillAmount">{t("electricity_bill_amount")}</Label>
                    <Input
                      id="electricityBillAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={t("eg_30000")}
                      value={formData.electricityBillAmount}
                      onChange={e => setFormData({ ...formData, electricityBillAmount: e.target.value })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="waterBillAmount">{t("water_bill_amount")}</Label>
                  <Input
                    id="waterBillAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={t("eg_20000")}
                    value={formData.waterBillAmount}
                    onChange={e => setFormData({ ...formData, waterBillAmount: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasSubmeters"
                    checked={formData.hasSubmeters}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasSubmeters: !!checked })}
                  />
                  <label htmlFor="hasSubmeters" className="text-sm font-medium">{t("submeters_installed")}</label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="rentAmount">{t("monthly_rent")} (Tsh) *</Label>
                  <Input
                    id="rentAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={t("eg_500000")}
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityDeposit">{t("security_deposit")} (Tsh) *</Label>
                  <Input
                    id="securityDeposit"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={t("eg_500000")}
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>{t("amenities")}</CardTitle>
              <CardDescription>{t("select_all_that_apply")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <label
                      htmlFor={amenity}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t(amenity.replace(/\s+/g, '_').toLowerCase())}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>{t("photos")}</CardTitle>
              <CardDescription>{t("add_photos_of_your_property")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  id="property-media-upload"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleMediaUpload}
                  disabled={uploadingImages}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImages}
                >
                  {uploadingImages ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {t("upload_photos")}
                    </>
                  )}
                </Button>

                {media.length > 0 && (
                  <div className="grid gap-4 md:grid-cols-4">
                    {media.map((file, index) => (
                      <div key={index} className="relative aspect-video rounded-lg bg-muted overflow-hidden group">
                        {isVideo(file) ? (
                          <video
                            src={getMediaUrl(file)}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={getMediaUrl(file)}
                            alt={`Property media ${index + 1}`}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        )}
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setMedia(media.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent">
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading || uploadingImages}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("add_property")}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}