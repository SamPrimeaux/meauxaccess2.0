/**
 * Gemini API Proxy Worker
 * 
 * Ultimate SaaS optimization strategy:
 * - Secure API key management
 * - Smart caching for cost reduction
 * - Rate limiting for abuse prevention
 * - Request/response optimization
 * - Edge computing for low latency
 */

export interface Env {
  GEMINI_API_KEY: string; // Gemini API key (secret)
  KV_CACHE?: KVNamespace; // For caching responses
  KV_RATE_LIMIT?: KVNamespace; // For rate limiting
  KV_ANALYTICS?: KVNamespace; // For usage tracking
  CLOUDFLARE_ACCOUNT_ID: string;
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

    // Route: /api/gemini/chat
    if (path === '/api/gemini/chat' && request.method === 'POST') {
      return handleGeminiChat(request, env, ctx);
    }

    // Route: /api/gemini/models
    if (path === '/api/gemini/models' && request.method === 'GET') {
      return handleGeminiModels(request, env);
    }

    // Route: /api/gemini/analytics
    if (path === '/api/gemini/analytics' && request.method === 'GET') {
      return handleGeminiAnalytics(request, env);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
};

/**
 * Handle Gemini Chat Request
 */
async function handleGeminiChat(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { prompt, model = 'gemini-2.5-flash', temperature = 0.7, maxTokens = 2048, userId, cache = true } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Rate Limiting
    const rateLimitResult = await checkRateLimit(env, userId || 'anonymous');
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfter: rateLimitResult.retryAfter,
      }), {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimitResult.retryAfter),
        },
      });
    }

    // 2. Check Cache (if enabled)
    if (cache && env.KV_CACHE) {
      const cacheKey = generateCacheKey(prompt, model, temperature, maxTokens);
      const cached = await env.KV_CACHE.get(cacheKey);

      if (cached) {
        // Track cache hit
        await trackAnalytics(env, 'cache_hit', userId);

        return new Response(cached, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            'X-Cache-Key': cacheKey,
          },
        });
      }
    }

    // 3. Call Gemini API
    const geminiResponse = await callGeminiAPI(env, {
      prompt,
      model,
      temperature,
      maxTokens,
    });

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const responseData = await geminiResponse.json();
    const responseText = JSON.stringify(responseData);

    // 4. Cache Response (if enabled and successful)
    if (cache && env.KV_CACHE && responseData.candidates?.[0]?.content) {
      const cacheKey = generateCacheKey(prompt, model, temperature, maxTokens);
      const ttl = determineCacheTTL(prompt, responseData);

      // Cache in background (don't wait)
      ctx.waitUntil(
        env.KV_CACHE.put(cacheKey, responseText, { expirationTtl: ttl })
      );
    }

    // 5. Track Analytics
    await trackAnalytics(env, 'api_call', userId, {
      model,
      promptLength: prompt.length,
      responseLength: responseText.length,
      cached: false,
    });

    // 6. Return Response
    return new Response(responseText, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
      },
    });

  } catch (error: any) {
    console.error('Gemini proxy error:', error);

    // Track error
    await trackAnalytics(env, 'error', undefined, { error: error.message });

    return new Response(JSON.stringify({
      error: error.message || 'Internal server error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Call Gemini API
 */
async function callGeminiAPI(
  env: Env,
  params: {
    prompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
  }
): Promise<Response> {
  const { prompt, model, temperature, maxTokens } = params;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt,
      }],
    }],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  };

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
}

/**
 * Generate Cache Key
 */
function generateCacheKey(
  prompt: string,
  model: string,
  temperature: number,
  maxTokens: number
): string {
  // Create deterministic hash of parameters
  const keyData = `${prompt}:${model}:${temperature}:${maxTokens}`;
  // Simple hash (for production, use crypto.subtle)
  const hash = btoa(keyData).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  return `gemini:cache:${hash}`;
}

/**
 * Determine Cache TTL
 */
function determineCacheTTL(prompt: string, response: any): number {
  // Cache strategy:
  // - Short prompts (likely dynamic): 5 minutes
  // - Long prompts (likely static): 1 hour
  // - Factual queries: 24 hours
  // - Creative content: 5 minutes

  const promptLength = prompt.length;
  const isFactual = prompt.toLowerCase().includes('what') ||
    prompt.toLowerCase().includes('when') ||
    prompt.toLowerCase().includes('where') ||
    prompt.toLowerCase().includes('who');

  if (isFactual && promptLength > 100) {
    return 60 * 60 * 24; // 24 hours
  } else if (promptLength > 500) {
    return 60 * 60; // 1 hour
  } else {
    return 60 * 5; // 5 minutes
  }
}

/**
 * Check Rate Limit
 */
async function checkRateLimit(
  env: Env,
  userId: string
): Promise<{ allowed: boolean; retryAfter: number }> {
  if (!env.KV_RATE_LIMIT) {
    return { allowed: true, retryAfter: 0 };
  }

  const RATE_LIMIT = 60; // 60 requests per minute
  const WINDOW = 60; // 1 minute window

  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / WINDOW) * WINDOW;
  const rateLimitKey = `rate:${userId}:${windowStart}`;

  const count = parseInt(await env.KV_RATE_LIMIT.get(rateLimitKey) || '0');

  if (count >= RATE_LIMIT) {
    return {
      allowed: false,
      retryAfter: WINDOW - (now - windowStart),
    };
  }

  // Increment counter
  await env.KV_RATE_LIMIT.put(
    rateLimitKey,
    String(count + 1),
    { expirationTtl: WINDOW }
  );

  return { allowed: true, retryAfter: 0 };
}

/**
 * Track Analytics
 */
async function trackAnalytics(
  env: Env,
  event: string,
  userId?: string,
  metadata?: any
): Promise<void> {
  if (!env.KV_ANALYTICS) return;

  const timestamp = new Date().toISOString();
  const analyticsKey = `analytics:${event}:${Date.now()}`;

  const analyticsData = {
    event,
    userId: userId || 'anonymous',
    timestamp,
    metadata: metadata || {},
  };

  // Store analytics (with 90-day retention)
  await env.KV_ANALYTICS.put(
    analyticsKey,
    JSON.stringify(analyticsData),
    { expirationTtl: 60 * 60 * 24 * 90 }
  );

  // Update daily counter
  const today = new Date().toISOString().split('T')[0];
  const dailyKey = `analytics:daily:${today}`;
  const dailyData = await env.KV_ANALYTICS.get(dailyKey);
  const daily = dailyData ? JSON.parse(dailyData) : { date: today, events: {} };

  daily.events[event] = (daily.events[event] || 0) + 1;
  await env.KV_ANALYTICS.put(dailyKey, JSON.stringify(daily), {
    expirationTtl: 60 * 60 * 24 * 90,
  });
}

/**
 * Handle Gemini Models List
 */
async function handleGeminiModels(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${env.GEMINI_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${await response.text()}`);
    }

    const data = await response.json();

    // Filter to only Gemini models
    const geminiModels = data.models?.filter((m: any) =>
      m.name?.includes('gemini')
    ) || [];

    return new Response(JSON.stringify({
      success: true,
      models: geminiModels,
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

/**
 * Handle Analytics Request
 */
async function handleGeminiAnalytics(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (!env.KV_ANALYTICS) {
    return new Response(JSON.stringify({ analytics: {} }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '7');

    // Get daily analytics for last N days
    const analytics: any = {};
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dailyKey = `analytics:daily:${dateStr}`;

      const dailyData = await env.KV_ANALYTICS.get(dailyKey);
      if (dailyData) {
        analytics[dateStr] = JSON.parse(dailyData);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      analytics,
      days,
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
