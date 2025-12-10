-- Southern Pets Animal Rescue Gallery Database Schema

-- Animal Images Table
CREATE TABLE IF NOT EXISTS animal_images (
  id TEXT PRIMARY KEY,
  animalId TEXT,
  animalName TEXT,
  filename TEXT NOT NULL,
  title TEXT,
  description TEXT,
  url TEXT NOT NULL,
  thumbnailUrl TEXT,
  uploadedAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  fileSize INTEGER,
  width INTEGER,
  height INTEGER,
  mimeType TEXT,
  isPrimary INTEGER DEFAULT 0,
  metadata TEXT -- JSON string
);

CREATE INDEX IF NOT EXISTS idx_animal_images_animalId ON animal_images(animalId);
CREATE INDEX IF NOT EXISTS idx_animal_images_uploadedAt ON animal_images(uploadedAt);
CREATE INDEX IF NOT EXISTS idx_animal_images_isPrimary ON animal_images(isPrimary);

-- Trashbin Table for Soft Deletes (14-day retention)
CREATE TABLE IF NOT EXISTS trashbin_southernpets (
  id TEXT PRIMARY KEY,
  originalId TEXT NOT NULL,
  originalData TEXT NOT NULL, -- JSON string of AnimalImage
  deletedAt TEXT NOT NULL DEFAULT (datetime('now')),
  expiresAt TEXT NOT NULL DEFAULT (datetime('now', '+14 days')),
  originalBucket TEXT NOT NULL,
  originalPath TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trashbin_deletedAt ON trashbin_southernpets(deletedAt);
CREATE INDEX IF NOT EXISTS idx_trashbin_expiresAt ON trashbin_southernpets(expiresAt);
CREATE INDEX IF NOT EXISTS idx_trashbin_originalId ON trashbin_southernpets(originalId);
