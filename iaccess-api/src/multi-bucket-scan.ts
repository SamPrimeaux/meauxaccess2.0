/**
 * Multi-Bucket Image Scanner
 * Scans multiple R2 buckets to find all images
 */

import { Hono } from 'hono';

export function createMultiBucketScanAPI(app: Hono<any>) {
  // Scan all configured buckets for images
  app.get('/api/photogallery/scan-all-buckets', async (c) => {
    try {
      const buckets = [
        { name: 'inneranimalmedia-assets', binding: 'R2_ASSETS' },
        { name: 'meauxbilityorgfinal', binding: 'R2_WEBSITE' },
        { name: 'meaux-work-storage', binding: 'STORAGE' },
        { name: 'meauxstack-components', binding: 'R2_COMPONENTS' },
      ];

      const results: any[] = [];
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];

      for (const bucketConfig of buckets) {
        const bucket = (c.env as any)[bucketConfig.binding] as R2Bucket;
        if (!bucket) continue;

        try {
          let allObjects: any[] = [];
          let cursor: string | undefined;

          // Scan with pagination
          do {
            const listOptions: any = { limit: 1000 };
            if (cursor) listOptions.cursor = cursor;

            const batch = await bucket.list(listOptions);
            allObjects.push(...batch.objects);
            cursor = batch.cursor;

            // Limit to 5000 per bucket for performance
            if (allObjects.length >= 5000) break;
          } while (cursor);

          // Filter for images
          const images = allObjects.filter(obj => {
            const ext = obj.key.toLowerCase().split('.').pop();
            return imageExtensions.includes(`.${ext}`);
          });

          // Group by common paths
          const pathGroups: Record<string, number> = {};
          images.forEach(img => {
            const pathParts = img.key.split('/');
            if (pathParts.length > 1) {
              const folder = pathParts[0] + '/';
              pathGroups[folder] = (pathGroups[folder] || 0) + 1;
            } else {
              pathGroups['root/'] = (pathGroups['root/'] || 0) + 1;
            }
          });

          results.push({
            bucket: bucketConfig.name,
            binding: bucketConfig.binding,
            total: allObjects.length,
            images: images.length,
            pathGroups,
            samplePaths: images.slice(0, 10).map((img: any) => img.key),
          });
        } catch (error: any) {
          results.push({
            bucket: bucketConfig.name,
            binding: bucketConfig.binding,
            error: error.message,
          });
        }
      }

      const totalImages = results.reduce((sum, r) => sum + (r.images || 0), 0);

      return c.json({
        success: true,
        totalImages,
        buckets: results,
        summary: {
          totalBuckets: results.length,
          bucketsWithImages: results.filter(r => r.images > 0).length,
          totalImages,
        },
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to scan buckets'
      }, 500);
    }
  });

  // Scan specific paths across buckets
  app.post('/api/photogallery/scan-paths', async (c) => {
    try {
      const body = await c.req.json();
      const { paths, bucketName = 'inneranimalmedia-assets' } = body;

      if (!paths || !Array.isArray(paths)) {
        return c.json({
          success: false,
          error: 'Paths array is required'
        }, 400);
      }

      const r2Bucket = c.env.R2_ASSETS || c.env.R2_PHOTOS;
      if (!r2Bucket) {
        return c.json({
          success: false,
          error: 'R2 bucket not configured'
        }, 500);
      }

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
      const found: any[] = [];
      const notFound: string[] = [];

      for (const path of paths) {
        try {
          const obj = await r2Bucket.get(path);
          if (obj) {
            const ext = path.toLowerCase().split('.').pop();
            if (imageExtensions.includes(`.${ext}`)) {
              found.push({
                key: path,
                size: obj.size,
                uploaded: obj.uploaded,
              });
            } else {
              notFound.push(path);
            }
          } else {
            notFound.push(path);
          }
        } catch (error: any) {
          notFound.push(path);
        }
      }

      return c.json({
        success: true,
        found: found.length,
        notFound: notFound.length,
        images: found,
        missing: notFound,
      });
    } catch (error: any) {
      return c.json({
        success: false,
        error: error.message || 'Failed to scan paths'
      }, 500);
    }
  });
}
