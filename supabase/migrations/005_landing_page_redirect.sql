-- Redirect config for landing pages (mode + paths)
ALTER TABLE landing_pages
  ADD COLUMN IF NOT EXISTS redirect JSONB NOT NULL DEFAULT '{"mode":"all_pages_active","paths":[]}'::jsonb;
