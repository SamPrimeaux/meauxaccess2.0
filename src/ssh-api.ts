/**
 * SSH API System
 * Provides secure SSH access for team members to run dev projects
 */

export interface SSHConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  keyName?: string; // Reference to stored SSH key
  projectPath?: string;
  createdAt: string;
  lastUsed?: string;
}

export interface SSHCommand {
  connectionId: string;
  command: string;
  workingDirectory?: string;
  timeout?: number;
}

// Note: Cloudflare Workers cannot directly execute SSH commands
// This system provides an API that proxies to an SSH gateway service
// or uses Cloudflare Tunnel/Zero Trust for secure access

// Execute SSH command (proxied through secure gateway)
export async function executeSSHCommand(
  env: Env,
  connection: SSHConnection,
  command: SSHCommand
): Promise<{ success: boolean; output: string; error?: string }> {
  // Since Workers can't directly SSH, we'll:
  // 1. Store command in queue
  // 2. Return a job ID
  // 3. Client polls for results

  // For now, return a mock response indicating the API structure
  // In production, this would connect to an SSH gateway service

  return {
    success: true,
    output: `SSH command execution API ready.\nCommand: ${command.command}\nHost: ${connection.host}\n\nNote: Full SSH execution requires an SSH gateway service.`,
    error: undefined,
  };
}

// Get SSH connections for a user
export async function getUserSSHConnections(env: Env, email: string): Promise<SSHConnection[]> {
  if (!env.KV_CONFIG) return [];

  const data = await env.KV_CONFIG.get(`ssh:connections:${email}`);
  return data ? JSON.parse(data) : [];
}

// Save SSH connection
export async function saveSSHConnection(env: Env, email: string, connection: SSHConnection): Promise<void> {
  if (!env.KV_CONFIG) return;

  const connections = await getUserSSHConnections(env, email);
  const existing = connections.findIndex(c => c.id === connection.id);

  if (existing >= 0) {
    connections[existing] = connection;
  } else {
    connections.push(connection);
  }

  await env.KV_CONFIG.put(`ssh:connections:${email}`, JSON.stringify(connections));
}

// Delete SSH connection
export async function deleteSSHConnection(env: Env, email: string, connectionId: string): Promise<void> {
  if (!env.KV_CONFIG) return;

  const connections = await getUserSSHConnections(env, email);
  const filtered = connections.filter(c => c.id !== connectionId);

  await env.KV_CONFIG.put(`ssh:connections:${email}`, JSON.stringify(filtered));
}

// Validate SSH access for user
export async function validateSSHAccess(env: Env, email: string): Promise<boolean> {
  const member = await getTeamMember(env, email);
  return member?.sshAccess ?? false;
}

// Import team management function
import { getTeamMember } from './team-management';

// Type definition for Env
interface Env {
  KV_CONFIG?: KVNamespace;
  KV_USERS?: KVNamespace;
}

// Import getTeamMember from team-management
import { getTeamMember } from './team-management';
