/**
 * Authentication System
 * Handles user login, session management, and service access
 */

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'developer' | 'member';
  createdAt: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: string;
  createdAt: number;
  expiresAt: number;
}

// Valid users (can be extended to use D1 or KV)
const VALID_USERS: Record<string, { password: string; name: string; role: 'admin' | 'developer' | 'member' }> = {
  'sam@meauxbility.org': {
    password: 'meauxmcp2024', // Change this to a secure password
    name: 'Sam Primeaux',
    role: 'admin'
  },
  'connor@meauxbility.org': {
    password: 'meauxmcp2024',
    name: 'Connor',
    role: 'developer'
  },
  'fred@meauxbility.org': {
    password: 'meauxmcp2024',
    name: 'Fred',
    role: 'developer'
  },
  'amber@meauxbility.org': {
    password: 'meauxmcp2024',
    name: 'Amber',
    role: 'developer'
  },
  'info@inneranimals.com': {
    password: 'meauxmcp2024',
    name: 'Inner Animals Info',
    role: 'admin'
  },
  'meauxbility@gmail.com': {
    password: 'meauxmcp2024',
    name: 'Meauxbility Gmail',
    role: 'admin'
  },
};

/**
 * Generate session token
 */
function generateSessionToken(): string {
  return btoa(`${Date.now()}-${Math.random()}-${crypto.randomUUID()}`)
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 64);
}

/**
 * Get session from request cookie
 */
export function getSessionId(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('meaux_session='));

  if (!sessionCookie) return null;
  return sessionCookie.split('=')[1];
}

/**
 * Create session
 */
export async function createSession(
  env: { KV_SESSIONS?: KVNamespace },
  user: { email: string; name: string; role: string }
): Promise<{ sessionId: string; expiresAt: number }> {
  if (!env.KV_SESSIONS) {
    throw new Error('KV_SESSIONS not configured');
  }

  const sessionId = generateSessionToken();
  const now = Date.now();
  const expiresAt = now + (7 * 24 * 60 * 60 * 1000); // 7 days

  const session: Session = {
    userId: user.email,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: now,
    expiresAt: expiresAt,
  };

  await env.KV_SESSIONS.put(
    `session:${sessionId}`,
    JSON.stringify(session),
    { expirationTtl: 7 * 24 * 60 * 60 } // 7 days
  );

  return { sessionId, expiresAt };
}

/**
 * Get session data
 */
export async function getSession(
  env: { KV_SESSIONS?: KVNamespace },
  sessionId: string
): Promise<Session | null> {
  if (!env.KV_SESSIONS) return null;

  const sessionData = await env.KV_SESSIONS.get(`session:${sessionId}`, 'json');
  if (!sessionData) return null;

  const session = sessionData as Session;

  // Check if expired
  if (Date.now() > session.expiresAt) {
    await env.KV_SESSIONS.delete(`session:${sessionId}`);
    return null;
  }

  return session;
}

/**
 * Validate user credentials
 */
export function validateUser(email: string, password: string): { valid: boolean; user?: { email: string; name: string; role: string } } {
  const user = VALID_USERS[email.toLowerCase()];

  if (!user || user.password !== password) {
    return { valid: false };
  }

  return {
    valid: true,
    user: {
      email: email.toLowerCase(),
      name: user.name,
      role: user.role,
    }
  };
}

/**
 * Delete session (logout)
 */
export async function deleteSession(
  env: { KV_SESSIONS?: KVNamespace },
  sessionId: string
): Promise<void> {
  if (env.KV_SESSIONS) {
    await env.KV_SESSIONS.delete(`session:${sessionId}`);
  }
}

/**
 * Verify session and return user
 */
export async function verifySession(
  env: { KV_SESSIONS?: KVNamespace },
  request: Request
): Promise<{ authenticated: boolean; user?: Session }> {
  const sessionId = getSessionId(request);

  if (!sessionId) {
    return { authenticated: false };
  }

  const session = await getSession(env, sessionId);

  if (!session) {
    return { authenticated: false };
  }

  return { authenticated: true, user: session };
}
