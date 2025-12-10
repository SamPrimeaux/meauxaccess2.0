/**
 * Bulk Image Import API
 * Imports existing images from R2 buckets into the photo gallery CMS
 */

import { Hono } from 'hono';

export interface ImportConfig {
  bucketName: string;
  prefix?: string;
  extensions?: string[];
  batchSize?: number;
  generateMetadata?: boolean;
}

export function createBulkImportAPI(app: Hono<any>) {
  // List images in R2 bucket (with pagination support)
  app.get('/api/photogallery/import/list', async (c) => {
    try {
      const bucketName = c.req.query('bucket') || 'inneranimalmedia-assets';
      const prefix = c.req.query('prefix') || '';
      const limit = parseInt(c.req.query('limit') || '10000');
      const scanAll = c.req.query('scanAll') === 'true';

      const r2Bucket = c.env.R2_ASSETS || c.env.R2_PHOTOS;
      if (!r2Bucket) {
        return c.json({ success: false, error: 'R2 bucket not configured' }, 500);
      }

      // Handle pagination for large collections
      let allObjects: any[] = [];
      let cursor: string | undefined;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];

      do {
        const listOptions: any = { prefix, limit: 1000 };
        if (cursor) listOptions.cursor = cursor;

        const batch = await r2Bucket.list(listOptions);
        allObjects.push(...batch.objects);
        cursor = batch.cursor;

        // Stop if we've reached the requested limit
        if (allObjects.length >= limit && !scanAll) break;
      } while (cursor && (scanAll || allObjects.length < limit));

      // Filter for image files
      const images = allObjects.filter(obj => {
        const ext = obj.key.toLowerCase().split('.').pop();
        return imageExtensions.includes(`.${ext}`);
      });

      return c.json({
        success: true,
        total: allObjects.length,
        images: images.length,
        truncated: cursor ? true : false,
        files: images.slice(0, 100).map(img => ({ // Return first 100 for preview
          key: img.key,
          size: img.size,
          uploaded: img.uploaded,
        })),
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to list images'
      }, 500);
    }
  });

  // Bulk import images from R2
  app.post('/api/photogallery/import/bulk', async (c) => {
    try {
      const body = await c.req.json();
      const {
        bucketName,
        prefix = '',
        extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        batchSize = 50,
        generateMetadata = true,
      } = body;

      const db = c.env.DB || c.env.SAAS_DB;
      const r2Bucket = c.env.R2_ASSETS || c.env.R2_PHOTOS;

      if (!db || !r2Bucket) {
        return c.json({
          success: false,
          error: 'Database or R2 bucket not configured'
        }, 500);
      }

      // List all objects (handle pagination for 1000+ images)
      let allObjects: any[] = [];
      let cursor: string | undefined;

      do {
        const listOptions: any = { prefix, limit: 1000 };
        if (cursor) listOptions.cursor = cursor;

        const batch = await r2Bucket.list(listOptions);
        allObjects.push(...batch.objects);
        cursor = batch.cursor;

        // Safety limit: max 10,000 images per import
        if (allObjects.length >= 10000) break;
      } while (cursor);

      // Filter for images
      const imageObjects = allObjects.objects.filter(obj => {
        const ext = obj.key.toLowerCase().split('.').pop();
        return extensions.includes(ext || '');
      });

      const results = {
        total: imageObjects.length,
        imported: 0,
        skipped: 0,
        errors: [] as string[],
      };

      // Process in batches with progress tracking
      const totalBatches = Math.ceil(imageObjects.length / batchSize);

      for (let i = 0; i < imageObjects.length; i += batchSize) {
        const batch = imageObjects.slice(i, i + batchSize);
        const currentBatch = Math.floor(i / batchSize) + 1;

        // Log progress (could be enhanced with WebSocket for real-time updates)
        console.log(`Processing batch ${currentBatch}/${totalBatches} (${batch.length} images)`);

        for (const obj of batch) {
          try {
            // Check if already imported
            const existing = await db.prepare(
              'SELECT id FROM photos WHERE url LIKE ?'
            ).bind(`%${obj.key}%`).first();

            if (existing) {
              results.skipped++;
              continue;
            }

            // Get image from R2
            const image = await r2Bucket.get(obj.key);
            if (!image) {
              results.errors.push(`Failed to fetch: ${obj.key}`);
              continue;
            }

            // Generate metadata
            const fileName = obj.key.split('/').pop() || obj.key;
            const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
            const title = generateTitle(nameWithoutExt);
            const alt = generateAltText(nameWithoutExt, obj.key);
            const description = generateDescription(nameWithoutExt);
            const tags = extractTags(nameWithoutExt, obj.key);
            const category = extractCategory(obj.key);
            const keywords = generateKeywords(nameWithoutExt, tags, category);
            const metaDescription = generateMetaDescription(title, description);

            // Calculate SEO score
            const seoScore = calculateSEOScore({
              title,
              alt,
              description,
              metaDescription,
              keywords,
              tags,
            });

            // Generate photo ID
            const photoId = crypto.randomUUID();
            const imageUrl = `https://pub-85d4626e18354a12865abb1479316f1b.r2.dev/${obj.key}`;
            const thumbnailUrl = imageUrl; // In production, generate actual thumbnail

            // Insert into database
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
              obj.uploaded?.toISOString() || new Date().toISOString(),
              new Date().toISOString(),
              obj.size,
              getMimeType(obj.key),
              seoScore
            ).run();

            results.imported++;
          } catch (error: any) {
            results.errors.push(`${obj.key}: ${error.message}`);
          }
        }
      }

      return c.json({
        success: true,
        results,
        message: `Imported ${results.imported} images, skipped ${results.skipped} duplicates`
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to import images'
      }, 500);
    }
  });

  // Import from specific paths
  app.post('/api/photogallery/import/paths', async (c) => {
    try {
      const body = await c.req.json();
      const { paths, generateMetadata = true } = body;

      if (!paths || !Array.isArray(paths)) {
        return c.json({
          success: false,
          error: 'Paths array is required'
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

      const results = {
        imported: 0,
        skipped: 0,
        errors: [] as string[],
      };

      for (const path of paths) {
        try {
          // Check if already imported
          const existing = await db.prepare(
            'SELECT id FROM photos WHERE url LIKE ?'
          ).bind(`%${path}%`).first();

          if (existing) {
            results.skipped++;
            continue;
          }

          // Get image from R2
          const image = await r2Bucket.get(path);
          if (!image) {
            results.errors.push(`Not found: ${path}`);
            continue;
          }

          // Generate metadata
          const fileName = path.split('/').pop() || path;
          const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
          const title = generateTitle(nameWithoutExt);
          const alt = generateAltText(nameWithoutExt, path);
          const description = generateDescription(nameWithoutExt);
          const tags = extractTags(nameWithoutExt, path);
          const category = extractCategory(path);
          const keywords = generateKeywords(nameWithoutExt, tags, category);
          const metaDescription = generateMetaDescription(title, description);

          const seoScore = calculateSEOScore({
            title,
            alt,
            description,
            metaDescription,
            keywords,
            tags,
          });

          const photoId = crypto.randomUUID();

          // Try to upload to Cloudflare Images if available
          const imagesAccountHash = c.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';
          const imagesApiToken = c.env.CLOUDFLARE_IMAGES_API_TOKEN;
          let imageUrl: string;
          let thumbnailUrl: string;

          if (imagesApiToken && image) {
            // Upload to Cloudflare Images
            const formData = new FormData();
            formData.append('file', new Blob([await image.arrayBuffer()], { type: image.httpMetadata?.contentType || 'image/jpeg' }));
            formData.append('metadata', JSON.stringify({ title, category, source: 'bulk-import' }));

            try {
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
                const imageId = imagesData.result?.id;
                imageUrl = `https://imagedelivery.net/${imagesAccountHash}/${imageId}/public`;
                thumbnailUrl = `https://imagedelivery.net/${imagesAccountHash}/${imageId}/thumbnail`;
              } else {
                // Fallback to R2
                imageUrl = `https://pub-85d4626e18354a12865abb1479316f1b.r2.dev/${path}`;
                thumbnailUrl = imageUrl;
              }
            } catch (error) {
              // Fallback to R2
              imageUrl = `https://pub-85d4626e18354a12865abb1479316f1b.r2.dev/${path}`;
              thumbnailUrl = imageUrl;
            }
          } else {
            // Use R2 URL
            imageUrl = `https://pub-85d4626e18354a12865abb1479316f1b.r2.dev/${path}`;
            thumbnailUrl = imageUrl;
          }

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
            imageUrl,
            JSON.stringify(tags),
            category,
            JSON.stringify(keywords),
            metaDescription,
            new Date().toISOString(),
            new Date().toISOString(),
            image.size || 0,
            getMimeType(path),
            seoScore
          ).run();

          results.imported++;
        } catch (error: any) {
          results.errors.push(`${path}: ${error.message}`);
        }
      }

      return c.json({
        success: true,
        results,
        message: `Imported ${results.imported} images`
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to import images'
      }, 500);
    }
  });
}

/**
 * Generate title from filename
 */
function generateTitle(filename: string): string {
  // Convert filename to title case
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}

/**
 * Generate alt text from filename and path
 */
function generateAltText(filename: string, path: string): string {
  const name = filename.replace(/[-_]/g, ' ');
  const pathParts = path.split('/').filter(p => p && !p.includes('.'));
  const context = pathParts.length > 1 ? pathParts[pathParts.length - 2] : '';

  if (context) {
    return `${name} - ${context}`;
  }
  return name;
}

/**
 * Generate description from filename
 */
function generateDescription(filename: string): string {
  const name = filename.replace(/[-_]/g, ' ');
  return `High-quality ${name} image with optimized SEO metadata.`;
}

/**
 * Extract tags from filename and path
 */
function extractTags(filename: string, path: string): string[] {
  const tags: string[] = [];
  const lower = filename.toLowerCase();
  const pathLower = path.toLowerCase();

  // Common tag patterns
  const tagPatterns = [
    'nature', 'landscape', 'portrait', 'urban', 'abstract', 'art', 'design',
    'photo', 'image', 'picture', 'photo', 'photography', 'gallery',
    'beautiful', 'amazing', 'stunning', 'professional', 'high-quality'
  ];

  tagPatterns.forEach(tag => {
    if (lower.includes(tag) || pathLower.includes(tag)) {
      tags.push(tag);
    }
  });

  // Extract from path segments
  const pathParts = path.split('/').filter(p => p && !p.includes('.'));
  pathParts.forEach(part => {
    if (part.length > 2 && part.length < 20) {
      tags.push(part.toLowerCase());
    }
  });

  return [...new Set(tags)].slice(0, 10); // Max 10 tags
}

/**
 * Extract category from path
 */
function extractCategory(path: string): string {
  const pathParts = path.toLowerCase().split('/');

  const categories = ['nature', 'portrait', 'landscape', 'urban', 'abstract', 'art', 'design'];
  for (const part of pathParts) {
    for (const cat of categories) {
      if (part.includes(cat)) {
        return cat;
      }
    }
  }

  // Default based on path structure
  if (pathParts.length > 1) {
    return pathParts[pathParts.length - 2] || 'other';
  }

  return 'other';
}

/**
 * Generate keywords from filename, tags, and category
 */
function generateKeywords(filename: string, tags: string[], category: string): string[] {
  const keywords = new Set<string>();

  // Add category
  if (category && category !== 'other') {
    keywords.add(category);
  }

  // Add tags
  tags.forEach(tag => keywords.add(tag));

  // Add filename words
  filename.split(/[-_\s]/).forEach(word => {
    if (word.length > 3) {
      keywords.add(word.toLowerCase());
    }
  });

  return Array.from(keywords).slice(0, 15); // Max 15 keywords
}

/**
 * Generate meta description
 */
function generateMetaDescription(title: string, description: string): string {
  const meta = `${title}. ${description}`;
  if (meta.length <= 160) {
    return meta;
  }
  return meta.substring(0, 157) + '...';
}

/**
 * Calculate SEO score
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

  if (data.title && data.title.length >= 10 && data.title.length <= 60) score += 20;
  else if (data.title) score += 10;

  if (data.alt && data.alt.length >= 10 && data.alt.length <= 125) score += 20;
  else if (data.alt) score += 10;

  if (data.description && data.description.length >= 50) score += 15;
  else if (data.description) score += 7;

  if (data.metaDescription && data.metaDescription.length >= 120 && data.metaDescription.length <= 160) score += 15;
  else if (data.metaDescription) score += 7;

  if (data.keywords && data.keywords.length >= 3) score += 15;
  else if (data.keywords && data.keywords.length > 0) score += 7;

  if (data.tags && data.tags.length >= 3) score += 15;
  else if (data.tags && data.tags.length > 0) score += 7;

  return Math.min(score, 100);
}

/**
 * Get MIME type from file extension
 */
function getMimeType(path: string): string {
  const ext = path.toLowerCase().split('.').pop();
  const types: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
  };
  return types[ext || ''] || 'image/jpeg';
}
