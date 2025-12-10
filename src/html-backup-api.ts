// HTML Backup API for Southern Pets Animal Rescue
// Safely stores HTML code in R2 for backup and recovery

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Upload HTML file to R2
export async function handleUploadHTML(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string || '';
    const description = formData.get('description') as string || '';

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
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Only HTML files are allowed',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const bucket = env.R2_SOUTHERNPETS;
    if (!bucket) {
      return new Response(JSON.stringify({
        success: false,
        error: 'R2 bucket not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Generate organized path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = file.name;
    const r2Path = path
      ? `code/html/${path}/${fileName}`
      : `code/html/${timestamp}_${fileName}`;

    // Upload to R2
    const fileBuffer = await file.arrayBuffer();
    await bucket.put(r2Path, fileBuffer, {
      httpMetadata: {
        contentType: 'text/html',
      },
      customMetadata: {
        originalFilename: fileName,
        uploadedAt: new Date().toISOString(),
        description: description,
        version: timestamp,
        type: 'html',
      },
    });

    return new Response(JSON.stringify({
      success: true,
      path: r2Path,
      url: `https://pub-2de3a237854249aea5ea23c05aee5473.r2.dev/${r2Path}`,
      message: 'HTML file uploaded successfully',
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

// List all HTML files in R2
export async function handleListHTML(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bucket = env.R2_SOUTHERNPETS;
    if (!bucket) {
      return new Response(JSON.stringify({
        success: false,
        error: 'R2 bucket not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // List all HTML files
    const objects = await bucket.list({ prefix: 'code/html/' });
    const htmlFiles = objects.objects.map(obj => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
      url: `https://pub-2de3a237854249aea5ea23c05aee5473.r2.dev/${obj.key}`,
      metadata: obj.customMetadata || {},
    }));

    return new Response(JSON.stringify({
      success: true,
      files: htmlFiles,
      count: htmlFiles.length,
      message: 'HTML files retrieved successfully',
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

// Get specific HTML file
export async function handleGetHTML(request: Request, env: any, url: URL): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const path = url.searchParams.get('path');
    if (!path) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Path parameter required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const bucket = env.R2_SOUTHERNPETS;
    if (!bucket) {
      return new Response(JSON.stringify({
        success: false,
        error: 'R2 bucket not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Ensure path starts with code/html/
    const r2Path = path.startsWith('code/html/') ? path : `code/html/${path}`;

    // Get file from R2
    const object = await bucket.get(r2Path);
    if (!object) {
      return new Response(JSON.stringify({
        success: false,
        error: 'File not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Return HTML content
    const html = await object.text();
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
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

// Delete HTML file (soft delete - move to trashbin)
export async function handleDeleteHTML(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { path } = await request.json();
    if (!path) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Path parameter required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const bucket = env.R2_SOUTHERNPETS;
    const trashbinBucket = env.R2_TRASHBIN_SOUTHERNPETS;

    if (!bucket) {
      return new Response(JSON.stringify({
        success: false,
        error: 'R2 bucket not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Ensure path starts with code/html/
    const r2Path = path.startsWith('code/html/') ? path : `code/html/${path}`;

    // Get file from R2
    const object = await bucket.get(r2Path);
    if (!object) {
      return new Response(JSON.stringify({
        success: false,
        error: 'File not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Move to trashbin if available
    if (trashbinBucket) {
      const trashbinPath = `code/html/${Date.now()}_${r2Path.split('/').pop()}`;
      const fileBuffer = await object.arrayBuffer();
      await trashbinBucket.put(trashbinPath, fileBuffer, {
        httpMetadata: object.httpMetadata,
        customMetadata: {
          ...object.customMetadata,
          originalPath: r2Path,
          deletedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        },
      });
    }

    // Delete from main bucket
    await bucket.delete(r2Path);

    return new Response(JSON.stringify({
      success: true,
      message: 'HTML file deleted successfully',
      movedToTrashbin: !!trashbinBucket,
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

// Backup all HTML files (create archive)
export async function handleBackupAllHTML(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bucket = env.R2_SOUTHERNPETS;
    if (!bucket) {
      return new Response(JSON.stringify({
        success: false,
        error: 'R2 bucket not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // List all HTML files
    const objects = await bucket.list({ prefix: 'code/html/' });

    // Create backup manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      files: objects.objects.map(obj => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
        metadata: obj.customMetadata || {},
      })),
      count: objects.objects.length,
    };

    // Save manifest to R2
    const manifestPath = `code/backups/html-manifest-${Date.now()}.json`;
    await bucket.put(manifestPath, JSON.stringify(manifest, null, 2), {
      httpMetadata: {
        contentType: 'application/json',
      },
      customMetadata: {
        type: 'backup-manifest',
        createdAt: new Date().toISOString(),
      },
    });

    return new Response(JSON.stringify({
      success: true,
      manifest: manifest,
      manifestPath: manifestPath,
      message: `Backup manifest created for ${manifest.count} HTML files`,
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
