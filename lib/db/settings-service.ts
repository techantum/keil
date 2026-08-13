import { query } from "@/lib/db/postgres";
import { defaultSettingsData } from "@/lib/db/default-settings";
import {
  buildDefaultSettings,
  DB_SETUP_HINT,
  isDbConnectionError,
} from "@/lib/db/db-error";
import type { Settings } from "@/types";

type SettingsRow = {
  id: string;
  seo: Settings["seo"];
  branding: Settings["branding"];
  company: Settings["company"];
  page_heroes: Settings["pageHeroes"];
  analytics?: { googleAnalyticsId?: string; enabled?: boolean };
  updated_at: Date;
};

function rowToSettings(row: SettingsRow): Settings {
  return {
    id: row.id,
    seo: row.seo,
    branding: row.branding,
    company: row.company,
    pageHeroes: row.page_heroes,
    updatedAt: row.updated_at,
  };
}

export async function getSettingsDocument(): Promise<Settings> {
  try {
    const result = await query<SettingsRow>(
      `SELECT id, seo, branding, company, page_heroes, analytics, updated_at
       FROM settings ORDER BY created_at ASC LIMIT 1`,
    );

    if (result.rows[0]) {
      return rowToSettings(result.rows[0]);
    }

    const inserted = await query<SettingsRow>(
      `INSERT INTO settings (seo, branding, company, page_heroes)
       VALUES ($1::jsonb, $2::jsonb, $3::jsonb, $4::jsonb)
       RETURNING id, seo, branding, company, page_heroes, analytics, updated_at`,
      [
        JSON.stringify(defaultSettingsData.seo),
        JSON.stringify(defaultSettingsData.branding),
        JSON.stringify(defaultSettingsData.company),
        JSON.stringify(defaultSettingsData.pageHeroes),
      ],
    );

    return rowToSettings(inserted.rows[0]);
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.warn(DB_SETUP_HINT);
      return buildDefaultSettings();
    }
    throw error;
  }
}

export async function updateSettingsDocument(
  data: Partial<Omit<Settings, "id" | "updatedAt">> & {
    analytics?: { googleAnalyticsId?: string; enabled?: boolean };
    page_heroes?: Settings["pageHeroes"];
  },
): Promise<Settings> {
  try {
    const current = await getSettingsDocument();
    if (current.id === "default") {
      throw new Error(DB_SETUP_HINT);
    }

    const pageHeroes =
      data.pageHeroes ?? data.page_heroes ?? current.pageHeroes;

    const merged = {
      seo: data.seo ?? current.seo,
      branding: data.branding ?? current.branding,
      company: data.company ?? current.company,
      pageHeroes,
    };

    const analytics =
      data.analytics !== undefined
        ? data.analytics
        : (
            await query<{ analytics: SettingsRow["analytics"] }>(
              "SELECT analytics FROM settings WHERE id = $1",
              [current.id],
            )
          ).rows[0]?.analytics;

    const result = await query<SettingsRow>(
      `UPDATE settings SET
         seo = $1::jsonb,
         branding = $2::jsonb,
         company = $3::jsonb,
         page_heroes = $4::jsonb,
         analytics = COALESCE($5::jsonb, analytics),
         updated_at = NOW()
       WHERE id = $6
       RETURNING id, seo, branding, company, page_heroes, analytics, updated_at`,
      [
        JSON.stringify(merged.seo),
        JSON.stringify(merged.branding),
        JSON.stringify(merged.company),
        JSON.stringify(merged.pageHeroes),
        analytics ? JSON.stringify(analytics) : null,
        current.id,
      ],
    );

    return rowToSettings(result.rows[0]);
  } catch (error) {
    if (isDbConnectionError(error)) {
      throw new Error(DB_SETUP_HINT);
    }
    throw error;
  }
}

export async function getAnalyticsSettings(): Promise<{
  googleAnalyticsId: string;
  enabled: boolean;
}> {
  try {
    const result = await query<{ analytics: { googleAnalyticsId?: string; enabled?: boolean } }>(
      `SELECT analytics FROM settings ORDER BY created_at ASC LIMIT 1`,
    );
    const analytics = result.rows[0]?.analytics;
    return {
      googleAnalyticsId: analytics?.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID || "",
      enabled: analytics?.enabled ?? Boolean(process.env.NEXT_PUBLIC_GA_ID),
    };
  } catch (error) {
    if (isDbConnectionError(error)) {
      console.warn(DB_SETUP_HINT);
    }
    return {
      googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
      enabled: Boolean(process.env.NEXT_PUBLIC_GA_ID),
    };
  }
}

export async function updateAnalyticsSettings(analytics: {
  googleAnalyticsId: string;
  enabled: boolean;
}): Promise<void> {
  const current = await getSettingsDocument();
  if (current.id === "default") {
    throw new Error(DB_SETUP_HINT);
  }
  await query(
    `UPDATE settings SET analytics = $1::jsonb, updated_at = NOW() WHERE id = $2`,
    [JSON.stringify(analytics), current.id],
  );
}
