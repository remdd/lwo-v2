# LWO Platform Rebuild - Master Project Plan

## Overview

Complete rebuild of the Lakeland Wildlife Oasis web platform with modern tech stack, improved maintainability, and CMS-driven content management.

**Key Goals:**

- Minimize ongoing maintenance burden
- Enable zoo staff to manage content independently
- Robust payment processing and booking system
- Comprehensive testing and logging
- Cost-effective infrastructure (~$32-47/month)

**Tech Stack:**

- **Frontend:** Next.js 15 + React + TypeScript
- **Database:** PostgreSQL + Prisma
- **CMS:** Strapi (self-hosted)
- **Hosting:** Hybrid (Vercel + DigitalOcean)
- **Payments:** PayPal Server SDK
- **Auth:** NextAuth.js
- **CI/CD:** GitHub Actions
- **Monorepo:** Turborepo

**Architecture:**

```
apps/
  ├── public-site/      (Next.js → Vercel)
  ├── admin-site/       (Next.js → DigitalOcean)
  └── cms/              (Strapi → DigitalOcean)
packages/
  ├── shared-types/     (Shared TypeScript types)
  ├── ui/               (Shared React components)
  └── database/         (Prisma schema & client)
```

**Environments:**

- **Local:** Full stack on localhost
- **UAT:** uat.wildlifeoasis.co.uk (basic auth protected)
- **Production:** www.wildlifeoasis.co.uk

---

## Tasks

### Phase 1: Foundation & Documentation

- [ ] **Create architecture decision records (ADRs) for key tech choices**
  - Document hosting strategy (hybrid Vercel/DO)
  - Document database choice (PostgreSQL/Prisma)
  - Document monorepo structure (Turborepo)
  - Document CMS choice (Strapi)
  - Document auth strategy (NextAuth)

- [ ] **Create agent context guide**
  - Living document summarizing project state
  - Tech stack reference
  - Key decisions and rationale
  - Current progress indicators

- [ ] **Create environment setup documentation**
  - Local development setup guide
  - Environment variables reference
  - Deployment procedures

- [ ] **Create data model documentation**
  - Initial entity relationship diagrams
  - Booking system data model
  - Product/experience data model
  - User/staff data model

### Phase 2: Monorepo Scaffold

- [ ] **Initialize Turborepo with pnpm**
  - Set up workspace structure
  - Configure turborepo.json
  - Set up root package.json

- [ ] **Create placeholder Next.js public site app**
  - Basic Next.js 15 setup with App Router
  - TypeScript configuration
  - Basic homepage placeholder

- [ ] **Create placeholder Next.js admin site app**
  - Basic Next.js 15 setup with App Router
  - TypeScript configuration
  - Basic admin dashboard placeholder

- [ ] **Create Strapi CMS app**
  - Initialize Strapi in monorepo
  - Basic configuration
  - PostgreSQL connection setup

- [ ] **Create shared packages structure**
  - `packages/shared-types` with basic setup
  - `packages/ui` with basic setup
  - `packages/database` with Prisma setup

- [ ] **Configure TypeScript path aliases and module resolution**
  - Set up workspace references
  - Configure tsconfig for each app/package

- [ ] **Set up ESLint and Prettier across monorepo**
  - Shared config packages
  - Consistent code style

### Phase 3: Database & Infrastructure

- [ ] **Set up Supabase project (free tier)**
  - Create production database instance
  - Create UAT database instance
  - Configure connection strings

- [ ] **Initialize Prisma schema**
  - Basic User model
  - Basic Product/Experience model
  - Basic Booking model
  - Initial migration

- [ ] **Create database package with Prisma client**
  - Configure client generation
  - Set up for sharing across apps
  - Create basic seed script

- [ ] **Test database connectivity from all apps**
  - Public site can query DB
  - Admin site can query DB
  - Strapi can connect to DB

### Phase 4: Hosting Setup

- [ ] **Set up DigitalOcean droplet**
  - Select appropriate size ($12 tier initially)
  - Configure Ubuntu/Debian
  - Set up SSH access
  - Configure firewall

- [ ] **Configure nginx on DO droplet**
  - Set up reverse proxy for admin site
  - Set up reverse proxy for Strapi
  - Configure SSL with Let's Encrypt

- [ ] **Deploy admin site to DigitalOcean**
  - Set up PM2 for process management
  - Configure environment variables
  - Test basic deployment

- [ ] **Deploy Strapi to DigitalOcean**
  - Configure for production mode
  - Set up admin user
  - Test CMS access

- [ ] **Set up Vercel project for public site**
  - Connect GitHub repository
  - Configure environment variables
  - Set up custom domain (www.wildlifeoasis.co.uk)

- [ ] **Configure UAT environment**
  - Set up uat.wildlifeoasis.co.uk subdomain
  - Configure basic auth protection
  - Deploy UAT instances

### Phase 5: CI/CD Pipeline

- [ ] **Create GitHub Actions workflow for public site**
  - Run tests on PR
  - Auto-deploy to Vercel on merge to main
  - Preview deployments for PRs

- [ ] **Create GitHub Actions workflow for admin site**
  - Run tests on PR
  - Auto-deploy to DO on merge to main
  - Deploy to UAT on merge to develop branch

- [ ] **Create GitHub Actions workflow for Strapi**
  - Run tests on PR
  - Auto-deploy to DO on content type changes

- [ ] **Set up automated database migrations**
  - Run Prisma migrations on deployment
  - Safe rollback strategy

### Phase 6: Authentication & Authorization

- [ ] **Set up NextAuth.js in admin site**
  - Configure credentials provider
  - Create simple login page
  - Set up session management

- [ ] **Create User model in Prisma**
  - Username/password fields
  - Basic permissions field (future-proofing)
  - Password hashing with bcrypt

- [ ] **Create admin user management in Strapi**
  - Initial admin account creation
  - Simple user CRUD for staff accounts

- [ ] **Implement protected routes in admin site**
  - Middleware to check authentication
  - Redirect to login if not authenticated

- [ ] **Test authentication flow end-to-end**
  - Login/logout functionality
  - Session persistence
  - Protected route access

### Phase 7: CMS Content Types

- [ ] **Create Strapi content type: Experience**
  - Name, description, pricing fields
  - Availability configuration fields
  - Image uploads
  - Active/inactive status

- [ ] **Create Strapi content type: News Article**
  - Title, content, publish date
  - Author field
  - Featured image
  - Rich text editor

- [ ] **Create Strapi content type: Static Page**
  - Flexible content blocks
  - SEO metadata fields
  - Slug configuration

- [ ] **Configure Strapi API permissions**
  - Public read access for published content
  - Authenticated write access

- [ ] **Test content creation and publishing**
  - Create sample experiences
  - Create sample news articles
  - Verify API responses

### Phase 8: Payment Integration

- [ ] **Set up PayPal developer account and sandbox**
  - Create sandbox business/buyer accounts
  - Get API credentials

- [ ] **Install PayPal Server SDK in public site**
  - Add npm package
  - Configure with environment variables

- [ ] **Create API route for PayPal order creation**
  - `/api/payments/create-order`
  - Server-side order creation
  - Error handling and logging

- [ ] **Create API route for PayPal order capture**
  - `/api/payments/capture-order`
  - Server-side payment capture
  - Transaction verification

- [ ] **Implement checkout flow in public site**
  - Cart/basket functionality
  - PayPal button integration
  - Success/failure handling

- [ ] **Create comprehensive payment logging**
  - Log all payment attempts
  - Log failures with detailed errors
  - Store transaction IDs in database

- [ ] **Write integration tests for payment flow**
  - Test order creation
  - Test order capture
  - Test error scenarios

- [ ] **Test PayPal integration in sandbox**
  - Complete end-to-end test purchases
  - Verify money flow in sandbox
  - Test edge cases (declined cards, timeouts)

### Phase 9: First Feature - Bookable Experiences

- [ ] **Extend Experience content type in Strapi**
  - Availability slots/capacity
  - Date range configuration
  - Booking constraints

- [ ] **Create Booking model in Prisma**
  - Customer details (name, email, phone)
  - Experience reference
  - Date/time slot
  - Payment status
  - Confirmation code generation

- [ ] **Build experience listing page on public site**
  - Fetch from Strapi API
  - Display available experiences
  - Filter by date/availability

- [ ] **Build experience detail/booking page**
  - Show experience details
  - Date picker with availability
  - Add to cart functionality

- [ ] **Create API route to check availability**
  - Query existing bookings
  - Calculate remaining capacity
  - Return available slots

- [ ] **Create API route to create booking**
  - Validate availability
  - Create booking record
  - Link to payment
  - Generate confirmation code

- [ ] **Integrate booking creation with payment flow**
  - Create booking on payment success
  - Handle payment failures gracefully
  - Send confirmation email via Mailgun

- [ ] **Build admin booking calendar view**
  - Fetch all bookings from DB
  - Display in calendar format
  - Filter by date/experience

- [ ] **Build admin booking detail view**
  - Show customer details
  - Show payment status
  - Check-in functionality

- [ ] **Write tests for booking flow**
  - Unit tests for availability logic
  - Integration tests for booking creation
  - E2E test for complete purchase flow

### Phase 10: Email Integration

- [ ] **Set up Mailgun API integration**
  - Configure API keys
  - Create email templates

- [ ] **Create booking confirmation email template**
  - Include booking details
  - Include confirmation code
  - Include zoo contact info

- [ ] **Create API utility for sending emails**
  - Reusable email service
  - Error handling and retries
  - Logging

- [ ] **Send confirmation emails on booking**
  - Trigger on successful payment
  - Include all booking details

- [ ] **Test email delivery**
  - Verify emails arrive
  - Check spam filtering
  - Test template rendering

### Phase 11: Additional Features

- [ ] **Build simple shop for non-visit products**
  - Product content type in Strapi
  - Product listing page
  - Product purchase flow (reuse payment integration)

- [ ] **Build news/blog functionality**
  - News listing page with pagination
  - Individual news article pages
  - Display recent news on homepage

- [ ] **Create static content pages**
  - About page
  - Education page
  - Contact page
  - Fetch content from Strapi

- [ ] **Add Google Analytics**
  - Install GA4
  - Configure in both sites
  - Set up basic event tracking

- [ ] **Implement SEO optimization**
  - Next.js metadata API
  - Dynamic meta tags from Strapi
  - Sitemap generation
  - robots.txt

### Phase 12: Testing & Quality

- [ ] **Set up Jest and React Testing Library**
  - Configure for all apps
  - Shared test utilities

- [ ] **Write unit tests for critical logic**
  - Availability calculation
  - Payment processing
  - Booking creation
  - Email sending

- [ ] **Write integration tests**
  - API route testing
  - Database operations
  - CMS integration

- [ ] **Set up Playwright for E2E tests (lower priority)**
  - Configure for public site
  - Basic user journey tests

- [ ] **Achieve target test coverage**
  - 80%+ for payment/booking logic
  - 60%+ overall

### Phase 13: Logging & Monitoring

- [ ] **Set up structured logging**
  - Winston or Pino
  - Consistent log format
  - Log levels

- [ ] **Implement business event logging**
  - Log all bookings
  - Log all payments
  - Log errors with context

- [ ] **Set up error tracking**
  - Sentry (free tier) or similar
  - Capture and alert on errors

- [ ] **Create basic monitoring dashboard**
  - Uptime monitoring
  - Error rate tracking

### Phase 14: Polish & Launch Prep

- [ ] **Performance optimization**
  - Image optimization
  - Code splitting
  - Caching strategy

- [ ] **Accessibility audit**
  - WCAG compliance check
  - Keyboard navigation
  - Screen reader testing

- [ ] **Cross-browser testing**
  - Test on Chrome, Firefox, Safari
  - Mobile responsive testing

- [ ] **User acceptance testing**
  - Zoo staff walkthrough
  - Gather feedback
  - Fix critical issues

- [ ] **Create deployment runbook**
  - Step-by-step launch process
  - Rollback procedures
  - Emergency contacts

- [ ] **Data migration from old system**
  - Export existing bookings
  - Import to new DB
  - Verify data integrity

- [ ] **DNS cutover planning**
  - Prepare DNS changes
  - Plan cutover timing
  - Minimize downtime

### Phase 15: Future Enhancements (Lower Priority)

- [ ] **Interactive zoo map**
  - SVG implementation
  - Animal information overlays
  - CMS-manageable content

- [ ] **Advanced admin features**
  - Reporting dashboard
  - Revenue tracking
  - Customer database

- [ ] **Enhanced booking features**
  - Group bookings
  - Gift vouchers
  - Membership system

---

completion_promise: All tasks through Phase 14 complete and production deployed
