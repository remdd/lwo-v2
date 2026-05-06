# Strapi CMS Setup Summary

## What Was Done

1. **Created Strapi app** at `apps/cms` using `create-strapi-app` with TypeScript
2. **Configured for monorepo** by:
   - Removing npm-generated files (node_modules, package-lock.json)
   - Installing via pnpm workspace
   - Adding PostgreSQL driver (`pg` package)
3. **Set up environment variables**:
   - Created `.env.example` with all required config
   - Created `.env` with generated secrets for local development
   - Configured to use SQLite by default (easier for local dev)
4. **Verified integration** with Turborepo:
   - Build works: `pnpm build` includes CMS
   - Type-check works: `pnpm type-check` includes CMS
   - Dev mode ready: `pnpm dev --filter=cms`

## How to Use

### First Time Setup

1. The CMS is already configured with `.env` file and secrets
2. Build the admin panel:
   ```bash
   pnpm --filter=cms build
   ```
3. Start the dev server:
   ```bash
   pnpm --filter=cms dev
   ```
4. Visit http://localhost:1337/admin
5. Create your first admin user

### Database Options

**Local Development (current):**
- Using SQLite
- Database file: `apps/cms/.tmp/data.db` (gitignored)
- No additional setup required

**Production/UAT:**
- Switch to PostgreSQL by updating `.env`:
  ```env
  DATABASE_CLIENT=postgres
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  DATABASE_NAME=lwo_dev
  DATABASE_USERNAME=postgres
  DATABASE_PASSWORD=password
  ```

## Content Types

Content types will be created through the Strapi admin UI. When you create content types, Strapi will generate API files in `apps/cms/src/api/`.

Suggested initial content types:
- **Animal** - For animal profiles (name, species, description, images, etc.)
- **Experience** - For bookable experiences (matches Prisma schema)
- **Page** - For dynamic pages (About, FAQ, etc.)
- **BlogPost** - For news/blog content
- **FAQItem** - For FAQ entries
- **Settings** - For global site settings (contact info, social links, etc.)

## Integration with Next.js

The public and admin sites will fetch content from Strapi via REST API or GraphQL:

```typescript
// Example: Fetch animals from Strapi
const response = await fetch('http://localhost:1337/api/animals?populate=*');
const { data } = await response.json();
```

## Deployment Notes

- CMS will be hosted on DigitalOcean (same server as admin site)
- Will use PostgreSQL in production
- Admin URL: https://admin.wildlifeoasis.co.uk/cms (or similar)
- CMS admin panel requires authentication (created on first run)

## Ports

- Public site: 3000
- Admin site: 3001  
- CMS: 1337 (Strapi default)

## Next Steps

1. Start CMS and create first admin user
2. Define content types in Strapi admin
3. Set up API tokens for Next.js apps to access content
4. Create sample content for testing
5. Build content fetching utilities in `@lwo/shared-types` or new `@lwo/cms-client` package

## Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Content Types](https://docs.strapi.io/dev-docs/backend-customization/models)
