// Southern Pets Animal Rescue - Logo Management API
// Handles logo upload to Cloudflare Images and retrieval

const CLOUDFLARE_IMAGES_ACCOUNT_HASH = 'g7wf09fCONpnidkRnR_5vw';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Get logo URL from Cloudflare Images or fallback
export async function getLogoUrl(env: any): Promise<string> {
  // Try to get from KV first
  if (env.KV_CONFIG) {
    const logoUrl = await env.KV_CONFIG.get('southernpets:logo:url');
    if (logoUrl) {
      return logoUrl;
    }
  }

  // Try to get from R2 metadata
  if (env.R2_SOUTHERNPETS) {
    try {
      const logoMeta = await env.R2_SOUTHERNPETS.get('assets/southernpets-logo.png');
      if (logoMeta) {
        const imageId = logoMeta.customMetadata?.imageId;
        if (imageId) {
          const logoUrl = `https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${imageId}/public`;
          // Cache in KV
          if (env.KV_CONFIG) {
            await env.KV_CONFIG.put('southernpets:logo:url', logoUrl);
          }
          return logoUrl;
        }
      }
    } catch (error) {
      // Continue to fallback
    }
  }

  // Fallback: Use Cloudflare Images logo (already migrated)
  const cloudflareLogoUrl = `https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/be0043cf-6599-4d18-67a7-02a7a1e49000/public`;
  return cloudflareLogoUrl;
}

// Upload logo to Cloudflare Images
export async function handleLogoUpload(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cloudflare Images not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Upload to Cloudflare Images
    const imageFormData = new FormData();
    imageFormData.append('file', file);

    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        },
        body: imageFormData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      return new Response(JSON.stringify({
        success: false,
        error: `Cloudflare Images upload failed: ${errorText}`,
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const uploadData = await uploadResponse.json();
    const imageId = uploadData.result?.id;
    const variants = uploadData.result?.variants || [];

    if (!imageId || !CLOUDFLARE_IMAGES_ACCOUNT_HASH) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid response from Cloudflare Images',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Generate CDN URL
    const variant = variants.includes('public') ? 'public' : (variants[0] || 'public');
    const logoUrl = `https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`;

    // Store in R2 as backup
    if (env.R2_SOUTHERNPETS) {
      const fileBuffer = await file.arrayBuffer();
      await env.R2_SOUTHERNPETS.put('assets/southernpets-logo.png', fileBuffer, {
        httpMetadata: {
          contentType: file.type,
        },
        customMetadata: {
          uploaded: new Date().toISOString(),
          imageId: imageId,
          cdnUrl: logoUrl,
        },
      });
    }

    // Store in KV for quick access
    if (env.KV_CONFIG) {
      await env.KV_CONFIG.put('southernpets:logo:url', logoUrl);
      await env.KV_CONFIG.put('southernpets:logo:imageId', imageId);
      await env.KV_CONFIG.put('southernpets:logo:uploaded', new Date().toISOString());
    }

    return new Response(JSON.stringify({
      success: true,
      logoUrl: logoUrl,
      imageId: imageId,
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

// Migrate logo from Wix to Cloudflare Images (one-time)
export async function migrateLogoToCloudflare(env: any): Promise<string> {
  try {
    // Fetch logo from Wix
    const wixLogoUrl = 'https://static.wixstatic.com/media/33e096_671c6a950ec34c81b4e787ad92066c26~mv2.png';
    const logoResponse = await fetch(wixLogoUrl);

    if (!logoResponse.ok) {
      throw new Error('Failed to fetch logo from Wix');
    }

    const logoBlob = await logoResponse.blob();

    // Upload to Cloudflare Images
    const imageFormData = new FormData();
    imageFormData.append('file', logoBlob, 'southernpets-logo.png');

    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
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
    const variant = variants.includes('public') ? 'public' : (variants[0] || 'public');
    const logoUrl = `https://imagedelivery.net/${CLOUDFLARE_IMAGES_ACCOUNT_HASH}/${imageId}/${variant}`;

    // Store in R2
    if (env.R2_SOUTHERNPETS) {
      const logoBuffer = await logoBlob.arrayBuffer();
      await env.R2_SOUTHERNPETS.put('assets/southernpets-logo.png', logoBuffer, {
        httpMetadata: {
          contentType: 'image/png',
        },
        customMetadata: {
          uploaded: new Date().toISOString(),
          imageId: imageId,
          cdnUrl: logoUrl,
          migrated: 'true',
        },
      });
    }

    // Store in KV
    if (env.KV_CONFIG) {
      await env.KV_CONFIG.put('southernpets:logo:url', logoUrl);
      await env.KV_CONFIG.put('southernpets:logo:imageId', imageId);
      await env.KV_CONFIG.put('southernpets:logo:uploaded', new Date().toISOString());
    }

    return logoUrl;
  } catch (error: any) {
    console.error('Logo migration error:', error);
    // Return Wix URL as fallback
    return 'https://static.wixstatic.com/media/33e096_671c6a950ec34c81b4e787ad92066c26~mv2.png';
  }
}
