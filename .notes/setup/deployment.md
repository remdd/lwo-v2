# Deployment Procedures

**Last Updated:** 2026-05-06  
**Status:** Template - Will be updated during Phase 4 (Hosting Setup)

---

## Overview

This document outlines deployment procedures for all environments of the LWO platform.

---

## Environments

| Environment    | Purpose         | URL                     | Auto-Deploy          |
| -------------- | --------------- | ----------------------- | -------------------- |
| **Local**      | Development     | localhost               | Manual               |
| **UAT**        | Testing/staging | uat.wildlifeoasis.co.uk | On push to `develop` |
| **Production** | Live site       | www.wildlifeoasis.co.uk | On push to `main`    |

---

## Deployment Architecture

### Public Site (Vercel)

**Apps:** `apps/public-site`

**Deployment:**

- **Production:** Auto-deploy on push to `main` branch
- **UAT:** Auto-deploy on push to `develop` branch
- **Preview:** Auto-deploy on pull requests

**Process:**

1. Push to GitHub
2. GitHub webhook triggers Vercel
3. Vercel builds Next.js app
4. Vercel deploys to edge network
5. Health check confirms deployment

**Rollback:**

- Use Vercel dashboard to rollback to previous deployment
- Or redeploy previous git commit

### Admin Site + Strapi (DigitalOcean)

**Apps:** `apps/admin-site`, `apps/cms`

**Deployment Method:** GitHub Actions → SSH → PM2

**Process:**

1. Push to GitHub
2. GitHub Actions workflow runs
3. SSH into DO droplet
4. Pull latest code
5. Install dependencies
6. Build applications
7. Run database migrations
8. Restart PM2 processes
9. Health check confirms

**Manual Deployment:**

```bash
# SSH into droplet
ssh user@droplet-ip

# Navigate to app directory
cd /var/www/lwo

# Pull latest code
git pull origin main

# Install dependencies
pnpm install

# Build apps
pnpm build --filter=admin-site
pnpm build --filter=cms

# Run migrations
pnpm --filter=database prisma migrate deploy

# Restart with PM2
pm2 restart admin-site
pm2 restart cms
pm2 save
```

---

## Pre-Deployment Checklist

### Before Deploying to UAT

- [ ] All tests passing locally
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Build succeeds locally
- [ ] Environment variables configured in UAT
- [ ] Database migrations tested
- [ ] Feature tested locally

### Before Deploying to Production

- [ ] UAT deployment successful
- [ ] UAT testing complete
- [ ] Stakeholder approval received
- [ ] Database backup created
- [ ] Production environment variables verified
- [ ] Rollback plan prepared
- [ ] Monitoring alerts configured
- [ ] Documentation updated

---

## GitHub Actions Workflows

**Location:** `.github/workflows/`

### Public Site Workflow

**File:** `public-site.yml`

```yaml
# TBD - Will trigger Vercel deployment
# Vercel handles deployment via GitHub integration
```

### Admin Site Workflow

**File:** `admin-site.yml`

```yaml
# TBD - Will SSH to DO droplet and deploy
```

### Strapi Workflow

**File:** `cms.yml`

```yaml
# TBD - Will deploy Strapi to DO droplet
```

---

## Database Migrations

### Development

```bash
# Create a new migration
pnpm --filter=database prisma migrate dev --name description-of-change

# This will:
# 1. Update the database schema
# 2. Generate a migration file
# 3. Regenerate Prisma Client
```

### UAT/Production

```bash
# Apply pending migrations (non-interactive)
pnpm --filter=database prisma migrate deploy

# This runs in CI/CD before app deployment
```

**Important:**

- Always test migrations in UAT first
- Create database backup before production migrations
- Migrations should be backwards-compatible when possible

---

## Environment Variables

### Setting in Vercel

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add variables for Production, Preview, Development
3. Redeploy to apply changes

### Setting on DigitalOcean

1. SSH into droplet
2. Edit `.env` files in `/var/www/lwo/apps/*`
3. Restart PM2 processes

**Security:** Never commit `.env` files. Use secure storage (password manager) for production secrets.

---

## Monitoring & Health Checks

### Public Site (Vercel)

- **Vercel Dashboard:** Real-time deployment status, logs, analytics
- **Vercel Analytics:** Web vitals, performance metrics
- **Uptime Monitoring:** TBD (UptimeRobot, Pingdom, or similar)

### Admin Site + Strapi (DigitalOcean)

- **PM2 Monitoring:** `pm2 monit` for process health
- **Nginx Logs:** `/var/log/nginx/`
- **Application Logs:** PM2 logs (`pm2 logs`)
- **Uptime Monitoring:** TBD

### Database (Supabase)

- **Supabase Dashboard:** Connection stats, query performance
- **Alerts:** Configure for high connection count, slow queries

---

## Rollback Procedures

### Public Site (Vercel)

**Option 1: Vercel Dashboard**

1. Go to Vercel Dashboard → Deployments
2. Find last known good deployment
3. Click "Promote to Production"

**Option 2: Git Revert**

1. `git revert <commit-hash>`
2. Push to `main`
3. Vercel auto-deploys

### Admin Site + Strapi (DigitalOcean)

**Option 1: Git Revert**

```bash
# On droplet
cd /var/www/lwo
git revert <commit-hash>
pnpm install
pnpm build
pm2 restart all
```

**Option 2: Database Rollback**

```bash
# If migration caused issues
pnpm --filter=database prisma migrate resolve --rolled-back <migration-name>
# Restore database from backup if needed
```

---

## Disaster Recovery

### Database Backup & Restore

**Automated Backups:**

- Supabase: Daily automatic backups (7-day retention on free tier)
- DigitalOcean Managed Postgres: Configurable backup schedule

**Manual Backup:**

```bash
# Export database
pg_dump -h <host> -U <user> -d <database> > backup-$(date +%Y%m%d).sql

# Restore database
psql -h <host> -U <user> -d <database> < backup-20260506.sql
```

**Backup Strategy:**

- Automated daily backups via hosting provider
- Manual backup before major deployments
- Store critical backups in separate location (e.g., AWS S3)

### Server Failure (DigitalOcean)

**Recovery Steps:**

1. Spin up new droplet
2. Install required software (Node.js, nginx, PM2, PostgreSQL client)
3. Clone repository
4. Restore environment variables
5. Restore database from backup
6. Deploy applications
7. Update DNS if needed

**Prevention:**

- Document server setup process
- Consider DigitalOcean Snapshots for quick recovery
- Keep infrastructure-as-code (future enhancement)

---

## DNS Configuration

**Domain:** wildlifeoasis.co.uk  
**DNS Provider:** TBD

### Required Records

```
# Production
www.wildlifeoasis.co.uk     CNAME  cname.vercel-dns.com
admin.wildlifeoasis.co.uk   A      <DO-droplet-IP>
cms.wildlifeoasis.co.uk     A      <DO-droplet-IP>

# UAT
uat.wildlifeoasis.co.uk       CNAME  cname.vercel-dns.com
admin-uat.wildlifeoasis.co.uk A      <DO-droplet-IP>
cms-uat.wildlifeoasis.co.uk   A      <DO-droplet-IP>

# Root domain redirect (optional)
wildlifeoasis.co.uk         A      <Vercel-IP> or CNAME www
```

### SSL Certificates

- **Vercel:** Automatic SSL via Vercel
- **DigitalOcean:** Let's Encrypt via certbot (nginx)

---

## Deployment Timeline (Typical)

1. **Code merged to develop** - 0 min
2. **UAT deployment starts** - +1 min (GitHub Actions trigger)
3. **UAT deployment complete** - +5-10 min (build, deploy, health check)
4. **UAT testing** - Variable (hours to days)
5. **Merge to main** - After approval
6. **Production deployment starts** - +1 min
7. **Production deployment complete** - +5-10 min
8. **Production verification** - +15 min (smoke tests, monitoring)

---

## Troubleshooting Common Issues

### Deployment Failed

**Symptoms:** GitHub Actions workflow fails, Vercel deployment error

**Steps:**

1. Check workflow logs in GitHub Actions
2. Verify environment variables are set
3. Check build logs for errors
4. Verify database connectivity
5. Check for failing tests

### Application Won't Start

**Symptoms:** PM2 shows app in error state, 502 Bad Gateway

**Steps:**

1. Check PM2 logs: `pm2 logs <app-name>`
2. Verify environment variables
3. Check database connectivity
4. Verify port not already in use
5. Check file permissions
6. Review nginx error logs

### Database Migration Failed

**Symptoms:** Migration error, app can't connect to DB

**Steps:**

1. Check migration logs
2. Verify database connectivity
3. Check for schema conflicts
4. Roll back migration if needed
5. Fix schema issue
6. Retry migration

### Slow Performance

**Symptoms:** High response times, timeout errors

**Steps:**

1. Check Vercel/PM2 metrics
2. Review database query performance (Supabase dashboard)
3. Check for N+1 queries
4. Verify CDN is working (Vercel)
5. Check for memory leaks (PM2 monit)
6. Scale up resources if needed

---

## Future Improvements

- **Infrastructure as Code:** Terraform or similar for DO setup
- **Automated testing in CI/CD:** Run full test suite before deploy
- **Blue-green deployments:** Zero-downtime deploys for admin site
- **Enhanced monitoring:** Sentry for error tracking, Datadog/New Relic for APM
- **Automated backups:** Daily DB dumps to external storage
- **Load balancing:** If traffic grows significantly

---

**Note:** Update this document as deployment processes are finalized during Phase 4 and 5.
