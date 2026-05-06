# LWO CMS (Strapi)

Headless CMS for managing LWO content.

## Getting Started

### First Time Setup

1. Install dependencies from monorepo root:
   ```bash
   pnpm install
   ```

2. Copy environment variables:
   ```bash
   cd apps/cms
   cp .env.example .env
   ```
   
   The `.env` file is already configured with development secrets for SQLite.

3. Build the admin panel:
   ```bash
   pnpm --filter=cms build
   ```

4. Start the development server:
   ```bash
   pnpm --filter=cms dev
   ```

5. Visit http://localhost:1337/admin and create your first admin user

### Development

```bash
# Start dev server (from monorepo root)
pnpm --filter=cms dev

# Or from apps/cms directory
pnpm dev
```

### Production Build

```bash
pnpm --filter=cms build
pnpm --filter=cms start
```

## Database

### Development (SQLite)
By default, the CMS uses SQLite for local development. The database file is stored in `.tmp/data.db` and is gitignored.

### Production (PostgreSQL)
For production/UAT, update the `.env` file to use PostgreSQL:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lwo_dev
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_SSL=false
```

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `PORT`: Server port (default: 1337)
- `DATABASE_CLIENT`: Database type (sqlite or postgres)
- `APP_KEYS`: Application encryption keys (required)
- `API_TOKEN_SALT`: Salt for API tokens (required)
- `ADMIN_JWT_SECRET`: Secret for admin JWT tokens (required)
- `JWT_SECRET`: Secret for user JWT tokens (required)

## Content Types

Content types will be defined through the Strapi admin panel and stored in `src/api/`.

## Deployment

The CMS will be deployed to DigitalOcean alongside the admin site.

See the main project README for deployment instructions.
