# ?? Inner Animal Media Router - Deployment Guide

## ? What This Does

This worker routes requests for `inneranimalmedia.com`:
- **Root (`/`)** ? Proxies content from `inner-animal-media.pages.dev`
- **Dashboard (`/dashboard`)** ? Serves iAccess dashboard from R2
- **API (`/api/*`)** ? Proxies to `iaccess-api` worker or handles directly

## ?? Prerequisites

- ? Worker deployed: `inneranimalmedia-router-production`
- ? R2 bucket: `iaccess` (contains dashboard files)
- ? Pages.dev site: `inner-animal-media.pages.dev` (live)

## ?? Step 1: Update Routes in Cloudflare Dashboard

### Option A: Via Workers Routes (Recommended)

1. Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/routes

2. **Remove old routes** (if any):
   - `inneranimalmedia.com/*` ? `iacess` (remove this)
   - `www.inneranimalmedia.com/*` ? `iacess` (remove this)

3. **Add new routes**:
   - Click **"Add route"**
   - **Route**: `inneranimalmedia.com/*`
   - **Worker**: `inneranimalmedia-router-production`
   - Click **"Add route"**
   
   - Click **"Add route"** again
   - **Route**: `www.inneranimalmedia.com/*`
   - **Worker**: `inneranimalmedia-router-production`
   - Click **"Add route"**

### Option B: Via Custom Domain (Alternative)

1. Go to: https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/services/view/inneranimalmedia-router-production

2. Click **"Triggers"** tab

3. Click **"Add Custom Domain"**

4. Enter: `inneranimalmedia.com`

5. Click **"Add Custom Domain"**

6. Repeat for `www.inneranimalmedia.com`

## ? Step 2: Verify Deployment

### Test Root (Pages.dev)
```bash
curl -I https://inneranimalmedia.com/
# Should return: HTTP/2 200
# Should show Pages.dev content
```

### Test Dashboard
```bash
curl -I https://inneranimalmedia.com/dashboard
# Should return: HTTP/2 200
# Should show iAccess dashboard
```

### Test API
```bash
curl https://inneranimalmedia.com/api/health
# Should return: {"status":"ok","service":"inneranimalmedia-router",...}
```

## ?? Route Mapping

| Path | Destination | Source |
|------|-------------|--------|
| `/` | Inner Animal Media site | `inner-animal-media.pages.dev` (proxied) |
| `/dashboard` | iAccess Dashboard | R2 bucket `iaccess` |
| `/analytics` | Dashboard Analytics | R2 bucket `iaccess` |
| `/workers` | Dashboard Workers | R2 bucket `iaccess` |
| `/api/*` | API Endpoints | `iaccess-api` worker (proxied) |

## ?? Dashboard Pages Available

All these routes serve from R2:
- `/dashboard` - Main dashboard
- `/analytics` - Analytics page
- `/ai-gateway` - AI Gateway
- `/browser-rendering` - Browser Rendering
- `/workers` - Workers management
- `/databases` - D1 Databases
- `/storage` - R2 Storage
- `/kv` - KV Namespaces
- `/vectorize` - Vectorize
- `/workflows` - Workflows
- `/queues` - Queues
- `/email` - Email Routing
- `/integrations` - Integrations
- `/settings` - Settings
- `/photogallery` - Photo Gallery

## ?? API Endpoints

The router proxies API requests to `iaccess-api.meauxbility.workers.dev`:

- `/api/health` - Health check (handled directly)
- `/api/theme` - Theme preference (handled directly)
- `/api/stats` - Dashboard stats (proxied)
- `/api/workers` - Workers list (proxied)
- `/api/databases` - Databases (proxied)
- All other `/api/*` routes are proxied

## ?? Troubleshooting

### Root shows 404 or wrong content
- Check that Pages.dev site is live: https://inner-animal-media.pages.dev
- Verify proxy is working in worker logs
- Check route configuration

### Dashboard shows 404
- Verify R2 bucket `iaccess` exists
- Check that `index.html` exists in R2 bucket
- Verify R2 binding in `wrangler.toml`

### API endpoints not working
- Check if `iaccess-api` worker is deployed
- Verify API worker URL is correct
- Check worker logs for errors

### Routes not updating
- Wait 1-2 minutes for DNS propagation
- Clear browser cache
- Try incognito/private mode

## ?? Configuration Files

- **Worker**: `inneranimalmedia-router-production`
- **R2 Bucket**: `iaccess`
- **Pages.dev**: `inner-animal-media.pages.dev`
- **API Worker**: `iaccess-api.meauxbility.workers.dev`
- **Account ID**: `ede6590ac0d2fb7daf155b35653457b2`
- **Zone ID**: `0bab48636c1be4ea61c0c7787c3e`

## ? Verification Checklist

- [ ] Routes added in Cloudflare Dashboard
- [ ] Root (`/`) shows Pages.dev content
- [ ] Dashboard (`/dashboard`) shows iAccess dashboard
- [ ] API (`/api/health`) returns JSON
- [ ] Theme API (`/api/theme`) works
- [ ] All dashboard pages accessible
- [ ] No 404 errors
- [ ] SSL certificate active (automatic)

## ?? Success!

Once verified, your site is live:
- **Main Site**: https://inneranimalmedia.com/
- **Dashboard**: https://inneranimalmedia.com/dashboard
- **API**: https://inneranimalmedia.com/api/health

---

**Need Help?** Check worker logs in Cloudflare Dashboard or contact sam@inneranimalmedia.com
