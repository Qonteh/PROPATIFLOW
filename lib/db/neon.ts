// Neon PostgreSQL Connection
// Uses the DATABASE_URL environment variable for Neon connection

import { Pool, QueryResult } from "pg"

let pool: Pool | null = null

/**
 * Initialize connection pool for Neon
 */
function initializePool(): Pool {
  if (pool) return pool

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Please configure your Neon connection string."
    )
  }

  try {
    pool = new Pool({
      connectionString: databaseUrl,
      // Connection pooling settings
      max: 20, // Maximum connections in pool
      min: 2, // Minimum connections in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    pool.on("error", (err) => {
      console.error("[Neon DB] Unexpected connection pool error:", err)
    })

    console.log("[Neon DB] Connection pool initialized successfully")
    return pool
  } catch (error) {
    console.error("[Neon DB] Failed to create connection pool:", error)
    throw error
  }
}

/**
 * Get the connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    initializePool()
  }
  return pool!
}

/**
 * Execute a single query
 */
export async function query<T = any>(
  text: string,
  values?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now()
  try {
    const result = await getPool().query<T>(text, values)
    const duration = Date.now() - start
    if (duration > 1000) {
      console.warn(`[Neon DB] Slow query (${duration}ms):`, text)
    }
    return result
  } catch (error) {
    console.error("[Neon DB] Query error:", error)
    throw error
  }
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await getPool().connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("[Neon DB] Transaction error:", error)
    throw error
  } finally {
    client.release()
  }
}

/**
 * Test the database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query("SELECT NOW()")
    console.log("[Neon DB] Connection test successful:", result.rows[0])
    return true
  } catch (error) {
    console.error("[Neon DB] Connection test failed:", error)
    return false
  }
}

export default {
  query,
  transaction,
  testConnection,
  getPool,
}
