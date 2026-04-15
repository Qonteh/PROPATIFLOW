"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { 
  ChevronRight, 
  ChevronLeft, 
  Home, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  DollarSign,
  Users,
  Globe,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  Building,
  Shield,
  Clock,
  Headphones,
  Car,
  Landmark,
  Bed,
  Bath,
  Ruler
} from "lucide-react";

interface PropertyData {
  title: string;
  imageUrl?: string;
  reference?: string;
  price?: number;
  location?: string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  type?: string;
}

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params && typeof params.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    occupation: "",
    salaryRange: "",
    jobType: "",
    nationality: "",
    gender: "",
    livingSituation: "",
    familyCount: "",
    childrenCount: "",
    eldersCount: "",
    bank: "",
    mobileNetwork: "",
    religion: "",
    hasCar: "",
    carCount: "",
    message: "",
  });
  const [payment, setPayment] = useState({
    method: "",
    number: "",
    name: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data.property);
        }
      } catch {
        // Handle error silently
      }
    }
    if (id) fetchProperty();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/tenant/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, payment, propertyId: id }),
      });
      if (res.ok) {
        toast({ title: "Application sent!", description: "The landlord will be notified." });
        router.push("/tenant/applications");
      } else {
        toast({ title: "Error", description: "Failed to send application.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Real mobile money providers with logos
  const paymentProviders = [
    { 
      id: "mpesa", 
      name: "M-Pesa", 
      logo: "/m-pesa.png",
      bgColor: "bg-[#00A651]/10",
      borderColor: "border-[#00A651]"
    },
    { 
      id: "mixbyas", 
      name: "Mixx by Yas", 
      logo: "/yas.png",
      bgColor: "bg-[#FF0066]/10",
      borderColor: "border-[#FF0066]"
    },
    { 
      id: "airtel", 
      name: "Airtel Money", 
      logo: "/airtel.png",
      bgColor: "bg-[#ED1C24]/10",
      borderColor: "border-[#ED1C24]"
    },
    { 
      id: "halopesa", 
      name: "Halopesa", 
      logo: "/halopesa.png",
      bgColor: "bg-[#F7941D]/10",
      borderColor: "border-[#F7941D]"
    },
  ];

  const steps = [
    { number: 1, title: "Personal Information", icon: User },
    { number: 2, title: "Payment", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Complete Your Application</h1>
          <p className="text-muted-foreground text-lg">Fill in your details to apply for this property</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Area - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step Progress */}
            <div className="bg-white rounded-2xl border border-border p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4">
                {steps.map((s, index) => (
                  <div key={s.number} className="flex items-center flex-1">
                    <button
                      type="button"
                      onClick={() => s.number < step && setStep(s.number)}
                      disabled={s.number > step}
                      className={`flex items-center gap-2 sm:gap-3 flex-1 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                        step === s.number 
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : step > s.number
                          ? "border-primary/30 bg-primary/5 text-primary cursor-pointer hover:bg-primary/10"
                          : "border-border bg-muted/30 text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        step === s.number 
                          ? "bg-white text-primary" 
                          : step > s.number
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {step > s.number ? <CheckCircle2 className="w-5 h-5" /> : s.number}
                      </div>
                      <div className="text-left hidden sm:block">
                        <p className="text-xs opacity-75">Step {s.number}</p>
                        <p className="font-semibold text-sm">{s.title}</p>
                      </div>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-8 sm:w-12 h-1 mx-2 rounded-full ${
                        step > index + 1 ? "bg-primary" : "bg-border"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <form onSubmit={e => { e.preventDefault(); setStep(2); }} className="space-y-6">
                
                {/* Personal Details Card */}
                <Card className="border-border shadow-sm overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground">Personal Details</h2>
                        <p className="text-sm text-muted-foreground">Your basic information</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            name="fullName" 
                            placeholder="John Doe" 
                            value={form.fullName} 
                            onChange={handleChange} 
                            required 
                            className="pl-11 h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            name="email" 
                            type="email" 
                            placeholder="john@example.com" 
                            value={form.email} 
                            onChange={handleChange} 
                            required 
                            className="pl-11 h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            name="phone" 
                            placeholder="+255 712 345 678" 
                            value={form.phone} 
                            onChange={handleChange} 
                            required 
                            className="pl-11 h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Occupation *</label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            name="occupation" 
                            placeholder="Software Engineer" 
                            value={form.occupation} 
                            onChange={handleChange} 
                            required 
                            className="pl-11 h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Employment & Finance Card */}
                <Card className="border-border shadow-sm overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground">Employment & Finance</h2>
                        <p className="text-sm text-muted-foreground">Your income details</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Monthly Salary Range *</label>
                        <select 
                          name="salaryRange" 
                          value={form.salaryRange} 
                          onChange={handleChange} 
                          required 
                          className="w-full h-12 px-4 rounded-xl border-2 border-border bg-white text-foreground focus:border-primary focus:outline-none"
                        >
                          <option value="">Select range</option>
                          <option value="<300000">Less than 300,000 TZS</option>
                          <option value="300000-600000">300,000 - 600,000 TZS</option>
                          <option value="600000-1000000">600,000 - 1,000,000 TZS</option>
                          <option value="1000000-2000000">1,000,000 - 2,000,000 TZS</option>
                          <option value=">2000000">More than 2,000,000 TZS</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Employment Type *</label>
                        <select 
                          name="jobType" 
                          value={form.jobType} 
                          onChange={handleChange} 
                          required 
                          className="w-full h-12 px-4 rounded-xl border-2 border-border bg-white text-foreground focus:border-primary focus:outline-none"
                        >
                          <option value="">Select type</option>
                          <option value="full-time">Full Time Employee</option>
                          <option value="part-time">Part Time Employee</option>
                          <option value="self-employed">Self Employed / Business</option>
                          <option value="contract">Contract Worker</option>
                          <option value="student">Student</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Demographics Card */}
                <Card className="border-border shadow-sm overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground">Demographics</h2>
                        <p className="text-sm text-muted-foreground">Additional information</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid sm:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Nationality *</label>
                        <Input 
                          name="nationality" 
                          placeholder="Tanzanian" 
                          value={form.nationality} 
                          onChange={handleChange} 
                          required 
                          className="h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Gender *</label>
                        <select 
                          name="gender" 
                          value={form.gender} 
                          onChange={handleChange} 
                          required 
                          className="w-full h-12 px-4 rounded-xl border-2 border-border bg-white text-foreground focus:border-primary focus:outline-none"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Religion</label>
                        <Input 
                          name="religion" 
                          placeholder="Optional" 
                          value={form.religion} 
                          onChange={handleChange} 
                          className="h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Living Situation Card */}
                <Card className="border-border shadow-sm overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground">Living Situation</h2>
                        <p className="text-sm text-muted-foreground">Who will be living with you?</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Living Arrangement *</label>
                      <select 
                        name="livingSituation" 
                        value={form.livingSituation} 
                        onChange={handleChange} 
                        required 
                        className="w-full h-12 px-4 rounded-xl border-2 border-border bg-white text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="">Select your situation</option>
                        <option value="alone">Living Alone</option>
                        <option value="family">With Family</option>
                        <option value="roommates">With Roommates</option>
                        <option value="couple">With Partner/Spouse</option>
                      </select>
                    </div>
                    
                    {form.livingSituation === "family" && (
                      <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground">Total Members</label>
                          <Input 
                            name="familyCount" 
                            type="number" 
                            min="1" 
                            placeholder="0"
                            value={form.familyCount} 
                            onChange={handleChange} 
                            required 
                            className="h-10 bg-white border-2 border-border focus:border-primary rounded-lg text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground">Children</label>
                          <Input 
                            name="childrenCount" 
                            type="number" 
                            min="0" 
                            placeholder="0"
                            value={form.childrenCount} 
                            onChange={handleChange} 
                            required 
                            className="h-10 bg-white border-2 border-border focus:border-primary rounded-lg text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground">Elders (60+)</label>
                          <Input 
                            name="eldersCount" 
                            type="number" 
                            min="0" 
                            placeholder="0"
                            value={form.eldersCount} 
                            onChange={handleChange} 
                            required 
                            className="h-10 bg-white border-2 border-border focus:border-primary rounded-lg text-center"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Info Card */}
                <Card className="border-border shadow-sm overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <Building className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground">Additional Details</h2>
                        <p className="text-sm text-muted-foreground">Banking and vehicle information</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Bank Name</label>
                        <div className="relative">
                          <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            name="bank" 
                            placeholder="CRDB, NMB, etc." 
                            value={form.bank} 
                            onChange={handleChange} 
                            className="pl-11 h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Mobile Network</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            name="mobileNetwork" 
                            placeholder="Vodacom, Airtel, etc." 
                            value={form.mobileNetwork} 
                            onChange={handleChange} 
                            className="pl-11 h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Do you have a car?</label>
                        <select 
                          name="hasCar" 
                          value={form.hasCar} 
                          onChange={handleChange} 
                          className="w-full h-12 px-4 rounded-xl border-2 border-border bg-white text-foreground focus:border-primary focus:outline-none"
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      
                      {form.hasCar === "yes" && (
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-foreground">Number of Cars</label>
                          <div className="relative">
                            <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              name="carCount" 
                              type="number" 
                              min="1" 
                              placeholder="1"
                              value={form.carCount} 
                              onChange={handleChange} 
                              className="pl-11 h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Additional Message (Optional)</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                        <Textarea 
                          name="message" 
                          placeholder="Any additional information you'd like to share with the landlord..."
                          value={form.message} 
                          onChange={handleChange}
                          rows={4}
                          className="pl-11 pt-3 bg-white border-2 border-border focus:border-primary rounded-xl resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Continue Button */}
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                >
                  Continue to Payment
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Payment Method Selection */}
                <Card className="border-border shadow-sm overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground">Select Payment Method</h2>
                        <p className="text-sm text-muted-foreground">Choose your preferred mobile money provider</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {paymentProviders.map((provider) => (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => setPayment({ ...payment, method: provider.id })}
                          className={`relative p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                            payment.method === provider.id
                              ? `${provider.borderColor} ${provider.bgColor} shadow-lg`
                              : "border-border bg-white hover:border-muted-foreground/30 hover:bg-muted/20"
                          }`}
                        >
                          {payment.method === provider.id && (
                            <div className="absolute top-3 right-3">
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <div className="flex items-center justify-center w-full h-20 sm:h-28">
                            <Image 
                              src={provider.logo} 
                              alt={provider.name}
                              width={200}
                              height={80}
                              className="max-h-20 sm:max-h-28 w-auto object-contain"
                              unoptimized
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Details */}
                {payment.method && (
                  <Card className="border-border shadow-sm overflow-hidden">
                    <div className="bg-primary/5 px-6 py-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                          <Phone className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h2 className="font-bold text-foreground">Payment Details</h2>
                          <p className="text-sm text-muted-foreground">Enter your mobile money information</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">
                          {payment.method === "mpesa" && "M-Pesa"}
                          {payment.method === "mixbyas" && "Mix by Yas"}
                          {payment.method === "airtel" && "Airtel Money"}
                          {payment.method === "halopesa" && "Halopesa"} Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            name="number" 
                            placeholder="0712 345 678" 
                            value={payment.number} 
                            onChange={handlePaymentChange} 
                            required 
                            className="pl-11 h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Account Holder Name *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            name="name" 
                            placeholder="Name as registered" 
                            value={payment.name} 
                            onChange={handlePaymentChange} 
                            required 
                            className="pl-11 h-12 bg-white border-2 border-border focus:border-primary rounded-xl"
                          />
                        </div>
                      </div>
                      
                      {/* Security Notice */}
                      <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-foreground">Secure Transaction</p>
                          <p className="text-muted-foreground">Your payment information is encrypted and secure. You will receive an STK push notification to confirm the payment.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(1)} 
                    disabled={loading}
                    className="flex-1 h-14 text-base font-semibold rounded-xl border-2"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || !payment.method || !payment.number || !payment.name}
                    className="flex-[2] h-14 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        Submit Application
                        <CheckCircle2 className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-6">
            
            {/* Property Preview Card */}
            <Card className="border-border shadow-sm overflow-hidden sticky top-24">
              <div className="aspect-video relative bg-muted">
                {property?.imageUrl ? (
                  <Image 
                    src={property.imageUrl} 
                    alt={property.title || "Property"} 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <Home className="w-12 h-12 text-primary/40" />
                  </div>
                )}
                {/* Status Badge */}
                {property?.status && (
                  <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] tracking-wide uppercase rounded-full border-0 font-semibold ${property.status === 'available' ? 'bg-emerald-500 text-card hover:bg-emerald-600' : 'bg-amber-500 text-card hover:bg-amber-600'}`}>
                    {property.status === 'available' ? "Available" : "Occupied"}
                  </span>
                )}
              </div>
              <CardContent className="p-5 space-y-4">
                {property ? (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-foreground line-clamp-1">
                        {property.title}
                      </h3>
                      <span className="text-lg font-bold text-primary whitespace-nowrap">
                        Tsh {property.price?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Landmark className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Bed className="h-4 w-4 text-primary" />{property.bedrooms} bed</span>
                      <span className="flex items-center gap-1"><Bath className="h-4 w-4 text-primary" />{property.bathrooms} bath</span>
                      <span className="flex items-center gap-1"><Ruler className="h-4 w-4 text-primary" />{property.sqft} sqft</span>
                      {property.type && (
                        <span className="ml-auto text-xs px-2 py-0 font-medium capitalize bg-muted rounded-full">{property.type}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-muted-foreground text-sm">Loading property details...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card className="border-border shadow-sm p-5 space-y-4">
              <h4 className="font-semibold text-foreground">Why Choose Us</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Fast Processing</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">24/7 Support</p>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer removed */}
    </div>
  );
}
