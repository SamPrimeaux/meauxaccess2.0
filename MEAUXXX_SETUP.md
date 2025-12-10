# ?? Setting Up MeauxMCP on meauxxx.com (Vercel)

Since `meauxxx.com` is on Vercel until 12/31/2025, here's how to proxy the Cloudflare Worker.

## ? Solution: Vercel Rewrites

The easiest approach is to use Vercel's rewrite feature to proxy all requests to your Cloudflare Worker.

### Step 1: Add `vercel.json` to Your Vercel Project

Create or update `vercel.json` in your Vercel project root:

```json
{
  "rewrites": [
    {
      "source": "/mcp/:path*",
      "destination": "https://meauxmcp.meauxbility.workers.dev/mcp/:path*"
    },
    {
      "source": "/api/:path*",
      "destination": "https://meauxmcp.meauxbility.workers.dev/api/:path*"
    },
    {
      "source": "/iaccess",
      "destination": "https://meauxmcp.meauxbility.workers.dev/iaccess"
    },
    {
      "source": "/health",
      "destination": "https://meauxmcp.meauxbility.workers.dev/health"
    },
    {
      "source": "/",
      "destination": "https://meauxmcp.meauxbility.workers.dev/"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### Step 2: Deploy to Vercel

1. Push this `vercel.json` to your Vercel project
2. Vercel will automatically redeploy
3. Visit `https://meauxxx.com` - it will proxy to the Cloudflare Worker!

## ?? What This Does

- ? `meauxxx.com/` ? Shows the MeauxMCP dashboard
- ? `meauxxx.com/mcp/*` ? Proxies MCP API calls
- ? `meauxxx.com/api/*` ? Proxies team/SSH APIs
- ? `meauxxx.com/iaccess` ? Shows iAccess page
- ? All CORS headers configured

## ?? Alternative: Custom Domain on Cloudflare Worker

If you want to use a custom domain directly on the Worker (without Vercel):

1. Go to Cloudflare Dashboard ? Workers & Pages ? meauxmcp
2. Settings ? Triggers ? Custom Domains
3. Add `meauxxx.com` (requires DNS access)

But since you can't transfer until 12/31/2025, the Vercel proxy is the best solution!

## ?? Next Steps

1. Add `vercel.json` to your Vercel project
2. Deploy
3. Test at `https://meauxxx.com`
4. After 12/31/2025, you can switch to direct Cloudflare custom domain

The dashboard will work identically whether accessed via:
- `https://meauxmcp.meauxbility.workers.dev` (direct)
- `https://meauxxx.com` (via Vercel proxy)
