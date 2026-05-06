# Database Setup Guide

This guide covers setting up PostgreSQL databases using Supabase for the LWO platform.

## Overview

We use **Supabase** (managed PostgreSQL) for all environments:

- **lwo-dev**: Development and UAT database
- **lwo-production**: Production database

## Supabase Setup

### 1. Create Supabase Projects

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**

**For Development/UAT:**
- **Name:** `lwo-dev`
- **Database Password:** Generate strong password (save securely!)
- **Region:** `eu-west-2` (London) - closest to UK
- **Plan:** Free tier

**For Production:**
- **Name:** `lwo-production`
- **Database Password:** Different strong password
- **Region:** `eu-west-2` (London)
- **Plan:** Free tier (upgrade as needed)

### 2. Get Connection Strings

For each project:

1. Go to **Project Settings** → **Database**
2. Find **Connection Pooling** section
3. Copy the **Connection string** (looks like this):
   ```
   postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
   ```
4. Also copy the **Direct connection** string (Transaction mode):
   ```
   postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:5432/postgres
   ```

**Why two URLs?**
- **DATABASE_URL** (pooled, port 6543): For app queries - faster, handles many connections
- **DIRECT_URL** (direct, port 5432): For migrations - required by Prisma

## Environment Configuration

### Database Package (packages/database/.env)

```env
# Pooled connection for queries
DATABASE_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres"

# Direct connection for migrations
DIRECT_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:5432/postgres"
```

### Public Site (apps/public-site/.env.local)

```env
# Use pooled connection
DATABASE_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres"

# Other config...
NEXT_PUBLIC_STRAPI_URL="http://localhost:1337"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Admin Site (apps/admin-site/.env.local)

```env
# Use pooled connection
DATABASE_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres"

# NextAuth config
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="generate-random-secret"

NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

### CMS (apps/cms/.env)

The CMS can use its own SQLite database for local development, or connect to PostgreSQL:

```env
# Option 1: SQLite (current default for local dev)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Option 2: PostgreSQL (for production/UAT)
# DATABASE_CLIENT=postgres
# DATABASE_HOST=aws-0-eu-west-2.pooler.supabase.com
# DATABASE_PORT=6543
# DATABASE_NAME=postgres
# DATABASE_USERNAME=postgres.[PROJECT-ID]
# DATABASE_PASSWORD=your-password
```

## Running Migrations

### Initial Migration (First Time Setup)

```bash
# Navigate to database package
cd packages/database

# Create migration from schema
pnpm db:migrate

# This will:
# 1. Connect to database using DIRECT_URL
# 2. Create all tables from schema.prisma
# 3. Generate Prisma Client
```

### Subsequent Migrations

When you modify `schema.prisma`:

```bash
# Create a new migration
pnpm --filter=database db:migrate

# Or run from root
pnpm db:migrate
```

### Check Migration Status

```bash
pnpm --filter=database prisma migrate status
```

## Prisma Studio

View and edit database data:

```bash
# Open Prisma Studio
pnpm --filter=database db:studio

# Opens at http://localhost:5555
```

## Database Seeding

Seed the database with test data:

```bash
pnpm --filter=database db:seed
```

The seed script is located at `packages/database/prisma/seed.ts`.

## Common Tasks

### Reset Database (Development Only!)

**⚠️ WARNING: This will delete ALL data!**

```bash
pnpm --filter=database prisma migrate reset

# This will:
# - Drop all tables
# - Re-run all migrations
# - Run seed script
```

### Generate Prisma Client

After pulling changes that modify the schema:

```bash
pnpm --filter=database db:generate
```

### Format Prisma Schema

```bash
pnpm --filter=database prisma format
```

## Environment-Specific Setup

### Local Development

Use `lwo-dev` Supabase project for local development.

### UAT Environment

Use same `lwo-dev` Supabase project but different schema or database (can be configured later if needed).

### Production Environment

Use `lwo-production` Supabase project. **Never** run `prisma migrate reset` on production!

## Troubleshooting

### Connection Errors

If you get connection errors:

1. Check DATABASE_URL is correct (no typos in password)
2. Ensure Supabase project is active (not paused)
3. Check firewall isn't blocking port 6543 or 5432
4. Verify you're using the correct URL (pooled vs direct)

### Migration Errors

If migrations fail:

1. Make sure you're using DIRECT_URL for migrations
2. Check the migration SQL for syntax errors
3. Verify database isn't in a locked state
4. Try running `prisma migrate status` to check state

### "Client is not generated" Errors

Run:
```bash
pnpm --filter=database db:generate
```

### Prisma Client Import Errors

Make sure the database package is built:
```bash
pnpm --filter=database build
```

## Security Best Practices

1. **Never commit `.env` files** - They're gitignored by default
2. **Use different passwords** for dev and production
3. **Rotate credentials** if they're ever exposed
4. **Use connection pooling** for better performance and security
5. **Enable Row Level Security (RLS)** in Supabase for production (can configure later)

## Monitoring

In Supabase dashboard, you can monitor:

- **Database size** - Free tier has 500MB limit
- **Active connections** - Connection pool helps manage this
- **Query performance** - Slow query logs
- **Table statistics** - Row counts, sizes

## Next Steps

Once database is set up:

1. ✅ Run initial migration
2. ✅ Seed with test data
3. ✅ Test connectivity from all apps
4. Move to Phase 4: Hosting Setup
