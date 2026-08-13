import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { query, checkDatabaseConnection } from "@/lib/db/postgres";
import type {
  CreateLandingPageInput,
  LandingPage,
  LandingPageBranding,
  LandingPageSeo,
  LandingSection,
  UpdateLandingPageInput,
} from "@/types/landing-page";
import {
  DEFAULT_LANDING_BRANDING,
  DEFAULT_LANDING_REDIRECT,
} from "@/types/landing-page";
import { buildRedirectRules } from "@/lib/landing-pages/nav";

const FILE_STORE = path.join(process.cwd(), "data", "landing-pages.json");
const RULES_STORE = path.join(process.cwd(), "data", "landing-redirects.json");

type Row = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  design_image: string;
  sections: LandingSection[] | string;
  seo: LandingPage["seo"] | string;
  branding?: LandingPageBranding | string;
  redirect?: LandingPage["redirect"] | string;
  created_at: Date | string;
  updated_at: Date | string;
};

function parseJson<T>(value: T | string | undefined | null, fallback: T): T {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

/** Branding may live in its own column or nested under seo (no migration required). */
function extractSeoAndBranding(
  seoRaw: unknown,
  brandingRaw?: unknown,
): { seo: LandingPageSeo; branding: LandingPageBranding } {
  const parsed = parseJson<LandingPageSeo & { branding?: LandingPageBranding }>(
    seoRaw as LandingPageSeo,
    {},
  );
  const nested = parsed.branding;
  const { branding: _omit, ...seo } = parsed as LandingPageSeo & {
    branding?: LandingPageBranding;
  };
  const fromColumn = brandingRaw
    ? parseJson<LandingPageBranding>(brandingRaw as LandingPageBranding, {})
    : {};
  const branding: LandingPageBranding = {
    ...DEFAULT_LANDING_BRANDING,
    ...nested,
    ...fromColumn,
  };
  return { seo, branding };
}

function packSeoForStorage(seo: LandingPageSeo, branding: LandingPageBranding) {
  return { ...seo, branding };
}

function normalizePage(page: LandingPage): LandingPage {
  return {
    ...page,
    redirect: page.redirect || DEFAULT_LANDING_REDIRECT,
    branding: { ...DEFAULT_LANDING_BRANDING, ...(page.branding || {}) },
    seo: page.seo || {},
  };
}

function mapRow(row: Row): LandingPage {
  const { seo, branding } = extractSeoAndBranding(row.seo, row.branding);
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status,
    designImage: row.design_image || "",
    sections: parseJson(row.sections, []),
    seo,
    branding,
    redirect: parseJson(row.redirect, DEFAULT_LANDING_REDIRECT),
    createdAt:
      typeof row.created_at === "string"
        ? row.created_at
        : row.created_at.toISOString(),
    updatedAt:
      typeof row.updated_at === "string"
        ? row.updated_at
        : row.updated_at.toISOString(),
  };
}

async function ensureFileStore(): Promise<LandingPage[]> {
  try {
    const raw = await fs.readFile(FILE_STORE, "utf8");
    const pages = JSON.parse(raw) as LandingPage[];
    return pages.map((p) => {
      const fromSeo = (p.seo as LandingPageSeo & { branding?: LandingPageBranding })
        ?.branding;
      const { branding: _b, ...seoRest } = (p.seo || {}) as LandingPageSeo & {
        branding?: LandingPageBranding;
      };
      return normalizePage({
        ...p,
        seo: seoRest,
        branding: p.branding || fromSeo || DEFAULT_LANDING_BRANDING,
      });
    });
  } catch {
    await fs.mkdir(path.dirname(FILE_STORE), { recursive: true });
    await fs.writeFile(FILE_STORE, "[]", "utf8");
    return [];
  }
}

async function writeFileStore(pages: LandingPage[]) {
  await fs.mkdir(path.dirname(FILE_STORE), { recursive: true });
  await fs.writeFile(FILE_STORE, JSON.stringify(pages, null, 2), "utf8");
  await syncRedirectRulesFile(pages);
}

export async function syncRedirectRulesFile(pages?: LandingPage[]) {
  const all = pages || (await listLandingPages());
  const rules = buildRedirectRules(all);
  await fs.mkdir(path.dirname(RULES_STORE), { recursive: true });
  await fs.writeFile(RULES_STORE, JSON.stringify(rules), "utf8");
  return rules;
}

export async function readRedirectRulesFile() {
  try {
    const raw = await fs.readFile(RULES_STORE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function usePostgres(): Promise<boolean> {
  if (process.env.USE_POSTGRES !== "true" && !process.env.DATABASE_URL) {
    return false;
  }
  return checkDatabaseConnection();
}

export function makeLandingSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "landing-page"
  );
}

function slugify(input: string): string {
  return makeLandingSlug(input);
}

export async function listLandingPages(): Promise<LandingPage[]> {
  if (await usePostgres()) {
    try {
      const result = await query<Row>(
        `SELECT * FROM landing_pages ORDER BY updated_at DESC`,
      );
      return result.rows.map(mapRow);
    } catch (error) {
      console.error("listLandingPages postgres error:", error);
    }
  }
  return ensureFileStore();
}

export async function getLandingPageById(id: string): Promise<LandingPage | null> {
  if (await usePostgres()) {
    try {
      const result = await query<Row>(`SELECT * FROM landing_pages WHERE id = $1`, [id]);
      return result.rows[0] ? mapRow(result.rows[0]) : null;
    } catch (error) {
      console.error("getLandingPageById postgres error:", error);
    }
  }
  const pages = await ensureFileStore();
  return pages.find((p) => p.id === id) || null;
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  if (await usePostgres()) {
    try {
      const result = await query<Row>(`SELECT * FROM landing_pages WHERE slug = $1`, [slug]);
      return result.rows[0] ? mapRow(result.rows[0]) : null;
    } catch (error) {
      console.error("getLandingPageBySlug postgres error:", error);
    }
  }
  const pages = await ensureFileStore();
  return pages.find((p) => p.slug === slug) || null;
}

export async function createLandingPage(
  input: CreateLandingPageInput,
): Promise<LandingPage> {
  const now = new Date().toISOString();
  const page: LandingPage = {
    id: randomUUID(),
    title: input.title.trim(),
    slug: slugify(input.slug || input.title),
    status: input.status || "draft",
    designImage: input.designImage,
    sections: input.sections,
    seo: input.seo || { title: input.title, description: "" },
    branding: { ...DEFAULT_LANDING_BRANDING, ...(input.branding || {}) },
    redirect: input.redirect || DEFAULT_LANDING_REDIRECT,
    createdAt: now,
    updatedAt: now,
  };

  if (await usePostgres()) {
    try {
      const result = await query<Row>(
        `INSERT INTO landing_pages (id, title, slug, status, design_image, sections, seo, redirect, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9, $10)
         RETURNING *`,
        [
          page.id,
          page.title,
          page.slug,
          page.status,
          page.designImage,
          JSON.stringify(page.sections),
          JSON.stringify(packSeoForStorage(page.seo, page.branding)),
          JSON.stringify(page.redirect),
          page.createdAt,
          page.updatedAt,
        ],
      );
      const mapped = mapRow(result.rows[0]);
      await syncRedirectRulesFile();
      return mapped;
    } catch (error) {
      console.error("createLandingPage postgres error:", error);
    }
  }

  const pages = await ensureFileStore();
  if (pages.some((p) => p.slug === page.slug)) {
    page.slug = `${page.slug}-${Date.now().toString(36)}`;
  }
  pages.unshift(page);
  await writeFileStore(pages);
  return page;
}

export async function updateLandingPage(
  id: string,
  input: UpdateLandingPageInput,
): Promise<LandingPage | null> {
  const existing = await getLandingPageById(id);
  if (!existing) return null;

  const updated: LandingPage = {
    ...existing,
    title: input.title?.trim() ?? existing.title,
    slug: input.slug ? slugify(input.slug) : existing.slug,
    status: input.status ?? existing.status,
    designImage: input.designImage ?? existing.designImage,
    sections: input.sections ?? existing.sections,
    seo: input.seo ?? existing.seo,
    branding: input.branding
      ? { ...DEFAULT_LANDING_BRANDING, ...input.branding }
      : existing.branding || DEFAULT_LANDING_BRANDING,
    redirect: input.redirect ?? existing.redirect ?? DEFAULT_LANDING_REDIRECT,
    updatedAt: new Date().toISOString(),
  };

  if (await usePostgres()) {
    try {
      const result = await query<Row>(
        `UPDATE landing_pages
         SET title = $2, slug = $3, status = $4, design_image = $5,
             sections = $6::jsonb, seo = $7::jsonb, redirect = $8::jsonb, updated_at = $9
         WHERE id = $1
         RETURNING *`,
        [
          id,
          updated.title,
          updated.slug,
          updated.status,
          updated.designImage,
          JSON.stringify(updated.sections),
          JSON.stringify(packSeoForStorage(updated.seo, updated.branding)),
          JSON.stringify(updated.redirect),
          updated.updatedAt,
        ],
      );
      const mapped = result.rows[0] ? mapRow(result.rows[0]) : null;
      await syncRedirectRulesFile();
      return mapped;
    } catch (error) {
      console.error("updateLandingPage postgres error:", error);
    }
  }

  const pages = await ensureFileStore();
  const index = pages.findIndex((p) => p.id === id);
  if (index < 0) return null;
  pages[index] = updated;
  await writeFileStore(pages);
  return updated;
}

export async function deleteLandingPage(id: string): Promise<boolean> {
  if (await usePostgres()) {
    try {
      const result = await query(`DELETE FROM landing_pages WHERE id = $1`, [id]);
      const ok = (result.rowCount || 0) > 0;
      if (ok) await syncRedirectRulesFile();
      return ok;
    } catch (error) {
      console.error("deleteLandingPage postgres error:", error);
    }
  }

  const pages = await ensureFileStore();
  const next = pages.filter((p) => p.id !== id);
  if (next.length === pages.length) return false;
  await writeFileStore(next);
  return true;
}
