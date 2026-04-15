import bcrypt from "bcryptjs"

// Mock database for demonstration (replace with actual DB in production)
interface User {
  id: string
  email: string
  password_hash: string
  role: "landlord" | "tenant" | "agent"
  full_name: string
  phone?: string
  created_at: Date
}

interface Property {
  id: string
  landlord_id: string
  agent_id?: string
  title: string
  description: string
  property_type: string
  address: string
  city: string
  state: string
  zip_code: string
  bedrooms: number
  bathrooms: number
  square_feet: number
  rent_amount: number
  security_deposit: number
  available_date: Date
  status: string
  images: string[]
  amenities: string[]
  created_at: Date
}

interface Application {
  id: string
  property_id: string
  tenant_id: string
  landlord_id: string
  status: string
  move_in_date: Date
  lease_term: number
  monthly_income: number
  submitted_at: Date
}

const users: User[] = []
const properties: Property[] = []
const applications: Application[] = []

export const db = {
  users: {
    async create(data: Omit<User, "id" | "created_at">) {
      const user: User = {
        id: crypto.randomUUID(),
        ...data,
        created_at: new Date(),
      }
      users.push(user)
      return user
    },
    async findByEmail(email: string) {
      return users.find((u) => u.email === email)
    },
    async findById(id: string) {
      return users.find((u) => u.id === id)
    },
  },
  properties: {
    async create(data: Omit<Property, "id" | "created_at">) {
      const property: Property = {
        id: crypto.randomUUID(),
        ...data,
        created_at: new Date(),
      }
      properties.push(property)
      return property
    },
    async findAll() {
      return properties
    },
    async findById(id: string) {
      return properties.find((p) => p.id === id)
    },
    async findByLandlord(landlord_id: string) {
      return properties.filter((p) => p.landlord_id === landlord_id)
    },
    async update(id: string, data: Partial<Property>) {
      const index = properties.findIndex((p) => p.id === id)
      if (index !== -1) {
        properties[index] = { ...properties[index], ...data }
        return properties[index]
      }
      return null
    },
  },
  applications: {
    async create(data: Omit<Application, "id" | "submitted_at">) {
      const application: Application = {
        id: crypto.randomUUID(),
        ...data,
        submitted_at: new Date(),
      }
      applications.push(application)
      return application
    },
    async findByTenant(tenant_id: string) {
      return applications.filter((a) => a.tenant_id === tenant_id)
    },
    async findByLandlord(landlord_id: string) {
      return applications.filter((a) => a.landlord_id === landlord_id)
    },
    async findByProperty(property_id: string) {
      return applications.filter((a) => a.property_id === property_id)
    },
    async update(id: string, data: Partial<Application>) {
      const index = applications.findIndex((a) => a.id === id)
      if (index !== -1) {
        applications[index] = { ...applications[index], ...data }
        return applications[index]
      }
      return null
    },
  },
}

// Seed some demo data
async function seedData() {
  if (users.length === 0) {
    // Create demo users
    await db.users.create({
      email: "landlord@demo.com",
      password_hash: await bcrypt.hash("demo123", 10),
      role: "landlord",
      full_name: "John Landlord",
      phone: "555-0101",
    })

    await db.users.create({
      email: "tenant@demo.com",
      password_hash: await bcrypt.hash("demo123", 10),
      role: "tenant",
      full_name: "Sarah Tenant",
      phone: "555-0102",
    })

    await db.users.create({
      email: "agent@demo.com",
      password_hash: await bcrypt.hash("demo123", 10),
      role: "agent",
      full_name: "Mike Agent",
      phone: "555-0103",
    })
  }
}

seedData()
