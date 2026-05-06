# ADR-002: PostgreSQL + Prisma for Database Layer

**Date:** 2026-05-06  
**Status:** Accepted  
**Deciders:** Robin (Project Lead)

## Context

The current LWO site uses MongoDB for storing bookings, products, and content. We're rebuilding from scratch and can reconsider our database technology. Key requirements:
- Store transactional booking data with strong consistency
- Handle payment records (critical data integrity)
- Manage product/experience availability and capacity
- Store user/staff authentication data
- Support complex queries (availability checking, reporting)
- Type-safe integration with TypeScript codebase

## Decision

We will use **PostgreSQL** as our database with **Prisma** as the ORM/query layer.

Database hosting: **Supabase free tier** initially, with option to migrate to DigitalOcean Managed Postgres if needed.

## Rationale

### Why PostgreSQL
- **Relational model fits our data:** Bookings, experiences, users, and payments have clear relationships
- **ACID compliance:** Critical for payment and booking transactions
- **Data integrity:** Foreign keys, constraints prevent orphaned/invalid data
- **Complex queries:** Better for availability checking, reporting, joins
- **Mature ecosystem:** Well-tested, reliable, extensive tooling
- **Industry standard:** for transactional systems like booking platforms

### Why Prisma
- **Type-safety:** Auto-generated TypeScript types from schema
- **Developer experience:** Intuitive API, excellent tooling
- **Migrations:** Built-in migration system for schema evolution
- **Monorepo friendly:** Single schema, shared client across apps
- **Raw SQL support:** Can drop down when needed for complex queries
- **Active development:** Strong community, regular updates

### Why Not MongoDB
- **Document model less suitable:** Bookings have structured, relational data
- **Weaker consistency guarantees:** Less ideal for payment systems
- **Complex queries harder:** Aggregation pipelines more complex than SQL
- **Type safety requires more work:** Less native TypeScript integration
- **No compelling advantage:** For this use case, Postgres is better

### Why Supabase for Hosting
- **Free tier sufficient:** 500MB database, plenty for initial launch
- **Managed service:** No server management
- **Built-in backups:** Automatic daily backups
- **Connection pooling:** Built-in pgBouncer
- **Easy migration:** Can move to DO Managed Postgres if outgrow free tier

## Consequences

### Positive
- Type-safe database queries throughout the codebase
- Strong data integrity for critical booking/payment data
- Simpler complex queries (SQL vs aggregation pipelines)
- Excellent migration system for schema changes
- Single source of truth for data models (Prisma schema)
- Easy to share database client across monorepo apps

### Negative
- Schema changes require migrations (more structured than MongoDB's flexibility)
- Learning curve if team is only familiar with MongoDB
- Prisma client generation adds build step
- Some queries may be verbose compared to raw SQL

### Neutral
- Need to design schema carefully upfront
- Will need proper indexing for performance
- Connection pooling considerations for serverless (Vercel)

## Alternatives Considered

### Option 1: Keep MongoDB
- **Pros:** Existing familiarity, flexible schema, good for CMS-like content
- **Cons:** Weaker for transactional data, less type-safe, complex queries harder
- **Reason for rejection:** Relational model better fits booking/payment domain

### Option 2: PostgreSQL with Raw SQL or Different ORM
- **Pros:** More control, potentially better performance
- **Cons:** Less type-safety, more boilerplate, manual migration management
- **Reason for rejection:** Prisma provides excellent DX without significant downsides

### Option 3: Serverless Databases (PlanetScale, Neon, etc.)
- **Pros:** Auto-scaling, modern features, good free tiers
- **Cons:** PlanetScale (no foreign keys), less mature than Postgres
- **Reason for rejection:** Supabase provides similar benefits with standard Postgres

## Notes

- Prisma schema will live in `packages/database` for sharing across monorepo
- Will use Prisma Migrate for schema management
- Supabase provides connection string compatible with Prisma
- If free tier becomes insufficient, migration to DO Managed Postgres is straightforward
- Connection pooling strategy needed for Vercel (consider Prisma Data Proxy or Supabase's built-in pooler)
