/**
 * Media Gallery API
 * Comprehensive gallery for images and videos with edit/delete capabilities
 */

export interface Env {
  DB?: D1Database;
  SAAS_DB?: D1Database;
  KV_CONFIG?: KVNamespace;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_IMAGES_API_TOKEN?: string;
  CLOUDFLARE_STREAM_CUSTOMER_ID?: string;
  ACCOUNT_ID?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_IMAGES_ACCOUNT_HASH?: string;
  OPENAI_API_KEY?: string;
  [key: `R2_${string}`]: R2Bucket;
}

// Get all images from Cloudflare Images
export async function handleGetAllImages(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '50');
    const search = url.searchParams.get('search') || '';

    const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
    const token = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;
    const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cloudflare Images API token not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Fetch all images with pagination
    let allImages: any[] = [];
    let currentPage = 1;
    let hasMore = true;
    const maxPages = 10; // Safety limit for faster response

    while (hasMore && currentPage <= maxPages) {
      try {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1?per_page=100`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Cloudflare Images API error:', response.status, errorText);
          break;
        }

        const data = await response.json();
        if (!data.success) {
          console.error('Cloudflare Images API returned success=false:', data.errors);
          break;
        }

        const images = data.result?.images || [];
        allImages.push(...images);

        // Check pagination
        const pagination = data.result?.pagination;
        hasMore = pagination?.has_more === true && images.length === 100;

        // If no pagination info, assume we got all if less than 100
        if (!pagination && images.length < 100) {
          hasMore = false;
        }

        currentPage++;

        // Break if we have enough for the requested page
        if (allImages.length >= (page * perPage)) {
          break;
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        break;
      }
    }

    // Filter by search query if provided
    if (search) {
      const searchLower = search.toLowerCase();
      allImages = allImages.filter((img: any) => {
        const filename = (img.filename || '').toLowerCase();
        const imgId = (img.id || '').toLowerCase();
        return filename.includes(searchLower) || imgId.includes(searchLower);
      });
    }

    // Sort by upload date (newest first)
    allImages.sort((a: any, b: any) => {
      const dateA = new Date(a.uploaded || 0).getTime();
      const dateB = new Date(b.uploaded || 0).getTime();
      return dateB - dateA;
    });

    // Paginate results
    const total = allImages.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = allImages.slice(start, end);

    // Format images with URLs
    const formattedImages = paginated.map((img: any) => {
      const variant = img.variants?.[0] || 'public';
      const imageUrl = variant.startsWith('http')
        ? variant
        : `https://imagedelivery.net/${accountHash}/${img.id}/${variant}`;

      return {
        id: img.id,
        filename: img.filename || img.id,
        uploaded: img.uploaded,
        uploadedAt: img.uploaded,
        size: img.size,
        variants: img.variants || [],
        url: imageUrl,
        thumbnailUrl: imageUrl,
        metadata: img.metadata || {},
        requireSignedURLs: img.requireSignedURLs || false,
      };
    });

    return new Response(JSON.stringify({
      success: true,
      images: formattedImages,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
        hasMore: end < total,
      },
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

// Get all videos from Cloudflare Stream
export async function handleGetAllVideos(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '50');
    const search = url.searchParams.get('search') || '';

    const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
    const token = env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_IMAGES_API_TOKEN;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cloudflare API token not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Fetch all videos with pagination
    let allVideos: any[] = [];
    let currentPage = 1;
    let hasMore = true;
    const maxPages = 20; // Safety limit

    while (hasMore && currentPage <= maxPages) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream?per_page=100&page=${currentPage}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        break;
      }

      const data = await response.json();
      if (!data.success) {
        break;
      }

      const videos = data.result || [];
      allVideos.push(...videos);

      // Check if there are more pages
      hasMore = videos.length === 100;
      currentPage++;
    }

    // Filter by search query if provided
    if (search) {
      const searchLower = search.toLowerCase();
      allVideos = allVideos.filter((video: any) => {
        const filename = (video.meta?.name || '').toLowerCase();
        const uid = (video.uid || '').toLowerCase();
        return filename.includes(searchLower) || uid.includes(searchLower);
      });
    }

    // Sort by creation date (newest first)
    allVideos.sort((a: any, b: any) => {
      const dateA = new Date(a.created || 0).getTime();
      const dateB = new Date(b.created || 0).getTime();
      return dateB - dateA;
    });

    // Paginate results
    const total = allVideos.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = allVideos.slice(start, end);

    // Format videos with URLs
    const formattedVideos = paginated.map((video: any) => {
      const thumbnail = video.thumbnail || video.preview || '';
      const thumbnailUrl = thumbnail.startsWith('http')
        ? thumbnail
        : thumbnail
          ? `https://customer-${env.CLOUDFLARE_STREAM_CUSTOMER_ID || '8y3087qnrzz7ql2e'}.cloudflarestream.com/${thumbnail}`
          : '';

      return {
        id: video.uid,
        uid: video.uid,
        filename: video.meta?.name || video.uid,
        title: video.meta?.name || '',
        description: video.meta?.description || '',
        uploaded: video.created,
        uploadedAt: video.created,
        duration: video.duration || 0,
        status: video.status || 'unknown',
        thumbnail: thumbnailUrl,
        thumbnailUrl: thumbnailUrl,
        readyToStream: video.readyToStream || false,
        size: video.size || 0,
        metadata: video.meta || {},
      };
    });

    return new Response(JSON.stringify({
      success: true,
      videos: formattedVideos,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
        hasMore: end < total,
      },
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

// Delete image from Cloudflare Images
export async function handleDeleteImage(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const url = new URL(request.url);
    const imageId = url.searchParams.get('id');

    if (!imageId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image ID required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
    const token = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cloudflare Images API token not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
      {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to delete image: ${response.status}`,
        details: errorText,
      }), {
        status: response.status,
        headers: corsHeaders,
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      success: true,
      message: 'Image deleted successfully',
      result: data.result,
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

// Delete video from Cloudflare Stream
export async function handleDeleteVideo(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const url = new URL(request.url);
    const videoId = url.searchParams.get('id');

    if (!videoId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Video ID required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
    const token = env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_IMAGES_API_TOKEN;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cloudflare API token not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}`,
      {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to delete video: ${response.status}`,
        details: errorText,
      }), {
        status: response.status,
        headers: corsHeaders,
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      success: true,
      message: 'Video deleted successfully',
      result: data.result,
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

// Bulk delete images
export async function handleBulkDeleteImages(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Array of image IDs required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
    const token = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cloudflare Images API token not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const results = [];
    const errors = [];

    for (const imageId of ids) {
      try {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        if (response.ok) {
          results.push({ id: imageId, success: true });
        } else {
          errors.push({ id: imageId, error: `Status ${response.status}` });
        }
      } catch (error: any) {
        errors.push({ id: imageId, error: error.message });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      deleted: results.length,
      failed: errors.length,
      results,
      errors,
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

// Bulk delete videos
export async function handleBulkDeleteVideos(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Array of video IDs required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
    const token = env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_IMAGES_API_TOKEN;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cloudflare API token not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const results = [];
    const errors = [];

    for (const videoId of ids) {
      try {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        if (response.ok) {
          results.push({ id: videoId, success: true });
        } else {
          errors.push({ id: videoId, error: `Status ${response.status}` });
        }
      } catch (error: any) {
        errors.push({ id: videoId, error: error.message });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      deleted: results.length,
      failed: errors.length,
      results,
      errors,
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

// Update image metadata
export async function handleUpdateImageMetadata(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const { id, metadata } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image ID required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
    const token = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cloudflare Images API token not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Update metadata via Cloudflare Images API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metadata }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to update metadata: ${response.status}`,
        details: errorText,
      }), {
        status: response.status,
        headers: corsHeaders,
      });
    }

    const data = await response.json();

    // Also store in D1 database for project organization
    const db = env.DB || env.SAAS_DB;
    if (db && metadata) {
      try {
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS media_metadata (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            title TEXT,
            description TEXT,
            tags TEXT,
            project_id TEXT,
            project_name TEXT,
            keywords TEXT,
            alt_text TEXT,
            meta_description TEXT,
            custom_metadata TEXT,
            updatedAt TEXT DEFAULT (datetime('now')),
            createdAt TEXT DEFAULT (datetime('now'))
          )
        `).run();

        const existing = await db.prepare('SELECT * FROM media_metadata WHERE id = ?').bind(id).first();
        
        if (existing) {
          await db.prepare(`
            UPDATE media_metadata 
            SET title = ?, description = ?, tags = ?, project_id = ?, project_name = ?,
                keywords = ?, alt_text = ?, meta_description = ?, custom_metadata = ?,
                updatedAt = datetime('now')
            WHERE id = ?
          `).bind(
            metadata.title || null,
            metadata.description || null,
            metadata.tags ? JSON.stringify(metadata.tags) : null,
            metadata.project_id || null,
            metadata.project_name || null,
            metadata.keywords ? JSON.stringify(metadata.keywords) : null,
            metadata.alt_text || null,
            metadata.meta_description || null,
            metadata.custom_metadata ? JSON.stringify(metadata.custom_metadata) : null,
            id
          ).run();
        } else {
          await db.prepare(`
            INSERT INTO media_metadata (id, type, title, description, tags, project_id, project_name,
                                       keywords, alt_text, meta_description, custom_metadata)
            VALUES (?, 'image', ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            id,
            metadata.title || null,
            metadata.description || null,
            metadata.tags ? JSON.stringify(metadata.tags) : null,
            metadata.project_id || null,
            metadata.project_name || null,
            metadata.keywords ? JSON.stringify(metadata.keywords) : null,
            metadata.alt_text || null,
            metadata.meta_description || null,
            metadata.custom_metadata ? JSON.stringify(metadata.custom_metadata) : null
          ).run();
        }
      } catch (dbError) {
        console.error('Error storing metadata in database:', dbError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Metadata updated successfully',
      result: data.result,
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

// Update video metadata
export async function handleUpdateVideoMetadata(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const { id, metadata } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Video ID required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
    const token = env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_IMAGES_API_TOKEN;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cloudflare API token not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Update metadata via Cloudflare Stream API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${id}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meta: metadata }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to update metadata: ${response.status}`,
        details: errorText,
      }), {
        status: response.status,
        headers: corsHeaders,
      });
    }

    const data = await response.json();

    // Also store in D1 database
    const db = env.DB || env.SAAS_DB;
    if (db && metadata) {
      try {
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS media_metadata (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            title TEXT,
            description TEXT,
            tags TEXT,
            project_id TEXT,
            project_name TEXT,
            keywords TEXT,
            alt_text TEXT,
            meta_description TEXT,
            custom_metadata TEXT,
            updatedAt TEXT DEFAULT (datetime('now')),
            createdAt TEXT DEFAULT (datetime('now'))
          )
        `).run();

        const existing = await db.prepare('SELECT * FROM media_metadata WHERE id = ?').bind(id).first();
        
        if (existing) {
          await db.prepare(`
            UPDATE media_metadata 
            SET title = ?, description = ?, tags = ?, project_id = ?, project_name = ?,
                keywords = ?, alt_text = ?, meta_description = ?, custom_metadata = ?,
                updatedAt = datetime('now')
            WHERE id = ?
          `).bind(
            metadata.name || metadata.title || null,
            metadata.description || null,
            metadata.tags ? JSON.stringify(metadata.tags) : null,
            metadata.project_id || null,
            metadata.project_name || null,
            metadata.keywords ? JSON.stringify(metadata.keywords) : null,
            metadata.alt_text || null,
            metadata.meta_description || null,
            metadata.custom_metadata ? JSON.stringify(metadata.custom_metadata) : null,
            id
          ).run();
        } else {
          await db.prepare(`
            INSERT INTO media_metadata (id, type, title, description, tags, project_id, project_name,
                                       keywords, alt_text, meta_description, custom_metadata)
            VALUES (?, 'video', ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            id,
            metadata.name || metadata.title || null,
            metadata.description || null,
            metadata.tags ? JSON.stringify(metadata.tags) : null,
            metadata.project_id || null,
            metadata.project_name || null,
            metadata.keywords ? JSON.stringify(metadata.keywords) : null,
            metadata.alt_text || null,
            metadata.meta_description || null,
            metadata.custom_metadata ? JSON.stringify(metadata.custom_metadata) : null
          ).run();
        }
      } catch (dbError) {
        console.error('Error storing metadata in database:', dbError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Metadata updated successfully',
      result: data.result,
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

// Get projects
export async function handleGetProjects(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const db = env.DB || env.SAAS_DB;
    if (!db) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    try {
      const projects = await db.prepare(`
        SELECT DISTINCT project_id, project_name, COUNT(*) as media_count
        FROM media_metadata
        WHERE project_id IS NOT NULL
        GROUP BY project_id, project_name
        ORDER BY project_name
      `).all();

      return new Response(JSON.stringify({
        success: true,
        projects: projects.results || [],
      }), { headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({
        success: true,
        projects: [],
      }), { headers: corsHeaders });
    }
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

// Remaster image with OpenAI
export async function handleRemasterImage(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const { imageUrl, prompt, style } = await request.json();

    if (!imageUrl || !env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image URL and OpenAI API key required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const remasterPrompt = prompt || `Remaster and enhance this image: ${imageUrl}. Make it more professional, improve colors, lighting, and overall quality.`;
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: remasterPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: style || 'natural',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        success: false,
        error: `OpenAI API error: ${response.status}`,
        details: errorText,
      }), {
        status: response.status,
        headers: corsHeaders,
      });
    }

    const data = await response.json();
    const remasteredUrl = data.data?.[0]?.url;

    if (!remasteredUrl) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No image URL returned from OpenAI',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Upload remastered image to Cloudflare Images
    const accountId = env.ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
    const token = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

    if (token) {
      try {
        const imageResponse = await fetch(remasteredUrl);
        const imageBlob = await imageResponse.blob();

        const formData = new FormData();
        formData.append('file', imageBlob, 'remastered.png');
        if (prompt) {
          formData.append('metadata', JSON.stringify({ prompt, originalUrl: imageUrl, remastered: true }));
        }

        const uploadResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';
          const variant = uploadData.result?.variants?.[0] || 'public';
          const finalUrl = variant.startsWith('http')
            ? variant
            : `https://imagedelivery.net/${accountHash}/${uploadData.result?.id}/${variant}`;

          return new Response(JSON.stringify({
            success: true,
            message: 'Image remastered and uploaded successfully',
            originalUrl: imageUrl,
            remasteredUrl: finalUrl,
            cloudflareImageId: uploadData.result?.id,
            openaiUrl: remasteredUrl,
          }), { headers: corsHeaders });
        }
      } catch (uploadError) {
        console.error('Error uploading to Cloudflare Images:', uploadError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Image remastered successfully',
      originalUrl: imageUrl,
      remasteredUrl: remasteredUrl,
      note: 'Upload to Cloudflare Images failed, but OpenAI URL is available',
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
