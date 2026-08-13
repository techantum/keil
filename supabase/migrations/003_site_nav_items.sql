CREATE TABLE IF NOT EXISTS site_nav_items (
  nav_key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  slug TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_nav_items (nav_key, label, slug, enabled, sort_order) VALUES
  ('home', 'Home', '/', TRUE, 0),
  ('about', 'About Us', '/about', TRUE, 1),
  ('services', 'Services', '/services', TRUE, 2),
  ('products', 'Products', '/products', TRUE, 3),
  ('gallery', 'Gallery', '/gallery', TRUE, 4),
  ('clients', 'Clients', '/clients', TRUE, 5),
  ('testimonials', 'Testimonials', '/testimonials', TRUE, 6),
  ('contact', 'Contact Us', '/contact', TRUE, 7)
ON CONFLICT (nav_key) DO NOTHING;
