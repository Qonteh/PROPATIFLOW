# 🚀 Neon Database Setup Guide

## Overview
Your Next.js frontend is now configured to communicate with your Neon PostgreSQL database. This guide walks you through verifying the connection and getting your application running.

## ✅ What I've Set Up

### 1. Environment Variables (.env.local)
✓ Added `DATABASE_URL` with your Neon connection string
✓ Preserved existing configuration variables

### 2. Database Connection Module (`lib/db/neon.ts`)
✓ PostgreSQL connection pool with optimal settings
✓ Error handling and logging
✓ Connection testing utility

### 3. Query Helpers (`lib/db/queries.ts`)
✓ Ready-to-use functions for common operations:
  - User lookups (by ID, by email)
  - Property searches and filters
  - Application management
  - Notifications & documents
  - Database statistics

### 4. Health Check API (`app/api/health/route.ts`)
✓ Test database connectivity
✓ View database statistics
✓ List available tables

### 5. Properties API (New PostgreSQL version)
✓ Fetch properties with role-based filtering
✓ Search and filter functionality
✓ Create new properties

---

## 🔧 Quick Start

### Step 1: Install Dependencies (if needed)
```bash
npm install
```

The following packages are already installed:
- `pg`: PostgreSQL client for Node.js ✓
- `@types/pg`: TypeScript definitions ✓

### Step 2: Start Development Server
```bash
npm run dev
```
Server will start on `http://localhost:3002`

### Step 3: Test Database Connection
Open your browser and visit:
```
http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Successfully connected to Neon database",
  "connected": true,
  "timestamp": "2026-04-15T...",
  "stats": {
    "properties": 5,
    "users": 3,
    "applications": 3
  },
  "tables": [
    "applications",
    "background_checks",
    "credit_scores",
    "documents",
    ...
  ]
}
```

---

## 📡 API Endpoints

### 1. Health Check
```
GET /api/health
```
Returns database connection status and statistics.

### 2. Properties
```
GET /api/properties
  ?city=dar-es-salaam
  &type=house
  &minRent=45000
  &maxRent=180000
  &limit=50
  &offset=0

POST /api/properties
```
**Required fields for POST:**
- title
- address
- city
- state
- rent_amount

---

## 🔑 Your Neon Credentials
```
Host: ep-shy-wildflower-ang17r18-pooler.c-6.us-east-1.aws.neon.tech
Database: rental_platform
User: neondb_owner
Branch: production
Region: us-east-1
```

---

## 📊 Database Schema (19 Tables)

### Core Tables
- `users` (3 rows) - User accounts
- `properties` (5 rows) - Rental listings
- `applications` (3 rows) - Rental applications
- `documents` (8 rows) - Uploaded files
- `notifications` (7 rows) - User alerts

### Supporting Tables
- background_checks
- credit_scores
- expenses
- favorites
- leases
- maintenance_requests
- messages
- notification_settings
- payments
- payment_settings
- property_views
- sessions
- tenant_profiles
- verifications

---

## 🛠️ Common Tasks

### Connect to Database Directly
```bash
# Using psql CLI
psql "postgresql://neondb_owner:npg_X68rkjQZsoeLQep-shy-wildflower-ang17r18-pooler.c-6.us-east-1.aws.neon.tech/rental_platform?sslmode=require&channel_binding=require"
```

### Query Functions Example
```typescript
import { 
  getUserById, 
  getAvailableProperties,
  getApplicationsByTenant 
} from "@/lib/db/queries"

// Get user
const user = await getUserById("23cffaef-b163-402d-a4b4-bb7c3b9f4f41")

// Get available properties
const properties = await getAvailableProperties(10, 0)

// Get tenant applications
const apps = await getApplicationsByTenant("23cffaef-b163-402d-a4b4-bb7c3b9f4f41")
```

### Execute Custom Queries
```typescript
import { query } from "@/lib/db/neon"

const result = await query(
  'SELECT * FROM "properties" WHERE "city" = $1',
  ['dar-es-salaam']
)

console.log(result.rows)
```

---

## ⚠️ Troubleshooting

### Connection Timeout
**Error:** `Error: connect ECONNREFUSED`
**Solution:** 
1. Check `DATABASE_URL` in `.env.local`
2. Verify Neon is running: `npm run dev`
3. Check internet connection

### Query Parameter Errors
**Note:** PostgreSQL uses `$1, $2, ...` for parameters (not `?` like MySQL)
- ✓ Correct: `WHERE id = $1`
- ✗ Wrong: `WHERE id = ?`

### Table Not Found
**Error:** `Table "applications" does not exist`
**Solution:** 
1. Verify you imported the SQL schema
2. Run: `/api/health` to see available tables
3. Re-import `rental_platform.sql` if needed

---

## 📝 Next Steps

1. ✅ Test connection via `/api/health`
2. ✅ Verify existing data loads
3. ✅ Update other API routes to use Neon (`lib/db/neon` instead of `lib/db/mysql`)
4. ✅ Test user authentication with new database
5. ✅ Deploy to production

---

## 🎯 Migration Checklist

- [ ] Database connection tested
- [ ] `/api/health` returns success
- [ ] Properties API working
- [ ] Users API working
- [ ] Applications API working
- [ ] Auth routes updated
- [ ] Frontend fetching data successfully
- [ ] Notifications working
- [ ] Payments API configured
- [ ] Ready for production deployment

---

## 📞 Quick Reference

**Database URL:** *(in .env.local)*
```
postgresql://neondb_owner:npg_X68rkjQZsoeLQep-shy-wildflower-ang17r18-pooler.c-6.us-east-1.aws.neon.tech/rental_platform?sslmode=require&channel_binding=require
```

**Key Files:**
- Configuration: `.env.local`
- Connection: `lib/db/neon.ts`
- Queries: `lib/db/queries.ts`
- Health Check: `app/api/health/route.ts`

**Test Command:**
```bash
curl http://localhost:3002/api/health
```

---

Good luck! 🚀 Your database is ready to go!
