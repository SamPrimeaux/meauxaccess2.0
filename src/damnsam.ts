/**
 * damnsam Worker - Main Production Worker for meauxbility.org
 * Full SaaS Dashboard with /dashboard, /meauxphoto, and all integrations
 */

/// <reference types="@cloudflare/workers-types" />

import MEAUXACCESS_HTML from './meauxaccess-dashboard.html.ts';

// Durable Object Classes (stubs for existing bindings)
// These MUST be exported for Durable Object bindings to work
export class CommunicationsHub {
  state: DurableObjectState;
  env: Record<string, any>;

  constructor(state: DurableObjectState, env: Record<string, any>) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    return new Response('CommunicationsHub - Not implemented', { status: 501 });
  }
}

export class RealtimeServer {
  state: DurableObjectState;
  env: Record<string, any>;

  constructor(state: DurableObjectState, env: Record<string, any>) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    return new Response('RealtimeServer - Not implemented', { status: 501 });
  }
}

// Ensure classes are not tree-shaken
if (false) {
  void CommunicationsHub;
  void RealtimeServer;
}

export interface Env {
  // D1 Databases
  DB?: D1Database;
  meauxxbility?: D1Database;
  SAAS_DB?: D1Database;
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
  R2_MEAUXPHOTO?: R2Bucket;
  STORAGE?: R2Bucket;

  // KV Namespaces
  KV_CACHE?: KVNamespace;
  KV_CONFIG?: KVNamespace;
  KV_SESSIONS?: KVNamespace;
  KV_USERS?: KVNamespace;
  KV_NOTIFICATIONS?: KVNamespace;

  // Workers AI
  AI?: any;

  // Analytics
  ANALYTICS?: any;

  // Durable Objects
  COMMUNICATIONS_HUB?: DurableObjectNamespace;
  REALTIME_SERVER?: DurableObjectNamespace;

  // Secrets
  RESEND_API_KEY?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_IMAGES_API_TOKEN?: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;

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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ============================================
    // HOME PAGE (Nonprofit Home)
    // ============================================
    if (path === '/') {
      const { default: getMeauxbilityHomeHTML } = await import('./meauxbility-home.html.ts');
      return new Response(getMeauxbilityHomeHTML(), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // ============================================
    // DASHBOARD ROUTES
    // ============================================
    if (path === '/dashboard' || path.startsWith('/dashboard/')) {
      // Check if MeauxCloud theme is requested
      if (path.startsWith('/dashboard/meauxcloud')) {
        const { default: getMeauxCloudDashboardHTML } = await import('./meauxcloud-dashboard.html.ts');
        return new Response(getMeauxCloudDashboardHTML(), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/html; charset=utf-8',
          },
        });
      }

      // Serve main MeauxAccess dashboard
      return new Response(MEAUXACCESS_HTML, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // ============================================
    // MEAUXPHOTO GALLERY
    // ============================================
    if (path === '/meauxphoto' || path === '/media-gallery' || path === '/gallery') {
      const { default: getMediaGalleryHTML } = await import('./media-gallery.html.ts');
      return new Response(getMediaGalleryHTML(), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // ============================================
    // MEDIA GALLERY API ENDPOINTS
    // ============================================
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

    // ============================================
    // DEV SEARCH ASSISTANT API ENDPOINTS
    // ============================================
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

    // ============================================
    // CLIENT MANAGEMENT API ENDPOINTS
    // ============================================
    if (path === '/api/clients' && request.method === 'GET') {
      const { handleGetClients } = await import('./clients-api');
      return handleGetClients(request, env);
    }

    if (path === '/api/clients' && request.method === 'POST') {
      const { handleCreateClient } = await import('./clients-api');
      return handleCreateClient(request, env);
    }

    if (path.startsWith('/api/clients/') && request.method === 'PUT') {
      const { handleUpdateClient } = await import('./clients-api');
      return handleUpdateClient(request, env);
    }

    if (path.startsWith('/api/clients/') && request.method === 'DELETE') {
      const { handleDeleteClient } = await import('./clients-api');
      return handleDeleteClient(request, env);
    }

    if (path === '/api/projects' && request.method === 'GET') {
      const { handleGetProjectsWithClients } = await import('./clients-api');
      return handleGetProjectsWithClients(request, env);
    }

    // ============================================
    // CHAT API ENDPOINTS
    // ============================================
    if (path === '/api/chat/send' && request.method === 'POST') {
      return handleChatSend(request, env);
    }

    if (path === '/api/chat/messages' && request.method === 'GET') {
      return handleChatMessages(request, env);
    }

    if (path === '/api/chat/channels' && request.method === 'GET') {
      return handleChatChannels(request, env);
    }

    // ============================================
    // TEAM & EMAIL ENDPOINTS
    // ============================================
    if (path === '/api/team/invite' && request.method === 'POST') {
      return handleSendInvite(request, env);
    }

    if (path === '/api/team/invite/bulk' && request.method === 'POST') {
      return handleBulkInvite(request, env);
    }

    // ============================================
    // AUTHENTICATION API ENDPOINTS
    // ============================================
    if (path === '/api/auth/login' && request.method === 'POST') {
      const { handleLogin } = await import('./auth-api');
      return handleLogin(request, env);
    }

    if (path === '/api/auth/logout' && request.method === 'POST') {
      const { handleLogout } = await import('./auth-api');
      return handleLogout(request, env);
    }

    if (path === '/api/auth/verify' && request.method === 'GET') {
      const { handleVerify } = await import('./auth-api');
      return handleVerify(request, env);
    }

    // ============================================
    // HEALTH CHECK
    // ============================================
    if (path === '/api/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        worker: 'damnsam',
        timestamp: new Date().toISOString(),
        bindings: {
          databases: env.DB ? 'connected' : 'not configured',
          r2: env.R2_WEBSITE ? 'connected' : 'not configured',
          kv: env.KV_CACHE ? 'connected' : 'not configured',
        },
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // ============================================
    // R2 STATIC ASSET SERVING
    // ============================================
    if (path.startsWith('/assets/') || path.startsWith('/static/')) {
      if (!env.R2_WEBSITE) {
        return new Response('R2_WEBSITE not configured', { status: 500 });
      }

      try {
        const objectKey = path.substring(1); // Remove leading /
        const object = await env.R2_WEBSITE.get(objectKey);

        if (!object) {
          return new Response('Not Found', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        return new Response(object.body, { headers });
      } catch (error: any) {
        return new Response(`Error: ${error.message}`, { status: 500 });
      }
    }

    // ============================================
    // DEFAULT: 404
    // ============================================
    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders,
    });
  },
};

// ============================================
// CHAT SYSTEM FUNCTIONS
// ============================================
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

    // Get all keys with the prefix
    let cursor: string | undefined;
    do {
      const result = await env.KV_NOTIFICATIONS.list({ prefix, limit: 1000, cursor });
      cursor = result.cursor;

      for (const key of result.keys) {
        const messageData = await env.KV_NOTIFICATIONS.get(key.name);
        if (messageData) {
          try {
            messages.push(JSON.parse(messageData));
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    } while (cursor);

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

// ============================================
// TEAM INVITE FUNCTIONS
// ============================================
async function handleSendInvite(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dashboardUrl = env.PRODUCTION_URL || 'https://damnsam.meauxbility.workers.dev';
    const inviteMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6; margin-bottom: 20px;">🎉 You're Invited to MeauxAccess Dashboard!</h2>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          Hi ${name || 'there'},
        </p>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
          You've been invited to join the MeauxAccess Dashboard! This is our team's central hub for managing projects, 
          collaborating, and accessing all our Cloudflare resources.
        </p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">What you can do:</h3>
          <ul style="color: #374151; line-height: 1.8;">
            <li>💬 <strong>Live Chat</strong> - Real-time team communication</li>
            <li>📊 <strong>Dashboard</strong> - Monitor all services and resources</li>
            <li>📁 <strong>Projects</strong> - Manage client projects</li>
            <li>🖼️ <strong>MeauxPhoto</strong> - Access the media gallery</li>
            <li>🔍 <strong>Dev Tools</strong> - Search, debug, and brainstorm</li>
          </ul>
        </div>
        <p style="margin-top: 30px;">
          <a href="${dashboardUrl}/dashboard" 
             style="background: #3b82f6; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            🚀 Open Dashboard
          </a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          <strong>Login:</strong> Use your email (${email}) to access the dashboard.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px;">
          This is an automated invitation from MeauxAccess Platform
        </p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MeauxAccess <noreply@inneranimalmedia.com>',
        to: email,
        subject: '🎉 You\'re Invited to MeauxAccess Dashboard!',
        html: inviteMessage,
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
      email,
      message: 'Invite sent successfully',
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

async function handleBulkInvite(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await request.json();
    const { emails } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(JSON.stringify({ error: 'emails array is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { getAllTeamMembers } = await import('./team-management');
    const teamMembers = await getAllTeamMembers(env);
    const results: any[] = [];

    for (const email of emails) {
      const member = teamMembers.find(m => m.email === email);
      if (member) {
        const inviteResponse = await handleSendInvite(
          new Request('http://localhost/api/team/invite', {
            method: 'POST',
            body: JSON.stringify({ email: member.email, name: member.name }),
          }),
          env
        );
        const inviteData = await inviteResponse.json();
        results.push({ email, success: inviteData.success, messageId: inviteData.messageId });
      } else {
        results.push({ email, success: false, error: 'Team member not found' });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      results,
      sent: results.filter(r => r.success).length,
      total: results.length,
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
