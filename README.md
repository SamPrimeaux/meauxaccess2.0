# meauxaccess2.0

# Cloudflare MCP Server

A Model Context Protocol (MCP) server running on Cloudflare Workers that provides access to your Cloudflare assets (D1 databases, R2 buckets, KV namespaces) and local files.

## Features

* ✅ **D1 Database Access**: Query, list, and get schema for all bound D1 databases
* ✅ **R2 Bucket Access**: List, read, upload, delete, and copy objects in R2 buckets
* ✅ **KV Namespace Access**: Read and write to KV namespaces
* ✅ **Workflow Automation**: List workers, create resources, test endpoints
* ✅ **Project Management**: Get project info, list projects, backup to R2
* ✅ **Interactive Dashboard**: Web UI for managing R2, D1, KV, and Workers
* ✅ **MCP Protocol**: Full MCP protocol implementation over HTTP
* ✅ **Enhanced Error Handling**: Comprehensive logging and error messages
* ✅ **Bridge Server**: Local file access via Node.js bridge
* ✅ **SSE Support**: Server-Sent Events for real-time updates
* ✅ **CORS Enabled**: Works with Cursor and other MCP clients

## Developer Dashboard

**Live Dashboard**: [View Developer Dashboard](https://samprimeaux.github.io/meauxaccess2.0/)

The Developer Dashboard provides a complete web interface for managing:
- D1 Databases (SQL queries, schema viewing)
- R2 Buckets (browse, upload, manage objects)
- KV Namespaces (read/write operations)
- Cloudflare Workers (monitoring and management)
- AI Chat Integration (OpenAI, Anthropic, Gemini)
- API Key Management
- Module Launcher

## Quick Start

### 1. Install Dependencies

```
cd cloudflare-mcp-worker
npm install

```

### 2. Configure wrangler.toml

Edit `wrangler.toml` to add your D1 databases, R2 buckets, and KV namespaces.

### 3. Set Secrets (Optional)

```
# Optional: Set auth token for MCP endpoint
wrangler secret put MCP_AUTH_TOKEN

# Set Cloudflare API token if needed
wrangler secret put CLOUDFLARE_API_TOKEN

```

### 4. Deploy

```
npm run deploy

```

The worker will be available at: `https://cloudflare-mcp-server.YOUR_SUBDOMAIN.workers.dev`

### 5. Configure Cursor

Add to `~/.cursor/mcp.json`:

```
{
  "mcpServers": {
    "cloudflare-worker": {
      "url": "https://cloudflare-mcp-server.YOUR_SUBDOMAIN.workers.dev/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_MCP_AUTH_TOKEN"
      }
    }
  }
}

```

Or if you didn't set an auth token:

```
{
  "mcpServers": {
    "cloudflare-worker": {
      "url": "https://cloudflare-mcp-server.YOUR_SUBDOMAIN.workers.dev/mcp"
    }
  }
}

```

## Available Tools

### D1 Database Tools

* `list_d1_databases` \- List all available D1 databases
* `query_d1_database` \- Execute SQL queries
* `get_d1_schema` \- Get database schema

### R2 Bucket Tools

* `list_r2_buckets` \- List all available R2 buckets
* `list_r2_objects` \- List objects in a bucket
* `read_r2_object` \- Read an object from a bucket
* `upload_r2_object` \- Upload an object to a bucket

### KV Namespace Tools

* `list_kv_namespaces` \- List all available KV namespaces
* `read_kv` \- Read a value from KV
* `write_kv` \- Write a value to KV

## Usage Examples

### Query D1 Database

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "query_d1_database",
    "arguments": {
      "database": "DB",
      "query": "SELECT * FROM users LIMIT 10"
    }
  }
}

```

### List R2 Objects

```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "list_r2_objects",
    "arguments": {
      "bucket": "R2_ASSETS",
      "prefix": "images/",
      "limit": 50
    }
  }
}

```

### Read R2 Object

```
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "read_r2_object",
    "arguments": {
      "bucket": "R2_DOCS",
      "key": "readme.md"
    }
  }
}

```

## Development

```
# Run locally
npm run dev

# Deploy to Cloudflare
npm run deploy

# View logs
npm run tail

```

## Security

* Set `MCP_AUTH_TOKEN` secret to require authentication
* Use CORS headers to restrict access if needed
* Consider using Cloudflare Access for additional security

## Troubleshooting

### Worker not responding

1. Check worker logs: `wrangler tail`
2. Verify bindings in `wrangler.toml`
3. Test health endpoint: `https://your-worker.workers.dev/health`

### Database not found

* Ensure database binding is added to `wrangler.toml`
* Verify database ID is correct
* Check that database exists in your Cloudflare account

### Cursor not connecting

1. Verify worker URL is correct
2. Check Cursor MCP settings
3. Restart Cursor after configuration changes
4. Check browser console for errors

## License

MIT
