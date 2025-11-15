# Deployment Guide

This guide covers deploying the Halbe Henn application to production.

## Prerequisites

- Vercel account (recommended for Next.js)
- Mapbox account with access token
- Domain name (halbe-henn.at) configured

## Environment Variables

### Required Variables

Set the following environment variables in your Vercel project settings:

```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_production_mapbox_token
```

### Mapbox Token Setup

1. **Development Token**: Use a public token for local development
2. **Production Token**: Use a private token with URL restrictions:
   - Go to [Mapbox Account Settings](https://account.mapbox.com/access-tokens/)
   - Create a new token or use an existing one
   - Set URL restrictions to your production domain: `https://halbe-henn.at/*`
   - This prevents unauthorized use of your token

## Vercel Deployment

### Initial Setup

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository

2. **Configure Project**:
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `bun run build` (already configured in `vercel.json`)
   - Install Command: `bun install` (already configured)
   - Output Directory: `.next` (default)

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` with your production token
   - Select "Production", "Preview", and "Development" environments

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Custom Domain

1. **Add Domain**:
   - Go to Project Settings → Domains
   - Add `halbe-henn.at` and `www.halbe-henn.at`

2. **Configure DNS**:
   - Add the following DNS records to your domain provider:
     - Type: `A` or `CNAME`
     - Name: `@` (or root domain)
     - Value: Vercel's provided IP or CNAME
   - For `www` subdomain:
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`

3. **SSL Certificate**:
   - Vercel automatically provisions SSL certificates via Let's Encrypt
   - Wait for DNS propagation (can take up to 48 hours)

## Analytics

The application uses Umami analytics (self-hosted at `umami.faisst.io`).

- Analytics script is automatically loaded via Next.js Script component
- Configured in `app/layout.tsx`
- Rewrite rule in `next.config.ts` proxies requests to the Umami instance

## Build Verification

Before deploying, verify the production build works locally:

```bash
# Build for production
bun run build

# Test production build locally
bun run start
```

Visit `http://localhost:3000` to verify everything works.

## Post-Deployment Checklist

- [ ] Verify site loads at `https://halbe-henn.at`
- [ ] Test map loads with all markers visible
- [ ] Verify day filtering works correctly
- [ ] Test dark/light mode toggle
- [ ] Verify analytics tracking (check Umami dashboard)
- [ ] Test on mobile devices
- [ ] Verify SSL certificate is active (HTTPS)
- [ ] Check browser console for errors
- [ ] Verify all environment variables are set correctly

## Troubleshooting

### Build Failures

- Check that all environment variables are set in Vercel
- Verify `bun.lock` is committed to repository
- Check build logs in Vercel dashboard

### Map Not Loading

- Verify `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is set correctly
- Check Mapbox token has correct URL restrictions
- Verify token hasn't exceeded usage limits

### Analytics Not Working

- Verify Umami instance is accessible
- Check rewrite rule in `next.config.ts`
- Verify website ID in `app/layout.tsx` matches Umami configuration

## Continuous Deployment

Vercel automatically deploys:

- **Production**: On push to `master` or `main` branch
- **Preview**: On push to other branches or pull requests

GitHub Actions CI/CD runs tests before deployment, but Vercel will deploy regardless. Ensure all tests pass before merging to main branch.
