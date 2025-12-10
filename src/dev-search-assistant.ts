/**
 * Dev Search Assistant API
 * Comprehensive search engine with dev tools, brainstorming, streaming, and notes
 */

export interface Env {
  DB?: D1Database;
  SAAS_DB?: D1Database;
  KV_CONFIG?: KVNamespace;
  KV_CACHE?: KVNamespace;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_IMAGES_API_TOKEN?: string;
  ACCOUNT_ID?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;
  [key: `R2_${string}`]: R2Bucket;
  [key: `DB_${string}`]: D1Database;
}

// Search across platform resources
export async function handlePlatformSearch(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const { query, type = 'all' } = await request.json();
    if (!query) {
      return new Response(JSON.stringify({ success: false, error: 'Query required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const results: any = {
      workers: [],
      databases: [],
      buckets: [],
      photos: [],
      projects: [],
      notes: [],
    };

    // Search Workers
    if (type === 'all' || type === 'workers') {
      const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID;
      const token = env.CLOUDFLARE_API_TOKEN;
      if (token && accountId) {
        try {
          const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`,
            {
              headers: { 'Authorization': `Bearer ${token}` },
            }
          );
          if (response.ok) {
            const data = await response.json();
            const workers = data.result || [];
            results.workers = workers
              .filter((w: any) => w.id?.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 10);
          }
        } catch (error) {
          console.error('Error searching workers:', error);
        }
      }
    }

    // Search Databases and Cloudflare Images
    if (type === 'all' || type === 'databases' || type === 'photos') {
      const db = env.DB || env.SAAS_DB;
      if (db) {
        try {
          // Search photos table in D1
          const photos = await db.prepare(
            `SELECT * FROM photos WHERE title LIKE ? OR description LIKE ? OR alt LIKE ? OR tags LIKE ? LIMIT 20`
          ).bind(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`).all();
          results.photos = (photos.results || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            alt: p.alt,
            url: p.url,
            thumbnailUrl: p.thumbnailUrl,
            tags: p.tags,
            category: p.category,
            uploadedAt: p.uploadedAt,
            source: 'D1 Database',
          }));
        } catch (error) {
          console.error('Error searching database:', error);
        }
      }

      // Also search Cloudflare Images directly
      const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
      const imagesToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;
      const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';

      if (accountId && imagesToken) {
        try {
          // Fetch images from Cloudflare Images API
          const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1?per_page=100`,
            {
              headers: { 'Authorization': `Bearer ${imagesToken}` },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const images = data.result?.images || [];
            const queryLower = query.toLowerCase();

            // Filter images by filename or ID
            const matchingImages = images
              .filter((img: any) => {
                const filename = (img.filename || '').toLowerCase();
                const imgId = (img.id || '').toLowerCase();
                return filename.includes(queryLower) || imgId.includes(queryLower);
              })
              .slice(0, 20)
              .map((img: any) => {
                const variant = img.variants?.[0] || 'public';
                const imageUrl = variant.startsWith('http')
                  ? variant
                  : `https://imagedelivery.net/${accountHash}/${img.id}/${variant}`;

                return {
                  id: img.id,
                  title: img.filename || img.id,
                  filename: img.filename,
                  description: `Image uploaded on ${img.uploaded || 'unknown date'}`,
                  alt: img.filename || img.id,
                  url: imageUrl,
                  thumbnailUrl: imageUrl,
                  uploaded: img.uploaded,
                  uploadedAt: img.uploaded,
                  variants: img.variants || [],
                  source: 'Cloudflare Images',
                };
              });

            // Merge with D1 results, avoiding duplicates
            const existingIds = new Set(results.photos.map((p: any) => p.id));
            results.photos.push(...matchingImages.filter((img: any) => !existingIds.has(img.id)));
          } else {
            console.error('Cloudflare Images API error:', response.status, await response.text());
          }
        } catch (error) {
          console.error('Error searching Cloudflare Images:', error);
        }
      }
    }

    // Search R2 Buckets
    if (type === 'all' || type === 'buckets') {
      const bucketNames = ['R2_ASSETS', 'R2_WEBSITE', 'R2_DOCS', 'R2_COMPONENTS'];
      for (const binding of bucketNames) {
        const bucket = (env as any)[binding] as R2Bucket;
        if (bucket) {
          try {
            const objects = await bucket.list({ prefix: query, limit: 5 });
            if (objects.objects.length > 0) {
              results.buckets.push({
                bucket: binding,
                objects: objects.objects.map((o: any) => ({
                  key: o.key,
                  size: o.size,
                  uploaded: o.uploaded,
                })),
              });
            }
          } catch (error) {
            console.error(`Error searching ${binding}:`, error);
          }
        }
      }
    }

    // Search Notes (from KV)
    if (type === 'all' || type === 'notes') {
      if (env.KV_CONFIG) {
        try {
          const keys = await env.KV_CONFIG.list({ prefix: `note:` });
          const notePromises = keys.keys.slice(0, 20).map(key => env.KV_CONFIG.get(key.name));
          const noteValues = await Promise.all(notePromises);
          results.notes = noteValues
            .filter(note => note && note.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 10);
        } catch (error) {
          console.error('Error searching notes:', error);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      query,
      results,
      total: Object.values(results).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0),
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

// Stream AI responses
export async function handleStreamingAI(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const { prompt, provider = 'openai', mode = 'chat' } = await request.json();
    if (!prompt) {
      return new Response(JSON.stringify({ success: false, error: 'Prompt required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a ReadableStream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          if (provider === 'openai' && env.OPENAI_API_KEY) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                  { role: 'system', content: getSystemPrompt(mode) },
                  { role: 'user', content: prompt },
                ],
                stream: true,
                temperature: mode === 'brainstorm' ? 0.9 : 0.7,
              }),
            });

            if (!response.ok) {
              throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                      controller.close();
                      return;
                    }

                    try {
                      const json = JSON.parse(data);
                      const content = json.choices?.[0]?.delta?.content;
                      if (content) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                      }
                    } catch (e) {
                      // Skip invalid JSON
                    }
                  }
                }
              }
            }
          } else if (provider === 'gemini' && env.GEMINI_API_KEY) {
            // Gemini streaming
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${env.GEMINI_API_KEY}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                }),
              }
            );

            if (response.ok) {
              const data = await response.json();
              for (const candidate of data || []) {
                const text = candidate.content?.parts?.[0]?.text || '';
                if (text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
                }
              }
            }
          }

          controller.close();
        } catch (error: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Save notes
export async function handleSaveNote(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const { title, content, tags = [] } = await request.json();
    if (!title || !content) {
      return new Response(JSON.stringify({ success: false, error: 'Title and content required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!env.KV_CONFIG) {
      return new Response(JSON.stringify({ success: false, error: 'KV_CONFIG not configured' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const noteId = `note:${Date.now()}:${crypto.randomUUID()}`;
    const noteData = {
      id: noteId,
      title,
      content,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await env.KV_CONFIG.put(noteId, JSON.stringify(noteData));
    await env.KV_CONFIG.put(`note:index:${title.toLowerCase()}`, noteId);

    return new Response(JSON.stringify({
      success: true,
      note: noteData,
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

// Get notes
export async function handleGetNotes(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    if (!env.KV_CONFIG) {
      return new Response(JSON.stringify({ success: false, error: 'KV_CONFIG not configured' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const keys = await env.KV_CONFIG.list({ prefix: 'note:' });
    const noteKeys = keys.keys.filter(k => !k.name.startsWith('note:index:'));
    const notes = await Promise.all(
      noteKeys.slice(0, 50).map(key => env.KV_CONFIG.get(key.name))
    );

    const parsedNotes = notes
      .filter(note => note)
      .map(note => JSON.parse(note!))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return new Response(JSON.stringify({
      success: true,
      notes: parsedNotes,
      count: parsedNotes.length,
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

// Dev tools - Inspect resources
export async function handleInspectResource(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const url = new URL(request.url);
    const resourceType = url.searchParams.get('type');
    const resourceId = url.searchParams.get('id');

    if (!resourceType || !resourceId) {
      return new Response(JSON.stringify({ success: false, error: 'Type and ID required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    let data: any = {};

    if (resourceType === 'worker') {
      if (env.CLOUDFLARE_API_TOKEN && env.ACCOUNT_ID) {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/workers/scripts/${resourceId}`,
          {
            headers: { 'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}` },
          }
        );
        if (response.ok) {
          data = await response.json();
        }
      }
    } else if (resourceType === 'database') {
      const db = env.DB || env.SAAS_DB;
      if (db) {
        // Get table schemas
        const tables = await db.prepare(
          "SELECT name FROM sqlite_master WHERE type='table'"
        ).all();
        data = { tables: tables.results || [] };
      }
    } else if (resourceType === 'bucket') {
      const bucket = (env as any)[resourceId] as R2Bucket;
      if (bucket) {
        const objects = await bucket.list({ limit: 10 });
        data = {
          objects: objects.objects.map((o: any) => ({
            key: o.key,
            size: o.size,
            uploaded: o.uploaded,
          })),
        };
      }
    }

    return new Response(JSON.stringify({
      success: true,
      type: resourceType,
      id: resourceId,
      data,
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

function getSystemPrompt(mode: string): string {
  switch (mode) {
    case 'brainstorm':
      return 'You are a creative brainstorming assistant. Generate multiple ideas, explore possibilities, and think outside the box. Be creative and encourage exploration.';
    case 'debug':
      return 'You are an expert debugging assistant. Analyze code, identify issues, suggest fixes, and explain problems clearly. Focus on practical solutions.';
    case 'dev':
      return 'You are a senior developer assistant. Help with code architecture, best practices, optimization, and technical decisions. Provide clear, actionable advice.';
    case 'inspect':
      return 'You are a technical inspector. Analyze systems, identify patterns, explain how things work, and provide detailed technical insights.';
    default:
      return 'You are a helpful AI assistant for developers. Provide clear, concise, and actionable responses.';
  }
}
