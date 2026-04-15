// API Route: Test database connection
import { NextRequest, NextResponse } from "next/server"
import { testConnection, query } from "@/lib/db/neon"
import { getStats } from "@/lib/db/queries"

export async function GET(request: NextRequest) {
  try {
    // Test basic connection
    const isConnected = await testConnection()

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to connect to Neon database",
          connected: false,
        },
        { status: 500 }
      )
    }

    // Get some basic stats
    const stats = await getStats()

    // Get list of tables
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)

    return NextResponse.json({
      status: "success",
      message: "Successfully connected to Neon database",
      connected: true,
      timestamp: new Date().toISOString(),
      stats,
      tables: tablesResult.rows.map((row: any) => row.table_name),
      environment: {
        hasUrl: !!process.env.DATABASE_URL,
      },
    })
  } catch (error: any) {
    console.error("[API health] Error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Unknown error occurred",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    )
  }
}
