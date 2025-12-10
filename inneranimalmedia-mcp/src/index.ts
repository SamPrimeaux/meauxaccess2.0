/**
 * InnerAnimalMedia.com MCP Server
 * Pro Account Unity - Cross-Zone Deployment & Development
 * 
 * This MCP server enables the Pro account to optimally deploy and develop
 * across all zones and accounts in the Cloudflare ecosystem.
 */

/// <reference types="@cloudflare/workers-types" />

export interface Env {
  // Cloudflare API
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;

  // Zone Configuration
  PRIMARY_ZONE_ID: string; // inneranimalmedia.com zone
  PRIMARY_ZONE_NAME: string;

  // Multi-Zone Support
  ZONE_CONFIGS?: string; // JSON string of zone configurations

  // MCP Auth
  MCP_AUTH_TOKEN?: string;

  // D1 Databases
  DB?: D1Database;
  [key: `DB_${string}`]: D1Database;

  // R2 Buckets
  R2_ASSETS?: R2Bucket;
  [key: `R2_${string}`]: R2Bucket;

  // KV Namespaces
  KV_CONFIG?: KVNamespace;
  KV_DEPLOYMENTS?: KVNamespace;
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

interface ZoneConfig {
  zoneId: string;
  zoneName: string;
  accountId: string;
  plan: string;
  status: string;
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

/**
 * Get all zones in account
 */
async function getAllZones(env: Env): Promise<ZoneConfig[]> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones?account.id=${env.CLOUDFLARE_ACCOUNT_ID}`,
    {
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch zones: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result.map((zone: any) => ({
    zoneId: zone.id,
    zoneName: zone.name,
    accountId: zone.account?.id || env.CLOUDFLARE_ACCOUNT_ID,
    plan: zone.plan?.name || 'free',
    status: zone.status,
  }));
}

/**
 * Deploy worker to a zone
 */
async function deployWorkerToZone(
  env: Env,
  zoneId: string,
  workerName: string,
  script: string,
  routes?: string[]
): Promise<{ success: boolean; workerId?: string; message: string }> {
  // First, create/update the worker
  const workerResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/workers/scripts/${workerName}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/javascript',
      },
      body: script,
    }
  );

  if (!workerResponse.ok) {
    const error = await workerResponse.text();
    throw new Error(`Failed to deploy worker: ${error}`);
  }

  // If routes provided, add them
  if (routes && routes.length > 0) {
    for (const route of routes) {
      await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/workers/routes`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pattern: route,
            script: workerName,
          }),
        }
      );
    }
  }

  return {
    success: true,
    workerId: workerName,
    message: `Worker ${workerName} deployed to zone ${zoneId}`,
  };
}

/**
 * Upload file to R2 bucket
 */
async function uploadToR2(
  bucket: R2Bucket,
  key: string,
  content: string | ArrayBuffer,
  contentType?: string
): Promise<void> {
  await bucket.put(key, content, {
    httpMetadata: {
      contentType: contentType || 'application/octet-stream',
    },
  });
}

/**
 * Deploy static files to R2 and serve via worker
 */
async function deployStaticFiles(
  env: Env,
  zoneId: string,
  files: Array<{ path: string; content: string; contentType: string }>,
  bucketName: string
): Promise<{ success: boolean; urls: string[] }> {
  const bucket = env[`R2_${bucketName}`] as R2Bucket;
  if (!bucket) {
    throw new Error(`R2 bucket ${bucketName} not found`);
  }

  const urls: string[] = [];

  // Upload files to R2
  for (const file of files) {
    await uploadToR2(bucket, file.path, file.content, file.contentType);
    urls.push(`https://${zoneId}.r2.dev/${file.path}`);
  }

  return { success: true, urls };
}

/**
 * List all workers across all zones
 */
async function listAllWorkers(env: Env): Promise<any[]> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/workers/scripts`,
    {
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to list workers: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result || [];
}

/**
 * Get zone analytics
 */
async function getZoneAnalytics(env: Env, zoneId: string, since?: string): Promise<any> {
  const sinceParam = since || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/analytics/dashboard?since=${sinceParam}`,
    {
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get analytics: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * MCP Tools for Pro Account Unity
 */
const MCP_TOOLS = [
  {
    name: "list_all_zones",
    description: "List all zones in the Cloudflare account for cross-zone management",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "deploy_worker_to_zone",
    description: "Deploy a Cloudflare Worker to a specific zone",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: {
          type: "string",
          description: "Zone ID to deploy to",
        },
        workerName: {
          type: "string",
          description: "Name of the worker",
        },
        script: {
          type: "string",
          description: "Worker script code",
        },
        routes: {
          type: "array",
          items: { type: "string" },
          description: "Optional routes to add",
        },
      },
      required: ["zoneId", "workerName", "script"],
    },
  },
  {
    name: "deploy_static_files",
    description: "Deploy static files (HTML/CSS/JS) to R2 and configure serving",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: {
          type: "string",
          description: "Zone ID",
        },
        bucketName: {
          type: "string",
          description: "R2 bucket name",
        },
        files: {
          type: "array",
          items: {
            type: "object",
            properties: {
              path: { type: "string" },
              content: { type: "string" },
              contentType: { type: "string" },
            },
          },
        },
      },
      required: ["zoneId", "bucketName", "files"],
    },
  },
  {
    name: "list_all_workers",
    description: "List all workers across all zones in the account",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_zone_analytics",
    description: "Get analytics for a specific zone",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: {
          type: "string",
          description: "Zone ID",
        },
        since: {
          type: "string",
          description: "ISO timestamp for start date (optional)",
        },
      },
      required: ["zoneId"],
    },
  },
  {
    name: "create_zone_route",
    description: "Create a route for a worker in a zone",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: {
          type: "string",
          description: "Zone ID",
        },
        pattern: {
          type: "string",
          description: "Route pattern (e.g., 'example.com/*')",
        },
        script: {
          type: "string",
          description: "Worker script name",
        },
      },
      required: ["zoneId", "pattern", "script"],
    },
  },
  {
    name: "list_zone_routes",
    description: "List all routes for a zone",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: {
          type: "string",
          description: "Zone ID",
        },
      },
      required: ["zoneId"],
    },
  },
  {
    name: "get_zone_info",
    description: "Get detailed information about a zone",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: {
          type: "string",
          description: "Zone ID",
        },
      },
      required: ["zoneId"],
    },
  },
];

/**
 * Handle MCP tool call
 */
async function handleToolCall(env: Env, toolName: string, args: any): Promise<any> {
  switch (toolName) {
    case "list_all_zones":
      return { zones: await getAllZones(env) };

    case "deploy_worker_to_zone":
      return await deployWorkerToZone(
        env,
        args.zoneId,
        args.workerName,
        args.script,
        args.routes
      );

    case "deploy_static_files":
      return await deployStaticFiles(
        env,
        args.zoneId,
        args.files,
        args.bucketName
      );

    case "list_all_workers":
      return { workers: await listAllWorkers(env) };

    case "get_zone_analytics":
      return await getZoneAnalytics(env, args.zoneId, args.since);

    case "create_zone_route":
      const routeResponse = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${args.zoneId}/workers/routes`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pattern: args.pattern,
            script: args.script,
          }),
        }
      );
      if (!routeResponse.ok) {
        throw new Error(`Failed to create route: ${await routeResponse.text()}`);
      }
      return await routeResponse.json();

    case "list_zone_routes":
      const routesResponse = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${args.zoneId}/workers/routes`,
        {
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!routesResponse.ok) {
        throw new Error(`Failed to list routes: ${await routesResponse.text()}`);
      }
      return await routesResponse.json();

    case "get_zone_info":
      const zoneResponse = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${args.zoneId}`,
        {
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!zoneResponse.ok) {
        throw new Error(`Failed to get zone info: ${await zoneResponse.text()}`);
      }
      return await zoneResponse.json();

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

/**
 * Handle MCP request
 */
async function handleMCPRequest(env: Env, request: MCPRequest): Promise<MCPResponse> {
  try {
    switch (request.method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: "inneranimalmedia-mcp",
              version: "1.0.0",
            },
          },
        };

      case "tools/list":
        return {
          jsonrpc: "2.0",
          id: request.id,
          result: {
            tools: MCP_TOOLS,
          },
        };

      case "tools/call":
        const { name, arguments: args } = request.params;
        const result = await handleToolCall(env, name, args);
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

      default:
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
    return {
      jsonrpc: "2.0",
      id: request.id,
      error: {
        code: -32000,
        message: error.message || "Internal error",
      },
    };
  }
}

// Import dashboard templates
import { renderHomePage } from './templates/home';
import { renderProjectsPage } from './templates/projects';
import { renderAnalyticsPage } from './templates/analytics';
import { renderZonesPage } from './templates/zones';
import { renderWorkersPage } from './templates/workers';
import { renderSettingsPage } from './templates/settings';
import { renderAPIDocsPage } from './templates/api-docs';
import { renderLoginPage } from './templates/login';
import { renderProjects25Page } from './templates/projects-25';

/**
 * Check if user is authenticated
 */
function isAuthenticated(request: Request): boolean {
  // Check session cookie
  const cookies = request.headers.get('Cookie') || '';
  if (cookies.includes('mcp_session=')) {
    return true;
  }

  // Check Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return true;
  }

  return false;
}

/**
 * Handle login
 */
async function handleLogin(request: Request, env: Env): Promise<Response> {
  if (request.method === 'POST') {
    try {
      let email: string | null = null;
      let password: string | null = null;

      // Try to get form data
      const contentType = request.headers.get('Content-Type') || '';

      if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        email = formData.get('email') as string;
        password = formData.get('password') as string;
      } else {
        // Try JSON
        try {
          const json = await request.json();
          email = json.email;
          password = json.password;
        } catch {
          // Fallback to form data anyway
          const formData = await request.formData();
          email = formData.get('email') as string;
          password = formData.get('password') as string;
        }
      }

      // Trim and normalize
      email = email?.trim().toLowerCase() || '';
      password = password?.trim() || '';

      // Validate credentials (case-insensitive email, exact password)
      const validEmail = 'sam@meauxbility.org';
      const validPassword = '1937';

      if (email === validEmail.toLowerCase() && password === validPassword) {
        // Create session token
        const sessionToken = crypto.randomUUID();

        // Store in KV if available
        if (env.KV_CONFIG) {
          await env.KV_CONFIG.put(`session:${sessionToken}`, validEmail, {
            expirationTtl: 7 * 24 * 60 * 60, // 7 days
          });
        }

        // Redirect with session cookie
        const response = Response.redirect(new URL('/', request.url).toString(), 302);
        response.headers.set('Set-Cookie', `mcp_session=${sessionToken}; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax`);
        response.headers.append('Set-Cookie', `mcp_authenticated=true; Path=/; Max-Age=604800; SameSite=Lax`);
        return response;
      } else {
        // Redirect back with error (include debug info in query for troubleshooting)
        const debug = email && password ? `&debug=received` : '';
        return Response.redirect(new URL(`/login?error=invalid${debug}`, request.url).toString(), 302);
      }
    } catch (error: any) {
      // Log error for debugging
      console.error('Login error:', error);
      return Response.redirect(new URL(`/login?error=server&msg=${encodeURIComponent(error.message || 'Unknown error')}`, request.url).toString(), 302);
    }
  }

  return new Response(renderLoginPage(), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * Main handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: getCORSHeaders() });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Health check (JSON API)
    if (pathname === "/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          service: "inneranimalmedia-mcp",
          version: "1.0.0",
          zone: env.PRIMARY_ZONE_NAME || "inneranimalmedia.com",
        }),
        {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
    }

    // MCP endpoint (JSON-RPC)
    if (pathname === "/mcp") {
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

      const mcpRequest: MCPRequest = await request.json();
      const mcpResponse = await handleMCPRequest(env, mcpRequest);

      return new Response(JSON.stringify(mcpResponse), {
        headers: {
          ...getCORSHeaders(),
          "Content-Type": "application/json",
        },
      });
    }

    // Login page (public)
    if (pathname === "/login") {
      return handleLogin(request, env);
    }

    // Check authentication for dashboard pages (except login, health, mcp, and public API)
    const publicPaths = ["/login", "/health", "/mcp"];
    const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith("/api/");

    if (!isPublicPath) {
      const authCookie = request.headers.get('Cookie') || '';
      const hasSession = authCookie.includes('mcp_session=') || authCookie.includes('mcp_authenticated=true');

      // Also check KV for session if available
      let isAuthenticated = hasSession;

      if (!isAuthenticated && env.KV_CONFIG) {
        // Try to find session in cookies
        const sessionMatch = authCookie.match(/mcp_session=([^;]+)/);
        if (sessionMatch) {
          const sessionToken = sessionMatch[1];
          const sessionData = await env.KV_CONFIG.get(`session:${sessionToken}`);
          isAuthenticated = !!sessionData;
        }
      }

      if (!isAuthenticated) {
        // Check if it's an API request
        const acceptHeader = request.headers.get('Accept') || '';
        if (acceptHeader.includes('application/json')) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized', redirect: '/login' }),
            {
              status: 401,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        // Redirect to login for HTML requests
        return Response.redirect(new URL('/login', request.url).toString(), 302);
      }
    }

    // Dashboard Pages (HTML)
    if (pathname === "/" || pathname === "/home") {
      return new Response(renderHomePage(env), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (pathname === "/projects") {
      return new Response(renderProjectsPage(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (pathname === "/projects-25" || pathname === "/projects/last-25") {
      try {
        const workers = await listAllWorkers(env);
        // Sort by modified_on or created_on (most recent first)
        const sortedWorkers = workers.sort((a: any, b: any) => {
          const dateA = new Date(a.modified_on || a.created_on || 0).getTime();
          const dateB = new Date(b.modified_on || b.created_on || 0).getTime();
          return dateB - dateA; // Descending (newest first)
        });

        return new Response(renderProjects25Page(sortedWorkers), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (error: any) {
        return new Response(renderProjects25Page([]), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }
    }

    if (pathname === "/analytics") {
      return new Response(renderAnalyticsPage(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (pathname === "/zones") {
      try {
        const zones = await getAllZones(env);
        return new Response(renderZonesPage(zones), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (error: any) {
        return new Response(renderZonesPage([]), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }
    }

    if (pathname === "/workers") {
      try {
        const workers = await listAllWorkers(env);
        return new Response(renderWorkersPage(workers), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (error: any) {
        return new Response(renderWorkersPage([]), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }
    }

    if (pathname === "/settings") {
      return new Response(renderSettingsPage(env), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (pathname === "/api-docs" || pathname === "/api-docs/") {
      return new Response(renderAPIDocsPage(), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // API Endpoints (JSON)
    if (pathname === "/api/stats") {
      try {
        const [zones, workers] = await Promise.all([
          getAllZones(env).catch(() => []),
          listAllWorkers(env).catch(() => []),
        ]);

        return new Response(
          JSON.stringify({
            zones: zones.length,
            workers: workers.length,
            requests: 0, // TODO: Track requests
          }),
          {
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error: any) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    if (pathname === "/api/zones") {
      try {
        const zones = await getAllZones(env);
        return new Response(
          JSON.stringify({ zones }),
          {
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error: any) {
        return new Response(
          JSON.stringify({ error: error.message, zones: [] }),
          {
            status: 500,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    if (pathname === "/api/workers") {
      try {
        const workers = await listAllWorkers(env);
        return new Response(
          JSON.stringify({ workers }),
          {
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error: any) {
        return new Response(
          JSON.stringify({ error: error.message, workers: [] }),
          {
            status: 500,
            headers: {
              ...getCORSHeaders(),
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    if (pathname === "/api/projects") {
      // Return sample projects for now
      return new Response(
        JSON.stringify({
          projects: [
            { id: "meauxbility", name: "Meauxbility.org", status: "live" },
            { id: "inneranimalmedia", name: "InnerAnimalMedia.com", status: "progress" },
            { id: "iautodidact", name: "iAutodidact.org", status: "progress" },
          ],
        }),
        {
          headers: {
            ...getCORSHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 404 for unknown routes
    return new Response("Not Found", { status: 404 });
  },
};
