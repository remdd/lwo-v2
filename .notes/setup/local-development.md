# Local Development Setup Guide

**Last Updated:** 2026-05-06  
**Status:** Template - Will be updated once monorepo is initialized

---

## Prerequisites

Before setting up the LWO platform locally, ensure you have the following installed:

### Required Software

| Software       | Minimum Version | Purpose              | Installation                                                  |
| -------------- | --------------- | -------------------- | ------------------------------------------------------------- |
| **Node.js**    | 20.x LTS        | JavaScript runtime   | [nodejs.org](https://nodejs.org/)                             |
| **pnpm**       | 8.x             | Package manager      | `npm install -g pnpm`                                         |
| **Git**        | 2.x             | Version control      | [git-scm.com](https://git-scm.com/)                           |
| **PostgreSQL** | 14.x            | Database (local dev) | [postgresql.org](https://www.postgresql.org/) OR use Supabase |

### Recommended Tools

- **VS Code** - Recommended IDE with excellent TypeScript support
- **Prisma Extension** - VS Code extension for Prisma schema files
- **ESLint Extension** - For code linting
- **Prettier Extension** - For code formatting

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lwo
```

### 2. Install Dependencies

```bash
# Install pnpm globally if not already installed
npm install -g pnpm

# Install all project dependencies
pnpm install
```

This will install dependencies for all apps and packages in the monorepo.

### 3. Set Up Environment Variables

Each app requires its own `.env` file. Copy the example files and fill in the values:

```bash
# Public site
cp apps/public-site/.env.example apps/public-site/.env.local

# Admin site
cp apps/admin-site/.env.example apps/admin-site/.env.local

# Strapi CMS
cp apps/cms/.env.example apps/cms/.env
```

See the [Environment Variables Reference](#environment-variables-reference) section below for details on each variable.

### 4. Set Up Database

#### Option A: Use Supabase (Recommended for Development)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your connection string from Project Settings → Database
4. Add to `packages/database/.env`:
   ```
   DATABASE_URL="postgresql://..."
   ```

#### Option B: Use Local PostgreSQL

1. Install PostgreSQL locally
2. Create a development database:
   ```bash
   psql -U postgres
   CREATE DATABASE lwo_dev;
   \q
   ```
3. Add to `packages/database/.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/lwo_dev"
   ```

### 5. Run Database Migrations

```bash
# Generate Prisma Client and run migrations
pnpm --filter=database prisma migrate dev
```

This will:

- Create database tables based on Prisma schema
- Generate the Prisma Client for type-safe queries
- Seed the database with initial data (if seed script exists)

### 6. Start Development Servers

```bash
# Start all apps in development mode
pnpm dev
```

Or run individual apps:

```bash
# Public site only (http://localhost:3000)
pnpm dev --filter=public-site

# Admin site only (http://localhost:3001)
pnpm dev --filter=admin-site

# Strapi CMS only (http://localhost:1337)
pnpm dev --filter=cms
```

---

## Environment Variables Reference

### Public Site (`apps/public-site/.env.local`)

```bash
# Database
DATABASE_URL="postgresql://..."

# Strapi CMS
NEXT_PUBLIC_STRAPI_URL="http://localhost:1337"
STRAPI_API_TOKEN="your-strapi-api-token"

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID="sandbox-client-id"
PAYPAL_CLIENT_SECRET="sandbox-client-secret"
PAYPAL_MODE="sandbox" # or "live" for production

# Email (Mailgun)
MAILGUN_API_KEY="your-mailgun-api-key"
MAILGUN_DOMAIN="your-domain.mailgun.org"
MAILGUN_FROM_EMAIL="noreply@wildlifeoasis.co.uk"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# App Config
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Admin Site (`apps/admin-site/.env.local`)

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# App Config
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

### Strapi CMS (`apps/cms/.env`)

```bash
# Server
HOST=0.0.0.0
PORT=1337

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lwo_dev
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_SSL=false

# Admin JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('base64'));")
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
APP_KEYS=key1,key2,key3,key4

# API Tokens
API_TOKEN_SALT=your-api-token-salt
TRANSFER_TOKEN_SALT=your-transfer-token-salt

# Public URL
PUBLIC_URL=http://localhost:1337
```

### Database Package (`packages/database/.env`)

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/lwo_dev"
```

---

## Common Development Tasks

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm test --filter=public-site

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Linting & Formatting

```bash
# Lint all code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format
```

### Database Operations

```bash
# Generate Prisma Client (after schema changes)
pnpm --filter=database prisma generate

# Create a new migration
pnpm --filter=database prisma migrate dev --name description-of-change

# Reset database (WARNING: deletes all data)
pnpm --filter=database prisma migrate reset

# Open Prisma Studio (database GUI)
pnpm --filter=database prisma studio

# Seed database with test data
pnpm --filter=database prisma db seed
```

### Strapi Operations

```bash
# Create Strapi admin user (first time setup)
# Navigate to http://localhost:1337/admin and follow the prompts

# Generate API token for public site
# Strapi Admin → Settings → API Tokens → Create new token
```

### Building for Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=public-site

# Preview production build locally
pnpm start --filter=public-site
```

---

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Kill process on port 3000 (public site)
npx kill-port 3000

# Kill process on port 3001 (admin site)
npx kill-port 3001

# Kill process on port 1337 (Strapi)
npx kill-port 1337
```

### Prisma Client Out of Sync

If you see "Prisma Client is out of sync" errors:

```bash
pnpm --filter=database prisma generate
```

### Database Connection Issues

- Verify `DATABASE_URL` is correct in `.env` files
- Check PostgreSQL is running: `pg_isready` (local) or check Supabase dashboard
- Ensure database exists and is accessible
- Check firewall/network settings

### TypeScript Errors

```bash
# Check TypeScript errors across all apps
pnpm type-check

# Rebuild TypeScript declarations
pnpm build --filter=shared-types
```

### Stale Dependencies

```bash
# Clear all node_modules and reinstall
pnpm clean
pnpm install

# Clear Turborepo cache
rm -rf .turbo
```

---

## Development Workflow

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code patterns
   - Write tests for new functionality
   - Update documentation as needed

3. **Test locally**

   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   pnpm build
   ```

4. **Commit changes**

   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Push and create PR** (when ready for review/deployment)

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules (configured in project)
- Use Prettier for formatting (auto-format on save recommended)
- Prefer `type` over `interface`
- Use explicit return types for functions
- Follow naming conventions in existing code

---

## First Time Setup Checklist

- [ ] Install Node.js 20.x LTS
- [ ] Install pnpm globally
- [ ] Clone repository
- [ ] Run `pnpm install`
- [ ] Set up database (Supabase or local PostgreSQL)
- [ ] Copy and configure all `.env` files
- [ ] Run database migrations
- [ ] Start development servers
- [ ] Create Strapi admin user
- [ ] Generate Strapi API token
- [ ] Verify all apps are running correctly

---

## Getting Help

- **Documentation:** See `.notes/` directory for architecture decisions and guides
- **Agent Context:** Read `.notes/agent-context.md` for project overview
- **Issues:** Check existing issues or create a new one
- **Ask Robin:** For clarification on business requirements or decisions

---

## Next Steps After Setup

Once your local environment is running:

1. Familiarize yourself with the monorepo structure
2. Review the architecture decision records (ADRs) in `.notes/decisions/`
3. Read the data model documentation in `.notes/architecture/data-models.md`
4. Check the current phase in `.opencode/plans/lwo-platform-rebuild.md`
5. Start contributing!

---

**Note:** This guide will be updated as the project evolves. If you find any inaccuracies or missing steps, please update this document.
