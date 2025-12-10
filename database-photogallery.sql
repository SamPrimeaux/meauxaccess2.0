-- Photo Gallery CMS Database Schema
-- Run this to create the photos table for the gallery CMS

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  alt TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnailUrl TEXT,
  tags TEXT, -- JSON array
  category TEXT,
  keywords TEXT, -- JSON array
  metaDescription TEXT,
  uploadedAt TEXT NOT NULL,
  fileSize INTEGER,
  width INTEGER,
  height INTEGER,
  mimeType TEXT,
  seoScore INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_uploadedAt ON photos(uploadedAt DESC);
CREATE INDEX IF NOT EXISTS idx_photos_seoScore ON photos(seoScore DESC);

-- Full-text search index (if supported)
-- CREATE VIRTUAL TABLE IF NOT EXISTS photos_fts USING fts5(title, description, alt, content=photos);
