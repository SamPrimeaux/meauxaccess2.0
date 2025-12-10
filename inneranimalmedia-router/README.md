# Inner Animal Media Router

Router worker that:
- Serves **inner-animal-media.pages.dev** content at root (`inneranimalmedia.com/`)
- Serves **iAccess dashboard** at `/dashboard` and related routes
- Handles all API endpoints at `/api/*`

## ?? Deployment

### Step 1: Deploy Worker

```bash
cd inneranimalmedia-router
wrangler deploy --env=production
```

### Step 2: Configure Routes

Go to Cloudflare Dashboard:
https://dash.cloudflare.com/ede6590ac0d2fb7daf155b35653457b2/workers/routes

Add routes:
- `inneranimalmedia.com/*` ? `inneranimalmedia-router`
- `www.inneranimalmedia.com/*` ? `inneranimalmedia-router`

### Step 3: Verify

- Root: https://inneranimalmedia.com/ (should show Pages.dev site)
- Dashboard: https://inneranimalmedia.com/dashboard (should show iAccess dashboard)
- API: https://inneranimalmedia.com/api/health (should return JSON)

## ?? Routes

| Path | Destination |
|------|-------------|
| `/` | inner-animal-media.pages.dev (proxied) |
| `/dashboard` | iAccess dashboard (from R2) |
| `/analytics` | Dashboard analytics page |
| `/api/*` | API endpoints |
| All other paths | Proxied to Pages.dev |

## ?? Configuration

- **R2 Bucket**: `iaccess` (for dashboard files)
- **Pages.dev Origin**: `https://inner-animal-media.pages.dev`
- **Account ID**: `ede6590ac0d2fb7daf155b35653457b2`
- **Zone ID**: `0bab48636c1be4ea61c0c7787c3e`

## ?? Notes

- Dashboard pages support dark/light themes via user settings
- All API endpoints are preserved
- CORS headers are added to all responses
- Pages.dev content is proxied with proper headers
