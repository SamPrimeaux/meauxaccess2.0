# MCP Helper Tools Reference

Complete reference for all available MCP tools in the Cloudflare MCP Server.

## Core Tools

### D1 Database Tools

#### `list_d1_databases`
List all available D1 databases bound to the worker.

**Parameters:** None

**Example:**
```json
{
  "name": "list_d1_databases",
  "arguments": {}
}
```

#### `query_d1_database`
Execute a SQL query on a D1 database.

**Parameters:**
- `database` (string, required): Database binding name (e.g., 'DB', 'SAAS_DB')
- `query` (string, required): SQL query to execute
- `params` (array, optional): Query parameters

**Example:**
```json
{
  "name": "query_d1_database",
  "arguments": {
    "database": "DB",
    "query": "SELECT * FROM users LIMIT 10",
    "params": []
  }
}
```

#### `get_d1_schema`
Get the schema of a D1 database.

**Parameters:**
- `database` (string, required): Database binding name

**Example:**
```json
{
  "name": "get_d1_schema",
  "arguments": {
    "database": "DB"
  }
}
```

### R2 Bucket Tools

#### `list_r2_buckets`
List all available R2 buckets bound to the worker.

**Parameters:** None

#### `list_r2_objects`
List objects in an R2 bucket.

**Parameters:**
- `bucket` (string, required): Bucket binding name
- `prefix` (string, optional): Prefix to filter objects
- `limit` (number, optional): Maximum number of objects (default: 1000)

**Example:**
```json
{
  "name": "list_r2_objects",
  "arguments": {
    "bucket": "R2_ASSETS",
    "prefix": "images/",
    "limit": 100
  }
}
```

#### `read_r2_object`
Read an object from an R2 bucket.

**Parameters:**
- `bucket` (string, required): Bucket binding name
- `key` (string, required): Object key/path

#### `upload_r2_object`
Upload an object to an R2 bucket.

**Parameters:**
- `bucket` (string, required): Bucket binding name
- `key` (string, required): Object key/path
- `content` (string, required): File content (base64 encoded data URL or plain text)
- `contentType` (string, optional): Content type (default: 'text/plain')

**Example:**
```json
{
  "name": "upload_r2_object",
  "arguments": {
    "bucket": "R2_ASSETS",
    "key": "test.txt",
    "content": "data:text/plain;base64,SGVsbG8gV29ybGQ=",
    "contentType": "text/plain"
  }
}
```

#### `delete_r2_object`
Delete an object from an R2 bucket.

**Parameters:**
- `bucket` (string, required): Bucket binding name
- `key` (string, required): Object key to delete

#### `copy_r2_object`
Copy an object between R2 buckets.

**Parameters:**
- `sourceBucket` (string, required): Source bucket binding name
- `sourceKey` (string, required): Source object key
- `destBucket` (string, required): Destination bucket binding name
- `destKey` (string, required): Destination object key

### KV Namespace Tools

#### `list_kv_namespaces`
List all available KV namespaces bound to the worker.

**Parameters:** None

#### `read_kv`
Read a value from a KV namespace.

**Parameters:**
- `namespace` (string, required): KV namespace binding name
- `key` (string, required): Key to read

#### `write_kv`
Write a value to a KV namespace.

**Parameters:**
- `namespace` (string, required): KV namespace binding name
- `key` (string, required): Key to write
- `value` (string, required): Value to write
- `expirationTtl` (number, optional): Expiration time in seconds

## Workflow Automation Tools

### `list_workers`
List all Cloudflare Workers in the account.

**Parameters:** None

**Requirements:** `CLOUDFLARE_API_TOKEN` must be set

### `get_worker_logs`
Get logs from a Cloudflare Worker.

**Parameters:**
- `workerName` (string, required): Name of the worker
- `limit` (number, optional): Maximum number of log entries (default: 100)

**Note:** Requires Workers Paid plan or Analytics Engine

### `create_r2_bucket`
Create a new R2 bucket.

**Parameters:**
- `bucketName` (string, required): Name of the bucket to create

**Requirements:** `CLOUDFLARE_API_TOKEN` must be set

### `create_d1_database`
Create a new D1 database.

**Parameters:**
- `databaseName` (string, required): Name of the database to create

**Requirements:** `CLOUDFLARE_API_TOKEN` must be set

### `test_endpoint`
Test an HTTP endpoint.

**Parameters:**
- `url` (string, required): URL to test
- `method` (string, optional): HTTP method (default: 'GET')
- `headers` (object, optional): Request headers
- `body` (string, optional): Request body

**Example:**
```json
{
  "name": "test_endpoint",
  "arguments": {
    "url": "https://api.example.com/test",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": "{\"test\": true}"
  }
}
```

## Project Management Tools

### `get_project_info`
Get project metadata from wrangler.toml or package.json.

**Parameters:**
- `projectPath` (string, required): Path to project (relative to workspace)

**Note:** Requires bridge server for local file access

### `list_projects`
List all projects in the workspace.

**Parameters:** None

**Note:** Requires bridge server for local file access

### `backup_project`
Backup a project to R2.

**Parameters:**
- `projectPath` (string, required): Path to project to backup
- `bucket` (string, required): R2 bucket to store backup
- `backupName` (string, required): Name for the backup

**Note:** Requires bridge server for local file access

## Error Handling

All tools return standard MCP responses:

**Success:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "..."
      }
    ]
  }
}
```

**Error:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32603,
    "message": "Error message",
    "data": "Additional error details"
  }
}
```

## Dashboard Features

The dashboard at `/` or `/dashboard` provides:

- **R2 Storage**: Upload, manage, and preview files
- **D1 Databases**: Query interface with schema viewer
- **KV Namespaces**: Read/write key-value pairs
- **Workers**: List and monitor Cloudflare Workers

## Security Notes

- Set `MCP_AUTH_TOKEN` secret to secure the MCP endpoint
- `CLOUDFLARE_API_TOKEN` is required for API-based tools (list_workers, create_r2_bucket, etc.)
- All tools validate inputs and handle errors gracefully
- CORS is enabled for dashboard access

## Performance Tips

- Use `limit` parameter for large R2 object lists
- Batch operations when possible
- Cache frequently accessed data
- Use prefixes to organize R2 objects
