-- Migration: Update users table for enhanced auth
-- Run this if users table already exists with old schema

-- Check if passwordHash column exists, if not add it
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- So we'll use a different approach

-- Drop and recreate users table with new schema
DROP TABLE IF EXISTS users;

CREATE TABLE users (
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

-- Recreate index
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
