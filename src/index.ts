/**
 * Cloudflare MCP Server Worker
 * Implements Model Context Protocol over HTTP/SSE
 * 
 * Provides access to:
 * - D1 Databases (query, list, schema)
 * - R2 Buckets (list, read, upload)
 * - KV Namespaces (read, write)
 * - Local file access via R2
 */

/// <reference types="@cloudflare/workers-types" />

// Import dashboard HTML
import DASHBOARD_HTML from './dashboard-embed';
import IACCESS_HTML from './iaccess-embed';
import { default as getSouthernPetsDashboardHTML } from './southernpets-dashboard.html';

export interface Env {
  // Cloudflare API
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;

  // D1 Databases - Add your database bindings here
  DB?: D1Database;
  SAAS_DB?: D1Database;
  MEAUX_WORK_DB?: D1Database;
  [key: `DB_${string}`]: D1Database; // Dynamic database bindings

  // R2 Buckets - Add your bucket bindings here
  R2_ASSETS?: R2Bucket;
  R2_DOCS?: R2Bucket;
  R2_IAUTODIDACT?: R2Bucket; // iautodidact.org bucket
  [key: `R2_${string}`]: R2Bucket; // Dynamic bucket bindings

  // KV Namespaces
  KV_CACHE?: KVNamespace;
  KV_CONFIG?: KVNamespace;
  KV_SESSIONS?: KVNamespace;
  KV_USERS?: KVNamespace; // Team user management
  KV_NOTIFICATIONS?: KVNamespace; // Team notifications
  [key: `KV_${string}`]: KVNamespace; // Dynamic KV bindings

  // Environment
  ENVIRONMENT?: string;
  MCP_AUTH_TOKEN?: string; // Optional auth token for MCP access
  RESEND_API_KEY?: string; // For email notifications
  OPENAI_API_KEY?: string; // For ChatGPT integration
  OPENAI_ORG_ID?: string; // OpenAI Organization ID
  ANTHROPIC_API_KEY?: string; // For Claude integration
}

interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number | null;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// CORS Headers
function getCORSHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

// Helper to get all D1 databases from bindings
function getAllD1Databases(env: Env): Array<{ name: string; binding: string; database: D1Database }> {
  const databases: Array<{ name: string; binding: string; database: D1Database }> = [];

  // Check all possible bindings - iterate through env to find D1Database instances
  for (const [key, value] of Object.entries(env)) {
    // Skip non-database entries
    if (key === 'CLOUDFLARE_ACCOUNT_ID' || key === 'CLOUDFLARE_API_TOKEN' ||
      key === 'ENVIRONMENT' || key === 'MCP_AUTH_TOKEN') {
      continue;
    }

    // Check if it's a D1Database instance
    if (value instanceof D1Database) {
      databases.push({ name: key, binding: key, database: value });
    }
  }

  return databases;
}

// Helper to check if a value is an R2Bucket (duck typing)
function isR2Bucket(value: any): value is R2Bucket {
  if (!value || typeof value !== 'object') return false;
  // Check for R2Bucket methods
  return (
    typeof value.list === 'function' &&
    typeof value.get === 'function' &&
    typeof value.put === 'function' &&
    typeof value.delete === 'function'
  );
}

// Helper to get all R2 buckets from bindings
function getAllR2Buckets(env: Env): Array<{ name: string; binding: string; bucket: R2Bucket }> {
  const buckets: Array<{ name: string; binding: string; bucket: R2Bucket }> = [];

  // Check all possible bindings - iterate through env to find R2Bucket instances
  for (const [key, value] of Object.entries(env)) {
    // Skip non-bucket entries
    if (key === 'CLOUDFLARE_ACCOUNT_ID' || key === 'CLOUDFLARE_API_TOKEN' ||
      key === 'ENVIRONMENT' || key === 'MCP_AUTH_TOKEN' ||
      key === 'RESEND_API_KEY' || key === 'OPENAI_API_KEY' ||
      key === 'OPENAI_ORG_ID' || key === 'ANTHROPIC_API_KEY' ||
      key === 'MCP_AUTH_TOKEN') {
      continue;
    }

    // Check if it's an R2Bucket instance using duck typing
    if (isR2Bucket(value)) {
      buckets.push({ name: key, binding: key, bucket: value });
    }
  }

  return buckets;
}

// MCP Protocol Handlers
async function handleInitialize(request: MCPRequest, env: Env): Promise<MCPResponse> {
  return {
    jsonrpc: "2.0",
    id: request.id,
    result: {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
      serverInfo: {
        name: "cloudflare-mcp-server",
        version: "1.0.0",
      },
    },
  };
}

async function handleToolsList(request: MCPRequest, env: Env): Promise<MCPResponse> {
  const tools = [
    {
      name: "list_d1_databases",
      description: "List all available D1 databases",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "query_d1_database",
      description: "Execute a SQL query on a D1 database",
      inputSchema: {
        type: "object",
        properties: {
          database: {
            type: "string",
            description: "Database binding name (e.g., 'DB', 'SAAS_DB')",
          },
          query: {
            type: "string",
            description: "SQL query to execute",
          },
          params: {
            type: "array",
            description: "Optional query parameters",
            items: { type: "string" },
          },
        },
        required: ["database", "query"],
      },
    },
    {
      name: "get_d1_schema",
      description: "Get the schema of a D1 database",
      inputSchema: {
        type: "object",
        properties: {
          database: {
            type: "string",
            description: "Database binding name",
          },
        },
        required: ["database"],
      },
    },
    {
      name: "list_r2_buckets",
      description: "List all available R2 buckets",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "list_r2_objects",
      description: "List objects in an R2 bucket",
      inputSchema: {
        type: "object",
        properties: {
          bucket: {
            type: "string",
            description: "Bucket binding name (e.g., 'R2_ASSETS', 'R2_DOCS')",
          },
          prefix: {
            type: "string",
            description: "Optional prefix to filter objects",
          },
          limit: {
            type: "number",
            description: "Maximum number of objects to return (default: 1000)",
          },
        },
        required: ["bucket"],
      },
    },
    {
      name: "get_r2_bucket_stats",
      description: "Get statistics for an R2 bucket (total size, object count)",
      inputSchema: {
        type: "object",
        properties: {
          bucket: {
            type: "string",
            description: "Bucket binding name (e.g., 'R2_ASSETS', 'R2_DOCS')",
          },
        },
        required: ["bucket"],
      },
    },
    {
      name: "read_r2_object",
      description: "Read an object from an R2 bucket",
      inputSchema: {
        type: "object",
        properties: {
          bucket: {
            type: "string",
            description: "Bucket binding name",
          },
          key: {
            type: "string",
            description: "Object key/path",
          },
        },
        required: ["bucket", "key"],
      },
    },
    {
      name: "upload_r2_object",
      description: "Upload an object to an R2 bucket",
      inputSchema: {
        type: "object",
        properties: {
          bucket: {
            type: "string",
            description: "Bucket binding name",
          },
          key: {
            type: "string",
            description: "Object key/path",
          },
          content: {
            type: "string",
            description: "File content (base64 encoded or plain text)",
          },
          contentType: {
            type: "string",
            description: "Content type (e.g., 'text/plain', 'application/json')",
          },
        },
        required: ["bucket", "key", "content"],
      },
    },
    {
      name: "list_kv_namespaces",
      description: "List all available KV namespaces",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "read_kv",
      description: "Read a value from a KV namespace",
      inputSchema: {
        type: "object",
        properties: {
          namespace: {
            type: "string",
            description: "KV namespace binding name",
          },
          key: {
            type: "string",
            description: "Key to read",
          },
        },
        required: ["namespace", "key"],
      },
    },
    {
      name: "write_kv",
      description: "Write a value to a KV namespace",
      inputSchema: {
        type: "object",
        properties: {
          namespace: {
            type: "string",
            description: "KV namespace binding name",
          },
          key: {
            type: "string",
            description: "Key to write",
          },
          value: {
            type: "string",
            description: "Value to write",
          },
          expirationTtl: {
            type: "number",
            description: "Optional expiration time in seconds",
          },
        },
        required: ["namespace", "key", "value"],
      },
    },
    // Phase 2: Workflow Automation Tools
    {
      name: "list_workers",
      description: "List all Cloudflare Workers in the account",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "get_worker_logs",
      description: "Get logs from a Cloudflare Worker",
      inputSchema: {
        type: "object",
        properties: {
          workerName: {
            type: "string",
            description: "Name of the worker",
          },
          limit: {
            type: "number",
            description: "Maximum number of log entries (default: 100)",
          },
        },
        required: ["workerName"],
      },
    },
    {
      name: "create_r2_bucket",
      description: "Create a new R2 bucket",
      inputSchema: {
        type: "object",
        properties: {
          bucketName: {
            type: "string",
            description: "Name of the bucket to create",
          },
        },
        required: ["bucketName"],
      },
    },
    {
      name: "create_d1_database",
      description: "Create a new D1 database",
      inputSchema: {
        type: "object",
        properties: {
          databaseName: {
            type: "string",
            description: "Name of the database to create",
          },
        },
        required: ["databaseName"],
      },
    },
    {
      name: "test_endpoint",
      description: "Test an HTTP endpoint",
      inputSchema: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL to test",
          },
          method: {
            type: "string",
            description: "HTTP method (default: GET)",
          },
          headers: {
            type: "object",
            description: "Optional headers",
          },
          body: {
            type: "string",
            description: "Optional request body",
          },
        },
        required: ["url"],
      },
    },
    // Phase 3: Enhanced File Management
    {
      name: "delete_r2_object",
      description: "Delete an object from an R2 bucket",
      inputSchema: {
        type: "object",
        properties: {
          bucket: {
            type: "string",
            description: "Bucket binding name",
          },
          key: {
            type: "string",
            description: "Object key to delete",
          },
        },
        required: ["bucket", "key"],
      },
    },
    {
      name: "copy_r2_object",
      description: "Copy an object between R2 buckets",
      inputSchema: {
        type: "object",
        properties: {
          sourceBucket: {
            type: "string",
            description: "Source bucket binding name",
          },
          sourceKey: {
            type: "string",
            description: "Source object key",
          },
          destBucket: {
            type: "string",
            description: "Destination bucket binding name",
          },
          destKey: {
            type: "string",
            description: "Destination object key",
          },
        },
        required: ["sourceBucket", "sourceKey", "destBucket", "destKey"],
      },
    },
    // Phase 4: Project Management Helpers
    {
      name: "get_project_info",
      description: "Get project metadata from wrangler.toml or package.json",
      inputSchema: {
        type: "object",
        properties: {
          projectPath: {
            type: "string",
            description: "Path to project (relative to workspace)",
          },
        },
        required: ["projectPath"],
      },
    },
    {
      name: "list_projects",
      description: "List all projects in the workspace",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "backup_project",
      description: "Backup a project to R2",
      inputSchema: {
        type: "object",
        properties: {
          projectPath: {
            type: "string",
            description: "Path to project to backup",
          },
          bucket: {
            type: "string",
            description: "R2 bucket to store backup",
          },
          backupName: {
            type: "string",
            description: "Name for the backup",
          },
        },
        required: ["projectPath", "bucket", "backupName"],
      },
    },
    // Phase 5: Team Management & SSH
    {
      name: "list_team_members",
      description: "List all team members",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "get_team_member",
      description: "Get team member by email",
      inputSchema: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Team member email",
          },
        },
        required: ["email"],
      },
    },
    {
      name: "send_team_notification",
      description: "Send notification to team member(s)",
      inputSchema: {
        type: "object",
        properties: {
          recipient: {
            type: "string",
            description: "Email address or 'all' for all team members",
          },
          title: {
            type: "string",
            description: "Notification title",
          },
          message: {
            type: "string",
            description: "Notification message",
          },
          type: {
            type: "string",
            description: "Notification type: welcome, feature, alert, update",
            enum: ["welcome", "feature", "alert", "update"],
          },
        },
        required: ["recipient", "title", "message"],
      },
    },
    {
      name: "list_ssh_connections",
      description: "List SSH connections for a user",
      inputSchema: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "User email",
          },
        },
        required: ["email"],
      },
    },
    {
      name: "execute_ssh_command",
      description: "Execute SSH command on remote server",
      inputSchema: {
        type: "object",
        properties: {
          connectionId: {
            type: "string",
            description: "SSH connection ID",
          },
          command: {
            type: "string",
            description: "Command to execute",
          },
          workingDirectory: {
            type: "string",
            description: "Working directory for command",
          },
        },
        required: ["connectionId", "command"],
      },
    },
  ];

  return {
    jsonrpc: "2.0",
    id: request.id,
    result: { tools },
  };
}

async function handleToolsCall(request: MCPRequest, env: Env): Promise<MCPResponse> {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_d1_databases": {
        const databases = getAllD1Databases(env);
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  databases.map((db) => ({
                    name: db.name,
                    binding: db.binding,
                  })),
                  null,
                  2
                ),
              },
            ],
          },
        };
      }

      case "query_d1_database": {
        const { database: dbName, query, params = [] } = args;
        const databases = getAllD1Databases(env);
        const db = databases.find((d) => d.binding === dbName || d.name === dbName);

        if (!db) {
          throw new Error(`Database '${dbName}' not found. Available: ${databases.map((d) => d.name).join(", ")}`);
        }

        const stmt = db.database.prepare(query);
        const boundStmt = params.length > 0 ? stmt.bind(...params) : stmt;
        const result = await boundStmt.all();

        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    results: result.results,
                    meta: result.meta,
                    success: result.success,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        };
      }

      case "get_d1_schema": {
        const { database: dbName } = args;
        const databases = getAllD1Databases(env);
        const db = databases.find((d) => d.binding === dbName || d.name === dbName);

        if (!db) {
          throw new Error(`Database '${dbName}' not found`);
        }

        // Get schema by querying sqlite_master
        const schemaResult = await db.database
          .prepare("SELECT name, sql FROM sqlite_master WHERE type='table'")
          .all();

        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(schemaResult.results, null, 2),
              },
            ],
          },
        };
      }

      case "list_r2_buckets": {
        // First, get all bound buckets
        const boundBuckets = getAllR2Buckets(env);
        const boundBucketMap = new Map(boundBuckets.map(b => [b.name.toLowerCase(), b.binding]));

        // If Cloudflare API token is available, fetch ALL buckets from account
        if (env.CLOUDFLARE_API_TOKEN && env.CLOUDFLARE_ACCOUNT_ID) {
          try {
            const apiResponse = await fetch(
              `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/r2/buckets?per_page=1000`,
              {
                headers: {
                  'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (apiResponse.ok) {
              const apiData = await apiResponse.json();
              if (apiData.success && apiData.result && apiData.result.buckets) {
                // Map all buckets from API, matching bindings where available
                const allBuckets = apiData.result.buckets.map((bucket: any) => ({
                  name: bucket.name,
                  binding: boundBucketMap.get(bucket.name.toLowerCase()) || null,
                  creationDate: bucket.creation_date,
                  isBound: boundBucketMap.has(bucket.name.toLowerCase()),
                }));

                return {
                  jsonrpc: "2.0",
                  id: request.id,
                  result: {
                    content: [
                      {
                        type: "text",
                        text: JSON.stringify(allBuckets, null, 2),
                      },
                    ],
                  },
                };
              }
            }
          } catch (error) {
            console.error('[MCP] Error fetching buckets from API:', error);
            // Fall through to return bound buckets only
          }
        }

        // Fallback: return only bound buckets
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  boundBuckets.map((b) => ({
                    name: b.name,
                    binding: b.binding,
                    isBound: true,
                  })),
                  null,
                  2
                ),
              },
            ],
          },
        };
      }

      case "list_r2_objects": {
        const { bucket: bucketName, prefix = "", limit = 1000 } = args;
        const buckets = getAllR2Buckets(env);
        const bucket = buckets.find((b) => b.binding === bucketName || b.name === bucketName);

        if (!bucket) {
          throw new Error(`Bucket '${bucketName}' not found. Available: ${buckets.map((b) => b.name).join(", ")}`);
        }

        const objects = await bucket.bucket.list({ prefix, limit });
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    objects: objects.objects.map((obj) => ({
                      key: obj.key,
                      size: obj.size,
                      etag: obj.etag,
                      uploaded: obj.uploaded,
                    })),
                    truncated: objects.truncated,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        };
      }

      case "get_r2_bucket_stats": {
        const { bucket: bucketName } = args;
        const buckets = getAllR2Buckets(env);
        const bucket = buckets.find((b) => b.binding === bucketName || b.name === bucketName);

        if (!bucket) {
          throw new Error(`Bucket '${bucketName}' not found. Available: ${buckets.map((b) => b.name).join(", ")}`);
        }

        // Calculate total size and object count by listing all objects
        let totalSize = 0;
        let objectCount = 0;
        let cursor: string | undefined;
        let lastModified: Date | null = null;

        do {
          const result = await bucket.bucket.list({ limit: 1000, cursor });
          objectCount += result.objects.length;
          for (const obj of result.objects) {
            totalSize += obj.size || 0;
            if (obj.uploaded && (!lastModified || new Date(obj.uploaded) > lastModified)) {
              lastModified = new Date(obj.uploaded);
            }
          }
          cursor = result.cursor;
        } while (cursor);

        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    bucket: bucketName,
                    name: bucket.name,
                    binding: bucket.binding,
                    totalSize,
                    objectCount,
                    lastModified: lastModified?.toISOString() || null,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        };
      }

      case "read_r2_object": {
        const { bucket: bucketName, key } = args;
        const buckets = getAllR2Buckets(env);
        const bucket = buckets.find((b) => b.binding === bucketName || b.name === bucketName);

        if (!bucket) {
          throw new Error(`Bucket '${bucketName}' not found`);
        }

        const object = await bucket.bucket.get(key);
        if (!object) {
          throw new Error(`Object '${key}' not found in bucket '${bucketName}'`);
        }

        const text = await object.text();
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: text,
                mimeType: object.httpMetadata?.contentType || "text/plain",
              },
            ],
          },
        };
      }

      case "upload_r2_object": {
        const { bucket: bucketName, key, content, contentType = "text/plain" } = args;
        const buckets = getAllR2Buckets(env);
        const bucket = buckets.find((b) => b.binding === bucketName || b.name === bucketName);

        if (!bucket) {
          throw new Error(`Bucket '${bucketName}' not found`);
        }

        // Handle base64 data URLs (data:image/png;base64,...)
        let fileContent: string | ArrayBuffer | Uint8Array;
        if (typeof content === 'string' && content.startsWith('data:')) {
          // Extract base64 part from data URL
          const base64Match = content.match(/^data:[^;]+;base64,(.+)$/);
          if (base64Match) {
            try {
              // Convert base64 to ArrayBuffer
              const base64Data = base64Match[1];
              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              fileContent = bytes;
            } catch (error: any) {
              throw new Error(`Failed to decode base64: ${error.message}`);
            }
          } else {
            // Plain text data URL (data:text/plain;charset=utf-8,text)
            const textMatch = content.match(/^data:[^;]+(?:;charset=[^,]+)?,(.+)$/);
            if (textMatch) {
              fileContent = decodeURIComponent(textMatch[1]);
            } else {
              // Fallback: use content as-is
              fileContent = content;
            }
          }
        } else if (typeof content === 'string') {
          // Plain string content
          fileContent = content;
        } else {
          // Already binary
          fileContent = content;
        }

        await bucket.bucket.put(key, fileContent, {
          httpMetadata: {
            contentType,
          },
        });

        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({ success: true, key, bucket: bucketName }),
              },
            ],
          },
        };
      }

      case "list_kv_namespaces": {
        const namespaces: string[] = [];
        if (env.KV_CACHE) namespaces.push("KV_CACHE");
        if (env.KV_CONFIG) namespaces.push("KV_CONFIG");

        for (const [key] of Object.entries(env)) {
          if (key.startsWith("KV_") && env[key] instanceof KVNamespace) {
            namespaces.push(key);
          }
        }

        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(namespaces, null, 2),
              },
            ],
          },
        };
      }

      case "read_kv": {
        const { namespace: nsName, key } = args;
        const kv = env[nsName] as KVNamespace | undefined;

        if (!kv || !(kv instanceof KVNamespace)) {
          throw new Error(`KV namespace '${nsName}' not found`);
        }

        const value = await kv.get(key);
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: value || "",
              },
            ],
          },
        };
      }

      case "write_kv": {
        const { namespace: nsName, key, value, expirationTtl } = args;
        const kv = env[nsName] as KVNamespace | undefined;

        if (!kv || !(kv instanceof KVNamespace)) {
          throw new Error(`KV namespace '${nsName}' not found`);
        }

        await kv.put(key, value, expirationTtl ? { expirationTtl } : undefined);
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({ success: true, key, namespace: nsName }),
              },
            ],
          },
        };
      }

      // Phase 2: Workflow Automation Tools
      case "list_workers": {
        if (!env.CLOUDFLARE_API_TOKEN) {
          throw new Error("CLOUDFLARE_API_TOKEN not configured");
        }

        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/workers/scripts`,
          {
            headers: {
              Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to list workers: ${error}`);
        }

        const data = await response.json();
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(data.result || [], null, 2),
              },
            ],
          },
        };
      }

      case "get_worker_logs": {
        const { workerName, limit = 100 } = args;
        if (!env.CLOUDFLARE_API_TOKEN) {
          throw new Error("CLOUDFLARE_API_TOKEN not configured");
        }

        // Note: Worker logs require Workers Paid plan or Analytics Engine
        // This is a simplified implementation
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  message: "Worker logs require Workers Paid plan. Use Cloudflare Dashboard or Analytics Engine API.",
                  workerName,
                }),
              },
            ],
          },
        };
      }

      case "create_r2_bucket": {
        const { bucketName } = args;
        if (!env.CLOUDFLARE_API_TOKEN) {
          throw new Error("CLOUDFLARE_API_TOKEN not configured");
        }

        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/r2/buckets`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: bucketName }),
          }
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to create bucket: ${error}`);
        }

        const data = await response.json();
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({ success: true, bucket: data.result }),
              },
            ],
          },
        };
      }

      case "create_d1_database": {
        const { databaseName } = args;
        if (!env.CLOUDFLARE_API_TOKEN) {
          throw new Error("CLOUDFLARE_API_TOKEN not configured");
        }

        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: databaseName }),
          }
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to create database: ${error}`);
        }

        const data = await response.json();
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({ success: true, database: data.result }),
              },
            ],
          },
        };
      }

      case "test_endpoint": {
        const { url, method = "GET", headers = {}, body } = args;

        const response = await fetch(url, {
          method,
          headers: headers as HeadersInit,
          body: body || undefined,
        });

        const responseText = await response.text();
        let responseBody;
        try {
          responseBody = JSON.parse(responseText);
        } catch {
          responseBody = responseText;
        }

        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    body: responseBody,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        };
      }

      // Phase 3: Enhanced File Management
      case "delete_r2_object": {
        const { bucket: bucketName, key } = args;
        const buckets = getAllR2Buckets(env);
        const bucket = buckets.find((b) => b.binding === bucketName || b.name === bucketName);

        if (!bucket) {
          throw new Error(`Bucket '${bucketName}' not found`);
        }

        await bucket.bucket.delete(key);
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({ success: true, key, bucket: bucketName }),
              },
            ],
          },
        };
      }

      case "copy_r2_object": {
        const { sourceBucket: srcBucketName, sourceKey: srcKey, destBucket: destBucketName, destKey } = args;
        const buckets = getAllR2Buckets(env);
        const srcBucket = buckets.find((b) => b.binding === srcBucketName || b.name === srcBucketName);
        const destBucket = buckets.find((b) => b.binding === destBucketName || b.name === destBucketName);

        if (!srcBucket) {
          throw new Error(`Source bucket '${srcBucketName}' not found`);
        }
        if (!destBucket) {
          throw new Error(`Destination bucket '${destBucketName}' not found`);
        }

        // Get object from source
        const sourceObject = await srcBucket.bucket.get(srcKey);
        if (!sourceObject) {
          throw new Error(`Source object '${srcKey}' not found`);
        }

        // Copy to destination
        await destBucket.bucket.put(destKey, sourceObject.body, {
          httpMetadata: sourceObject.httpMetadata,
        });

        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  source: { bucket: srcBucketName, key: srcKey },
                  destination: { bucket: destBucketName, key: destKey },
                }),
              },
            ],
          },
        };
      }

      // Phase 4: Project Management Helpers
      case "get_project_info": {
        // Note: Workers can't access local filesystem directly
        // This would need to be handled by the bridge server
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  message: "Project info requires local file access. Use bridge server or implement via R2.",
                  note: "This tool requires bridge server implementation for local file access.",
                }),
              },
            ],
          },
        };
      }

      case "list_projects": {
        // Note: Workers can't access local filesystem directly
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  message: "Listing projects requires local file access. Use bridge server.",
                  note: "This tool requires bridge server implementation for local file access.",
                }),
              },
            ],
          },
        };
      }

      case "backup_project": {
        // Note: Workers can't access local filesystem directly
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  message: "Project backup requires local file access. Use bridge server to sync files to R2 first.",
                  note: "This tool requires bridge server implementation for local file access.",
                }),
              },
            ],
          },
        };
      }

      // Phase 5: Team Management & SSH
      case "list_team_members": {
        const { getAllTeamMembers } = await import('./team-management');
        const members = await getAllTeamMembers(env);
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(members, null, 2),
              },
            ],
          },
        };
      }

      case "get_team_member": {
        const { getTeamMember } = await import('./team-management');
        const { email } = args;
        const member = await getTeamMember(env, email);
        if (!member) {
          throw new Error(`Team member not found: ${email}`);
        }
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(member, null, 2),
              },
            ],
          },
        };
      }

      case "send_team_notification": {
        const { sendNotification, getAllTeamMembers } = await import('./team-management');
        const { recipient, title, message, type = 'update' } = args;

        if (recipient === 'all') {
          const members = await getAllTeamMembers(env);
          for (const member of members) {
            await sendNotification(env, {
              type: type as any,
              title,
              message,
              recipient: member.email,
            });
          }
          return {
            jsonrpc: "2.0",
            id: request.id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    sent: members.length,
                    message: `Notification sent to ${members.length} team members`,
                  }),
                },
              ],
            },
          };
        } else {
          await sendNotification(env, {
            type: type as any,
            title,
            message,
            recipient,
          });
          return {
            jsonrpc: "2.0",
            id: request.id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    message: `Notification sent to ${recipient}`,
                  }),
                },
              ],
            },
          };
        }
      }

      case "list_ssh_connections": {
        const { getUserSSHConnections } = await import('./ssh-api');
        const { email } = args;
        const connections = await getUserSSHConnections(env, email);
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(connections, null, 2),
              },
            ],
          },
        };
      }

      case "execute_ssh_command": {
        const { getUserSSHConnections, executeSSHCommand, validateSSHAccess } = await import('./ssh-api');
        const { connectionId, command, workingDirectory, email = 'sam@meauxbility.org' } = args;

        // Validate SSH access
        const hasAccess = await validateSSHAccess(env, email);
        if (!hasAccess) {
          throw new Error(`SSH access not enabled for ${email}`);
        }

        // Get connection
        const connections = await getUserSSHConnections(env, email);
        const connection = connections.find(c => c.id === connectionId);
        if (!connection) {
          throw new Error(`SSH connection not found: ${connectionId}`);
        }

        // Execute command
        const result = await executeSSHCommand(env, connection, {
          connectionId,
          command,
          workingDirectory,
        });

        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          },
        };
      }

      default:
        log('warn', `Unknown tool called: ${name}`);
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    log('error', `Tool execution error: ${name}`, { error: error.message, stack: error.stack });
    return {
      jsonrpc: "2.0",
      id: request.id,
      error: {
        code: -32603,
        message: error.message || "Internal error",
        data: error.stack,
      },
    };
  }
}

async function handleResourcesList(request: MCPRequest, env: Env): Promise<MCPResponse> {
  const resources = [];

  // Add D1 databases as resources
  const databases = getAllD1Databases(env);
  for (const db of databases) {
    resources.push({
      uri: `d1://${db.name}`,
      name: `D1 Database: ${db.name}`,
      description: `Access D1 database ${db.name}`,
      mimeType: "application/json",
    });
  }

  // Add R2 buckets as resources
  const buckets = getAllR2Buckets(env);
  for (const bucket of buckets) {
    resources.push({
      uri: `r2://${bucket.name}`,
      name: `R2 Bucket: ${bucket.name}`,
      description: `Access R2 bucket ${bucket.name}`,
      mimeType: "application/json",
    });
  }

  return {
    jsonrpc: "2.0",
    id: request.id,
    result: { resources },
  };
}

async function handleResourcesRead(request: MCPRequest, env: Env): Promise<MCPResponse> {
  const { uri } = request.params;

  if (uri.startsWith("d1://")) {
    const dbName = uri.replace("d1://", "");
    const databases = getAllD1Databases(env);
    const db = databases.find((d) => d.name === dbName);

    if (!db) {
      throw new Error(`Database '${dbName}' not found`);
    }

    const tables = await db.database.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(tables.results, null, 2),
          },
        ],
      },
    };
  }

  if (uri.startsWith("r2://")) {
    const bucketName = uri.replace("r2://", "");
    const buckets = getAllR2Buckets(env);
    const bucket = buckets.find((b) => b.name === bucketName);

    if (!bucket) {
      throw new Error(`Bucket '${bucketName}' not found`);
    }

    const objects = await bucket.bucket.list({ limit: 100 });
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              objects.objects.map((obj) => ({
                key: obj.key,
                size: obj.size,
                uploaded: obj.uploaded,
              })),
              null,
              2
            ),
          },
        ],
      },
    };
  }

  throw new Error(`Unsupported URI scheme: ${uri}`);
}

// Request validation
function validateMCPRequest(request: any): request is MCPRequest {
  if (!request || typeof request !== 'object') {
    return false;
  }
  if (request.jsonrpc !== "2.0") {
    return false;
  }
  if (typeof request.method !== 'string') {
    return false;
  }
  return true;
}

// Logging helper
function log(level: 'info' | 'error' | 'warn', message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data }),
  };
  // In production, you might want to send this to a logging service
  if (level === 'error') {
    console.error(`[${timestamp}] [${level.toUpperCase()}]`, message, data || '');
  } else {
    console.log(`[${timestamp}] [${level.toUpperCase()}]`, message, data || '');
  }
}

// Main MCP handler
async function handleMCPRequest(request: MCPRequest, env: Env): Promise<MCPResponse> {
  try {
    if (!validateMCPRequest(request)) {
      log('error', 'Invalid MCP request', request);
      return {
        jsonrpc: "2.0",
        id: request.id || null,
        error: {
          code: -32600,
          message: "Invalid Request",
        },
      };
    }

    log('info', `Handling MCP request: ${request.method}`, { id: request.id });

    switch (request.method) {
      case "initialize":
        return handleInitialize(request, env);
      case "tools/list":
        return handleToolsList(request, env);
      case "tools/call":
        return handleToolsCall(request, env);
      case "resources/list":
        return handleResourcesList(request, env);
      case "resources/read":
        return handleResourcesRead(request, env);
      default:
        log('warn', `Unknown method: ${request.method}`);
        return {
          jsonrpc: "2.0",
          id: request.id,
          error: {
            code: -32601,
            message: `Method not found: ${request.method}`,
          },
        };
    }
  } catch (error: any) {
    log('error', 'Error handling MCP request', { method: request.method, error: error.message, stack: error.stack });
    return {
      jsonrpc: "2.0",
      id: request.id || null,
      error: {
        code: -32603,
        message: "Internal error",
        data: error.message,
      },
    };
  }
}

// Main Worker handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: getCORSHeaders() });
    }

    // Southern Pets Animal Rescue Routes
    const hostname = url.hostname;
    const isSouthernPets = hostname === 'southernpetsanimalrescue.com' || hostname === 'www.southernpetsanimalrescue.com' || hostname.includes('southernpetsanimalrescue') || hostname.includes('southernpetsemailworker');

    if (isSouthernPets) {
      // Dashboard
      if (pathname === '/dashboard') {
        return new Response(getSouthernPetsDashboardHTML(), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      }

      // Gallery API Routes
      if (pathname.startsWith('/api/gallery')) {
        const { handleGalleryList, handleGalleryUpload, handleGalleryUpdate, handleGalleryDelete } = await import('./southernpets-gallery-api');

        if (pathname === '/api/gallery' && request.method === 'GET') {
          return handleGalleryList(request, env);
        }
        if (pathname === '/api/gallery/upload' && request.method === 'POST') {
          return handleGalleryUpload(request, env);
        }
        if (pathname === '/api/gallery/update' && request.method === 'POST') {
          return handleGalleryUpdate(request, env);
        }
        if (pathname === '/api/gallery/delete' && request.method === 'DELETE') {
          return handleGalleryDelete(request, env);
        }
      }

      // Animals API Routes
      if (pathname.startsWith('/api/animals')) {
        const db = env.DB || (env as any).SOUTHERNPETS_DB;
        if (!db) {
          return new Response(JSON.stringify({ success: false, error: 'Database not configured' }), {
            status: 500,
            headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
          });
        }

        try {
          // GET /api/animals - List all animals
          if (pathname === '/api/animals' && request.method === 'GET') {
            const animals = await db.prepare('SELECT * FROM animals ORDER BY name').all();

            // Get photos for each animal
            const animalsWithPhotos = await Promise.all((animals.results || []).map(async (animal: any) => {
              const photos = await db.prepare('SELECT * FROM animal_images WHERE animalId = ? ORDER BY isPrimary DESC, uploadedAt DESC')
                .bind(animal.id.toString()).all();
              return {
                ...animal,
                photos: photos.results || []
              };
            }));

            return new Response(JSON.stringify({
              success: true,
              animals: animalsWithPhotos
            }), {
              headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
            });
          }

          // GET /api/animals/:id - Get single animal
          if (pathname.match(/^\/api\/animals\/\d+$/) && request.method === 'GET') {
            const animalId = pathname.split('/').pop();
            const animal = await db.prepare('SELECT * FROM animals WHERE id = ?').bind(animalId).first();

            if (!animal) {
              return new Response(JSON.stringify({ success: false, error: 'Animal not found' }), {
                status: 404,
                headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
              });
            }

            const photos = await db.prepare('SELECT * FROM animal_images WHERE animalId = ? ORDER BY isPrimary DESC, uploadedAt DESC')
              .bind(animalId).all();

            return new Response(JSON.stringify({
              success: true,
              animal: {
                ...animal,
                photos: photos.results || []
              }
            }), {
              headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
            });
          }

          // POST /api/animals - Create animal
          if (pathname === '/api/animals' && request.method === 'POST') {
            const body = await request.json();
            const now = new Date().toISOString();

            const result = await db.prepare(`
              INSERT INTO animals (name, species, breed, age, gender, status, bio, adoption_fee, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              body.name,
              body.species || 'dog',
              body.breed || '',
              body.age || '',
              body.gender || '',
              body.status || 'available',
              body.bio || '',
              body.adoption_fee || (body.species === 'dog' ? 250 : 150),
              now,
              now
            ).run();

            return new Response(JSON.stringify({
              success: true,
              animal: { id: result.meta.last_row_id, ...body }
            }), {
              headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
            });
          }

          // PUT /api/animals/:id - Update animal
          if (pathname.match(/^\/api\/animals\/\d+$/) && request.method === 'PUT') {
            const animalId = pathname.split('/').pop();
            const body = await request.json();
            const now = new Date().toISOString();

            await db.prepare(`
              UPDATE animals 
              SET name = ?, species = ?, breed = ?, age = ?, gender = ?, status = ?, bio = ?, adoption_fee = ?, updated_at = ?
              WHERE id = ?
            `).bind(
              body.name,
              body.species,
              body.breed,
              body.age,
              body.gender,
              body.status,
              body.bio,
              body.adoption_fee,
              now,
              animalId
            ).run();

            return new Response(JSON.stringify({
              success: true,
              message: 'Animal updated'
            }), {
              headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
            });
          }
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
          });
        }
      }

      // Adoption & TNR API Routes
      if (pathname === '/api/adoption/submit' && request.method === 'POST') {
        const { handleAdoptionSubmit } = await import('./southernpets-adoption-api');
        return handleAdoptionSubmit(request, env);
      }
      if (pathname === '/api/tnr/submit' && request.method === 'POST') {
        const { handleTNRSubmit } = await import('./southernpets-adoption-api');
        return handleTNRSubmit(request, env);
      }

      // Analytics API (placeholder)
      if (pathname === '/api/analytics/stats' && request.method === 'GET') {
        const db = env.DB || (env as any).SOUTHERNPETS_DB;
        if (!db) {
          return new Response(JSON.stringify({ success: false, error: 'Database not configured' }), {
            status: 500,
            headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
          });
        }

        try {
          // Get stats from database
          const [applications, adoptions, tnr] = await Promise.all([
            db.prepare('SELECT COUNT(*) as count FROM adoption_applications').first<{ count: number }>(),
            db.prepare('SELECT COUNT(*) as count FROM adoption_applications WHERE status = ?').bind('approved').first<{ count: number }>(),
            db.prepare('SELECT COUNT(*) as count FROM tnr_requests').first<{ count: number }>(),
          ]);

          return new Response(JSON.stringify({
            success: true,
            visitors: 2847, // Placeholder - would come from analytics
            applications: applications?.count || 0,
            adoptions: adoptions?.count || 0,
            tnr: tnr?.count || 0,
          }), {
            headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
          });
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
          });
        }
      }

      // Emails API (placeholder - would connect to email worker)
      if (pathname === '/api/emails' && request.method === 'GET') {
        return new Response(JSON.stringify({
          success: true,
          emails: []
        }), {
          headers: { ...getCORSHeaders(), "Content-Type": "application/json" },
        });
      }
    }

    // Dashboard route - serve at both /dashboard and root
    // Also handle iautodidact.org/dashboard routing
    if (pathname === "/" || pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
      // Check if it's a specific dashboard sub-route
      if (pathname === "/dashboard/learning" || pathname.startsWith("/dashboard/learning/")) {
        // Learning dashboard handled below
      } else {
        // Main dashboard
        return new Response(DASHBOARD_HTML, {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "text/html; charset=utf-8",
          },
        });
      }
    }

    // Learning Dashboard route
    if (pathname === "/dashboard/learning" || pathname.startsWith("/dashboard/learning/")) {
      try {
        // Try to get from R2 first
        if (env.R2_IAUTODIDACT) {
          const learningHTML = await env.R2_IAUTODIDACT.get('learning-dashboard.html');
          if (learningHTML) {
            return new Response(learningHTML.body, {
              headers: {
                ...getCORSHeaders(),
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=3600",
              },
            });
          }
        }

        // Fallback: serve embedded version or redirect
        return Response.redirect(new URL('/dashboard', request.url).toString(), 302);
      } catch (error) {
        return Response.redirect(new URL('/dashboard', request.url).toString(), 302);
      }
    }

    // iAccess / GODMODE route
    if (pathname === "/iaccess") {
      return new Response(IACCESS_HTML, {
        headers: {
          ...getCORSHeaders(),
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    // Course API endpoints
    if (pathname === "/api/courses/meauxcloud" && request.method === "GET") {
      try {
        if (env.R2_IAUTODIDACT) {
          const courseData = await env.R2_IAUTODIDACT.get('courses/meauxcloud-course.json');
          if (courseData) {
            return new Response(courseData.body, {
              headers: {
                ...getCORSHeaders(),
                "Content-Type": "application/json",
              },
            });
          }
        }
        return new Response(JSON.stringify({ error: "Course data not found" }), {
          status: 404,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    }

    // HTML Remaster API
    if (pathname === "/api/remaster" && request.method === "POST") {
      try {
        const { remasterHTML, uploadRemasteredHTML } = await import('./html-remaster');
        const body = await request.json();
        const { html, options = {} } = body;

        if (!html) {
          return new Response(JSON.stringify({ error: "HTML content required" }), {
            status: 400,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        const remastered = remasterHTML(html, options);

        // Optionally upload to R2
        let filename = null;
        if (options.uploadToR2 && env.R2_IAUTODIDACT) {
          filename = await uploadRemasteredHTML(env, options.filename || 'remastered.html', remastered);
        }

        return new Response(JSON.stringify({
          success: true,
          remastered,
          filename,
          size: remastered.length,
        }), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    }

    // Chat API endpoint
    if (pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const { message, context } = body;

        // Use ChatGPT or Claude for responses
        if (env.OPENAI_API_KEY) {
          const { logUsage } = await import('./openai-tracking');
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
              ...(env.OPENAI_ORG_ID ? { 'OpenAI-Organization': env.OPENAI_ORG_ID } : {}),
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                {
                  role: 'system',
                  content: `You are a helpful learning assistant for the MeauxCloud course platform. Help users learn about Cloudflare, coding, and software development. Be clear, concise, and educational.`
                },
                {
                  role: 'user',
                  content: message
                }
              ],
              max_tokens: 1000,
            }),
          });

          const data = await response.json();
          const assistantMessage = data.choices?.[0]?.message?.content || "I'm here to help! Ask me about Cloudflare, coding, or the course material.";

          // Log usage
          if (data.usage) {
            await logUsage(env, {
              model: data.model || 'gpt-4o',
              promptTokens: data.usage.prompt_tokens || 0,
              completionTokens: data.usage.completion_tokens || 0,
              user: 'learning-assistant',
            });
          }

          return new Response(JSON.stringify({
            response: assistantMessage,
            model: data.model,
          }), {
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        // Fallback response
        return new Response(JSON.stringify({
          response: "I'm here to help! Ask me about Cloudflare, coding, or the course material. (AI assistant requires API key configuration)"
        }), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    }

    // Wrangler CLI execution endpoint
    if (pathname === "/api/wrangler/execute" && request.method === "POST") {
      try {
        const body = await request.json();
        const { command } = body;

        // Note: Actual wrangler execution requires server-side access
        // This is a simulation/helper endpoint
        const simulatedOutput = `Executing: ${command}\n\nNote: Wrangler CLI commands require server-side execution. For production, use Cloudflare API directly:\n- wrangler deploy → Use Workers API\n- wrangler secret put → Use Secrets API\n- wrangler d1 execute → Use D1 API\n\nThis terminal is for learning and demonstration purposes.`;

        return new Response(JSON.stringify({
          output: simulatedOutput,
          command,
        }), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    }

    // User Preferences API
    if (pathname === "/api/user/preferences" && request.method === "GET") {
      try {
        const { verifySession } = await import('./auth');
        const { getUserPreferences } = await import('./user-preferences');

        const auth = await verifySession(env, request);
        if (!auth.authenticated || !auth.user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        const preferences = await getUserPreferences(env, auth.user.email);
        return new Response(JSON.stringify(preferences || { error: "Preferences not found" }), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    }

    if (pathname === "/api/user/preferences" && request.method === "POST") {
      try {
        const { verifySession } = await import('./auth');
        const { setUserPreferences } = await import('./user-preferences');

        const auth = await verifySession(env, request);
        if (!auth.authenticated || !auth.user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        const body = await request.json();
        const preferences = {
          email: auth.user.email,
          ...body,
        };

        await setUserPreferences(env, preferences);
        return new Response(JSON.stringify({ success: true, preferences }), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    }

    // Deployment Confirmation API
    if (pathname === "/api/deployment/confirm" && request.method === "GET") {
      try {
        const { verifySession } = await import('./auth');
        const { getDeploymentConfirmation } = await import('./user-preferences');

        const auth = await verifySession(env, request);
        if (!auth.authenticated || !auth.user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        // Only admins can view deployment confirmation
        if (auth.user.role !== 'admin') {
          return new Response(JSON.stringify({ error: "Admin access required" }), {
            status: 403,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        const confirmation = await getDeploymentConfirmation(env);
        return new Response(JSON.stringify(confirmation), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    }

    // Deployment Execute API (requires confirmation)
    if (pathname === "/api/deployment/execute" && request.method === "POST") {
      try {
        const { verifySession } = await import('./auth');

        const auth = await verifySession(env, request);
        if (!auth.authenticated || !auth.user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        // Only admins can execute deployments
        if (auth.user.role !== 'admin') {
          return new Response(JSON.stringify({ error: "Admin access required" }), {
            status: 403,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        const body = await request.json();
        const { confirmed, deploymentType } = body;

        if (!confirmed) {
          return new Response(JSON.stringify({ error: "Deployment not confirmed" }), {
            status: 400,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        // Return deployment instructions (actual deployment would happen via wrangler CLI)
        return new Response(JSON.stringify({
          success: true,
          message: "Deployment confirmed. Run 'wrangler deploy' to execute.",
          deploymentType,
          timestamp: new Date().toISOString(),
        }), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    }

    // File serving endpoint
    if (pathname.startsWith("/api/file/")) {
      const parts = pathname.split("/");
      if (parts.length >= 4) {
        const bucketName = parts[3];
        const fileKey = decodeURIComponent(parts.slice(4).join("/"));
        const buckets = getAllR2Buckets(env);
        const bucket = buckets.find((b) => b.binding === bucketName || b.name === bucketName);

        if (!bucket) {
          return new Response("Bucket not found", { status: 404 });
        }

        try {
          const object = await bucket.bucket.get(fileKey);
          if (!object) {
            return new Response("File not found", { status: 404 });
          }

          const headers = new Headers({
            ...getCORSHeaders(),
            "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
          });

          if (object.httpMetadata?.contentDisposition) {
            headers.set("Content-Disposition", object.httpMetadata.contentDisposition);
          }

          return new Response(object.body, { headers });
        } catch (error: any) {
          return new Response(`Error: ${error.message}`, { status: 500 });
        }
      }
    }

    // Health check
    if (pathname === "/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          service: "cloudflare-mcp-server",
          version: "1.0.0",
        }),
        {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
    }

    // MCP endpoint
    if (pathname === "/mcp" || pathname === "/mcp/") {
      // Optional auth check
      if (env.MCP_AUTH_TOKEN) {
        const authHeader = request.headers.get("Authorization");
        if (authHeader !== `Bearer ${env.MCP_AUTH_TOKEN}`) {
          return new Response(
            JSON.stringify({
              jsonrpc: "2.0",
              id: null,
              error: { code: -32000, message: "Unauthorized" },
            }),
            {
              status: 401,
              headers: {
                ...getCORSHeaders(),
                "Content-Type": "application/json",
              },
            }
          );
        }
      }

      if (request.method === "POST") {
        try {
          const mcpRequest: MCPRequest = await request.json();
          const response = await handleMCPRequest(mcpRequest, env);
          return new Response(JSON.stringify(response), {
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        } catch (error: any) {
          return new Response(
            JSON.stringify({
              jsonrpc: "2.0",
              id: null,
              error: {
                code: -32700,
                message: "Parse error",
                data: error.message,
              },
            }),
            {
              status: 400,
              headers: {
                ...getCORSHeaders(),
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
    }

    // SSE endpoint for real-time updates (optional)
    if (pathname === "/mcp/sse") {
      const stream = new ReadableStream({
        start(controller) {
          // Send initial connection message
          controller.enqueue(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

          // Keep connection alive
          const interval = setInterval(() => {
            controller.enqueue(`: keepalive\n\n`);
          }, 30000);

          // Cleanup on close
          request.signal?.addEventListener("abort", () => {
            clearInterval(interval);
            controller.close();
          });
        },
      });

      return new Response(stream, {
        headers: {
          ...getCORSHeaders(),
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Team API endpoints
    if (pathname.startsWith("/api/team/")) {
      if (pathname === "/api/team/members" && request.method === "GET") {
        const { getAllTeamMembers } = await import('./team-management');
        const members = await getAllTeamMembers(env);
        return new Response(JSON.stringify(members), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }

      if (pathname === "/api/team/notify" && request.method === "POST") {
        const { sendNotification, getAllTeamMembers } = await import('./team-management');
        const body = await request.json();
        const { recipient, title, message, type = 'update' } = body;

        if (recipient === 'all') {
          const members = await getAllTeamMembers(env);
          for (const member of members) {
            await sendNotification(env, { type, title, message, recipient: member.email });
          }
          return new Response(JSON.stringify({ success: true, sent: members.length }), {
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        } else {
          await sendNotification(env, { type, title, message, recipient });
          return new Response(JSON.stringify({ success: true }), {
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }
      }
    }

    // SSH API endpoints
    if (pathname.startsWith("/api/ssh/")) {
      if (pathname === "/api/ssh/connections" && request.method === "GET") {
        const { getUserSSHConnections } = await import('./ssh-api');
        const email = url.searchParams.get('email') || 'sam@meauxbility.org';
        const connections = await getUserSSHConnections(env, email);
        return new Response(JSON.stringify(connections), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }

      if (pathname === "/api/ssh/execute" && request.method === "POST") {
        const { getUserSSHConnections, executeSSHCommand, validateSSHAccess } = await import('./ssh-api');
        const body = await request.json();
        const { connectionId, command, workingDirectory, email = 'sam@meauxbility.org' } = body;

        const hasAccess = await validateSSHAccess(env, email);
        if (!hasAccess) {
          return new Response(JSON.stringify({ error: "SSH access not enabled" }), {
            status: 403,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        const connections = await getUserSSHConnections(env, email);
        const connection = connections.find(c => c.id === connectionId);
        if (!connection) {
          return new Response(JSON.stringify({ error: "Connection not found" }), {
            status: 404,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        const result = await executeSSHCommand(env, connection, {
          connectionId,
          command,
          workingDirectory,
        });

        return new Response(JSON.stringify(result), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    }

    // Authentication endpoints
    if (pathname === "/api/auth/login" && request.method === "POST") {
      const { validateUser, createSession } = await import('./auth');
      const body = await request.json();
      const { email, password } = body;

      const validation = validateUser(email, password);
      if (!validation.valid || !validation.user) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid email or password'
        }), {
          status: 401,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }

      const { sessionId, expiresAt } = await createSession(env, validation.user);

      return new Response(JSON.stringify({
        success: true,
        user: validation.user
      }), {
        headers: {
          ...getCORSHeaders(),
          "Content-Type": "application/json",
          "Set-Cookie": `meaux_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
        },
      });
    }

    if (pathname === "/api/auth/logout" && request.method === "POST") {
      const { getSessionId, deleteSession } = await import('./auth');
      const sessionId = getSessionId(request);

      if (sessionId) {
        await deleteSession(env, sessionId);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          ...getCORSHeaders(),
          "Content-Type": "application/json",
          "Set-Cookie": "meaux_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
        },
      });
    }

    if (pathname === "/api/auth/me" && request.method === "GET") {
      const { verifySession } = await import('./auth');
      const auth = await verifySession(env, request);

      return new Response(JSON.stringify(auth), {
        headers: {
          ...getCORSHeaders(),
          "Content-Type": "application/json",
        },
      });
    }

    // Helper API endpoints (ChatGPT, Claude, Cloudflare AI, Wrangler)
    if (pathname.startsWith("/api/helper/")) {
      // Verify authentication for helper endpoints
      const { verifySession } = await import('./auth');
      const auth = await verifySession(env, request);

      if (!auth.authenticated) {
        return new Response(JSON.stringify({
          error: "Authentication required",
          message: "Please log in to use AI helpers"
        }), {
          status: 401,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }

      if (pathname === "/api/helper/chatgpt" && request.method === "POST") {
        const body = await request.json();
        const { prompt, user } = body;

        if (!env.OPENAI_API_KEY) {
          return new Response(JSON.stringify({
            output: "Error: OpenAI API key not configured. Please set OPENAI_API_KEY secret.",
            tool: 'chatgpt',
            error: true
          }), {
            status: 500,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        try {
          // Determine model from prompt or use default
          // Supports: gpt-4, gpt-4-turbo, gpt-3.5-turbo, gpt-4o, etc.
          let model = 'gpt-4o'; // Default to latest GPT-4 Omni
          let systemPrompt = 'You are a helpful coding assistant for the MeauxMCP development platform. Provide clear, concise, and actionable responses.';

          // Check if user specified a model in the prompt
          const modelMatch = prompt.match(/model[:\s]+(gpt-[\w-]+)/i);
          if (modelMatch) {
            model = modelMatch[1];
          }

          // Check for special instructions
          if (prompt.toLowerCase().includes('code review') || prompt.toLowerCase().includes('debug')) {
            systemPrompt = 'You are an expert code reviewer and debugger. Analyze code carefully, identify issues, and provide clear solutions.';
          } else if (prompt.toLowerCase().includes('explain') || prompt.toLowerCase().includes('how')) {
            systemPrompt = 'You are a technical educator. Explain concepts clearly with examples and best practices.';
          } else if (prompt.toLowerCase().includes('write') || prompt.toLowerCase().includes('create')) {
            systemPrompt = 'You are a senior software engineer. Write clean, production-ready code with proper error handling and documentation.';
          }

          // Call OpenAI API
          const headers: HeadersInit = {
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          };

          // Add organization ID if configured
          if (env.OPENAI_ORG_ID) {
            headers['OpenAI-Organization'] = env.OPENAI_ORG_ID;
          }

          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: 'system',
                  content: systemPrompt
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.7,
              max_tokens: 4000, // Increased for longer responses
            }),
          });

          if (!openaiResponse.ok) {
            const errorData = await openaiResponse.text();
            return new Response(JSON.stringify({
              output: `OpenAI API Error (${openaiResponse.status}): ${errorData}`,
              tool: 'chatgpt',
              error: true
            }), {
              status: openaiResponse.status,
              headers: {
                ...getCORSHeaders(),
                "Content-Type": "application/json",
              },
            });
          }

          const data = await openaiResponse.json();
          const responseText = data.choices?.[0]?.message?.content || 'No response from OpenAI';
          const finishReason = data.choices?.[0]?.finish_reason;

          // Track usage
          if (data.usage) {
            try {
              const { logUsage } = await import('./openai-tracking');
              // Get user identifier from request headers or default
              const userEmail = request.headers.get('X-User-Email') ||
                body.user ||
                'anonymous@meauxbility.org';

              await logUsage(env, {
                user: userEmail,
                model: data.model,
                promptTokens: data.usage.prompt_tokens || 0,
                completionTokens: data.usage.completion_tokens || 0,
                totalTokens: data.usage.total_tokens || 0,
                outputLength: responseText.length,
                prompt: prompt.substring(0, 200), // First 200 chars
              });
            } catch (error) {
              console.error('[OpenAI] Failed to log usage:', error);
              // Don't fail the request if logging fails
            }
          }

          // Format response with metadata
          let formattedOutput = responseText;
          if (data.usage) {
            formattedOutput += `\n\n---\n📊 Usage: ${data.usage.total_tokens} tokens (${data.usage.prompt_tokens} prompt + ${data.usage.completion_tokens} completion)`;
            formattedOutput += `\n🤖 Model: ${data.model}`;
            if (finishReason && finishReason !== 'stop') {
              formattedOutput += `\n⚠️ Finish reason: ${finishReason}`;
            }
          }

          return new Response(JSON.stringify({
            output: formattedOutput,
            tool: 'chatgpt',
            model: data.model,
            usage: data.usage,
            finishReason: finishReason
          }), {
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        } catch (error: any) {
          return new Response(JSON.stringify({
            output: `Error calling OpenAI API: ${error.message}`,
            tool: 'chatgpt',
            error: true
          }), {
            status: 500,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }
      }

      if (pathname === "/api/helper/cloudflare-ai" && request.method === "POST") {
        const body = await request.json();
        const { prompt } = body;

        // Cloudflare Workers AI integration
        try {
          // Use Cloudflare AI Gateway or Workers AI
          const aiResponse = await fetch('https://api.cloudflare.com/client/v4/accounts/' + env.CLOUDFLARE_ACCOUNT_ID + '/ai/run/@cf/meta/llama-2-7b-chat-int8', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
          });

          if (aiResponse.ok) {
            const data = await aiResponse.json();
            return new Response(JSON.stringify({
              output: JSON.stringify(data, null, 2),
              tool: 'cloudflare-ai'
            }), {
              headers: {
                ...getCORSHeaders(),
                "Content-Type": "application/json",
              },
            });
          } else {
            return new Response(JSON.stringify({
              output: `Cloudflare AI Error: ${aiResponse.statusText}\n\nNote: Ensure CLOUDFLARE_API_TOKEN has AI permissions.`,
              tool: 'cloudflare-ai'
            }), {
              headers: {
                ...getCORSHeaders(),
                "Content-Type": "application/json",
              },
            });
          }
        } catch (error: any) {
          return new Response(JSON.stringify({
            output: `Error: ${error.message}\n\nNote: Cloudflare AI requires proper API configuration.`,
            tool: 'cloudflare-ai'
          }), {
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }
      }

      if (pathname === "/api/helper/claude" && request.method === "POST") {
        const body = await request.json();
        const { prompt } = body;

        if (!env.ANTHROPIC_API_KEY) {
          return new Response(JSON.stringify({
            output: "Error: Anthropic API key not configured. Please set ANTHROPIC_API_KEY secret.",
            tool: 'claude',
            error: true
          }), {
            status: 500,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }

        try {
          // Call Claude API
          const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': env.ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'claude-3-5-sonnet-20241022',
              max_tokens: 4096,
              messages: [
                {
                  role: 'user',
                  content: prompt
                }
              ],
            }),
          });

          if (!claudeResponse.ok) {
            const errorData = await claudeResponse.text();
            return new Response(JSON.stringify({
              output: `Claude API Error (${claudeResponse.status}): ${errorData}`,
              tool: 'claude',
              error: true
            }), {
              status: claudeResponse.status,
              headers: {
                ...getCORSHeaders(),
                "Content-Type": "application/json",
              },
            });
          }

          const data = await claudeResponse.json();
          const responseText = data.content?.[0]?.text || 'No response from Claude';

          return new Response(JSON.stringify({
            output: responseText,
            tool: 'claude',
            model: data.model,
            usage: data.usage
          }), {
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        } catch (error: any) {
          return new Response(JSON.stringify({
            output: `Error calling Claude API: ${error.message}`,
            tool: 'claude',
            error: true
          }), {
            status: 500,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          });
        }
      }

      if (pathname === "/api/helper/wrangler" && request.method === "POST") {
        const body = await request.json();
        const { command } = body;

        // Wrangler CLI commands via API
        // Note: This would require server-side execution or API proxy
        return new Response(JSON.stringify({
          output: `Wrangler command: ${command}\n\nNote: Wrangler CLI commands require server-side execution. Consider using Cloudflare API directly for operations like:\n- wrangler deploy\n- wrangler secret put\n- wrangler d1 execute\n\nUse the MCP tools for direct Cloudflare operations.`,
          tool: 'wrangler'
        }), {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    }

    // OpenAI Usage Tracking API endpoints
    if (pathname === "/api/openai/summary" && request.method === "GET") {
      const { generateWeeklySummary } = await import('./openai-tracking');
      const summary = await generateWeeklySummary(env);

      if (!summary) {
        return new Response(JSON.stringify({
          error: "No usage data available",
          message: "No OpenAI usage tracked yet"
        }), {
          status: 404,
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        });
      }

      return new Response(JSON.stringify(summary), {
        headers: {
          ...getCORSHeaders(),
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname === "/api/openai/send-summary" && request.method === "POST") {
      const { sendWeeklySummary } = await import('./openai-tracking');
      const body = await request.json();
      const recipient = body.recipient || 'sam@meauxbility.org';

      const success = await sendWeeklySummary(env, recipient);

      return new Response(JSON.stringify({
        success,
        message: success
          ? `Weekly summary sent to ${recipient}`
          : "Failed to send summary. Check logs for details."
      }), {
        headers: {
          ...getCORSHeaders(),
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },

  // Scheduled handler for weekly OpenAI usage summary
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('[Scheduled] Running weekly OpenAI usage summary...');

    try {
      const { sendWeeklySummary } = await import('./openai-tracking');
      const success = await sendWeeklySummary(env, 'sam@meauxbility.org');

      if (success) {
        console.log('[Scheduled] Weekly summary sent successfully');
      } else {
        console.error('[Scheduled] Failed to send weekly summary');
      }
    } catch (error: any) {
      console.error('[Scheduled] Error in weekly summary:', error);
    }
  },
};
