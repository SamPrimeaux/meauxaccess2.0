// Southern Pets Animal Rescue Gallery API
// Handles animal images, upload, delete, update with trashbin support

export interface AnimalImage {
  id: string;
  animalId?: string; // Link to animal if assigned
  animalName?: string;
  filename: string;
  title?: string;
  description?: string;
  url: string; // R2 public URL or Cloudflare Images URL
  thumbnailUrl?: string;
  uploadedAt: string;
  updatedAt: string;
  fileSize?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  isPrimary?: boolean; // Primary photo for animal
  metadata?: Record<string, any>;
}

export interface TrashbinItem {
  id: string;
  originalId: string;
  originalData: AnimalImage;
  deletedAt: string;
  expiresAt: string; // 14 days from deletion
  originalBucket: string;
  originalPath: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// List all images
export async function handleGalleryList(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '50');
    const animalId = url.searchParams.get('animalId');
    const search = url.searchParams.get('search');

    const db = env.DB || env.SOUTHERNPETS_DB;
    if (!db) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    let query = 'SELECT * FROM animal_images WHERE 1=1';
    const params: any[] = [];

    if (animalId) {
      query += ' AND animalId = ?';
      params.push(animalId);
    }

    if (search) {
      query += ' AND (filename LIKE ? OR title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY uploadedAt DESC LIMIT ? OFFSET ?';
    params.push(perPage, (page - 1) * perPage);

    const result = await db.prepare(query).bind(...params).all<AnimalImage>();

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM animal_images WHERE 1=1';
    const countParams: any[] = [];
    if (animalId) {
      countQuery += ' AND animalId = ?';
      countParams.push(animalId);
    }
    if (search) {
      countQuery += ' AND (filename LIKE ? OR title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    const countResult = await db.prepare(countQuery).bind(...countParams).first<{ total: number }>();

    return new Response(JSON.stringify({
      success: true,
      images: result.results || [],
      pagination: {
        page,
        perPage,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / perPage),
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

// Upload image
export async function handleGalleryUpload(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const animalId = formData.get('animalId') as string || null;
    const animalName = formData.get('animalName') as string || null;
    const title = formData.get('title') as string || file.name;
    const description = formData.get('description') as string || '';
    const isPrimary = formData.get('isPrimary') === 'true';

    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'File is required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const db = env.DB || env.SOUTHERNPETS_DB;
    const r2Bucket = env.R2_SOUTHERNPETS || env.R2_STORAGE;

    if (!db || !r2Bucket) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database or R2 bucket not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Generate unique ID and path - Organized structure
    const imageId = crypto.randomUUID();
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';

    // Organize by type: images/animals/{species}/{animal_id}_{timestamp}_{uuid}.jpg
    // or images/gallery/{timestamp}_{uuid}.jpg
    let r2Path: string;
    if (animalId && animalName) {
      const species = animalName.toLowerCase().includes('dog') ? 'dogs' : 'cats';
      r2Path = `images/animals/${species}/${animalId}_${timestamp}_${imageId}.${fileExt}`;
    } else {
      r2Path = `images/gallery/${timestamp}_${imageId}.${fileExt}`;
    }

    // Upload to R2
    await r2Bucket.put(r2Path, file.body, {
      httpMetadata: {
        contentType: file.type || 'image/jpeg',
      },
      customMetadata: {
        originalFilename: file.name,
        uploadedAt: new Date().toISOString(),
        animalId: animalId || '',
        animalName: animalName || '',
      },
    });

    // Get public URL (using custom domain or public dev URL)
    const publicUrl = env.PRODUCTION_URL
      ? `${env.PRODUCTION_URL}/r2/${r2Path}`
      : `https://pub-2de3a237854249aea5ea23c05aee5473.r2.dev/${r2Path}`;

    // If this is primary, unset other primary images for this animal
    if (isPrimary && animalId) {
      await db.prepare(
        'UPDATE animal_images SET isPrimary = 0 WHERE animalId = ?'
      ).bind(animalId).run();
    }

    // Insert into database
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO animal_images (
        id, animalId, animalName, filename, title, description,
        url, thumbnailUrl, uploadedAt, updatedAt, fileSize, mimeType, isPrimary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      imageId,
      animalId,
      animalName,
      file.name,
      title,
      description,
      publicUrl,
      publicUrl, // Use same URL for thumbnail (can be optimized later)
      now,
      now,
      file.size,
      file.type || 'image/jpeg',
      isPrimary ? 1 : 0
    ).run();

    return new Response(JSON.stringify({
      success: true,
      image: {
        id: imageId,
        animalId,
        animalName,
        filename: file.name,
        title,
        description,
        url: publicUrl,
        thumbnailUrl: publicUrl,
        uploadedAt: now,
        updatedAt: now,
        fileSize: file.size,
        mimeType: file.type || 'image/jpeg',
        isPrimary,
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

// Update image metadata
export async function handleGalleryUpdate(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { id, title, description, animalId, animalName, isPrimary } = body;

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'id is required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const db = env.DB || env.SOUTHERNPETS_DB;
    if (!db) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (animalId !== undefined) {
      updates.push('animalId = ?');
      params.push(animalId);
    }
    if (animalName !== undefined) {
      updates.push('animalName = ?');
      params.push(animalName);
    }
    if (isPrimary !== undefined) {
      updates.push('isPrimary = ?');
      params.push(isPrimary ? 1 : 0);

      // If setting as primary, unset others for this animal
      if (isPrimary && animalId) {
        await db.prepare(
          'UPDATE animal_images SET isPrimary = 0 WHERE animalId = ? AND id != ?'
        ).bind(animalId, id).run();
      }
    }

    updates.push('updatedAt = ?');
    params.push(new Date().toISOString());
    params.push(id);

    await db.prepare(`
      UPDATE animal_images 
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params).run();

    // Get updated image
    const updated = await db.prepare(
      'SELECT * FROM animal_images WHERE id = ?'
    ).bind(id).first<AnimalImage>();

    return new Response(JSON.stringify({
      success: true,
      image: updated,
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

// Delete image (move to trashbin)
export async function handleGalleryDelete(request: Request, env: any): Promise<Response> {
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

    const db = env.DB || env.SOUTHERNPETS_DB;
    const r2Bucket = env.R2_SOUTHERNPETS || env.R2_STORAGE;
    const trashbinBucket = env.R2_TRASHBIN_SOUTHERNPETS;

    if (!db || !r2Bucket) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database or R2 bucket not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Get image data
    const image = await db.prepare(
      'SELECT * FROM animal_images WHERE id = ?'
    ).bind(id).first<AnimalImage>();

    if (!image) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Image not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Extract R2 path from URL
    const urlObj = new URL(image.url);
    const r2Path = urlObj.pathname.replace('/r2/', '').replace(/^\//, '');

    // Move to trashbin R2 bucket if configured
    if (trashbinBucket && r2Bucket) {
      try {
        const originalObject = await r2Bucket.get(r2Path);
        if (originalObject) {
          const trashbinPath = `trash/${Date.now()}_${r2Path}`;
          await trashbinBucket.put(trashbinPath, originalObject.body, {
            httpMetadata: originalObject.httpMetadata,
            customMetadata: {
              ...originalObject.customMetadata,
              originalPath: r2Path,
              originalBucket: 'southernpetsanimalrescue',
              deletedAt: new Date().toISOString(),
            },
          });
        }
      } catch (error) {
        console.error('Error moving to trashbin:', error);
        // Continue even if trashbin move fails
      }
    }

    // Calculate expiration (14 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    // Insert into trashbin table
    await db.prepare(`
      INSERT INTO trashbin_southernpets (
        id, originalId, originalData, deletedAt, expiresAt, originalBucket, originalPath
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      id,
      JSON.stringify(image),
      new Date().toISOString(),
      expiresAt.toISOString(),
      'southernpetsanimalrescue',
      r2Path
    ).run();

    // Delete from main table
    await db.prepare('DELETE FROM animal_images WHERE id = ?').bind(id).run();

    // Delete from R2 (original location)
    try {
      await r2Bucket.delete(r2Path);
    } catch (error) {
      console.error('Error deleting from R2:', error);
      // Continue even if R2 delete fails
    }

    return new Response(JSON.stringify({
      success: true,
      deleted: id,
      message: 'Image moved to trashbin. It will be permanently deleted after 14 days.',
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

// List trashbin items
export async function handleTrashbinList(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const db = env.DB || env.SOUTHERNPETS_DB;
    if (!db) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const result = await db.prepare(`
      SELECT * FROM trashbin_southernpets 
      ORDER BY deletedAt DESC
    `).all<TrashbinItem>();

    return new Response(JSON.stringify({
      success: true,
      items: result.results || [],
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

// Restore from trashbin
export async function handleTrashbinRestore(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id'); // trashbin item id

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'id parameter required',
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const db = env.DB || env.SOUTHERNPETS_DB;
    const r2Bucket = env.R2_SOUTHERNPETS || env.R2_STORAGE;
    const trashbinBucket = env.R2_TRASHBIN_SOUTHERNPETS;

    if (!db || !r2Bucket) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database or R2 bucket not configured',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Get trashbin item
    const trashItem = await db.prepare(
      'SELECT * FROM trashbin_southernpets WHERE id = ?'
    ).bind(id).first<TrashbinItem>();

    if (!trashItem) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Trashbin item not found',
      }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const originalData: AnimalImage = JSON.parse(trashItem.originalData as any);

    // Restore from trashbin R2 to main R2
    if (trashbinBucket && r2Bucket) {
      try {
        const trashbinObjects = await trashbinBucket.list({ prefix: `trash/` });
        const trashbinObject = trashbinObjects.objects.find(obj =>
          obj.key.includes(trashItem.originalPath)
        );

        if (trashbinObject) {
          const restoredObject = await trashbinBucket.get(trashbinObject.key);
          if (restoredObject) {
            await r2Bucket.put(trashItem.originalPath, restoredObject.body, {
              httpMetadata: restoredObject.httpMetadata,
              customMetadata: {
                ...restoredObject.customMetadata,
                restoredAt: new Date().toISOString(),
              },
            });
          }
        }
      } catch (error) {
        console.error('Error restoring from trashbin:', error);
        // Continue even if restore fails
      }
    }

    // Restore to main table
    await db.prepare(`
      INSERT INTO animal_images (
        id, animalId, animalName, filename, title, description,
        url, thumbnailUrl, uploadedAt, updatedAt, fileSize, mimeType, isPrimary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      originalData.id,
      originalData.animalId,
      originalData.animalName,
      originalData.filename,
      originalData.title,
      originalData.description,
      originalData.url,
      originalData.thumbnailUrl,
      originalData.uploadedAt,
      new Date().toISOString(),
      originalData.fileSize,
      originalData.mimeType,
      originalData.isPrimary ? 1 : 0
    ).run();

    // Delete from trashbin table
    await db.prepare('DELETE FROM trashbin_southernpets WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({
      success: true,
      restored: originalData.id,
      image: originalData,
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

// Cleanup expired trashbin items (called by scheduled worker)
export async function handleTrashbinCleanup(env: any): Promise<void> {
  try {
    const db = env.DB || env.SOUTHERNPETS_DB;
    const trashbinBucket = env.R2_TRASHBIN_SOUTHERNPETS;

    if (!db) {
      console.error('Database not configured for trashbin cleanup');
      return;
    }

    const now = new Date().toISOString();

    // Get expired items
    const expired = await db.prepare(`
      SELECT * FROM trashbin_southernpets 
      WHERE expiresAt < ?
    `).bind(now).all<TrashbinItem>();

    if (!expired.results || expired.results.length === 0) {
      console.log('No expired trashbin items to clean up');
      return;
    }

    console.log(`Cleaning up ${expired.results.length} expired trashbin items`);

    // Delete from R2 trashbin bucket
    if (trashbinBucket) {
      for (const item of expired.results) {
        try {
          const trashbinObjects = await trashbinBucket.list({ prefix: `trash/` });
          const trashbinObject = trashbinObjects.objects.find(obj =>
            obj.key.includes(item.originalPath)
          );
          if (trashbinObject) {
            await trashbinBucket.delete(trashbinObject.key);
          }
        } catch (error) {
          console.error(`Error deleting trashbin object for ${item.id}:`, error);
        }
      }
    }

    // Delete from database
    await db.prepare(`
      DELETE FROM trashbin_southernpets 
      WHERE expiresAt < ?
    `).bind(now).run();

    console.log(`Successfully cleaned up ${expired.results.length} expired items`);
  } catch (error: any) {
    console.error('Error during trashbin cleanup:', error);
    throw error;
  }
}
