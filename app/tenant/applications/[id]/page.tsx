import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Briefcase,
  Home,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  // Mock application data - in real app, fetch based on params.id
  const application = {
    id: params.id,
    property: {
      title: "Sunset Apartments - Unit 204",
      address: "Msasani Peninsula, Dar es Salaam",
      rent: 450000,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      bedrooms: 2,
      bathrooms: 1,
    },
    landlord: {
      name: "John Mwangi",
      email: "john.mwangi@propertyflow.co.tz",
      phone: "+255 712 345 678",
    },
    status: "under_review",
    submittedDate: "Dec 20, 2024",
    progress: 60,
    timeline: [
      {
        status: "submitted",
        date: "Dec 20, 2024",
        time: "10:30 AM",
        completed: true,
        description: "Application submitted successfully",
      },
      {
        status: "documents_verified",
        date: "Dec 21, 2024",
        time: "2:15 PM",
        completed: true,
        description: "Documents verified by system",
      },
      {
        status: "landlord_review",
        date: "Dec 21, 2024",
        time: "3:00 PM",
        completed: true,
        description: "Landlord reviewing application",
      },
      {
        status: "background_check",
        date: "Pending",
        time: "",
        completed: false,
        description: "Background and credit check in progress",
      },
      {
        status: "decision",
        date: "Pending",
        time: "",
        completed: false,
        description: "Final decision pending",
      },
    ],
    applicantInfo: {
      name: "Sarah Mkumbwa",
      email: "sarah.mkumbwa@example.com",
      phone: "+255 755 123 456",
      dateOfBirth: "March 15, 1995",
      currentAddress: "123 Garden St, Upanga, Dar es Salaam",
    },
    employmentInfo: {
      status: "Employed Full-Time",
      employer: "Tanzania Breweries Limited",
      jobTitle: "Marketing Manager",
      monthlyIncome: 1200000,
      employmentDuration: "3 years",
    },
    rentalHistory: {
      previousLandlord: "Ahmed Hassan",
      previousLandlordContact: "+255 713 987 654",
      previousRent: 350000,
      yearsRented: 2,
      reasonForLeaving: "Seeking larger space closer to work",
    },
    moveInDetails: {
      desiredMoveInDate: "Jan 1, 2025",
      leaseTerm: "12 Months",
      numberOfOccupants: 2,
      pets: "No",
    },
    documents: [
      { name: "Government ID", status: "verified", uploadedDate: "Dec 20, 2024" },
      { name: "Proof of Income", status: "verified", uploadedDate: "Dec 20, 2024" },
      { name: "Employment Letter", status: "verified", uploadedDate: "Dec 20, 2024" },
    ],
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "under_review":
        return (
          <Badge className="gap-1">
            <Clock className="h-3 w-3" />
            Under Review
          </Badge>
        )
      case "approved":
        return (
          <Badge className="gap-1 bg-green-500">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Not Selected
          </Badge>
        )
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/tenant/applications">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Application Details</h1>
              <p className="text-muted-foreground">Submitted on {application.submittedDate}</p>
            </div>
            {getStatusBadge(application.status)}
          </div>

          {/* Progress Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Application Progress</span>
                  <span className="text-muted-foreground">{application.progress}% Complete</span>
                </div>
                <Progress value={application.progress} />
              </div>
              <p className="text-sm text-muted-foreground">
                Your application is currently under review by the landlord
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={application.property.image || "/placeholder.svg"}
                      alt={application.property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{application.property.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="h-4 w-4" />
                      {application.property.address}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{application.property.bedrooms} bed</span>
                      <span>{application.property.bathrooms} bath</span>
                      <span className="font-bold text-primary">
                        Tsh {application.property.rent.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            item.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        {idx < application.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${item.completed ? "bg-primary" : "bg-muted"}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium mb-1">{item.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.date}
                          {item.time && ` at ${item.time}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <User className="h-4 w-4" />
                      Full Name
                    </p>
                    <p className="font-medium">{application.applicantInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-medium">{application.applicantInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p className="font-medium">{application.applicantInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4" />
                      Date of Birth
                    </p>
                    <p className="font-medium">{application.applicantInfo.dateOfBirth}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                    <Home className="h-4 w-4" />
                    Current Address
                  </p>
                  <p className="font-medium">{application.applicantInfo.currentAddress}</p>
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4" />
                      Employment Status
                    </p>
                    <p className="font-medium">{application.employmentInfo.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4" />
                      Monthly Income
                    </p>
                    <p className="font-medium">Tsh {application.employmentInfo.monthlyIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Employer</p>
                    <p className="font-medium">{application.employmentInfo.employer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Job Title</p>
                    <p className="font-medium">{application.employmentInfo.jobTitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Move-in Details */}
            <Card>
              <CardHeader>
                <CardTitle>Move-in Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Desired Move-in Date</p>
                    <p className="font-medium">{application.moveInDetails.desiredMoveInDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Lease Term</p>
                    <p className="font-medium">{application.moveInDetails.leaseTerm}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Number of Occupants</p>
                    <p className="font-medium">{application.moveInDetails.numberOfOccupants}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pets</p>
                    <p className="font-medium">{application.moveInDetails.pets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {application.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">Uploaded {doc.uploadedDate}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Landlord Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Landlord Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{application.landlord.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{application.landlord.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{application.landlord.phone}</p>
                </div>
                <Button className="w-full mt-4">Contact Landlord</Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full bg-transparent">
                  Download Application
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Edit Application
                </Button>
                <Button variant="destructive" className="w-full">
                  Withdraw Application
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>Your application has been submitted</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>Documents have been verified</span>
                  </li>
                  <li className="flex gap-2">
                    <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Background check is in progress</span>
                  </li>
                  <li className="flex gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>Landlord will make a decision soon</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
