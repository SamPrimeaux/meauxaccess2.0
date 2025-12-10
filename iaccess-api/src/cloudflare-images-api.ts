/**
 * Cloudflare Images API Integration
 * Handles image uploads, variants, and optimization
 */

import { Hono } from 'hono';

export function createCloudflareImagesAPI(app: Hono<any>) {
  // List all images in Cloudflare Images
  app.get('/api/photogallery/cloudflare-images', async (c) => {
    try {
      const accountId = c.env.ACCOUNT_ID;
      const imagesApiToken = c.env.CLOUDFLARE_IMAGES_API_TOKEN;
      const page = parseInt(c.req.query('page') || '1');
      const perPage = parseInt(c.req.query('perPage') || '50');

      if (!imagesApiToken) {
        return c.json({
          success: false,
          error: 'Cloudflare Images API token not configured'
        }, 500);
      }

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1?page=${page}&per_page=${perPage}`,
        {
          headers: {
            'Authorization': `Bearer ${imagesApiToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return c.json({
          success: false,
          error: `Failed to fetch images: ${error}`
        }, response.status);
      }

      const data = await response.json();

      return c.json({
        success: true,
        images: data.result?.images || [],
        pagination: data.result?.pagination || {},
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to list Cloudflare Images'
      }, 500);
    }
  });

  // Import images from Cloudflare Images to gallery
  app.post('/api/photogallery/import-cloudflare-images', async (c) => {
    try {
      const body = await c.req.json();
      const { imageIds, generateMetadata = true } = body;

      if (!imageIds || !Array.isArray(imageIds)) {
        return c.json({
          success: false,
          error: 'imageIds array is required'
        }, 400);
      }

      const accountId = c.env.ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
      const imagesApiToken = c.env.CLOUDFLARE_IMAGES_API_TOKEN;
      const imagesAccountHash = c.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';
      const db = c.env.DB || c.env.SAAS_DB;

      if (!imagesApiToken || !db) {
        return c.json({
          success: false,
          error: 'Cloudflare Images API token or database not configured'
        }, 500);
      }

      const results = {
        imported: 0,
        skipped: 0,
        errors: [] as string[],
      };

      for (const imageId of imageIds) {
        try {
          // Check if already imported
          const existing = await db.prepare(
            'SELECT id FROM photos WHERE url LIKE ?'
          ).bind(`%${imageId}%`).first();

          if (existing) {
            results.skipped++;
            continue;
          }

          // Get image details from Cloudflare Images
          const imageResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
            {
              headers: {
                'Authorization': `Bearer ${imagesApiToken}`,
              },
            }
          );

          if (!imageResponse.ok) {
            results.errors.push(`${imageId}: Not found`);
            continue;
          }

          const imageData = await imageResponse.json();
          const image = imageData.result;

          // Generate metadata
          const metadata = image.metadata || {};
          const filename = image.filename || imageId;
          const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

          const title = metadata.title || generateTitle(nameWithoutExt);
          const alt = metadata.alt || generateAltText(nameWithoutExt, filename);
          const description = metadata.description || generateDescription(nameWithoutExt);
          const tags = metadata.tags ? JSON.parse(metadata.tags) : extractTags(nameWithoutExt, filename);
          const category = metadata.category || extractCategory(filename);
          const keywords = metadata.keywords ? JSON.parse(metadata.keywords) : generateKeywords(nameWithoutExt, tags, category);
          const metaDescription = generateMetaDescription(title, description);

          const seoScore = calculateSEOScore({
            title,
            alt,
            description,
            metaDescription,
            keywords,
            tags,
          });

          // Generate URLs
          const imageUrl = `https://imagedelivery.net/${imagesAccountHash}/${imageId}/public`;
          const thumbnailUrl = `https://imagedelivery.net/${imagesAccountHash}/${imageId}/thumbnail`;

          // Insert into database
          const photoId = crypto.randomUUID();
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
            image.uploaded || new Date().toISOString(),
            new Date().toISOString(),
            image.size || 0,
            image.mimeType || 'image/jpeg',
            seoScore
          ).run();

          results.imported++;
        } catch (error: any) {
          results.errors.push(`${imageId}: ${error.message}`);
        }
      }

      return c.json({
        success: true,
        results,
        message: `Imported ${results.imported} images from Cloudflare Images`
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to import Cloudflare Images'
      }, 500);
    }
  });

  // Bulk import all Cloudflare Images
  app.post('/api/photogallery/import-all-cloudflare-images', async (c) => {
    try {
      const accountId = c.env.ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
      const imagesApiToken = c.env.CLOUDFLARE_IMAGES_API_TOKEN;
      const imagesAccountHash = c.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || 'g7wf09fCONpnidkRnR_5vw';
      const db = c.env.DB || c.env.SAAS_DB;

      if (!imagesApiToken || !db) {
        return c.json({
          success: false,
          error: 'Cloudflare Images API token or database not configured'
        }, 500);
      }

      // Fetch all images with pagination
      let allImages: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1?page=${page}&per_page=100`,
          {
            headers: {
              'Authorization': `Bearer ${imagesApiToken}`,
            },
          }
        );

        if (!response.ok) break;

        const data = await response.json();

        if (!data.success) {
          console.error('API error:', data.errors);
          break;
        }

        const images = data.result?.images || [];
        allImages.push(...images);

        // Check pagination
        const pagination = data.result?.pagination;
        hasMore = pagination?.has_more === true && images.length === 100;
        page++;

        // Safety limit
        if (page > 20) break;
      }

      const results = {
        total: allImages.length,
        imported: 0,
        skipped: 0,
        errors: [] as string[],
      };

      // Import each image
      for (const image of allImages) {
        try {
          // Check if already imported
          const existing = await db.prepare(
            'SELECT id FROM photos WHERE url LIKE ?'
          ).bind(`%${image.id}%`).first();

          if (existing) {
            results.skipped++;
            continue;
          }

          // Generate metadata
          const metadata = image.metadata || {};
          const filename = image.filename || image.id;
          const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

          const title = metadata.title || generateTitle(nameWithoutExt);
          const alt = metadata.alt || generateAltText(nameWithoutExt, filename);
          const description = metadata.description || generateDescription(nameWithoutExt);
          const tags = metadata.tags ? JSON.parse(metadata.tags) : extractTags(nameWithoutExt, filename);
          const category = metadata.category || extractCategory(filename);
          const keywords = metadata.keywords ? JSON.parse(metadata.keywords) : generateKeywords(nameWithoutExt, tags, category);
          const metaDescription = generateMetaDescription(title, description);

          const seoScore = calculateSEOScore({
            title,
            alt,
            description,
            metaDescription,
            keywords,
            tags,
          });

          // Generate URLs
          const imageUrl = `https://imagedelivery.net/${imagesAccountHash}/${image.id}/public`;
          const thumbnailUrl = `https://imagedelivery.net/${imagesAccountHash}/${image.id}/thumbnail`;

          // Insert into database
          const photoId = crypto.randomUUID();
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
            image.uploaded || new Date().toISOString(),
            new Date().toISOString(),
            image.size || 0,
            image.mimeType || 'image/jpeg',
            seoScore
          ).run();

          results.imported++;
        } catch (error: any) {
          results.errors.push(`${image.id}: ${error.message}`);
        }
      }

      return c.json({
        success: true,
        results,
        message: `Imported ${results.imported} images from Cloudflare Images (${results.skipped} already existed)`
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to import Cloudflare Images'
      }, 500);
    }
  });
}

// Helper functions (same as in bulk-import-api.ts)
function generateTitle(filename: string): string {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}

function generateAltText(filename: string, path: string): string {
  const name = filename.replace(/[-_]/g, ' ');
  const pathParts = path.split('/').filter(p => p && !p.includes('.'));
  const context = pathParts.length > 1 ? pathParts[pathParts.length - 2] : '';

  if (context) {
    return `${name} - ${context}`;
  }
  return name;
}

function generateDescription(filename: string): string {
  const name = filename.replace(/[-_]/g, ' ');
  return `High-quality ${name} image with optimized SEO metadata.`;
}

function extractTags(filename: string, path: string): string[] {
  const tags: string[] = [];
  const lower = filename.toLowerCase();
  const pathLower = path.toLowerCase();

  const tagPatterns = [
    'nature', 'landscape', 'portrait', 'urban', 'abstract', 'art', 'design',
    'photo', 'image', 'picture', 'photography', 'gallery',
    'beautiful', 'amazing', 'stunning', 'professional', 'high-quality'
  ];

  tagPatterns.forEach(tag => {
    if (lower.includes(tag) || pathLower.includes(tag)) {
      tags.push(tag);
    }
  });

  const pathParts = path.split('/').filter(p => p && !p.includes('.'));
  pathParts.forEach(part => {
    if (part.length > 2 && part.length < 20) {
      tags.push(part.toLowerCase());
    }
  });

  return [...new Set(tags)].slice(0, 10);
}

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

  if (pathParts.length > 1) {
    return pathParts[pathParts.length - 2] || 'other';
  }

  return 'other';
}

function generateKeywords(filename: string, tags: string[], category: string): string[] {
  const keywords = new Set<string>();

  if (category && category !== 'other') {
    keywords.add(category);
  }

  tags.forEach(tag => keywords.add(tag));

  filename.split(/[-_\s]/).forEach(word => {
    if (word.length > 3) {
      keywords.add(word.toLowerCase());
    }
  });

  return Array.from(keywords).slice(0, 15);
}

function generateMetaDescription(title: string, description: string): string {
  const meta = `${title}. ${description}`;
  if (meta.length <= 160) {
    return meta;
  }
  return meta.substring(0, 157) + '...';
}

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
