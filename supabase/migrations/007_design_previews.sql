-- Shareable full-page design mockups for client review
CREATE TABLE IF NOT EXISTS design_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_name TEXT NOT NULL DEFAULT '',
  share_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live')),
  site_url TEXT NOT NULL DEFAULT '',
  show_browser_chrome BOOLEAN NOT NULL DEFAULT FALSE,
  pages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_design_previews_share_token
  ON design_previews (share_token);
CREATE INDEX IF NOT EXISTS idx_design_previews_status
  ON design_previews (status);
