/**
 * iAccess Platform Router
 * Serves HTML from R2 with proper routing and headers
 */

export interface Env {
  R2_IACCESS: R2Bucket;
  CLOUDFLARE_API_TOKEN?: string;
  ACCOUNT_ID: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Route mapping - All 13 pages + Photo Gallery
    const routes: Record<string, string> = {
      '/': 'index.html',
      '/dashboard': 'index.html',
      '/analytics': 'analytics.html',
      '/ai-gateway': 'ai-gateway.html',
      '/browser-rendering': 'browser-rendering.html',
      '/workers': 'workers.html',
      '/databases': 'databases.html',
      '/storage': 'storage.html',
      '/kv': 'kv.html',
      '/vectorize': 'vectorize.html',
      '/workflows': 'workflows.html',
      '/queues': 'queues.html',
      '/email': 'email.html',
      '/integrations': 'integrations.html',
      '/settings': 'settings.html',
      '/photogallery': 'photogallery.html',
      '/docs': 'README.md',
      '/integration': 'INTEGRATION.md'
    };

    // Get file path
    let filePath = routes[url.pathname];

    // If no route match, try direct file path
    if (!filePath) {
      filePath = url.pathname.slice(1); // Remove leading slash
    }

    // Default to index.html if no file specified
    if (!filePath || filePath === '') {
      filePath = 'index.html';
    }

    try {
      // Fetch from R2
      const object = await env.R2_IACCESS.get(filePath);

      if (!object) {
        return new Response('Not Found', { status: 404 });
      }

      // Determine content type
      const contentType = getContentType(filePath);

      // Return with proper headers
      return new Response(object.body, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN'
        }
      });
    } catch (error) {
      console.error('R2 fetch error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

function getContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    'html': 'text/html; charset=utf-8',
    'css': 'text/css; charset=utf-8',
    'js': 'application/javascript; charset=utf-8',
    'json': 'application/json; charset=utf-8',
    'md': 'text/markdown; charset=utf-8',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon'
  };
  return types[ext || ''] || 'application/octet-stream';
}
