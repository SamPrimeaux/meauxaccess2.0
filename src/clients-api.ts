/**
 * Clients API Endpoints
 * Handles client management for projects
 */

import {
  getProjectClients,
  getAllProjectClients,
  upsertClient,
  deleteClient,
  getProjectsWithClients,
} from './clients-management';

export interface Env {
  DB?: D1Database;
  SAAS_DB?: D1Database;
  R2_ASSETS?: R2Bucket;
}

/**
 * Get top clients for a project
 */
export async function handleGetProjectClients(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    const limit = parseInt(url.searchParams.get('limit') || '5');

    if (!projectId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'projectId is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const clients = await getProjectClients(env, projectId, limit);

    return new Response(JSON.stringify({
      success: true,
      clients,
      count: clients.length,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Create or update client
 */
export async function handleUpsertClient(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const { name, logoUrl, website, description, projectId, priority } = body;

    if (!name || !projectId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'name and projectId are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await upsertClient(env, {
      name,
      logoUrl,
      website,
      description,
      projectId,
      priority: priority || 0,
    });

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || 'Failed to create/update client'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      client: result.client,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Delete client
 */
export async function handleDeleteClient(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const clientId = url.searchParams.get('clientId');

    if (!clientId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'clientId is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await deleteClient(env, clientId);

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || 'Failed to delete client'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Client deleted successfully',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Get all projects with their top clients
 */
export async function handleGetProjectsWithClients(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '5');

    const projects = await getProjectsWithClients(env, limit);

    return new Response(JSON.stringify({
      success: true,
      projects,
      count: projects.length,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
