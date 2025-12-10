// R2 Bucket Lock API for Southern Pets Animal Rescue
// Handles bucket organization, validation, and lock configuration

import { organizeR2Bucket, validateBucketStructure, generateBucketLockConfig } from './r2-organization-script';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Validate bucket structure
export async function handleValidateBucket(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const validation = await validateBucketStructure(env);

    return new Response(JSON.stringify({
      success: true,
      valid: validation.valid,
      structure: validation.structure,
      issues: validation.issues,
      message: validation.valid
        ? 'Bucket structure is valid and ready for lock'
        : 'Bucket structure needs organization',
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

// Organize bucket content
export async function handleOrganizeBucket(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const result = await organizeR2Bucket(env);

    return new Response(JSON.stringify({
      success: result.success,
      organized: result.organized,
      errors: result.errors,
      message: result.success
        ? `Successfully organized ${result.organized} files`
        : `Organized ${result.organized} files with ${result.errors.length} errors`,
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

// Get bucket lock configuration
export async function handleGetBucketLockConfig(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const config = generateBucketLockConfig();

    return new Response(JSON.stringify({
      success: true,
      config: JSON.parse(config),
      message: 'Bucket lock configuration generated',
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

// Get bucket statistics
export async function handleGetBucketStats(request: Request, env: any): Promise<Response> {
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

    const objects = await bucket.list();
    const stats = {
      total: objects.objects.length,
      byFolder: {} as Record<string, number>,
      totalSize: 0,
    };

    for (const obj of objects.objects) {
      const key = obj.key;
      const folder = key.split('/')[0] || 'root';
      stats.byFolder[folder] = (stats.byFolder[folder] || 0) + 1;
      stats.totalSize += obj.size || 0;
    }

    return new Response(JSON.stringify({
      success: true,
      stats,
      message: 'Bucket statistics retrieved',
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
