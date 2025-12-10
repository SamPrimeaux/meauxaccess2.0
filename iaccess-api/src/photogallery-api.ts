/**
 * Photo Gallery CMS API
 * Handles photo upload, management, SEO optimization
 */

import { Hono } from 'hono';

export interface PhotoMetadata {
  id: string;
  title: string;
  description?: string;
  alt: string;
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  category?: string;
  keywords: string[];
  metaDescription?: string;
  uploadedAt: string;
  updatedAt: string;
  fileSize: number;
  width?: number;
  height?: number;
  mimeType: string;
  seoScore?: number;
  imageId?: string; // Cloudflare Images ID
  variant?: string; // Image variant (public, thumbnail, etc.)
}

export function createPhotoGalleryAPI(app: Hono<any>) {
  // List all photos
  app.get('/api/photogallery', async (c) => {
    try {
      const db = c.env.DB || c.env.SAAS_DB;
      if (!db) {
        return c.json({ success: false, error: 'Database not configured' }, 500);
      }

      const photos = await db.prepare(
        'SELECT * FROM photos ORDER BY uploadedAt DESC'
      ).all<PhotoMetadata>();

      return c.json({
        success: true,
        photos: photos.results || []
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to load photos'
      }, 500);
    }
  });

  // Get single photo
  app.get('/api/photogallery/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const db = c.env.DB || c.env.SAAS_DB;

      if (!db) {
        return c.json({ success: false, error: 'Database not configured' }, 500);
      }

      const photo = await db.prepare(
        'SELECT * FROM photos WHERE id = ?'
      ).bind(id).first<PhotoMetadata>();

      if (!photo) {
        return c.json({ success: false, error: 'Photo not found' }, 404);
      }

      return c.json({ success: true, photo });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to load photo'
      }, 500);
    }
  });

  // Upload photo
  app.post('/api/photogallery/upload', async (c) => {
    try {
      const formData = await c.req.formData();
      const file = formData.get('file') as File;
      const title = formData.get('title') as string;
      const description = formData.get('description') as string || '';
      const alt = formData.get('alt') as string;
      const tags = JSON.parse(formData.get('tags') as string || '[]');
      const category = formData.get('category') as string || '';
      const keywords = JSON.parse(formData.get('keywords') as string || '[]');
      const metaDescription = formData.get('metaDescription') as string || '';

      if (!file || !title || !alt) {
        return c.json({
          success: false,
          error: 'File, title, and alt text are required'
        }, 400);
      }

      const db = c.env.DB || c.env.SAAS_DB;
      const r2Bucket = c.env.R2_ASSETS || c.env.R2_PHOTOS;

      if (!db || !r2Bucket) {
        return c.json({
          success: false,
          error: 'Database or R2 bucket not configured'
        }, 500);
      }

      // Generate unique ID
      const photoId = crypto.randomUUID();
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';

      // Upload to Cloudflare Images for optimization and variants
      const imagesAccountHash = c.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';
      const imagesApiToken = c.env.CLOUDFLARE_IMAGES_API_TOKEN;

      let imageUrl: string;
      let thumbnailUrl: string;
      let imageId: string | undefined;

      if (imagesApiToken) {
        // Upload to Cloudflare Images
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify({ title, alt, category }));

        const imagesResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/images/v1`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${imagesApiToken}`,
            },
            body: formData,
          }
        );

        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          imageId = imagesData.result?.id;

          // Use Cloudflare Images delivery URLs with variants
          imageUrl = `https://imagedelivery.net/${imagesAccountHash}/${imageId}/public`;
          thumbnailUrl = `https://imagedelivery.net/${imagesAccountHash}/${imageId}/thumbnail`;
        } else {
          // Fallback to R2 if Images API fails
          const fileName = `photos/${photoId}.${fileExt}`;
          const fileBuffer = await file.arrayBuffer();
          await r2Bucket.put(fileName, fileBuffer, {
            httpMetadata: {
              contentType: file.type,
              cacheControl: 'public, max-age=31536000',
            },
          });
          imageUrl = `https://pub-85d4626e18354a12865abb1479316f1b.r2.dev/${fileName}`;
          thumbnailUrl = imageUrl;
        }
      } else {
        // Fallback to R2 if Images API token not configured
        const fileName = `photos/${photoId}.${fileExt}`;
        const thumbnailName = `photos/thumbnails/${photoId}.${fileExt}`;
        const fileBuffer = await file.arrayBuffer();

        await r2Bucket.put(fileName, fileBuffer, {
          httpMetadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000',
          },
        });

        await r2Bucket.put(thumbnailName, fileBuffer, {
          httpMetadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000',
          },
        });

        imageUrl = `https://pub-85d4626e18354a12865abb1479316f1b.r2.dev/${fileName}`;
        thumbnailUrl = `https://pub-85d4626e18354a12865abb1479316f1b.r2.dev/${thumbnailName}`;
      }

      // Calculate SEO score
      const seoScore = calculateSEOScore({
        title,
        alt,
        description,
        metaDescription,
        keywords,
        tags,
      });

      // Store metadata in database
      await db.prepare(
        `INSERT INTO photos (
          id, title, description, alt, url, thumbnailUrl, tags, category,
          keywords, metaDescription, uploadedAt, updatedAt, fileSize, mimeType, seoScore
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        photoId,
        title,
        description,
        alt,
        imageUrl,
        thumbnailUrl,
        JSON.stringify(tags),
        category,
        JSON.stringify(keywords),
        metaDescription,
        new Date().toISOString(),
        new Date().toISOString(),
        file.size,
        file.type,
        seoScore
      ).run();

      return c.json({
        success: true,
        photo: {
          id: photoId,
          title,
          url: imageUrl,
          thumbnailUrl,
          imageId, // Cloudflare Images ID if used
          seoScore,
          optimized: !!imageId, // True if using Cloudflare Images
        },
        message: imageId
          ? 'Photo uploaded to Cloudflare Images and optimized successfully'
          : 'Photo uploaded and optimized successfully'
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to upload photo'
      }, 500);
    }
  });

  // Update photo metadata
  app.put('/api/photogallery/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const db = c.env.DB || c.env.SAAS_DB;

      if (!db) {
        return c.json({ success: false, error: 'Database not configured' }, 500);
      }

      const {
        title,
        description,
        alt,
        tags,
        category,
        keywords,
        metaDescription,
      } = body;

      // Recalculate SEO score
      const seoScore = calculateSEOScore({
        title,
        alt,
        description,
        metaDescription,
        keywords: keywords || [],
        tags: tags || [],
      });

      await db.prepare(
        `UPDATE photos SET
          title = ?, description = ?, alt = ?, tags = ?, category = ?,
          keywords = ?, metaDescription = ?, updatedAt = ?, seoScore = ?
        WHERE id = ?`
      ).bind(
        title,
        description,
        alt,
        JSON.stringify(tags || []),
        category,
        JSON.stringify(keywords || []),
        metaDescription,
        new Date().toISOString(),
        seoScore,
        id
      ).run();

      return c.json({
        success: true,
        message: 'Photo updated successfully'
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to update photo'
      }, 500);
    }
  });

  // Delete photo (move to trash bin)
  app.delete('/api/photogallery/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const db = c.env.DB || c.env.SAAS_DB;
      const trashBucket = c.env.R2_TRASH as R2Bucket;

      if (!db) {
        return c.json({ success: false, error: 'Database not configured' }, 500);
      }

      // Get photo details
      const photo = await db.prepare(
        'SELECT * FROM photos WHERE id = ?'
      ).bind(id).first<PhotoMetadata>();

      if (!photo) {
        return c.json({ success: false, error: 'Photo not found' }, 404);
      }

      // Move to trash bin R2
      if (trashBucket && photo.url) {
        try {
          // Try to get the original file from R2
          const r2Bucket = c.env.R2_ASSETS as R2Bucket;
          if (r2Bucket) {
            const fileName = photo.url.split('/').pop() || `${id}.jpg`;
            const originalFile = await r2Bucket.get(`photos/${fileName}`);

            if (originalFile) {
              // Copy to trash bin
              await trashBucket.put(
                `deleted/${id}/${fileName}`,
                originalFile.body,
                {
                  httpMetadata: originalFile.httpMetadata,
                  customMetadata: {
                    ...originalFile.customMetadata,
                    originalId: id,
                    deletedAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                  },
                }
              );
            }
          }
        } catch (error) {
          console.error('Error moving to trash bin:', error);
          // Continue even if trash bin move fails
        }
      }

      // Move metadata to trashbin table
      const deletedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

      await db.prepare(
        `INSERT INTO trashbin (
          id, originalId, title, description, alt, url, thumbnailUrl, tags, category,
          keywords, metaDescription, uploadedAt, deletedAt, expiresAt, fileSize,
          width, height, mimeType, seoScore, imageId, variant
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        crypto.randomUUID(), // New trash bin ID
        id, // Original photo ID
        photo.title,
        photo.description || null,
        photo.alt,
        photo.url,
        photo.thumbnailUrl || null,
        JSON.stringify(photo.tags || []),
        photo.category || null,
        JSON.stringify(photo.keywords || []),
        photo.metaDescription || null,
        photo.uploadedAt,
        deletedAt,
        expiresAt,
        photo.fileSize || null,
        photo.width || null,
        photo.height || null,
        photo.mimeType || null,
        photo.seoScore || 0,
        photo.imageId || null,
        photo.variant || null
      ).run();

      // Delete from photos table
      await db.prepare('DELETE FROM photos WHERE id = ?').bind(id).run();

      return c.json({
        success: true,
        message: 'Photo moved to trash bin. It will be permanently deleted after 14 days.',
        deletedAt,
        expiresAt
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to delete photo'
      }, 500);
    }
  });

  // Restore photo from trash bin
  app.post('/api/photogallery/restore/:id', async (c) => {
    try {
      const id = c.req.param('id'); // trashbin ID
      const db = c.env.DB || c.env.SAAS_DB;
      const trashBucket = c.env.R2_TRASH as R2Bucket;

      if (!db) {
        return c.json({ success: false, error: 'Database not configured' }, 500);
      }

      // Get from trashbin
      const deletedPhoto = await db.prepare(
        'SELECT * FROM trashbin WHERE id = ?'
      ).bind(id).first<any>();

      if (!deletedPhoto) {
        return c.json({ success: false, error: 'Photo not found in trash bin' }, 404);
      }

      // Restore to photos table
      await db.prepare(
        `INSERT INTO photos (
          id, title, description, alt, url, thumbnailUrl, tags, category,
          keywords, metaDescription, uploadedAt, updatedAt, fileSize,
          width, height, mimeType, seoScore, imageId, variant
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        deletedPhoto.originalId,
        deletedPhoto.title,
        deletedPhoto.description,
        deletedPhoto.alt,
        deletedPhoto.url,
        deletedPhoto.thumbnailUrl,
        deletedPhoto.tags,
        deletedPhoto.category,
        deletedPhoto.keywords,
        deletedPhoto.metaDescription,
        deletedPhoto.uploadedAt,
        new Date().toISOString(),
        deletedPhoto.fileSize,
        deletedPhoto.width,
        deletedPhoto.height,
        deletedPhoto.mimeType,
        deletedPhoto.seoScore,
        deletedPhoto.imageId,
        deletedPhoto.variant
      ).run();

      // Move file back from trash if possible
      if (trashBucket) {
        try {
          const fileName = deletedPhoto.url.split('/').pop() || `${deletedPhoto.originalId}.jpg`;
          const trashFile = await trashBucket.get(`deleted/${deletedPhoto.originalId}/${fileName}`);

          if (trashFile) {
            const r2Bucket = c.env.R2_ASSETS as R2Bucket;
            if (r2Bucket) {
              await r2Bucket.put(`photos/${fileName}`, trashFile.body, {
                httpMetadata: trashFile.httpMetadata,
              });
            }
          }
        } catch (error) {
          console.error('Error restoring file from trash:', error);
          // Continue even if file restore fails
        }
      }

      // Delete from trashbin
      await db.prepare('DELETE FROM trashbin WHERE id = ?').bind(id).run();

      return c.json({
        success: true,
        message: 'Photo restored successfully',
        photo: { id: deletedPhoto.originalId }
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to restore photo'
      }, 500);
    }
  });

  // List trash bin
  app.get('/api/photogallery/trash', async (c) => {
    try {
      const db = c.env.DB || c.env.SAAS_DB;
      if (!db) {
        return c.json({ success: false, error: 'Database not configured' }, 500);
      }

      const deletedPhotos = await db.prepare(
        'SELECT * FROM trashbin ORDER BY deletedAt DESC'
      ).all();

      return c.json({
        success: true,
        photos: deletedPhotos.results || []
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to load trash bin'
      }, 500);
    }
  });

  // Optimize SEO for all photos
  app.post('/api/photogallery/optimize-seo', async (c) => {
    try {
      const db = c.env.DB || c.env.SAAS_DB;
      if (!db) {
        return c.json({ success: false, error: 'Database not configured' }, 500);
      }

      const photos = await db.prepare('SELECT * FROM photos').all<PhotoMetadata>();

      for (const photo of photos.results || []) {
        const seoScore = calculateSEOScore({
          title: photo.title,
          alt: photo.alt,
          description: photo.description || '',
          metaDescription: photo.metaDescription || '',
          keywords: photo.keywords || [],
          tags: photo.tags || [],
        });

        await db.prepare(
          'UPDATE photos SET seoScore = ?, updatedAt = ? WHERE id = ?'
        ).bind(seoScore, new Date().toISOString(), photo.id).run();
      }

      return c.json({
        success: true,
        message: `SEO optimized for ${photos.results?.length || 0} photos`
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to optimize SEO'
      }, 500);
    }
  });

  // Generate structured data (JSON-LD) for SEO
  app.get('/api/photogallery/structured-data', async (c) => {
    try {
      const db = c.env.DB || c.env.SAAS_DB;
      if (!db) {
        return c.json({ success: false, error: 'Database not configured' }, 500);
      }

      const photos = await db.prepare(
        'SELECT * FROM photos ORDER BY uploadedAt DESC LIMIT 50'
      ).all<PhotoMetadata>();

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: 'Photo Gallery',
        description: 'Curated photo gallery with optimized images',
        image: photos.results?.map(photo => ({
          '@type': 'ImageObject',
          url: photo.url,
          name: photo.title,
          description: photo.description,
          keywords: photo.keywords.join(', '),
        })) || [],
      };

      return c.json({
        success: true,
        structuredData,
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to generate structured data'
      }, 500);
    }
  });
}

/**
 * Calculate SEO score based on various factors
 */
function calculateSEOScore(data: {
  title: string;
  alt: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
}): number {
  let score = 0;
  const maxScore = 100;

  // Title (20 points)
  if (data.title && data.title.length >= 10 && data.title.length <= 60) {
    score += 20;
  } else if (data.title) {
    score += 10;
  }

  // Alt text (20 points)
  if (data.alt && data.alt.length >= 10 && data.alt.length <= 125) {
    score += 20;
  } else if (data.alt) {
    score += 10;
  }

  // Description (15 points)
  if (data.description && data.description.length >= 50) {
    score += 15;
  } else if (data.description) {
    score += 7;
  }

  // Meta description (15 points)
  if (data.metaDescription && data.metaDescription.length >= 120 && data.metaDescription.length <= 160) {
    score += 15;
  } else if (data.metaDescription) {
    score += 7;
  }

  // Keywords (15 points)
  if (data.keywords && data.keywords.length >= 3) {
    score += 15;
  } else if (data.keywords && data.keywords.length > 0) {
    score += 7;
  }

  // Tags (15 points)
  if (data.tags && data.tags.length >= 3) {
    score += 15;
  } else if (data.tags && data.tags.length > 0) {
    score += 7;
  }

  return Math.min(score, maxScore);
}
