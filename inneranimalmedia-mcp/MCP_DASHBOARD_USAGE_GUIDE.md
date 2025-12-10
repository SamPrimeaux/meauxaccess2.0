# ?? MCP Dashboard - Complete Usage Guide

## ?? Table of Contents
1. [Quick Start](#quick-start)
2. [Dashboard Overview](#dashboard-overview)
3. [Step-by-Step Usage](#step-by-step-usage)
4. [MCP Tools Reference](#mcp-tools-reference)
5. [Claude Desktop Integration](#claude-desktop-integration)
6. [Troubleshooting](#troubleshooting)

---

## ?? Quick Start

### Access the Dashboard
1. Open your browser
2. Navigate to: **https://mcp.inneranimalmedia.com/**
3. You'll see the beautiful MeauxStack dashboard!

### First Time Setup
1. ? Secrets are already configured (GitHub + Cloudflare tokens)
2. ? Worker is deployed and live
3. ? All endpoints are functional

---

## ?? Dashboard Overview

### Main Navigation
- **Workspace** (`/`) - Overview dashboard with stats
- **Analytics** (`/analytics`) - Zone analytics and metrics
- **Projects** (`/projects`) - Manage your deployments
- **Zones** (`/zones`) - View all Cloudflare zones
- **Workers** (`/workers`) - List and manage workers
- **Storage** (`/storage`) - R2 buckets and assets
- **API Docs** (`/api-docs`) - MCP tools documentation
- **Settings** (`/settings`) - Configuration and preferences

### Key Features
- ?? **Premium UI** - Beautiful MeauxStack design
- ?? **Responsive** - Works on mobile, tablet, desktop
- ? **Fast** - Edge-deployed for instant loading
- ?? **Secure** - All secrets encrypted in Cloudflare Workers

---

## ?? Step-by-Step Usage

### Step 1: View Dashboard Overview

**Action**: Visit the homepage
```
https://mcp.inneranimalmedia.com/
```

**What You'll See**:
- Total zones count
- Active workers count
- API requests statistics
- Quick start guide
- Available MCP tools list

**How to Use**:
1. The dashboard automatically loads your Cloudflare stats
2. Click any card to see more details
3. Use the sidebar to navigate to different sections

---

### Step 2: Browse Projects

**Action**: Click "Projects" in the sidebar or visit:
```
https://mcp.inneranimalmedia.com/projects
```

**What You'll See**:
- List of all your active projects
- Project status (Live, In Progress)
- Last updated timestamps
- Project metadata

**How to Use**:
1. Click any project card to view details
2. Use tabs to filter by type (All, Websites, Workers, Automations)
3. Click "New Project" to create a deployment

---

### Step 3: View Analytics

**Action**: Click "Analytics" in the sidebar or visit:
```
https://mcp.inneranimalmedia.com/analytics
```

**What You'll See**:
- Zone performance metrics
- Request volume charts
- Response time analytics
- Error rates
- Bandwidth usage

**How to Use**:
1. Select a zone from the dropdown
2. Choose a time range (24h, 7d, 30d)
3. View detailed metrics and charts

---

### Step 4: Manage Zones

**Action**: Click "Zones" in the sidebar or visit:
```
https://mcp.inneranimalmedia.com/zones
```

**What You'll See**:
- List of all your Cloudflare zones
- Zone status and plan
- DNS record counts
- SSL certificate status

**How to Use**:
1. Click a zone to view details
2. See all routes configured
3. View analytics for that zone

---

### Step 5: Manage Workers

**Action**: Click "Workers" in the sidebar or visit:
```
https://mcp.inneranimalmedia.com/workers
```

**What You'll See**:
- All deployed workers across zones
- Worker status and routes
- Deployment history
- Resource usage

**How to Use**:
1. Click a worker to see details
2. View routes and bindings
3. Check logs and metrics

---

### Step 6: Use MCP Tools via Claude

**Action**: Connect Claude Desktop to your MCP server

**Setup**:
1. Open Claude Desktop
2. Edit config file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
3. Add this configuration:

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

4. Restart Claude Desktop

**How to Use**:
1. Open Claude Desktop
2. Start a conversation
3. Ask Claude to use MCP tools:

**Example Commands**:
- "List all my Cloudflare zones"
- "Deploy a worker to inneranimalmedia.com"
- "Show analytics for my main zone"
- "List all workers in my account"
- "Create a route for my worker"

Claude will automatically use the MCP tools to complete these tasks!

---

## ??? MCP Tools Reference

### 1. list_all_zones
**Purpose**: Get all zones in your Cloudflare account

**Usage via Claude**:
```
"List all my Cloudflare zones"
```

**Response**: Array of zone objects with:
- Zone ID
- Zone name
- Account ID
- Plan type
- Status

---

### 2. deploy_worker_to_zone
**Purpose**: Deploy a Cloudflare Worker to a specific zone

**Usage via Claude**:
```
"Deploy a worker named 'my-worker' to inneranimalmedia.com with this code: [paste code]"
```

**Parameters**:
- `zoneId`: Zone ID to deploy to
- `workerName`: Name of the worker
- `script`: Worker JavaScript/TypeScript code
- `routes`: Optional array of route patterns

---

### 3. deploy_static_files
**Purpose**: Upload static files to R2 and configure serving

**Usage via Claude**:
```
"Upload these files to R2: [list files]"
```

**Parameters**:
- `zoneId`: Zone ID
- `bucketName`: R2 bucket name
- `files`: Array of file objects (path, content, contentType)

---

### 4. list_all_workers
**Purpose**: List all workers across all zones

**Usage via Claude**:
```
"Show me all my deployed workers"
```

**Response**: Array of all workers with:
- Worker name
- Zone information
- Routes
- Status

---

### 5. get_zone_analytics
**Purpose**: Get analytics for a specific zone

**Usage via Claude**:
```
"Show analytics for inneranimalmedia.com for the last 7 days"
```

**Parameters**:
- `zoneId`: Zone ID
- `since`: Optional ISO timestamp (defaults to 7 days ago)

**Response**: Analytics data including:
- Request counts
- Bandwidth
- Response times
- Error rates

---

### 6. create_zone_route
**Purpose**: Create a route for a worker in a zone

**Usage via Claude**:
```
"Create a route for my-worker on inneranimalmedia.com/*"
```

**Parameters**:
- `zoneId`: Zone ID
- `pattern`: Route pattern (e.g., "example.com/*")
- `script`: Worker script name

---

### 7. list_zone_routes
**Purpose**: List all routes for a zone

**Usage via Claude**:
```
"Show all routes for inneranimalmedia.com"
```

**Parameters**:
- `zoneId`: Zone ID

**Response**: Array of route objects

---

### 8. get_zone_info
**Purpose**: Get detailed information about a zone

**Usage via Claude**:
```
"Get details for inneranimalmedia.com zone"
```

**Parameters**:
- `zoneId`: Zone ID

**Response**: Complete zone information

---

## ?? Example Claude Conversations

### Example 1: Deploy a New Worker
```
You: "I want to deploy a new worker that returns 'Hello World' to inneranimalmedia.com/api/test"

Claude: [Uses MCP tools]
- Lists zones to find inneranimalmedia.com
- Deploys worker with your code
- Creates route for /api/test/*
- Confirms deployment success

You: "Great! Show me the analytics for that zone"
Claude: [Fetches analytics and displays them]
```

### Example 2: Manage Multiple Zones
```
You: "Show me all my zones and their status"

Claude: [Uses list_all_zones tool]
- Displays all zones in a table
- Shows status, plan, and zone names
- Highlights any issues

You: "Deploy the same worker to all my zones"
Claude: [Loops through zones and deploys]
- Shows progress for each zone
- Reports any failures
- Confirms successful deployments
```

### Example 3: Monitor Performance
```
You: "Check the performance of all my zones for the last 24 hours"

Claude: [Uses get_zone_analytics for each zone]
- Fetches analytics for all zones
- Compares performance metrics
- Identifies any slow zones
- Suggests optimizations
```

---

## ?? API Endpoints

### Health Check
```bash
GET https://mcp.inneranimalmedia.com/health
```
Returns: `{"status":"ok","service":"inneranimalmedia-mcp","version":"1.0.0","zone":"inneranimalmedia.com"}`

### MCP JSON-RPC
```bash
POST https://mcp.inneranimalmedia.com/mcp
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

### Dashboard Pages
- `GET /` - Homepage
- `GET /projects` - Projects list
- `GET /analytics` - Analytics dashboard
- `GET /zones` - Zones management
- `GET /workers` - Workers list
- `GET /settings` - Settings page

---

## ?? Troubleshooting

### Dashboard Not Loading
**Problem**: Dashboard shows blank page or error

**Solutions**:
1. Check if worker is deployed:
   ```bash
   curl https://mcp.inneranimalmedia.com/health
   ```
2. Check browser console for errors
3. Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
4. Clear browser cache

### MCP Tools Not Working
**Problem**: Claude can't use MCP tools

**Solutions**:
1. Verify MCP endpoint is accessible:
   ```bash
   curl -X POST https://mcp.inneranimalmedia.com/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
   ```
2. Check Claude Desktop config file syntax
3. Restart Claude Desktop after config changes
4. Check Claude Desktop logs for errors

### Secrets Not Working
**Problem**: API calls fail with authentication errors

**Solutions**:
1. Verify secrets are set:
   ```bash
   cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker/inneranimalmedia-mcp
   wrangler secret list --env=production
   ```
2. Re-add secrets if needed:
   ```bash
   wrangler secret put GITHUB_TOKEN --env=production
   wrangler secret put CLOUDFLARE_API_TOKEN --env=production
   ```

### Stats Not Loading
**Problem**: Dashboard shows "Loading..." forever

**Solutions**:
1. Check browser network tab for failed requests
2. Verify API endpoints are working
3. Check worker logs:
   ```bash
   wrangler tail inneranimalmedia-mcp-production --env=production
   ```

---

## ?? Additional Resources

### Cloudflare Documentation
- [Workers Documentation](https://developers.cloudflare.com/workers/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [API Reference](https://developers.cloudflare.com/api/)

### Support
- **Email**: sam@inneranimalmedia.com
- **GitHub**: Issues on your repository
- **Cloudflare Dashboard**: https://dash.cloudflare.com

---

## ?? Quick Reference Card

### Most Common Tasks

| Task | How to Do It |
|------|-------------|
| View all zones | Click "Zones" in sidebar |
| Deploy a worker | Ask Claude: "Deploy worker X to zone Y" |
| Check analytics | Click "Analytics" or ask Claude |
| List workers | Click "Workers" or ask Claude |
| View projects | Click "Projects" in sidebar |
| Get zone info | Ask Claude: "Show info for zone X" |

### Keyboard Shortcuts
- `/` - Focus search
- `Cmd/Ctrl + K` - Quick actions (coming soon)
- `Esc` - Close modals

---

**?? You're all set! Start using your MCP dashboard now!**

Visit: **https://mcp.inneranimalmedia.com/**
