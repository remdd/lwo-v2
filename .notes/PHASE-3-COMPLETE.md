# Phase 3: Database & Infrastructure Setup - COMPLETE ✅

**Completion Date:** May 6, 2026  
**Status:** All tasks completed and verified

---

## Overview

Phase 3 successfully established the database infrastructure using Supabase PostgreSQL with proper connection pooling, migrations, and seed data. The database is now ready for development across all applications (public site, admin site, and CMS).

---

## What Was Accomplished

### 1. Supabase PostgreSQL Setup ✅

- **Project Created:** `lwo-dev` on Supabase
- **Region:** EU West (London) - `aws-1-eu-west-2`
- **Database Host:** `db.zxrwiwbvnkpbsysqybmh.supabase.co`
- **Connection Pooling Configured:**
  - Transaction pooler: Port 6543 (for app queries with `?pgbouncer=true`)
  - Session pooler: Port 5432 (for migrations)

### 2. Prisma Configuration ✅

- **Schema Updated** with `directUrl` for migration compatibility
- **Initial Migration Created:** `20260506220652_init`
- **8 Core Entities Deployed:**
  - User (authentication & authorization)
  - Customer (booking & order management)
  - Experience (wildlife encounters)
  - AvailabilityRule (scheduling & capacity)
  - Booking (reservations)
  - Product (shop items)
  - Order (e-commerce transactions)
  - OrderItem (order line items)

### 3. Database Seed Script ✅

**Created:** `packages/database/prisma/seed.ts`

**Sample Data Populated:**
- 1 Admin user (admin/admin123)
- 1 Test customer (test@example.com)
- 3 Wildlife experiences (Meet the Meerkats, Feed the Lemurs, Keeper for a Day)
- 1 Availability rule (meerkats, daily 10:00-16:00)
- 1 Sample booking
- 2 Products (T-Shirt, Plush Toy)
- 1 Sample order with 2 items

**Command:** `pnpm --filter=database db:seed`

### 4. Connection String Configuration ✅

**All .env.example files updated:**
- `packages/database/.env.example` - with DATABASE_URL and DIRECT_URL
- `apps/public-site/.env.example` - with pooled connection
- `apps/admin-site/.env.example` - with pooled connection

**Critical Configuration:**
```bash
# Transaction pooler for app queries (disable prepared statements)
DATABASE_URL="postgresql://postgres.PROJECT_ID:[PASSWORD]@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session pooler for migrations
DIRECT_URL="postgresql://postgres.PROJECT_ID:[PASSWORD]@aws-1-eu-west-2.pooler.supabase.com:5432/postgres"
```

### 5. Documentation ✅

**Created:** `.notes/setup/database-setup.md`

Comprehensive guide covering:
- Supabase project setup
- Connection pooling configuration
- Migration workflow
- Seed data management
- Troubleshooting common issues
- Security best practices

### 6. Testing & Verification ✅

**Created:** `packages/database/test-connection.ts`

- Database connectivity verified
- All queries working correctly
- Seed script runs successfully (idempotent with upsert)
- Data integrity confirmed

---

## Key Technical Decisions

### Connection Pooling Strategy

**Decision:** Use Supabase's transaction pooler (port 6543) with `?pgbouncer=true`

**Rationale:**
- Prevents "prepared statement already exists" errors
- Compatible with serverless Next.js functions
- Optimizes connection usage for production

**Migration Handling:** Session pooler (port 5432) via `directUrl` for full PostgreSQL protocol support

### Seed Data Approach

**Decision:** Use Prisma `upsert` operations where possible

**Benefits:**
- Idempotent - can run multiple times safely
- Preserves existing data
- Updates changed values
- Simplifies development workflow

### SQLite for Strapi

**Decision:** Keep SQLite for local Strapi development

**Rationale:**
- Simpler setup for content management
- CMS data separate from application database
- Easy to reset/rebuild content structure
- Can switch to PostgreSQL for production if needed

---

## Database Schema Summary

### Core Entities (8 tables)

1. **users** - Authentication & authorization
   - Fields: email, password (hashed), name, role
   - Enums: UserRole (ADMIN, STAFF)

2. **customers** - Customer profiles
   - Fields: email, name, phone, marketing preferences
   - Relations: bookings, orders

3. **experiences** - Wildlife encounters
   - Fields: name, description, duration, pricing, capacity
   - Enums: ExperienceStatus (ACTIVE, INACTIVE)

4. **availability_rules** - Scheduling
   - Fields: experience, day of week, time ranges, capacity overrides
   - Enums: DayOfWeek (MONDAY-SUNDAY)

5. **bookings** - Reservations
   - Fields: customer, experience, date, participants, payment status
   - Enums: BookingStatus (PENDING, CONFIRMED, CANCELLED, COMPLETED)
   - Enums: PaymentStatus (PENDING, PAID, REFUNDED)

6. **products** - Shop items
   - Fields: name, description, price, stock, images
   - Enums: ProductStatus (ACTIVE, INACTIVE, OUT_OF_STOCK)

7. **orders** - E-commerce transactions
   - Fields: customer, order number, totals, shipping, payment status
   - Enums: OrderStatus (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)
   - JSON: shippingAddress

8. **order_items** - Order line items
   - Fields: order, product, quantity, pricing

### Indexes & Performance
- Optimized queries for common lookups
- Foreign key constraints for data integrity
- Cascading deletes where appropriate
- Decimal precision for monetary values

---

## Commands Reference

```bash
# Generate Prisma Client (after schema changes)
pnpm --filter=database db:generate

# Create new migration
pnpm --filter=database db:migrate

# Apply migrations to database
pnpm --filter=database db:push

# Seed database with sample data
pnpm --filter=database db:seed

# Test database connectivity
pnpx tsx packages/database/test-connection.ts

# Reset database (CAUTION: destroys all data)
pnpm --filter=database db:reset
```

---

## Files Created/Modified

### New Files
- `packages/database/prisma/migrations/20260506220652_init/migration.sql`
- `packages/database/prisma/migrations/migration_lock.toml`
- `packages/database/prisma/seed.ts`
- `packages/database/test-connection.ts`
- `.notes/setup/database-setup.md`
- `apps/public-site/.env.example`
- `apps/admin-site/.env.example`
- `apps/cms/types/generated/components.d.ts`
- `apps/cms/types/generated/contentTypes.d.ts`

### Modified Files
- `packages/database/prisma/schema.prisma` - added directUrl
- `packages/database/package.json` - added db:seed script
- `packages/database/.env.example` - updated connection strings
- `pnpm-workspace.yaml` - added better-sqlite3 to allowBuilds
- `pnpm-lock.yaml` - dependency updates

---

## Environment Setup Checklist

For each developer/environment:

- [ ] Copy `.env.example` to `.env` in `packages/database`
- [ ] Update DATABASE_URL with actual Supabase credentials
- [ ] Update DIRECT_URL with actual Supabase credentials
- [ ] Run `pnpm --filter=database db:generate` to generate Prisma Client
- [ ] Run `pnpm --filter=database db:push` to apply migrations
- [ ] Run `pnpm --filter=database db:seed` to populate sample data
- [ ] Verify connectivity with test script
- [ ] Copy `.env.example` to `.env` in app directories (public-site, admin-site)
- [ ] Update app DATABASE_URLs with pooled connection string

---

## Security Notes

**CRITICAL:** Never commit actual `.env` files to git!

- All `.env` files are in `.gitignore`
- Only `.env.example` templates are tracked
- Use Vercel/hosting environment variables for production
- Rotate database credentials if accidentally exposed
- Enable Row Level Security (RLS) in Supabase for production

---

## Troubleshooting

### "Prepared statement already exists" Error
**Solution:** Ensure DATABASE_URL includes `?pgbouncer=true`

### Migration Fails
**Solution:** Verify DIRECT_URL is set correctly (session pooler, port 5432)

### Connection Timeout
**Solution:** 
- Check Supabase project is active (not paused)
- Verify credentials are correct
- Ensure network connectivity

### Seed Script Fails
**Solution:**
- Check field names match Prisma schema exactly
- Verify required fields are provided
- Run `pnpm --filter=database db:generate` after schema changes

---

## Next Steps: Phase 4 - Hosting Setup

With the database infrastructure complete, Phase 4 will focus on:

1. **Vercel Deployment** for Next.js apps (public & admin)
2. **Railway/Render** deployment for Strapi CMS
3. **Environment Variable** configuration for production
4. **Domain Setup** and SSL certificates
5. **CI/CD Pipeline** with GitHub Actions
6. **Monitoring** and error tracking setup

---

## Verification Checklist ✅

- [x] Supabase project created and accessible
- [x] Connection pooling configured correctly
- [x] Initial migration applied successfully
- [x] All 8 tables created with correct schema
- [x] Seed script runs without errors
- [x] Sample data populated in all tables
- [x] Database connectivity test passes
- [x] Documentation complete and accurate
- [x] All .env.example files updated
- [x] Git commit created with all changes
- [x] Type checking passes (`pnpm typecheck`)
- [x] Linting passes (`pnpm lint`)

---

**Phase 3 Status:** ✅ COMPLETE

**Commit:** `83ed67b` - "feat: complete Phase 3 database setup with Supabase"

**Ready for:** Phase 4 - Hosting Setup
