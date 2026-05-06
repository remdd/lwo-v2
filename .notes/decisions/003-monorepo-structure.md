# ADR-003: Turborepo for Monorepo Management

**Date:** 2026-05-06  
**Status:** Accepted  
**Deciders:** Robin (Project Lead)

## Context

The LWO platform consists of multiple applications that share code:
- Public-facing Next.js site
- Admin Next.js site
- Strapi CMS
- Shared TypeScript types
- Shared UI components
- Shared database client (Prisma)

We need a way to structure and build these applications efficiently while sharing code. Key requirements:
- Easy code sharing across apps
- Efficient builds (don't rebuild unchanged code)
- Simple to understand and maintain
- Good TypeScript support
- Minimal learning curve

## Decision

We will use **Turborepo** with **pnpm workspaces** for monorepo management.

## Rationale

### Why Turborepo
- **Existing familiarity:** Robin has some experience with Turborepo
- **Excellent caching:** Only rebuilds what changed, dramatically speeds up development and CI
- **Simple configuration:** Single `turbo.json` file defines task dependencies
- **Zero-config defaults:** Works well out of the box for Next.js
- **Remote caching support:** Can cache builds across team/CI (though not needed initially)
- **Great for Next.js:** Built by Vercel, optimized for Next.js applications
- **Clear mental model:** Pipeline-based task orchestration is intuitive

### Why pnpm
- **Fast installs:** Faster than npm/yarn
- **Disk efficient:** Shared dependency storage
- **Strict by default:** Prevents phantom dependencies
- **Native workspace support:** Works seamlessly with Turborepo
- **Growing adoption:** Becoming industry standard for monorepos

### Why Not Alternatives
- **Nx:** More features but steeper learning curve, overkill for this project
- **Plain npm/yarn workspaces:** Missing intelligent caching and task orchestration
- **Lerna:** Older, less active development, focused more on versioning than builds

## Consequences

### Positive
- Fast builds in development and CI (only rebuild changed apps)
- Easy code sharing via workspace packages
- Simple configuration and maintenance
- Leverages existing Turborepo familiarity
- Excellent documentation and community support
- Straightforward CI integration

### Negative
- Adds some complexity vs single-app setup
- Need to understand task dependencies and caching
- Potential for workspace dependency issues if not careful
- pnpm may be unfamiliar (though learning curve is minimal)

### Neutral
- Need to structure workspace packages thoughtfully
- Build times matter more as project grows
- Caching configuration may need tuning over time

## Alternatives Considered

### Option 1: Nx
- **Pros:** More powerful, great tooling, dependency graph visualization
- **Cons:** Steeper learning curve, more configuration, overkill for 3 apps
- **Reason for rejection:** Added complexity not justified for project scale

### Option 2: pnpm Workspaces Only (No Turborepo)
- **Pros:** Simpler, less tooling, one less thing to learn
- **Cons:** No intelligent caching, manual task orchestration, slower builds
- **Reason for rejection:** Turborepo's caching provides significant DX improvement

### Option 3: Individual Repositories
- **Pros:** Maximum simplicity, no monorepo complexity
- **Cons:** Difficult code sharing, versioning nightmares, harder to make cross-cutting changes
- **Reason for rejection:** Shared types and database client make monorepo essential

## Notes

- Workspace structure will follow convention:
  ```
  /apps/* - deployable applications
  /packages/* - shared libraries
  ```
- Turborepo tasks will be defined for:
  - `dev` - run development servers
  - `build` - production builds
  - `lint` - code linting
  - `test` - run tests
  - `type-check` - TypeScript checking
- pnpm version 8.x or later recommended
- Will use workspace protocol (`workspace:*`) for internal dependencies
