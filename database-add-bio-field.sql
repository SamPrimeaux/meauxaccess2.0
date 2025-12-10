-- Add bio field to animals table for Southern Pets Animal Rescue

-- Add bio column (will fail silently if already exists)
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
-- Run this once, or check if column exists first

-- Check if bio column exists, if not add it
-- If you get an error that column already exists, that's fine - it means it's already there

ALTER TABLE animals ADD COLUMN bio TEXT;

-- Update existing animals to use description as bio if bio is null
UPDATE animals SET bio = description WHERE bio IS NULL AND description IS NOT NULL;
