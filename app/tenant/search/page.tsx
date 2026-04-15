"use client"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Bed, Bath, Ruler, Heart, X, Home, Phone, Mail, CheckCircle, ArrowRight, AlertTriangle, Eye, Volume2, VolumeX, Play, Pause } from "lucide-react"
import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"

/* ========================================== */
/* --- Translations for the search page      */
/* ========================================== */
const translations = {
  en: {
    // Welcome Header
    welcomeBack: "Welcome back,",
    switchLanguage: "Switch language",
    
    // Header
    findYourPerfectHome: "Find Your Perfect Home",
    browsePropertiesAndConnect: "Browse properties and connect with landlords directly",
    saved: "saved",
    
    // Search
    searchPlaceholder: "Search by property name, location, or address...",
    
    // Filters
    all: "All",
    amenities: "Amenities:",
    
    // Results
    propertiesFound: "properties found",
    
    // Empty State
    noPropertiesFound: "No Properties Found",
    noPropertiesDesc: "Try adjusting your search criteria or browse all available properties",
    resetSearch: "Reset Search",
    
    // Property Card
    bed: "bed",
    bath: "bath",
    sqft: "sqft",
    unknownLandlord: "Unknown Landlord",
    viewDetails: "View Details",
    rentNow: "Rent Now",
    available: "Available",
    occupied: "Occupied",
    viewLandlordProfile: "View landlord profile",
    seeAllProperties: "See all properties",
    removeFromFavorites: "Remove from favorites",
    addToFavorites: "Add to favorites",
    
    // Landlord Modal
    landlordProfile: "Landlord Profile",
    landlordProfileDesc: "View landlord details and all their properties",
    memberSince: "Member since",
    properties: "properties",
    rating: "Rating",
    response: "Response",
    allPropertiesBy: "All Properties by",
    details: "Details",
    perMonth: "per month",
    
    // Warning Dialog
    propertyOccupied: "Property Occupied",
    propertyOccupiedDesc: "This property is already rented/occupied. You cannot rent this property.",
    close: "Close",
    
    // Status
    verified: "Verified",
    rented: "Rented",
    
    // Currency
    tsh: "Tsh",
  },
  sw: {
    // Welcome Header
    welcomeBack: "Karibu tena,",
    switchLanguage: "Badilisha lugha",
    
    // Header
    findYourPerfectHome: "Tafuta Nyumba Yako Bora",
    browsePropertiesAndConnect: "Vinjali mali na wasiliana na wamiliki moja kwa moja",
    saved: "zilizohifadhiwa",
    
    // Search
    searchPlaceholder: "Tafuta kwa jina la nyumba, eneo, au anuani...",
    
    // Filters
    all: "Zote",
    amenities: "Huduma:",
    
    // Results
    propertiesFound: "mali zimepatikana",
    
    // Empty State
    noPropertiesFound: "Hakuna Mali Zilizopatikana",
    noPropertiesDesc: "Jaribu kubadilisha vigezo vyako vya utafutaji au vinjali mali zote zinazopatikana",
    resetSearch: "Weka upya Utafutaji",
    
    // Property Card
    bed: "chumba",
    bath: "bafu",
    sqft: "futi²",
    unknownLandlord: "Mmiliki Asiyejulikana",
    viewDetails: "Angalia Maelezo",
    rentNow: "Kodi Sasa",
    available: "Inapatikana",
    occupied: "Imekalishwa",
    viewLandlordProfile: "Angalia wasifu wa mmiliki",
    seeAllProperties: "Angalia mali zote",
    removeFromFavorites: "Ondoa kwenye vipendwa",
    addToFavorites: "Ongeza kwenye vipendwa",
    
    // Landlord Modal
    landlordProfile: "Wasifu wa Mmiliki",
    landlordProfileDesc: "Angalia maelezo ya mmiliki na mali zao zote",
    memberSince: "Mwanachama tangu",
    properties: "mali",
    rating: "Ukadiriaji",
    response: "Mwitikio",
    allPropertiesBy: "Mali Zote za",
    details: "Maelezo",
    perMonth: "kwa mwezi",
    
    // Warning Dialog
    propertyOccupied: "Nyumba Imekalishwa",
    propertyOccupiedDesc: "Nyumba hii tayari imekalishwa. Huwezi kuikodi.",
    close: "Funga",
    
    // Status
    verified: "Imethibitishwa",
    rented: "Imekalishwa",
    
    // Currency
    tsh: "Tsh",
  }
}

interface Landlord {
  id: string
  name: string
  phone?: string
  verified?: boolean
  email?: string
  rating?: number
  totalProperties?: number
  responseTime?: string
  avatar?: string
  joinDate?: string
}

interface Property {
  id: string
  title: string
  address: string
  rent: number
  bedrooms: number
  bathrooms: number
  sqft: number
  type: string
  status: 'available' | 'rented'
  media?: string[]
  image?: string
  description: string
  amenities: string[]
  landlordId: string
  landlordName?: string
  landlordPhone?: string
  landlordVerified?: boolean
  landlordEmail?: string
  landlordRating?: number
  landlordResponseTime?: string
  landlordAvatar?: string
  landlordJoinDate?: string
  images?: string[] | string
}

export default function TenantSearchPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [alphabet, setAlphabet] = useState("")
  const [feature, setFeature] = useState("")
  const [selectedLandlord, setSelectedLandlord] = useState<Landlord | null>(null)
  const [landlordProperties, setLandlordProperties] = useState<Property[]>([])
  const [isLandlordModalOpen, setIsLandlordModalOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const feedRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  
  // Get current language translations
  const currentT = language === 'en' ? translations.en : translations.sw

  // Helper function to get media URL
  const getMediaUrl = (file: string) => {
    if (file.startsWith('data:')) return file;
    if (file.startsWith('http')) return file;
    if (file.startsWith('/uploads/')) return file;
    return `/uploads/${file}`;
  };

  const parseMediaList = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v).trim()).filter(Boolean)
    }

    if (typeof value === "string") {
      const trimmed = value.trim()
      if (!trimmed) return []

      if (trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed)
          if (Array.isArray(parsed)) {
            return parsed.map((v) => String(v).trim()).filter(Boolean)
          }
        } catch {
          // Fall through to simple parsing
        }
      }

      if (trimmed.includes(",")) {
        return trimmed.split(",").map((v) => v.trim()).filter(Boolean)
      }

      return [trimmed]
    }

    return []
  }

  const isVideoFile = (file: string) => /\.(mp4|webm|ogg|mov)$/i.test(file)

  const getNormalizedPropertyMedia = (property: Partial<Property> & { media?: unknown; images?: unknown; image?: unknown }): string[] => {
    const media = parseMediaList(property.media)
    if (media.length > 0) return media

    const images = parseMediaList(property.images)
    if (images.length > 0) return images

    if (typeof property.image === "string" && property.image.trim()) {
      return [property.image.trim()]
    }

    return []
  }

  useEffect(() => {
    fetchProperties()
    const savedFavorites = localStorage.getItem("propertyFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    let filtered = [...properties]
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (alphabet && alphabet !== "all") {
      filtered = filtered.filter(p => p.title?.toLowerCase().startsWith(alphabet.toLowerCase()))
    }
    if (feature && feature !== "all") {
      filtered = filtered.filter(p => Array.isArray(p.amenities) && p.amenities.includes(feature))
    }
    setFilteredProperties(filtered)
  }, [searchTerm, alphabet, feature, properties])

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en')
  }

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/properties")
      const contentType = res.headers.get("content-type") || ""
      if (!contentType.includes("application/json")) {
        const text = await res.text()
        console.error("Properties API returned HTML:", text.substring(0, 500))
        const mockProperties: Property[] = [
          {
            id: "1",
            title: "Demo Property",
            address: "Demo Address, City",
            rent: 500000,
            bedrooms: 2,
            bathrooms: 1,
            sqft: 1000,
            type: "Apartment",
            status: "available",
            image: "",
            description: "Demo property for development.",
            amenities: ["wifi", "parking"],
            landlordId: "1",
            landlordName: "Demo Landlord",
            landlordPhone: "",
            landlordVerified: false,
          }
        ]
        setProperties(mockProperties)
        return
      }
      const data = await res.json()
      if (data.success) {
        const formattedProperties = (data.properties || []).map((p: any) => ({
          ...p,
          media: getNormalizedPropertyMedia(p),
          image: typeof p.image === "string" && p.image.trim() ? p.image : parseMediaList(p.images)[0] || undefined,
          ...p,
          id: p.id,
          title: p.title || "Untitled Property",
          address: p.address || "Location not specified",
          rent: p.rent_amount || p.rent || 0,
          bedrooms: p.bedrooms || 0,
          bathrooms: p.bathrooms || 0,
          sqft: p.sqft || p.square_feet || "--",
          type: p.property_type || "Property",
          status: p.status || "available",
          description: p.description || "No description available",
          amenities: Array.isArray(p.amenities) ? p.amenities : (p.amenities ? JSON.parse(p.amenities) : []),
          landlordId: p.landlord_id || "1",
          landlordName: p.landlord_name,
          landlordPhone: p.landlord_phone,
          landlordVerified: p.landlord_verified,
          landlordAvatar: p.landlord_avatar,
        }))
        setProperties(formattedProperties)
      } else {
        setProperties([])
      }
    } catch (err) {
      console.error("Error fetching properties:", err)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
      localStorage.setItem("propertyFavorites", JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const handleViewLandlord = (property: Property) => {
    const landlord: Landlord = {
      id: property.landlordId,
      name: property.landlordName || currentT.unknownLandlord,
      phone: property.landlordPhone,
      verified: property.landlordVerified,
      email: property.landlordEmail,
      rating: property.landlordRating,
      responseTime: property.landlordResponseTime,
      avatar: property.landlordAvatar,
      joinDate: property.landlordJoinDate,
    }
    setSelectedLandlord(landlord)
    const landlordProps = properties.filter(p => p.landlordId === property.landlordId)
    setLandlordProperties(landlordProps)
    setIsLandlordModalOpen(true)
  }

  const handleRentNow = (property: Property) => {
    if (property.status === 'rented') {
      setSelectedProperty(property);
    } else {
      // Navigate to correct renting form page
      toast({
        title: language === 'en' ? "Redirecting..." : "Inaelekeza...",
        description: language === 'en' ? `Preparing rental for ${property.title}` : `Inaandaa kukodisha ${property.title}`,
      });
      router.push(`/tenant/properties/${property.id}/apply`);
    }
  };

  const alphabetChips = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  const amenities = ["wifi", "parking", "pool", "gym", "security", "garden"]

  // Property Details Modal Component - Standalone that can show ANY property
  const PropertyDetailsModal = ({ 
    property, 
    isOpen, 
    onClose, 
    onSwitchProperty,
    onJumpToProperty
  }: { 
    property: Property | null; 
    isOpen: boolean; 
    onClose: () => void;
    onSwitchProperty: (p: Property) => void;
    onJumpToProperty?: (p: Property) => void;
  }) => {
    if (!property) return null;
    
    const landlordProps = properties.filter(p => p.landlordId === property.landlordId);
    
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg w-[95vw] bg-gradient-to-b from-card to-card/95 text-card-foreground border-border rounded-3xl max-h-[90vh] overflow-y-auto p-0">
                    <DialogTitle className="sr-only">{property.title}</DialogTitle>
          {/* Hero Header with Property Image */}
          <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
            <img
              src={property.media && property.media.length > 0 
                ? getMediaUrl(property.media[0])
                : property.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23374151' width='800' height='600'/%3E%3Ctext fill='%239CA3AF' font-family='sans-serif' font-size='32' text-anchor='middle' x='400' y='300'%3ENo Image%3C/text%3E%3C/svg%3E"
              }
              alt={property.title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            {/* Status Badge */}
            <Badge 
              className={`absolute top-4 left-4 text-xs px-3 py-1.5 font-semibold ${
                property.status === 'available' 
                  ? 'bg-emerald-500 text-white border-0' 
                  : 'bg-amber-500 text-white border-0'
              }`}
            >
              {property.status === 'available' ? currentT.available : currentT.rented}
            </Badge>
            {/* Close button */}
            <DialogClose className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
              <X className="w-4 h-4" />
            </DialogClose>
            
            {/* Landlord Profile - Floating at bottom of hero */}
            <button
              onClick={() => handleViewLandlord(property)}
              className="absolute bottom-3 left-4 flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-full pr-4 pl-1 py-1 hover:bg-black/60 transition-colors"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary ring-offset-1 ring-offset-black/50">
                  <img
                    src={property.landlordAvatar || `https://ui-avatars.com/api/?name=${property.landlordName || 'Landlord'}&background=9A5B2F&color=fff&size=100`}
                    alt={property.landlordName || 'Landlord'}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                {property.landlordVerified && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-primary rounded-full p-0.5">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">{property.landlordName || currentT.unknownLandlord}</p>
                <p className="text-white/70 text-xs flex items-center gap-1">
                  <span>{landlordProps.length} {currentT.properties || 'properties'}</span>
                  {property.landlordVerified && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                </p>
              </div>
            </button>
          </div>
          
          {/* Content */}
          <div className="px-5 pb-6 pt-4 relative z-10">
            {/* Title & Location */}
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-foreground">{property.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                {property.address}
              </DialogDescription>
            </DialogHeader>

            {/* Price Card */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 mb-5 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">{currentT.perMonth}</p>
              <p className="text-3xl font-bold text-primary">{currentT.tsh} {property.rent.toLocaleString()}</p>
            </div>
          
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              <div className="bg-secondary/50 rounded-2xl p-3 flex flex-col items-center border border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Bed className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-lg">{property.bedrooms}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{currentT.bed}</span>
              </div>
              <div className="bg-secondary/50 rounded-2xl p-3 flex flex-col items-center border border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Bath className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-lg">{property.bathrooms}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{currentT.bath}</span>
              </div>
              <div className="bg-secondary/50 rounded-2xl p-3 flex flex-col items-center border border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Ruler className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-lg">{property.sqft}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{currentT.sqft}</span>
              </div>
              <div className="bg-secondary/50 rounded-2xl p-3 flex flex-col items-center border border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-sm truncate w-full text-center">{property.type}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Type</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full"></span>
                Description
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
            </div>
            
            {/* Amenities */}
            <div className="mb-5">
              <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full"></span>
                {currentT.amenities}
              </h4>
              <div className="flex flex-wrap gap-2">
                {property.amenities && property.amenities.length > 0 ? (
                  property.amenities.map((amenity, idx) => (
                    <Badge key={idx} variant="secondary" className="capitalize px-3 py-1.5 rounded-full bg-secondary/80 text-foreground border border-border/50">
                      {amenity}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No amenities listed</span>
                )}
              </div>
            </div>

            {/* All Properties by Landlord - FIXED: Now properly switches properties */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full"></span>
                {currentT.allPropertiesBy} {property.landlordName}
                <Badge variant="secondary" className="ml-auto text-xs">
                  {landlordProps.length}
                </Badge>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {landlordProps.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      // FIXED: Directly switch to the new property
                      onSwitchProperty(p);
                      // Also jump to property in main feed if handler provided
                      if (onJumpToProperty) {
                        onJumpToProperty(p);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      p.id === property.id 
                        ? 'bg-primary/10 border-primary/30 ring-2 ring-primary/20' 
                        : 'bg-secondary/50 border-border/50 hover:bg-secondary/80 hover:border-primary/20'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      <img
                        src={p.media && p.media.length > 0 
                          ? getMediaUrl(p.media[0])
                          : p.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23374151' width='100' height='100'/%3E%3C/svg%3E"
                        }
                        alt={p.title}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-foreground">{p.title}</p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {p.address}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{p.bedrooms} bed</span>
                        <span className="text-muted-foreground/50">|</span>
                        <span className="text-xs text-muted-foreground">{p.bathrooms} bath</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end min-w-[70px]">
                      <span className="text-primary font-bold text-base">{currentT.tsh} {p.rent.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground">{currentT.perMonth}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => {
                onClose();
                handleRentNow(property);
              }}
              className="w-full mt-5 bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl font-semibold text-base shadow-lg shadow-primary/20"
            >
              {currentT.rentNow}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Desktop Card Component - Grid Layout
  const DesktopPropertyCard = ({ property }: { property: Property }) => {
        const toggleMute = () => {
          if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
          }
        };
      const [showPhone, setShowPhone] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [detailProperty, setDetailProperty] = useState<Property>(property);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const isVideo = (file: string) => {
      return /\.(mp4|webm|ogg|mov)$/i.test(file);
    };

    const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23374151' width='800' height='600'/%3E%3Ctext fill='%239CA3AF' font-family='sans-serif' font-size='32' text-anchor='middle' x='400' y='300'%3ENo Image%3C/text%3E%3C/svg%3E";
    
    const primaryMedia = property.media && property.media.length > 0 
      ? property.media[0] 
      : property.image || placeholderImg;
    
    const isPrimaryVideo = isVideo(primaryMedia);

    const togglePlayPause = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    };

    // Reset detailProperty to the card's property when opening
    const handleOpenDetails = () => {
      setDetailProperty(property);
      setShowDetails(true);
    };

    return (
      <>
        <Card className="overflow-hidden bg-card border-border hover:shadow-2xl transition-shadow duration-300 group w-full max-w-xl mx-auto min-h-[440px]">
          {/* Media Section */}
          <div className="relative aspect-[16/9] overflow-hidden min-h-[320px]">
            {isPrimaryVideo ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={getMediaUrl(primaryMedia)}
                  className="w-full h-full object-cover cursor-pointer"
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                  poster="/video-placeholder.png"
                  onClick={togglePlayPause}
                />
                {/* Play/Pause overlay for video */}
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                    onClick={togglePlayPause}
                  >
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-black ml-1" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <img
                src={getMediaUrl(primaryMedia)}
                alt={property.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Status Badge */}
            <Badge 
              className={`absolute top-3 left-3 text-xs px-3 py-1 ${
                property.status === 'available' 
                  ? 'bg-emerald-500/90 text-white border-0' 
                  : 'bg-amber-500/90 text-white border-0'
              }`}
            >
              {property.status === 'available' ? currentT.available : currentT.rented}
            </Badge>

            {/* Favorite Button */}
            <div className="absolute right-3 flex flex-col items-end gap-2 z-20" style={{ top: '70px' }}>
              <button
                onClick={() => toggleFavorite(property.id)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md"
              >
                <Heart 
                  className={`w-5 h-5 transition-all ${
                    favorites.includes(property.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-600'
                  }`} 
                />
              </button>
              {/* Speaker/Volume icons and call button below */}
              {isPrimaryVideo && (
                <div className="flex flex-col items-end gap-2" style={{ marginTop: '40px' }}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlayPause}
                      className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                  <a
                    href={`tel:${property.landlordPhone}`}
                    className="group"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, border: 'none', background: 'none', boxShadow: 'none', outline: 'none' }}
                    title="Call landlord"
                  >
                    <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                      <Phone className="w-6 h-6" style={{ color: 'var(--primary-foreground)' }} />
                    </span>
                  </a>
                </div>
              )}
              {!isPrimaryVideo && (
                <a
                  href={`tel:${property.landlordPhone}`}
                  className="group"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, border: 'none', background: 'none', boxShadow: 'none', outline: 'none' }}
                  title="Call landlord"
                >
                  <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                    <Phone className="w-6 h-6" style={{ color: 'var(--primary-foreground)' }} />
                  </span>
                </a>
              )}
            </div>

            {/* Landlord Avatar - Bottom Left */}
            <button
              onClick={() => handleViewLandlord(property)}
              className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full pr-3 pl-1 hover:bg-black/70 transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary">
                  <img
                    src={property.landlordAvatar || `https://ui-avatars.com/api/?name=${property.landlordName || 'Landlord'}&background=9A5B2F&color=fff&size=100`}
                    alt={property.landlordName || 'Landlord'}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                {property.landlordVerified && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-primary rounded-full p-0.5">
                    <CheckCircle className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <span className="text-white text-xs font-medium">{property.landlordName || currentT.unknownLandlord}</span>
            </button>
          </div>
  
          {/* Content Section */}
          <CardContent className="p-6 lg:p-8">
            {/* Title */}
            <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">
              {property.title}
            </h3>
            
            {/* Location */}
            <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm line-clamp-1">{property.address}</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary text-xl font-bold">
                  {currentT.tsh} {property.rent.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-xs">{currentT.perMonth}</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenDetails}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <Eye className="w-5 h-5 text-foreground" />
                </button>
                <Button
                  onClick={() => handleRentNow(property)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-4"
                >
                  {currentT.rentNow}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details Modal - FIXED: Uses detailProperty state */}
        <PropertyDetailsModal
          property={detailProperty}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          onSwitchProperty={(p) => setDetailProperty(p)}
          onJumpToProperty={(p) => {
            // Close modal and scroll to the clicked property
            setShowDetails(false);
            scrollToProperty(p.id);
          }}
        />
      </>
    )
  }

  // Mobile Instagram-style Property Card - Full Screen
  const PropertyCard = ({ property, isActive }: { property: Property; isActive: boolean }) => {
      const [showPhone, setShowPhone] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [detailProperty, setDetailProperty] = useState<Property>(property);
    const [showWarning, setShowWarning] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    
    const isVideo = (file: string) => {
      return /\.(mp4|webm|ogg|mov)$/i.test(file);
    };

    // Gray placeholder as data URL fallback
    const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23374151' width='800' height='600'/%3E%3Ctext fill='%239CA3AF' font-family='sans-serif' font-size='32' text-anchor='middle' x='400' y='300'%3ENo Image%3C/text%3E%3C/svg%3E";
    
    const primaryMedia = property.media && property.media.length > 0 
      ? property.media[0] 
      : property.image || placeholderImg;
    
    const isPrimaryVideo = isVideo(primaryMedia);

    // Handle video play/pause based on visibility
    useEffect(() => {
      if (!videoRef.current) return;
      
      if (isActive && isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }, [isActive, isPlaying]);

    // Intersection Observer for auto-play
    useEffect(() => {
      if (!cardRef.current || !videoRef.current) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
              if (isPlaying) {
                videoRef.current?.play().catch(() => {});
              }
            } else {
              videoRef.current?.pause();
            }
          });
        },
        { threshold: [0.7] }
      );
      
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }, [isPlaying]);

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };

    const togglePlayPause = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    };

    // Reset detailProperty to the card's property when opening
    const handleOpenDetails = () => {
      setDetailProperty(property);
      setShowDetails(true);
    };

    return (
      <>
        <div 
          ref={cardRef}
          data-property-id={property.id}
          className="relative w-full h-[100dvh] snap-start snap-always flex-shrink-0 bg-black"
        >
          {/* Full Screen Media */}
          <div className="absolute inset-0 w-full h-full z-0">
            {isPrimaryVideo ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={getMediaUrl(primaryMedia)}
                  className="w-full h-full object-cover cursor-pointer"
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                  poster="/video-placeholder.png"
                  onClick={togglePlayPause}
                />
                {/* Play/Pause overlay when paused - only covers center area, not edges */}
                {!isPlaying && (
                  <div 
                    className="absolute inset-x-16 inset-y-32 flex items-center justify-center bg-black/20 cursor-pointer rounded-2xl z-10"
                    onClick={togglePlayPause}
                  >
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-10 h-10 text-black ml-1" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <img
                src={getMediaUrl(primaryMedia)}
                alt={property.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            )}
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
          </div>

          {/* Top Bar - Profile & Actions */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-[calc(env(safe-area-inset-top)+16px)]">
            <div className="flex items-center justify-between">
              {/* Landlord Profile - Avatar first (sticky left), then Name */}
              <button
                onClick={() => handleViewLandlord(property)}
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-black/50 overflow-hidden">
                    <img
                      src={property.landlordAvatar || `https://ui-avatars.com/api/?name=${property.landlordName || 'Landlord'}&background=9A5B2F&color=fff&size=200`}
                      alt={property.landlordName || 'Landlord'}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  {property.landlordVerified && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-primary rounded-full p-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm drop-shadow-lg">
                    {property.landlordName || currentT.unknownLandlord}
                  </p>
                  <p className="text-white/70 text-xs">{property.type}</p>
                </div>
              </button>

              {/* Top Right Actions: Phone Button and Video Controls */}
              <div className="flex flex-col items-end gap-2">
                {isPrimaryVideo && (
                  <div className="flex flex-col items-end gap-2" style={{ marginTop: '40px' }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlayPause}
                        className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        )}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>
                    <a
                      href={`tel:${property.landlordPhone}`}
                      className="group"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, border: 'none', background: 'none', boxShadow: 'none', outline: 'none' }}
                      title="Call landlord"
                    >
                      <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                        <Phone className="w-6 h-6" style={{ color: 'var(--primary-foreground)' }} />
                      </span>
                    </a>
                  </div>
                )}
                {!isPrimaryVideo && (
                  <a
                    href={`tel:${property.landlordPhone}`}
                    className="group"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, border: 'none', background: 'none', boxShadow: 'none', outline: 'none' }}
                    title="Call landlord"
                  >
                    <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                      <Phone className="w-6 h-6" style={{ color: 'var(--primary-foreground)' }} />
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Side Actions - Instagram Style */}
          <div className="absolute right-4 bottom-32 z-40 flex flex-col items-center gap-5 pointer-events-auto">
            {/* Favorite */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer touch-manipulation"
              type="button"
            >
              <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Heart 
                  className={`w-7 h-7 transition-all ${
                    favorites.includes(property.id) 
                      ? 'fill-red-500 text-red-500 scale-110' 
                      : 'text-white'
                  }`} 
                />
              </div>
              <span className="text-white text-xs font-medium drop-shadow">
                {favorites.filter(f => f === property.id).length || ''}
              </span>
            </button>

            {/* View Details */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpenDetails();
              }}
              className="flex flex-col items-center gap-1 active:scale-95 transition-transform cursor-pointer touch-manipulation"
              type="button"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/80 to-primary backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-white/20">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <span className="text-white text-xs font-semibold drop-shadow-lg">{currentT.details}</span>
            </button>
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-[calc(env(safe-area-inset-bottom)+80px)]">
            {/* Property Info */}
            <div className="mb-4">
              {/* Status Badge */}
              <Badge 
                className={`mb-2 text-xs px-3 py-1 ${
                  property.status === 'available' 
                    ? 'bg-emerald-500/90 text-white border-0' 
                    : 'bg-amber-500/90 text-white border-0'
                }`}
              >
                {property.status === 'available' ? currentT.available : currentT.rented}
              </Badge>

              {/* Title */}
              <h2 className="text-white text-xl font-bold mb-1 drop-shadow-lg">
                {property.title}
              </h2>
              
              {/* Location */}
              <div className="flex items-center gap-1.5 text-white/90 mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">{property.address}</span>
              </div>

              {/* Price & Rent Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-primary text-2xl font-bold drop-shadow-lg">
                    {currentT.tsh} {property.rent.toLocaleString()}
                  </p>
                  <p className="text-white/70 text-xs">{currentT.perMonth}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRentNow(property)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg"
                  >
                    {currentT.rentNow}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Modal - FIXED: Uses detailProperty state and jumps to property */}
          <PropertyDetailsModal
            property={detailProperty}
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            onSwitchProperty={(p) => setDetailProperty(p)}
            onJumpToProperty={(p) => {
              // Close both modals and scroll to property in main feed
              setShowDetails(false);
              setIsLandlordModalOpen(false);
              scrollToProperty(p.id);
            }}
          />

          {/* Warning Dialog for Occupied Property */}
          <Dialog open={showWarning} onOpenChange={setShowWarning}>
            <DialogContent className="max-w-sm bg-card text-card-foreground border-border rounded-2xl">
              <DialogHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
                <DialogTitle className="text-center">{currentT.propertyOccupied}</DialogTitle>
                <DialogDescription className="text-center">
                  {currentT.propertyOccupiedDesc}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setShowWarning(false)} className="w-full">
                  {currentT.close}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </>
    )
  }

  const LandlordProfileModal = () => {
    const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
    const [showPhone, setShowPhone] = useState(false);
    
    if (!selectedLandlord) return null;
    
    return (
      <>
        <Dialog open={isLandlordModalOpen} onOpenChange={setIsLandlordModalOpen}>
          <DialogContent className="max-w-lg w-[95vw] max-h-[85vh] overflow-y-auto bg-card text-card-foreground border-border rounded-2xl">
            <DialogHeader className="border-b border-border pb-4">
              <DialogTitle className="text-lg font-bold">{currentT.landlordProfile}</DialogTitle>
              <DialogDescription className="text-sm">
                {currentT.landlordProfileDesc}
              </DialogDescription>
            </DialogHeader>

            {/* Landlord Profile Header */}
            <div className="py-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-primary/20">
                    <img
                      src={selectedLandlord.avatar || `https://ui-avatars.com/api/?name=${selectedLandlord.name}&background=9A5B2F&color=fff&size=200`}
                      alt={selectedLandlord.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {selectedLandlord.verified && (
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold">{selectedLandlord.name}</h2>
                <p className="text-sm text-muted-foreground">{currentT.memberSince} {selectedLandlord.joinDate || '2024'}</p>

                {/* Stats */}
                <div className="flex gap-6 mt-6">
                  {[
                    { value: selectedLandlord.totalProperties || landlordProperties.length, label: currentT.properties },
                    { value: selectedLandlord.rating ? `${selectedLandlord.rating}★` : '--', label: currentT.rating },
                    { value: selectedLandlord.responseTime || '--', label: currentT.response },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xl font-bold text-primary">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  {selectedLandlord.phone && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary focus:outline-none"
                        onClick={() => setShowPhone(prev => !prev)}
                        aria-label="Show phone number"
                        title="Show phone number"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      {showPhone && (
                        <span className="bg-secondary px-3 py-2 rounded-full text-sm">
                          {selectedLandlord.phone}
                        </span>
                      )}
                    </div>
                  )}
                  {selectedLandlord.email && (
                    <a href={`mailto:${selectedLandlord.email}`} className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Landlord Properties Grid - Now Clickable */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{currentT.allPropertiesBy} {selectedLandlord.name}</h3>
                <Badge variant="secondary">{landlordProperties.length}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {landlordProperties.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => setViewingProperty(property)}
                    className="relative rounded-xl overflow-hidden aspect-square group text-left cursor-pointer"
                  >
                    {getNormalizedPropertyMedia(property).length > 0 ? (
                      isVideoFile(getNormalizedPropertyMedia(property)[0]) ? (
                        <video
                          src={getMediaUrl(getNormalizedPropertyMedia(property)[0])}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          crossOrigin="anonymous"
                          controls={false}
                          muted
                          playsInline
                          poster={typeof property.image === "string" && property.image ? getMediaUrl(property.image) : undefined}
                        />
                      ) : (
                        <img
                          src={getMediaUrl(getNormalizedPropertyMedia(property)[0])}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          crossOrigin="anonymous"
                        />
                      )
                    ) : (
                      <img
                        src={typeof property.image === "string" && property.image ? getMediaUrl(property.image) : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23374151' width='400' height='400'/%3E%3Ctext fill='%239CA3AF' font-family='sans-serif' font-size='16' text-anchor='middle' x='200' y='200'%3ENo Image%3C/text%3E%3C/svg%3E"}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        crossOrigin="anonymous"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {/* View Icon Overlay on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <Badge 
                      className={`absolute top-2 right-2 text-[10px] ${
                        property.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'
                      } text-white border-0`}
                    >
                      {property.status === 'available' ? currentT.available : currentT.rented}
                    </Badge>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium truncate">{property.title}</p>
                      <p className="text-primary text-sm font-bold">{currentT.tsh} {property.rent.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Property Details Modal - Shows when clicking a property from landlord's list */}
        <PropertyDetailsModal
          property={viewingProperty}
          isOpen={!!viewingProperty}
          onClose={() => setViewingProperty(null)}
          onSwitchProperty={(p) => setViewingProperty(p)}
          onJumpToProperty={(p) => {
            // Close both modals and scroll to property in main feed
            setViewingProperty(null);
            setIsLandlordModalOpen(false);
            scrollToProperty(p.id);
          }}
        />
      </>
    )
  }

  // Warning Dialog for selected property (from main handleRentNow)
  const OccupiedWarningDialog = () => (
    <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
      <DialogContent className="max-w-sm bg-card text-card-foreground border-border rounded-2xl">
        <DialogHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <DialogTitle className="text-center">{currentT.propertyOccupied}</DialogTitle>
          <DialogDescription className="text-center">
            {currentT.propertyOccupiedDesc}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setSelectedProperty(null)} className="w-full">
            {currentT.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Sorted properties
  const sortedProperties = useMemo(() => {
    return filteredProperties
      .slice()
      .sort((a, b) => {
        if (a.status === b.status) return 0;
        if (a.status === 'available') return -1;
        return 1;
      });
  }, [filteredProperties]);

  // Beautiful Loading Screen Component
  const LoadingScreen = () => (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container with multiple animation layers */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-36 h-36 -m-4">
            <div className="w-full h-full rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin" 
                 style={{ animationDuration: '2s' }} />
          </div>
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-0 w-32 h-32 -m-2">
            <div className="w-full h-full rounded-full border-2 border-primary/30 animate-ping" 
                 style={{ animationDuration: '1.5s' }} />
          </div>
          
          {/* Inner glowing circle */}
          <div className="absolute inset-0 w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-transparent animate-pulse" />
          
          {/* Logo with bounce and scale animation */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-2xl shadow-primary/30">
            <img
              src="/loading.png"
              alt="Loading"
              className="w-full h-full object-contain p-2 animate-bounce"
              style={{ 
                animationDuration: '1.5s',
                filter: 'drop-shadow(0 8px 32px rgba(154, 91, 47, 0.4))'
              }}
            />
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping" style={{ animationDuration: '1s' }} />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary/70 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '1.2s' }} />
          <div className="absolute top-1/2 -right-4 w-2 h-2 bg-primary/50 rounded-full animate-ping" style={{ animationDelay: '0.3s', animationDuration: '0.8s' }} />
        </div>
        
        {/* Loading text with gradient */}
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-2 animate-pulse">
            {language === 'en' ? 'Finding Your Perfect Home' : 'Kutafuta Nyumba Yako Bora'}
          </h2>
          <p className="text-muted-foreground text-sm animate-pulse" style={{ animationDelay: '0.3s' }}>
            {language === 'en' ? 'Loading amazing properties...' : 'Inapakia mali nzuri...'}
          </p>
        </div>
        
        {/* Animated loading bar */}
        <div className="mt-8 w-48 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full"
            style={{
              animation: 'loadingBar 1.5s ease-in-out infinite',
            }}
          />
        </div>
        
        {/* Animated dots */}
        <div className="flex gap-2 mt-6">
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-2.5 h-2.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
      
      {/* CSS for loading bar animation */}
      <style jsx>{`
        @keyframes loadingBar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );

  // Function to scroll/jump to a specific property in the main feed
  // IMPORTANT: This hook must be called BEFORE any conditional returns to follow Rules of Hooks
  const scrollToProperty = useCallback((propertyId: string) => {
    const index = sortedProperties.findIndex(p => p.id === propertyId);
    if (index !== -1) {
      setCurrentIndex(index);
      
      // For mobile: scroll the feed to the property card
      if (feedRef.current && isMobile) {
        // Find the element with the matching data-property-id
        const targetElement = feedRef.current.querySelector(`[data-property-id="${propertyId}"]`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback: calculate position based on index
          const cardHeight = window.innerHeight;
          feedRef.current.scrollTo({
            top: index * cardHeight,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [sortedProperties, isMobile]);

  // Show beautiful loading screen while loading
  if (loading) {
    return <LoadingScreen />;
  }

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <LandlordProfileModal />
        <OccupiedWarningDialog />

        {/* Desktop Header with Search */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-2 md:py-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{currentT.findYourPerfectHome}</h1>
                <p className="text-sm text-muted-foreground">{currentT.browsePropertiesAndConnect}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary text-xl">{filteredProperties.length}</span> {currentT.propertiesFound}
              </p>
            </div>

            {/* Search bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={currentT.searchPlaceholder}
                className="pl-12 h-12 text-base border-border bg-secondary rounded-full"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {/* Alphabet Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setAlphabet("all")}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${!alphabet || alphabet === 'all' ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                >
                  {currentT.all}
                </button>
                {alphabetChips.slice(0, 10).map(letter => (
                  <button
                    key={letter}
                    onClick={() => setAlphabet(letter)}
                    className={`shrink-0 w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${alphabet === letter ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                  >
                    {letter}
                  </button>
                ))}
                <span className="text-muted-foreground text-sm">...</span>
              </div>

              {/* Amenity Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground font-medium">{currentT.amenities}</span>
                {amenities.map(a => (
                  <button
                    key={a}
                    onClick={() => setFeature(feature === a ? 'all' : a)}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${feature === a ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {sortedProperties.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                  <Home className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{currentT.noPropertiesFound}</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                  {currentT.noPropertiesDesc}
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setAlphabet("all")
                    setFeature("all")
                  }}
                  className="bg-primary text-white rounded-full px-6"
                >
                  {currentT.resetSearch}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {sortedProperties.map((property) => (
                <DesktopPropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Mobile Layout - Instagram Reels Style
  return (
    <div className="h-[100dvh] w-full bg-black overflow-hidden">
      <LandlordProfileModal />
      <OccupiedWarningDialog />

      {/* Search Button - Positioned lower right to avoid mobile menu interference */}
      <div className="fixed top-16 right-4 z-50">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 active:scale-95 transition-transform shadow-xl"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Filter Panel - Slide Down */}
      <div className={`fixed top-0 left-0 right-0 z-40 bg-white dark:bg-card backdrop-blur-xl transition-transform duration-300 ease-out ${showFilters ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="pt-[calc(env(safe-area-inset-top)+80px)] px-4 pb-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-black dark:text-foreground">{currentT.findYourPerfectHome}</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              placeholder={currentT.searchPlaceholder}
              className="pl-12 h-12 text-base border-gray-200 dark:border-border bg-gray-100 dark:bg-secondary rounded-full text-black dark:text-foreground placeholder:text-gray-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Alphabet Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setAlphabet("all")}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${!alphabet || alphabet === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-secondary text-black dark:text-secondary-foreground'}`}
            >
              {currentT.all}
            </button>
            {alphabetChips.map(letter => (
              <button
                key={letter}
                onClick={() => setAlphabet(letter)}
                className={`shrink-0 w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${alphabet === letter ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-secondary text-black dark:text-secondary-foreground'}`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Amenity Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-muted-foreground font-medium">{currentT.amenities}</span>
            <button
              onClick={() => setFeature("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!feature || feature === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-secondary text-black dark:text-secondary-foreground'}`}
            >
              {currentT.all}
            </button>
            {amenities.map(a => (
              <button
                key={a}
                onClick={() => setFeature(a)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${feature === a ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-secondary text-black dark:text-secondary-foreground'}`}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-600 dark:text-muted-foreground">
            <span className="font-bold text-primary text-lg">{filteredProperties.length}</span> {currentT.propertiesFound}
          </p>
        </div>
      </div>

      {/* Main Feed - Instagram Reels Style */}
      {sortedProperties.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center px-8">
          <div className="text-center">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <Home className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{currentT.noPropertiesFound}</h3>
            <p className="text-white/60 text-sm mb-6 max-w-xs mx-auto">
              {currentT.noPropertiesDesc}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setAlphabet("all")
                setFeature("all")
              }}
              className="bg-primary text-white rounded-full px-6"
            >
              {currentT.resetSearch}
            </Button>
          </div>
        </div>
      ) : (
        <div 
          ref={feedRef}
          className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        >
          {sortedProperties.map((property, index) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              isActive={index === currentIndex}
            />
          ))}
        </div>
      )}

    </div>
  )
}
