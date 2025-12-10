# ?? How to Notify Your Team

## Quick Start

### Option 1: Via Dashboard (Easiest)
1. Go to https://meauxmcp.meauxbility.workers.dev
2. Click **"Team"** in the sidebar
3. Click **"Notify All Team"** button (sends welcome email to everyone)
4. OR use the form to send custom notifications

### Option 2: Via API
```bash
curl -X POST https://meauxmcp.meauxbility.workers.dev/api/team/notify \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "all",
    "title": "Welcome to MeauxMCP Dashboard! ??",
    "message": "Your dashboard is ready with SSH access.",
    "type": "welcome"
  }'
```

### Option 3: Via MCP Tool
Use the `send_team_notification` tool from Cursor or any MCP client.

## Team Members

All 3 team members are configured:
- ? **Sam Primeaux** (sam@meauxbility.org) - Admin, SSH Enabled
- ? **Connor** (connor@meauxbility.org) - Developer, SSH Enabled  
- ? **Fred** (fred@meauxbility.org) - Developer, SSH Enabled

## Email Notifications Setup

To enable email notifications (optional):
1. Sign up at https://resend.com (free tier available)
2. Get your API key
3. Set it as a secret:
   ```bash
   cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker
   wrangler secret put RESEND_API_KEY
   # Paste your Resend API key when prompted
   ```

## What Team Members Can Do

Once notified, team members can:
- ? Access dashboard at https://meauxmcp.meauxbility.workers.dev
- ? View all R2 buckets with stats
- ? Query D1 databases
- ? Manage KV namespaces
- ? Use SSH terminal (requires gateway setup)
- ? Send notifications to each other

## SSH Access

**Important:** Cloudflare Workers cannot directly execute SSH commands. The SSH API provides:
- Connection management
- Command queueing
- Secure gateway integration

For full SSH execution, you need an SSH gateway service or Cloudflare Tunnel.

## Next Steps

1. ? KV namespaces created
2. ? Set RESEND_API_KEY (optional, for emails)
3. ? Send welcome notifications
4. ? Configure SSH gateway (if needed)
