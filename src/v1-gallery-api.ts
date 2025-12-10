// V1 Gallery API - Remote content storage and management
// Stores images, metadata, and provides gallery functionality

export interface GalleryImage {
  id: string;
  imageId: string; // Cloudflare Images ID
  filename: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  uploaded: string;
  deliveryUrl: string;
  variants: string[];
  metadata?: Record<string, any>;
}

export interface GalleryCollection {
  id: string;
  name: string;
  description?: string;
  images: string[]; // Array of image IDs
  created: string;
  updated: string;
  metadata?: Record<string, any>;
}

// List all gallery images
export async function handleV1GalleryList(request: Request, env: any): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '50');
    const category = url.searchParams.get('category');
    const tag = url.searchParams.get('tag');
    const search = url.searchParams.get('search');

    // Get all gallery images from KV
    const galleryKey = 'v1:gallery:images';
    let allImages: GalleryImage[] = [];

    if (env.KV_CONFIG) {
      const stored = await env.KV_CONFIG.get(galleryKey, 'json');
      if (stored && Array.isArray(stored)) {
        allImages = stored;
      }
    }

    // Filter by category, tag, or search
    let filtered = allImages;
    if (category) {
      filtered = filtered.filter(img => img.category === category);
    }
    if (tag) {
      filtered = filtered.filter(img => img.tags?.includes(tag));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(img =>
        img.filename.toLowerCase().includes(searchLower) ||
        img.title?.toLowerCase().includes(searchLower) ||
        img.description?.toLowerCase().includes(searchLower) ||
        img.tags?.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Paginate
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = filtered.slice(start, end);

    return new Response(JSON.stringify({
      success: true,
      images: paginated,
      pagination: {
        page,
        perPage,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / perPage),
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

// Add image to gallery
export async function handleV1GalleryAdd(request: Request, env: any): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { imageId, filename, title, description, tags, category, metadata } = body;

    if (!imageId || !filename) {
      return new Response(JSON.stringify({
        success: false,
        error: 'imageId and filename required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Get Cloudflare Images account hash
    const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';

    // Get image details from Cloudflare Images
    const accountId = env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

    let variants = ['public'];
    let deliveryUrl = `https://imagedelivery.net/${accountHash}/${imageId}/public`;

    if (accountId && apiToken) {
      try {
        const imgResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiToken}`,
            },
          }
        );

        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          variants = imgData.result?.variants || ['public'];
          deliveryUrl = `https://imagedelivery.net/${accountHash}/${imageId}/${variants[0]}`;
        }
      } catch (error) {
        // Use defaults if fetch fails
      }
    }

    // Create gallery image entry
    const galleryImage: GalleryImage = {
      id: `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageId,
      filename,
      title: title || filename,
      description,
      tags: tags || [],
      category: category || 'uncategorized',
      uploaded: new Date().toISOString(),
      deliveryUrl,
      variants,
      metadata: metadata || {},
    };

    // Get existing gallery images
    const galleryKey = 'v1:gallery:images';
    let allImages: GalleryImage[] = [];

    if (env.KV_CONFIG) {
      const stored = await env.KV_CONFIG.get(galleryKey, 'json');
      if (stored && Array.isArray(stored)) {
        allImages = stored;
      }
    }

    // Add new image
    allImages.unshift(galleryImage); // Add to beginning (most recent first)

    // Store back to KV
    if (env.KV_CONFIG) {
      await env.KV_CONFIG.put(galleryKey, JSON.stringify(allImages));
    }

    return new Response(JSON.stringify({
      success: true,
      image: galleryImage,
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

// Bulk import images from Cloudflare Images
export async function handleV1GalleryBulkImport(request: Request, env: any): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { limit = 100, category, autoTag = true, useMediaAPI = false } = body;

    const accountId = env.CLOUDFLARE_ACCOUNT_ID;
    const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';
    const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

    if (!accountId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cloudflare Account ID not configured',
      }), {
        status: 503,
        headers: corsHeaders,
      });
    }

    let images: any[] = [];

    // Option 1: Use existing /api/media/images endpoint (if API token issues)
    if (useMediaAPI || !apiToken) {
      try {
        const mediaResponse = await fetch(
          `${new URL(request.url).origin}/api/media/images?per_page=${limit}`,
          {
            method: 'GET',
            headers: {
              'Authorization': request.headers.get('Authorization') || '',
            },
          }
        );
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          if (mediaData.success && mediaData.images) {
            images = mediaData.images.map((img: any) => ({
              id: img.id,
              filename: img.filename,
              variants: img.variants || ['public'],
              uploaded: img.uploaded,
            }));
          }
        }
      } catch (error) {
        // Fall through to direct API call
      }
    }

    // Option 2: Direct Cloudflare Images API call
    if (images.length === 0 && apiToken) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1?per_page=${limit}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Cloudflare Images API error: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.errors?.[0]?.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        // If auth fails, try using media API as fallback
        if (response.status === 401 || response.status === 403) {
          return new Response(JSON.stringify({
            success: false,
            error: 'API token authentication failed. Try using useMediaAPI: true in request body, or set CLOUDFLARE_IMAGES_API_TOKEN secret with correct permissions.',
            suggestion: 'Use the /api/media/images endpoint instead, or verify your API token has Cloudflare Images read permissions.',
          }), {
            status: 401,
            headers: corsHeaders,
          });
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      images = data.result?.images || [];
    }

    if (images.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No images found. Check API token permissions or use useMediaAPI: true',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Get existing gallery images
    const galleryKey = 'v1:gallery:images';
    let existingImages: GalleryImage[] = [];
    const existingImageIds = new Set<string>();

    if (env.KV_CONFIG) {
      const stored = await env.KV_CONFIG.get(galleryKey, 'json');
      if (stored && Array.isArray(stored)) {
        existingImages = stored;
        existingImages.forEach(img => existingImageIds.add(img.imageId));
      }
    }

    // Import new images
    const imported: GalleryImage[] = [];
    const skipped: string[] = [];

    for (const img of images) {
      // Skip if already in gallery
      if (existingImageIds.has(img.id)) {
        skipped.push(img.id);
        continue;
      }

      // Auto-detect tags from filename
      const filename = img.filename || '';
      const filenameLower = filename.toLowerCase();
      const autoTags: string[] = [];

      if (autoTag) {
        if (filenameLower.includes('logo')) autoTags.push('logo');
        if (filenameLower.includes('icon')) autoTags.push('icon');
        if (filenameLower.includes('community')) autoTags.push('community');
        if (filenameLower.includes('sponsor')) autoTags.push('sponsor');
        if (filenameLower.includes('hero')) autoTags.push('hero');
        if (filenameLower.includes('official')) autoTags.push('official');
      }

      const variants = img.variants || ['public'];
      const galleryImage: GalleryImage = {
        id: `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        imageId: img.id,
        filename,
        title: filename.replace(/\.[^/.]+$/, ''), // Remove extension
        description: `Imported from Cloudflare Images`,
        tags: autoTags,
        category: category || 'imported',
        uploaded: img.uploaded || new Date().toISOString(),
        deliveryUrl: `https://imagedelivery.net/${accountHash}/${img.id}/${variants[0]}`,
        variants,
        metadata: {
          imported: true,
          importedAt: new Date().toISOString(),
        },
      };

      imported.push(galleryImage);
      existingImages.unshift(galleryImage);
      existingImageIds.add(img.id);
    }

    // Store updated gallery
    if (env.KV_CONFIG && imported.length > 0) {
      await env.KV_CONFIG.put(galleryKey, JSON.stringify(existingImages));
    }

    return new Response(JSON.stringify({
      success: true,
      imported: imported.length,
      skipped: skipped.length,
      images: imported,
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

// Get gallery image by ID
export async function handleV1GalleryGet(request: Request, env: any): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const imageId = url.searchParams.get('id');

    if (!imageId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'id parameter required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const galleryKey = 'v1:gallery:images';
    let allImages: GalleryImage[] = [];

    if (env.KV_CONFIG) {
      const stored = await env.KV_CONFIG.get(galleryKey, 'json');
      if (stored && Array.isArray(stored)) {
        allImages = stored;
      }
    }

    const image = allImages.find(img => img.id === imageId || img.imageId === imageId);

    if (!image) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      image,
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

// Update gallery image metadata
export async function handleV1GalleryUpdate(request: Request, env: any): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { id, title, description, tags, category, metadata } = body;

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'id required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const galleryKey = 'v1:gallery:images';
    let allImages: GalleryImage[] = [];

    if (env.KV_CONFIG) {
      const stored = await env.KV_CONFIG.get(galleryKey, 'json');
      if (stored && Array.isArray(stored)) {
        allImages = stored;
      }
    }

    const imageIndex = allImages.findIndex(img => img.id === id || img.imageId === id);

    if (imageIndex === -1) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Update image
    if (title !== undefined) allImages[imageIndex].title = title;
    if (description !== undefined) allImages[imageIndex].description = description;
    if (tags !== undefined) allImages[imageIndex].tags = tags;
    if (category !== undefined) allImages[imageIndex].category = category;
    if (metadata !== undefined) {
      allImages[imageIndex].metadata = {
        ...allImages[imageIndex].metadata,
        ...metadata,
      };
    }

    // Store back
    if (env.KV_CONFIG) {
      await env.KV_CONFIG.put(galleryKey, JSON.stringify(allImages));
    }

    return new Response(JSON.stringify({
      success: true,
      image: allImages[imageIndex],
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

// Delete gallery image
export async function handleV1GalleryDelete(request: Request, env: any): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'id parameter required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const galleryKey = 'v1:gallery:images';
    let allImages: GalleryImage[] = [];

    if (env.KV_CONFIG) {
      const stored = await env.KV_CONFIG.get(galleryKey, 'json');
      if (stored && Array.isArray(stored)) {
        allImages = stored;
      }
    }

    const filtered = allImages.filter(img => img.id !== id && img.imageId !== id);

    if (filtered.length === allImages.length) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Store updated gallery
    if (env.KV_CONFIG) {
      await env.KV_CONFIG.put(galleryKey, JSON.stringify(filtered));
    }

    return new Response(JSON.stringify({
      success: true,
      deleted: id,
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
