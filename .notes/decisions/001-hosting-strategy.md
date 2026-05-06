# ADR-001: Hybrid Hosting Strategy (Vercel + DigitalOcean)

**Date:** 2026-05-06  
**Status:** Accepted  
**Deciders:** Robin (Project Lead)

## Context

The LWO platform rebuild requires hosting for three main applications:

1. Public-facing website (high traffic, CDN benefits important)
2. Admin site (low traffic, limited users, staff-only access)
3. Strapi CMS (low traffic, content management only)

Budget constraints are significant (~$32-47/month target), but developer time and maintenance burden are also critical considerations. The current site is on DigitalOcean, requiring manual deployment and server management.

## Decision

We will use a **hybrid hosting approach**:

- **Public site:** Vercel Pro tier (~$20/month)
- **Admin site + Strapi CMS:** DigitalOcean droplet ($12-24/month)
- **Database:** Supabase free tier (or DigitalOcean Managed Postgres if needed)

## Rationale

### Why Vercel for Public Site

- Zero-config Next.js deployments (git push = deploy)
- Global CDN for fast page loads across UK and international visitors
- Automatic preview deployments for testing
- Eliminates DevOps overhead for public-facing site
- Built-in SSL, domain management
- The public site benefits most from these features (high traffic, SEO important)

### Why DigitalOcean for Admin + CMS

- Admin site has minimal traffic (2 staff terminals only)
- CMS doesn't need CDN or edge computing
- Both can run on a single $12 droplet
- Lower cost for low-traffic applications
- Full control over environment

### Why Hybrid vs Full Vercel or Full DO

- **vs Full Vercel:** Would cost significantly more to host Strapi + admin on Vercel, and they don't benefit from Vercel's features
- **vs Full DO:** Would lose the excellent DX and CDN benefits for the public site, require more DevOps time

## Consequences

### Positive

- Best developer experience where it matters most (public site)
- Cost-effective (~$32-44/month total)
- Reduced maintenance burden overall
- Public site gets global CDN, fast deploys
- Clear separation between public and internal applications

### Negative

- Two hosting providers to manage instead of one
- Slightly more complex deployment setup
- Need to ensure proper CORS configuration between Vercel and DO
- Two sets of environment variables to manage

### Neutral

- Will need to configure DO droplet manually (nginx, PM2, SSL)
- Different deployment workflows for different apps

## Alternatives Considered

### Option 1: Full Vercel

- **Pros:** Single provider, best DX everywhere, simple management
- **Cons:** Significantly more expensive (~$50-80/month), overkill for admin/CMS
- **Reason for rejection:** Cost not justified for low-traffic admin/CMS

### Option 2: Full DigitalOcean

- **Pros:** Single provider, lowest cost (~$24/month for larger droplet), full control
- **Cons:** Manual deployment setup, no CDN, more DevOps time, slower public site
- **Reason for rejection:** Developer time and maintenance burden too high

### Option 3: Railway, Render, or Similar PaaS

- **Pros:** Good DX, easier than DO, single provider
- **Cons:** More expensive than hybrid, less mature than Vercel/DO
- **Reason for rejection:** Vercel is better for Next.js specifically

## Notes

- Vercel's 1TB bandwidth limit should be sufficient for a small zoo website
- DigitalOcean droplet can be upgraded if needed ($12 → $24 → $48)
- This strategy can be re-evaluated after 6-12 months of production traffic data
- CORS configuration will be critical for CMS API calls from public site
