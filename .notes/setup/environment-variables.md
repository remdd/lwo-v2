# Environment Variables Reference

**Last Updated:** 2026-05-06  
**Status:** Template - Will be finalized during implementation

---

## Overview

This document provides a complete reference for all environment variables used across the LWO platform. Each application has its own `.env` file with specific requirements.

**Security Note:** Never commit `.env` files to version control. Use `.env.example` files as templates.

---

## Public Site (`apps/public-site/.env.local`)

### Database

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
```

- **Required:** Yes
- **Description:** PostgreSQL connection string for Prisma
- **Local:** Points to local Postgres or Supabase dev instance
- **UAT/Prod:** Points to Supabase or DO Managed Postgres

### Strapi CMS

```bash
NEXT_PUBLIC_STRAPI_URL="http://localhost:1337"
STRAPI_API_TOKEN="your-strapi-api-token"
```

- **NEXT_PUBLIC_STRAPI_URL**
  - **Required:** Yes
  - **Description:** Base URL for Strapi API
  - **Local:** `http://localhost:1337`
  - **UAT:** `https://uat.wildlifeoasis.co.uk/cms` (or separate CMS subdomain)
  - **Prod:** `https://www.wildlifeoasis.co.uk/cms` (or separate CMS subdomain)
  - **Note:** Must be public (NEXT*PUBLIC*\*) for client-side fetching

- **STRAPI_API_TOKEN**
  - **Required:** Yes
  - **Description:** API token for authenticated Strapi requests
  - **Generate:** In Strapi admin → Settings → API Tokens → Create new token
  - **Type:** Read-only token for public site

### PayPal

```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="sandbox"
```

- **NEXT_PUBLIC_PAYPAL_CLIENT_ID**
  - **Required:** Yes
  - **Description:** PayPal Client ID (public)
  - **Local/UAT:** Sandbox Client ID
  - **Prod:** Live Client ID
  - **Get From:** PayPal Developer Dashboard

- **PAYPAL_CLIENT_SECRET**
  - **Required:** Yes
  - **Description:** PayPal Client Secret (server-side only)
  - **Local/UAT:** Sandbox Client Secret
  - **Prod:** Live Client Secret
  - **Security:** Never expose to client

- **PAYPAL_MODE**
  - **Required:** Yes
  - **Description:** PayPal environment mode
  - **Local/UAT:** `sandbox`
  - **Prod:** `live`

### Email (Mailgun)

```bash
MAILGUN_API_KEY="your-mailgun-api-key"
MAILGUN_DOMAIN="your-domain.mailgun.org"
MAILGUN_FROM_EMAIL="noreply@wildlifeoasis.co.uk"
```

- **MAILGUN_API_KEY**
  - **Required:** Yes
  - **Description:** Mailgun API key for sending emails
  - **Get From:** Mailgun dashboard → API Keys

- **MAILGUN_DOMAIN**
  - **Required:** Yes
  - **Description:** Verified Mailgun sending domain
  - **Example:** `mg.wildlifeoasis.co.uk`

- **MAILGUN_FROM_EMAIL**
  - **Required:** Yes
  - **Description:** From address for emails
  - **Format:** `Name <email@domain.com>`

### Analytics

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

- **Required:** Optional (recommended)
- **Description:** Google Analytics 4 Measurement ID
- **Get From:** Google Analytics dashboard
- **Local:** Can be omitted or use test property

### Application

```bash
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- **Required:** Yes
- **Description:** Base URL of the public site
- **Local:** `http://localhost:3000`
- **UAT:** `https://uat.wildlifeoasis.co.uk`
- **Prod:** `https://www.wildlifeoasis.co.uk`
- **Used For:** Absolute URLs in emails, meta tags, redirects

---

## Admin Site (`apps/admin-site/.env.local`)

### Database

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
```

- **Required:** Yes
- **Description:** PostgreSQL connection string for Prisma
- **Note:** Same database as public site

### NextAuth

```bash
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-nextauth-secret"
```

- **NEXTAUTH_URL**
  - **Required:** Yes
  - **Description:** Base URL of the admin site
  - **Local:** `http://localhost:3001`
  - **UAT:** `https://admin-uat.wildlifeoasis.co.uk` (or similar)
  - **Prod:** `https://admin.wildlifeoasis.co.uk` (or similar)

- **NEXTAUTH_SECRET**
  - **Required:** Yes
  - **Description:** Secret for signing JWT tokens
  - **Generate:** `openssl rand -base64 32`
  - **Security:** Must be unique per environment, never share

### Application

```bash
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

- **Required:** Yes
- **Description:** Base URL of the admin site
- **Local:** `http://localhost:3001`
- **UAT:** `https://admin-uat.wildlifeoasis.co.uk`
- **Prod:** `https://admin.wildlifeoasis.co.uk`

---

## Strapi CMS (`apps/cms/.env`)

### Server

```bash
HOST=0.0.0.0
PORT=1337
NODE_ENV=development
```

- **HOST**
  - **Required:** Yes
  - **Description:** Host to bind Strapi server
  - **Default:** `0.0.0.0` (all interfaces)

- **PORT**
  - **Required:** Yes
  - **Description:** Port for Strapi server
  - **Default:** `1337`

- **NODE_ENV**
  - **Required:** Yes
  - **Options:** `development`, `production`
  - **Local:** `development`
  - **UAT/Prod:** `production`

### Database

```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lwo_dev
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_SSL=false
```

- **DATABASE_CLIENT**
  - **Required:** Yes
  - **Value:** `postgres`

- **DATABASE_HOST**
  - **Required:** Yes
  - **Local:** `localhost` or Supabase host
  - **UAT/Prod:** Supabase or DO Postgres host

- **DATABASE_PORT**
  - **Required:** Yes
  - **Default:** `5432`

- **DATABASE_NAME**
  - **Required:** Yes
  - **Local:** `lwo_dev`
  - **UAT:** `lwo_uat`
  - **Prod:** `lwo_prod`

- **DATABASE_USERNAME** & **DATABASE_PASSWORD**
  - **Required:** Yes
  - **Description:** Database credentials

- **DATABASE_SSL**
  - **Required:** Yes
  - **Local:** `false`
  - **UAT/Prod:** `true` (for managed databases)

### Secrets

```bash
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
TRANSFER_TOKEN_SALT=your-transfer-token-salt
```

- **Generate All Secrets:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('base64'));"
  ```
- **APP_KEYS:** Comma-separated list of 4 random keys
- **Security:** Must be unique per environment

### Public URL

```bash
PUBLIC_URL=http://localhost:1337
```

- **Required:** Yes
- **Local:** `http://localhost:1337`
- **UAT:** `https://cms-uat.wildlifeoasis.co.uk`
- **Prod:** `https://cms.wildlifeoasis.co.uk`

---

## Database Package (`packages/database/.env`)

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
```

- **Required:** Yes
- **Description:** PostgreSQL connection string for Prisma CLI operations
- **Note:** Same as other apps, used for migrations and Prisma Studio

---

## Environment-Specific Values

### Local Development

| Variable         | Value                          |
| ---------------- | ------------------------------ |
| Public Site URL  | `http://localhost:3000`        |
| Admin Site URL   | `http://localhost:3001`        |
| Strapi URL       | `http://localhost:1337`        |
| Database         | Local Postgres or Supabase dev |
| PayPal Mode      | `sandbox`                      |
| Node Environment | `development`                  |

### UAT (Staging)

| Variable         | Value                                   |
| ---------------- | --------------------------------------- |
| Public Site URL  | `https://uat.wildlifeoasis.co.uk`       |
| Admin Site URL   | `https://admin-uat.wildlifeoasis.co.uk` |
| Strapi URL       | `https://cms-uat.wildlifeoasis.co.uk`   |
| Database         | Supabase UAT instance                   |
| PayPal Mode      | `sandbox`                               |
| Node Environment | `production`                            |

### Production

| Variable         | Value                                |
| ---------------- | ------------------------------------ |
| Public Site URL  | `https://www.wildlifeoasis.co.uk`    |
| Admin Site URL   | `https://admin.wildlifeoasis.co.uk`  |
| Strapi URL       | `https://cms.wildlifeoasis.co.uk`    |
| Database         | Supabase prod or DO Managed Postgres |
| PayPal Mode      | `live`                               |
| Node Environment | `production`                         |

---

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use `.env.example` files** - Provide templates without sensitive values
3. **Rotate secrets regularly** - Especially in production
4. **Use different secrets per environment** - Never reuse prod secrets in dev
5. **Limit secret access** - Only share with team members who need them
6. **Use environment-specific values** - Different DB, PayPal accounts, etc.
7. **Enable database SSL in production** - Always use encrypted connections
8. **Store secrets securely** - Use password manager or secrets management tool

---

## Setting Up New Environments

### Checklist

- [ ] Create `.env` file from `.env.example`
- [ ] Generate all required secrets (NextAuth, Strapi, etc.)
- [ ] Set up database instance (Supabase or DO)
- [ ] Configure PayPal sandbox/live credentials
- [ ] Set up Mailgun domain and API key
- [ ] Configure Google Analytics property
- [ ] Set correct URLs for environment
- [ ] Verify all variables are set
- [ ] Test application startup
- [ ] Verify database connectivity
- [ ] Test Strapi API access
- [ ] Test PayPal integration
- [ ] Test email sending

---

**Note:** Update this document when new environment variables are added or changed.
