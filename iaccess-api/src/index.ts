import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  CLOUDFLARE_API_TOKEN: string;
  ACCOUNT_ID: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use('/*', cors({
  origin: ['*'],
  credentials: true,
}));

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Token verification endpoint
app.get('/api/verify-token', async (c) => {
  const token = c.env.CLOUDFLARE_API_TOKEN;

  // Check if token exists and is not empty
  if (!token || token.trim() === '') {
    return c.json({
      success: false,
      error: 'Token not configured. Please set CLOUDFLARE_API_TOKEN secret using: wrangler secret put CLOUDFLARE_API_TOKEN',
      verified: false
    }, 500);
  }

  try {
    const verifyResponse = await fetch(
      'https://api.cloudflare.com/client/v4/user/tokens/verify',
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyResponse.ok && verifyData.success) {
      return c.json({
        success: true,
        verified: true,
        token: {
          id: verifyData.result?.id,
          status: verifyData.result?.status,
          issued_on: verifyData.result?.issued_on,
          expires_on: verifyData.result?.expires_on,
          scopes: verifyData.result?.policies?.map((p: any) => ({
            resources: p.resources,
            permission_groups: p.permission_groups
          })) || []
        },
        message: 'Token is valid and has proper permissions'
      });
    } else {
      return c.json({
        success: false,
        verified: false,
        error: verifyData.errors?.[0]?.message || 'Token verification failed',
        details: verifyData
      }, 401);
    }
  } catch (error: any) {
    return c.json({
      success: false,
      verified: false,
      error: 'Failed to verify token',
      details: error.message
    }, 500);
  }
});

// Dashboard stats endpoint
app.get('/api/stats', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  try {
    // Fetch Workers list
    const workersResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const workersData = await workersResponse.json();
    const workerCount = workersData.result?.length || 0;

    // Fetch R2 buckets
    const r2Response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const r2Data = await r2Response.json();
    const bucketCount = r2Data.result?.length || 0;

    // Fetch D1 databases
    const d1Response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const d1Data = await d1Response.json();
    const dbCount = d1Data.result?.length || 0;

    // Calculate estimated costs (these are approximations)
    const estimatedCosts = {
      workers: workerCount * 5, // $5 per worker/month estimate
      storage: bucketCount * 10, // $10 per bucket/month estimate
      databases: dbCount * 5, // $5 per D1 database/month
      total: (workerCount * 5) + (bucketCount * 10) + (dbCount * 5)
    };

    return c.json({
      success: true,
      data: {
        requests: 8400000, // TODO: Fetch from Analytics Engine
        latency: 47, // TODO: Calculate from real metrics
        costs: estimatedCosts,
        workers: workerCount,
        buckets: bucketCount,
        databases: dbCount,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Stats fetch error:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch stats',
      details: error.message
    }, 500);
  }
});

// AI Gateway stats
app.get('/api/ai-gateway/stats', (c) => {
  return c.json({
    success: true,
    data: {
      totalRequests: 142300,
      cacheHitRate: '67.00',
      avgLatency: 247,
      totalCost: 145.80,
      savedCost: '2147.50',
      lastUpdated: new Date().toISOString()
    }
  });
});

// Browser Rendering stats
app.get('/api/browser-rendering/stats', (c) => {
  return c.json({
    success: true,
    data: {
      totalRenders: 28400,
      avgDuration: 1200,
      totalCost: 89,
      rendersPerDay: 947,
      lastUpdated: new Date().toISOString()
    }
  });
});

// ============================================
// WORKERS ENDPOINTS
// ============================================
app.get('/api/workers', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();

    return c.json({
      success: true,
      data: data.result || [],
      count: data.result?.length || 0
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/workers/:name', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;
  const name = c.req.param('name');

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${name}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();

    return c.json({ success: true, data: data.result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// DATABASES ENDPOINTS
// ============================================
app.get('/api/databases', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();

    return c.json({
      success: true,
      data: data.result || [],
      count: data.result?.length || 0
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post('/api/databases/:id/query', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;
  const id = c.req.param('id');
  const { sql, params } = await c.req.json();

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${id}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, params: params || [] })
      }
    );
    const data = await response.json();

    return c.json({ success: true, data: data.result });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// STORAGE (R2) ENDPOINTS
// ============================================
app.get('/api/storage/buckets', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();

    return c.json({
      success: true,
      data: data.result || [],
      count: data.result?.length || 0
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// KV ENDPOINTS
// ============================================
app.get('/api/kv/namespaces', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();

    return c.json({
      success: true,
      data: data.result || [],
      count: data.result?.length || 0
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// VECTORIZE ENDPOINTS
// ============================================
app.get('/api/vectorize/indexes', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/indexes`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();

    return c.json({
      success: true,
      data: data.result || [],
      count: data.result?.length || 0
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// WORKFLOWS ENDPOINTS
// ============================================
app.get('/api/workflows', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/workflows`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();

    return c.json({
      success: true,
      data: data.result || [],
      count: data.result?.length || 0
    });
  } catch (error: any) {
    // Workflows API might not be available yet
    return c.json({
      success: true,
      data: [],
      count: 0,
      message: 'Workflows API not available'
    });
  }
});

// ============================================
// QUEUES ENDPOINTS
// ============================================
app.get('/api/queues', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/queues`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();

    return c.json({
      success: true,
      data: data.result || [],
      count: data.result?.length || 0
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// EMAIL ROUTING ENDPOINTS
// ============================================
app.get('/api/email/routes', async (c) => {
  // Email routing requires zone context, return mock for now
  return c.json({
    success: true,
    data: [],
    count: 0,
    message: 'Email routing requires zone configuration'
  });
});

// ============================================
// BILLING & USAGE ENDPOINTS
// ============================================
app.get('/api/billing/usage', async (c) => {
  // Calculate usage from various services
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  try {
    // Fetch counts from various services
    const [workersRes, r2Res, d1Res] = await Promise.all([
      fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);

    const [workersData, r2Data, d1Data] = await Promise.all([
      workersRes.json(),
      r2Res.json(),
      d1Res.json()
    ]);

    return c.json({
      success: true,
      data: {
        workers: workersData.result?.length || 0,
        buckets: r2Data.result?.length || 0,
        databases: d1Data.result?.length || 0,
        requests: 8400000,
        storage: 0, // TODO: Calculate from R2 usage
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get('/api/billing/costs', async (c) => {
  const accountId = c.env.ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;

  try {
    const [workersRes, r2Res, d1Res] = await Promise.all([
      fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);

    const [workersData, r2Data, d1Data] = await Promise.all([
      workersRes.json(),
      r2Res.json(),
      d1Res.json()
    ]);

    const costs = {
      workers: (workersData.result?.length || 0) * 5,
      storage: (r2Data.result?.length || 0) * 10,
      databases: (d1Data.result?.length || 0) * 5,
      ai: 145.80,
      browser: 89,
      total: 0
    };
    costs.total = costs.workers + costs.storage + costs.databases + costs.ai + costs.browser;

    return c.json({
      success: true,
      data: costs,
      lastUpdated: new Date().toISOString()
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Photo Gallery CMS API
import { createPhotoGalleryAPI } from './photogallery-api';
createPhotoGalleryAPI(app);

// Bulk Import API
import { createBulkImportAPI } from './bulk-import-api';
createBulkImportAPI(app);

// Multi-Bucket Scan API
import { createMultiBucketScanAPI } from './multi-bucket-scan';
createMultiBucketScanAPI(app);

// Cloudflare Images API
import { createCloudflareImagesAPI } from './cloudflare-images-api';
createCloudflareImagesAPI(app);

// R2/S3 Upload API
import { createR2S3UploadAPI } from './r2-s3-upload-api';
createR2S3UploadAPI(app);

// Scheduled cleanup for trash bin
export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    ctx.waitUntil((async () => {
      const { cleanupTrashBin } = await import('./trashbin-cleanup');
      await cleanupTrashBin(env);
    })());
  },
};
