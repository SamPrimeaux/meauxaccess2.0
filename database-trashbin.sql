-- Trash bin table for deleted photos
CREATE TABLE IF NOT EXISTS trashbin (
  id TEXT PRIMARY KEY,
  originalId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  alt TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnailUrl TEXT,
  tags TEXT,
  category TEXT,
  keywords TEXT,
  metaDescription TEXT,
  uploadedAt TEXT NOT NULL,
  deletedAt TEXT NOT NULL DEFAULT (datetime('now')),
  fileSize INTEGER,
  width INTEGER,
  height INTEGER,
  mimeType TEXT,
  seoScore INTEGER,
  imageId TEXT,
  variant TEXT,
  originalBucket TEXT,
  originalPath TEXT,
  expiresAt TEXT NOT NULL DEFAULT (datetime('now', '+14 days'))
);

CREATE INDEX IF NOT EXISTS idx_trashbin_deletedAt ON trashbin(deletedAt);
CREATE INDEX IF NOT EXISTS idx_trashbin_expiresAt ON trashbin(expiresAt);
CREATE INDEX IF NOT EXISTS idx_trashbin_originalId ON trashbin(originalId);
