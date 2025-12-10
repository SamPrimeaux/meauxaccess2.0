-- Email Templates Table for Southern Pets Animal Rescue
-- Stores customizable email templates with photo gallery support

CREATE TABLE IF NOT EXISTS email_templates (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  variables TEXT,
  updatedAt TEXT NOT NULL,
  updatedBy TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(type);
CREATE INDEX IF NOT EXISTS idx_email_templates_updatedAt ON email_templates(updatedAt);
