# Phase 4: Hosting Setup - Configuration Complete ✅

**Completion Date:** May 8, 2026  
**Status:** Configuration ready - Awaiting deployment execution

---

## Overview

Phase 4 prepares all configuration, documentation, and deployment scripts needed to host the LWO platform according to the hybrid hosting strategy defined in ADR-001.

**Hosting Strategy:**
- **Public Site** → Vercel Pro (~$20/month) with global CDN
- **Admin Site + Strapi CMS** → DigitalOcean droplet ($12-24/month)
- **Database** → Supabase PostgreSQL (configured in Phase 3)

**Total Monthly Cost:** $32-44/month

---

## What Was Accomplished

### 1. Vercel Configuration ✅

**Files Created:**
- `apps/public-site/vercel.json` - Build and environment configuration
- `.notes/setup/vercel-deployment.md` - Complete deployment guide

**Configuration Includes:**
- Automated build commands for monorepo setup
- Environment variable placeholders for all required secrets
- London region (lhr1) for optimal performance
- Custom domain setup instructions
- SSL certificate configuration (automatic)

**Key Features:**
- Zero-config Next.js deployments
- Global CDN for fast page loads
- Automatic preview deployments for PRs
- Built-in SSL and domain management
- Git push = automatic deployment

### 2. DigitalOcean Configuration ✅

**Files Created:**
- `.notes/setup/digitalocean-deployment.md` - Complete server setup guide
- `ecosystem.config.js` - PM2 process management configuration
- `deploy.sh` - Automated deployment script
- `.notes/nginx/admin.wildlifeoasis.co.uk` - Nginx config for admin site
- `.notes/nginx/cms.wildlifeoasis.co.uk` - Nginx config for Strapi CMS

**Configuration Includes:**
- Ubuntu 24.04 LTS server setup
- Node.js 24.x, pnpm, PM2 installation
- Nginx reverse proxy for both admin and CMS
- SSL certificates via Let's Encrypt (certbot)
- Firewall configuration (UFW)
- PostgreSQL setup (optional - can use Supabase)

**Key Features:**
- Single droplet hosts both admin site and CMS
- PM2 auto-restart on crashes/reboots
- Nginx handles SSL termination and reverse proxying
- Automated deployment script for updates
- Separate domains for admin and CMS

### 3. Deployment Documentation ✅

**Files Created/Updated:**
- `.notes/PHASE-4-CHECKLIST.md` - Step-by-step deployment checklist
- `.notes/setup/deployment.md` - Updated with Phase 4 details

**Documentation Coverage:**
- Prerequisites and account setup
- Step-by-step deployment procedures
- Environment variable configuration for each service
- DNS configuration for all domains
- SSL certificate setup and auto-renewal
- Testing and verification procedures
- Troubleshooting common issues
- Rollback procedures
- Security best practices
- Monitoring and maintenance guides

---

## Deployment Architecture

### Domain Structure

```
wildlifeoasis.co.uk (root)
├── www.wildlifeoasis.co.uk → Public site (Vercel)
├── admin.wildlifeoasis.co.uk → Admin site (DigitalOcean)
└── cms.wildlifeoasis.co.uk → Strapi CMS (DigitalOcean)
```

### Infrastructure Layout

```
┌─────────────────────────────────────────────────────┐
│ VERCEL (Public Site)                                │
│ - Next.js 16 App Router                             │
│ - Global CDN                                         │
│ - Automatic HTTPS                                    │
│ - Auto-deploy on git push                           │
└─────────────────────────────────────────────────────┘
                           │
                           │ API Calls
                           ▼
┌─────────────────────────────────────────────────────┐
│ DIGITALOCEAN DROPLET                                │
│ ┌─────────────────────────────────────────────────┐ │
│ │ NGINX (Reverse Proxy)                           │ │
│ │ - SSL Termination (Let's Encrypt)               │ │
│ │ - Routes to admin:3001 and cms:1337             │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ PM2 Process Manager                             │ │
│ │ ├── lwo-admin (Next.js on :3001)                │ │
│ │ └── lwo-cms (Strapi on :1337)                   │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                           │
                           │ Database Queries
                           ▼
┌─────────────────────────────────────────────────────┐
│ SUPABASE (PostgreSQL Database)                      │
│ - Transaction pooler (port 6543) for apps          │
│ - Session pooler (port 5432) for migrations        │
│ - Automatic backups                                 │
└─────────────────────────────────────────────────────┘
```

---

## Configuration Files Reference

### Vercel Configuration

**File:** `apps/public-site/vercel.json`

```json
{
  "buildCommand": "pnpm turbo run build --filter=public-site",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["lhr1"]
}
```

**Environment Variables Required:**
- `DATABASE_URL` - Supabase connection
- `NEXT_PUBLIC_STRAPI_URL` - CMS URL
- `STRAPI_API_TOKEN` - API authentication
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - PayPal sandbox
- `PAYPAL_CLIENT_SECRET` - PayPal secret
- `PAYPAL_MODE` - Set to "sandbox"
- `MAILGUN_API_KEY` - Email service
- `MAILGUN_DOMAIN` - Mailgun domain
- `MAILGUN_FROM_EMAIL` - Sender email
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Analytics (optional)
- `NEXT_PUBLIC_SITE_URL` - Production URL

### PM2 Configuration

**File:** `ecosystem.config.js`

Manages two Node.js processes:
- **lwo-admin** - Admin site on port 3001
- **lwo-cms** - Strapi CMS on port 1337

Features:
- Auto-restart on crashes
- Memory limit monitoring (1GB per app)
- Log rotation and management
- Startup on system reboot

### Nginx Configuration

**Admin Site:** `.notes/nginx/admin.wildlifeoasis.co.uk`
- Proxies to `localhost:3001`
- SSL termination
- Security headers
- Cache bypass for admin panel

**Strapi CMS:** `.notes/nginx/cms.wildlifeoasis.co.uk`
- Proxies to `localhost:1337`
- SSL termination
- 50MB upload limit for media
- Extended timeouts for uploads

### Deployment Script

**File:** `deploy.sh`

Automated deployment script that:
1. Pulls latest code from GitHub
2. Installs dependencies
3. Runs database migrations
4. Builds all applications
5. Restarts PM2 processes
6. Performs health checks

Usage:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Environment Variables by Service

### Public Site (Vercel)

```bash
# Database
DATABASE_URL="postgresql://..."

# CMS
NEXT_PUBLIC_STRAPI_URL="https://cms.wildlifeoasis.co.uk"
STRAPI_API_TOKEN="xxx"

# Payments
NEXT_PUBLIC_PAYPAL_CLIENT_ID="xxx"
PAYPAL_CLIENT_SECRET="xxx"
PAYPAL_MODE="sandbox"

# Email
MAILGUN_API_KEY="xxx"
MAILGUN_DOMAIN="xxx"
MAILGUN_FROM_EMAIL="noreply@wildlifeoasis.co.uk"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-xxx"

# App
NEXT_PUBLIC_SITE_URL="https://wildlifeoasis.co.uk"
```

### Admin Site (DigitalOcean)

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="https://admin.wildlifeoasis.co.uk"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# App
NEXT_PUBLIC_SITE_URL="https://admin.wildlifeoasis.co.uk"
```

### Strapi CMS (DigitalOcean)

```bash
# Server
HOST=0.0.0.0
PORT=1337

# Secrets (generate with openssl rand -base64 32)
APP_KEYS="key1,key2,key3,key4"
API_TOKEN_SALT="xxx"
ADMIN_JWT_SECRET="xxx"
TRANSFER_TOKEN_SALT="xxx"
JWT_SECRET="xxx"

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=db.zxrwiwbvnkpbsysqybmh.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=xxx
DATABASE_SSL=true

# URLs
ADMIN_PATH=/admin
STRAPI_URL=https://cms.wildlifeoasis.co.uk

# CORS
CORS_ORIGINS=https://wildlifeoasis.co.uk,https://www.wildlifeoasis.co.uk
```

---

## DNS Configuration

### Required DNS Records

```dns
# Public site (Vercel)
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600

# Admin site (DigitalOcean)
Type: A
Name: admin
Value: YOUR_DROPLET_IP
TTL: 3600

# CMS (DigitalOcean)
Type: A
Name: cms
Value: YOUR_DROPLET_IP
TTL: 3600
```

---

## Deployment Procedures

### Initial Deployment

**Order of Operations:**
1. Deploy public site to Vercel (without CMS connection)
2. Deploy admin + CMS to DigitalOcean
3. Generate Strapi API token
4. Update Vercel environment variables with CMS URL and token
5. Redeploy Vercel to connect to CMS

### Subsequent Deployments

**Public Site (Vercel):**
- Automatic on push to `main` branch
- Preview deployments on pull requests
- Manual redeploy via Vercel dashboard

**Admin + CMS (DigitalOcean):**
```bash
# SSH into droplet
ssh lwo@YOUR_DROPLET_IP

# Run deployment script
cd /home/lwo/lwo
./deploy.sh
```

Or manually:
```bash
git pull origin main
pnpm install
pnpm --filter=@lwo/database build
pnpm --filter=admin-site build
pnpm --filter=cms build
pm2 restart all
```

---

## Security Configuration

### Firewall (UFW on DigitalOcean)

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP/HTTPS (nginx)
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable
```

### SSL Certificates

**Vercel:** Automatic SSL via Vercel (Let's Encrypt)
**DigitalOcean:** SSL via certbot

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d admin.wildlifeoasis.co.uk
sudo certbot --nginx -d cms.wildlifeoasis.co.uk

# Auto-renewal (automatic cron job created)
sudo certbot renew --dry-run
```

### Security Headers (Nginx)

All nginx configurations include:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

### Environment Variables

- All `.env` files are in `.gitignore`
- Never commit secrets to git
- Store production credentials in password manager
- Use different secrets for each environment

---

## Monitoring & Maintenance

### Application Monitoring

**PM2 Commands:**
```bash
pm2 status              # Check app status
pm2 logs                # View logs
pm2 logs lwo-admin      # Admin logs only
pm2 logs lwo-cms        # CMS logs only
pm2 monit               # Resource monitoring
pm2 restart all         # Restart all apps
```

**Vercel:**
- View logs in Vercel Dashboard → Deployments → [Deployment] → Logs
- Enable Vercel Analytics for performance metrics
- Set up deployment notifications

### Server Monitoring

**Nginx Logs:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**System Resources:**
```bash
htop                    # System resource usage
df -h                   # Disk space
free -h                 # Memory usage
```

### Health Checks

**Automated:**
- PM2 automatically restarts crashed processes
- Nginx returns 502 if backend is down
- Certbot auto-renews SSL certificates

**Manual:**
```bash
# Check services
sudo systemctl status nginx
pm2 status

# Test URLs
curl https://wildlifeoasis.co.uk
curl https://admin.wildlifeoasis.co.uk
curl https://cms.wildlifeoasis.co.uk
```

---

## Troubleshooting Guide

### Common Issues & Solutions

**502 Bad Gateway**
- Cause: Application not running
- Solution: `pm2 restart all`
- Check: `pm2 logs` for errors

**Database Connection Errors**
- Check: DATABASE_URL includes `?pgbouncer=true`
- Verify: Supabase project is not paused
- Test: Connection from droplet to Supabase

**Build Fails on Vercel**
- Check: Build logs in Vercel dashboard
- Verify: All environment variables are set
- Ensure: `pnpm-lock.yaml` is committed

**SSL Certificate Issues**
- Renew: `sudo certbot renew`
- Check: DNS points to correct IP
- Verify: Nginx config syntax: `sudo nginx -t`

**PM2 App Won't Start**
- View logs: `pm2 logs lwo-admin --err`
- Check: Environment variables in `.env` files
- Verify: Port not already in use
- Rebuild: `pnpm --filter=admin-site build`

---

## Rollback Procedures

### Vercel (Public Site)

**Option 1: Dashboard**
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "⋯" → "Promote to Production"

**Option 2: Git Revert**
1. `git revert <commit-hash>`
2. Push to `main`
3. Vercel auto-deploys

### DigitalOcean (Admin + CMS)

**Git Revert:**
```bash
cd /home/lwo/lwo
git revert <commit-hash>
git push origin main
./deploy.sh
```

**Manual Rollback:**
```bash
git checkout <previous-commit-hash>
pnpm install
pnpm build
pm2 restart all
```

---

## Cost Breakdown

| Service | Tier | Monthly Cost | Notes |
|---------|------|--------------|-------|
| Vercel Pro | Production | $20 | 1TB bandwidth, analytics included |
| DigitalOcean | 2GB Droplet | $12 | Development/UAT |
| DigitalOcean | 4GB Droplet | $24 | Production (recommended) |
| Supabase | Free | $0 | 500MB database, 2GB bandwidth |
| Supabase | Pro | $25 | 8GB database, 250GB bandwidth |
| **Total (Dev)** | | **$32/mo** | Using free Supabase |
| **Total (Prod)** | | **$44/mo** | Using free Supabase |
| **Total (Prod+)** | | **$69/mo** | Using Supabase Pro |

**Cost Optimization Tips:**
- Start with $12 droplet, upgrade if needed
- Use Supabase free tier initially
- Monitor Vercel bandwidth usage
- Enable caching to reduce compute

---

## Next Steps

### Immediate (Ready Now)

1. **Execute Vercel Deployment**
   - Follow `.notes/setup/vercel-deployment.md`
   - Set up Vercel account and import repository
   - Configure environment variables
   - Deploy and test

2. **Execute DigitalOcean Deployment**
   - Follow `.notes/setup/digitalocean-deployment.md`
   - Create droplet and configure server
   - Deploy admin and CMS applications
   - Configure SSL and firewall

3. **Integration Testing**
   - Test public site → CMS connection
   - Verify CORS configuration
   - Test database connectivity from all apps

### Phase 5 (After Deployment)

Once hosting is complete, Phase 5 will implement:
- Core booking system functionality
- Shop/products features
- User authentication (NextAuth)
- Payment integration (PayPal)
- Email notifications (Mailgun)
- CMS content types and display

---

## Documentation Reference

| Document | Purpose |
|----------|---------|
| `.notes/PHASE-4-CHECKLIST.md` | Step-by-step deployment checklist |
| `.notes/setup/vercel-deployment.md` | Complete Vercel setup guide |
| `.notes/setup/digitalocean-deployment.md` | Complete DigitalOcean setup guide |
| `.notes/setup/deployment.md` | General deployment procedures |
| `.notes/nginx/admin.wildlifeoasis.co.uk` | Nginx config template for admin |
| `.notes/nginx/cms.wildlifeoasis.co.uk` | Nginx config template for CMS |
| `ecosystem.config.js` | PM2 process configuration |
| `deploy.sh` | Automated deployment script |
| `apps/public-site/vercel.json` | Vercel build configuration |

---

## Verification Checklist

Configuration Phase ✅ (Complete):
- [x] Vercel configuration created
- [x] DigitalOcean configuration created
- [x] Nginx configurations created
- [x] PM2 configuration created
- [x] Deployment script created
- [x] Deployment guides written
- [x] Deployment checklist created
- [x] All documentation complete
- [x] Files committed to repository

Deployment Phase ⏳ (Pending Execution):
- [ ] Vercel project created and deployed
- [ ] Custom domain configured on Vercel
- [ ] DigitalOcean droplet created and configured
- [ ] Admin site deployed and accessible
- [ ] Strapi CMS deployed and accessible
- [ ] SSL certificates installed
- [ ] All environment variables configured
- [ ] DNS records configured
- [ ] Integration testing complete
- [ ] All services monitored and verified

---

**Phase 4 Configuration Status:** ✅ COMPLETE

**Commit:** `80f1768` - "feat: add Phase 4 hosting setup configuration and documentation"

**Ready for:** Deployment execution following the provided guides

**Estimated Deployment Time:**
- Vercel: 30-60 minutes
- DigitalOcean: 2-3 hours (first time), 30 minutes (subsequent)
- Total: 3-4 hours

---

Robin, Phase 4 configuration is complete! All the deployment guides, configuration files, and scripts are ready. The actual deployment execution will require your accounts on Vercel and DigitalOcean, so this is a good stopping point for you to review the documentation and execute the deployments at your convenience.
