#!/usr/bin/env node

/**
 * Neon Database Verification Script
 * Tests connection and data integrity
 * Run: npm run verify-db
 */

const { Pool } = require("pg")
const path = require("path")
const fs = require("fs")

// Read .env.local and extract DATABASE_URL
const envPath = path.join(__dirname, "..", ".env.local")
let DATABASE_URL = ""

try {
  const envContent = fs.readFileSync(envPath, "utf-8")
  const match = envContent.match(/^DATABASE_URL=(.+?)$/m)
  if (match && match[1]) {
    DATABASE_URL = match[1]
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/[\r\n]+$/g, "") // Remove any trailing newlines/CRLFs
  }
} catch (error) {
  console.error("Failed to read .env.local:", error.message)
}

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env.local")
  process.exit(1)
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 5,
})

async function runVerification() {
  console.log("\n🔍 Neon Database Verification\n")
  console.log("=" .repeat(50))

  try {
    // Test 1: Connection
    console.log("\n✓ Test 1: Connection")
    console.log("  URL:", DATABASE_URL.substring(0, 50) + "...")
    const client = await pool.connect()
    const result = await client.query("SELECT NOW()")
    client.release()
    console.log(`  Connected! Server time: ${result.rows[0].now}`)

    // Test 2: List tables
    console.log("\n✓ Test 2: Available Tables")
    const tableResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    const tables = tableResult.rows.map((row) => row.table_name)
    console.log(`  Found ${tables.length} tables:`)
    tables.forEach((table) => console.log(`    - ${table}`))

    // Test 3: Row counts
    console.log("\n✓ Test 3: Data Summary")
    const tableStats = await Promise.all(
      tables.map(async (table) => {
        const res = await pool.query(`SELECT COUNT(*) as count FROM "${table}"`)
        return {
          table,
          rows: parseInt(res.rows[0].count),
        }
      })
    )

    const totalRows = tableStats.reduce((sum, stat) => sum + stat.rows, 0)
    console.log(`  Total rows across all tables: ${totalRows}`)
    console.log("\n  Table row counts:")
    tableStats.forEach((stat) => {
      if (stat.rows > 0) {
        console.log(
          `    ${stat.table.padEnd(25)} ${stat.rows
            .toString()
            .padStart(6)} rows`
        )
      }
    })

    // Test 4: Sample data
    console.log("\n✓ Test 4: Sample Data")

    const userRes = await pool.query('SELECT * FROM "users" LIMIT 1')
    if (userRes.rows.length > 0) {
      console.log(`  User sample: ${userRes.rows[0].email}`)
    }

    const propRes = await pool.query('SELECT * FROM "properties" LIMIT 1')
    if (propRes.rows.length > 0) {
      console.log(`  Property sample: ${propRes.rows[0].title}`)
    }

    const appRes = await pool.query('SELECT * FROM "applications" LIMIT 1')
    if (appRes.rows.length > 0) {
      console.log(`  Application sample: ${appRes.rows[0].id}`)
    }

    // Test 5: Foreign keys
    console.log("\n✓ Test 5: Foreign Keys")
    const fkRes = await pool.query(`
      SELECT constraint_name, table_name 
      FROM information_schema.table_constraints 
      WHERE constraint_type = 'FOREIGN KEY'
      ORDER BY table_name
    `)
    console.log(`  Found ${fkRes.rows.length} foreign key constraints`)

    // Test 6: Indexes
    console.log("\n✓ Test 6: Indexes")
    const indexRes = await pool.query(`
      SELECT COUNT(*) as count 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `)
    console.log(`  Found ${indexRes.rows[0].count} indexes`)

    console.log("\n" + "=" .repeat(50))
    console.log("\n✅ All tests passed! Database is ready to use.\n")

    process.exit(0)
  } catch (error) {
    console.error("\n❌ Error:", error.message)
    console.error("\nFull error:")
    console.error(error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runVerification()
