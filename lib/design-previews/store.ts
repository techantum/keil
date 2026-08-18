import { randomBytes, randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { query, checkDatabaseConnection } from "@/lib/db/postgres";
import { makeLandingSlug } from "@/lib/landing-pages/slug";
import type {
  CreateDesignPreviewInput,
  DesignPreview,
  DesignPreviewPage,
  UpdateDesignPreviewInput,
} from "@/types/design-preview";

const FILE_STORE = path.join(process.cwd(), "data", "design-previews.json");

type Row = {
  id: string;
  title: string;
  client_name: string;
  share_token: string;
  status: "draft" | "live";
  site_url: string;
  show_browser_chrome: boolean;
  pages: DesignPreviewPage[] | string;
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

function iso(value: Date | string): string {
  return typeof value === "string" ? value : value.toISOString();
}

function mapRow(row: Row): DesignPreview {
  return {
    id: row.id,
    title: row.title,
    clientName: row.client_name || "",
    shareToken: row.share_token,
    status: row.status === "live" ? "live" : "draft",
    siteUrl: row.site_url || "",
    showBrowserChrome: Boolean(row.show_browser_chrome),
    pages: parseJson(row.pages, []),
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

export function makeShareToken(): string {
  return randomBytes(12).toString("base64url");
}

export function makePageSlug(input: string): string {
  return makeLandingSlug(input || "page");
}

export function newPreviewPage(partial?: Partial<DesignPreviewPage>): DesignPreviewPage {
  const label = (partial?.label || "Home").trim() || "Home";
  return {
    id: partial?.id || randomUUID(),
    label,
    slug: makePageSlug(partial?.slug || label),
    image: partial?.image || "",
  };
}

async function ensureFileStore(): Promise<DesignPreview[]> {
  try {
    const raw = await fs.readFile(FILE_STORE, "utf8");
    return JSON.parse(raw) as DesignPreview[];
  } catch {
    await fs.mkdir(path.dirname(FILE_STORE), { recursive: true });
    await fs.writeFile(FILE_STORE, "[]", "utf8");
    return [];
  }
}

async function writeFileStore(items: DesignPreview[]) {
  await fs.mkdir(path.dirname(FILE_STORE), { recursive: true });
  await fs.writeFile(FILE_STORE, JSON.stringify(items, null, 2), "utf8");
}

async function usePostgres(): Promise<boolean> {
  if (process.env.USE_POSTGRES !== "true" && !process.env.DATABASE_URL) {
    return false;
  }
  return checkDatabaseConnection();
}

export async function listDesignPreviews(): Promise<DesignPreview[]> {
  if (await usePostgres()) {
    try {
      const result = await query<Row>(
        `SELECT * FROM design_previews ORDER BY updated_at DESC`,
      );
      return result.rows.map(mapRow);
    } catch (error) {
      console.error("listDesignPreviews postgres error:", error);
    }
  }
  return ensureFileStore();
}

export async function getDesignPreviewById(id: string): Promise<DesignPreview | null> {
  if (await usePostgres()) {
    try {
      const result = await query<Row>(`SELECT * FROM design_previews WHERE id = $1`, [id]);
      return result.rows[0] ? mapRow(result.rows[0]) : null;
    } catch (error) {
      console.error("getDesignPreviewById postgres error:", error);
    }
  }
  const items = await ensureFileStore();
  return items.find((item) => item.id === id) || null;
}

export async function getDesignPreviewByToken(
  token: string,
): Promise<DesignPreview | null> {
  if (!token) return null;
  if (await usePostgres()) {
    try {
      const result = await query<Row>(
        `SELECT * FROM design_previews WHERE share_token = $1`,
        [token],
      );
      return result.rows[0] ? mapRow(result.rows[0]) : null;
    } catch (error) {
      console.error("getDesignPreviewByToken postgres error:", error);
    }
  }
  const items = await ensureFileStore();
  return items.find((item) => item.shareToken === token) || null;
}

export async function createDesignPreview(
  input: CreateDesignPreviewInput,
): Promise<DesignPreview> {
  const now = new Date().toISOString();
  const pages =
    input.pages && input.pages.length > 0
      ? input.pages.map((page) => newPreviewPage(page))
      : [newPreviewPage({ label: "Home", image: "" })];

  const preview: DesignPreview = {
    id: randomUUID(),
    title: input.title.trim(),
    clientName: (input.clientName || "").trim(),
    shareToken: makeShareToken(),
    status: input.status === "live" ? "live" : "draft",
    siteUrl: (input.siteUrl || "").trim(),
    showBrowserChrome: Boolean(input.showBrowserChrome),
    pages,
    createdAt: now,
    updatedAt: now,
  };

  if (await usePostgres()) {
    try {
      const result = await query<Row>(
        `INSERT INTO design_previews
           (id, title, client_name, share_token, status, site_url, show_browser_chrome, pages, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10)
         RETURNING *`,
        [
          preview.id,
          preview.title,
          preview.clientName,
          preview.shareToken,
          preview.status,
          preview.siteUrl,
          preview.showBrowserChrome,
          JSON.stringify(preview.pages),
          preview.createdAt,
          preview.updatedAt,
        ],
      );
      return mapRow(result.rows[0]);
    } catch (error) {
      console.error("createDesignPreview postgres error:", error);
    }
  }

  const items = await ensureFileStore();
  items.unshift(preview);
  await writeFileStore(items);
  return preview;
}

export async function updateDesignPreview(
  id: string,
  input: UpdateDesignPreviewInput,
): Promise<DesignPreview | null> {
  const existing = await getDesignPreviewById(id);
  if (!existing) return null;

  const updated: DesignPreview = {
    ...existing,
    title: input.title?.trim() ?? existing.title,
    clientName:
      input.clientName !== undefined ? input.clientName.trim() : existing.clientName,
    siteUrl: input.siteUrl !== undefined ? input.siteUrl.trim() : existing.siteUrl,
    showBrowserChrome:
      input.showBrowserChrome !== undefined
        ? input.showBrowserChrome
        : existing.showBrowserChrome,
    pages: input.pages
      ? input.pages.map((page) => newPreviewPage(page))
      : existing.pages,
    status: input.status ?? existing.status,
    shareToken: input.shareToken || existing.shareToken,
    updatedAt: new Date().toISOString(),
  };

  if (await usePostgres()) {
    try {
      const result = await query<Row>(
        `UPDATE design_previews
         SET title = $2, client_name = $3, share_token = $4, status = $5,
             site_url = $6, show_browser_chrome = $7, pages = $8::jsonb, updated_at = $9
         WHERE id = $1
         RETURNING *`,
        [
          id,
          updated.title,
          updated.clientName,
          updated.shareToken,
          updated.status,
          updated.siteUrl,
          updated.showBrowserChrome,
          JSON.stringify(updated.pages),
          updated.updatedAt,
        ],
      );
      return result.rows[0] ? mapRow(result.rows[0]) : null;
    } catch (error) {
      console.error("updateDesignPreview postgres error:", error);
    }
  }

  const items = await ensureFileStore();
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  items[index] = updated;
  await writeFileStore(items);
  return updated;
}

export async function deleteDesignPreview(id: string): Promise<boolean> {
  if (await usePostgres()) {
    try {
      const result = await query(`DELETE FROM design_previews WHERE id = $1`, [id]);
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error("deleteDesignPreview postgres error:", error);
    }
  }

  const items = await ensureFileStore();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeFileStore(next);
  return true;
}
