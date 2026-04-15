"use client";


import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Loader2 } from "lucide-react"


export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
	const [formData, setFormData] = React.useState<any>(null)
	const [images, setImages] = React.useState<string[]>([])
	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState<string | null>(null)
	const router = useRouter()

	const amenitiesList = [
		"Parking",
		"Gym",
		"Pool",
		"Laundry",
		"Dishwasher",
		"AC",
		"Heating",
		"Pet Friendly",
		"Balcony",
		"Yard",
		"Furnished",
		"Utilities Included",
	]

	const unwrappedParams = React.use(params)

	React.useEffect(() => {
		const fetchProperty = async () => {
			setLoading(true)
			setError(null)
			try {
				const res = await fetch(`/api/properties/${unwrappedParams.id}`)
				if (!res.ok) throw new Error("Failed to fetch property")
				const data = await res.json()
				if (!data.success) throw new Error(data.error || "Property not found")
						setFormData({
							title: data.property.title || "",
							description: data.property.description || "",
							propertyType: data.property.property_type || "",
							address: data.property.address || "",
							city: data.property.city || "",
							state: data.property.state || "",
							zipCode: data.property.zip_code || "",
							bedrooms: data.property.bedrooms?.toString() || "",
							bathrooms: data.property.bathrooms?.toString() || "",
							squareFeet: data.property.area_sqft?.toString() || "",
							rentAmount: data.property.rent_amount?.toString() || "",
							securityDeposit: data.property.security_deposit?.toString() || "",
							availableDate: data.property.available_from || "",
							amenities: data.property.amenities || [],
							hasPublicToilet: data.property.extra_features?.hasPublicToilet || false,
							hasSubmeters: data.property.extra_features?.hasSubmeters || false,
							electricityBillType: data.property.extra_features?.electricityBillType || '',
							electricityBillAmount: data.property.extra_features?.electricityBillAmount?.toString() || '',
							waterBillAmount: data.property.extra_features?.waterBillAmount?.toString() || '',
						})
				setImages(data.property.images || [])
			} catch (err: any) {
				setError(err.message || "Error loading property")
			} finally {
				setLoading(false)
			}
		}
		fetchProperty()
	}, [unwrappedParams.id])

	const handleAmenityToggle = (amenity: string) => {
		setFormData((prev: any) => ({
			...prev,
			amenities: prev.amenities.includes(amenity)
				? prev.amenities.filter((a: string) => a !== amenity)
				: [...prev.amenities, amenity],
		}))
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(`/api/properties/${unwrappedParams.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							title: formData.title,
							description: formData.description,
							property_type: formData.propertyType,
							address: formData.address,
							city: formData.city,
							state: formData.state,
							zip_code: formData.zipCode,
							bedrooms: Number.parseInt(formData.bedrooms),
							bathrooms: Number.parseFloat(formData.bathrooms),
							area_sqft: Number.parseInt(formData.squareFeet),
							rent_amount: Number.parseFloat(formData.rentAmount),
							security_deposit: Number.parseFloat(formData.securityDeposit),
							available_from: formData.availableDate,
							amenities: formData.amenities,
							images,
							extra_features: {
								hasPublicToilet: !!formData.hasPublicToilet,
								hasSubmeters: !!formData.hasSubmeters,
								electricityBillType: formData.electricityBillType || '',
								electricityBillAmount: formData.electricityBillAmount || '',
								waterBillAmount: formData.waterBillAmount || '',
							},
						}),
			})
			if (!res.ok) throw new Error("Failed to update property")
			router.push(`/landlord/properties/${unwrappedParams.id}`)
		} catch (err: any) {
			setError(err.message || "Error updating property")
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return <div className="p-8 flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
	}
	if (error || !formData) {
		return <div className="p-8 text-red-500">{error || "Property not found."}</div>
	}

	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Edit Property</h1>
				<p className="text-muted-foreground">Update your property details</p>
			</div>
			<form onSubmit={handleSubmit}>
				<div className="max-w-4xl space-y-6">
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
							<CardDescription>Provide the main details about your property</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="title">Property Title *</Label>
								<Input
									id="title"
									name="title"
									placeholder="e.g., Modern Downtown Apartment"
									value={formData.title}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description *</Label>
								<Textarea
									id="description"
									name="description"
									placeholder="Describe your property..."
									rows={4}
									value={formData.description}
									onChange={handleChange}
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
										name="availableDate"
										type="date"
										value={formData.availableDate}
										onChange={handleChange}
										required
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Location */}
					<Card>
						<CardHeader>
							<CardTitle>Location</CardTitle>
							<CardDescription>Where is your property located?</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="address">Street Address *</Label>
								<Input
									id="address"
									name="address"
									placeholder="123 Main Street"
									value={formData.address}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-3">
								<div className="space-y-2">
									<Label htmlFor="city">City *</Label>
									<Input
										id="city"
										name="city"
										placeholder="City"
										value={formData.city}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="state">State *</Label>
									<Input
										id="state"
										name="state"
										placeholder="State"
										value={formData.state}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="zipCode">Zip Code</Label>
									<Input
										id="zipCode"
										name="zipCode"
										placeholder="Zip Code"
										value={formData.zipCode}
										onChange={handleChange}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

								{/* Property Details & Advanced Features */}
								<Card>
									<CardHeader>
										<CardTitle>Property Details</CardTitle>
										<CardDescription>Specifications and features</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid gap-4 md:grid-cols-3">
											<div className="space-y-2">
												<Label htmlFor="bedrooms">Bedrooms *</Label>
												<Input
													id="bedrooms"
													name="bedrooms"
													type="number"
													min={0}
													value={formData.bedrooms}
													onChange={handleChange}
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="bathrooms">Bathrooms *</Label>
												<Input
													id="bathrooms"
													name="bathrooms"
													type="number"
													step="0.5"
													min={0}
													value={formData.bathrooms}
													onChange={handleChange}
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="squareFeet">Square Feet *</Label>
												<Input
													id="squareFeet"
													name="squareFeet"
													type="number"
													min={0}
													value={formData.squareFeet}
													onChange={handleChange}
													required
												/>
											</div>
										</div>

										{/* Advanced Features Section */}
										<div className="grid gap-4 md:grid-cols-2 mt-4">
											<div className="flex items-center space-x-2">
												<Checkbox
													id="hasPublicToilet"
													checked={!!formData.hasPublicToilet}
													onCheckedChange={(checked) => setFormData({ ...formData, hasPublicToilet: !!checked })}
												/>
												<label htmlFor="hasPublicToilet" className="text-sm font-medium">Public Toilet Available</label>
											</div>
											<div className="space-y-2">
												<Label>Electricity Bill Type</Label>
												<Select
													value={formData.electricityBillType || ''}
													onValueChange={(v) => setFormData({ ...formData, electricityBillType: v, electricityBillAmount: v === 'shared' ? formData.electricityBillAmount : '' })}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="individual">Individual Meter</SelectItem>
														<SelectItem value="shared">Shared/Main Meter</SelectItem>
													</SelectContent>
												</Select>
											</div>
											{/* Show electricity bill amount only if shared meter is selected */}
											{formData.electricityBillType === 'shared' && (
												<div className="space-y-2">
													<Label htmlFor="electricityBillAmount">Electricity Bill Amount (Tsh/month)</Label>
													<Input
														id="electricityBillAmount"
														name="electricityBillAmount"
														type="number"
														min={0}
														step="0.01"
														placeholder="e.g. 30000"
														value={formData.electricityBillAmount || ''}
														onChange={handleChange}
													/>
												</div>
											)}
											<div className="space-y-2">
												<Label htmlFor="waterBillAmount">Water Bill Amount (Tsh/month)</Label>
												<Input
													id="waterBillAmount"
													name="waterBillAmount"
													type="number"
													min={0}
													step="0.01"
													placeholder="e.g. 20000"
													value={formData.waterBillAmount || ''}
													onChange={handleChange}
												/>
											</div>
											<div className="flex items-center space-x-2">
												<Checkbox
													id="hasSubmeters"
													checked={!!formData.hasSubmeters}
													onCheckedChange={(checked) => setFormData({ ...formData, hasSubmeters: !!checked })}
												/>
												<label htmlFor="hasSubmeters" className="text-sm font-medium">Submeters Installed</label>
											</div>
										</div>

										<div className="grid gap-4 md:grid-cols-2 mt-4">
											<div className="space-y-2">
												<Label htmlFor="rentAmount">Monthly Rent ($) *</Label>
												<Input
													id="rentAmount"
													name="rentAmount"
													type="number"
													min={0}
													step="0.01"
													placeholder="2500"
													value={formData.rentAmount}
													onChange={handleChange}
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="securityDeposit">Security Deposit ($) *</Label>
												<Input
													id="securityDeposit"
													name="securityDeposit"
													type="number"
													min={0}
													step="0.01"
													placeholder="2500"
													value={formData.securityDeposit}
													onChange={handleChange}
													required
												/>
											</div>
										</div>
									</CardContent>
								</Card>

					{/* Amenities */}
					<Card>
						<CardHeader>
							<CardTitle>Amenities</CardTitle>
							<CardDescription>Select amenities available</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-4">
								{amenitiesList.map((amenity) => (
									<div key={amenity} className="flex items-center gap-2">
										<Checkbox
											id={amenity}
											checked={formData.amenities.includes(amenity)}
											onCheckedChange={() => handleAmenityToggle(amenity)}
										/>
										<label
											htmlFor={amenity}
											className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											{amenity}
										</label>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Images */}
					<Card>
						<CardHeader>
							<CardTitle>Photos</CardTitle>
							<CardDescription>Add photos of your property (optional)</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<>
									<input
										id="property-image-upload"
										type="file"
										accept="image/*"
										multiple
										style={{ display: "none" }}
										onChange={async (e) => {
											const files = Array.from(e.target.files || [])
											// Simulate upload and get URLs (replace with real upload logic)
											const urls = files.map((file) => URL.createObjectURL(file))
											setImages((prev) => [...prev, ...urls])
										}}
									/>
									<Button
										type="button"
										variant="outline"
										className="w-full bg-transparent"
										onClick={() => document.getElementById("property-image-upload")?.click()}
									>
										<Upload className="h-4 w-4 mr-2" />
										Upload Photos
									</Button>
								</>

								{images.length > 0 && (
									<div className="grid gap-4 md:grid-cols-4">
										{images.map((img, index) => (
											<div key={index} className="relative aspect-video rounded-lg bg-muted overflow-hidden">
												<img
													src={img || "/placeholder.svg"}
													alt={`Property ${index + 1}`}
													className="w-full h-full object-cover"
												/>
												<Button
													type="button"
													size="icon"
													variant="destructive"
													className="absolute top-2 right-2"
													onClick={() => setImages(images.filter((_, i) => i !== index))}
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
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								<>Save Changes</>
							)}
						</Button>
					</div>
				</div>
			</form>
		</div>
	)
}
