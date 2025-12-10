/**
 * User Preferences System
 * Manages user-specific R2 buckets, local/remote settings, and deployment preferences
 */

export interface UserPreferences {
  email: string;
  name: string;
  preferredR2Bucket: string; // R2 bucket binding name (e.g., "R2_SAM", "R2_CONNOR")
  preferredR2BucketName: string; // Actual bucket name (e.g., "samicloudbackups", "connor-mcneely")
  storageMode: 'local' | 'remote' | 'both'; // Development storage preference
  deploymentMode: 'local' | 'remote' | 'both'; // Deployment preference
  sandboxAccess: boolean; // Access to Sandbox environment
  theme?: 'light' | 'dark' | 'customize'; // Theme preference for MeauxLearn
  createdAt: string;
  updatedAt: string;
}

// Default user preferences
export const DEFAULT_USER_PREFERENCES: Record<string, Omit<UserPreferences, 'email' | 'createdAt' | 'updatedAt'>> = {
  'sam@meauxbility.org': {
    name: 'Sam Primeaux',
    preferredR2Bucket: 'R2_SAMI_BACKUPS',
    preferredR2BucketName: 'samicloudbackups',
    storageMode: 'both',
    deploymentMode: 'both',
    sandboxAccess: true,
    updatedAt: new Date().toISOString(),
  },
  'connor@meauxbility.org': {
    name: 'Connor',
    preferredR2Bucket: 'R2_CONNOR',
    preferredR2BucketName: 'connor-mcneely',
    storageMode: 'both',
    deploymentMode: 'both',
    sandboxAccess: true,
    updatedAt: new Date().toISOString(),
  },
  'fred@meauxbility.org': {
    name: 'Fred',
    preferredR2Bucket: 'R2_FRED',
    preferredR2BucketName: 'fred-williams',
    storageMode: 'both',
    deploymentMode: 'both',
    sandboxAccess: false,
    updatedAt: new Date().toISOString(),
  },
  'amber@meauxbility.org': {
    name: 'Amber',
    preferredR2Bucket: 'R2_AMBER',
    preferredR2BucketName: 'amber-nicole',
    storageMode: 'both',
    deploymentMode: 'both',
    sandboxAccess: false,
    updatedAt: new Date().toISOString(),
  },
  'info@inneranimals.com': {
    name: 'Inner Animals Info',
    preferredR2Bucket: 'R2_ASSETS',
    preferredR2BucketName: 'inneranimalmedia-assets',
    storageMode: 'both',
    deploymentMode: 'both',
    sandboxAccess: true,
    updatedAt: new Date().toISOString(),
  },
  'meauxbility@gmail.com': {
    name: 'Meauxbility Gmail',
    preferredR2Bucket: 'R2_WEBSITE',
    preferredR2BucketName: 'meauxbilityorgfinal',
    storageMode: 'both',
    deploymentMode: 'both',
    sandboxAccess: true,
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Get user preferences
 */
export async function getUserPreferences(
  env: { KV_USERS?: KVNamespace },
  email: string
): Promise<UserPreferences | null> {
  if (!env.KV_USERS) return null;

  const stored = await env.KV_USERS.get(`preferences:${email.toLowerCase()}`, 'json');
  if (stored) {
    return stored as UserPreferences;
  }

  // Return default if exists
  const defaults = DEFAULT_USER_PREFERENCES[email.toLowerCase()];
  if (defaults) {
    const prefs: UserPreferences = {
      email: email.toLowerCase(),
      ...defaults,
      createdAt: new Date().toISOString(),
    };
    // Save defaults
    await setUserPreferences(env, prefs);
    return prefs;
  }

  return null;
}

/**
 * Set user preferences
 */
export async function setUserPreferences(
  env: { KV_USERS?: KVNamespace },
  preferences: UserPreferences
): Promise<void> {
  if (!env.KV_USERS) return;

  const updated = {
    ...preferences,
    updatedAt: new Date().toISOString(),
  };

  await env.KV_USERS.put(
    `preferences:${preferences.email.toLowerCase()}`,
    JSON.stringify(updated)
  );
}

/**
 * Get all user preferences for deployment confirmation
 */
export async function getAllUserPreferences(
  env: { KV_USERS?: KVNamespace }
): Promise<UserPreferences[]> {
  const users: UserPreferences[] = [];

  // Get all users from defaults
  for (const [email, defaults] of Object.entries(DEFAULT_USER_PREFERENCES)) {
    const prefs = await getUserPreferences(env, email);
    if (prefs) {
      users.push(prefs);
    }
  }

  return users;
}

/**
 * Get user's R2 bucket
 */
export async function getUserR2Bucket(
  env: any,
  email: string
): Promise<R2Bucket | null> {
  const prefs = await getUserPreferences(env, email);
  if (!prefs) return null;

  const binding = prefs.preferredR2Bucket;
  if (!binding) return null;

  // Get R2 bucket from env
  const bucket = env[binding];
  // Check if it's an R2Bucket using duck typing (R2Bucket is not a constructor in Workers)
  if (bucket && typeof bucket === 'object' &&
    typeof bucket.list === 'function' &&
    typeof bucket.get === 'function' &&
    typeof bucket.put === 'function') {
    return bucket as R2Bucket;
  }

  return null;
}

/**
 * Get deployment confirmation data
 */
export async function getDeploymentConfirmation(
  env: { KV_USERS?: KVNamespace }
): Promise<{
  users: Array<{
    email: string;
    name: string;
    preferredR2Bucket: string;
    preferredR2BucketName: string;
    storageMode: string;
    deploymentMode: string;
  }>;
  timestamp: string;
}> {
  const users = await getAllUserPreferences(env);

  return {
    users: users.map(u => ({
      email: u.email,
      name: u.name,
      preferredR2Bucket: u.preferredR2Bucket,
      preferredR2BucketName: u.preferredR2BucketName,
      storageMode: u.storageMode,
      deploymentMode: u.deploymentMode,
    })),
    timestamp: new Date().toISOString(),
  };
}
