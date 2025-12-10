/**
 * OAuth & SSO Authentication System
 * Supports Google, GitHub, and other OAuth providers
 */

export interface OAuthProvider {
  name: string;
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
}

export interface OAuthUser {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  avatar?: string;
  verified: boolean;
}

export interface Env {
  DB?: D1Database;
  SAAS_DB?: D1Database;
  KV_SESSIONS?: KVNamespace;
  KV_CONFIG?: KVNamespace;
  // OAuth Secrets
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  OAUTH_REDIRECT_BASE?: string;
}

/**
 * Get OAuth provider configuration
 */
export function getOAuthProvider(env: Env, provider: 'google' | 'github'): OAuthProvider | null {
  if (provider === 'google') {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      return null;
    }
    return {
      name: 'google',
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      scopes: ['openid', 'email', 'profile'],
    };
  }

  if (provider === 'github') {
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return null;
    }
    return {
      name: 'github',
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      authUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user',
      scopes: ['user:email'],
    };
  }

  return null;
}

/**
 * Generate OAuth state token for CSRF protection
 */
export function generateOAuthState(): string {
  return btoa(`${Date.now()}-${Math.random()}-${crypto.randomUUID()}`)
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 32);
}

/**
 * Store OAuth state in KV
 */
export async function storeOAuthState(env: Env, state: string, provider: string): Promise<void> {
  if (!env.KV_CONFIG) return;
  await env.KV_CONFIG.put(
    `oauth_state:${state}`,
    JSON.stringify({ provider, createdAt: Date.now() }),
    { expirationTtl: 600 } // 10 minutes
  );
}

/**
 * Verify OAuth state
 */
export async function verifyOAuthState(env: Env, state: string): Promise<{ valid: boolean; provider?: string }> {
  if (!env.KV_CONFIG) {
    return { valid: false };
  }

  const stateData = await env.KV_CONFIG.get(`oauth_state:${state}`, 'json');
  if (!stateData) {
    return { valid: false };
  }

  // Delete state after use
  await env.KV_CONFIG.delete(`oauth_state:${state}`);

  return { valid: true, provider: stateData.provider };
}

/**
 * Get OAuth authorization URL
 */
export function getOAuthAuthUrl(provider: OAuthProvider, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: provider.scopes.join(' '),
    state: state,
    ...(provider.name === 'google' ? { access_type: 'offline', prompt: 'consent' } : {}),
  });

  return `${provider.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeOAuthCode(
  provider: OAuthProvider,
  code: string,
  redirectUri: string
): Promise<{ access_token: string; token_type?: string; expires_in?: number }> {
  const body = new URLSearchParams({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    code: code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(provider.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OAuth token exchange failed: ${error}`);
  }

  return await response.json();
}

/**
 * Get user info from OAuth provider
 */
export async function getOAuthUserInfo(
  provider: OAuthProvider,
  accessToken: string
): Promise<OAuthUser> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  };

  // GitHub needs different header format
  if (provider.name === 'github') {
    headers['User-Agent'] = 'Meauxbility-OAuth';
  }

  const response = await fetch(provider.userInfoUrl, {
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get user info: ${error}`);
  }

  const data = await response.json();

  if (provider.name === 'google') {
    return {
      provider: 'google',
      providerId: data.id,
      email: data.email,
      name: data.name || data.email.split('@')[0],
      avatar: data.picture,
      verified: data.verified_email || false,
    };
  }

  if (provider.name === 'github') {
    // GitHub requires separate call for email
    let email = data.email;
    let verified = false;

    if (!email || !data.email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Meauxbility-OAuth',
        },
      });

      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary);
        if (primaryEmail) {
          email = primaryEmail.email;
          verified = primaryEmail.verified;
        }
      }
    }

    return {
      provider: 'github',
      providerId: data.id.toString(),
      email: email || `${data.login}@github.local`,
      name: data.name || data.login,
      avatar: data.avatar_url,
      verified: verified,
    };
  }

  throw new Error(`Unsupported provider: ${provider.name}`);
}

/**
 * Find or create user from OAuth
 */
export async function findOrCreateOAuthUser(
  env: Env,
  oauthUser: OAuthUser
): Promise<{ id: string; email: string; name: string; role: string; created: boolean }> {
  const db = env.DB || env.SAAS_DB;
  if (!db) {
    throw new Error('Database not configured');
  }

  // Check if user exists by email
  const existingUser = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(oauthUser.email)
    .first<{ id: string; email: string; name: string; role: string }>();

  if (existingUser) {
    // Update OAuth provider info if needed
    await db
      .prepare(
        'UPDATE users SET name = ?, emailVerified = ? WHERE id = ?'
      )
      .bind(oauthUser.name, oauthUser.verified ? 1 : 0, existingUser.id)
      .run();

    return {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      role: existingUser.role,
      created: false,
    };
  }

  // Create new user
  const userId = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO users (id, email, name, passwordHash, role, emailVerified, createdAt, loginAttempts)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      userId,
      oauthUser.email,
      oauthUser.name,
      '', // No password for OAuth users
      'member', // Default role
      oauthUser.verified ? 1 : 0,
      new Date().toISOString(),
      0
    )
    .run();

  // Store OAuth provider info
  if (env.KV_CONFIG) {
    await env.KV_CONFIG.put(
      `oauth:${userId}`,
      JSON.stringify({
        provider: oauthUser.provider,
        providerId: oauthUser.providerId,
        avatar: oauthUser.avatar,
      })
    );
  }

  return {
    id: userId,
    email: oauthUser.email,
    name: oauthUser.name,
    role: 'member',
    created: true,
  };
}

/**
 * Handle OAuth callback
 */
export async function handleOAuthCallback(
  env: Env,
  request: Request,
  providerName: 'google' | 'github'
): Promise<{ success: boolean; user?: any; sessionId?: string; error?: string }> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return { success: false, error: `OAuth error: ${error}` };
  }

  if (!code || !state) {
    return { success: false, error: 'Missing code or state' };
  }

  // Verify state
  const stateVerification = await verifyOAuthState(env, state);
  if (!stateVerification.valid || stateVerification.provider !== providerName) {
    return { success: false, error: 'Invalid state token' };
  }

  // Get provider config
  const provider = getOAuthProvider(env, providerName);
  if (!provider) {
    return { success: false, error: 'OAuth provider not configured' };
  }

  // Get redirect URI
  const redirectBase = env.OAUTH_REDIRECT_BASE || new URL(request.url).origin;
  const redirectUri = `${redirectBase}/api/auth/oauth/${providerName}/callback`;

  try {
    // Exchange code for token
    const tokenData = await exchangeOAuthCode(provider, code, redirectUri);

    // Get user info
    const oauthUser = await getOAuthUserInfo(provider, tokenData.access_token);

    // Find or create user
    const user = await findOrCreateOAuthUser(env, oauthUser);

    // Create session
    const { createSession } = await import('./auth-enhanced');
    const { sessionId } = await createSession(env, user, request);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      sessionId,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'OAuth callback failed' };
  }
}
