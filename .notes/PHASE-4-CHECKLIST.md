# Phase 4: Hosting Setup - Deployment Checklist

**Date Started:** May 8, 2026  
**Status:** Ready for Deployment

---

## Overview

Phase 4 implements the hybrid hosting strategy defined in ADR-001:
- **Public Site** → Vercel Pro (~$20/month)
- **Admin Site + Strapi CMS** → DigitalOcean droplet ($12-24/month)
- **Database** → Supabase (already configured in Phase 3)

**Total Monthly Cost:** ~$32-44/month

---

## Prerequisites

Before starting, ensure you have:

- [ ] GitHub repository with all Phase 1-3 code
- [ ] Vercel account (sign up at vercel.com)
- [ ] DigitalOcean account (sign up at digitalocean.com)
- [ ] Domain name access (wildlifeoasis.co.uk)
- [ ] Supabase DATABASE_URL from Phase 3
- [ ] SSH client (for DigitalOcean access)

---

## Part 1: Vercel Deployment (Public Site)

### Documentation
**Guide:** `.notes/setup/vercel-deployment.md`

### 1.1 Create Vercel Project

- [ ] Sign up/login to Vercel
- [ ] Import GitHub repository
- [ ] Set root directory to `apps/public-site`
- [ ] Framework should auto-detect as Next.js

### 1.2 Configure Build Settings

- [ ] Build Command: `pnpm turbo run build --filter=public-site`
- [ ] Install Command: `pnpm install`
- [ ] Output Directory: `.next`
- [ ] Node Version: 24.x

### 1.3 Set Environment Variables

Navigate to Project Settings → Environment Variables:

#### Database
- [ ] `DATABASE_URL` - Supabase connection string with `?pgbouncer=true`

#### Strapi (temporary URLs until CMS deployed)
- [ ] `NEXT_PUBLIC_STRAPI_URL` - Set to `http://localhost:1337` initially
- [ ] `STRAPI_API_TOKEN` - Leave empty initially

#### PayPal (Sandbox for testing)
- [ ] `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - Get from developer.paypal.com
- [ ] `PAYPAL_CLIENT_SECRET` - Get from developer.paypal.com
- [ ] `PAYPAL_MODE` - Set to `sandbox`

#### Email (Mailgun)
- [ ] `MAILGUN_API_KEY` - Get from mailgun.com
- [ ] `MAILGUN_DOMAIN` - Your mailgun domain
- [ ] `MAILGUN_FROM_EMAIL` - `noreply@wildlifeoasis.co.uk`

#### Analytics (Optional)
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Get from Google Analytics

#### Site URL
- [ ] `NEXT_PUBLIC_SITE_URL` - Set to `https://wildlifeoasis.co.uk`

### 1.4 Deploy

- [ ] Trigger first deployment (should auto-deploy on import)
- [ ] Note your preview URL (e.g., `https://lwo-public-xxx.vercel.app`)
- [ ] Check deployment logs for errors
- [ ] Test preview URL in browser

### 1.5 Configure Custom Domain

- [ ] Add domain in Vercel: `wildlifeoasis.co.uk`
- [ ] Add www subdomain: `www.wildlifeoasis.co.uk`
- [ ] Update DNS records:
  - A record: `@` → `76.76.21.21`
  - CNAME: `www` → `cname.vercel-dns.com`
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Verify SSL certificate issued automatically

### 1.6 Verify Deployment

- [ ] Visit https://wildlifeoasis.co.uk
- [ ] Check homepage loads
- [ ] Verify no console errors
- [ ] Test database connectivity (if applicable)

---

## Part 2: DigitalOcean Deployment (Admin + CMS)

### Documentation
**Guide:** `.notes/setup/digitalocean-deployment.md`

### 2.1 Create Droplet

- [ ] Log in to DigitalOcean
- [ ] Create new droplet:
  - **Image:** Ubuntu 24.04 LTS x64
  - **Size:** Basic $12/month (2GB RAM) or $24/month (4GB RAM - recommended)
  - **Region:** London
  - **Authentication:** SSH Key (recommended)
  - **Hostname:** `lwo-production`
- [ ] Note droplet IP address

### 2.2 Initial Server Setup

SSH into droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

- [ ] Update system: `apt update && apt upgrade -y`
- [ ] Create non-root user: `adduser lwo`
- [ ] Add user to sudo: `usermod -aG sudo lwo`
- [ ] Switch to user: `su - lwo`

### 2.3 Install Required Software

- [ ] Install Node.js 24.x
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
  sudo apt install -y nodejs
  ```
- [ ] Install pnpm: `sudo npm install -g pnpm`
- [ ] Install PM2: `sudo npm install -g pm2`
- [ ] Install PostgreSQL (optional - skip if using Supabase):
  ```bash
  sudo apt install -y postgresql postgresql-contrib
  ```

### 2.4 Clone and Build Application

- [ ] Clone repository:
  ```bash
  cd /home/lwo
  git clone https://github.com/YOUR_USERNAME/lwo.git
  cd lwo
  ```
- [ ] Install dependencies: `pnpm install`

### 2.5 Configure Environment Variables

#### Admin Site (.env)
Create `apps/admin-site/.env`:
- [ ] `DATABASE_URL` - Supabase pooled connection
- [ ] `NEXTAUTH_URL` - `https://admin.wildlifeoasis.co.uk`
- [ ] `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- [ ] `NEXT_PUBLIC_SITE_URL` - `https://admin.wildlifeoasis.co.uk`

#### Strapi CMS (.env)
Create `apps/cms/.env`:
- [ ] `HOST` - `0.0.0.0`
- [ ] `PORT` - `1337`
- [ ] Generate secrets with `openssl rand -base64 32`:
  - `APP_KEYS` (4 comma-separated values)
  - `API_TOKEN_SALT`
  - `ADMIN_JWT_SECRET`
  - `TRANSFER_TOKEN_SALT`
  - `JWT_SECRET`
- [ ] Database connection (PostgreSQL):
  - `DATABASE_CLIENT` - `postgres`
  - `DATABASE_HOST` - Supabase host or `localhost`
  - `DATABASE_PORT` - `5432`
  - `DATABASE_NAME` - Your database name
  - `DATABASE_USERNAME` - Database user
  - `DATABASE_PASSWORD` - Database password
  - `DATABASE_SSL` - `true` (for Supabase)
- [ ] `STRAPI_URL` - `https://cms.wildlifeoasis.co.uk`
- [ ] `CORS_ORIGINS` - `https://wildlifeoasis.co.uk,https://www.wildlifeoasis.co.uk`

### 2.6 Build Applications

- [ ] Build database package: `pnpm --filter=@lwo/database build`
- [ ] Build admin site: `pnpm --filter=admin-site build`
- [ ] Build Strapi CMS: `pnpm --filter=cms build`

### 2.7 Configure PM2

- [ ] Copy `ecosystem.config.js` to droplet (or create based on template)
- [ ] Update paths in ecosystem.config.js to match deployment location
- [ ] Start applications: `pm2 start ecosystem.config.js`
- [ ] Save PM2 configuration: `pm2 save`
- [ ] Setup PM2 auto-start: `pm2 startup` (follow instructions)
- [ ] Verify apps running: `pm2 status`

### 2.8 Configure Nginx

- [ ] Install Nginx: `sudo apt install -y nginx`
- [ ] Create admin site config:
  ```bash
  sudo nano /etc/nginx/sites-available/admin.wildlifeoasis.co.uk
  ```
  - Copy from `.notes/nginx/admin.wildlifeoasis.co.uk`
- [ ] Create CMS config:
  ```bash
  sudo nano /etc/nginx/sites-available/cms.wildlifeoasis.co.uk
  ```
  - Copy from `.notes/nginx/cms.wildlifeoasis.co.uk`
- [ ] Enable sites:
  ```bash
  sudo ln -s /etc/nginx/sites-available/admin.wildlifeoasis.co.uk /etc/nginx/sites-enabled/
  sudo ln -s /etc/nginx/sites-available/cms.wildlifeoasis.co.uk /etc/nginx/sites-enabled/
  ```
- [ ] Test nginx config: `sudo nginx -t`
- [ ] Restart nginx: `sudo systemctl restart nginx`

### 2.9 Configure DNS

Add these records in your domain registrar:
- [ ] A record: `admin` → `YOUR_DROPLET_IP`
- [ ] A record: `cms` → `YOUR_DROPLET_IP`
- [ ] Wait for DNS propagation
- [ ] Test: `dig admin.wildlifeoasis.co.uk` and `dig cms.wildlifeoasis.co.uk`

### 2.10 Configure SSL (Let's Encrypt)

- [ ] Install certbot: `sudo apt install -y certbot python3-certbot-nginx`
- [ ] Obtain SSL for admin:
  ```bash
  sudo certbot --nginx -d admin.wildlifeoasis.co.uk
  ```
- [ ] Obtain SSL for CMS:
  ```bash
  sudo certbot --nginx -d cms.wildlifeoasis.co.uk
  ```
- [ ] Test auto-renewal: `sudo certbot renew --dry-run`

### 2.11 Configure Firewall

- [ ] Allow SSH: `sudo ufw allow OpenSSH`
- [ ] Allow HTTP/HTTPS: `sudo ufw allow 'Nginx Full'`
- [ ] Enable firewall: `sudo ufw enable`
- [ ] Check status: `sudo ufw status`

### 2.12 Verify Deployment

- [ ] Visit https://admin.wildlifeoasis.co.uk
- [ ] Visit https://cms.wildlifeoasis.co.uk
- [ ] Check both sites load correctly
- [ ] Verify SSL certificates are valid
- [ ] Check PM2 status: `pm2 status`
- [ ] Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

## Part 3: Configure Strapi

### 3.1 Create Strapi Admin User

- [ ] Visit https://cms.wildlifeoasis.co.uk/admin
- [ ] Create first admin user
- [ ] Log in to Strapi admin panel

### 3.2 Generate API Token

- [ ] Go to Settings → API Tokens → Create new API Token
- [ ] Name: `Public Site Access`
- [ ] Token type: `Full access` or `Read-only` (based on needs)
- [ ] Token duration: `Unlimited`
- [ ] Copy generated token

### 3.3 Update Vercel Environment Variables

- [ ] Go to Vercel Dashboard → Project → Settings → Environment Variables
- [ ] Update `NEXT_PUBLIC_STRAPI_URL` to `https://cms.wildlifeoasis.co.uk`
- [ ] Update `STRAPI_API_TOKEN` to the generated token
- [ ] Redeploy Vercel project to apply changes

---

## Part 4: Testing & Verification

### 4.1 Public Site (Vercel)

- [ ] Homepage loads at https://wildlifeoasis.co.uk
- [ ] Database queries work (if applicable)
- [ ] No console errors
- [ ] SSL certificate valid
- [ ] Images load correctly
- [ ] Navigation works

### 4.2 Admin Site (DigitalOcean)

- [ ] Admin site loads at https://admin.wildlifeoasis.co.uk
- [ ] Can log in (once auth is implemented)
- [ ] Database connectivity works
- [ ] SSL certificate valid
- [ ] PM2 shows app running: `pm2 status`

### 4.3 Strapi CMS (DigitalOcean)

- [ ] CMS loads at https://cms.wildlifeoasis.co.uk/admin
- [ ] Can log in with admin user
- [ ] Database connection works
- [ ] Can create/edit content
- [ ] API endpoints accessible
- [ ] SSL certificate valid
- [ ] PM2 shows app running: `pm2 status`

### 4.4 Integration Testing

- [ ] Public site can fetch data from Strapi API
- [ ] CORS configured correctly (no CORS errors)
- [ ] API token authentication works
- [ ] Data displays correctly on public site

### 4.5 Performance & Monitoring

- [ ] Check Vercel Analytics (if enabled)
- [ ] Check PM2 resource usage: `pm2 monit`
- [ ] Check nginx access logs: `sudo tail -f /var/log/nginx/access.log`
- [ ] Verify page load times are acceptable

---

## Part 5: Documentation & Handoff

### 5.1 Document Deployment

- [ ] Note all URLs and IP addresses
- [ ] Document environment variable locations
- [ ] Create deployment procedure document
- [ ] Document rollback procedures

### 5.2 Create Deployment Script

- [ ] Copy `deploy.sh` to droplet
- [ ] Make executable: `chmod +x deploy.sh`
- [ ] Test deployment script
- [ ] Document usage

### 5.3 Security Review

- [ ] Verify all .env files are not in git
- [ ] Check firewall rules are correct
- [ ] Verify SSL certificates are valid
- [ ] Ensure database credentials are secure
- [ ] Review nginx security headers

### 5.4 Backup Setup

- [ ] Verify Supabase automatic backups enabled
- [ ] Document manual backup procedure
- [ ] Test database restore process
- [ ] Document backup locations

---

## Troubleshooting Reference

### Common Issues

**Deployment fails on Vercel:**
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Check database connectivity

**Apps won't start on DigitalOcean:**
- Check PM2 logs: `pm2 logs`
- Verify environment variables in .env files
- Check port availability
- Verify database connection

**502 Bad Gateway:**
- Check PM2 status: `pm2 status`
- Restart apps: `pm2 restart all`
- Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

**SSL certificate issues:**
- Renew certificates: `sudo certbot renew`
- Check nginx config: `sudo nginx -t`
- Verify DNS points to correct IP

**CORS errors:**
- Check Strapi CORS_ORIGINS in .env
- Verify Vercel URL is in CORS allowlist
- Check Strapi security middleware settings

---

## Cost Summary

| Service | Purpose | Monthly Cost |
|---------|---------|--------------|
| Vercel Pro | Public site | ~$20 |
| DigitalOcean Droplet | Admin + CMS | $12-24 |
| Supabase | Database | Free (or $25 for Pro) |
| **Total** | | **$32-44/month** |

---

## Success Criteria

Phase 4 is complete when:

- [x] All configuration files created
- [ ] Public site deployed to Vercel with custom domain
- [ ] Admin site deployed to DigitalOcean with SSL
- [ ] Strapi CMS deployed to DigitalOcean with SSL
- [ ] All environment variables configured
- [ ] DNS records configured correctly
- [ ] SSL certificates installed and auto-renewing
- [ ] All sites accessible via HTTPS
- [ ] Integration between public site and CMS works
- [ ] PM2 configured for auto-restart on reboot
- [ ] Nginx configured correctly
- [ ] Firewall rules in place
- [ ] Documentation complete
- [ ] Deployment script created and tested

---

## Next Steps: Phase 5

After Phase 4 is complete, Phase 5 will focus on:

1. **Core Features Implementation**
   - Booking system
   - Shop/products
   - CMS content display
   - User authentication

2. **Payment Integration**
   - PayPal integration
   - Order processing

3. **Email Notifications**
   - Mailgun setup
   - Booking confirmations
   - Order receipts

---

**Last Updated:** May 8, 2026  
**Status:** Ready for deployment  
**Next Review:** After deployment completion
