-- Populate Projects with Client Domains
-- Run this to add all your client projects

-- Clear existing projects (optional - comment out if you want to keep existing)
-- DELETE FROM projects;
-- DELETE FROM clients;

-- Project 1: Meauxbility.org (Main Platform)
INSERT OR REPLACE INTO projects (id, name, description, status, technologies, createdAt, updatedAt)
VALUES (
  'meauxbility-org',
  'Meauxbility.org',
  'Main SaaS platform and dashboard ecosystem',
  'active',
  '["R2", "D1", "KV", "Workers", "Pages", "Images"]',
  datetime('now'),
  datetime('now')
);

-- Project 2: Inner Animal Media
INSERT OR REPLACE INTO projects (id, name, description, status, technologies, createdAt, updatedAt)
VALUES (
  'inneranimalmedia',
  'Inner Animal Media',
  'Creative production and media services platform',
  'active',
  '["R2", "D1", "Workers", "Images", "Email Routing"]',
  datetime('now'),
  datetime('now')
);

-- Project 3: iAutoDidact
INSERT OR REPLACE INTO projects (id, name, description, status, technologies, createdAt, updatedAt)
VALUES (
  'iautodidact',
  'iAutoDidact',
  'Educational platform and learning management system',
  'active',
  '["R2", "D1", "Workers", "Pages"]',
  datetime('now'),
  datetime('now')
);

-- Project 4: Meauxxx.com
INSERT OR REPLACE INTO projects (id, name, description, status, technologies, createdAt, updatedAt)
VALUES (
  'meauxxx',
  'Meauxxx.com',
  'Client project platform',
  'active',
  '["R2", "Workers", "Pages"]',
  datetime('now'),
  datetime('now')
);

-- Project 5: Southern Pets Animal Rescue
INSERT OR REPLACE INTO projects (id, name, description, status, technologies, createdAt, updatedAt)
VALUES (
  'southernpets',
  'Southern Pets Animal Rescue',
  'Nonprofit animal rescue organization website',
  'active',
  '["R2", "D1", "Workers", "Pages"]',
  datetime('now'),
  datetime('now')
);

-- Project 6: Inner Animal App
INSERT OR REPLACE INTO projects (id, name, description, status, technologies, createdAt, updatedAt)
VALUES (
  'inneranimal-app',
  'Inner Animal App',
  'Mobile and web application platform',
  'active',
  '["R2", "Workers", "Pages"]',
  datetime('now'),
  datetime('now')
);

-- Project 7: iAutoDidact App
INSERT OR REPLACE INTO projects (id, name, description, status, technologies, createdAt, updatedAt)
VALUES (
  'iautodidact-app',
  'iAutoDidact App',
  'Mobile application for learning platform',
  'active',
  '["R2", "Workers"]',
  datetime('now'),
  datetime('now')
);

-- Project 8: Inner AutoDidact
INSERT OR REPLACE INTO projects (id, name, description, status, technologies, createdAt, updatedAt)
VALUES (
  'innerautodidact',
  'Inner AutoDidact',
  'Educational services platform',
  'active',
  '["R2", "D1", "Workers"]',
  datetime('now'),
  datetime('now')
);

-- Add sample clients for each project (you can update logos later)
-- Meauxbility.org clients
INSERT OR REPLACE INTO clients (id, name, logoUrl, website, description, projectId, priority, createdAt, updatedAt)
VALUES (
  'client-meaux-1',
  'Meauxbility',
  NULL,
  'https://meauxbility.org',
  'Main platform client',
  'meauxbility-org',
  10,
  datetime('now'),
  datetime('now')
);

-- Inner Animal Media clients
INSERT OR REPLACE INTO clients (id, name, logoUrl, website, description, projectId, priority, createdAt, updatedAt)
VALUES (
  'client-iam-1',
  'Inner Animal Media',
  NULL,
  'https://inneranimalmedia.com',
  'Primary client',
  'inneranimalmedia',
  10,
  datetime('now'),
  datetime('now')
);

-- iAutoDidact clients
INSERT OR REPLACE INTO clients (id, name, logoUrl, website, description, projectId, priority, createdAt, updatedAt)
VALUES (
  'client-iautodidact-1',
  'iAutoDidact',
  NULL,
  'https://iautodidact.org',
  'Educational platform client',
  'iautodidact',
  10,
  datetime('now'),
  datetime('now')
);

INSERT OR REPLACE INTO clients (id, name, logoUrl, website, description, projectId, priority, createdAt, updatedAt)
VALUES (
  'client-iautodidact-2',
  'iAutoDidact App',
  NULL,
  'https://iautodidact.app',
  'Mobile app client',
  'iautodidact',
  9,
  datetime('now'),
  datetime('now')
);

-- Southern Pets clients
INSERT OR REPLACE INTO clients (id, name, logoUrl, website, description, projectId, priority, createdAt, updatedAt)
VALUES (
  'client-spar-1',
  'Southern Pets Animal Rescue',
  NULL,
  'https://southernpetsanimalrescue.com',
  'Nonprofit organization',
  'southernpets',
  10,
  datetime('now'),
  datetime('now')
);
