// ============================================
// COMPLETE V1 Gallery Integration for damnsam
// Copy this entire file's contents into damnsam worker
// ============================================

// First, copy the entire contents of src/v1-gallery-api.ts into damnsam
// Then add these routes to damnsam's main fetch handler:

// ============================================
// ADD THESE ROUTES TO DAMNSAM'S MAIN HANDLER
// ============================================

// V1 Gallery API Routes - Add these in your main routing function
if (path === '/api/v1/gallery' && request.method === 'GET') {
  const { handleV1GalleryList } = await import('./v1-gallery-api');
  return handleV1GalleryList(request, env);
}

if (path === '/api/v1/gallery/add' && request.method === 'POST') {
  const { handleV1GalleryAdd } = await import('./v1-gallery-api');
  return handleV1GalleryAdd(request, env);
}

if (path === '/api/v1/gallery/import' && request.method === 'POST') {
  const { handleV1GalleryBulkImport } = await import('./v1-gallery-api');
  return handleV1GalleryBulkImport(request, env);
}

if (path === '/api/v1/gallery/get' && request.method === 'GET') {
  const { handleV1GalleryGet } = await import('./v1-gallery-api');
  return handleV1GalleryGet(request, env);
}

if (path === '/api/v1/gallery/update' && (request.method === 'PUT' || request.method === 'POST')) {
  const { handleV1GalleryUpdate } = await import('./v1-gallery-api');
  return handleV1GalleryUpdate(request, env);
}

if (path === '/api/v1/gallery/delete' && request.method === 'DELETE') {
  const { handleV1GalleryDelete } = await import('./v1-gallery-api');
  return handleV1GalleryDelete(request, env);
}

// ============================================
// ALSO UPDATE getLogoUrl() FUNCTION IN DAMNSAM
// ============================================

// Find your getLogoUrl function and replace it with this:

async function getLogoUrl(env: Env): Promise<string> {
  // Check KV cache first
  if (env.KV_CONFIG) {
    const cachedLogo = await env.KV_CONFIG.get('header:logo:url');
    if (cachedLogo && !cachedLogo.includes('shopify') && !cachedLogo.includes('cdn.shopify')) {
      return cachedLogo;
    }
  }

  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = env.CLOUDFLARE_IMAGES_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw'}/default/public`;
  }

  try {
    // Query Cloudflare Images API for logo
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1?per_page=100`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const images = data.result?.images || [];

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
        for (const img of images) {
          const filename = (img.filename || '').toLowerCase();
          if (filename.includes('logo') || filename.includes('wordmark') || filename.includes('meauxbility') || filename.includes('brand')) {
            foundLogo = img;
            break;
          }
        }
      }

      if (foundLogo) {
        const accountHash = env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';
        const logoUrl = `https://imagedelivery.net/${accountHash}/${foundLogo.id}/public`;

        // Cache in KV
        if (env.KV_CONFIG) {
          await env.KV_CONFIG.put('header:logo:url', logoUrl);
        }

        return logoUrl;
      }
    }
  } catch (error) {
    console.error('Error fetching logo from Cloudflare Images:', error);
  }

  // Fallback
  return `https://imagedelivery.net/${env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw'}/default/public`;
}

// ============================================
// UPDATE injectHeader() TO USE getLogoUrl()
// ============================================

// Make sure injectHeader calls getLogoUrl(env) and passes env parameter
// Update all calls to injectHeader to pass env parameter
