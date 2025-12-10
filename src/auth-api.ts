/**
 * Authentication API Endpoints
 * Handles signup, login, 2FA, password reset, etc.
 */

import {
  createUser,
  getUserByEmail,
  verifyPassword,
  createSession,
  verifySession,
  deleteSession,
  getSessionId,
  generate2FASecret,
  generateTOTP,
  verifyTOTP,
  isAccountLocked,
  incrementLoginAttempts,
  resetLoginAttempts,
  hashPassword,
} from './auth-enhanced';

export interface Env {
  DB?: D1Database;
  SAAS_DB?: D1Database; // Alias for DB
  KV_SESSIONS?: KVNamespace;
  KV_CONFIG?: KVNamespace;
  RESEND_API_KEY?: string;
}

/**
 * Handle user signup
 */
export async function handleSignup(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // Validation
    if (!email || !name || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email, name, and password are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Password strength check
    if (password.length < 8) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Password must be at least 8 characters'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create user
    const result = await createUser(env, { email, name, password });

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || 'Failed to create user'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'User created. Please check your email to verify your account.',
      user: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.name,
      }
    }), {
      status: 201,
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
 * Handle user login
 */
export async function handleLogin(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password, twoFactorCode } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email and password are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user
    const user = await getUserByEmail(env, email);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email or password'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if account is locked
    if (isAccountLocked(user)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Account is locked. Please try again later.'
      }), {
        status: 423,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      await incrementLoginAttempts(env, user.id);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email or password'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check email verification
    if (!user.emailVerified) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Please verify your email before logging in',
        requiresVerification: true
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Two-factor authentication code required',
          requires2FA: true
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!user.twoFactorSecret) {
        return new Response(JSON.stringify({
          success: false,
          error: '2FA not properly configured'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const totpValid = verifyTOTP(user.twoFactorSecret, twoFactorCode);
      if (!totpValid) {
        await incrementLoginAttempts(env, user.id);
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid two-factor authentication code'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Reset login attempts on successful login
    await resetLoginAttempts(env, user.id);

    // Create session
    const { sessionId, expiresAt } = await createSession(env, user, request);

    // Update last login
    const db = env.DB || env.SAAS_DB;
    if (db) {
      await db.prepare(
        'UPDATE users SET lastLogin = ? WHERE id = ?'
      ).bind(new Date().toISOString(), user.id).run();
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `meaux_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
      },
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
 * Handle logout
 */
export async function handleLogout(request: Request, env: Env): Promise<Response> {
  const sessionId = getSessionId(request);

  if (sessionId) {
    await deleteSession(env, sessionId);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'meaux_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

/**
 * Get current user
 */
export async function handleGetMe(request: Request, env: Env): Promise<Response> {
  const auth = await verifySession(env, request);

  if (!auth.authenticated || !auth.user) {
    return new Response(JSON.stringify({
      authenticated: false
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get full user data
  const user = await getUserByEmail(env, auth.user.email);
  if (!user) {
    return new Response(JSON.stringify({
      authenticated: false,
      error: 'User not found'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    }
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Enable 2FA
 */
export async function handleEnable2FA(request: Request, env: Env): Promise<Response> {
  const auth = await verifySession(env, request);

  if (!auth.authenticated || !auth.user) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Not authenticated'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await getUserByEmail(env, auth.user.email);
  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: 'User not found'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Generate 2FA secret
  const secret = generate2FASecret();
  const qrCodeUrl = `otpauth://totp/Meauxbility:${user.email}?secret=${secret}&issuer=Meauxbility`;

  // Store secret temporarily (user needs to verify before enabling)
  if (env.KV_CONFIG) {
    await env.KV_CONFIG.put(
      `2fa_setup:${user.id}`,
      JSON.stringify({ secret, createdAt: Date.now() }),
      { expirationTtl: 600 } // 10 minutes
    );
  }

  return new Response(JSON.stringify({
    success: true,
    secret,
    qrCodeUrl,
    message: 'Scan QR code with authenticator app, then verify with a code'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Verify and enable 2FA
 */
export async function handleVerify2FA(request: Request, env: Env): Promise<Response> {
  const auth = await verifySession(env, request);

  if (!auth.authenticated || !auth.user) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Not authenticated'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json();
  const { code } = body;

  if (!code) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Code is required'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await getUserByEmail(env, auth.user.email);
  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      error: 'User not found'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get temporary secret
  if (!env.KV_CONFIG) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Configuration not available'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const setupData = await env.KV_CONFIG.get(`2fa_setup:${user.id}`, 'json');
  if (!setupData) {
    return new Response(JSON.stringify({
      success: false,
      error: '2FA setup expired. Please start over.'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify code
  const valid = verifyTOTP(setupData.secret, code);
  if (!valid) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid code'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Enable 2FA
  const db = env.DB || env.SAAS_DB;
  if (db) {
    await db.prepare(
      'UPDATE users SET twoFactorEnabled = 1, twoFactorSecret = ? WHERE id = ?'
    ).bind(setupData.secret, user.id).run();
  }

  // Clear temporary setup
  await env.KV_CONFIG.delete(`2fa_setup:${user.id}`);

  return new Response(JSON.stringify({
    success: true,
    message: '2FA enabled successfully'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
