-- Projects and Clients Tables
-- Run this after the main schema

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'archived'
  technologies TEXT, -- JSON array of technologies
  logoUrl TEXT, -- Project logo URL
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

-- Index for projects
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_createdAt ON projects(createdAt DESC);
