ALTER TABLE products
  ADD COLUMN IF NOT EXISTS details_section_title TEXT,
  ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '[]'::jsonb;
