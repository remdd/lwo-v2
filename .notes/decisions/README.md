# Architecture Decision Records (ADRs)

This directory contains records of all significant architectural and technical decisions made for the LWO platform rebuild.

## Index

- [ADR-001: Hybrid Hosting Strategy (Vercel + DigitalOcean)](./001-hosting-strategy.md)
- [ADR-002: PostgreSQL + Prisma for Database Layer](./002-database-choice.md)
- [ADR-003: Turborepo for Monorepo Management](./003-monorepo-structure.md)
- [ADR-004: Strapi for Content Management System](./004-cms-choice.md)
- [ADR-005: NextAuth.js for Authentication](./005-auth-strategy.md)

## Summary of Key Decisions

| Decision                | Choice               | Primary Rationale                                            |
| ----------------------- | -------------------- | ------------------------------------------------------------ |
| **Public Site Hosting** | Vercel Pro           | Best DX, CDN, auto-deploys for high-traffic site             |
| **Admin/CMS Hosting**   | DigitalOcean Droplet | Cost-effective for low-traffic internal apps                 |
| **Database**            | PostgreSQL + Prisma  | Type-safety, ACID compliance, relational model fits domain   |
| **Database Hosting**    | Supabase (free tier) | Managed Postgres, sufficient for launch, easy migration path |
| **Monorepo Tool**       | Turborepo + pnpm     | Existing familiarity, excellent caching, simple config       |
| **CMS**                 | Strapi (self-hosted) | Free, flexible, existing familiarity, good admin UI          |
| **Authentication**      | NextAuth.js          | Next.js native, simple, secure by default                    |
| **Payment Processing**  | PayPal Server SDK    | Business requirement, similar fees to Stripe                 |
| **CI/CD**               | GitHub Actions       | Free, simple, excellent Vercel integration                   |
| **Email**               | Mailgun              | Existing provider, no reason to change                       |

## About ADRs

Architecture Decision Records document important decisions made during the project. Each ADR includes:

- **Context:** What problem are we solving?
- **Decision:** What did we decide to do?
- **Rationale:** Why did we make this choice?
- **Consequences:** What are the impacts (positive and negative)?
- **Alternatives:** What else did we consider?

ADRs are immutable once accepted. If a decision changes, we create a new ADR that supersedes the old one.
