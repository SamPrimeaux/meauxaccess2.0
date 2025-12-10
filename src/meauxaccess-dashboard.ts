/**
 * MeauxAccess Dashboard Production Worker
 * Serves dual-theme dashboards: MeauxAccess (Purple) and iAccess (Teal/Orange)
 * Supports light/dark mode switching
 */

/// <reference types="@cloudflare/workers-types" />

import MEAUXACCESS_HTML from './meauxaccess-dashboard.html.ts';
import IACCESS_HTML from './iaccess-dashboard.html.ts';
import PRICING_HTML from './inneranimalmedia-pricing.html.ts';
import DEPLOY_HTML from './inneranimalmedia-deploy.html.ts';
import { GLASSMORPHIC_HEADER_STYLES, GLASSMORPHIC_HEADER_MARKUP, GLASSMORPHIC_HEADER_SCRIPT } from './glassmorphic-header.html.ts';
import { LEGACY_HEADER_STYLES, LEGACY_HEADER_MARKUP, LEGACY_HEADER_SCRIPT } from './legacy-header.html.ts';
import { BOARD_MEMBERS, generateTeamMemberHTML, TEAM_PAGE_HTML_TEMPLATE } from './team-meauxbility.html.ts';

export interface Env {
  // D1 Databases
  DB?: D1Database; // Primary database (meauxstack-saas-db)
  meauxxbility?: D1Database;
  SAAS_DB?: D1Database; // Alias for DB
  MEAUX_WORK_DB?: D1Database;
  INNERANIMAL_DB?: D1Database;

  // R2 Buckets
  R2_WEBSITE?: R2Bucket;
  R2_COMPONENTS?: R2Bucket;
  R2_RECORDINGS?: R2Bucket;
  R2_3D_MODELS?: R2Bucket;
  R2_SPLINEICONS?: R2Bucket;
  R2_DOCS?: R2Bucket;
  R2_SAMI_BACKUPS?: R2Bucket;
  R2_DEPLOY_VAULT?: R2Bucket;
  R2_AUTORAG?: R2Bucket;
  R2_CONNOR?: R2Bucket;
  R2_FRED?: R2Bucket;
  R2_AMBER?: R2Bucket;
  R2_ASSETS?: R2Bucket;
  STORAGE?: R2Bucket;
  R2_IAUTODIDACT?: R2Bucket;

  // KV Namespaces
  KV_CACHE?: KVNamespace;
  KV_CONFIG?: KVNamespace;
  KV_SESSIONS?: KVNamespace;
  KV_USERS?: KVNamespace;
  KV_NOTIFICATIONS?: KVNamespace;

  // Secrets
  RESEND_API_KEY?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_IMAGES_API_TOKEN?: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string; // For Claude AI

  // Environment Variables
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;
  CLOUDFLARE_STREAM_CUSTOMER_ID?: string;
  ENABLE_HEADER_INJECTION?: string;
  ENVIRONMENT?: string;
  PRODUCTION_URL?: string;
  R2_ENDPOINT?: string;
  R2_PUBLIC_URL?: string;
  TURN_TOKEN_ID?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Check hostname for domain-specific routing
    const hostname = url.hostname;
    const isInnerAnimalMedia = hostname.includes('inneranimalmedia.com') || hostname.includes('inneranimalmedia');
    const isMeauxbility = hostname.includes('meauxbility.org') || hostname.includes('meauxbility');

    // Route handlers - Support /dashboard/* routes (client-side routing)
    if (path === '/' || path === '/dashboard' || path.startsWith('/dashboard/') || path === '/meauxaccess') {
      // If inneranimalmedia.com root, serve home page
      if (isInnerAnimalMedia && path === '/') {
        return handleInnerAnimalMediaHome(request, env);
      }
      // If meauxbility.org root, redirect to dashboard
      if (isMeauxbility && path === '/') {
        return Response.redirect(url.origin + '/dashboard', 302);
      }
      // All /dashboard/* routes serve the same HTML (client-side routing handles it)
      return new Response(MEAUXACCESS_HTML, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Handle meauxbility.org specific routes
    if (isMeauxbility) {
      // Dashboard is already handled above
      // Add any meauxbility.org specific routes here
    }

    if (path === '/iaccess') {
      return new Response(IACCESS_HTML, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Pricing page for inneranimalmedia.com
    if (path === '/pricing') {
      return new Response(PRICING_HTML, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Deploy/Template page for inneranimalmedia.com
    if (path === '/deploy' || path === '/templates') {
      return new Response(DEPLOY_HTML, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Media Gallery page
    if (path === '/media-gallery' || path === '/gallery' || path === '/meauxphoto') {
      const getMediaGalleryHTML = (await import('./media-gallery.html.ts')).default;
      return new Response(getMediaGalleryHTML(), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Admin/Settings page
    if (path === '/admin' || path === '/settings' || path.startsWith('/admin/') || hostname === 'admin.meauxbility.org') {
      return handleAdminPage(request, env, path, url);
    }

    // Serve pages from R2_WEBSITE bucket (meauxbilityorgfinal)
    if (path.startsWith('/pages/')) {
      return handleR2Page(request, env, path, url);
    }

    // Serve static assets from R2
    if (path.startsWith('/assets/') || path.startsWith('/static/')) {
      return handleR2Asset(request, env, path);
    }

    // Serve deployed projects
    if (path.startsWith('/deployments/')) {
      return handleDeployedProject(request, env, path);
    }

    // API endpoints
    if (path.startsWith('/api/')) {
      return handleAPI(request, env, path);
    }

    // Health check
    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // 404
    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders,
    });
  },
};

async function handleAPI(request: Request, env: Env, path: string): Promise<Response> {
  const url = new URL(request.url);
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Theme preference API
  if (path === '/api/theme') {
    if (request.method === 'GET') {
      // Get theme from cookie or default to light
      const cookie = request.headers.get('Cookie') || '';
      const themeMatch = cookie.match(/theme=([^;]+)/);
      const theme = themeMatch ? themeMatch[1] : 'light';

      return new Response(JSON.stringify({ theme }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    if (request.method === 'POST') {
      const { theme } = await request.json();
      const validThemes = ['light', 'dark'];
      const selectedTheme = validThemes.includes(theme) ? theme : 'light';

      return new Response(JSON.stringify({ theme: selectedTheme }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Set-Cookie': `theme=${selectedTheme}; Path=/; Max-Age=31536000; SameSite=Lax`,
        },
      });
    }
  }

  // Stats API
  if (path === '/api/stats') {
    const stats = {
      projects: 24,
      teamMembers: 8,
      storageUsed: '2.4 GB',
      storageTotal: '10 GB',
      apiRequests: 45200,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(stats), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }

  // Scan R2 Assets API
  if (path === '/api/r2/scan' && request.method === 'GET') {
    if (!env.R2_ASSETS) {
      return new Response(JSON.stringify({ error: 'R2_ASSETS not configured' }), {
        status: 503,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    try {
      const objects = await env.R2_ASSETS.list({ limit: 1000 });
      const assets = objects.objects.map(obj => ({
        key: obj.key,
        size: obj.size,
        etag: obj.etag,
        uploaded: obj.uploaded,
        contentType: obj.httpEtag,
      }));

      return new Response(JSON.stringify({
        bucket: 'inneranimalmedia-assets',
        count: assets.length,
        assets: assets,
        truncated: objects.truncated,
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
  }

  // Deployment API - Upload Files
  if (path === '/api/deploy/upload' && request.method === 'POST') {
    return handleDeployUpload(request, env);
  }

  // Deployment API - Create Deployment
  if (path === '/api/deploy/create' && request.method === 'POST') {
    return handleDeployCreate(request, env);
  }

  // Deployment API - List Deployments
  if (path === '/api/deploy/list' && request.method === 'GET') {
    return handleDeployList(request, env);
  }

  // Cloudflare Images API - Upload Image
  if (path === '/api/images/upload' && request.method === 'POST') {
    return handleImageUpload(request, env);
  }

  // Cloudflare Images API - List Images
  if (path === '/api/images/list' && request.method === 'GET') {
    return handleImageList(request, env);
  }

  // Resend API - List Domains
  if (path === '/api/resend/domains' && request.method === 'GET') {
    return handleResendDomains(request, env);
  }

  // Team Notification API
  if (path === '/api/team/notify' && request.method === 'POST') {
    return handleTeamNotify(request, env);
  }

  // Chat API - Send Message
  if (path === '/api/chat/send' && request.method === 'POST') {
    return handleChatSend(request, env);
  }

  // Chat API - Get Messages
  if (path === '/api/chat/messages' && request.method === 'GET') {
    return handleChatMessages(request, env);
  }

  // Chat API - Get Channels
  if (path === '/api/chat/channels' && request.method === 'GET') {
    return handleChatChannels(request, env);
  }

  // Enhanced Authentication API Endpoints
  if (path === '/api/auth/signup' && request.method === 'POST') {
    const { handleSignup } = await import('./auth-api');
    return handleSignup(request, env);
  }

  if (path === '/api/auth/login' && request.method === 'POST') {
    const { handleLogin } = await import('./auth-api');
    return handleLogin(request, env);
  }

  if (path === '/api/auth/logout' && request.method === 'POST') {
    const { handleLogout } = await import('./auth-api');
    return handleLogout(request, env);
  }

  if (path === '/api/auth/me' && request.method === 'GET') {
    const { handleGetMe } = await import('./auth-api');
    return handleGetMe(request, env);
  }

  if (path === '/api/auth/2fa/enable' && request.method === 'POST') {
    const { handleEnable2FA } = await import('./auth-api');
    return handleEnable2FA(request, env);
  }

  if (path === '/api/auth/2fa/verify' && request.method === 'POST') {
    const { handleVerify2FA } = await import('./auth-api');
    return handleVerify2FA(request, env);
  }

  // OAuth/SSO Endpoints
  if (path.startsWith('/api/auth/oauth/') && request.method === 'GET') {
    const { getOAuthProvider, generateOAuthState, storeOAuthState, getOAuthAuthUrl } = await import('./oauth-sso');
    const parts = path.split('/');
    const providerName = parts[parts.length - 1] as 'google' | 'github';

    if (providerName === 'callback') {
      // Handle OAuth callback
      const { handleOAuthCallback } = await import('./oauth-sso');
      const provider = parts[parts.length - 2] as 'google' | 'github';
      const result = await handleOAuthCallback(env, request, provider);

      if (result.success && result.sessionId) {
        // Redirect to success page with session
        return new Response(null, {
          status: 302,
          headers: {
            'Location': '/?oauth=success',
            'Set-Cookie': `meaux_session=${result.sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
          },
        });
      } else {
        return new Response(JSON.stringify({ success: false, error: result.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Initiate OAuth flow
    const provider = getOAuthProvider(env, providerName);
    if (!provider) {
      return new Response(JSON.stringify({ error: 'OAuth provider not configured' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const state = generateOAuthState();
    await storeOAuthState(env, state, providerName);

    const redirectBase = env.OAUTH_REDIRECT_BASE || new URL(request.url).origin;
    const redirectUri = `${redirectBase}/api/auth/oauth/${providerName}/callback`;
    const authUrl = getOAuthAuthUrl(provider, redirectUri, state);

    return new Response(null, {
      status: 302,
      headers: { 'Location': authUrl },
    });
  }

  // Clients API - Get project clients
  if (path === '/api/clients/project' && request.method === 'GET') {
    const { handleGetProjectClients } = await import('./clients-api');
    return handleGetProjectClients(request, env);
  }

  // Clients API - Create/Update client
  if (path === '/api/clients' && request.method === 'POST') {
    const { handleUpsertClient } = await import('./clients-api');
    return handleUpsertClient(request, env);
  }

  // Clients API - Delete client
  if (path === '/api/clients' && request.method === 'DELETE') {
    const { handleDeleteClient } = await import('./clients-api');
    return handleDeleteClient(request, env);
  }

  // Clients API - Get all projects with clients
  if (path === '/api/clients/projects' && request.method === 'GET') {
    const { handleGetProjectsWithClients } = await import('./clients-api');
    return handleGetProjectsWithClients(request, env);
  }

  // AI Helper Endpoints (Universal Toolbar)
  if (path === '/api/helper/chatgpt' && request.method === 'POST') {
    return handleChatGPTHelper(request, env);
  }

  if (path === '/api/helper/claude' && request.method === 'POST') {
    return handleClaudeHelper(request, env);
  }

  if (path === '/api/helper/cloudflare-ai' && request.method === 'POST') {
    return handleCloudflareAIHelper(request, env);
  }

  if (path === '/api/helper/wrangler' && request.method === 'POST') {
    return handleWranglerHelper(request, env);
  }

  // Dev Search Assistant Endpoints
  if (path === '/api/dev-search' && request.method === 'POST') {
    const { handlePlatformSearch } = await import('./dev-search-assistant');
    return handlePlatformSearch(request, env);
  }

  if (path === '/api/dev-search/stream' && request.method === 'POST') {
    const { handleStreamingAI } = await import('./dev-search-assistant');
    return handleStreamingAI(request, env);
  }

  if (path === '/api/dev-search/notes' && request.method === 'POST') {
    const { handleSaveNote } = await import('./dev-search-assistant');
    return handleSaveNote(request, env);
  }

  if (path === '/api/dev-search/notes' && request.method === 'GET') {
    const { handleGetNotes } = await import('./dev-search-assistant');
    return handleGetNotes(request, env);
  }

  if (path === '/api/dev-search/inspect' && request.method === 'GET') {
    const { handleInspectResource } = await import('./dev-search-assistant');
    return handleInspectResource(request, env);
  }

  // Media Gallery API Endpoints
  if (path === '/api/media-gallery/images' && request.method === 'GET') {
    const { handleGetAllImages } = await import('./media-gallery-api');
    return handleGetAllImages(request, env);
  }

  if (path === '/api/media-gallery/videos' && request.method === 'GET') {
    const { handleGetAllVideos } = await import('./media-gallery-api');
    return handleGetAllVideos(request, env);
  }

  if (path === '/api/media-gallery/images/delete' && request.method === 'DELETE') {
    const { handleDeleteImage } = await import('./media-gallery-api');
    return handleDeleteImage(request, env);
  }

  if (path === '/api/media-gallery/videos/delete' && request.method === 'DELETE') {
    const { handleDeleteVideo } = await import('./media-gallery-api');
    return handleDeleteVideo(request, env);
  }

  if (path === '/api/media-gallery/images/bulk-delete' && request.method === 'POST') {
    const { handleBulkDeleteImages } = await import('./media-gallery-api');
    return handleBulkDeleteImages(request, env);
  }

  if (path === '/api/media-gallery/videos/bulk-delete' && request.method === 'POST') {
    const { handleBulkDeleteVideos } = await import('./media-gallery-api');
    return handleBulkDeleteVideos(request, env);
  }

  if (path === '/api/media-gallery/images/metadata' && request.method === 'PUT') {
    const { handleUpdateImageMetadata } = await import('./media-gallery-api');
    return handleUpdateImageMetadata(request, env);
  }

  if (path === '/api/media-gallery/videos/metadata' && request.method === 'PUT') {
    const { handleUpdateVideoMetadata } = await import('./media-gallery-api');
    return handleUpdateVideoMetadata(request, env);
  }

  if (path === '/api/media-gallery/projects' && request.method === 'GET') {
    const { handleGetProjects } = await import('./media-gallery-api');
    return handleGetProjects(request, env);
  }

  if (path === '/api/media-gallery/remaster' && request.method === 'POST') {
    const { handleRemasterImage } = await import('./media-gallery-api');
    return handleRemasterImage(request, env);
  }

  // Gemini API Proxy - Forward to gemini-proxy worker
  if (path.startsWith('/api/gemini/')) {
    // Forward request to gemini-proxy worker
    const geminiProxyUrl = 'https://gemini-proxy.meauxbility.workers.dev' + path;
    const forwardedRequest = new Request(geminiProxyUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    try {
      const response = await fetch(forwardedRequest);
      return new Response(response.body, {
        status: response.status,
        headers: {
          ...corsHeaders,
          ...Object.fromEntries(response.headers.entries()),
        },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({
        error: 'Gemini proxy error',
        message: error.message,
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // Pages API - Scan and enhance all pages with SEO
  if (path === '/api/pages/scan-and-enhance' && request.method === 'POST') {
    return handleScanAndEnhancePages(request, env, url);
  }

  // Pages API - Audit pages (find missing/broken)
  if (path === '/api/pages/audit' && request.method === 'GET') {
    return handlePagesAudit(request, env);
  }

  // Pages API - Migrate images to Cloudflare CDN
  if (path === '/api/pages/migrate-images' && request.method === 'POST') {
    return handleMigrateImages(request, env);
  }

  // Pages API - Remaster Shopify HTML (for future use)
  if (path === '/api/pages/remaster' && request.method === 'POST') {
    return handleRemasterPage(request, env, url);
  }

  // Bulk remaster multiple pages
  if (path === '/api/pages/bulk-remaster' && request.method === 'POST') {
    return handleBulkRemasterPages(request, env, url);
  }

  // V1 Gallery API - List images
  if (path === '/api/v1/gallery' && request.method === 'GET') {
    const { handleV1GalleryList } = await import('./v1-gallery-api');
    return handleV1GalleryList(request, env);
  }

  // V1 Gallery API - Add image
  if (path === '/api/v1/gallery/add' && request.method === 'POST') {
    const { handleV1GalleryAdd } = await import('./v1-gallery-api');
    return handleV1GalleryAdd(request, env);
  }

  // V1 Gallery API - Bulk import from Cloudflare Images
  if (path === '/api/v1/gallery/import' && request.method === 'POST') {
    const { handleV1GalleryBulkImport } = await import('./v1-gallery-api');
    return handleV1GalleryBulkImport(request, env);
  }

  // V1 Gallery API - Get image
  if (path === '/api/v1/gallery/get' && request.method === 'GET') {
    const { handleV1GalleryGet } = await import('./v1-gallery-api');
    return handleV1GalleryGet(request, env);
  }

  // V1 Gallery API - Update image
  if (path === '/api/v1/gallery/update' && (request.method === 'PUT' || request.method === 'POST')) {
    const { handleV1GalleryUpdate } = await import('./v1-gallery-api');
    return handleV1GalleryUpdate(request, env);
  }

  // V1 Gallery API - Delete image
  if (path === '/api/v1/gallery/delete' && request.method === 'DELETE') {
    const { handleV1GalleryDelete } = await import('./v1-gallery-api');
    return handleV1GalleryDelete(request, env);
  }

  // Admin API - Get header settings
  if (path === '/api/admin/header-settings' && request.method === 'GET') {
    return handleGetHeaderSettings(request, env);
  }

  // Admin API - Set header settings
  if (path === '/api/admin/header-settings' && request.method === 'POST') {
    return handleSetHeaderSettings(request, env);
  }

  // Admin API - Upload logo
  if (path === '/api/admin/upload-logo' && request.method === 'POST') {
    return handleUploadLogo(request, env);
  }

  // Admin API - Get logo URL
  if (path === '/api/admin/logo' && request.method === 'GET') {
    return handleGetLogo(request, env);
  }

  // Admin API - Process logo upload and remaster team page
  if (path === '/api/admin/process-logo-and-team' && request.method === 'POST') {
    return handleProcessLogoAndTeam(request, env, url);
  }

  // Admin API - Get board members data
  if (path === '/api/admin/board-members' && request.method === 'GET') {
    return handleGetBoardMembers(request, env);
  }

  // CMS API - List all pages and assets
  if (path === '/api/cms/list' && request.method === 'GET') {
    return handleCMSList(request, env);
  }

  // CMS API - Get page content
  if (path === '/api/cms/page' && request.method === 'GET') {
    return handleCMSGetPage(request, env);
  }

  // CMS API - Upload/Remaster HTML page
  if (path === '/api/cms/upload-page' && request.method === 'POST') {
    return handleCMSUploadPage(request, env, url);
  }

  // CMS API - Update page metatags
  if (path === '/api/cms/update-metatags' && request.method === 'POST') {
    return handleCMSUpdateMetatags(request, env, url);
  }

  // CMS API - Delete file
  if (path === '/api/cms/delete' && request.method === 'DELETE') {
    return handleCMSDelete(request, env);
  }

  // CMS API - Rename file
  if (path === '/api/cms/rename' && request.method === 'POST') {
    return handleCMSRename(request, env);
  }

  // CMS API - Get live URLs inventory
  if (path === '/api/cms/live-urls' && request.method === 'GET') {
    return handleCMSLiveUrls(request, env, url);
  }

  // Media/Images API - List images
  if (path === '/api/media/images' && request.method === 'GET') {
    return handleMediaListImages(request, env);
  }

  // Media/Images API - Upload image
  if (path === '/api/media/upload' && request.method === 'POST') {
    return handleMediaUploadImage(request, env);
  }

  // Media/Images API - Delete image
  if (path === '/api/media/delete' && request.method === 'DELETE') {
    return handleMediaDeleteImage(request, env);
  }

  // Media/Images API - Get image details
  if (path === '/api/media/image' && request.method === 'GET') {
    return handleMediaGetImage(request, env);
  }

  // Media/Images API - Generate delivery URL
  if (path === '/api/media/delivery-url' && request.method === 'POST') {
    return handleMediaGenerateDeliveryUrl(request, env);
  }

  // For inneranimalmedia.com root, always serve home page (even if R2 fails)
  if (url.hostname.includes('inneranimalmedia.com') && path === '/') {
    return handleInnerAnimalMediaHome(request, env);
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}

// AI Helper Functions
async function handleChatGPTHelper(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({
      output: 'Error: OpenAI API key not configured. Please set OPENAI_API_KEY secret.',
      tool: 'chatgpt',
      error: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { prompt, model = 'gpt-4o' } = body;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant for developers.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await openaiResponse.json();
    const responseText = data.choices?.[0]?.message?.content || 'No response from OpenAI';

    return new Response(JSON.stringify({
      output: responseText,
      tool: 'chatgpt',
      model: data.model,
      usage: data.usage,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      output: `Error: ${error.message}`,
      tool: 'chatgpt',
      error: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleClaudeHelper(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({
      output: 'Error: Anthropic API key not configured. Please set ANTHROPIC_API_KEY secret.',
      tool: 'claude',
      error: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { prompt } = body;

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
        messages: [{ role: 'user', content: prompt }],
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await claudeResponse.json();
    const responseText = data.content?.[0]?.text || 'No response from Claude';

    return new Response(JSON.stringify({
      output: responseText,
      tool: 'claude',
      usage: data.usage,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      output: `Error: ${error.message}`,
      tool: 'claude',
      error: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleCloudflareAIHelper(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await request.json();
    const { prompt } = body;

    // Use Cloudflare Workers AI (if available via AI binding)
    // For now, return info message
    return new Response(JSON.stringify({
      output: 'Cloudflare AI integration requires AI binding configuration.\n\nTo use: Configure AI binding in wrangler.toml:\n\n[[ai]]\nmodel = "@cf/meta/llama-2-7b-chat-int8"\n\nThen use: env.AI.run()',
      tool: 'cloudflare-ai',
      note: 'AI binding not configured in this worker'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      output: `Error: ${error.message}`,
      tool: 'cloudflare-ai',
      error: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleWranglerHelper(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await request.json();
    const { command } = body;

    // Wrangler CLI commands cannot be executed directly in Workers
    // This would require a separate service or API
    return new Response(JSON.stringify({
      output: `Wrangler CLI commands cannot be executed directly in Workers.\n\nCommand requested: ${command}\n\nTo execute Wrangler commands, use:\n1. Local terminal with wrangler CLI\n2. CI/CD pipeline\n3. Separate API service`,
      tool: 'wrangler',
      note: 'Direct execution not available'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      output: `Error: ${error.message}`,
      tool: 'wrangler',
      error: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleInnerAnimalMediaHome(request: Request, env: Env): Promise<Response> {
  // Try to get home page from R2 first
  if (env.R2_ASSETS) {
    try {
      // Try common home page filenames
      const homePageNames = ['index.html', 'home.html', 'index.html', 'main.html'];
      for (const name of homePageNames) {
        const homePage = await env.R2_ASSETS.get(name);
        if (homePage) {
          return new Response(homePage.body, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=3600',
            },
          });
        }
      }
    } catch (error) {
      console.error('Error fetching home page from R2:', error);
    }
  }

  // Generate a modern home page
  return new Response(generateInnerAnimalMediaHomePage(env), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

async function handleR2Asset(request: Request, env: Env, path: string): Promise<Response> {
  if (!env.R2_ASSETS) {
    return new Response('R2 Assets not configured', { status: 503 });
  }

  try {
    // Remove leading /assets/ or /static/
    const assetPath = path.replace(/^\/(assets|static)\//, '');
    const asset = await env.R2_ASSETS.get(assetPath);

    if (!asset) {
      return new Response('Asset not found', { status: 404 });
    }

    // Determine content type
    const contentType = getContentType(assetPath);

    return new Response(asset.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return new Response('Error fetching asset', { status: 500 });
  }
}

async function handleDeployedProject(request: Request, env: Env, path: string): Promise<Response> {
  if (!env.R2_ASSETS) {
    return new Response('R2 Assets not configured', { status: 503 });
  }

  try {
    // Remove /deployments/ prefix
    const projectPath = path.replace(/^\/deployments\//, '');

    // Try to get index.html if path ends with /
    let assetPath = projectPath;
    if (projectPath.endsWith('/') || projectPath === '') {
      assetPath = projectPath + 'index.html';
    }

    const asset = await env.R2_ASSETS.get(assetPath);

    if (!asset) {
      // Try without trailing slash
      const altPath = projectPath.replace(/\/$/, '') + '/index.html';
      const altAsset = await env.R2_ASSETS.get(altPath);
      if (altAsset) {
        const contentType = getContentType(altPath);
        return new Response(altAsset.body, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
      return new Response('Project not found', { status: 404 });
    }

    const contentType = getContentType(assetPath);
    return new Response(asset.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response('Error fetching project', { status: 500 });
  }
}

// Handle pages from R2_WEBSITE bucket (meauxbilityorgfinal)
async function handleR2Page(request: Request, env: Env, path: string, url: URL): Promise<Response> {
  if (!env.R2_WEBSITE) {
    return new Response('R2 Website not configured', { status: 503 });
  }

  try {
    // Extract page path: /pages/about-us -> pages/about-us.html or pages/about-us/index.html
    let pagePath = path.replace(/^\/pages\//, 'pages/');

    // Try .html extension first
    let htmlPath = pagePath.endsWith('.html') ? pagePath : `${pagePath}.html`;
    let page = await env.R2_WEBSITE.get(htmlPath);

    // If not found, try index.html in directory
    if (!page) {
      const dirPath = pagePath.endsWith('/') ? pagePath : `${pagePath}/`;
      htmlPath = `${dirPath}index.html`;
      page = await env.R2_WEBSITE.get(htmlPath);
    }

    if (!page) {
      return new Response('Page not found', { status: 404 });
    }

    // Get HTML content
    let html = await page.text();

    // Get header preference (default to glassmorphic)
    const headerType = await getHeaderPreference(env, 'glassmorphic');

    // Get logo URL
    const logoUrl = await getLogoUrl(env);

    // Inject header if not already present
    if (!html.includes('glassmorphic-header') && !html.includes('meauxbility-header') && !html.includes('id="nav"')) {
      html = await injectHeader(html, headerType, logoUrl, env);
    }

    // Enhance with SEO metatags if needed
    html = await enhancePageWithSEO(html, path, url, env);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    return new Response(`Error fetching page: ${error.message}`, { status: 500 });
  }
}

// Get header preference from KV or default
async function getHeaderPreference(env: Env, defaultValue: 'glassmorphic' | 'legacy' = 'glassmorphic'): Promise<'glassmorphic' | 'legacy'> {
  if (!env.KV_CONFIG) return defaultValue;

  try {
    const preference = await env.KV_CONFIG.get('header:preference');
    return (preference === 'legacy' || preference === 'glassmorphic') ? preference : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Inject header into HTML (supports both glassmorphic and legacy)
async function injectHeader(html: string, headerType: 'glassmorphic' | 'legacy' = 'glassmorphic', logoUrl?: string, env?: Env): Promise<string> {
  // If logoUrl not provided, try to get from Cloudflare Images
  let finalLogoUrl = logoUrl;
  if (!finalLogoUrl && env) {
    finalLogoUrl = await getLogoUrl(env);
  }
  // Final fallback if no env or getLogoUrl fails or still Shopify URL
  if (!finalLogoUrl || finalLogoUrl.includes('cdn.shopify.com')) {
    // Try to find officialheaderlogo in Cloudflare Images
    if (env?.CLOUDFLARE_ACCOUNT_ID && env?.CLOUDFLARE_IMAGES_API_TOKEN) {
      try {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1?per_page=10`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${env.CLOUDFLARE_IMAGES_API_TOKEN}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const images = data.result?.images || [];
          const officialLogo = images.find((img: any) =>
            (img.filename || '').toLowerCase().includes('officialheaderlogo')
          );
          if (officialLogo) {
            const variants = officialLogo.variants || [];
            const variant = variants.includes('public') ? 'public' : (variants[0] || 'public');
            finalLogoUrl = `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw'}/${officialLogo.id}/${variant}`;
          }
        }
      } catch (error) {
        // Fall through to default
      }
    }
    // Ultimate fallback
    if (!finalLogoUrl || finalLogoUrl.includes('cdn.shopify.com')) {
      finalLogoUrl = `https://imagedelivery.net/${env?.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw'}/meauxbility-wordmark/public`;
    }
  }
  if (headerType === 'legacy') {
    // Inject legacy header styles in head - add logo preload
    const logoPreload = `<link rel="preload" as="image" href="${finalLogoUrl}" type="image/png" fetchpriority="high">`;

    if (html.includes('</head>')) {
      // Check if Inter font is already loaded
      if (!html.includes('fonts.googleapis.com/css2?family=Inter')) {
        html = html.replace('</head>', `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
${logoPreload}
${LEGACY_HEADER_STYLES}
</head>`);
      } else {
        // Check if logo preload already exists
        if (!html.includes('rel="preload" as="image"')) {
          html = html.replace('</head>', `${logoPreload}\n${LEGACY_HEADER_STYLES}\n</head>`);
        } else {
          html = html.replace('</head>', `${LEGACY_HEADER_STYLES}\n</head>`);
        }
      }
    }

    // Inject legacy header markup after body tag - replace logo URLs
    let legacyMarkup = LEGACY_HEADER_MARKUP
      .replace(/https:\/\/cdn\.shopify\.com\/[^"'\s]+/g, finalLogoUrl)
      .replace(/https:\/\/imagedelivery\.net\/[^"'\s]+/g, finalLogoUrl);

    if (html.includes('<body')) {
      html = html.replace(/<body[^>]*>/, (match) => {
        let result = match;
        if (!html.includes('skip-link')) {
          result += `\n${legacyMarkup}`;
        } else {
          // Skip link exists, just add header and nav
          result += `\n${legacyMarkup.replace(/<a href="#main" class="skip-link">Skip to main content<\/a>\n/, '')}`;
        }
        return result;
      });
    }

    // Inject legacy header script before </body>
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${LEGACY_HEADER_SCRIPT}\n</body>`);
    } else {
      html += LEGACY_HEADER_SCRIPT;
    }
  } else {
    // Glassmorphic header injection
    // Inject styles in head
    if (html.includes('</head>')) {
      // Check if Inter font is already loaded
      if (!html.includes('fonts.googleapis.com/css2?family=Inter')) {
        html = html.replace('</head>', `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="${finalLogoUrl}" type="image/webp" fetchpriority="high">
${GLASSMORPHIC_HEADER_STYLES}
</head>`);
      } else {
        // Check if logo preload already exists
        if (!html.includes('rel="preload" as="image"')) {
          html = html.replace('</head>', `<link rel="preload" as="image" href="${finalLogoUrl}" type="image/webp" fetchpriority="high">
${GLASSMORPHIC_HEADER_STYLES}
</head>`);
        } else {
          html = html.replace('</head>', `${GLASSMORPHIC_HEADER_STYLES}\n</head>`);
        }
      }
    }

    // Inject header markup after body tag
    const glassmorphicMarkup = GLASSMORPHIC_HEADER_MARKUP(finalLogoUrl);
    if (html.includes('<body')) {
      html = html.replace(/<body[^>]*>/, (match) => {
        let result = match;
        if (!html.includes('skip-link')) {
          result += `\n${glassmorphicMarkup}`;
        } else {
          // Skip link exists, just add header and nav
          result += `\n${glassmorphicMarkup.replace(/<a href="#main" class="skip-link">Skip to main content<\/a>\n/, '')}`;
        }
        return result;
      });
    }

    // Inject header script before </body>
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${GLASSMORPHIC_HEADER_SCRIPT}\n</body>`);
    } else {
      html += GLASSMORPHIC_HEADER_SCRIPT;
    }
  }

  return html;
}

// Enhance page with SEO metatags
async function enhancePageWithSEO(html: string, path: string, url: URL, env: Env): Promise<string> {
  // Extract basic metadata from HTML
  const metadata = await extractPageMetadata(html, path, url, env);

  // Check if SEO tags already exist
  if (html.includes('og:title') && html.includes('og:description')) {
    // Already has SEO tags, just ensure they're complete
    return ensureCompleteSEO(html, metadata);
  }

  // Inject comprehensive SEO metatags
  const seoTags = generateSEOTags(metadata);

  // Inject into <head>
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${seoTags}\n</head>`);
  } else if (html.includes('<body')) {
    // Create head if it doesn't exist
    html = html.replace(/<body[^>]*>/, `<head>${seoTags}</head>\n<body>`);
  } else {
    html = `<head>${seoTags}</head>\n${html}`;
  }

  return html;
}

// Extract page metadata from HTML content
async function extractPageMetadata(html: string, path: string, url: URL, env: Env): Promise<PageMetadata> {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
    html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const title = titleMatch ? titleMatch[1].trim() : getPageTitleFromPath(path);

  // Extract description from meta tag or first paragraph
  let description = '';
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaDescMatch) {
    description = metaDescMatch[1].trim();
  } else {
    const pMatch = html.match(/<p[^>]*>([^<]{50,200})<\/p>/i);
    description = pMatch ? pMatch[1].trim().replace(/\s+/g, ' ') : getPageDescriptionFromPath(path);
  }

  // Extract keywords
  const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
  const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : getPageKeywordsFromPath(path);

  // Build canonical URL
  const canonicalUrl = `${url.origin}${path}`;

  // Get logo URL for OG image (use logo if available, otherwise default)
  let ogImage = `${url.origin}/assets/meauxbility-og-image.jpg`;
  try {
    // Try to get logo URL from KV (non-blocking)
    if (env.KV_CONFIG) {
      const logoUrl = await env.KV_CONFIG.get('logo:url');
      if (logoUrl) {
        ogImage = logoUrl;
      }
    }
  } catch (error) {
    // Use default if error
  }

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    path,
  };
}

// Generate comprehensive SEO metatags
function generateSEOTags(metadata: PageMetadata): string {
  const siteName = 'Meauxbility';
  const siteUrl = 'https://www.meauxbility.org';

  return `
  <!-- Primary Meta Tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(metadata.title)}</title>
  <meta name="title" content="${escapeHtml(metadata.title)}">
  <meta name="description" content="${escapeHtml(metadata.description)}">
  ${metadata.keywords && metadata.keywords.length > 0 ? `<meta name="keywords" content="${escapeHtml(metadata.keywords.join(', '))}">` : ''}
  <link rel="canonical" href="${metadata.canonicalUrl}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${metadata.canonicalUrl}">
  <meta property="og:title" content="${escapeHtml(metadata.title)}">
  <meta property="og:description" content="${escapeHtml(metadata.description)}">
  <meta property="og:image" content="${metadata.ogImage}">
  <meta property="og:site_name" content="${siteName}">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${metadata.canonicalUrl}">
  <meta property="twitter:title" content="${escapeHtml(metadata.title)}">
  <meta property="twitter:description" content="${escapeHtml(metadata.description)}">
  <meta property="twitter:image" content="${metadata.ogImage}">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "${siteName}",
    "url": "${siteUrl}",
    "logo": "${metadata.ogImage}",
    "description": "${escapeHtml(metadata.description)}",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lafayette",
      "addressRegion": "LA",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-337-450-9998",
      "contactType": "Customer Service"
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${escapeHtml(metadata.title)}",
    "description": "${escapeHtml(metadata.description)}",
    "url": "${metadata.canonicalUrl}",
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "${siteName}",
      "url": "${siteUrl}"
    }
  }
  </script>
  `;
}

// Ensure complete SEO tags (add missing ones)
function ensureCompleteSEO(html: string, metadata: PageMetadata): string {
  // Check and add missing tags
  if (!html.includes('og:site_name')) {
    html = html.replace('</head>', `<meta property="og:site_name" content="Meauxbility">\n</head>`);
  }
  if (!html.includes('canonical')) {
    html = html.replace('</head>', `<link rel="canonical" href="${metadata.canonicalUrl}">\n</head>`);
  }
  if (!html.includes('application/ld+json')) {
    const schema = generateSEOTags(metadata).match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g);
    if (schema) {
      html = html.replace('</head>', `${schema.join('\n')}\n</head>`);
    }
  }
  return html;
}

// Helper functions for page metadata
function getPageTitleFromPath(path: string): string {
  const pageNames: Record<string, string> = {
    '/': 'Meauxbility - Empowering mobility and independence',
    '/pages/about-us': 'About Us - Meauxbility',
    '/pages/team-meauxbility': 'Team Meauxbility - Meauxbility',
    '/pages/contact': 'Contact Us - Meauxbility',
    '/pages/faq': 'Frequently Asked Questions - Meauxbility',
    '/pages/apply-for-funding': 'Apply for Funding - Meauxbility',
    '/pages/mobility-grants-programs': 'Mobility Grants & Programs - Meauxbility',
    '/pages/community': 'Community - Meauxbility',
    '/pages/resources-and-information': 'Resources & Information - Meauxbility',
    '/pages/get-involved': 'Get Involved - Meauxbility',
    '/pages/donate': 'Donate - Meauxbility',
    '/pages/donmichael-our-first-campaign': 'DonMichael\'s Campaign - Meauxbility',
    '/pages/meauxbility-branding': 'Meauxbility Branding - Meauxbility',
    '/pages/news-media-features': 'News & Media Features - Meauxbility',
    '/pages/non-profit-information': 'Non-Profit Information - Meauxbility',
    '/pages/sam-primeaux': 'Sam Primeaux - Meauxbility',
    '/pages/accessibility-partners': 'Accessibility Partners - Meauxbility',
  };
  return pageNames[path] || 'Meauxbility - Nonprofit Organization';
}

function getPageDescriptionFromPath(path: string): string {
  const descriptions: Record<string, string> = {
    '/': 'Meauxbility - Empowering mobility and independence for adaptive athletes and spinal cord injury survivors. Built by a survivor for survivors.',
    '/pages/about-us': 'Learn about Meauxbility, our mission, and how we support accessibility and mobility in our community.',
    '/pages/team-meauxbility': 'Meet the dedicated team behind Meauxbility, working to improve accessibility and mobility.',
    '/pages/contact': 'Contact Meauxbility in Lafayette, LA. Reach us at 337-450-9998 or via email.',
    '/pages/faq': 'Frequently asked questions about Meauxbility, our programs, and how to get involved.',
    '/pages/apply-for-funding': 'Apply for funding and grants through Meauxbility\'s mobility programs.',
    '/pages/mobility-grants-programs': 'Explore mobility grants and programs offered by Meauxbility.',
    '/pages/community': 'Join the Meauxbility community and connect with others working towards accessibility.',
    '/pages/resources-and-information': 'Access resources and information about accessibility and mobility.',
    '/pages/get-involved': 'Get involved with Meauxbility and help make a difference in accessibility.',
    '/pages/donmichael-our-first-campaign': 'Help fund DonMichael\'s custom wheelchair. Our first initiative raising $10,000 for independence and access.',
    '/pages/donate': 'Support Meauxbility\'s mission by making a donation to help improve accessibility.',
    '/pages/meauxbility-branding': 'Learn about Meauxbility\'s branding guidelines and visual identity.',
    '/pages/news-media-features': 'Read news and media features about Meauxbility and our impact.',
    '/pages/non-profit-information': 'Information about Meauxbility as a nonprofit organization.',
    '/pages/sam-primeaux': 'Learn about Sam Primeaux, founder of Meauxbility.',
  };
  return descriptions[path] || 'Meauxbility is a nonprofit organization dedicated to improving accessibility and mobility in our community.';
}

function getPageKeywordsFromPath(path: string): string[] {
  return ['Meauxbility', 'nonprofit', 'accessibility', 'mobility', 'Lafayette', 'Louisiana', 'community', 'grants', 'funding'];
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Escape regex special characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Page metadata interface
interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogImage: string;
  path: string;
}

async function handleDeployUpload(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.R2_ASSETS) {
    return new Response(JSON.stringify({ error: 'R2_ASSETS not configured' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    const projectName = formData.get('projectName') as string;

    if (!file || !path) {
      return new Response(JSON.stringify({ error: 'File and path required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await env.R2_ASSETS.put(path, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || getContentType(path),
      },
    });

    // Store deployment metadata in KV
    if (env.KV_CONFIG) {
      const deploymentKey = `deployment:${projectName}`;
      const existing = await env.KV_CONFIG.get(deploymentKey);
      let deployment: any = existing ? JSON.parse(existing) : {
        name: projectName,
        files: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      deployment.files.push({
        path: path,
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded: new Date().toISOString(),
      });
      deployment.updatedAt = new Date().toISOString();

      await env.KV_CONFIG.put(deploymentKey, JSON.stringify(deployment));
    }

    return new Response(JSON.stringify({
      success: true,
      path: path,
      size: file.size,
      type: file.type,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleDeployCreate(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await request.json();
    const { projectName, deployType, customDomain, buildCommand, envVars, files } = body;

    if (!projectName) {
      return new Response(JSON.stringify({ error: 'Project name required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store deployment info
    if (env.KV_CONFIG) {
      const deploymentKey = `deployment:${projectName}`;
      const deployment = {
        name: projectName,
        type: deployType || 'r2',
        customDomain: customDomain || null,
        buildCommand: buildCommand || null,
        envVars: envVars || {},
        files: files || [],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await env.KV_CONFIG.put(deploymentKey, JSON.stringify(deployment));
    }

    // Generate URL based on deployment type
    let url = '';
    if (customDomain) {
      url = `https://${customDomain}`;
    } else if (deployType === 'pages') {
      url = `https://${projectName}.pages.dev`;
    } else if (deployType === 'worker') {
      url = `https://${projectName}.meauxbility.workers.dev`;
    } else {
      url = `https://inneranimalmedia.com/deployments/${projectName}`;
    }

    return new Response(JSON.stringify({
      success: true,
      projectName,
      deployType,
      url,
      message: 'Deployment created successfully',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleDeployList(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.KV_CONFIG) {
    return new Response(JSON.stringify({ deployments: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // List all deployment keys
    const deployments: any[] = [];
    const keys = await env.KV_CONFIG.list({ prefix: 'deployment:' });

    for (const key of keys.keys) {
      const deploymentData = await env.KV_CONFIG.get(key.name);
      if (deploymentData) {
        const deployment = JSON.parse(deploymentData);
        deployments.push({
          ...deployment,
          fileCount: deployment.files?.length || 0,
        });
      }
    }

    // Sort by updated date (newest first)
    deployments.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return new Response(JSON.stringify({ deployments }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleImageUpload(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH;
  const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !accountHash || !apiToken) {
    return new Response(JSON.stringify({
      error: 'Cloudflare Images not configured. Missing account ID, hash, or API token.'
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const requireSignedURLs = formData.get('requireSignedURLs') === 'true';
    const metadata = formData.get('metadata') as string;

    if (!file) {
      return new Response(JSON.stringify({ error: 'File required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Upload to Cloudflare Images
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    if (requireSignedURLs) {
      uploadFormData.append('requireSignedURLs', 'true');
    }
    if (metadata) {
      uploadFormData.append('metadata', metadata);
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
        body: uploadFormData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare Images API error: ${error}`);
    }

    const result = await response.json();
    const imageId = result.result?.id;
    const imageVariants = result.result?.variants || [];

    // Generate delivery URLs
    const deliveryUrls = imageVariants.map((variant: string) =>
      `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`
    );

    return new Response(JSON.stringify({
      success: true,
      imageId,
      accountHash,
      variants: imageVariants,
      deliveryUrls,
      filename: result.result?.filename,
      uploaded: result.result?.uploaded,
      requireSignedURLs: result.result?.requireSignedURLs || false,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleImageList(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH;
  const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !accountHash || !apiToken) {
    return new Response(JSON.stringify({
      error: 'Cloudflare Images not configured'
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const perPage = url.searchParams.get('per_page') || '50';

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1?page=${page}&per_page=${perPage}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare Images API error: ${error}`);
    }

    const result = await response.json();
    const images = result.result?.images || [];

    // Add delivery URLs to each image
    const imagesWithUrls = images.map((image: any) => ({
      ...image,
      deliveryUrls: image.variants?.map((variant: string) =>
        `https://imagedelivery.net/${accountHash}/${image.id}/${variant}`
      ) || [],
    }));

    return new Response(JSON.stringify({
      success: true,
      images: imagesWithUrls,
      count: images.length,
      pagination: result.result?.pagination || {},
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleTeamNotify(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'Resend API key not configured' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { recipient, title, message, type } = body;

    if (!recipient || !title || !message) {
      return new Response(JSON.stringify({ error: 'recipient, title, and message are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Format message with line breaks
    const formattedMessage = message.replace(/\n/g, '<br>');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Inner Animal Media <noreply@inneranimalmedia.com>',
        to: recipient,
        subject: title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3b82f6; margin-bottom: 20px;">${title}</h2>
            <div style="color: #374151; line-height: 1.6;">
              ${formattedMessage}
            </div>
            <p style="margin-top: 30px;">
              <a href="https://inneranimalmedia.com" 
                 style="background: #3b82f6; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Open Dashboard
              </a>
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px;">
              This is an automated notification from Inner Animal Media Platform
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify({
      success: true,
      messageId: result.id,
      recipient,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleResendDomains(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const apiToken = env.RESEND_API_KEY;

  if (!apiToken) {
    return new Response(JSON.stringify({
      error: 'Resend API key not configured'
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';

    const response = await fetch(
      `https://api.resend.com/domains?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const result = await response.json();
    const domains = result.data || [];

    // Format domains with status and region info
    const formattedDomains = domains.map((domain: any) => ({
      domain: domain.name || domain.domain,
      status: domain.status || 'unknown',
      region: domain.region || 'us-east-1',
      createdAt: domain.created_at || domain.createdAt,
      id: domain.id,
      records: domain.records || [],
    }));

    return new Response(JSON.stringify({
      success: true,
      domains: formattedDomains,
      count: formattedDomains.length,
      pagination: result.pagination || {},
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Chat System Functions
async function handleChatSend(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.KV_NOTIFICATIONS) {
    return new Response(JSON.stringify({ error: 'KV_NOTIFICATIONS not configured' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { channel, message, sender, senderName } = body;

    if (!channel || !message || !sender) {
      return new Response(JSON.stringify({ error: 'channel, message, and sender are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const messageId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const chatMessage = {
      id: messageId,
      channel: channel || 'general',
      message,
      sender,
      senderName: senderName || sender,
      timestamp,
      read: false,
    };

    // Store message in KV
    await env.KV_NOTIFICATIONS.put(
      `chat:${channel}:${messageId}`,
      JSON.stringify(chatMessage),
      { expirationTtl: 60 * 60 * 24 * 90 } // 90 days
    );

    // Update channel index
    const channelKey = `chat:channel:${channel}`;
    const existing = await env.KV_NOTIFICATIONS.get(channelKey);
    let channelData: any = existing ? JSON.parse(existing) : {
      channel,
      messageCount: 0,
      lastMessage: null,
      participants: [],
    };

    channelData.messageCount = (channelData.messageCount || 0) + 1;
    channelData.lastMessage = timestamp;
    if (!channelData.participants.includes(sender)) {
      channelData.participants.push(sender);
    }

    await env.KV_NOTIFICATIONS.put(channelKey, JSON.stringify(channelData));

    // Send email notification if Resend is configured (optional)
    if (env.RESEND_API_KEY && channel !== 'general') {
      // Could send notifications for important channels
    }

    return new Response(JSON.stringify({
      success: true,
      message: chatMessage,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleChatMessages(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.KV_NOTIFICATIONS) {
    return new Response(JSON.stringify({ messages: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const channel = url.searchParams.get('channel') || 'general';
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // List all messages for the channel
    const messages: any[] = [];
    const prefix = `chat:${channel}:`;

    // Get channel messages (limited approach - KV doesn't have perfect listing)
    // For production, consider using D1 or a better structure
    const keys = await env.KV_NOTIFICATIONS.list({ prefix });

    for (const key of keys.keys.slice(-limit)) {
      const messageData = await env.KV_NOTIFICATIONS.get(key.name);
      if (messageData) {
        messages.push(JSON.parse(messageData));
      }
    }

    // Sort by timestamp
    messages.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return new Response(JSON.stringify({
      success: true,
      channel,
      messages,
      count: messages.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleChatChannels(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.KV_NOTIFICATIONS) {
    return new Response(JSON.stringify({ channels: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const keys = await env.KV_NOTIFICATIONS.list({ prefix: 'chat:channel:' });
    const channels: any[] = [];

    for (const key of keys.keys) {
      const channelData = await env.KV_NOTIFICATIONS.get(key.name);
      if (channelData) {
        channels.push(JSON.parse(channelData));
      }
    }

    // Sort by last message time
    channels.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage).getTime() - new Date(a.lastMessage).getTime();
    });

    return new Response(JSON.stringify({
      success: true,
      channels,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

function getContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject',
  };
  return types[ext || ''] || 'application/octet-stream';
}

function generateInnerAnimalMediaHomePage(env: Env): string {
  const publicUrl = env.R2_PUBLIC_URL || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inner Animal Media - Creative Production & Media Services</title>
  <meta name="description" content="Inner Animal Media - Professional creative production, media services, and content creation.">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --primary: #667eea;
      --primary-dark: #5568d3;
      --primary-light: #8b9eff;
      --neutral-50: #f9fafb;
      --neutral-100: #f3f4f6;
      --neutral-900: #111827;
      --neutral-500: #6b7280;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: var(--neutral-900);
      background: var(--neutral-50);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    header {
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 0;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
      text-decoration: none;
    }
    
    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }
    
    .nav-links a {
      color: var(--neutral-900);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .nav-links a:hover {
      color: var(--primary);
    }
    
    .hero {
      padding: 6rem 0;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero p {
      font-size: 1.25rem;
      color: var(--neutral-500);
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .cta-button {
      display: inline-block;
      padding: 1rem 2rem;
      background: var(--primary);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: background 0.2s;
    }
    
    .cta-button:hover {
      background: var(--primary-dark);
    }
    
    .features {
      padding: 4rem 0;
      background: white;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }
    
    .feature-card {
      padding: 2rem;
      border-radius: 12px;
      background: var(--neutral-50);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: var(--neutral-900);
    }
    
    .feature-card p {
      color: var(--neutral-500);
    }
    
    footer {
      background: var(--neutral-900);
      color: white;
      padding: 3rem 0;
      text-align: center;
      margin-top: 4rem;
    }
    
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2.5rem;
      }
      
      .nav-links {
        display: none;
      }
    }
  </style>
</head>
<body>
  <header>
    <nav class="container">
      <a href="/" class="logo">Inner Animal Media</a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/iaccess">Dashboard</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/deploy">Deploy</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section class="hero">
      <div class="container">
        <h1>Creative Production & Media Services</h1>
        <p>Professional content creation, media production, and creative solutions for your brand.</p>
        <a href="/iaccess" class="cta-button">Access Dashboard</a>
      </div>
    </section>
    
    <section class="features" id="services">
      <div class="container">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 1rem;">Our Services</h2>
        <p style="text-align: center; color: var(--neutral-500); margin-bottom: 2rem;">What we offer</p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎬</div>
            <h3>Video Production</h3>
            <p>Professional video production services for commercials, documentaries, and digital content.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📸</div>
            <h3>Photography</h3>
            <p>High-quality photography services for events, products, and brand imagery.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>Creative Design</h3>
            <p>Custom graphic design, branding, and visual identity solutions.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Digital Media</h3>
            <p>Social media content, web design, and digital marketing solutions.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">☁️</div>
            <h3>Cloud Storage</h3>
            <p>Secure cloud storage and asset management for your media files.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Fast Delivery</h3>
            <p>Quick turnaround times and efficient project management.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  
  <footer id="contact">
    <div class="container">
      <p>&copy; 2025 Inner Animal Media. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
}

// API Handlers for Pages Management

// Scan and enhance all pages with SEO metatags and header
async function handleScanAndEnhancePages(request: Request, env: Env, url: URL): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({ error: 'R2_WEBSITE not configured' }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    // List all HTML files in pages/ directory
    const objects = await listR2Objects(env.R2_WEBSITE, 'pages/', 1000);
    const results: Array<{ path: string; status: string; error?: string; url?: string }> = [];

    for (const obj of objects) {
      if (!obj.key.endsWith('.html')) continue;

      try {
        // Get existing HTML
        const page = await env.R2_WEBSITE.get(obj.key);
        if (!page) continue;

        let html = await page.text();
        let wasModified = false;

        // Get header preference and logo URL, then inject if missing
        const headerType = await getHeaderPreference(env, 'glassmorphic');
        const logoUrl = await getLogoUrl(env);
        if (!html.includes('glassmorphic-header') && !html.includes('meauxbility-header') && !html.includes('id="nav"')) {
          html = await injectHeader(html, headerType, logoUrl, env);
          wasModified = true;
        }

        // Enhance with SEO
        const pagePath = `/${obj.key.replace('.html', '')}`;
        const originalHtml = html;
        html = await enhancePageWithSEO(html, pagePath, url, env);
        if (html !== originalHtml) {
          wasModified = true;
        }

        // Migrate images to Cloudflare CDN if not already migrated (if configured)
        if (env.CLOUDFLARE_IMAGES_API_TOKEN && env.CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
          const imageUrls = extractImagesFromHTML(html);
          const urlReplacements = new Map<string, string>();

          for (const imageUrl of imageUrls) {
            // Skip if already on Cloudflare CDN
            if (imageUrl.includes('imagedelivery.net')) continue;

            const migrationResult = await migrateImageToCloudflare(imageUrl, env, 'public');
            if (migrationResult.success && migrationResult.cdnUrl) {
              urlReplacements.set(imageUrl, migrationResult.cdnUrl);
            }
          }

          // Replace image URLs in HTML
          if (urlReplacements.size > 0) {
            urlReplacements.forEach((newUrl, oldUrl) => {
              html = html.replace(new RegExp(`src=["']${escapeRegex(oldUrl)}["']`, 'gi'), `src="${newUrl}"`);
              html = html.replace(new RegExp(`srcset=["']([^"']*${escapeRegex(oldUrl)}[^"']*)["']`, 'gi'), (match, srcset) => {
                return `srcset="${srcset.replace(oldUrl, newUrl)}"`;
              });
              html = html.replace(new RegExp(`background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), `background-image: url("${newUrl}")`);
              html = html.replace(new RegExp(`style=["'][^"']*background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), (match) => {
                return match.replace(oldUrl, newUrl);
              });
            });
            wasModified = true;
          }
        }

        // Upload enhanced HTML back to R2 if modified
        if (wasModified) {
          await uploadR2Object(env.R2_WEBSITE, obj.key, html);
        }

        const pageUrl = `${url.origin}${pagePath}`;
        results.push({
          path: obj.key,
          status: wasModified ? 'enhanced' : 'already-enhanced',
          url: pageUrl
        });
      } catch (error: any) {
        results.push({ path: obj.key, status: 'error', error: error.message });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      total: objects.length,
      processed: results.length,
      results,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Audit pages - find missing/broken pages
async function handlePagesAudit(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({ error: 'R2_WEBSITE not configured' }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    // Expected pages list
    const expectedPages = [
      'pages/about-us.html',
      'pages/team-meauxbility.html',
      'pages/contact.html',
      'pages/faq.html',
      'pages/apply-for-funding.html',
      'pages/mobility-grants-programs.html',
      'pages/community.html',
      'pages/resources-and-information.html',
      'pages/get-involved.html',
      'pages/donate.html',
      'pages/meauxbility-branding.html',
      'pages/news-media-features.html',
      'pages/non-profit-information.html',
      'pages/sam-primeaux.html',
      'pages/accessibility-partners.html',
    ];

    // List existing pages
    const objects = await listR2Objects(env.R2_WEBSITE, 'pages/', 1000);
    const existingPages = new Set(objects.map(obj => obj.key));

    const missing: string[] = [];
    const broken: Array<{ path: string; issue: string }> = [];
    const needsUpdate: Array<{ path: string; issues: string[] }> = [];
    const ready: string[] = [];

    for (const expectedPage of expectedPages) {
      if (!existingPages.has(expectedPage)) {
        missing.push(expectedPage);
        continue;
      }

      // Check if page has issues
      const page = await env.R2_WEBSITE.get(expectedPage);
      if (!page) {
        broken.push({ path: expectedPage, issue: 'File not accessible' });
        continue;
      }

      const html = await page.text();
      const issues: string[] = [];

      if (!html.includes('glassmorphic-header') && !html.includes('meauxbility-header')) {
        issues.push('Missing glassmorphic header');
      }
      if (!html.includes('og:title') || !html.includes('og:description')) {
        issues.push('Missing SEO metatags');
      }
      if (!html.includes('canonical')) {
        issues.push('Missing canonical URL');
      }
      if (html.match(/src=["'](?!https?:\/\/|data:)/) && !html.includes('imagedelivery.net')) {
        issues.push('Images not migrated to Cloudflare CDN');
      }

      if (issues.length > 0) {
        needsUpdate.push({ path: expectedPage, issues });
      } else {
        ready.push(expectedPage);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      summary: {
        total: expectedPages.length,
        missing: missing.length,
        broken: broken.length,
        needsUpdate: needsUpdate.length,
        ready: ready.length,
      },
      missing,
      broken,
      needsUpdate,
      ready,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Helper: List R2 objects with prefix filtering
async function listR2Objects(bucket: R2Bucket, prefix?: string, limit: number = 1000): Promise<Array<{ key: string; size: number; uploaded?: Date }>> {
  const options: R2ListOptions = { limit };
  if (prefix) {
    options.prefix = prefix;
  }

  const objects = await bucket.list(options);
  return objects.objects.map(obj => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded,
  }));
}

// Helper: Upload object to R2 with proper headers
async function uploadR2Object(
  bucket: R2Bucket,
  key: string,
  content: string | ArrayBuffer | ReadableStream,
  contentType: string = 'text/html; charset=utf-8'
): Promise<void> {
  await bucket.put(key, content, {
    httpMetadata: {
      contentType,
    },
    cacheControl: 'public, max-age=3600',
  });
}

// Helper: Extract all image URLs from HTML
function extractImagesFromHTML(html: string): string[] {
  const imageUrls = new Set<string>();

  // Extract from <img src="...">
  const imgSrcRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  const imgMatches = Array.from(html.matchAll(imgSrcRegex));
  imgMatches.forEach(match => {
    const url = match[1].trim();
    if (url && !url.startsWith('data:')) {
      imageUrls.add(url);
    }
  });

  // Extract from <img srcset="...">
  const srcsetRegex = /<img[^>]+srcset=["']([^"']+)["']/gi;
  const srcsetMatches = Array.from(html.matchAll(srcsetRegex));
  srcsetMatches.forEach(match => {
    const srcset = match[1];
    // Parse srcset: "image.jpg 1x, image-2x.jpg 2x" or "image.jpg 100w"
    const srcsetUrls = srcset.split(',').map(item => {
      const parts = item.trim().split(/\s+/);
      return parts[0].trim();
    });
    srcsetUrls.forEach(url => {
      if (url && !url.startsWith('data:')) {
        imageUrls.add(url);
      }
    });
  });

  // Extract from CSS background-image: url(...)
  const bgImageRegex = /background-image\s*:\s*url\(["']?([^"')]+)["']?\)/gi;
  const bgMatches = Array.from(html.matchAll(bgImageRegex));
  bgMatches.forEach(match => {
    const url = match[1].trim();
    if (url && !url.startsWith('data:')) {
      imageUrls.add(url);
    }
  });

  // Extract from inline style background-image
  const inlineBgRegex = /style=["'][^"']*background-image\s*:\s*url\(["']?([^"')]+)["']?\)/gi;
  const inlineBgMatches = Array.from(html.matchAll(inlineBgRegex));
  inlineBgMatches.forEach(match => {
    const url = match[1].trim();
    if (url && !url.startsWith('data:')) {
      imageUrls.add(url);
    }
  });

  return Array.from(imageUrls);
}

// Helper: Migrate single image to Cloudflare Images CDN
async function migrateImageToCloudflare(
  imageUrl: string,
  env: Env,
  variant: string = 'public'
): Promise<{ success: boolean; cdnUrl?: string; imageId?: string; error?: string }> {
  try {
    // Skip if already on Cloudflare CDN
    if (imageUrl.includes('imagedelivery.net')) {
      return { success: true, cdnUrl: imageUrl };
    }

    // Skip data URIs
    if (imageUrl.startsWith('data:')) {
      return { success: false, error: 'Data URI not supported' };
    }

    // Download image
    let imageResponse: Response;
    try {
      imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return { success: false, error: `Failed to download: ${imageResponse.status}` };
      }
    } catch (error: any) {
      return { success: false, error: `Download error: ${error.message}` };
    }

    // Get image blob
    const imageBlob = await imageResponse.blob();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Determine file extension from content type or URL
    let extension = 'jpg';
    if (contentType.includes('png')) extension = 'png';
    else if (contentType.includes('gif')) extension = 'gif';
    else if (contentType.includes('webp')) extension = 'webp';
    else if (contentType.includes('svg')) extension = 'svg';
    else {
      const urlMatch = imageUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)/i);
      if (urlMatch) extension = urlMatch[1].toLowerCase();
    }

    // Upload to Cloudflare Images
    const formData = new FormData();
    formData.append('file', imageBlob, `image.${extension}`);

    const accountId = env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken || !env.CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
      return { success: false, error: 'Cloudflare Images not configured' };
    }

    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      return { success: false, error: `Upload failed: ${errorText}` };
    }

    const uploadData = await uploadResponse.json();
    const imageId = uploadData.result?.id;
    const variants = uploadData.result?.variants || [];

    if (!imageId || !env.CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
      return { success: false, error: 'Invalid response from Cloudflare Images' };
    }

    // Use the requested variant or default to first available variant
    const selectedVariant = variants.includes(variant) ? variant : (variants[0] || 'public');
    const cdnUrl = `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${imageId}/${selectedVariant}`;

    return {
      success: true,
      cdnUrl,
      imageId,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Migrate images to Cloudflare CDN
async function handleMigrateImages(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE || !env.CLOUDFLARE_IMAGES_API_TOKEN || !env.CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
    return new Response(JSON.stringify({
      error: 'R2_WEBSITE or Cloudflare Images not configured'
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const objects = await listR2Objects(env.R2_WEBSITE, 'pages/', 1000);
    const results: Array<{ path: string; imagesMigrated: number; errors: string[]; newImageUrls?: string[] }> = [];

    for (const obj of objects) {
      if (!obj.key.endsWith('.html')) continue;

      try {
        const page = await env.R2_WEBSITE.get(obj.key);
        if (!page) continue;

        let html = await page.text();
        let imagesMigrated = 0;
        const errors: string[] = [];
        const newImageUrls: string[] = [];

        // Extract all image URLs (src, srcset, background-image)
        const imageUrls = extractImagesFromHTML(html);
        const urlReplacements = new Map<string, string>();

        // Migrate each image
        for (const imageUrl of imageUrls) {
          const migrationResult = await migrateImageToCloudflare(imageUrl, env, 'public');

          if (migrationResult.success && migrationResult.cdnUrl) {
            urlReplacements.set(imageUrl, migrationResult.cdnUrl);
            newImageUrls.push(migrationResult.cdnUrl);
            imagesMigrated++;
          } else {
            errors.push(`${imageUrl}: ${migrationResult.error || 'Migration failed'}`);
          }
        }

        // Replace all image URLs in HTML
        urlReplacements.forEach((newUrl, oldUrl) => {
          // Replace in src attributes
          html = html.replace(new RegExp(`src=["']${escapeRegex(oldUrl)}["']`, 'gi'), `src="${newUrl}"`);

          // Replace in srcset attributes (handle multiple URLs)
          html = html.replace(new RegExp(`srcset=["']([^"']*${escapeRegex(oldUrl)}[^"']*)["']`, 'gi'), (match, srcset) => {
            return `srcset="${srcset.replace(oldUrl, newUrl)}"`;
          });

          // Replace in background-image CSS
          html = html.replace(new RegExp(`background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), `background-image: url("${newUrl}")`);

          // Replace in inline style attributes
          html = html.replace(new RegExp(`style=["'][^"']*background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), (match) => {
            return match.replace(oldUrl, newUrl);
          });
        });

        // Upload updated HTML if any images were migrated
        if (imagesMigrated > 0) {
          await uploadR2Object(env.R2_WEBSITE, obj.key, html);
        }

        results.push({
          path: obj.key,
          imagesMigrated,
          errors,
          newImageUrls: newImageUrls.length > 0 ? newImageUrls : undefined
        });
      } catch (error: any) {
        results.push({
          path: obj.key,
          imagesMigrated: 0,
          errors: [error.message]
        });
      }
    }

    const totalImagesMigrated = results.reduce((sum, r) => sum + r.imagesMigrated, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

    return new Response(JSON.stringify({
      success: true,
      total: objects.length,
      totalImagesMigrated,
      totalErrors,
      results,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Remaster Shopify HTML (for future use)
async function handleRemasterPage(request: Request, env: Env, url: URL): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({ error: 'R2_WEBSITE not configured' }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const { shopifyHtml, pagePath, metadata } = await request.json();

    if (!shopifyHtml || !pagePath) {
      return new Response(JSON.stringify({ error: 'shopifyHtml and pagePath required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Remaster Shopify HTML
    let html = remasterShopifyHTML(shopifyHtml);

    // Inject header (use current preference)
    const headerType = await getHeaderPreference(env, 'glassmorphic');
    const logoUrl = await getLogoUrl(env);
    html = await injectHeader(html, headerType, logoUrl, env);

    // Enhance with SEO (use provided metadata or extract)
    const pageMetadata = metadata || await extractPageMetadata(html, pagePath, url, env);
    html = await enhancePageWithSEO(html, pagePath, url, env);

    // Migrate images to Cloudflare CDN if configured
    if (env.CLOUDFLARE_IMAGES_API_TOKEN && env.CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
      const imageUrls = extractImagesFromHTML(html);
      const urlReplacements = new Map<string, string>();

      for (const imageUrl of imageUrls) {
        const migrationResult = await migrateImageToCloudflare(imageUrl, env, 'public');
        if (migrationResult.success && migrationResult.cdnUrl) {
          urlReplacements.set(imageUrl, migrationResult.cdnUrl);
        }
      }

      // Replace image URLs in HTML
      urlReplacements.forEach((newUrl, oldUrl) => {
        html = html.replace(new RegExp(`src=["']${escapeRegex(oldUrl)}["']`, 'gi'), `src="${newUrl}"`);
        html = html.replace(new RegExp(`srcset=["']([^"']*${escapeRegex(oldUrl)}[^"']*)["']`, 'gi'), (match, srcset) => {
          return `srcset="${srcset.replace(oldUrl, newUrl)}"`;
        });
        html = html.replace(new RegExp(`background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), `background-image: url("${newUrl}")`);
        html = html.replace(new RegExp(`style=["'][^"']*background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), (match) => {
          return match.replace(oldUrl, newUrl);
        });
      });
    }

    // Upload to R2
    const r2Path = pagePath.startsWith('pages/') ? pagePath : `pages/${pagePath}`;
    const finalPath = r2Path.endsWith('.html') ? r2Path : `${r2Path}.html`;

    await uploadR2Object(env.R2_WEBSITE, finalPath, html);

    return new Response(JSON.stringify({
      success: true,
      path: finalPath,
      url: `${url.origin}/${finalPath.replace('.html', '')}`,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Bulk remaster multiple pages
async function handleBulkRemasterPages(request: Request, env: Env, url: URL): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({ error: 'R2_WEBSITE not configured' }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const { pages } = await request.json();

    if (!pages || !Array.isArray(pages)) {
      return new Response(JSON.stringify({ error: 'pages array required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const results = [];

    for (const page of pages) {
      try {
        let html = page.html;
        const pagePath = page.path;
        const migrateImages = page.migrateImages !== false;

        // 1. Remaster Shopify HTML
        html = remasterShopifyHTML(html);

        // 2. Migrate images to Cloudflare CDN
        let imagesMigrated = 0;
        if (migrateImages && env.CLOUDFLARE_IMAGES_API_TOKEN && env.CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
          const imageUrls = extractImagesFromHTML(html);
          const urlReplacements = new Map<string, string>();

          for (const imageUrl of imageUrls) {
            if (!imageUrl.includes('imagedelivery.net') && !imageUrl.startsWith('data:') && !imageUrl.startsWith('http://localhost')) {
              const migrationResult = await migrateImageToCloudflare(imageUrl, env, 'public');
              if (migrationResult.success && migrationResult.cdnUrl) {
                urlReplacements.set(imageUrl, migrationResult.cdnUrl);
                imagesMigrated++;
              }
            }
          }

          // Replace all image URLs
          urlReplacements.forEach((newUrl, oldUrl) => {
            html = html.replace(new RegExp(`src=["']${escapeRegex(oldUrl)}["']`, 'gi'), `src="${newUrl}"`);
            html = html.replace(new RegExp(`srcset=["']([^"']*${escapeRegex(oldUrl)}[^"']*)["']`, 'gi'), (match: string, srcset: string) => {
              return `srcset="${srcset.replace(oldUrl, newUrl)}"`;
            });
            html = html.replace(new RegExp(`background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), `background-image: url("${newUrl}")`);
            html = html.replace(new RegExp(`style=["'][^"']*background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), (match: string) => {
              return match.replace(oldUrl, newUrl);
            });
            // Replace in CSS variables (--src:url(...))
            html = html.replace(new RegExp(`--src:url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), `--src:url("${newUrl}")`);
            // Replace in mask background-image
            html = html.replace(new RegExp(`background-image:\\s*var\\(--src\\)`, 'gi'), `background-image: var(--src)`);
          });
        }

        // 3. Inject header
        const headerType = await getHeaderPreference(env, 'glassmorphic');
        const logoUrl = await getLogoUrl(env);
        html = await injectHeader(html, headerType, logoUrl, env);

        // 4. Enhance with SEO
        const pageUrlPath = pagePath.replace('.html', '').replace(/^pages\//, '/pages/').replace(/^index\.html$/, '/');
        html = await enhancePageWithSEO(html, pageUrlPath, url, env);

        // 5. Upload to R2
        const r2Path = pagePath.startsWith('pages/') ? pagePath : (pagePath === 'index.html' ? 'index.html' : `pages/${pagePath}`);
        await uploadR2Object(env.R2_WEBSITE, r2Path, html);

        // Store revision
        if (env.KV_CONFIG) {
          const revisionKey = `revision:${r2Path}:${Date.now()}`;
          await env.KV_CONFIG.put(revisionKey, JSON.stringify({
            path: r2Path,
            timestamp: new Date().toISOString(),
            action: 'bulk_remaster',
            imagesMigrated,
          }));
        }

        results.push({
          path: r2Path,
          success: true,
          url: `${url.origin}/${r2Path.replace('.html', '').replace('index.html', '')}`,
          imagesMigrated,
        });
      } catch (error: any) {
        results.push({
          path: page.path,
          success: false,
          error: error.message,
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      total: pages.length,
      processed: results.length,
      results,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Remaster Shopify HTML - remove Shopify-specific elements
function remasterShopifyHTML(html: string): string {
  // Remove Shopify scripts (but keep Stripe for donations)
  html = html.replace(/<script[^>]*shopify[^>]*>[\s\S]*?<\/script>/gi, '');

  // Keep Stripe scripts
  // Don't remove Stripe - it's needed for donations

  // Remove Shopify meta tags
  html = html.replace(/<meta[^>]*shopify[^>]*>/gi, '');

  // Remove Shopify tracking pixels
  html = html.replace(/<img[^>]*shopify[^>]*>/gi, '');

  // Clean up empty lines
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

  return html;
}

// Admin Page Handler
async function handleAdminPage(request: Request, env: Env, path: string, url: URL): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  return new Response(generateAdminPageHTML(url), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

// Generate Admin Page HTML
function generateAdminPageHTML(url: URL): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meauxbility Admin - Header Settings</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
      color: #333;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .header p {
      opacity: 0.9;
    }
    .content {
      padding: 2rem;
    }
    .section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 12px;
    }
    .section h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }
    .radio-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .radio-option {
      flex: 1;
      min-width: 200px;
      padding: 1.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      background: white;
    }
    .radio-option:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
    .radio-option input[type="radio"] {
      margin-right: 0.5rem;
    }
    .radio-option.selected {
      border-color: #667eea;
      background: #f0f4ff;
    }
    .radio-option h3 {
      margin-bottom: 0.5rem;
      color: #333;
    }
    .radio-option p {
      color: #666;
      font-size: 0.9rem;
    }
    .preview {
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      max-height: 300px;
      overflow-y: auto;
    }
    .btn {
      padding: 0.75rem 2rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 1rem;
    }
    .btn:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .status {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 8px;
      display: none;
    }
    .status.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
      display: block;
    }
    .status.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      display: block;
    }
    .info-box {
      background: #e7f3ff;
      border-left: 4px solid #2196F3;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }
    .info-box p {
      margin: 0;
      color: #0c5460;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎛️ Meauxbility Admin</h1>
      <p>Header Settings & Development Tools</p>
    </div>
    <div class="content">
        <div class="section">
        <h2>Logo Management</h2>
        <div class="info-box">
          <p><strong>📸 Logo:</strong> Upload your official logo. It will be optimized via Cloudflare Images and stored permanently in R2.</p>
        </div>
        <form id="logoUploadForm" style="margin-bottom: 1rem;">
          <input type="file" id="logoFile" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="margin-bottom: 1rem; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; width: 100%;">
          <button type="submit" class="btn" id="uploadLogoBtn">📤 Upload & Optimize Logo</button>
        </form>
        <div id="logoStatus" class="status"></div>
        <div id="currentLogo" style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
          <p style="margin-bottom: 0.5rem;"><strong>Current Logo:</strong></p>
          <img id="logoPreview" src="" alt="Logo preview" style="max-width: 200px; height: auto; border-radius: 4px;" onerror="this.style.display='none';">
          <p id="logoUrl" style="font-size: 0.875rem; color: #666; margin-top: 0.5rem; word-break: break-all;"></p>
        </div>
      </div>
      
      <div class="section">
        <h2>Header Selection</h2>
        <div class="info-box">
          <p><strong>💡 Tip:</strong> Choose which header to use across all pages. Changes apply immediately to new page loads.</p>
        </div>
        <div class="radio-group" id="headerOptions">
          <label class="radio-option" data-value="glassmorphic">
            <input type="radio" name="headerType" value="glassmorphic">
            <h3>✨ Glassmorphic Header</h3>
            <p>Modern, iOS-quality glassmorphic design with smooth animations</p>
          </label>
          <label class="radio-option" data-value="legacy">
            <input type="radio" name="headerType" value="legacy">
            <h3>🎨 Legacy Header</h3>
            <p>Original header with theme support and Inter font</p>
          </label>
        </div>
        <button class="btn" id="saveBtn">💾 Save Header Preference</button>
        <div class="status" id="status"></div>
      </div>
      
      <div class="section">
        <h2>Logo & Team Page Processing</h2>
        <div class="info-box">
          <p><strong>🚀 One-Click Setup:</strong> Upload logo from assets folder, optimize all images, and remaster team page with proper SEO.</p>
        </div>
        <button class="btn" id="processLogoBtn" style="background: #9B59B6;">
          🎨 Process Logo & Remaster Team Page
        </button>
        <div id="processStatus" class="status"></div>
      </div>
      
      <div class="section">
        <h2>📄 Content Management System</h2>
        <div class="info-box">
          <p><strong>💡 CMS Features:</strong> Upload HTML, edit metatags, manage images, rename/delete files, and view all live URLs.</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">Upload & Remaster HTML</h3>
          <form id="cmsUploadForm" style="margin-bottom: 1rem;">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label for="htmlFile" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">HTML File *</label>
              <input type="file" id="htmlFile" accept=".html,.htm" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
              <label for="pagePath" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Page Path (e.g., pages/about-us.html) *</label>
              <input type="text" id="pagePath" placeholder="pages/about-us.html" required style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input type="checkbox" id="migrateImages" checked>
                <span>Migrate images to Cloudflare CDN</span>
              </label>
            </div>
            <button type="submit" class="btn" id="uploadPageBtn">📤 Upload & Remaster Page</button>
          </form>
          <div id="uploadStatus" class="status"></div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">Page Management</h3>
          <button class="btn" id="listPagesBtn" style="background: #17a2b8; margin-right: 0.5rem;">📋 List All Pages</button>
          <button class="btn" id="liveUrlsBtn" style="background: #28a745;">🌐 View Live URLs</button>
          <div id="pagesList" style="margin-top: 1rem; max-height: 400px; overflow-y: auto; background: #f8f9fa; padding: 1rem; border-radius: 8px; display: none;"></div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">Edit Metatags</h3>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label for="metatagPagePath" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Page Path</label>
            <input type="text" id="metatagPagePath" placeholder="pages/about-us.html" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <button class="btn" id="loadMetatagsBtn" style="background: #6c757d; margin-bottom: 1rem;">📥 Load Page</button>
          <div id="metatagsEditor" style="display: none;">
            <div class="form-group" style="margin-bottom: 1rem;">
              <label for="metaTitle" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Title</label>
              <input type="text" id="metaTitle" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
              <label for="metaDescription" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Description</label>
              <textarea id="metaDescription" rows="3" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
              <label for="metaKeywords" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Keywords (comma-separated)</label>
              <input type="text" id="metaKeywords" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
              <label for="metaOgImage" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">OG Image URL</label>
              <input type="text" id="metaOgImage" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <button class="btn" id="saveMetatagsBtn" style="background: #28a745;">💾 Save Metatags</button>
            <div id="metatagsStatus" class="status"></div>
          </div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">🖼️ Media Management</h3>
          <div class="info-box" style="margin-bottom: 1rem;">
            <p><strong>Cloudflare Images:</strong> Upload, manage, and optimize images. All images are stored in Cloudflare Images and delivered via CDN.</p>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <button class="btn" id="listImagesBtn" style="background: #17a2b8; margin-right: 0.5rem;">📋 List All Images</button>
            <button class="btn" id="refreshImagesBtn" style="background: #6c757d;">🔄 Refresh</button>
          </div>
          
          <div style="margin-bottom: 1rem;">
            <h4 style="margin-bottom: 0.5rem; font-size: 1.1rem;">Upload Image</h4>
            <form id="imageUploadForm" style="margin-bottom: 1rem;">
              <div class="form-group" style="margin-bottom: 1rem;">
                <label for="imageFile" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Image File *</label>
                <input type="file" id="imageFile" accept="image/*" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
              </div>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="checkbox" id="requireSignedURLs">
                  <span>Require Signed URLs (Private)</span>
                </label>
              </div>
              <button type="submit" class="btn" id="uploadImageBtn">📤 Upload Image</button>
            </form>
            <div id="imageUploadStatus" class="status"></div>
          </div>
          
          <div id="imagesList" style="margin-top: 1rem; max-height: 600px; overflow-y: auto; background: #f8f9fa; padding: 1rem; border-radius: 8px; display: none;">
            <div id="imagesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;"></div>
          </div>
        </div>

        <div style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">File Operations</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label for="deleteFilePath" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Delete File Path</label>
              <input type="text" id="deleteFilePath" placeholder="pages/old-page.html" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="display: flex; align-items: flex-end;">
              <button class="btn" id="deleteFileBtn" style="background: #dc3545;">🗑️ Delete</button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
            <div class="form-group">
              <label for="renameOldPath" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Old Path</label>
              <input type="text" id="renameOldPath" placeholder="pages/old-name.html" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div class="form-group">
              <label for="renameNewPath" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">New Path</label>
              <input type="text" id="renameNewPath" placeholder="pages/new-name.html" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="display: flex; align-items: flex-end;">
              <button class="btn" id="renameFileBtn" style="background: #ffc107; color: #000;">✏️ Rename</button>
            </div>
          </div>
          <div id="fileOpsStatus" class="status"></div>
        </div>
      </div>
      
      <div class="section">
        <h2>Quick Actions</h2>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="/pages/about-us" class="btn" style="text-decoration: none; display: inline-block;" target="_blank">
            👁️ Preview About Page
          </a>
          <a href="/pages/team-meauxbility" class="btn" style="text-decoration: none; display: inline-block; background: #9B59B6;" target="_blank">
            👥 Preview Team Page
          </a>
          <a href="/api/pages/audit" class="btn" style="text-decoration: none; display: inline-block; background: #28a745;" target="_blank">
            🔍 Run Page Audit
          </a>
          <a href="/api/pages/scan-and-enhance" class="btn" style="text-decoration: none; display: inline-block; background: #17a2b8;" target="_blank">
            ⚡ Scan & Enhance
          </a>
        </div>
      </div>
    </div>
  </div>

  <script>
    (function() {
      const headerOptions = document.querySelectorAll('.radio-option');
      const saveBtn = document.getElementById('saveBtn');
      const status = document.getElementById('status');
      
      // Load current preference
      fetch('/api/admin/header-settings')
        .then(r => r.json())
        .then(data => {
          if (data.preference) {
            const option = document.querySelector(\`[data-value="\${data.preference}"]\`);
            if (option) {
              option.querySelector('input').checked = true;
              option.classList.add('selected');
            }
          }
        })
        .catch(err => console.error('Error loading settings:', err));
      
      // Handle radio selection
      headerOptions.forEach(option => {
        option.addEventListener('click', () => {
          headerOptions.forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');
          option.querySelector('input').checked = true;
        });
      });
      
      // Save preference
      saveBtn.addEventListener('click', async () => {
        const selected = document.querySelector('input[name="headerType"]:checked');
        if (!selected) {
          showStatus('Please select a header type', 'error');
          return;
        }
        
        saveBtn.disabled = true;
        saveBtn.textContent = '💾 Saving...';
        
        try {
          const response = await fetch('/api/admin/header-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preference: selected.value })
          });
          
          const data = await response.json();
          
          if (data.success) {
            showStatus('✅ Header preference saved! Refresh pages to see changes.', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            showStatus('❌ Error: ' + (data.error || 'Failed to save'), 'error');
          }
        } catch (error) {
          showStatus('❌ Error: ' + error.message, 'error');
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = '💾 Save Header Preference';
        }
      });
      
      function showStatus(message, type) {
        status.textContent = message;
        status.className = 'status ' + type;
        setTimeout(() => {
          status.className = 'status';
        }, 5000);
      }
      
      // Logo upload functionality
      const logoForm = document.getElementById('logoUploadForm');
      const logoFile = document.getElementById('logoFile');
      const uploadLogoBtn = document.getElementById('uploadLogoBtn');
      const logoStatus = document.getElementById('logoStatus');
      const logoPreview = document.getElementById('logoPreview');
      const logoUrl = document.getElementById('logoUrl');
      
      // Process Logo & Team Page button
      const processLogoBtn = document.getElementById('processLogoBtn');
      const processStatus = document.getElementById('processStatus');
      
      if (processLogoBtn) {
        processLogoBtn.addEventListener('click', async () => {
          processLogoBtn.disabled = true;
          processLogoBtn.textContent = '🔄 Processing...';
          processStatus.className = 'status';
          processStatus.textContent = 'Processing logo upload and team page remaster...';
          
          try {
            const response = await fetch('/api/admin/process-logo-and-team', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
              processStatus.className = 'status success';
              processStatus.innerHTML = \`
                ✅ <strong>Success!</strong><br>
                Logo: \${data.results.logo ? '✅ Uploaded' : '⚠️ Not found'}<br>
                Team Page: \${data.results.teamPage ? '✅ Remastered' : '❌ Failed'}<br>
                Images Migrated: \${data.results.imagesMigrated?.length || 0}<br>
                <a href="/pages/team-meauxbility" target="_blank" style="color: #155724; text-decoration: underline;">View Team Page →</a>
              \`;
              
              // Update logo preview if logo was uploaded
              if (data.results.logo?.logoUrl) {
                logoPreview.src = data.results.logo.logoUrl;
                logoUrl.textContent = data.results.logo.logoUrl;
              }
            } else {
              processStatus.className = 'status error';
              processStatus.textContent = '❌ Error: ' + (data.error || 'Processing failed');
            }
          } catch (error) {
            processStatus.className = 'status error';
            processStatus.textContent = '❌ Error: ' + error.message;
          } finally {
            processLogoBtn.disabled = false;
            processLogoBtn.textContent = '🎨 Process Logo & Remaster Team Page';
          }
        });
      }
      
      // CMS Functionality
      const cmsUploadForm = document.getElementById('cmsUploadForm');
      const uploadPageBtn = document.getElementById('uploadPageBtn');
      const uploadStatus = document.getElementById('uploadStatus');
      const listPagesBtn = document.getElementById('listPagesBtn');
      const liveUrlsBtn = document.getElementById('liveUrlsBtn');
      const pagesList = document.getElementById('pagesList');
      const loadMetatagsBtn = document.getElementById('loadMetatagsBtn');
      const metatagsEditor = document.getElementById('metatagsEditor');
      const saveMetatagsBtn = document.getElementById('saveMetatagsBtn');
      const metatagsStatus = document.getElementById('metatagsStatus');
      const deleteFileBtn = document.getElementById('deleteFileBtn');
      const renameFileBtn = document.getElementById('renameFileBtn');
      const fileOpsStatus = document.getElementById('fileOpsStatus');
      
      // Upload & Remaster HTML Page
      if (cmsUploadForm) {
        cmsUploadForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const htmlFile = document.getElementById('htmlFile');
          const pagePath = document.getElementById('pagePath');
          const migrateImages = document.getElementById('migrateImages');
          
          if (!htmlFile.files || !htmlFile.files[0] || !pagePath.value) {
            showStatus('Please select a file and enter a page path', 'error', uploadStatus);
            return;
          }
          
          uploadPageBtn.disabled = true;
          uploadPageBtn.textContent = '📤 Uploading...';
          
          try {
            const formData = new FormData();
            formData.append('file', htmlFile.files[0]);
            formData.append('pagePath', pagePath.value);
            formData.append('migrateImages', migrateImages.checked ? 'true' : 'false');
            
            const response = await fetch('/api/cms/upload-page', {
              method: 'POST',
              body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
              showStatus(\`✅ Page uploaded and remastered! <a href="\${data.url}" target="_blank">View Page →</a>\`, 'success', uploadStatus);
              cmsUploadForm.reset();
            } else {
              showStatus('❌ Error: ' + (data.error || 'Upload failed'), 'error', uploadStatus);
            }
          } catch (error) {
            showStatus('❌ Error: ' + error.message, 'error', uploadStatus);
          } finally {
            uploadPageBtn.disabled = false;
            uploadPageBtn.textContent = '📤 Upload & Remaster Page';
          }
        });
      }
      
      // List All Pages
      if (listPagesBtn) {
        listPagesBtn.addEventListener('click', async () => {
          listPagesBtn.disabled = true;
          listPagesBtn.textContent = '⏳ Loading...';
          
          try {
            const response = await fetch('/api/cms/list');
            const data = await response.json();
            
            if (data.success) {
              pagesList.style.display = 'block';
              pagesList.innerHTML = \`
                <h4 style="margin-bottom: 1rem;">📄 Pages (\${data.pages.length})</h4>
                <div style="display: grid; gap: 0.5rem;">
                  \${data.pages.map(p => \`
                    <div style="padding: 0.75rem; background: white; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <strong>\${p.path}</strong><br>
                        <small style="color: #666;">\${(p.size / 1024).toFixed(2)} KB • Updated: \${new Date(p.uploaded).toLocaleDateString()}</small>
                      </div>
                      <a href="/\${p.path.replace('.html', '')}" target="_blank" style="color: #667eea; text-decoration: none;">👁️ View</a>
                    </div>
                  \`).join('')}
                </div>
                <h4 style="margin-top: 2rem; margin-bottom: 1rem;">🖼️ Images (\${data.images.length})</h4>
                <div style="display: grid; gap: 0.5rem;">
                  \${data.images.map(img => \`
                    <div style="padding: 0.75rem; background: white; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <strong>\${img.path}</strong><br>
                        <small style="color: #666;">\${(img.size / 1024).toFixed(2)} KB</small>
                      </div>
                      <img src="/\${img.path}" style="max-width: 60px; max-height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.style.display='none';">
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else {
              showStatus('❌ Error loading pages', 'error', pagesList);
            }
          } catch (error) {
            showStatus('❌ Error: ' + error.message, 'error', pagesList);
          } finally {
            listPagesBtn.disabled = false;
            listPagesBtn.textContent = '📋 List All Pages';
          }
        });
      }
      
      // Live URLs Inventory
      if (liveUrlsBtn) {
        liveUrlsBtn.addEventListener('click', async () => {
          liveUrlsBtn.disabled = true;
          liveUrlsBtn.textContent = '⏳ Generating...';
          
          try {
            const response = await fetch('/api/cms/live-urls');
            const data = await response.json();
            
            if (data.success) {
              pagesList.style.display = 'block';
              pagesList.innerHTML = \`
                <h4 style="margin-bottom: 1rem;">🌐 Live URLs Inventory</h4>
                <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                  <p><strong>Total Pages:</strong> \${data.pages.length}</p>
                  <p><strong>Base URL:</strong> \${data.baseUrl}</p>
                </div>
                <div style="display: grid; gap: 0.5rem; max-height: 500px; overflow-y: auto;">
                  \${data.pages.map(p => \`
                    <div style="padding: 1rem; background: white; border-radius: 4px; border-left: 4px solid #667eea;">
                      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <div>
                          <strong style="font-size: 1.1rem;">\${p.title || p.path}</strong><br>
                          <code style="color: #667eea; font-size: 0.875rem;">\${p.url}</code>
                        </div>
                        <a href="\${p.url}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 600;">👁️ View</a>
                      </div>
                      <p style="color: #666; font-size: 0.9rem; margin: 0.5rem 0;">\${p.description || 'No description'}</p>
                      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                        <span style="background: #e7f3ff; color: #0c5460; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">\${p.hasHeader ? '✅ Header' : '❌ No Header'}</span>
                        <span style="background: #e7f3ff; color: #0c5460; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">\${p.hasSEO ? '✅ SEO' : '❌ No SEO'}</span>
                        <span style="background: #e7f3ff; color: #0c5460; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">\${p.imagesMigrated || 0} Images</span>
                      </div>
                    </div>
                  \`).join('')}
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: #f0f4ff; border-radius: 8px;">
                  <button onclick="navigator.clipboard.writeText(\`\${data.pages.map(p => p.url).join('\\n')}\`)" class="btn" style="margin: 0;">📋 Copy All URLs</button>
                </div>
              \`;
            } else {
              showStatus('❌ Error generating URLs', 'error', pagesList);
            }
          } catch (error) {
            showStatus('❌ Error: ' + error.message, 'error', pagesList);
          } finally {
            liveUrlsBtn.disabled = false;
            liveUrlsBtn.textContent = '🌐 View Live URLs';
          }
        });
      }
      
      // Load Metatags
      if (loadMetatagsBtn) {
        loadMetatagsBtn.addEventListener('click', async () => {
          const pagePath = document.getElementById('metatagPagePath');
          if (!pagePath.value) {
            showStatus('Please enter a page path', 'error', metatagsStatus);
            return;
          }
          
          loadMetatagsBtn.disabled = true;
          loadMetatagsBtn.textContent = '⏳ Loading...';
          
          try {
            const response = await fetch(\`/api/cms/page?path=\${encodeURIComponent(pagePath.value)}\`);
            const data = await response.json();
            
            if (data.success) {
              document.getElementById('metaTitle').value = data.metatags.title || '';
              document.getElementById('metaDescription').value = data.metatags.description || '';
              document.getElementById('metaKeywords').value = data.metatags.keywords?.join(', ') || '';
              document.getElementById('metaOgImage').value = data.metatags.ogImage || '';
              metatagsEditor.style.display = 'block';
              showStatus('✅ Page loaded', 'success', metatagsStatus);
            } else {
              showStatus('❌ Error: ' + (data.error || 'Page not found'), 'error', metatagsStatus);
            }
          } catch (error) {
            showStatus('❌ Error: ' + error.message, 'error', metatagsStatus);
          } finally {
            loadMetatagsBtn.disabled = false;
            loadMetatagsBtn.textContent = '📥 Load Page';
          }
        });
      }
      
      // Save Metatags
      if (saveMetatagsBtn) {
        saveMetatagsBtn.addEventListener('click', async () => {
          const pagePath = document.getElementById('metatagPagePath');
          if (!pagePath.value) {
            showStatus('Please enter a page path', 'error', metatagsStatus);
            return;
          }
          
          saveMetatagsBtn.disabled = true;
          saveMetatagsBtn.textContent = '💾 Saving...';
          
          try {
            const keywords = document.getElementById('metaKeywords').value.split(',').map(k => k.trim()).filter(k => k);
            
            const response = await fetch('/api/cms/update-metatags', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pagePath: pagePath.value,
                metatags: {
                  title: document.getElementById('metaTitle').value,
                  description: document.getElementById('metaDescription').value,
                  keywords: keywords,
                  ogImage: document.getElementById('metaOgImage').value,
                }
              })
            });
            
            const data = await response.json();
            
            if (data.success) {
              showStatus('✅ Metatags updated! <a href="' + data.url + '" target="_blank">View Page →</a>', 'success', metatagsStatus);
            } else {
              showStatus('❌ Error: ' + (data.error || 'Update failed'), 'error', metatagsStatus);
            }
          } catch (error) {
            showStatus('❌ Error: ' + error.message, 'error', metatagsStatus);
          } finally {
            saveMetatagsBtn.disabled = false;
            saveMetatagsBtn.textContent = '💾 Save Metatags';
          }
        });
      }
      
      // Delete File
      if (deleteFileBtn) {
        deleteFileBtn.addEventListener('click', async () => {
          const filePath = document.getElementById('deleteFilePath');
          if (!filePath.value) {
            showStatus('Please enter a file path', 'error', fileOpsStatus);
            return;
          }
          
          if (!confirm(\`Are you sure you want to delete \${filePath.value}? This cannot be undone.\`)) {
            return;
          }
          
          deleteFileBtn.disabled = true;
          deleteFileBtn.textContent = '🗑️ Deleting...';
          
          try {
            const response = await fetch(\`/api/cms/delete?path=\${encodeURIComponent(filePath.value)}\`, {
              method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
              showStatus('✅ File deleted successfully', 'success', fileOpsStatus);
              filePath.value = '';
            } else {
              showStatus('❌ Error: ' + (data.error || 'Delete failed'), 'error', fileOpsStatus);
            }
          } catch (error) {
            showStatus('❌ Error: ' + error.message, 'error', fileOpsStatus);
          } finally {
            deleteFileBtn.disabled = false;
            deleteFileBtn.textContent = '🗑️ Delete';
          }
        });
      }
      
      // Rename File
      if (renameFileBtn) {
        renameFileBtn.addEventListener('click', async () => {
          const oldPath = document.getElementById('renameOldPath');
          const newPath = document.getElementById('renameNewPath');
          
          if (!oldPath.value || !newPath.value) {
            showStatus('Please enter both old and new paths', 'error', fileOpsStatus);
            return;
          }
          
          renameFileBtn.disabled = true;
          renameFileBtn.textContent = '✏️ Renaming...';
          
          try {
            const response = await fetch('/api/cms/rename', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                oldPath: oldPath.value,
                newPath: newPath.value
              })
            });
            
            const data = await response.json();
            
            if (data.success) {
              showStatus(\`✅ File renamed! <a href="\${data.newUrl}" target="_blank">View →</a>\`, 'success', fileOpsStatus);
              oldPath.value = '';
              newPath.value = '';
            } else {
              showStatus('❌ Error: ' + (data.error || 'Rename failed'), 'error', fileOpsStatus);
            }
          } catch (error) {
            showStatus('❌ Error: ' + error.message, 'error', fileOpsStatus);
          } finally {
            renameFileBtn.disabled = false;
            renameFileBtn.textContent = '✏️ Rename';
          }
        });
      }
      
      function showStatus(message, type, element) {
        element.textContent = message;
        element.className = 'status ' + type;
        if (message.includes('<a')) {
          element.innerHTML = message;
        }
        setTimeout(() => {
          element.className = 'status';
        }, 8000);
      }
      
      // Media Management
      const listImagesBtn = document.getElementById('listImagesBtn');
      const refreshImagesBtn = document.getElementById('refreshImagesBtn');
      const imagesList = document.getElementById('imagesList');
      const imagesGrid = document.getElementById('imagesGrid');
      const imageUploadForm = document.getElementById('imageUploadForm');
      const uploadImageBtn = document.getElementById('uploadImageBtn');
      const imageUploadStatus = document.getElementById('imageUploadStatus');
      
      // List Images
      if (listImagesBtn) {
        listImagesBtn.addEventListener('click', async () => {
          listImagesBtn.disabled = true;
          listImagesBtn.textContent = '⏳ Loading...';
          imagesList.style.display = 'block';
          imagesGrid.innerHTML = '<p>Loading images...</p>';
          
          try {
            const response = await fetch('/api/media/images?per_page=100');
            const data = await response.json();
            
            if (data.success && data.images) {
              imagesGrid.innerHTML = '';
              
              if (data.images.length === 0) {
                imagesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No images found. Upload your first image!</p>';
              } else {
                data.images.forEach(image => {
                  const card = document.createElement('div');
                  card.style.cssText = 'background: white; border-radius: 8px; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
                  
                  const previewUrl = image.deliveryUrls && image.deliveryUrls.length > 0 
                    ? image.deliveryUrls[0] 
                    : \`https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/\${image.id}/public\`;
                  
                  card.innerHTML = \`
                    <img src="\${previewUrl}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 0.5rem;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 200 200%27%3E%3Ctext y=%2750%25%27%3ENo Preview%3C/text%3E%3C/svg%3E';">
                    <div style="font-size: 0.875rem; margin-bottom: 0.5rem;">
                      <strong>\${image.filename || image.id}</strong>
                    </div>
                    <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.5rem; word-break: break-all;">
                      ID: \${image.id.substring(0, 20)}...
                    </div>
                    <div style="display: flex; gap: 0.25rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                      \${image.variants ? image.variants.slice(0, 3).map(v => \`
                        <span style="background: #e7f3ff; color: #0c5460; padding: 0.125rem 0.5rem; border-radius: 4px; font-size: 0.7rem;">\${v}</span>
                      \`).join('') : ''}
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                      <button onclick="copyImageUrl('\${previewUrl}')" style="flex: 1; padding: 0.5rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">📋 Copy URL</button>
                      <button onclick="deleteImage('\${image.id}')" style="padding: 0.5rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">🗑️</button>
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.7rem; color: #666;">
                      \${image.uploaded ? new Date(image.uploaded).toLocaleDateString() : ''}
                    </div>
                  \`;
                  imagesGrid.appendChild(card);
                });
              }
            } else {
              imagesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #dc3545;">Error loading images</p>';
            }
          } catch (error) {
            imagesGrid.innerHTML = \`<p style="grid-column: 1/-1; text-align: center; color: #dc3545;">Error: \${error.message}</p>\`;
          } finally {
            listImagesBtn.disabled = false;
            listImagesBtn.textContent = '📋 List All Images';
          }
        });
      }
      
      // Refresh Images
      if (refreshImagesBtn) {
        refreshImagesBtn.addEventListener('click', () => {
          if (listImagesBtn) listImagesBtn.click();
        });
      }
      
      // Upload Image
      if (imageUploadForm) {
        imageUploadForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const imageFile = document.getElementById('imageFile');
          const requireSignedURLs = document.getElementById('requireSignedURLs');
          
          if (!imageFile.files || !imageFile.files[0]) {
            showStatus('Please select an image file', 'error', imageUploadStatus);
            return;
          }
          
          uploadImageBtn.disabled = true;
          uploadImageBtn.textContent = '📤 Uploading...';
          
          try {
            const formData = new FormData();
            formData.append('file', imageFile.files[0]);
            if (requireSignedURLs.checked) {
              formData.append('requireSignedURLs', 'true');
            }
            
            const response = await fetch('/api/media/upload', {
              method: 'POST',
              body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
              showStatus(\`✅ Image uploaded! ID: \${data.imageId}\`, 'success', imageUploadStatus);
              imageUploadForm.reset();
              if (listImagesBtn) {
                setTimeout(() => listImagesBtn.click(), 1000);
              }
            } else {
              showStatus('❌ Error: ' + (data.error || 'Upload failed'), 'error', imageUploadStatus);
            }
          } catch (error) {
            showStatus('❌ Error: ' + error.message, 'error', imageUploadStatus);
          } finally {
            uploadImageBtn.disabled = false;
            uploadImageBtn.textContent = '📤 Upload Image';
          }
        });
      }
      
      // Helper functions for image management
      window.copyImageUrl = function(url) {
        navigator.clipboard.writeText(url).then(() => {
          alert('Image URL copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy:', err);
        });
      };
      
      window.deleteImage = async function(imageId) {
        if (!confirm(\`Are you sure you want to delete image \${imageId}? This cannot be undone.\`)) {
          return;
        }
        
        try {
          const response = await fetch(\`/api/media/delete?id=\${encodeURIComponent(imageId)}\`, {
            method: 'DELETE'
          });
          
          const data = await response.json();
          
          if (data.success) {
            alert('Image deleted successfully!');
            if (listImagesBtn) listImagesBtn.click();
          } else {
            alert('Error: ' + (data.error || 'Delete failed'));
          }
        } catch (error) {
          alert('Error: ' + error.message);
        }
      };
      
      // Load current logo
      fetch('/api/admin/logo')
        .then(r => r.json())
        .then(data => {
          if (data.success && data.logoUrl) {
            logoPreview.src = data.logoUrl;
            logoUrl.textContent = data.logoUrl;
          }
        })
        .catch(err => console.error('Error loading logo:', err));
      
      logoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!logoFile.files || !logoFile.files[0]) {
          showStatus('Please select a file', 'error');
          return;
        }
        
        const formData = new FormData();
        formData.append('file', logoFile.files[0]);
        
        uploadLogoBtn.disabled = true;
        uploadLogoBtn.textContent = '📤 Uploading...';
        
        try {
          const response = await fetch('/api/admin/upload-logo', {
            method: 'POST',
            body: formData
          });
          
          const data = await response.json();
          
          if (data.success) {
            showStatus('✅ Logo uploaded and optimized! Refresh pages to see changes.', 'success');
            logoPreview.src = data.logoUrl;
            logoUrl.textContent = data.logoUrl;
            logoFile.value = '';
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            showStatus('❌ Error: ' + (data.error || 'Upload failed'), 'error');
          }
        } catch (error) {
          showStatus('❌ Error: ' + error.message, 'error');
        } finally {
          uploadLogoBtn.disabled = false;
          uploadLogoBtn.textContent = '📤 Upload & Optimize Logo';
        }
      });
    })();
  </script>
</body>
</html>`;
}

// Get Header Settings API
async function handleGetHeaderSettings(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const preference = await getHeaderPreference(env, 'glassmorphic');

    return new Response(JSON.stringify({
      success: true,
      preference,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Get Logo URL from KV or find in Cloudflare Images
async function getLogoUrl(env: Env): Promise<string> {
  // First, try KV cache
  if (env.KV_CONFIG) {
    try {
      const logoUrl = await env.KV_CONFIG.get('logo:url');
      if (logoUrl && !logoUrl.includes('cdn.shopify.com')) {
        return logoUrl;
      }
    } catch (error) {
      console.error('Error getting logo URL from KV:', error);
    }
  }

  // If not in KV or Shopify URL, search Cloudflare Images for logo
  if (env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_IMAGES_ACCOUNT_HASH && env.CLOUDFLARE_IMAGES_API_TOKEN) {
    try {
      // Fetch last 100 images to find logo
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1?per_page=100`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_IMAGES_API_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const images = data.result?.images || [];

        // Search for logo by filename (case-insensitive)
        // Priority: officialheaderlogo > logo > wordmark > meauxbility > brand
        let foundLogo: any = null;

        // First pass: look for officialheaderlogo (highest priority)
        for (const img of images) {
          const filename = (img.filename || '').toLowerCase();
          if (filename.includes('officialheaderlogo') || filename.includes('official_header_logo') || filename.includes('official-header-logo')) {
            foundLogo = img;
            break;
          }
        }

        // Second pass: look for other logo keywords
        if (!foundLogo) {
          const logoKeywords = ['logo', 'wordmark', 'meauxbility', 'brand'];
          for (const img of images) {
            const filename = (img.filename || '').toLowerCase();
            if (logoKeywords.some(keyword => filename.includes(keyword))) {
              foundLogo = img;
              break;
            }
          }
        }

        if (foundLogo) {
          const variants = foundLogo.variants || [];
          const variant = variants.includes('public') ? 'public' : (variants[0] || 'public');
          const logoUrl = `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${foundLogo.id}/${variant}`;

          // Cache it in KV for next time
          if (env.KV_CONFIG) {
            await env.KV_CONFIG.put('logo:url', logoUrl);
            await env.KV_CONFIG.put('logo:imageId', foundLogo.id);
            await env.KV_CONFIG.put('logo:filename', foundLogo.filename);
          }

          return logoUrl;
        }

        // If no logo found but we have images, use the most recent one as fallback
        if (images.length > 0) {
          const latest = images[0];
          const variants = latest.variants || [];
          const variant = variants.includes('public') ? 'public' : (variants[0] || 'public');
          const fallbackUrl = `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${latest.id}/${variant}`;

          // Cache it
          if (env.KV_CONFIG) {
            await env.KV_CONFIG.put('logo:url', fallbackUrl);
          }

          return fallbackUrl;
        }
      }
    } catch (error) {
      console.error('Error searching Cloudflare Images for logo:', error);
    }
  }

  // Final fallback - use account hash with a generic path
  return `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw'}/meauxbility-wordmark/public`;
}

// Upload Logo API
async function handleUploadLogo(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.CLOUDFLARE_IMAGES_API_TOKEN || !env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || !env.CLOUDFLARE_ACCOUNT_ID) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Cloudflare Images not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({
      success: false,
      error: 'R2_WEBSITE not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No file provided',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid file type. Please upload PNG, JPEG, WebP, or SVG',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 1. Upload to Cloudflare Images (for optimization and CDN)
    const imageFormData = new FormData();
    imageFormData.append('file', file);

    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.CLOUDFLARE_IMAGES_API_TOKEN}`,
        },
        body: imageFormData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Cloudflare Images upload failed: ${errorText}`);
    }

    const uploadData = await uploadResponse.json();
    const imageId = uploadData.result?.id;
    const variants = uploadData.result?.variants || [];

    if (!imageId || !env.CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
      throw new Error('Invalid response from Cloudflare Images');
    }

    // Generate CDN URL (use 'public' variant or first available)
    const variant = variants.includes('public') ? 'public' : (variants[0] || 'public');
    const cdnUrl = `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`;

    // 2. Store backup in R2 (permanent storage)
    const logoKey = 'assets/meauxbility-logo-official.png';
    const fileBuffer = await file.arrayBuffer();
    await env.R2_WEBSITE.put(logoKey, fileBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        uploaded: new Date().toISOString(),
        imageId: imageId,
        cdnUrl: cdnUrl,
      },
    });

    // 3. Store logo URL in KV for quick access
    if (env.KV_CONFIG) {
      await env.KV_CONFIG.put('logo:url', cdnUrl);
      await env.KV_CONFIG.put('logo:imageId', imageId);
      await env.KV_CONFIG.put('logo:r2Key', logoKey);
      await env.KV_CONFIG.put('logo:uploaded', new Date().toISOString());
    }

    return new Response(JSON.stringify({
      success: true,
      logoUrl: cdnUrl,
      imageId: imageId,
      r2Key: logoKey,
      variants: variants,
      message: 'Logo uploaded and optimized successfully',
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Get Logo API
async function handleGetLogo(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const logoUrl = await getLogoUrl(env);

    let metadata: any = {};
    if (env.KV_CONFIG) {
      const imageId = await env.KV_CONFIG.get('logo:imageId');
      const r2Key = await env.KV_CONFIG.get('logo:r2Key');
      const uploaded = await env.KV_CONFIG.get('logo:uploaded');

      metadata = {
        imageId: imageId || null,
        r2Key: r2Key || null,
        uploaded: uploaded || null,
      };
    }

    return new Response(JSON.stringify({
      success: true,
      logoUrl,
      ...metadata,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Process Logo Upload and Remaster Team Page
async function handleProcessLogoAndTeam(request: Request, env: Env, url: URL): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE || !env.CLOUDFLARE_IMAGES_API_TOKEN || !env.CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
    return new Response(JSON.stringify({
      success: false,
      error: 'R2_WEBSITE or Cloudflare Images not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const results: any = {
      logo: null,
      teamPage: null,
      imagesMigrated: [],
      errors: [],
    };

    // Step 1: Try to get logo from assets folder in R2
    const logoKey = 'assets/officialheaderlogo_meauxbility_logo_540-90e93d36-45c9-43d8-8672-07968d5e31d7.png';
    let logoFile: R2ObjectBody | null = null;

    try {
      logoFile = await env.R2_WEBSITE.get(logoKey);
      if (!logoFile) {
        // Try alternative paths
        const altPaths = [
          'officialheaderlogo_meauxbility_logo_540-90e93d36-45c9-43d8-8672-07968d5e31d7.png',
          'assets/meauxbility-logo.png',
          'meauxbility-logo.png',
        ];

        for (const altPath of altPaths) {
          logoFile = await env.R2_WEBSITE.get(altPath);
          if (logoFile) break;
        }
      }
    } catch (error: any) {
      results.errors.push(`Logo file not found in R2: ${error.message}`);
    }

    // Step 2: Upload logo to Cloudflare Images if found
    let logoUrl = '';
    if (logoFile) {
      try {
        const logoBlob = await logoFile.arrayBuffer();
        const logoFormData = new FormData();
        logoFormData.append('file', new Blob([logoBlob], { type: 'image/png' }), 'meauxbility-logo.png');

        const uploadResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.CLOUDFLARE_IMAGES_API_TOKEN}`,
            },
            body: logoFormData,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          const imageId = uploadData.result?.id;
          const variants = uploadData.result?.variants || [];
          const variant = variants.includes('public') ? 'public' : (variants[0] || 'public');
          logoUrl = `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`;

          // Store in KV
          if (env.KV_CONFIG) {
            await env.KV_CONFIG.put('logo:url', logoUrl);
            await env.KV_CONFIG.put('logo:imageId', imageId);
            await env.KV_CONFIG.put('logo:r2Key', logoKey);
            await env.KV_CONFIG.put('logo:uploaded', new Date().toISOString());
          }

          // Store backup in R2
          await env.R2_WEBSITE.put('assets/meauxbility-logo-official.png', logoBlob, {
            httpMetadata: { contentType: 'image/png' },
            customMetadata: {
              uploaded: new Date().toISOString(),
              imageId: imageId,
              cdnUrl: logoUrl,
            },
          });

          results.logo = {
            success: true,
            logoUrl,
            imageId,
            r2Key: 'assets/meauxbility-logo-official.png',
          };
        } else {
          const errorText = await uploadResponse.text();
          results.errors.push(`Logo upload failed: ${errorText}`);
        }
      } catch (error: any) {
        results.errors.push(`Logo processing error: ${error.message}`);
      }
    }

    // Step 3: Migrate team member images to Cloudflare CDN
    const imageMigrations: Record<string, string> = {};

    for (const member of BOARD_MEMBERS) {
      if (member.image && !member.image.includes('imagedelivery.net')) {
        try {
          const migrationResult = await migrateImageToCloudflare(member.image, env, 'public');
          if (migrationResult.success && migrationResult.cdnUrl) {
            imageMigrations[member.image] = migrationResult.cdnUrl;
            results.imagesMigrated.push({
              original: member.image,
              cdn: migrationResult.cdnUrl,
              member: member.name,
            });
          } else {
            results.errors.push(`Failed to migrate ${member.name} image: ${migrationResult.error}`);
          }
        } catch (error: any) {
          results.errors.push(`Error migrating ${member.name} image: ${error.message}`);
        }
      }
    }

    // Step 4: Migrate founder story image
    const founderImageUrl = 'https://cdn.shopify.com/s/files/1/0685/1654/4672/files/IMG_1048.jpg?v=1752908933';
    try {
      const founderMigration = await migrateImageToCloudflare(founderImageUrl, env, 'public');
      if (founderMigration.success && founderMigration.cdnUrl) {
        imageMigrations[founderImageUrl] = founderMigration.cdnUrl;
        results.imagesMigrated.push({
          original: founderImageUrl,
          cdn: founderMigration.cdnUrl,
          member: 'Founder Story',
        });
      }
    } catch (error: any) {
      results.errors.push(`Error migrating founder image: ${error.message}`);
    }

    // Step 5: Generate team page HTML with migrated images
    let teamPageHTML = TEAM_PAGE_HTML_TEMPLATE;

    // Replace team member images
    let teamMembersHTML = '';
    for (const member of BOARD_MEMBERS) {
      const migratedImageUrl = imageMigrations[member.image] || member.image;
      teamMembersHTML += generateTeamMemberHTML(member, migratedImageUrl);
    }
    teamPageHTML = teamPageHTML.replace('PLACEHOLDER_TEAM_MEMBERS', teamMembersHTML);

    // Replace founder story image
    const migratedFounderImage = imageMigrations[founderImageUrl] || founderImageUrl;
    teamPageHTML = teamPageHTML.replace('PLACEHOLDER_STORY_IMAGE', migratedFounderImage);

    // Step 6: Inject header and enhance SEO
    const headerType = await getHeaderPreference(env, 'glassmorphic');
    const finalLogoUrl = logoUrl || await getLogoUrl(env);
    teamPageHTML = await injectHeader(teamPageHTML, headerType, finalLogoUrl);
    teamPageHTML = await enhancePageWithSEO(teamPageHTML, '/pages/team-meauxbility', url, env);

    // Step 6: Store board members data in KV for easy tracking
    if (env.KV_CONFIG) {
      const boardMembersData = {
        members: BOARD_MEMBERS.map(m => ({
          id: m.id,
          name: m.name,
          role: m.role,
          image: imageMigrations[m.image] || m.image,
          quote: m.quote,
          bio: m.bio,
        })),
        lastUpdated: new Date().toISOString(),
        totalMembers: BOARD_MEMBERS.length,
      };
      await env.KV_CONFIG.put('team:board-members', JSON.stringify(boardMembersData));
    }

    // Step 7: Upload remastered team page to R2
    await uploadR2Object(env.R2_WEBSITE, 'pages/team-meauxbility.html', teamPageHTML);

    results.teamPage = {
      success: true,
      path: 'pages/team-meauxbility.html',
      url: `${url.origin}/pages/team-meauxbility`,
      imagesMigrated: results.imagesMigrated.length,
      boardMembersStored: BOARD_MEMBERS.length,
    };

    return new Response(JSON.stringify({
      success: true,
      message: 'Logo uploaded and team page remastered successfully',
      results,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Get Board Members API
async function handleGetBoardMembers(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    let boardMembersData: any = null;

    // Try to get from KV first
    if (env.KV_CONFIG) {
      const stored = await env.KV_CONFIG.get('team:board-members');
      if (stored) {
        boardMembersData = JSON.parse(stored);
      }
    }

    // Fallback to current BOARD_MEMBERS data
    if (!boardMembersData) {
      boardMembersData = {
        members: BOARD_MEMBERS,
        lastUpdated: new Date().toISOString(),
        totalMembers: BOARD_MEMBERS.length,
      };
    }

    return new Response(JSON.stringify({
      success: true,
      ...boardMembersData,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// CMS API - List all pages and assets
async function handleCMSList(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({
      success: false,
      error: 'R2_WEBSITE not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const objects = await listR2Objects(env.R2_WEBSITE, '', 10000);

    const pages = objects
      .filter(obj => obj.key.endsWith('.html'))
      .map(obj => ({
        path: obj.key,
        size: obj.size,
        uploaded: obj.uploaded?.toISOString() || null,
      }));

    const images = objects
      .filter(obj => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(obj.key))
      .map(obj => ({
        path: obj.key,
        size: obj.size,
        uploaded: obj.uploaded?.toISOString() || null,
      }));

    return new Response(JSON.stringify({
      success: true,
      pages,
      images,
      total: objects.length,
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// CMS API - Get page content and metatags
async function handleCMSGetPage(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({
      success: false,
      error: 'R2_WEBSITE not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(request.url);
    const pagePath = url.searchParams.get('path');

    if (!pagePath) {
      return new Response(JSON.stringify({
        success: false,
        error: 'path parameter required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const page = await env.R2_WEBSITE.get(pagePath);
    if (!page) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Page not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const html = await page.text();

    // Extract metatags
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);

    const metatags = {
      title: titleMatch ? titleMatch[1].trim() : '',
      description: descMatch ? descMatch[1].trim() : '',
      keywords: keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [],
      ogImage: ogImageMatch ? ogImageMatch[1].trim() : '',
    };

    return new Response(JSON.stringify({
      success: true,
      path: pagePath,
      metatags,
      hasHeader: html.includes('glassmorphic-header') || html.includes('id="nav"'),
      hasSEO: html.includes('og:title') && html.includes('og:description'),
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// CMS API - Upload and remaster HTML page
async function handleCMSUploadPage(request: Request, env: Env, url: URL): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({
      success: false,
      error: 'R2_WEBSITE not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pagePath = formData.get('pagePath') as string;
    const migrateImages = formData.get('migrateImages') === 'true';

    if (!file || !pagePath) {
      return new Response(JSON.stringify({
        success: false,
        error: 'File and pagePath required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Read HTML content
    let html = await file.text();

    // Remaster HTML (remove Shopify, clean up)
    html = remasterShopifyHTML(html);

    // Migrate images if requested
    if (migrateImages && env.CLOUDFLARE_IMAGES_API_TOKEN && env.CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
      const imageUrls = extractImagesFromHTML(html);
      const urlReplacements = new Map<string, string>();

      for (const imageUrl of imageUrls) {
        if (!imageUrl.includes('imagedelivery.net')) {
          const migrationResult = await migrateImageToCloudflare(imageUrl, env, 'public');
          if (migrationResult.success && migrationResult.cdnUrl) {
            urlReplacements.set(imageUrl, migrationResult.cdnUrl);
          }
        }
      }

      // Replace image URLs
      urlReplacements.forEach((newUrl, oldUrl) => {
        html = html.replace(new RegExp(`src=["']${escapeRegex(oldUrl)}["']`, 'gi'), `src="${newUrl}"`);
        html = html.replace(new RegExp(`srcset=["']([^"']*${escapeRegex(oldUrl)}[^"']*)["']`, 'gi'), (match: string, srcset: string) => {
          return `srcset="${srcset.replace(oldUrl, newUrl)}"`;
        });
        html = html.replace(new RegExp(`background-image\\s*:\\s*url\\(["']?${escapeRegex(oldUrl)}["']?\\)`, 'gi'), `background-image: url("${newUrl}")`);
      });
    }

    // Inject header
    const headerType = await getHeaderPreference(env, 'glassmorphic');
    const logoUrl = await getLogoUrl(env);
    html = await injectHeader(html, headerType, logoUrl, env);

    // Enhance with SEO
    const pageUrlPath = pagePath.replace('.html', '').replace('pages/', '/pages/');
    html = await enhancePageWithSEO(html, pageUrlPath, url, env);

    // Store revision in KV
    if (env.KV_CONFIG) {
      const revisionKey = `revision:${pagePath}:${Date.now()}`;
      const revision = {
        path: pagePath,
        timestamp: new Date().toISOString(),
        size: html.length,
      };
      await env.KV_CONFIG.put(revisionKey, JSON.stringify(revision));
    }

    // Upload to R2
    await uploadR2Object(env.R2_WEBSITE, pagePath, html);

    return new Response(JSON.stringify({
      success: true,
      path: pagePath,
      url: `${url.origin}/${pagePath.replace('.html', '')}`,
      message: 'Page uploaded and remastered successfully',
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// CMS API - Update page metatags
async function handleCMSUpdateMetatags(request: Request, env: Env, url: URL): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({
      success: false,
      error: 'R2_WEBSITE not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const { pagePath, metatags } = await request.json();

    if (!pagePath || !metatags) {
      return new Response(JSON.stringify({
        success: false,
        error: 'pagePath and metatags required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const page = await env.R2_WEBSITE.get(pagePath);
    if (!page) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Page not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    let html = await page.text();

    // Update title
    if (metatags.title) {
      html = html.replace(/<title[^>]*>([^<]*)<\/title>/i, `<title>${escapeHtml(metatags.title)}</title>`);
      if (!html.includes('<title')) {
        html = html.replace('</head>', `<title>${escapeHtml(metatags.title)}</title>\n</head>`);
      }
    }

    // Update description
    if (metatags.description) {
      html = html.replace(/<meta[^>]*name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(metatags.description)}">`);
      if (!html.includes('name="description"')) {
        html = html.replace('</head>', `<meta name="description" content="${escapeHtml(metatags.description)}">\n</head>`);
      }
    }

    // Update keywords
    if (metatags.keywords && metatags.keywords.length > 0) {
      const keywordsStr = metatags.keywords.join(', ');
      html = html.replace(/<meta[^>]*name=["']keywords["'][^>]*>/i, `<meta name="keywords" content="${escapeHtml(keywordsStr)}">`);
      if (!html.includes('name="keywords"')) {
        html = html.replace('</head>', `<meta name="keywords" content="${escapeHtml(keywordsStr)}">\n</head>`);
      }
    }

    // Update OG image
    if (metatags.ogImage) {
      html = html.replace(/<meta[^>]*property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${escapeHtml(metatags.ogImage)}">`);
      if (!html.includes('property="og:image"')) {
        html = html.replace('</head>', `<meta property="og:image" content="${escapeHtml(metatags.ogImage)}">\n</head>`);
      }
    }

    // Re-enhance SEO to ensure all tags are complete
    const pageUrlPath = pagePath.replace('.html', '').replace('pages/', '/pages/');
    html = await enhancePageWithSEO(html, pageUrlPath, url, env);

    // Store revision
    if (env.KV_CONFIG) {
      const revisionKey = `revision:${pagePath}:${Date.now()}`;
      await env.KV_CONFIG.put(revisionKey, JSON.stringify({
        path: pagePath,
        timestamp: new Date().toISOString(),
        action: 'metatags_update',
      }));
    }

    // Upload updated page
    await uploadR2Object(env.R2_WEBSITE, pagePath, html);

    return new Response(JSON.stringify({
      success: true,
      path: pagePath,
      url: `${url.origin}/${pagePath.replace('.html', '')}`,
      message: 'Metatags updated successfully',
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// CMS API - Delete file
async function handleCMSDelete(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({
      success: false,
      error: 'R2_WEBSITE not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(request.url);
    const filePath = url.searchParams.get('path');

    if (!filePath) {
      return new Response(JSON.stringify({
        success: false,
        error: 'path parameter required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Check if file exists
    const file = await env.R2_WEBSITE.get(filePath);
    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'File not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Store revision before deletion
    if (env.KV_CONFIG) {
      const revisionKey = `revision:${filePath}:${Date.now()}`;
      await env.KV_CONFIG.put(revisionKey, JSON.stringify({
        path: filePath,
        timestamp: new Date().toISOString(),
        action: 'deleted',
        size: file.size,
      }));
    }

    // Delete file
    await env.R2_WEBSITE.delete(filePath);

    return new Response(JSON.stringify({
      success: true,
      path: filePath,
      message: 'File deleted successfully',
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// CMS API - Rename file
async function handleCMSRename(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({
      success: false,
      error: 'R2_WEBSITE not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const { oldPath, newPath } = await request.json();

    if (!oldPath || !newPath) {
      return new Response(JSON.stringify({
        success: false,
        error: 'oldPath and newPath required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Get old file
    const oldFile = await env.R2_WEBSITE.get(oldPath);
    if (!oldFile) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Source file not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Check if new path already exists
    const existingFile = await env.R2_WEBSITE.get(newPath);
    if (existingFile) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Destination file already exists',
      }), {
        status: 409,
        headers: corsHeaders,
      });
    }

    // Copy to new path
    const content = await oldFile.arrayBuffer();
    await env.R2_WEBSITE.put(newPath, content, {
      httpMetadata: oldFile.httpMetadata,
      customMetadata: {
        ...oldFile.customMetadata,
        renamedFrom: oldPath,
        renamedAt: new Date().toISOString(),
      },
    });

    // Store revision
    if (env.KV_CONFIG) {
      const revisionKey = `revision:${oldPath}:${Date.now()}`;
      await env.KV_CONFIG.put(revisionKey, JSON.stringify({
        path: oldPath,
        newPath: newPath,
        timestamp: new Date().toISOString(),
        action: 'renamed',
      }));
    }

    // Delete old file
    await env.R2_WEBSITE.delete(oldPath);

    const url = new URL(request.url);
    return new Response(JSON.stringify({
      success: true,
      oldPath,
      newPath,
      newUrl: `${url.origin}/${newPath.replace('.html', '')}`,
      message: 'File renamed successfully',
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// CMS API - Get live URLs inventory
async function handleCMSLiveUrls(request: Request, env: Env, url: URL): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.R2_WEBSITE) {
    return new Response(JSON.stringify({
      success: false,
      error: 'R2_WEBSITE not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const objects = await listR2Objects(env.R2_WEBSITE, '', 10000);
    const htmlFiles = objects.filter(obj => obj.key.endsWith('.html'));

    const pages = await Promise.all(htmlFiles.map(async (obj) => {
      try {
        const page = await env.R2_WEBSITE.get(obj.key);
        if (!page) return null;

        const html = await page.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        const imageMatches = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
        const imagesMigrated = imageMatches.filter(m => m.includes('imagedelivery.net')).length;

        return {
          path: obj.key,
          url: `${url.origin}/${obj.key.replace('.html', '')}`,
          title: titleMatch ? titleMatch[1].trim() : obj.key,
          description: descMatch ? descMatch[1].trim() : '',
          hasHeader: html.includes('glassmorphic-header') || html.includes('id="nav"'),
          hasSEO: html.includes('og:title') && html.includes('og:description'),
          imagesMigrated: imagesMigrated,
          size: obj.size,
          uploaded: obj.uploaded?.toISOString() || null,
        };
      } catch (error) {
        return {
          path: obj.key,
          url: `${url.origin}/${obj.key.replace('.html', '')}`,
          title: obj.key,
          description: '',
          hasHeader: false,
          hasSEO: false,
          imagesMigrated: 0,
          size: obj.size,
          uploaded: obj.uploaded?.toISOString() || null,
        };
      }
    }));

    return new Response(JSON.stringify({
      success: true,
      baseUrl: url.origin,
      pages: pages.filter(p => p !== null),
      total: pages.length,
      generatedAt: new Date().toISOString(),
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Media API - List Images
async function handleMediaListImages(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH;
  const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !accountHash || !apiToken) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Cloudflare Images not configured. Missing account ID, hash, or API token.'
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const perPage = url.searchParams.get('per_page') || '100';

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1?page=${page}&per_page=${perPage}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare Images API error: ${error}`);
    }

    const result = await response.json();
    const images = result.result?.images || [];

    // Add delivery URLs to each image
    const imagesWithUrls = images.map((image: any) => ({
      id: image.id,
      filename: image.filename,
      uploaded: image.uploaded,
      requireSignedURLs: image.requireSignedURLs || false,
      variants: image.variants || [],
      deliveryUrls: image.variants?.map((variant: string) =>
        `https://imagedelivery.net/${accountHash}/${image.id}/${variant}`
      ) || [],
      metadata: image.metadata || {},
    }));

    return new Response(JSON.stringify({
      success: true,
      images: imagesWithUrls,
      count: images.length,
      pagination: result.result?.pagination || {},
      accountHash,
    }), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Media API - Upload Image
async function handleMediaUploadImage(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH;
  const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !accountHash || !apiToken) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Cloudflare Images not configured. Missing account ID, hash, or API token.'
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const requireSignedURLs = formData.get('requireSignedURLs') === 'true';
    const metadata = formData.get('metadata') as string;

    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'File required'
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Upload to Cloudflare Images
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    if (requireSignedURLs) {
      uploadFormData.append('requireSignedURLs', 'true');
    }
    if (metadata) {
      uploadFormData.append('metadata', metadata);
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
        body: uploadFormData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare Images API error: ${error}`);
    }

    const result = await response.json();
    const imageId = result.result?.id;
    const imageVariants = result.result?.variants || [];

    // Generate delivery URLs
    const deliveryUrls = imageVariants.map((variant: string) =>
      `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`
    );

    return new Response(JSON.stringify({
      success: true,
      imageId,
      accountHash,
      variants: imageVariants,
      deliveryUrls,
      filename: result.result?.filename,
      uploaded: result.result?.uploaded,
      requireSignedURLs: result.result?.requireSignedURLs || false,
      publicUrl: deliveryUrls[0] || `https://imagedelivery.net/${accountHash}/${imageId}/public`,
    }), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Media API - Delete Image
async function handleMediaDeleteImage(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Cloudflare Images not configured'
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(request.url);
    const imageId = url.searchParams.get('id');

    if (!imageId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image ID required'
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare Images API error: ${error}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify({
      success: true,
      imageId,
      message: 'Image deleted successfully',
    }), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Media API - Get Image Details
async function handleMediaGetImage(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH;
  const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !accountHash || !apiToken) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Cloudflare Images not configured'
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(request.url);
    const imageId = url.searchParams.get('id');

    if (!imageId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image ID required'
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare Images API error: ${error}`);
    }

    const result = await response.json();
    const image = result.result;

    // Generate delivery URLs
    const deliveryUrls = image.variants?.map((variant: string) =>
      `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`
    ) || [];

    return new Response(JSON.stringify({
      success: true,
      image: {
        id: image.id,
        filename: image.filename,
        uploaded: image.uploaded,
        requireSignedURLs: image.requireSignedURLs || false,
        variants: image.variants || [],
        deliveryUrls,
        metadata: image.metadata || {},
      },
    }), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Media API - Generate Delivery URL
async function handleMediaGenerateDeliveryUrl(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH;

  if (!accountHash) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Cloudflare Images account hash not configured'
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const { imageId, variant, width, height, fit, format, quality } = await request.json();

    if (!imageId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image ID required'
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const variantName = variant || 'public';
    let deliveryUrl = `https://imagedelivery.net/${accountHash}/${imageId}/${variantName}`;

    // Add query parameters if provided
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    if (fit) params.append('fit', fit);
    if (format) params.append('format', format);
    if (quality) params.append('quality', quality.toString());

    if (params.toString()) {
      deliveryUrl += `?${params.toString()}`;
    }

    return new Response(JSON.stringify({
      success: true,
      imageId,
      variant: variantName,
      deliveryUrl,
      accountHash,
    }), {
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Set Header Settings API
async function handleSetHeaderSettings(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (!env.KV_CONFIG) {
    return new Response(JSON.stringify({
      success: false,
      error: 'KV_CONFIG not configured',
    }), {
      status: 503,
      headers: corsHeaders,
    });
  }

  try {
    const { preference } = await request.json();

    if (preference !== 'glassmorphic' && preference !== 'legacy') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid preference. Must be "glassmorphic" or "legacy"',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    await env.KV_CONFIG.put('header:preference', preference);

    return new Response(JSON.stringify({
      success: true,
      preference,
      message: 'Header preference saved',
    }), { headers: corsHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
