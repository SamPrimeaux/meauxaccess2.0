# ?? Team Setup & SSH Access Guide

## ?? Overview

Your MeauxMCP Dashboard now includes:
- ? **Team Management** - All 3 team members configured
- ? **SSH API** - Secure SSH access for running dev projects
- ? **Email Notifications** - Automatic team notifications
- ? **User Roles** - Admin and Developer roles

## ?? Team Members

| Name | Email | Role | SSH Access |
|------|-------|------|------------|
| Sam Primeaux | sam@meauxbility.org | Admin | ? Enabled |
| Connor | connor@meauxbility.org | Developer | ? Enabled |
| Fred | fred@meauxbility.org | Developer | ? Enabled |

## ?? Notifying Your Team

### Option 1: Via Dashboard UI
1. Go to **Team** section in dashboard
2. Click **"Send Notification"**
3. Select recipient (individual or "All Team")
4. Enter title and message
5. Click **Send**

### Option 2: Via MCP Tool
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "send_team_notification",
    "arguments": {
      "recipient": "all",
      "title": "New Feature Available!",
      "message": "SSH access is now live. Check your dashboard!",
      "type": "feature"
    }
  }
}
```

### Option 3: Via API
```bash
curl -X POST https://meauxmcp.meauxbility.workers.dev/api/team/notify \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "all",
    "title": "Welcome to MeauxMCP!",
    "message": "Your dashboard is ready with SSH access.",
    "type": "welcome"
  }'
```

## ?? SSH Access Setup

### Important Note
Cloudflare Workers **cannot directly execute SSH commands** (they're serverless). The SSH API provides:

1. **SSH Connection Management** - Store and manage SSH connection configs
2. **Command Queue** - Queue commands for execution
3. **Secure Gateway** - Proxy through a secure SSH gateway service

### For Full SSH Execution, You Need:

**Option A: SSH Gateway Service** (Recommended)
- Deploy a separate service that handles SSH execution
- Worker proxies commands to this gateway
- Gateway executes commands and returns results

**Option B: Cloudflare Tunnel + Zero Trust**
- Use Cloudflare Tunnel to access your servers
- Zero Trust policies for secure access
- Direct SSH through tunnel

**Option C: Local Bridge Server**
- Run SSH commands locally via bridge server
- Bridge server connects to Worker
- Commands execute on your local machine

## ?? Setting Up KV Namespaces

Run these commands to create the required KV namespaces:

```bash
cd /Users/samprimeaux/Downloads/cloudflare-mcp-worker

# Create KV_USERS namespace
wrangler kv namespace create "KV_USERS"

# Create KV_NOTIFICATIONS namespace  
wrangler kv namespace create "KV_NOTIFICATIONS"
```

Then update `wrangler.toml` with the returned IDs:

```toml
[[kv_namespaces]]
binding = "KV_USERS"
id = "YOUR_KV_USERS_ID"

[[kv_namespaces]]
binding = "KV_NOTIFICATIONS"
id = "YOUR_KV_NOTIFICATIONS_ID"
```

## ?? Email Notifications Setup

To enable email notifications, you need a Resend API key:

1. Sign up at https://resend.com
2. Get your API key
3. Set it as a secret:

```bash
wrangler secret put RESEND_API_KEY
# Paste your Resend API key when prompted
```

## ?? Next Steps

1. **Create KV Namespaces** (commands above)
2. **Set Resend API Key** (for email notifications)
3. **Send Welcome Emails** to team:
   ```bash
   curl -X POST https://meauxmcp.meauxbility.workers.dev/api/team/notify \
     -H "Content-Type: application/json" \
     -d '{
       "recipient": "all",
       "title": "Welcome to MeauxMCP Dashboard! ??",
       "message": "You now have access to the dashboard with SSH capabilities.",
       "type": "welcome"
     }'
   ```
4. **Configure SSH Gateway** (if using Option A)
5. **Add SSH Connections** via dashboard UI

## ?? Dashboard Features

- **Team Management** - View all team members
- **SSH Terminal** - Execute commands (requires gateway)
- **Notifications** - Send team updates
- **User Roles** - Admin/Developer permissions

## ?? Security Notes

- SSH keys are stored encrypted in KV
- Access is role-based
- All API calls require authentication
- Commands are logged for audit

## ?? Support

If you need help setting up SSH gateway or have questions, let me know!
