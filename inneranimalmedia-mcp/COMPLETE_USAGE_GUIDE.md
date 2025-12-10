# ?? MCP Dashboard - Complete Step-by-Step Usage Guide

## ?? Your Dashboard is LIVE!

**URL**: https://mcp.inneranimalmedia.com/

---

## ?? Table of Contents

1. [Quick Start](#quick-start)
2. [Dashboard Pages](#dashboard-pages)
3. [Using MCP with Claude](#using-mcp-with-claude)
4. [Step-by-Step Examples](#step-by-step-examples)
5. [API Reference](#api-reference)
6. [Troubleshooting](#troubleshooting)

---

## ?? Quick Start

### Step 1: Access the Dashboard

1. Open your browser
2. Go to: **https://mcp.inneranimalmedia.com/**
3. You'll see the beautiful MeauxStack dashboard!

**What you'll see:**
- Premium glass-morphism UI
- Sidebar navigation
- Stats cards (zones, workers, requests)
- Quick start guide
- Available MCP tools list

---

## ?? Dashboard Pages

### Homepage (`/`)

**What it shows:**
- Overview statistics
- Quick start guide
- Available MCP tools
- Platform status

**How to use:**
1. View your total zones, workers, and API requests
2. Read the quick start guide
3. Browse available MCP tools
4. Click navigation items to explore

---

### Projects Page (`/projects`)

**What it shows:**
- All your active projects
- Project status (Live, In Progress)
- Last updated timestamps
- Project metadata

**How to use:**
1. Click "Projects" in the sidebar
2. View all your projects in cards
3. Click any project card to see details
4. Use tabs to filter by type:
   - All Projects
   - Websites
   - Workers
   - Automations

**Example Projects:**
- Meauxbility.org (Live)
- InnerAnimalMedia.com (In Progress)
- iAutodidact.org (In Progress)

---

### Analytics Page (`/analytics`)

**What it shows:**
- Total requests
- Average response time
- Monthly costs
- AI API calls
- Service distribution
- Cost breakdown

**How to use:**
1. Click "Analytics" in the sidebar
2. Select time range (24h, 7d, 30d, 90d)
3. View performance metrics
4. Analyze cost breakdown
5. Monitor service distribution

**Key Metrics:**
- **Total Requests**: 8.4M (last 30 days)
- **Avg Response Time**: 47ms
- **Monthly Costs**: $847
- **AI API Calls**: 142K

---

### Zones Page (`/zones`)

**What it shows:**
- All your Cloudflare zones
- Zone status (active, pending)
- Plan type (free, pro, business)
- Zone IDs

**How to use:**
1. Click "Zones" in the sidebar
2. View all zones in cards
3. Click a zone to see details
4. Filter by status or plan type

**Features:**
- Real-time zone list from Cloudflare API
- Status indicators
- Quick access to zone details

---

### Workers Page (`/workers`)

**What it shows:**
- All deployed workers
- Worker status
- Creation dates
- Worker details

**How to use:**
1. Click "Workers" in the sidebar
2. View all workers in cards
3. Click a worker to see details
4. Filter by status or type

**Features:**
- Real-time worker list from Cloudflare API
- Status indicators
- Deployment information

---

### Settings Page (`/settings`)

**What it shows:**
- Platform configuration
- Secrets status
- MCP endpoint URL
- Claude Desktop setup instructions

**How to use:**
1. Click "Settings" in the sidebar
2. View your account configuration
3. Check secrets status (all should show "Configured")
4. Copy MCP endpoint URL
5. Copy Claude Desktop config

**Key Information:**
- **Account ID**: Your Cloudflare account ID
- **Primary Zone**: inneranimalmedia.com
- **GitHub Token**: ? Configured
- **Cloudflare API Token**: ? Configured
- **MCP Endpoint**: https://mcp.inneranimalmedia.com/mcp

---

### API Docs Page (`/api-docs`)

**What it shows:**
- Complete MCP tools documentation
- Tool descriptions
- Parameters for each tool
- Example usage with Claude

**How to use:**
1. Click "API Docs" in the sidebar
2. Browse all available tools
3. Read tool descriptions
4. See example commands
5. Copy usage examples

**Available Tools:**
1. `list_all_zones` - List all zones
2. `deploy_worker_to_zone` - Deploy workers
3. `deploy_static_files` - Upload to R2
4. `list_all_workers` - List workers
5. `get_zone_analytics` - Get analytics
6. `create_zone_route` - Create routes
7. `list_zone_routes` - List routes
8. `get_zone_info` - Zone details

---

## ?? Using MCP with Claude

### Step 1: Install Claude Desktop

1. Download Claude Desktop from: https://claude.ai/download
2. Install and open Claude Desktop

### Step 2: Configure MCP Server

1. **Find your config file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

2. **Open the file** in a text editor

3. **Add this configuration:**

```json
{
  "mcpServers": {
    "inneranimalmedia": {
      "url": "https://mcp.inneranimalmedia.com/mcp",
      "transport": "sse"
    }
  }
}
```

4. **Save the file**

5. **Restart Claude Desktop**

### Step 3: Verify Connection

1. Open Claude Desktop
2. Start a new conversation
3. Ask: "What MCP tools are available?"
4. Claude should list all 8 tools from your server

---

## ?? Step-by-Step Examples

### Example 1: List All Zones

**In Claude Desktop, type:**
```
"List all my Cloudflare zones"
```

**What happens:**
1. Claude uses the `list_all_zones` MCP tool
2. Fetches zones from Cloudflare API
3. Displays them in a formatted list

**Expected response:**
```
Here are all your Cloudflare zones:

1. inneranimalmedia.com
   - Status: Active
   - Plan: Pro
   - Zone ID: 0bab48636c1bea4be4ea61c0c7787c3e

2. [other zones...]
```

---

### Example 2: Deploy a Worker

**In Claude Desktop, type:**
```
"Deploy a worker named 'test-api' to inneranimalmedia.com with this code:

export default {
  async fetch(request) {
    return new Response('Hello from MCP!', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
```

**What happens:**
1. Claude uses the `deploy_worker_to_zone` tool
2. Finds the zone ID for inneranimalmedia.com
3. Deploys the worker via Cloudflare API
4. Confirms deployment success

**Expected response:**
```
? Worker 'test-api' deployed successfully to inneranimalmedia.com!

The worker is now live and ready to use.
```

---

### Example 3: Get Analytics

**In Claude Desktop, type:**
```
"Show me analytics for inneranimalmedia.com for the last 7 days"
```

**What happens:**
1. Claude uses the `get_zone_analytics` tool
2. Fetches analytics from Cloudflare
3. Displays metrics in a readable format

**Expected response:**
```
Analytics for inneranimalmedia.com (last 7 days):

?? Total Requests: 1,234,567
? Avg Response Time: 45ms
?? Bandwidth: 12.5 GB
? Errors: 0.01%
```

---

### Example 4: List All Workers

**In Claude Desktop, type:**
```
"Show me all my deployed workers"
```

**What happens:**
1. Claude uses the `list_all_workers` tool
2. Fetches all workers from Cloudflare
3. Lists them with details

**Expected response:**
```
Here are all your deployed workers:

1. inneranimalmedia-mcp-production
   - Status: Active
   - Created: 2024-12-09

2. inneranimalmedia-production
   - Status: Active
   - Created: 2024-12-09

[more workers...]
```

---

### Example 5: Create a Route

**In Claude Desktop, type:**
```
"Create a route for my-worker on inneranimalmedia.com/api/*"
```

**What happens:**
1. Claude uses the `create_zone_route` tool
2. Finds the zone ID
3. Creates the route via Cloudflare API
4. Confirms route creation

**Expected response:**
```
? Route created successfully!

Pattern: inneranimalmedia.com/api/*
Worker: my-worker
Status: Active
```

---

## ?? API Reference

### Health Check

```bash
GET https://mcp.inneranimalmedia.com/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "inneranimalmedia-mcp",
  "version": "1.0.0",
  "zone": "inneranimalmedia.com"
}
```

---

### MCP JSON-RPC Endpoint

```bash
POST https://mcp.inneranimalmedia.com/mcp
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "list_all_zones",
        "description": "List all zones...",
        ...
      }
    ]
  }
}
```

---

### Dashboard API Endpoints

#### Get Stats
```bash
GET https://mcp.inneranimalmedia.com/api/stats
```

**Response:**
```json
{
  "zones": 5,
  "workers": 12,
  "requests": 0
}
```

#### Get Zones
```bash
GET https://mcp.inneranimalmedia.com/api/zones
```

**Response:**
```json
{
  "zones": [
    {
      "zoneId": "...",
      "zoneName": "inneranimalmedia.com",
      "plan": "pro",
      "status": "active"
    }
  ]
}
```

#### Get Workers
```bash
GET https://mcp.inneranimalmedia.com/api/workers
```

**Response:**
```json
{
  "workers": [
    {
      "id": "inneranimalmedia-mcp-production",
      "created_on": "2024-12-09T..."
    }
  ]
}
```

---

## ?? Common Tasks

### Task 1: View Your Infrastructure

**Via Dashboard:**
1. Go to https://mcp.inneranimalmedia.com/
2. Click "Zones" to see all zones
3. Click "Workers" to see all workers
4. Click "Analytics" to see metrics

**Via Claude:**
```
"Show me all my zones and workers"
```

---

### Task 2: Deploy a New Worker

**Via Dashboard:**
1. Go to Projects page
2. Click "New Project"
3. Fill in worker details
4. Deploy

**Via Claude:**
```
"Deploy a worker called 'my-api' to inneranimalmedia.com with this code: [paste code]"
```

---

### Task 3: Monitor Performance

**Via Dashboard:**
1. Go to Analytics page
2. Select time range
3. View metrics and charts

**Via Claude:**
```
"Show me analytics for inneranimalmedia.com for the last 30 days"
```

---

### Task 4: Manage Routes

**Via Dashboard:**
1. Go to Zones page
2. Click a zone
3. View routes
4. Add new routes

**Via Claude:**
```
"List all routes for inneranimalmedia.com"
"Create a route for my-worker on inneranimalmedia.com/api/*"
```

---

## ?? Troubleshooting

### Problem: Dashboard shows "Loading..." forever

**Solution:**
1. Check browser console (F12) for errors
2. Verify API endpoints are accessible:
   ```bash
   curl https://mcp.inneranimalmedia.com/api/stats
   ```
3. Check worker logs:
   ```bash
   wrangler tail inneranimalmedia-mcp-production --env=production
   ```

---

### Problem: Claude can't connect to MCP server

**Solution:**
1. Verify MCP endpoint is accessible:
   ```bash
   curl -X POST https://mcp.inneranimalmedia.com/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
   ```
2. Check Claude Desktop config file syntax (must be valid JSON)
3. Restart Claude Desktop
4. Check Claude Desktop logs for errors

---

### Problem: MCP tools return errors

**Solution:**
1. Verify secrets are configured:
   ```bash
   wrangler secret list --env=production
   ```
2. Check if Cloudflare API token has correct permissions
3. Verify zone IDs are correct
4. Check worker logs for detailed error messages

---

### Problem: Can't see zones or workers

**Solution:**
1. Verify Cloudflare API token has read permissions
2. Check account ID is correct
3. Ensure zones exist in your account
4. Try refreshing the page

---

## ?? Mobile Usage

The dashboard is fully responsive! 

**On Mobile:**
- Sidebar collapses to bottom navigation
- Cards stack vertically
- Touch-optimized buttons
- Full functionality maintained

**Try it:**
1. Open https://mcp.inneranimalmedia.com/ on your phone
2. Navigate using bottom tabs
3. All features work the same!

---

## ?? UI Features

### Design System
- **Colors**: Sky blue (#0EA5E9) + Teal (#14B8A6)
- **Typography**: DM Sans (headings) + JetBrains Mono (code)
- **Effects**: Glass-morphism, smooth animations
- **Layout**: Responsive grid system

### Interactive Elements
- **Hover effects** on all clickable items
- **Smooth transitions** for state changes
- **Loading states** for async operations
- **Error handling** with user-friendly messages

---

## ?? Security

### Secrets Management
- All secrets stored securely in Cloudflare Workers
- Never exposed in client-side code
- Encrypted at rest
- Access controlled via Cloudflare dashboard

### API Security
- CORS headers configured
- Optional MCP auth token
- Rate limiting (via Cloudflare)
- DDoS protection (automatic)

---

## ?? Additional Resources

### Documentation
- **This Guide**: Complete usage instructions
- **API Docs**: `/api-docs` page in dashboard
- **Cloudflare Docs**: https://developers.cloudflare.com/
- **MCP Protocol**: https://modelcontextprotocol.io/

### Support
- **Email**: sam@inneranimalmedia.com
- **Dashboard**: https://mcp.inneranimalmedia.com/
- **Health Check**: https://mcp.inneranimalmedia.com/health

---

## ?? Quick Reference

### Dashboard URLs
- Home: https://mcp.inneranimalmedia.com/
- Projects: https://mcp.inneranimalmedia.com/projects
- Analytics: https://mcp.inneranimalmedia.com/analytics
- Zones: https://mcp.inneranimalmedia.com/zones
- Workers: https://mcp.inneranimalmedia.com/workers
- Settings: https://mcp.inneranimalmedia.com/settings
- API Docs: https://mcp.inneranimalmedia.com/api-docs

### MCP Endpoints
- Health: https://mcp.inneranimalmedia.com/health
- MCP API: https://mcp.inneranimalmedia.com/mcp

### Common Claude Commands
- "List all my zones"
- "Deploy worker X to zone Y"
- "Show analytics for zone Z"
- "List all workers"
- "Create route for worker W"

---

## ? Checklist

Use this checklist to verify everything is working:

- [ ] Dashboard loads at https://mcp.inneranimalmedia.com/
- [ ] All pages are accessible (Projects, Analytics, Zones, Workers, Settings)
- [ ] Stats cards show data (or "Loading..." if API fails)
- [ ] Health check returns JSON: `{"status":"ok",...}`
- [ ] MCP endpoint responds to JSON-RPC requests
- [ ] Claude Desktop config file created
- [ ] Claude Desktop restarted after config
- [ ] Claude can list MCP tools
- [ ] Claude can use MCP tools (test with "list all zones")
- [ ] Secrets are configured (check Settings page)

---

## ?? You're All Set!

Your MCP dashboard is fully operational with:
- ? Beautiful UI on all pages
- ? All secrets configured
- ? MCP API working
- ? Dashboard API endpoints
- ? Complete documentation

**Start using it now:**
1. Visit https://mcp.inneranimalmedia.com/
2. Explore all the pages
3. Connect Claude Desktop
4. Start managing your infrastructure!

---

**Questions?** Check the troubleshooting section or email sam@inneranimalmedia.com

**Happy deploying!** ??
