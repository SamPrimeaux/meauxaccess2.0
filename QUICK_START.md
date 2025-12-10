# Quick Start Guide

Get your Cloudflare MCP server up and running in 5 minutes!

## 1. Install Dependencies

```bash
cd cloudflare-mcp-worker
npm install
```

## 2. Configure Your Resources

Edit `wrangler.toml` to add your D1 databases, R2 buckets, and KV namespaces. The file already includes some common bindings - uncomment or add more as needed.

## 3. Deploy

```bash
./deploy.sh
```

Or manually:

```bash
wrangler deploy
```

## 4. Get Your Worker URL

Your worker is deployed at:
```
https://meauxmcp.meauxbility.workers.dev
```

Save this URL!

## 5. (Optional) Set Auth Token

For security, set an auth token:

```bash
wrangler secret put MCP_AUTH_TOKEN
# Enter your token when prompted
```

## 6. Configure Cursor

See `CURSOR_SETUP.md` for detailed instructions. Quick version:

### Option A: Direct HTTP (if supported)

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cloudflare": {
      "url": "https://meauxmcp.meauxbility.workers.dev/mcp"
    }
  }
}
```

### Option B: Bridge Server (recommended)

1. Create bridge server (see `CURSOR_SETUP.md` Option 2)
2. Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "node",
      "args": ["/path/to/bridge.js"],
      "env": {
        "CLOUDFLARE_MCP_URL": "https://meauxmcp.meauxbility.workers.dev/mcp"
      }
    }
  }
}
```

3. Restart Cursor

## 7. Test It!

In Cursor, try:
- "List all my D1 databases"
- "Show me all R2 buckets"
- "Query the DB database for all users"

## Troubleshooting

- **Worker not found?** Check `wrangler.toml` account_id
- **Can't connect?** Test health endpoint: `curl https://meauxmcp.meauxbility.workers.dev/health`
- **Cursor not working?** Restart Cursor completely after config changes

## What You Get

? Query any D1 database  
? Browse and read R2 files  
? Access KV namespaces  
? All from Cursor chat!

## Next Steps

- Add more database/bucket bindings to `wrangler.toml`
- Customize tools in `src/index.ts`
- Set up authentication for production use
