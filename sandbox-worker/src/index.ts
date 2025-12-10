/**
 * Sandbox Worker
 * Client development and deployment environment
 * Accessible to paying clients for development and testing
 */

export interface Env {
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN?: string;
  DB?: D1Database;
  R2_SANDBOX?: R2Bucket;
  KV_SESSIONS?: KVNamespace;
  KV_CONFIG?: KVNamespace;
  ENVIRONMENT?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        service: 'sandbox-worker',
        environment: env.ENVIRONMENT || 'sandbox',
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Default response
    return new Response(JSON.stringify({
      message: 'Sandbox Worker - Client Development Environment',
      environment: env.ENVIRONMENT || 'sandbox',
      endpoints: {
        health: '/health',
      },
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  },
};
