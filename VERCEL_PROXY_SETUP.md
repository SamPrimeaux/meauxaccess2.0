# ?? Setting Up MeauxMCP on meauxxx.com (Vercel)

Since `meauxxx.com` is on Vercel until 12/31/2025, we'll proxy the Cloudflare Worker through Vercel.

## Option 1: Vercel Rewrites (Recommended)

Create a `vercel.json` in your Vercel project root:

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

## Option 2: Deploy Dashboard as Static Site + Proxy API

### Step 1: Extract Dashboard HTML

The dashboard HTML is in `src/dashboard.html`. You can:
1. Deploy it as a static site on Vercel
2. Update API calls to use relative paths (they already do!)

### Step 2: Create Vercel API Routes

Create `api/proxy/[...path].ts` in your Vercel project:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

const WORKER_URL = 'https://meauxmcp.meauxbility.workers.dev';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path || '';
  
  const url = `${WORKER_URL}/${pathString}${req.url?.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
  
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers as HeadersInit,
        host: 'meauxmcp.meauxbility.workers.dev',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' 
        ? JSON.stringify(req.body) 
        : undefined,
    });
    
    const data = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(response.status).send(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
```

### Step 3: Update Dashboard API Base

Update the dashboard to use `/api/proxy/` instead of direct worker URLs.

## Option 3: Next.js API Routes (If using Next.js)

If your Vercel project is Next.js, create `pages/api/[...path].ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

const WORKER_URL = 'https://meauxmcp.meauxbility.workers.dev';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path || '';
  
  const url = `${WORKER_URL}/${pathString}`;
  
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers as HeadersInit,
        host: 'meauxmcp.meauxbility.workers.dev',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' 
        ? JSON.stringify(req.body) 
        : undefined,
    });
    
    const data = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(response.status).send(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
```

## Quick Setup Script

I can create a standalone HTML file that works on Vercel. Would you like me to:
1. Create a standalone `index.html` for Vercel deployment?
2. Set up the proxy configuration?
3. Both?

Let me know your Vercel project structure and I'll provide the exact setup!
