import { isDbConnectionError } from "@/lib/db/db-error";
import type { ModuleKey } from "@/lib/modules/registry";
import { getEnabledModules } from "@/lib/modules/get-enabled-modules";
import { defaultNavItems, type SiteNavItem } from "./default-nav-items";
import { isNavItemVisible } from "./nav-utils";
import {
  NAV_KEYS,
  NAV_REGISTRY,
  normalizeNavSlug,
  type NavKey,
} from "./registry";

type NavRow = {
  nav_key: string;
  label: string;
  slug: string;
  enabled: boolean;
  sort_order: number;
};

function rowToNavItem(row: NavRow): SiteNavItem {
  const key = row.nav_key as NavKey;
  const def = NAV_REGISTRY[key];
  return {
    key,
    label: row.label?.trim() || def.defaultLabel,
    slug: normalizeNavSlug(row.slug || def.canonicalSlug),
    enabled: row.enabled,
    sortOrder: row.sort_order,
    moduleKey: def.moduleKey,
    hasDropdown: def.hasDropdown,
    canonicalSlug: def.canonicalSlug,
  };
}

export async function getNavItems(): Promise<SiteNavItem[]> {
  const defaults = defaultNavItems();

  if (process.env.USE_POSTGRES !== "true" && !process.env.DATABASE_URL) {
    return defaults;
  }

  try {
    const { query } = await import("@/lib/db/postgres");
    const result = await query<NavRow>(
      "SELECT nav_key, label, slug, enabled, sort_order FROM site_nav_items ORDER BY sort_order ASC",
    );

    if (result.rows.length === 0) return defaults;

    const byKey = new Map<string, NavRow>();
    for (const row of result.rows) {
      if (NAV_KEYS.includes(row.nav_key as NavKey)) {
        byKey.set(row.nav_key, row);
      }
    }

    return NAV_KEYS.map((key, index) => {
      const row = byKey.get(key);
      if (!row) return defaults[index];
      return rowToNavItem(row);
    });
  } catch (error) {
    if (isDbConnectionError(error)) return defaults;
    return defaults;
  }
}

export type NavItemUpdate = {
  key: NavKey;
  label?: string;
  slug?: string;
  enabled?: boolean;
};

export async function updateNavItems(updates: NavItemUpdate[]): Promise<void> {
  const { query } = await import("@/lib/db/postgres");

  for (const update of updates) {
    const def = NAV_REGISTRY[update.key];
    const fields: string[] = [];
    const values: unknown[] = [];
    let param = 1;

    if (typeof update.label === "string") {
      fields.push(`label = $${param++}`);
      values.push(update.label.trim() || def.defaultLabel);
    }
    if (typeof update.slug === "string") {
      fields.push(`slug = $${param++}`);
      values.push(normalizeNavSlug(update.slug));
    }
    if (typeof update.enabled === "boolean") {
      fields.push(`enabled = $${param++}`);
      values.push(update.enabled);
    }

    if (fields.length === 0) continue;

    fields.push("updated_at = NOW()");
    values.push(update.key);

    await query(
      `UPDATE site_nav_items SET ${fields.join(", ")} WHERE nav_key = $${param}`,
      values,
    );
  }
}

export async function getPublicNavItems(): Promise<SiteNavItem[]> {
  const [items, modules] = await Promise.all([getNavItems(), getEnabledModules()]);
  return items.filter((item) => isNavItemVisible(item, modules));
}
