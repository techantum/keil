import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const pages = JSON.parse(
  readFileSync(join(process.cwd(), "data", "landing-pages.json"), "utf8"),
);

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return `${sqlString(JSON.stringify(value ?? null))}::jsonb`;
}

const statements = [];
for (const p of pages) {
  const seo = { ...(p.seo || {}), branding: p.branding || {} };
  const redirect = p.redirect || { mode: "all_pages_active", paths: [] };
  statements.push(`
INSERT INTO landing_pages (id, title, slug, status, design_image, sections, seo, redirect, created_at, updated_at)
VALUES (
  ${sqlString(p.id)}::uuid,
  ${sqlString(p.title)},
  ${sqlString(p.slug)},
  ${sqlString(p.status)},
  ${sqlString(p.designImage || "")},
  ${sqlJson(p.sections || [])},
  ${sqlJson(seo)},
  ${sqlJson(redirect)},
  ${sqlString(p.createdAt || new Date().toISOString())}::timestamptz,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  status = EXCLUDED.status,
  design_image = EXCLUDED.design_image,
  sections = EXCLUDED.sections,
  seo = EXCLUDED.seo,
  redirect = EXCLUDED.redirect,
  updated_at = NOW();
`);
}

statements.push(
  `SELECT slug, status, jsonb_array_length(sections) AS sections FROM landing_pages;`,
);

const out = join(process.cwd(), "scripts", "_seed-landing.sql");
writeFileSync(out, statements.join("\n"), "utf8");
console.log(`Wrote ${out}`);
