# DigitalOcean Deployment Guide - Admin Site + Strapi CMS

## Overview

This guide covers deploying both the **admin site** and **Strapi CMS** on a single DigitalOcean droplet.

**Architecture:**
- Single Ubuntu droplet ($12-24/month)
- Nginx as reverse proxy
- PM2 for process management
- PostgreSQL on same droplet OR use Supabase
- SSL via Let's Encrypt (certbot)

**Domains:**
- `admin.wildlifeoasis.co.uk` → Admin site (port 3001)
- `cms.wildlifeoasis.co.uk` → Strapi CMS (port 1337)

---

## Prerequisites

- DigitalOcean account
- Domain name with DNS access
- SSH client
- Git installed on local machine

---

## Part 1: Create Droplet

### 1.1 Create Droplet on DigitalOcean

1. Go to https://cloud.digitalocean.com/droplets/new
2. **Choose Image:** Ubuntu 24.04 LTS x64
3. **Droplet Size:** 
   - **Development:** Basic - $12/month (2GB RAM, 1 CPU)
   - **Production:** Basic - $24/month (4GB RAM, 2 CPUs) - Recommended
4. **Datacenter Region:** London (closest to target audience)
5. **Authentication:** SSH Key (recommended) or Password
6. **Hostname:** `lwo-production` or `lwo-uat`
7. Click **Create Droplet**

### 1.2 Note Your Droplet IP

```bash
# Example
DROPLET_IP=167.172.xxx.xxx
```

---

## Part 2: Initial Server Setup

### 2.1 Connect via SSH

```bash
ssh root@167.172.xxx.xxx
```

### 2.2 Update System

```bash
apt update && apt upgrade -y
```

### 2.3 Create Non-Root User

```bash
# Create user
adduser lwo

# Add to sudo group
usermod -aG sudo lwo

# Switch to new user
su - lwo
```

### 2.4 Install Node.js

```bash
# Install Node.js 24.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v24.x
npm --version
```

### 2.5 Install pnpm

```bash
# Install pnpm globally
sudo npm install -g pnpm

# Verify
pnpm --version  # Should show v10.x
```

### 2.6 Install PM2

```bash
# Install PM2 for process management
sudo npm install -g pm2

# Verify
pm2 --version
```

### 2.7 Install PostgreSQL (Optional - if not using Supabase)

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
```

```sql
-- In PostgreSQL prompt
CREATE DATABASE lwo_production;
CREATE USER lwo_user WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE lwo_production TO lwo_user;
\q
```

**Note:** If using Supabase for database, skip this step.

---

## Part 3: Deploy Application Code

### 3.1 Clone Repository

```bash
cd /home/lwo
git clone https://github.com/YOUR_USERNAME/lwo.git
cd lwo
```

### 3.2 Install Dependencies

```bash
pnpm install
```

### 3.3 Configure Environment Variables

#### Admin Site Environment

```bash
nano apps/admin-site/.env
```

Add:
```bash
# Database
DATABASE_URL="postgresql://postgres.PROJECT_ID:[PASSWORD]@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# NextAuth
NEXTAUTH_URL="https://admin.wildlifeoasis.co.uk"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# App Config
NEXT_PUBLIC_SITE_URL="https://admin.wildlifeoasis.co.uk"
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

#### Strapi CMS Environment

```bash
nano apps/cms/.env
```

Add:
```bash
# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS="generate,with,openssl"
API_TOKEN_SALT="generate-with-openssl"
ADMIN_JWT_SECRET="generate-with-openssl"
TRANSFER_TOKEN_SALT="generate-with-openssl"
JWT_SECRET="generate-with-openssl"

# Database (PostgreSQL)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lwo_production
DATABASE_USERNAME=lwo_user
DATABASE_PASSWORD=secure_password_here
DATABASE_SSL=false

# OR use Supabase
# DATABASE_HOST=db.zxrwiwbvnkpbsysqybmh.supabase.co
# DATABASE_PORT=5432
# DATABASE_SSL=true

# Admin
ADMIN_PATH=/admin

# Public URL
STRAPI_URL=https://cms.wildlifeoasis.co.uk

# CORS (allow Vercel public site)
CORS_ORIGINS=https://wildlifeoasis.co.uk,https://www.wildlifeoasis.co.uk
```

Generate secrets:
```bash
# Generate APP_KEYS (4 comma-separated values)
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32

# Generate other secrets
openssl rand -base64 32  # API_TOKEN_SALT
openssl rand -base64 32  # ADMIN_JWT_SECRET
openssl rand -base64 32  # TRANSFER_TOKEN_SALT
openssl rand -base64 32  # JWT_SECRET
```

### 3.4 Build Applications

```bash
# Build database package (Prisma client)
pnpm --filter=@lwo/database build

# Build admin site
pnpm --filter=admin-site build

# Build Strapi CMS
pnpm --filter=cms build
```

---

## Part 4: Configure PM2

### 4.1 Create PM2 Ecosystem File

```bash
nano ecosystem.config.js
```

Add:
```javascript
module.exports = {
  apps: [
    {
      name: 'lwo-admin',
      script: 'pnpm',
      args: '--filter=admin-site start',
      cwd: '/home/lwo/lwo',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'lwo-cms',
      script: 'pnpm',
      args: '--filter=cms start',
      cwd: '/home/lwo/lwo',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
    },
  ],
};
```

### 4.2 Start Applications with PM2

```bash
# Start both apps
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions printed (will give you a command to run with sudo)
```

### 4.3 Verify Applications Running

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs lwo-admin
pm2 logs lwo-cms

# Monitor
pm2 monit
```

---

## Part 5: Configure Nginx

### 5.1 Install Nginx

```bash
sudo apt install -y nginx
```

### 5.2 Create Admin Site Config

```bash
sudo nano /etc/nginx/sites-available/admin.wildlifeoasis.co.uk
```

Add:
```nginx
server {
    listen 80;
    server_name admin.wildlifeoasis.co.uk;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.3 Create CMS Config

```bash
sudo nano /etc/nginx/sites-available/cms.wildlifeoasis.co.uk
```

Add:
```nginx
server {
    listen 80;
    server_name cms.wildlifeoasis.co.uk;

    client_max_body_size 50M;  # Allow larger uploads for images

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.4 Enable Sites

```bash
# Create symlinks
sudo ln -s /etc/nginx/sites-available/admin.wildlifeoasis.co.uk /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/cms.wildlifeoasis.co.uk /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

---

## Part 6: Configure DNS

Add these DNS records in your domain registrar:

### Admin Site
```
Type: A
Name: admin
Value: YOUR_DROPLET_IP
TTL: 3600
```

### CMS
```
Type: A
Name: cms
Value: YOUR_DROPLET_IP
TTL: 3600
```

**Wait for DNS propagation** (5-30 minutes)

Test:
```bash
dig admin.wildlifeoasis.co.uk
dig cms.wildlifeoasis.co.uk
```

---

## Part 7: Configure SSL (Let's Encrypt)

### 7.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificates

```bash
# For admin site
sudo certbot --nginx -d admin.wildlifeoasis.co.uk

# For CMS
sudo certbot --nginx -d cms.wildlifeoasis.co.uk
```

Follow the prompts:
- Enter email address
- Agree to terms
- Choose to redirect HTTP to HTTPS (recommended: Yes)

### 7.3 Test Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job for auto-renewal
```

---

## Part 8: Firewall Configuration

### 8.1 Configure UFW

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Part 9: Verification

### 9.1 Test Admin Site

```bash
# Should see admin site
curl https://admin.wildlifeoasis.co.uk

# Or visit in browser
https://admin.wildlifeoasis.co.uk
```

### 9.2 Test Strapi CMS

```bash
# Should see Strapi welcome page
curl https://cms.wildlifeoasis.co.uk

# Or visit admin panel
https://cms.wildlifeoasis.co.uk/admin
```

### 9.3 Create Strapi Admin User

1. Visit `https://cms.wildlifeoasis.co.uk/admin`
2. Create your first admin user
3. Log in to Strapi admin panel

### 9.4 Generate Strapi API Token

1. In Strapi admin: Settings → API Tokens → Create new API Token
2. **Name:** Public Site Access
3. **Token type:** Read-only or Full access (based on needs)
4. **Token duration:** Unlimited
5. Copy the generated token
6. Add to Vercel environment variables:
   ```bash
   STRAPI_API_TOKEN=<your-generated-token>
   ```

---

## Part 10: Deployment Script (Optional)

Create a deployment script for easy updates:

```bash
nano /home/lwo/deploy.sh
```

Add:
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest code
cd /home/lwo/lwo
git pull origin main

# Install dependencies
pnpm install

# Build applications
pnpm --filter=@lwo/database build
pnpm --filter=admin-site build
pnpm --filter=cms build

# Restart PM2 processes
pm2 restart all

echo "✅ Deployment complete!"
```

Make executable:
```bash
chmod +x /home/lwo/deploy.sh
```

Run deployments:
```bash
/home/lwo/deploy.sh
```

---

## Monitoring & Maintenance

### Check Application Status

```bash
# PM2 status
pm2 status

# View logs
pm2 logs lwo-admin --lines 100
pm2 logs lwo-cms --lines 100

# Monitor resources
pm2 monit
```

### Check Nginx Status

```bash
# Status
sudo systemctl status nginx

# Logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Check SSL Certificate Expiry

```bash
sudo certbot certificates
```

### Database Backups (if using local PostgreSQL)

```bash
# Create backup
sudo -u postgres pg_dump lwo_production > backup_$(date +%Y%m%d).sql

# Restore backup
sudo -u postgres psql lwo_production < backup_20260506.sql
```

---

## Troubleshooting

### Apps Won't Start

**Check PM2 logs:**
```bash
pm2 logs lwo-admin
pm2 logs lwo-cms
```

**Common issues:**
- Missing environment variables
- Port already in use
- Build failed

### 502 Bad Gateway

**Cause:** Application not running

**Solution:**
```bash
pm2 restart all
```

### Database Connection Errors

**Check connection string:**
- Verify DATABASE_URL in .env files
- Test connection:
  ```bash
  psql -h localhost -U lwo_user -d lwo_production
  ```

### SSL Certificate Issues

**Renew manually:**
```bash
sudo certbot renew
```

**Check nginx config:**
```bash
sudo nginx -t
```

---

## Cost Estimate

**DigitalOcean Droplet:**
- Development: $12/month (2GB RAM)
- Production: $24/month (4GB RAM) - Recommended

**Total Hosting Cost:**
- Vercel Pro (public site): ~$20/month
- DigitalOcean (admin + CMS): ~$24/month
- **Total: ~$44/month**

---

## Security Best Practices

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Disable root SSH login:**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   sudo systemctl restart sshd
   ```

3. **Use SSH keys (not passwords)**

4. **Regular backups:**
   - Database backups
   - .env files (stored securely, not in git)

5. **Monitor logs regularly:**
   ```bash
   pm2 logs
   ```

---

## Next Steps

After deployment:

1. Update Vercel env var `NEXT_PUBLIC_STRAPI_URL=https://cms.wildlifeoasis.co.uk`
2. Add Strapi API token to Vercel
3. Test public site → CMS connection
4. Set up monitoring/alerting (optional: DigitalOcean Monitoring)
5. Schedule regular backups

---

**Last Updated:** May 2026  
**Related:** See `.notes/setup/vercel-deployment.md` for public site deployment
