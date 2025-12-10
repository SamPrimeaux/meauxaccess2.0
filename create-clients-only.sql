-- Step 2: Create Clients Table (after projects exists)
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

CREATE INDEX IF NOT EXISTS idx_clients_projectId ON clients(projectId);
CREATE INDEX IF NOT EXISTS idx_clients_priority ON clients(priority DESC);
