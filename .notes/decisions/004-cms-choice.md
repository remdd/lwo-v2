# ADR-004: Strapi for Content Management System

**Date:** 2026-05-06  
**Status:** Accepted  
**Deciders:** Robin (Project Lead)

## Context

The current LWO site has a rudimentary custom-built CMS for news articles. The new platform needs a CMS that allows zoo staff to manage:
- Bookable experiences/products (name, description, pricing, availability)
- News articles and blog posts
- Static page content (About, Education, etc.)
- Images and media assets

Key requirements:
- Free to use (self-hosted acceptable)
- Manageable by non-technical staff
- Good API for headless integration with Next.js
- Support for structured content types
- Image/media management
- Simple to deploy and maintain
- Reasonable learning curve for development

## Decision

We will use **Strapi** (self-hosted on DigitalOcean) as our headless CMS.

## Rationale

### Why Strapi
- **Existing familiarity:** Robin has limited but positive experience with Strapi
- **Self-hosted = truly free:** No usage limits or feature restrictions
- **Good admin UI:** Non-technical staff can manage content easily
- **Flexible content types:** Can model experiences, products, articles, pages
- **REST & GraphQL APIs:** Easy integration with Next.js
- **Role-based permissions:** Can control who edits what
- **Media library:** Built-in image/file management
- **Active community:** Good documentation, plugins, support
- **TypeScript support:** Can generate types for our content models
- **Node.js based:** Fits naturally in our stack

### Why Self-Hosted on DigitalOcean
- **No cost constraints:** Free tier limits don't apply
- **Full control:** Can customize and configure as needed
- **Same infrastructure:** Runs alongside admin site on same droplet
- **No vendor lock-in:** Data stays with us

### Why Not Alternatives
- **Sanity:** Great tool, but free tier may be limiting (10GB assets, 500k API requests), and has steeper learning curve for content modeling
- **Payload CMS:** TypeScript-native, but no existing experience, learning curve not justified
- **Contentful/Hygraph/etc:** Commercial products with restrictive free tiers

## Consequences

### Positive
- Zoo staff can manage all content independently
- No free tier usage limits to worry about
- Flexible content modeling for complex availability rules
- Good developer experience with API integration
- Built-in media management
- Can customize and extend as needed
- One-time setup, minimal ongoing costs

### Negative
- Need to manage hosting and updates ourselves
- Self-hosting means we handle backups, security updates
- Admin UI customization requires plugin development
- Not as lightweight as some alternatives

### Neutral
- Need to design content types carefully
- API performance depends on our server
- Will need to secure admin panel access

## Alternatives Considered

### Option 1: Sanity
- **Pros:** Excellent DX, great free tier, content lake model, hosted solution
- **Cons:** Learning curve for GROQ and content modeling, free tier may become limiting, less familiar
- **Reason for rejection:** Free tier uncertainty and learning curve not justified vs Strapi familiarity

### Option 2: Payload CMS
- **Pros:** TypeScript-native, code-first approach, modern architecture
- **Cons:** No existing experience, smaller community, self-hosted only
- **Reason for rejection:** Learning curve too steep vs Strapi familiarity

### Option 3: Custom-Built CMS (like current site)
- **Pros:** Total control, exactly what we need
- **Cons:** Significant development time, maintenance burden, reinventing the wheel
- **Reason for rejection:** Time investment not justified, defeats purpose of using existing solution

### Option 4: WordPress (headless)
- **Pros:** Extremely mature, staff may be familiar, huge ecosystem
- **Cons:** PHP-based (different stack), bloated for our needs, security concerns
- **Reason for rejection:** Different tech stack, overkill for our needs

## Notes

- Strapi will be deployed on DigitalOcean droplet alongside admin site
- Content types to create initially:
  - Experience (bookable items with availability)
  - News Article
  - Static Page
  - Product (for shop items)
- Will use Strapi's built-in user/role system for admin access
- API will be consumed by public Next.js site via REST
- Consider generating TypeScript types from Strapi schema for type safety
- Regular backups of Strapi database essential (same Postgres instance as main DB)
