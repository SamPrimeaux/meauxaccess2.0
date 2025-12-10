# ? MeauxMCP Setup for meauxxx.com - Complete Guide

## ?? Solution: Vercel Proxy

Since `meauxxx.com` is on Vercel until 12/31/2025, we'll proxy the Cloudflare Worker through Vercel using rewrites.

## ?? Step-by-Step Setup

### Option A: Update Existing Vercel Project (Recommended)

If you already have a Vercel project for `meauxxx.com`:

1. **Find your Vercel project directory** (likely `meaux-access-deploy` or similar)

2. **Update `vercel.json`** - Use the merged version I created:
   - File: `vercel-merged.json` in this directory
   - Copy its contents to your existing `vercel.json`
   - OR manually add the rewrites section (see below)

3. **Deploy:**
   ```bash
   cd /path/to/your/vercel/project
   vercel --prod
   ```

### Option B: Standalone Proxy Project

If you want a separate Vercel project just for MeauxMCP:

1. **Create new Vercel project:**
   ```bash
   mkdir meauxxx-mcp-proxy
   cd meauxxx-mcp-proxy
   ```

2. **Add `vercel.json`** (use the simple version from this directory)

3. **Deploy:**
   ```bash
   vercel --prod
   vercel domains add meauxxx.com
   ```

## ?? Manual Configuration

If you prefer to update your existing `vercel.json` manually, add these rewrites **before** your existing `/api/:path*` rewrite:

```json
{
  "rewrites": [
    {
      "source": "/mcp/:path*",
      "destination": "https://meauxmcp.meauxbility.workers.dev/mcp/:path*"
    },
    {
      "source": "/api/team/:path*",
      "destination": "https://meauxmcp.meauxbility.workers.dev/api/team/:path*"
    },
    {
      "source": "/api/ssh/:path*",
      "destination": "https://meauxmcp.meauxbility.workers.dev/api/ssh/:path*"
    },
    {
      "source": "/api/file/:path*",
      "destination": "https://meauxmcp.meauxbility.workers.dev/api/file/:path*"
    },
    {
      "source": "/iaccess",
      "destination": "https://meauxmcp.meauxbility.workers.dev/iaccess"
    },
    {
      "source": "/dashboard",
      "destination": "https://meauxmcp.meauxbility.workers.dev/"
    },
    {
      "source": "/",
      "destination": "https://meauxmcp.meauxbility.workers.dev/"
    },
    // ... your existing rewrites here
  ]
}
```

**Important:** Put the MeauxMCP rewrites **before** your existing `/api/:path*` rewrite so they match first!

## ? What Works After Setup

Once deployed, these URLs will work on `meauxxx.com`:

- ? `https://meauxxx.com/` ? MeauxMCP Dashboard
- ? `https://meauxxx.com/dashboard` ? MeauxMCP Dashboard  
- ? `https://meauxxx.com/mcp` ? MCP API endpoint
- ? `https://meauxxx.com/api/team/members` ? Team API
- ? `https://meauxxx.com/api/ssh/connections` ? SSH API
- ? `https://meauxxx.com/iaccess` ? iAccess page
- ? `https://meauxxx.com/health` ? Health check

## ?? Why This Works

The dashboard HTML already uses **relative paths**:
- `const API_BASE = '/mcp';` 
- `fetch('/api/team/members')`
- `fetch('/api/ssh/execute')`

So when accessed via `meauxxx.com`, these automatically go through Vercel's proxy to the Cloudflare Worker!

## ?? After 12/31/2025

When you can fully transfer to Cloudflare:

1. **Option 1:** Add custom domain to Worker
   - Cloudflare Dashboard ? Workers ? meauxmcp ? Settings ? Custom Domains
   - Add `meauxxx.com`
   - Remove Vercel proxy

2. **Option 2:** Keep Vercel proxy (works great!)

## ?? Testing

After deployment, test:

```bash
# Dashboard
curl https://meauxxx.com/

# MCP API
curl -X POST https://meauxxx.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Team API
curl https://meauxxx.com/api/team/members
```

## ?? Files Created

- ? `vercel.json` - Simple proxy config
- ? `vercel-merged.json` - Combined with your existing config
- ? `MEAUXXX_SETUP_COMPLETE.md` - This guide

Choose the approach that works best for your setup!
