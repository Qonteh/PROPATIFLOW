// Database Query Helpers for Neon
// Common CRUD operations and data retrieval functions

import { query } from "./neon"

// ============================================
// USERS
// ============================================

export async function getUserById(userId: string) {
  const result = await query(
    'SELECT * FROM "users" WHERE "id" = $1 LIMIT 1',
    [userId]
  )
  return result.rows[0] || null
}

export async function getUserByEmail(email: string) {
  const result = await query(
    'SELECT * FROM "users" WHERE "email" = $1 LIMIT 1',
    [email]
  )
  return result.rows[0] || null
}

export async function getAllUsers(limit = 50, offset = 0) {
  const result = await query(
    'SELECT * FROM "users" ORDER BY "created_at" DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  )
  return result.rows
}

// ============================================
// PROPERTIES
// ============================================

export async function getPropertyById(propertyId: string) {
  const result = await query(
    'SELECT * FROM "properties" WHERE "id" = $1 LIMIT 1',
    [propertyId]
  )
  return result.rows[0] || null
}

export async function getPropertiesByLandlord(
  landlordId: string,
  limit = 50,
  offset = 0
) {
  const result = await query(
    'SELECT * FROM "properties" WHERE "landlord_id" = $1 ORDER BY "created_at" DESC LIMIT $2 OFFSET $3',
    [landlordId, limit, offset]
  )
  return result.rows
}

export async function getAvailableProperties(limit = 50, offset = 0) {
  const result = await query(
    'SELECT * FROM "properties" WHERE "status" = $1 ORDER BY "created_at" DESC LIMIT $2 OFFSET $3',
    ["available", limit, offset]
  )
  return result.rows
}

export async function searchProperties(
  filters: { city?: string; minRent?: number; maxRent?: number },
  limit = 50,
  offset = 0
) {
  let sql = 'SELECT * FROM "properties" WHERE "status" = $1'
  const params: any[] = ["available"]

  if (filters.city) {
    sql += ` AND "city" ILIKE $${params.length + 1}`
    params.push(`%${filters.city}%`)
  }

  if (filters.minRent) {
    sql += ` AND "rent_amount" >= $${params.length + 1}`
    params.push(filters.minRent)
  }

  if (filters.maxRent) {
    sql += ` AND "rent_amount" <= $${params.length + 1}`
    params.push(filters.maxRent)
  }

  sql += ` ORDER BY "created_at" DESC LIMIT $${params.length + 1} OFFSET $${
    params.length + 2
  }`
  params.push(limit, offset)

  const result = await query(sql, params)
  return result.rows
}

// ============================================
// APPLICATIONS
// ============================================

export async function getApplicationById(applicationId: string) {
  const result = await query(
    'SELECT * FROM "applications" WHERE "id" = $1 LIMIT 1',
    [applicationId]
  )
  return result.rows[0] || null
}

export async function getApplicationsByProperty(propertyId: string) {
  const result = await query(
    'SELECT * FROM "applications" WHERE "property_id" = $1 ORDER BY "created_at" DESC',
    [propertyId]
  )
  return result.rows
}

export async function getApplicationsByTenant(tenantId: string) {
  const result = await query(
    'SELECT * FROM "applications" WHERE "tenant_id" = $1 ORDER BY "created_at" DESC',
    [tenantId]
  )
  return result.rows
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function getNotificationsByUser(
  userId: string,
  limit = 50,
  offset = 0
) {
  const result = await query(
    'SELECT * FROM "notifications" WHERE "user_id" = $1 ORDER BY "created_at" DESC LIMIT $2 OFFSET $3',
    [userId, limit, offset]
  )
  return result.rows
}

export async function getUnreadNotifications(userId: string) {
  const result = await query(
    'SELECT * FROM "notifications" WHERE "user_id" = $1 AND "is_read" = 0 ORDER BY "created_at" DESC',
    [userId]
  )
  return result.rows
}

// ============================================
// DOCUMENTS
// ============================================

export async function getDocumentsByUser(
  userId: string,
  limit = 50,
  offset = 0
) {
  const result = await query(
    'SELECT * FROM "documents" WHERE "user_id" = $1 ORDER BY "created_at" DESC LIMIT $2 OFFSET $3',
    [userId, limit, offset]
  )
  return result.rows
}

// ============================================
// STATISTICS
// ============================================

export async function getPropertyCount() {
  const result = await query('SELECT COUNT(*) as count FROM "properties"')
  return parseInt(result.rows[0].count || 0)
}

export async function getUserCount() {
  const result = await query('SELECT COUNT(*) as count FROM "users"')
  return parseInt(result.rows[0].count || 0)
}

export async function getApplicationCount() {
  const result = await query('SELECT COUNT(*) as count FROM "applications"')
  return parseInt(result.rows[0].count || 0)
}

export async function getStats() {
  const [properties, users, applications] = await Promise.all([
    getPropertyCount(),
    getUserCount(),
    getApplicationCount(),
  ])

  return {
    properties,
    users,
    applications,
  }
}
