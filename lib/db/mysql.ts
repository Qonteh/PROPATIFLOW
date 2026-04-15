// Database module for PostgreSQL (pgAdmin compatible)
// Connects to real PostgreSQL when environment variables are set
// Falls back to in-memory mock data for development/preview

import { Pool, PoolClient } from "pg"

// ============================================
// TYPES
// ============================================
interface MockUser {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  phone: string
  role: "tenant" | "landlord" | "agent"
  is_verified: boolean
  created_at: Date
  updated_at: Date
}

interface MockProperty {
  id: string
  landlord_id: string
  title: string
  description: string
  address: string
  city: string
  state: string
  zip_code: string
  property_type: string
  bedrooms: number
  bathrooms: number
  area_sqft: number
  rent_amount: number
  deposit_amount: number
  is_available: boolean
  amenities: string
  created_at: Date
}

interface MockApplication {
  id: string
  property_id: string
  tenant_id: string
  status: string
  move_in_date: string
  message: string
  created_at: Date
}

interface MockPayment {
  id: string
  tenancy_id: string
  tenant_id: string
  landlord_id: string
  property_id: string
  amount: number
  currency: string
  payment_type: string
  payment_method: string
  payment_reference: string
  status: string
  due_date: string
  paid_date: string | null
  created_at: Date
}

// ============================================
// DATABASE CONNECTION
// ============================================
let pool: Pool | null = null

function getPool(): Pool | null {
  if (pool) return pool

  // Check if real database credentials are provided
  const dbHost = process.env.DB_HOST
  const dbUser = process.env.DB_USER
  const dbName = process.env.DB_NAME

  if (dbHost && dbUser && dbName) {
    try {
      pool = new Pool({
        host: dbHost,
        port: parseInt(process.env.DB_PORT || "5432"),
        user: dbUser,
        password: process.env.DB_PASSWORD || "",
        database: dbName,
        max: 10,
      })
      console.log("[DB] Connected to PostgreSQL database:", dbName)
      return pool
    } catch (error) {
      console.error("[DB] Failed to create PostgreSQL pool:", error)
      return null
    }
  }

  return null
}

// Check if using real database
function isUsingRealDB(): boolean {
  return getPool() !== null
}

function toPostgresParams(sql: string): string {
  let index = 0
  return sql.replace(/\?/g, () => {
    index += 1
    return `$${index}`
  })
}

// ============================================
// MOCK DATABASE (for v0 preview)
// ============================================
interface MockDocument {
  id: string;
  user_id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  is_verified: number;
  expires_at?: string | null;
  created_at: Date;
}

interface MockLease {
  id: string
  property_id: string
  tenant_id: string
  landlord_id: string
  start_date: string
  end_date: string
  rent_amount: number
  security_deposit: number
  status: string
  created_at: Date
}

interface MockExpense {
  id: string
  landlord_id: string
  property_id: string | null
  category: string
  description: string
  amount: number
  expense_date: string
  status: string
  created_at: Date
}

interface MockRentObligation {
  id: string
  lease_id: string
  tenant_id: string
  landlord_id: string
  property_id: string
  amount_due: number
  due_date: string
  status: string
  amount_paid: number
  created_at: Date
}

const mockDB: {
  users: MockUser[];
  properties: MockProperty[];
  applications: MockApplication[];
  payments: MockPayment[];
  verifications: any[];
  tenancies: any[];
  leases: MockLease[];
  expenses: MockExpense[];
  rent_obligations: MockRentObligation[];
  documents: MockDocument[];
} = {
  users: [],
  properties: [],
  applications: [],
  payments: [],
  verifications: [],
  tenancies: [],
  leases: [],
  expenses: [],
  rent_obligations: [],
  documents: [],
};

// Generate UUID
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// ============================================
// QUERY FUNCTIONS
// ============================================
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const dbPool = getPool()

  if (dbPool) {
    // Real database query
    try {
      const result = await dbPool.query(toPostgresParams(sql), params || [])
      return result.rows as T[]
    } catch (error) {
      console.error("[DB] Query error:", error)
      throw error
    }
  }

  // Mock database query (v0 preview mode)
  console.log("[DB] Using mock database (no MySQL connection)")
  return handleMockSelect<T>(sql, params)
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] || null
}

export async function insert(sql: string, params?: any[]): Promise<{ insertId: string; affectedRows: number }> {
  const dbPool = getPool()

  if (dbPool) {
    // Real database insert
    try {
      const result = await dbPool.query(toPostgresParams(sql), params || [])
      return {
        // Current codebase passes explicit UUID as first param for inserts.
        insertId: params?.[0] || "",
        affectedRows: result.rowCount || 0,
      }
    } catch (error) {
      console.error("[DB] Insert error:", error)
      throw error
    }
  }

  // Mock database insert (v0 preview mode)
  console.log("[DB] Using mock database for INSERT (no MySQL connection)")
  return handleMockInsert(sql, params)
}

export async function execute(sql: string, params?: any[]): Promise<{ affectedRows: number }> {
  const dbPool = getPool()

  if (dbPool) {
    // Real database execute
    try {
      const result = await dbPool.query(toPostgresParams(sql), params || [])
      return { affectedRows: result.rowCount || 0 }
    } catch (error) {
      console.error("[DB] Execute error:", error)
      throw error
    }
  }

  // Mock database execute
  return handleMockExecute(sql, params)
}

// ============================================
// MOCK HANDLERS
// ============================================
function handleMockSelect<T>(sql: string, params?: any[]): T[] {
      // Handle SELECT for documents
      if (sql.toLowerCase().includes('from documents')) {
        const userId = params?.[0];
        return mockDB.documents
          .filter((doc) => doc.user_id === userId)
          .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
          .map((doc) => ({
            id: doc.id,
            document_type: doc.document_type,
            file_name: doc.file_name,
            file_url: doc.file_url,
            file_size: doc.file_size,
            mime_type: doc.mime_type,
            is_verified: doc.is_verified,
            expires_at: doc.expires_at || null,
            created_at: doc.created_at,
          })) as T[];
      }
    // Handle rent roll query for /api/finance/rentroll
    if (
      sql.toLowerCase().includes("from leases l") &&
      sql.toLowerCase().includes("join users u") &&
      sql.toLowerCase().includes("join properties p") &&
      sql.toLowerCase().includes("order by u.last_name")
    ) {
      const landlordId = params?.[0]
      // Get all leases for this landlord
      const leases = mockDB.leases.filter((l) => l.landlord_id === landlordId)
      return leases.map((l) => {
        const tenant = mockDB.users.find((u) => u.id === l.tenant_id)
        const property = mockDB.properties.find((p) => p.id === l.property_id)
        // Calculate total_paid and outstanding for this tenant/lease
        const total_paid = mockDB.payments
          .filter((pay) => pay.tenant_id === l.tenant_id && pay.landlord_id === landlordId && pay.status === "completed")
          .reduce((sum, pay) => sum + pay.amount, 0)
        const outstanding = mockDB.payments
          .filter((pay) => pay.tenant_id === l.tenant_id && pay.landlord_id === landlordId && (pay.status === "pending" || pay.status === "overdue"))
          .reduce((sum, pay) => sum + pay.amount, 0)
        return {
          first_name: tenant?.first_name || "",
          last_name: tenant?.last_name || "",
          email: tenant?.email || "",
          phone: tenant?.phone || "",
          rent_amount: l.rent_amount,
          start_date: l.start_date,
          end_date: l.end_date,
          lease_status: l.status,
          property_title: property?.title || "",
          property_address: property?.address || "",
          total_paid,
          outstanding,
        }
      }) as T[]
    }

    // Handle arrears reminder query for /api/finance/arrears/remind
    if (
      sql.toLowerCase().includes("from payments p") &&
      sql.toLowerCase().includes("join users u") &&
      sql.toLowerCase().includes("join properties prop on p.property_id = prop.id") &&
      sql.toLowerCase().includes("p.status in ('pending', 'overdue')")
    ) {
      const landlordId = params?.[0]
      const today = new Date().toISOString().split("T")[0]
      return mockDB.payments
        .filter(
          (p) =>
            p.landlord_id === landlordId &&
            (p.status === "pending" || p.status === "overdue") &&
            p.due_date && p.due_date <= today
        )
        .map((p) => {
          const tenant = mockDB.users.find((u) => u.id === p.tenant_id)
          const property = mockDB.properties.find((pr) => pr.id === p.property_id)
          return {
            email: tenant?.email || "",
            first_name: tenant?.first_name || "",
            last_name: tenant?.last_name || "",
            amount: p.amount,
            due_date: p.due_date,
            property_title: property?.title || "",
          }
        }) as T[]
    }
  const sqlLower = sql.toLowerCase()

  // Handle COUNT queries with DISTINCT for leases (tenant count)
  if (sqlLower.includes("count(distinct") && sqlLower.includes("from leases")) {
    const landlordId = params?.[0]
    const uniqueTenants = new Set(
      mockDB.leases.filter((l) => l.landlord_id === landlordId).map((l) => l.tenant_id)
    )
    return [{ count: uniqueTenants.size }] as T[]
  }

  // Handle SUM queries for payments
  if (sqlLower.includes("coalesce(sum(amount)") && sqlLower.includes("from payments")) {
    const landlordId = params?.[0]
    const total = mockDB.payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0)
    return [{ total }] as T[]
  }

  // Handle SUM queries for expected income from leases
  if (sqlLower.includes("coalesce(sum(rent_amount)") && sqlLower.includes("from leases")) {
    const landlordId = params?.[0]
    const total = mockDB.leases
      .filter((l) => l.landlord_id === landlordId && l.status === "active")
      .reduce((sum, l) => sum + l.rent_amount, 0)
    return [{ total }] as T[]
  }

  // Handle leases JOIN users JOIN properties query (for tenants list)
  if (sqlLower.includes("from leases l") && sqlLower.includes("join users u") && sqlLower.includes("join properties p")) {
    const landlordId = params?.[0]
    const leases = mockDB.leases.filter((l) => l.landlord_id === landlordId)
    
    const results = leases.map((lease) => {
      const tenant = mockDB.users.find((u) => u.id === lease.tenant_id)
      const property = mockDB.properties.find((p) => p.id === lease.property_id)
      
      return {
        lease_id: lease.id,
        tenant_id: lease.tenant_id,
        property_id: lease.property_id,
        lease_start: lease.start_date,
        lease_end: lease.end_date,
        rent_amount: lease.rent_amount,
        lease_status: lease.status,
        created_at: lease.created_at,
        user_id: tenant?.id || "",
        first_name: tenant?.first_name || "",
        last_name: tenant?.last_name || "",
        email: tenant?.email || "",
        phone: tenant?.phone || "",
        is_verified: tenant?.is_verified || false,
        property_title: property?.title || "Not assigned",
        property_address: property?.address || "",
      }
    })
    
    return results as T[]
  }

  // Handle leases query for tenant dashboard (active lease)
  if (sqlLower.includes("from leases l") && sqlLower.includes("where l.tenant_id")) {
    const tenantId = params?.[0]
    const activeLease = mockDB.leases.find((l) => l.tenant_id === tenantId && l.status === "active")
    
    if (activeLease) {
      const property = mockDB.properties.find((p) => p.id === activeLease.property_id)
      const landlord = mockDB.users.find((u) => u.id === activeLease.landlord_id)
      
      return [{
        id: activeLease.id,
        title: property?.title || "",
        address: property?.address || "",
        rent_amount: activeLease.rent_amount,
        start_date: activeLease.start_date,
        end_date: activeLease.end_date,
        landlord_first: landlord?.first_name || "",
        landlord_last: landlord?.last_name || "",
      }] as T[]
    }
    return []
  }

  // Users queries
  if (sqlLower.includes("from users")) {
    if (sqlLower.includes("where email")) {
      const email = params?.[0]
      const user = mockDB.users.find((u) => u.email === email)
      return user ? [user as T] : []
    }
    if (sqlLower.includes("where id")) {
      const id = params?.[0]
      const user = mockDB.users.find((u) => u.id === id)
      return user ? [user as T] : []
    }
    if (sqlLower.includes("where role")) {
      const role = params?.[0]
      return mockDB.users.filter((u) => u.role === role) as T[]
    }
    return mockDB.users as T[]
  }

  // Properties queries (handle JOIN with users for landlord info)
  if (sqlLower.includes("from properties")) {
    // Handle properties with landlord JOIN
    if (sqlLower.includes("join users u on p.landlord_id")) {
      let filteredProperties = [...mockDB.properties]
      
      // Filter by landlord_id if present
      if (sqlLower.includes("p.landlord_id = ?")) {
        const landlordId = params?.[0]
        filteredProperties = filteredProperties.filter((p) => p.landlord_id === landlordId)
      }
      
      // Filter by availability for tenant/public queries
      if (sqlLower.includes("p.is_published = 1") && sqlLower.includes("p.status = 'available'")) {
        filteredProperties = filteredProperties.filter((p) => p.is_available)
      }
      
      // Format properties with landlord info
      return filteredProperties.map((p) => {
        const landlord = mockDB.users.find((u) => u.id === p.landlord_id)
        return {
          ...p,
          status: p.is_available ? "available" : "rented",
          is_published: true,
          currency: "TZS",
          country: "Tanzania",
          landlord_name: landlord ? `${landlord.first_name} ${landlord.last_name}` : "Unknown",
          landlord_phone: landlord?.phone || "",
          landlord_verified: landlord?.is_verified || false,
        }
      }) as T[]
    }
    
    if (sqlLower.includes("where id")) {
      const id = params?.[0]
      const prop = mockDB.properties.find((p) => p.id === id)
      if (prop) {
        return [{
          ...prop,
          status: prop.is_available ? "available" : "rented",
          is_published: true,
          currency: "TZS",
          country: "Tanzania",
        }] as T[]
      }
      return []
    }
    if (sqlLower.includes("where landlord_id")) {
      const landlordId = params?.[0]
      return mockDB.properties.filter((p) => p.landlord_id === landlordId).map((p) => ({
        ...p,
        status: p.is_available ? "available" : "rented",
        is_published: true,
        currency: "TZS",
        country: "Tanzania",
      })) as T[]
    }
    if (sqlLower.includes("where is_available")) {
      return mockDB.properties.filter((p) => p.is_available).map((p) => ({
        ...p,
        status: "available",
        is_published: true,
        currency: "TZS",
        country: "Tanzania",
      })) as T[]
    }
    return mockDB.properties.map((p) => ({
      ...p,
      status: p.is_available ? "available" : "rented",
      is_published: true,
      currency: "TZS",
      country: "Tanzania",
    })) as T[]
  }

  // Applications queries
  if (sqlLower.includes("from applications")) {
    if (sqlLower.includes("where tenant_id")) {
      const tenantId = params?.[0]
      return mockDB.applications.filter((a) => a.tenant_id === tenantId) as T[]
    }
    if (sqlLower.includes("where id")) {
      const id = params?.[0]
      const app = mockDB.applications.find((a) => a.id === id)
      return app ? [app as T] : []
    }
    if (sqlLower.includes("where a.landlord_id")) {
      const landlordId = params?.[0]
      return mockDB.applications.filter((a) => a.tenant_id === landlordId || true) as T[] // Mock returns all for simplicity
    }
    return mockDB.applications as T[]
  }

  // Payments queries - Enhanced for finance dashboard
  if (sqlLower.includes("from payments")) {
    // Handle COUNT(*) for payments
    if (sqlLower.includes("count(*)")) {
      const landlordId = params?.[0]
      const filtered = mockDB.payments.filter((p) => p.landlord_id === landlordId)
      return [{ total: filtered.length }] as T[]
    }
    
    // Handle SUM for cash collected
    if (sqlLower.includes("sum(p.amount)") && sqlLower.includes("status = 'completed'")) {
      const landlordId = params?.[0]
      const total = mockDB.payments
        .filter((p) => p.landlord_id === landlordId && p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0)
      return [{ total_collected: total }] as T[]
    }
    
    // Handle SUM for arrears (pending/overdue)
    if (sqlLower.includes("sum(p.amount)") && sqlLower.includes("pending")) {
      const landlordId = params?.[0]
      const total = mockDB.payments
        .filter((p) => p.landlord_id === landlordId && (p.status === "pending" || p.status === "overdue"))
        .reduce((sum, p) => sum + p.amount, 0)
      return [{ total_arrears: total }] as T[]
    }
    
    // Handle payment status GROUP BY for trends
    if (sqlLower.includes("group by p.status")) {
      const landlordId = params?.[0]
      const filtered = mockDB.payments.filter((p) => p.landlord_id === landlordId)
      const grouped: { [key: string]: { count: number; total: number } } = {}
      
      for (const payment of filtered) {
        if (!grouped[payment.status]) {
          grouped[payment.status] = { count: 0, total: 0 }
        }
        grouped[payment.status].count++
        grouped[payment.status].total += payment.amount
      }
      
      return Object.entries(grouped).map(([status, data]) => ({
        status,
        count: data.count,
        total: data.total,
      })) as T[]
    }
    
    // Handle payments with tenant/property JOIN for transactions list
    if (sqlLower.includes("join users") && sqlLower.includes("join properties")) {
      const landlordId = params?.[0]
      const filtered = mockDB.payments.filter((p) => p.landlord_id === landlordId)
      
      return filtered.map((payment) => {
        const tenant = mockDB.users.find((u) => u.id === payment.tenant_id)
        const property = mockDB.properties.find((p) => p.id === payment.property_id)
        
        return {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency || "TZS",
          status: payment.status,
          payment_type: payment.payment_type,
          payment_method: payment.payment_method,
          payment_reference: payment.payment_reference,
          due_date: payment.due_date,
          paid_date: payment.paid_date,
          created_at: payment.created_at,
          first_name: tenant?.first_name || "",
          last_name: tenant?.last_name || "",
          email: tenant?.email || "",
          property_title: property?.title || "",
          property_address: property?.address || "",
          tenant_name: tenant ? `${tenant.first_name} ${tenant.last_name}` : "",
        }
      }) as T[]
    }
    
    // Handle arrears query with days overdue calculation
    if (sqlLower.includes("datediff")) {
      const asOfDate = params?.[0]
      const landlordId = params?.[1]
      const filtered = mockDB.payments.filter(
        (p) => p.landlord_id === landlordId && (p.status === "pending" || p.status === "overdue") && p.due_date
      )
      
      return filtered.map((payment) => {
        const tenant = mockDB.users.find((u) => u.id === payment.tenant_id)
        const property = mockDB.properties.find((p) => p.id === payment.property_id)
        const dueDate = new Date(payment.due_date)
        const asOf = new Date(asOfDate)
        const daysOverdue = Math.floor((asOf.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
        
        return {
          id: payment.id,
          tenant_id: payment.tenant_id,
          property_id: payment.property_id,
          amount: payment.amount,
          due_date: payment.due_date,
          status: payment.status,
          days_overdue: daysOverdue,
          first_name: tenant?.first_name || "",
          last_name: tenant?.last_name || "",
          email: tenant?.email || "",
          phone: tenant?.phone || "",
          property_title: property?.title || "",
        }
      }) as T[]
    }
    
    // Default: return all payments for landlord
    const landlordId = params?.[0]
    if (sqlLower.includes("where p.landlord_id") || sqlLower.includes("where pay.landlord_id")) {
      return mockDB.payments.filter((p) => p.landlord_id === landlordId) as T[]
    }
    
    return mockDB.payments as T[]
  }

  // Verifications queries
  if (sqlLower.includes("from verifications")) {
    if (sqlLower.includes("where user_id")) {
      const userId = params?.[0]
      return mockDB.verifications.filter((v) => v.user_id === userId) as T[]
    }
    return mockDB.verifications as T[]
  }

  // Count queries
  if (sqlLower.includes("count(*)")) {
    if (sqlLower.includes("from properties")) {
      const landlordId = params?.[0]
      if (sqlLower.includes("where landlord_id")) {
        return [{ count: mockDB.properties.filter((p) => p.landlord_id === landlordId).length }] as T[]
      }
      return [{ count: mockDB.properties.length }] as T[]
    }
    if (sqlLower.includes("from applications")) {
      const landlordId = params?.[0]
      // For pending applications count
      if (sqlLower.includes("status = 'pending'")) {
        return [{ count: mockDB.applications.filter((a) => a.status === "pending").length }] as T[]
      }
      return [{ count: mockDB.applications.length }] as T[]
    }
    if (sqlLower.includes("from users")) {
      return [{ count: mockDB.users.length }] as T[]
    }
  }

  return []
}

function handleMockInsert(sql: string, params?: any[]): { insertId: string; affectedRows: number } {
    if (sql.toLowerCase().includes('into documents')) {
      const doc: MockDocument = {
        id: params?.[0] || generateUUID(),
        user_id: params?.[1] || '',
        document_type: params?.[2] || 'other',
        file_name: params?.[3] || '',
        file_url: params?.[4] || '',
        file_size: params?.[5] || 0,
        mime_type: params?.[6] || '',
        is_verified: 0,
        expires_at: null,
        created_at: new Date(),
      };
      mockDB.documents.push(doc);
      return { insertId: doc.id, affectedRows: 1 };
    }
  const sqlLower = sql.toLowerCase()
  const id = params?.[0] || generateUUID()

  if (sqlLower.includes("into users")) {
    const user: MockUser = {
      id: id,
      email: params?.[1] || "",
      password_hash: params?.[2] || "",
      first_name: params?.[3] || "",
      last_name: params?.[4] || "",
      phone: params?.[5] || "",
      role: params?.[6] || "tenant",
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    }
    mockDB.users.push(user)
    return { insertId: user.id, affectedRows: 1 }
  }

  // INSERT INTO properties (id, landlord_id, title, description, property_type, status, address, city, state, country,
  // bedrooms, bathrooms, area_sqft, rent_amount, currency, security_deposit, is_furnished, parking_spaces, amenities, images, ...)
  if (sqlLower.includes("into properties")) {
    const property: MockProperty = {
      id: id,
      landlord_id: params?.[1] || "",
      title: params?.[2] || "",
      description: params?.[3] || "",
      property_type: params?.[4] || "apartment",
      address: params?.[5] || "",
      city: params?.[6] || "",
      state: params?.[7] || "",
      zip_code: "",
      bedrooms: params?.[9] || 1,
      bathrooms: params?.[10] || 1,
      area_sqft: params?.[11] || 0,
      rent_amount: params?.[12] || 0,
      deposit_amount: params?.[14] || 0,
      is_available: true,
      amenities: params?.[17] || "[]",
      created_at: new Date(),
    }
    mockDB.properties.push(property)
    console.log("[DB] Mock property created:", property)
    return { insertId: property.id, affectedRows: 1 }
  }

  if (sqlLower.includes("into applications")) {
    const application: MockApplication = {
      id: id,
      property_id: params?.[1] || "",
      tenant_id: params?.[2] || "",
      status: "pending",
      move_in_date: params?.[3] || "",
      message: params?.[4] || "",
      created_at: new Date(),
    }
    mockDB.applications.push(application)
    return { insertId: application.id, affectedRows: 1 }
  }

  if (sqlLower.includes("into payments")) {
    const payment: MockPayment = {
      id: id,
      tenancy_id: params?.[1] || "",
      tenant_id: params?.[2] || "",
      landlord_id: params?.[3] || "",
      property_id: params?.[4] || "",
      amount: params?.[6] || 0,
      currency: params?.[7] || "TZS",
      payment_type: params?.[5] || "rent",
      payment_method: params?.[9] || "bank_transfer",
      payment_reference: params?.[10] || `PAY-${Date.now()}`,
      status: params?.[8] || "pending",
      due_date: params?.[11] || "",
      paid_date: null,
      created_at: new Date(),
    }
    mockDB.payments.push(payment)
    console.log("[DB] Mock payment created:", payment)
    return { insertId: payment.id, affectedRows: 1 }
  }

  // Handle leases insert
  // INSERT INTO leases (id, property_id, tenant_id, landlord_id, start_date, end_date, rent_amount, security_deposit, status, created_at)
  if (sqlLower.includes("into leases")) {
    const lease: MockLease = {
      id: id,
      property_id: params?.[1] || "",
      tenant_id: params?.[2] || "",
      landlord_id: params?.[3] || "",
      start_date: params?.[4] || new Date().toISOString().split("T")[0],
      end_date: params?.[5] || "",
      rent_amount: params?.[6] || 0,
      security_deposit: params?.[7] || 0,
      status: params?.[8] || "active",
      created_at: new Date(),
    }
    mockDB.leases.push(lease)
    console.log("[DB] Mock lease created:", lease)
    return { insertId: lease.id, affectedRows: 1 }
  }

  if (sqlLower.includes("into verifications")) {
    mockDB.verifications.push({
      id: id,
      user_id: params?.[1] || "",
      type: params?.[2] || "",
      status: params?.[3] || "pending",
      data: params?.[4] || "{}",
      created_at: new Date(),
    })
    return { insertId: id, affectedRows: 1 }
  }

  return { insertId: id, affectedRows: 1 }
}

function handleMockExecute(sql: string, params?: any[]): { affectedRows: number } {
  const sqlLower = sql.toLowerCase()

  if (sqlLower.includes("update users") && sqlLower.includes("is_verified")) {
    const userId = params?.[params.length - 1]
    const user = mockDB.users.find((u) => u.id === userId)
    if (user) {
      user.is_verified = true
    }
    return { affectedRows: 1 }
  }

  if (sqlLower.includes("update applications")) {
    const appId = params?.[params.length - 1]
    const app = mockDB.applications.find((a) => a.id === appId)
    if (app && params?.[0]) {
      app.status = params[0]
    }
    return { affectedRows: 1 }
  }

  // Handle property status update (when tenant is assigned)
  if (sqlLower.includes("update properties") && sqlLower.includes("status")) {
    const propertyId = params?.[params.length - 1]
    const property = mockDB.properties.find((p) => p.id === propertyId)
    if (property) {
      property.is_available = false
      console.log("[DB] Mock property updated to rented:", propertyId)
    }
    return { affectedRows: 1 }
  }

  return { affectedRows: 0 }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
export async function transaction<T>(callback: (connection: { execute: (sql: string, params?: any[]) => Promise<any[]> }) => Promise<T>): Promise<T> {
  const dbPool = getPool()

  if (dbPool) {
    const client = await dbPool.connect()
    try {
      await client.query("BEGIN")
      const result = await callback({
        execute: async (sql: string, params?: any[]) => {
          const queryResult = await client.query(toPostgresParams(sql), params || [])
          return [queryResult.rows]
        },
      })
      await client.query("COMMIT")
      return result
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  }

  // Mock transaction
  const mockConnection = {
    execute: async (sql: string, params?: any[]) => {
      if (sql.toLowerCase().startsWith("select")) {
        return [await query(sql, params)]
      }
      if (sql.toLowerCase().startsWith("insert")) {
        return [await insert(sql, params)]
      }
      return [await execute(sql, params)]
    },
  } as any
  return callback(mockConnection)
}

export async function checkConnection(): Promise<boolean> {
  const dbPool = getPool()
  if (dbPool) {
    try {
      await dbPool.query("SELECT 1")
      return true
    } catch {
      return false
    }
  }
  return true // Mock always returns true
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

export function getMockDB() {
  return mockDB
}

// Initialize mock data with demo users and sample data
function initializeMockData() {
  if (mockDB.users.length === 0) {
    // Demo landlord (default)
    const landlordId = "demo-landlord-001"
    mockDB.users.push({
      id: landlordId,
      email: "landlord@demo.com",
      password_hash: "$2a$10$demohashedpassword",
      first_name: "John",
      last_name: "Landlord",
      phone: "+255712345678",
      role: "landlord",
      is_verified: true,
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    })

    // Custom landlord for uploads (user_id = e55855ac-d3be-42e4-bfbf-0113b186a6d4)
    mockDB.users.push({
      id: "e55855ac-d3be-42e4-bfbf-0113b186a6d4",
      email: "customlandlord@demo.com",
      password_hash: "$2a$10$demohashedpassword",
      first_name: "Custom",
      last_name: "Landlord",
      phone: "+255799999999",
      role: "landlord",
      is_verified: true,
      created_at: new Date("2024-01-02"),
      updated_at: new Date("2024-01-02"),
    })

    // Demo tenants
    const tenant1Id = "demo-tenant-001"
    const tenant2Id = "demo-tenant-002"
    const tenant3Id = "demo-tenant-003"

    mockDB.users.push(
      {
        id: tenant1Id,
        email: "sarah@demo.com",
        password_hash: "$2a$10$demohashedpassword",
        first_name: "Sarah",
        last_name: "Mwanga",
        phone: "+255722111222",
        role: "tenant",
        is_verified: true,
        created_at: new Date("2024-02-15"),
        updated_at: new Date("2024-02-15"),
      },
      {
        id: tenant2Id,
        email: "michael@demo.com",
        password_hash: "$2a$10$demohashedpassword",
        first_name: "Michael",
        last_name: "Kimaro",
        phone: "+255733222333",
        role: "tenant",
        is_verified: true,
        created_at: new Date("2024-03-10"),
        updated_at: new Date("2024-03-10"),
      },
      {
        id: tenant3Id,
        email: "grace@demo.com",
        password_hash: "$2a$10$demohashedpassword",
        first_name: "Grace",
        last_name: "Mushi",
        phone: "+255744333444",
        role: "tenant",
        is_verified: false,
        created_at: new Date("2024-04-20"),
        updated_at: new Date("2024-04-20"),
      }
    )

    // Demo properties
    const property1Id = "demo-property-001"
    const property2Id = "demo-property-002"
    const property3Id = "demo-property-003"

    mockDB.properties.push(
      {
        id: property1Id,
        landlord_id: landlordId,
        title: "Modern 2BR Apartment - Masaki",
        description: "Beautiful modern apartment with ocean views",
        address: "123 Ocean Road, Masaki",
        city: "Dar es Salaam",
        state: "Dar es Salaam",
        zip_code: "11101",
        property_type: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1200,
        rent_amount: 2500000,
        deposit_amount: 2500000,
        is_available: false,
        amenities: '["parking", "security", "gym"]',
        created_at: new Date("2024-01-15"),
      },
      {
        id: property2Id,
        landlord_id: landlordId,
        title: "Spacious 3BR House - Mikocheni",
        description: "Family home with garden and parking",
        address: "45 Garden Street, Mikocheni",
        city: "Dar es Salaam",
        state: "Dar es Salaam",
        zip_code: "11102",
        property_type: "house",
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 2000,
        rent_amount: 3500000,
        deposit_amount: 3500000,
        is_available: false,
        amenities: '["parking", "garden", "security"]',
        created_at: new Date("2024-02-01"),
      },
      {
        id: property3Id,
        landlord_id: landlordId,
        title: "Cozy 1BR Studio - Upanga",
        description: "Perfect for singles or couples",
        address: "78 Palm Avenue, Upanga",
        city: "Dar es Salaam",
        state: "Dar es Salaam",
        zip_code: "11103",
        property_type: "studio",
        bedrooms: 1,
        bathrooms: 1,
        area_sqft: 600,
        rent_amount: 1200000,
        deposit_amount: 1200000,
        is_available: true,
        amenities: '["parking", "security"]',
        created_at: new Date("2024-03-01"),
      }
    )

    // Demo leases (connects tenants to properties)
    mockDB.leases.push(
      {
        id: "demo-lease-001",
        property_id: property1Id,
        tenant_id: tenant1Id,
        landlord_id: landlordId,
        start_date: "2024-03-01",
        end_date: "2025-02-28",
        rent_amount: 2500000,
        security_deposit: 2500000,
        status: "active",
        created_at: new Date("2024-02-25"),
      },
      {
        id: "demo-lease-002",
        property_id: property2Id,
        tenant_id: tenant2Id,
        landlord_id: landlordId,
        start_date: "2024-04-01",
        end_date: "2025-03-31",
        rent_amount: 3500000,
        security_deposit: 3500000,
        status: "active",
        created_at: new Date("2024-03-25"),
      }
    )

    // Demo payments (historical payments for finance dashboard)
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    // Generate payment history for last 6 months
    for (let i = 5; i >= 0; i--) {
      const paymentDate = new Date(currentYear, currentMonth - i, 5)
      const dueDate = new Date(currentYear, currentMonth - i, 1)

      // Tenant 1 payments - always on time
      mockDB.payments.push({
        id: `pay-${tenant1Id}-${i}`,
        tenancy_id: "demo-lease-001",
        tenant_id: tenant1Id,
        landlord_id: landlordId,
        property_id: property1Id,
        amount: 2500000,
        currency: "TZS",
        payment_type: "rent",
        payment_method: "mobile_money",
        payment_reference: `MPESA-${Date.now()}-${i}`,
        status: "completed",
        due_date: dueDate.toISOString().split("T")[0],
        paid_date: paymentDate.toISOString().split("T")[0],
        created_at: paymentDate,
      })

      // Tenant 2 payments - some late
      const tenant2PaidDate = new Date(currentYear, currentMonth - i, i % 2 === 0 ? 3 : 12)
      mockDB.payments.push({
        id: `pay-${tenant2Id}-${i}`,
        tenancy_id: "demo-lease-002",
        tenant_id: tenant2Id,
        landlord_id: landlordId,
        property_id: property2Id,
        amount: 3500000,
        currency: "TZS",
        payment_type: "rent",
        payment_method: "bank_transfer",
        payment_reference: `BANK-${Date.now()}-${i}`,
        status: i === 0 ? "pending" : "completed",
        due_date: dueDate.toISOString().split("T")[0],
        paid_date: i === 0 ? null : tenant2PaidDate.toISOString().split("T")[0],
        created_at: tenant2PaidDate,
      })
    }

    // Demo expenses
    mockDB.expenses.push(
      {
        id: "exp-001",
        landlord_id: landlordId,
        property_id: property1Id,
        category: "maintenance",
        description: "AC Repair",
        amount: 350000,
        expense_date: new Date(currentYear, currentMonth - 1, 15).toISOString().split("T")[0],
        status: "paid",
        created_at: new Date(currentYear, currentMonth - 1, 15),
      },
      {
        id: "exp-002",
        landlord_id: landlordId,
        property_id: property2Id,
        category: "utilities",
        description: "Water bill",
        amount: 120000,
        expense_date: new Date(currentYear, currentMonth, 10).toISOString().split("T")[0],
        status: "paid",
        created_at: new Date(currentYear, currentMonth, 10),
      },
      {
        id: "exp-003",
        landlord_id: landlordId,
        property_id: null,
        category: "management",
        description: "Property management fee",
        amount: 500000,
        expense_date: new Date(currentYear, currentMonth, 1).toISOString().split("T")[0],
        status: "paid",
        created_at: new Date(currentYear, currentMonth, 1),
      }
    )

    // Demo rent obligations (for arrears tracking)
    mockDB.rent_obligations.push(
      {
        id: "obl-001",
        lease_id: "demo-lease-001",
        tenant_id: tenant1Id,
        landlord_id: landlordId,
        property_id: property1Id,
        amount_due: 2500000,
        due_date: new Date(currentYear, currentMonth, 1).toISOString().split("T")[0],
        status: "paid",
        amount_paid: 2500000,
        created_at: new Date(currentYear, currentMonth - 1, 25),
      },
      {
        id: "obl-002",
        lease_id: "demo-lease-002",
        tenant_id: tenant2Id,
        landlord_id: landlordId,
        property_id: property2Id,
        amount_due: 3500000,
        due_date: new Date(currentYear, currentMonth, 1).toISOString().split("T")[0],
        status: "pending",
        amount_paid: 0,
        created_at: new Date(currentYear, currentMonth - 1, 25),
      }
    )

    console.log("[DB] Mock data initialized with demo users, properties, leases, payments, and expenses")
  }
}

// Initialize mock data on module load
initializeMockData()

export default {
  query,
  queryOne,
  insert,
  execute,
  transaction,
  generateUUID,
  checkConnection,
  closePool,
  getMockDB,
}
