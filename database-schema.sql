-- Production SaaS Database Schema
-- For D1 Database: meauxstack-saas-db

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'admin', 'developer', 'member', 'user'
  emailVerified INTEGER DEFAULT 0, -- 0 = false, 1 = true
  twoFactorEnabled INTEGER DEFAULT 0,
  twoFactorSecret TEXT,
  createdAt TEXT NOT NULL,
  lastLogin TEXT,
  loginAttempts INTEGER DEFAULT 0,
  lockedUntil TEXT,
  metadata TEXT -- JSON for additional user data
);

-- Sessions table (also stored in KV, but D1 for analytics)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  email TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  expiresAt INTEGER NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  twoFactorVerified INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verifications (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  createdAt INTEGER NOT NULL,
  expiresAt INTEGER NOT NULL,
  verified INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  createdAt INTEGER NOT NULL,
  expiresAt INTEGER NOT NULL,
  used INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 2FA backup codes
CREATE TABLE IF NOT EXISTS two_factor_backup_codes (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  code TEXT NOT NULL,
  used INTEGER DEFAULT 0,
  createdAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- API keys for service accounts
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  keyHash TEXT NOT NULL,
  lastUsed TEXT,
  createdAt TEXT NOT NULL,
  expiresAt TEXT,
  revoked INTEGER DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Audit log for security events
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  userId TEXT,
  action TEXT NOT NULL, -- 'login', 'logout', 'password_change', '2fa_enabled', etc.
  ipAddress TEXT,
  userAgent TEXT,
  metadata TEXT, -- JSON for additional data
  createdAt INTEGER NOT NULL
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  userId TEXT PRIMARY KEY,
  theme TEXT DEFAULT 'light', -- 'light', 'dark', 'auto'
  notifications INTEGER DEFAULT 1,
  emailNotifications INTEGER DEFAULT 1,
  preferences TEXT, -- JSON for additional preferences
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'archived'
  technologies TEXT, -- JSON array of technologies
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Clients table (for project clients with logos)
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logoUrl TEXT, -- URL to client logo (R2, Cloudflare Images, or external)
  website TEXT,
  description TEXT,
  projectId TEXT NOT NULL,
  priority INTEGER DEFAULT 0, -- Higher = more prominent (top clients)
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
);

-- Indexes for clients
CREATE INDEX IF NOT EXISTS idx_clients_projectId ON clients(projectId);
CREATE INDEX IF NOT EXISTS idx_clients_priority ON clients(priority DESC);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_userId ON sessions(userId);
CREATE INDEX IF NOT EXISTS idx_sessions_expiresAt ON sessions(expiresAt);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_audit_logs_userId ON audit_logs(userId);
CREATE INDEX IF NOT EXISTS idx_audit_logs_createdAt ON audit_logs(createdAt);
