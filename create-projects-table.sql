-- Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  technologies TEXT,
  logoUrl TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Create Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logoUrl TEXT,
  website TEXT,
  description TEXT,
  projectId TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_clients_projectId ON clients(projectId);
CREATE INDEX IF NOT EXISTS idx_clients_priority ON clients(priority DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
