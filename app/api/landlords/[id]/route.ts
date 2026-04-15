import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Mock landlord data
  return NextResponse.json({
    success: true,
    landlord: {
      id: params.id,
      name: "John Mwangi",
      email: "john.mwangi@propertyflow.co.tz",
      phone: "+255 712 345 678",
      rating: 4.8,
      totalProperties: 12,
      responseTime: "Within 2 hours",
      joinDate: "2022",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    }
  })
}
