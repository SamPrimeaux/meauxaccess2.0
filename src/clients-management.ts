/**
 * Clients Management System
 * Handles client data, logos, and project associations
 */

export interface Client {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  projectId: string;
  priority: number; // Higher = more prominent (top clients)
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  technologies?: string[];
  clients?: Client[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Get clients for a project
 */
export async function getProjectClients(
  env: { DB?: D1Database; SAAS_DB?: D1Database },
  projectId: string,
  limit: number = 5
): Promise<Client[]> {
  const db = env.DB || env.SAAS_DB;
  if (!db) return [];

  const result = await db.prepare(
    `SELECT * FROM clients 
     WHERE projectId = ? 
     ORDER BY priority DESC, createdAt DESC 
     LIMIT ?`
  ).bind(projectId, limit).all<Client>();

  return result.results || [];
}

/**
 * Get all clients for a project (no limit)
 */
export async function getAllProjectClients(
  env: { DB?: D1Database; SAAS_DB?: D1Database },
  projectId: string
): Promise<Client[]> {
  const db = env.DB || env.SAAS_DB;
  if (!db) return [];

  const result = await db.prepare(
    `SELECT * FROM clients 
     WHERE projectId = ? 
     ORDER BY priority DESC, createdAt DESC`
  ).bind(projectId).all<Client>();

  return result.results || [];
}

/**
 * Create or update client
 */
export async function upsertClient(
  env: { DB?: D1Database; SAAS_DB?: D1Database },
  client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; client?: Client; error?: string }> {
  const db = env.DB || env.SAAS_DB;
  if (!db) {
    return { success: false, error: 'Database not configured' };
  }

  const clientId = crypto.randomUUID();
  const now = new Date().toISOString();

  const newClient: Client = {
    id: clientId,
    ...client,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.prepare(
      `INSERT INTO clients (id, name, logoUrl, website, description, projectId, priority, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      newClient.id,
      newClient.name,
      newClient.logoUrl || null,
      newClient.website || null,
      newClient.description || null,
      newClient.projectId,
      newClient.priority || 0,
      newClient.createdAt,
      newClient.updatedAt
    ).run();

    return { success: true, client: newClient };
  } catch (error: any) {
    // If client exists, update it
    if (error.message?.includes('UNIQUE')) {
      const updated = await db.prepare(
        `UPDATE clients 
         SET name = ?, logoUrl = ?, website = ?, description = ?, priority = ?, updatedAt = ?
         WHERE projectId = ? AND name = ?`
      ).bind(
        client.name,
        client.logoUrl || null,
        client.website || null,
        client.description || null,
        client.priority || 0,
        now,
        client.projectId,
        client.name
      ).run();

      const updatedClient = await db.prepare(
        'SELECT * FROM clients WHERE projectId = ? AND name = ?'
      ).bind(client.projectId, client.name).first<Client>();

      return { success: true, client: updatedClient || newClient };
    }

    return { success: false, error: error.message };
  }
}

/**
 * Delete client
 */
export async function deleteClient(
  env: { DB?: D1Database; SAAS_DB?: D1Database },
  clientId: string
): Promise<{ success: boolean; error?: string }> {
  const db = env.DB || env.SAAS_DB;
  if (!db) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    await db.prepare('DELETE FROM clients WHERE id = ?').bind(clientId).run();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get all projects with their top clients
 */
export async function getProjectsWithClients(
  env: { DB?: D1Database; SAAS_DB?: D1Database },
  limit: number = 5
): Promise<Project[]> {
  const db = env.DB || env.SAAS_DB;
  if (!db) return [];

  // Get all projects
  const projectsResult = await db.prepare(
    `SELECT * FROM projects ORDER BY createdAt DESC`
  ).all<Project>();

  const projects = projectsResult.results || [];

  // Get top clients for each project
  for (const project of projects) {
    project.clients = await getProjectClients(env, project.id, limit);
  }

  return projects;
}
