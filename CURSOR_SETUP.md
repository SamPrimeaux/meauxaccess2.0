# Setting Up Cursor to Connect to Cloudflare MCP Server

This guide shows you how to connect Cursor to your Cloudflare MCP Worker.

## Option 1: Direct HTTP Connection (If Cursor Supports It)

If Cursor supports HTTP-based MCP servers, add this to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cloudflare": {
      "url": "https://meauxmcp.meauxbility.workers.dev/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_MCP_AUTH_TOKEN"
      }
    }
  }
}
```

**Note:** If you didn't set `MCP_AUTH_TOKEN`, omit the `headers` section.

## Option 2: Local Bridge Server (Recommended)

Since Cursor primarily supports stdio-based MCP servers, we'll create a local bridge that connects to your Cloudflare Worker.

### Step 1: Create Bridge Server

Create a new directory and files:

```bash
mkdir -p ~/cloudflare-mcp-bridge
cd ~/cloudflare-mcp-bridge
```

The bridge server is located at `~/cloudflare-mcp-bridge/bridge.js` and includes:

- ✅ **Retry Logic**: Automatically retries failed requests (up to 3 times)
- ✅ **Health Checks**: Monitors worker health every 30 seconds
- ✅ **Better Error Handling**: Comprehensive error messages and logging
- ✅ **Connection Stability**: Exponential backoff for retries
- ✅ **Timeout Handling**: 30-second timeout for requests

The enhanced bridge server is already set up. If you need to recreate it, see the full implementation in the worker repository.

Make it executable:

```bash
chmod +x bridge.js
```

### Step 2: Configure Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "node",
      "args": ["/Users/samprimeaux/cloudflare-mcp-bridge/bridge.js"],
      "env": {
        "CLOUDFLARE_MCP_URL": "https://meauxmcp.meauxbility.workers.dev/mcp",
        "MCP_AUTH_TOKEN": "YOUR_MCP_AUTH_TOKEN"
      }
    }
  }
}
```

**Replace:**
- `/Users/samprimeaux/cloudflare-mcp-bridge/bridge.js` with your actual path
- `YOUR_SUBDOMAIN` with your Cloudflare Workers subdomain
- `YOUR_MCP_AUTH_TOKEN` with your token (or remove this line if not using auth)

### Step 3: Restart Cursor

Restart Cursor completely for the MCP configuration to take effect.

## Option 3: Using npx (Simplest)

If you prefer not to manage a local bridge, you can use a published package or create one:

```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": ["-y", "cloudflare-mcp-bridge"],
      "env": {
        "CLOUDFLARE_MCP_URL": "https://cloudflare-mcp-server.YOUR_SUBDOMAIN.workers.dev/mcp"
      }
    }
  }
}
```

## Testing the Connection

1. **Test Worker Health:**
   ```bash
   curl https://cloudflare-mcp-server.YOUR_SUBDOMAIN.workers.dev/health
   ```

2. **Test MCP Endpoint:**
   ```bash
   curl -X POST https://cloudflare-mcp-server.YOUR_SUBDOMAIN.workers.dev/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'
   ```

3. **In Cursor:**
   After restarting, try asking:
   - "List all my D1 databases"
   - "Show me all R2 buckets"
   - "Query the DB database for all users"

## Troubleshooting

### Worker not responding
- Check worker logs: `wrangler tail`
- Verify the worker URL is correct
- Test the health endpoint

### Cursor not connecting
- Verify `mcp.json` syntax is valid JSON
- Check that the bridge script path is correct
- Ensure Node.js is installed and in PATH
- Restart Cursor completely
- Check Cursor console for errors (Cmd/Ctrl + Shift + P ? "Developer: Toggle Developer Tools")

### Authentication errors
- Verify `MCP_AUTH_TOKEN` matches what you set in the worker
- Or remove auth if not needed

## Available Tools

Once connected, you have access to:

### Core Tools
- **D1 Databases**: `list_d1_databases`, `query_d1_database`, `get_d1_schema`
- **R2 Buckets**: `list_r2_buckets`, `list_r2_objects`, `read_r2_object`, `upload_r2_object`, `delete_r2_object`, `copy_r2_object`
- **KV Namespaces**: `list_kv_namespaces`, `read_kv`, `write_kv`

### Workflow Automation
- **Workers**: `list_workers`, `get_worker_logs`
- **Resources**: `create_r2_bucket`, `create_d1_database`
- **Testing**: `test_endpoint`

### Project Management
- **Projects**: `get_project_info`, `list_projects`, `backup_project`

See `HELPER_TOOLS.md` for complete documentation of all tools.

## Dashboard

Access the interactive dashboard at:
- `https://meauxmcp.meauxbility.workers.dev/`
- `https://meauxmcp.meauxbility.workers.dev/dashboard`

Features:
- R2 Storage management with drag-and-drop uploads
- D1 Database query interface
- KV Namespace browser
- Workers management panel

## Next Steps

Once connected, you can:
- Query D1 databases directly from Cursor
- Browse R2 buckets and read files
- Access KV namespaces
- Manage Workers and create resources
- Use all Cloudflare assets seamlessly in your workflow
- Access the web dashboard for visual management
