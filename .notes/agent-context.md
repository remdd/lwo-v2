# Agent Context Guide - LWO Platform Rebuild

**Last Updated:** 2026-05-06  
**Current Phase:** Phase 1 - Foundation & Documentation  
**Project Status:** Initial Planning Complete

---

## Quick Start for AI Agents

This document provides everything you need to understand the current state of the LWO (Lakeland Wildlife Oasis) platform rebuild project.

### What is This Project?

Complete rebuild of a small UK zoo's web platform, replacing an unmaintainable Vue.js/MongoDB stack with a modern, well-documented TypeScript monorepo. The goal is to create a system that zoo staff can largely manage themselves, with robust booking/payment systems and minimal maintenance burden.

### Where Are We Now?

**Completed:**
- ✅ Initial project planning and requirements gathering
- ✅ Architecture decision records (ADRs) for all key tech choices
- ✅ Master project plan with 15 phases
- ✅ Git repository initialized
- ✅ Documentation structure created

**Currently Working On:**
- 🔄 Phase 1: Foundation & Documentation
  - Creating agent context guide (this document)
  - Next: Environment setup documentation
  - Next: Data model documentation

**Not Started:**
- Phase 2-15: See `.opencode/plans/lwo-platform-rebuild.md`

---

## Tech Stack Reference

### Core Technologies

| Technology | Purpose | Why We Chose It |
|------------|---------|-----------------|
| **TypeScript** | Type safety throughout | Project requirement, reduces bugs |
| **Next.js 15** | Frontend framework | React-based, App Router, SSR/SSG support |
| **React** | UI library | Modern, widely used, Robin's expertise |
| **PostgreSQL** | Database | ACID compliance for bookings/payments |
| **Prisma** | Database ORM | Type-safe queries, great DX, migrations |
| **Strapi** | Headless CMS | Free self-hosted, flexible, Robin has experience |
| **NextAuth.js** | Authentication | Simple, secure, Next.js native |
| **PayPal SDK** | Payments | Business requirement, similar fees to Stripe |
| **Turborepo** | Monorepo tool | Fast builds, caching, Robin has experience |
| **pnpm** | Package manager | Fast, efficient, workspace support |

### Infrastructure & Hosting

| Component | Hosting | Cost | Rationale |
|-----------|---------|------|-----------|
| **Public Site** | Vercel Pro | ~$20/month | Best DX, CDN, auto-deploys for high-traffic site |
| **Admin Site** | DigitalOcean Droplet | $12-24/month | Low traffic, cost-effective |
| **Strapi CMS** | DigitalOcean Droplet | Included above | Same droplet as admin site |
| **Database** | Supabase (free tier) | $0 (initially) | Managed Postgres, 500MB sufficient for launch |
| **CI/CD** | GitHub Actions | Free | Native GitHub integration, Vercel support |
| **Email** | Mailgun | Existing account | Current provider, no reason to change |

**Total estimated cost:** ~$32-47/month

### Environments

1. **Local Development**
   - Full stack running on localhost
   - Separate database instance

2. **UAT (User Acceptance Testing)**
   - URL: `uat.wildlifeoasis.co.uk`
   - Basic auth protected
   - Separate database instance
   - Used for testing before production

3. **Production**
   - URL: `www.wildlifeoasis.co.uk`
   - Live database
   - Customer-facing

---

## Architecture Overview

### Monorepo Structure

```
lwo/
├── apps/
│   ├── public-site/      # Next.js app → Vercel
│   ├── admin-site/       # Next.js app → DigitalOcean
│   └── cms/              # Strapi → DigitalOcean
├── packages/
│   ├── shared-types/     # Shared TypeScript types
│   ├── ui/               # Shared React components
│   └── database/         # Prisma schema & client
├── .notes/               # Project documentation (this!)
│   ├── decisions/        # Architecture Decision Records
│   ├── progress/         # Progress tracking logs
│   ├── setup/            # Setup guides
│   ├── architecture/     # System diagrams, data models
│   └── agent-context.md  # This file
└── .opencode/
    └── plans/            # Project plans for nm-* tools
```

### Application Flow

```
User → Public Site (Vercel) → Strapi API (DO) → PostgreSQL (Supabase)
                            → Next.js API Routes → PostgreSQL
                            → PayPal API

Staff → Admin Site (DO) → PostgreSQL (Supabase)
                        → Next.js API Routes
```

---

## Key Architectural Decisions

Full details in `.notes/decisions/`, but here's the quick reference:

### ADR-001: Hybrid Hosting Strategy
- **Decision:** Public site on Vercel, admin/CMS on DigitalOcean
- **Why:** Best DX for high-traffic public site, cost-effective for low-traffic internal apps
- **Trade-off:** Two hosting providers vs one, but saves money and improves public site performance

### ADR-002: PostgreSQL + Prisma
- **Decision:** Use PostgreSQL with Prisma ORM
- **Why:** Type safety, ACID compliance for payments, relational model fits domain
- **Trade-off:** Schema changes require migrations (vs MongoDB flexibility), but gain data integrity

### ADR-003: Turborepo Monorepo
- **Decision:** Use Turborepo with pnpm workspaces
- **Why:** Robin's familiarity, excellent caching, simple config
- **Trade-off:** Monorepo complexity vs easier code sharing

### ADR-004: Strapi CMS
- **Decision:** Self-host Strapi on DigitalOcean
- **Why:** Free when self-hosted, Robin has experience, good admin UI for staff
- **Trade-off:** We manage hosting/updates vs managed service, but no cost constraints

### ADR-005: NextAuth.js
- **Decision:** Use NextAuth.js for admin authentication
- **Why:** Simple, secure, Next.js native, perfect for our basic needs (2-3 users)
- **Trade-off:** Still need password hashing implementation, but simpler than alternatives

---

## Data Model Overview

**Status:** Not yet implemented - will be defined in Phase 1, Task 4

### Core Entities (Planned)

1. **User** - Staff accounts for admin site access
2. **Experience** - Bookable activities (e.g., "Meet the Meerkats")
3. **Booking** - Customer reservations for experiences
4. **Product** - Shop items (e.g., adoption packs)
5. **Order** - Purchase records
6. **NewsArticle** - Blog posts/news content
7. **StaticPage** - About, Education, etc.

**Relationships to be defined in Phase 1, Task 4**

---

## Development Workflow

### For Robin (Human Developer)

1. Work through plan step-by-step with AI assistance
2. Review and test each completed task
3. Commit meaningful checkpoints to git
4. Update this agent-context.md as major milestones complete

### For AI Agents

1. **Always read this file first** to understand current project state
2. Check `.opencode/plans/lwo-platform-rebuild.md` for the full task list
3. Refer to `.notes/decisions/` for detailed rationale on technical choices
4. When making significant changes, update this file's "Where Are We Now?" section
5. Follow existing patterns in the codebase
6. Prioritize simplicity and maintainability over cleverness

---

## Common Commands

**Note:** Most of these won't work until Phase 2 (monorepo setup) is complete.

```bash
# Install dependencies
pnpm install

# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm dev --filter=public-site
pnpm dev --filter=admin-site
pnpm dev --filter=cms

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Database migrations
pnpm --filter=database prisma migrate dev
```

---

## Critical Constraints & Priorities

### Must-Have Features (Priority Order)
1. **Payment processing** - Must be rock-solid, backend-based, well-logged
2. **Booking system** - Core business function
3. **CMS integration** - Enable staff self-service
4. **Admin booking management** - Staff need calendar view, check-in functionality
5. **Email confirmations** - Customer communication

### Budget Constraints
- Target: $32-47/month total infrastructure cost
- Must use free tiers where possible
- Avoid unnecessary paid services

### Maintenance Burden
- **Primary goal:** Reduce Robin's ongoing maintenance time
- Must be well-documented for future developers (human or AI)
- Zoo staff should manage content without developer intervention
- Comprehensive logging for quick issue diagnosis

### Testing Requirements
- 80%+ coverage for payment/booking logic
- 60%+ overall coverage
- Integration tests for CMS/payment/booking flows
- E2E tests (lower priority, Playwright)

---

## Current Blockers & Decisions Needed

**None at this time** - Planning phase complete, ready to proceed with implementation.

---

## Important Files & Resources

### Documentation
- **Project Brief:** `.notes/initial_brief.md` - Original requirements and goals
- **Master Plan:** `.opencode/plans/lwo-platform-rebuild.md` - All 15 phases of tasks
- **ADRs:** `.notes/decisions/` - Why we made each technical decision
- **This File:** `.notes/agent-context.md` - Current state summary

### Future Files (Not Yet Created)
- **Environment Setup:** `.notes/setup/local-development.md`
- **Data Models:** `.notes/architecture/data-models.md`
- **Deployment Guide:** `.notes/setup/deployment.md`

---

## Project Principles

From Robin's agent guidelines (see `.notes/coding/ai/agent-guidelines.md` if created):

1. **Clarity over cleverness** - Readable, maintainable code
2. **Follow existing conventions** - Match patterns in the codebase
3. **Minimal, focused changes** - Don't refactor unnecessarily
4. **Ask questions** - Challenge decisions if something seems wrong
5. **Test critical logic** - Especially payments and bookings
6. **Document decisions** - Update ADRs and this file as we go

---

## Getting Help

- **For Robin:** Review `.notes/` documentation, check ADRs for decision rationale
- **For AI Agents:** This file is your starting point - it summarizes everything
- **For Future Developers:** Start with project brief → this file → ADRs → master plan

---

## Version History

| Date | Update | Changed By |
|------|--------|------------|
| 2026-05-06 | Initial creation | AI Agent (OpenCode) |
| | Project planning complete, Phase 1 started | |

---

**Remember:** This is a living document. Update it as the project evolves!
