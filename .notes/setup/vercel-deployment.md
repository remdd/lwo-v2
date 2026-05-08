# Vercel Deployment Guide - Public Site

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub repository connected to Vercel
- Supabase DATABASE_URL from Phase 3

## Step 1: Create Vercel Project

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the **public-site** app as the root directory
4. Framework preset should auto-detect as **Next.js**

### Project Settings

- **Framework Preset:** Next.js
- **Root Directory:** `apps/public-site`
- **Build Command:** `pnpm turbo run build --filter=public-site`
- **Install Command:** `pnpm install`
- **Output Directory:** `.next`
- **Node Version:** 24.x

## Step 2: Configure Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

### Database

```bash
DATABASE_URL=postgresql://postgres.PROJECT_ID:[PASSWORD]@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Source:** From your Supabase project (Phase 3 setup)

### Strapi CMS

```bash
NEXT_PUBLIC_STRAPI_URL=https://cms.wildlifeoasis.co.uk
STRAPI_API_TOKEN=<generate-after-strapi-deployment>
```

**Note:** Set STRAPI_URL after deploying Strapi (Step 3 of Phase 4)

### PayPal (Start with Sandbox)

```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-sandbox-client-id>
PAYPAL_CLIENT_SECRET=<your-sandbox-secret>
PAYPAL_MODE=sandbox
```

**To Get Sandbox Credentials:**
1. Go to https://developer.paypal.com
2. Create a sandbox app
3. Copy Client ID and Secret

### Email (Mailgun)

```bash
MAILGUN_API_KEY=<your-api-key>
MAILGUN_DOMAIN=<your-domain>.mailgun.org
MAILGUN_FROM_EMAIL=noreply@wildlifeoasis.co.uk
```

**To Get Mailgun Credentials:**
1. Sign up at https://www.mailgun.com (free tier available)
2. Verify your domain or use sandbox domain
3. Get API key from Settings → API Keys

### Analytics (Optional)

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**To Get GA4 ID:**
1. Create property in Google Analytics 4
2. Copy Measurement ID from Admin → Data Streams

### Site URL

```bash
NEXT_PUBLIC_SITE_URL=https://wildlifeoasis.co.uk
```

**Note:** Update this to your actual domain after configuring custom domain

## Step 3: Deploy

### Initial Deployment

1. Vercel will automatically deploy on first import
2. You'll get a preview URL like `https://lwo-public-xxx.vercel.app`
3. Check deployment logs for any errors

### Subsequent Deployments

- **Automatic:** Every push to `main` branch triggers production deployment
- **Preview:** Pull requests get preview deployments automatically

## Step 4: Configure Custom Domain

### Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your domain: `wildlifeoasis.co.uk`
3. Also add `www.wildlifeoasis.co.uk` (will redirect to apex)

### Update DNS Records

Add these records in your domain registrar:

**For apex domain (wildlifeoasis.co.uk):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Verification:** Vercel provides exact DNS instructions in the domain configuration

### SSL Certificate

- Vercel automatically provisions SSL certificates (Let's Encrypt)
- Usually takes 5-10 minutes after DNS propagates
- No manual configuration needed

## Step 5: Verify Deployment

### Check Deployment Status

```bash
# Visit your deployment URL
https://wildlifeoasis.co.uk

# Check health
curl https://wildlifeoasis.co.uk
```

### Verify Environment Variables

1. Check Vercel deployment logs for any missing env vars
2. Test database connectivity (should work with Supabase)
3. Verify Strapi CMS connection (after CMS is deployed)

### Test Core Functionality

- [ ] Homepage loads
- [ ] Database queries work (experiences list, etc.)
- [ ] Static pages render correctly
- [ ] Images load from CDN
- [ ] No console errors in browser

## Troubleshooting

### Build Fails

**Error:** `Module not found` or dependency issues

**Solution:**
- Ensure `pnpm-lock.yaml` is committed
- Check that all dependencies are in root `package.json`
- Verify turbo.json configuration

**Error:** `DATABASE_URL is not defined`

**Solution:**
- Add environment variables in Vercel dashboard
- Ensure they're set for Production environment
- Redeploy after adding env vars

### Runtime Errors

**Error:** `Cannot connect to database`

**Solution:**
- Verify DATABASE_URL includes `?pgbouncer=true`
- Check Supabase project is not paused
- Verify connection string format

**Error:** `CORS error accessing Strapi`

**Solution:**
- Add Vercel URL to Strapi CORS allowlist
- Update NEXT_PUBLIC_STRAPI_URL to correct CMS URL
- Check Strapi API token is valid

### Performance Issues

**Slow page loads:**
- Enable Vercel Analytics to identify bottlenecks
- Check database query performance
- Verify images are optimized (Next.js Image component)

**ISR not working:**
- Check revalidate times in page components
- Verify Vercel deployment region (should be lhr1 - London)

## Monitoring

### Vercel Analytics

Enable in Project Settings → Analytics (included in Pro plan)

### Error Tracking

Recommended to add Sentry or similar:

```bash
pnpm add @sentry/nextjs --filter=public-site
```

### Logs

- View real-time logs in Vercel Dashboard → Deployments → [Deployment] → Logs
- Check for runtime errors and warnings

## Cost Estimate

**Vercel Pro:** ~$20/month
- 1TB bandwidth included
- 100 deployments/day
- Analytics included
- SSL certificates included

**Expected usage for small zoo website:**
- Bandwidth: ~50-200GB/month (well within limit)
- Deployments: ~10-30/month (within limit)

## Rollback Procedure

If deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "⋯" → Promote to Production
4. Previous version is live immediately

## Next Steps

After public site is deployed:

1. Deploy admin site + Strapi to DigitalOcean
2. Update NEXT_PUBLIC_STRAPI_URL in Vercel
3. Configure CORS in Strapi for Vercel domain
4. Test end-to-end CMS → Public Site flow

## Environment Variables Checklist

Copy this checklist for setting up env vars:

- [ ] DATABASE_URL
- [ ] NEXT_PUBLIC_STRAPI_URL
- [ ] STRAPI_API_TOKEN
- [ ] NEXT_PUBLIC_PAYPAL_CLIENT_ID
- [ ] PAYPAL_CLIENT_SECRET
- [ ] PAYPAL_MODE
- [ ] MAILGUN_API_KEY
- [ ] MAILGUN_DOMAIN
- [ ] MAILGUN_FROM_EMAIL
- [ ] NEXT_PUBLIC_GA_MEASUREMENT_ID (optional)
- [ ] NEXT_PUBLIC_SITE_URL

---

**Last Updated:** May 2026  
**Related:** See `.notes/setup/digitalocean-deployment.md` for admin + CMS deployment
