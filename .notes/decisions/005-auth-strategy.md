# ADR-005: NextAuth.js for Authentication

**Date:** 2026-05-06  
**Status:** Accepted  
**Deciders:** Robin (Project Lead)

## Context

The admin site needs authentication to protect staff-only functionality (booking management, calendar views). Key requirements:
- Simple username/password authentication
- Single permission level (no complex roles)
- Minimal users (2-3 staff accounts, potentially shared)
- Secure but simple implementation
- Easy session management
- Low maintenance

The public site does NOT require user authentication (anonymous bookings/purchases only).

## Decision

We will use **NextAuth.js** with the **Credentials Provider** for admin site authentication.

User credentials will be stored in our PostgreSQL database (managed via Prisma).

## Rationale

### Why NextAuth.js
- **Next.js native:** Built specifically for Next.js, zero-config integration
- **Simple setup:** Minimal configuration for basic auth
- **Session management:** Handles sessions, cookies, CSRF protection automatically
- **Secure by default:** Best practices built-in
- **Flexible:** Can add OAuth providers later if needed
- **Well maintained:** Official Next.js ecosystem project
- **Good documentation:** Easy to implement and troubleshoot

### Why Credentials Provider
- **Simple username/password:** Matches our requirements perfectly
- **No external dependencies:** Don't need OAuth providers
- **Full control:** We manage user creation and validation
- **Works offline:** No external API calls for auth

### Why Not Alternatives
- **Clerk/Auth0:** Overkill for 2-3 users, unnecessary cost/complexity
- **Custom JWT implementation:** Reinventing the wheel, security risk
- **Strapi's built-in auth:** Couples admin site to CMS, less flexible

## Consequences

### Positive
- Simple to implement and maintain
- Secure session management out of the box
- No external dependencies or API calls
- Can easily add features later (password reset, OAuth, etc.)
- Familiar pattern for future developers
- Well-documented, community support

### Negative
- Still need to implement password hashing (bcrypt/argon2)
- Need to create user management UI (can be minimal)
- Session storage considerations (database vs JWT)

### Neutral
- Need to secure API routes separately
- Will use middleware for route protection
- Environment variables for NextAuth secret

## Alternatives Considered

### Option 1: Custom JWT Implementation
- **Pros:** Full control, lightweight
- **Cons:** Security risk, reinventing wheel, more code to maintain
- **Reason for rejection:** Not worth the risk when NextAuth exists

### Option 2: Clerk or Auth0
- **Pros:** Feature-rich, beautiful UI, zero implementation
- **Cons:** Overkill for 2-3 users, ongoing cost, external dependency
- **Reason for rejection:** Cost and complexity not justified

### Option 3: HTTP Basic Auth
- **Pros:** Extremely simple, built into web servers
- **Cons:** No proper logout, poor UX, browser password manager issues
- **Reason for rejection:** Too basic, poor user experience

### Option 4: Use Strapi's Authentication
- **Pros:** Already have Strapi, one less system
- **Cons:** Couples admin site to CMS, less flexible, API-based auth adds latency
- **Reason for rejection:** Inappropriate coupling of concerns

## Notes

- NextAuth configuration in `apps/admin-site/pages/api/auth/[...nextauth].ts`
- User model in Prisma schema with:
  - `id`, `username`, `hashedPassword`, `createdAt`, `updatedAt`
  - Future: `role` field for role-based access if needed
- Password hashing with `bcryptjs` (10 rounds)
- Session strategy: JWT (stateless) or database sessions (TBD based on needs)
- Protected routes using NextAuth middleware
- Simple login page at `/login`
- No signup flow needed (admins create users manually)
- Consider IP whitelisting for additional security (on-site terminals only)
