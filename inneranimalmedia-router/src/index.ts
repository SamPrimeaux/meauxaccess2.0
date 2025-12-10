/**
 * Inner Animal Media Router
 * Routes:
 * - Root (/) ? Proxies inner-animal-media.pages.dev
 * - /dashboard/* ? Serves iAccess dashboard from R2
 * - /api/* ? API endpoints
 */

export interface Env {
  // R2 for dashboard
  R2_IACCESS?: R2Bucket;

  // API tokens
  CLOUDFLARE_API_TOKEN?: string;
  ACCOUNT_ID?: string;

  // Pages.dev origin
  PAGES_DEV_ORIGIN?: string;
}

const PAGES_DEV_URL = 'https://inner-animal-media.pages.dev';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes - pass through to existing API worker or handle here
    if (pathname.startsWith('/api/')) {
      return handleAPI(request, env, pathname);
    }

    // Dashboard Routes - serve from R2
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/analytics') ||
      pathname.startsWith('/ai-gateway') || pathname.startsWith('/browser-rendering') ||
      pathname.startsWith('/workers') || pathname.startsWith('/databases') ||
      pathname.startsWith('/storage') || pathname.startsWith('/kv') ||
      pathname.startsWith('/vectorize') || pathname.startsWith('/workflows') ||
      pathname.startsWith('/queues') || pathname.startsWith('/email') ||
      pathname.startsWith('/integrations') || pathname.startsWith('/settings') ||
      pathname.startsWith('/photogallery')) {
      return handleDashboard(request, env, pathname);
    }

    // Root and all other routes - proxy Pages.dev
    return proxyPagesDev(request, env, pathname);
  }
};

/**
 * Proxy requests to inner-animal-media.pages.dev
 */
async function proxyPagesDev(request: Request, env: Env, pathname: string): Promise<Response> {
  try {
    const pagesUrl = `${PAGES_DEV_URL}${pathname}${request.url.includes('?') ? '?' + new URL(request.url).search : ''}`;

    // Create new request with same method and headers
    const headers = new Headers(request.headers);
    // Remove host header to avoid issues
    headers.delete('host');

    const proxyRequest = new Request(pagesUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    });

    const response = await fetch(proxyRequest);

    // Clone response to modify headers
    const responseHeaders = new Headers(response.headers);

    // Add CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Remove CSP that might block resources
    responseHeaders.delete('Content-Security-Policy');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('Pages.dev proxy error:', error);
    return new Response(`Error proxying request: ${error.message}`, {
      status: 502,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

/**
 * Handle dashboard routes - serve from R2
 */
async function handleDashboard(request: Request, env: Env, pathname: string): Promise<Response> {
  if (!env.R2_IACCESS) {
    return new Response('Dashboard R2 bucket not configured', { status: 500 });
  }

  // Route mapping for dashboard pages
  const routes: Record<string, string> = {
    '/dashboard': 'index.html',
    '/dashboard/': 'index.html',
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
  };

  // Get file path
  let filePath = routes[pathname];

  // If no route match, try direct file path
  if (!filePath) {
    // Remove /dashboard prefix if present
    const cleanPath = pathname.startsWith('/dashboard/')
      ? pathname.slice('/dashboard/'.length)
      : pathname.slice(1);
    filePath = cleanPath || 'index.html';
  }

  try {
    // Fetch from R2
    const object = await env.R2_IACCESS.get(filePath);

    if (!object) {
      // Try index.html as fallback
      const fallback = await env.R2_IACCESS.get('index.html');
      if (fallback) {
        return new Response(fallback.body, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
            ...corsHeaders,
          },
        });
      }
      return new Response('Dashboard page not found', { status: 404 });
    }

    // Determine content type
    const contentType = getContentType(filePath);

    // Return with proper headers
    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        ...corsHeaders,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (error) {
    console.error('R2 fetch error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

/**
 * Handle API endpoints
 * Proxies to existing API workers or handles directly
 */
async function handleAPI(request: Request, env: Env, pathname: string): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Health check
  if (pathname === '/api/health') {
    return new Response(
      JSON.stringify({
        status: 'ok',
        service: 'inneranimalmedia-router',
        timestamp: new Date().toISOString(),
        routes: {
          root: 'Proxies inner-animal-media.pages.dev',
          dashboard: '/dashboard',
          api: '/api/*',
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }

  // Theme API (for dashboard dark/light mode)
  if (pathname === '/api/theme') {
    if (request.method === 'GET') {
      const cookie = request.headers.get('Cookie') || '';
      const themeMatch = cookie.match(/theme=([^;]+)/);
      const theme = themeMatch ? themeMatch[1] : 'light';

      return new Response(JSON.stringify({ theme }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    if (request.method === 'POST') {
      const { theme } = await request.json();
      const validThemes = ['light', 'dark'];
      const selectedTheme = validThemes.includes(theme) ? theme : 'light';

      return new Response(JSON.stringify({ theme: selectedTheme }), {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `theme=${selectedTheme}; Path=/; Max-Age=31536000; SameSite=Lax`,
          ...corsHeaders,
        },
      });
    }
  }

  // Try to proxy to iaccess-api worker
  const apiWorkerUrl = 'https://iaccess-api.meauxbility.workers.dev';

  try {
    const apiUrl = `${apiWorkerUrl}${pathname}${request.url.includes('?') ? '?' + new URL(request.url).search : ''}`;

    const headers = new Headers(request.headers);
    headers.delete('host');

    const apiRequest = new Request(apiUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    });

    const response = await fetch(apiRequest);

    const responseHeaders = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    // If API worker is not available, return basic response
    return new Response(
      JSON.stringify({
        message: 'API endpoint',
        path: pathname,
        method: request.method,
        note: 'API worker may not be available. Configure iaccess-api worker for full functionality.',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

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
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
  };
  return types[ext || ''] || 'application/octet-stream';
}
