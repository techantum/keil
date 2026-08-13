import { MODULE_KEYS, type ModuleKey } from "./registry";
import { isDbConnectionError } from "@/lib/db/db-error";

const fallback: Record<ModuleKey, boolean> = Object.fromEntries(
  MODULE_KEYS.map((k) => [k, true]),
) as Record<ModuleKey, boolean>;

export async function getEnabledModules(): Promise<Record<ModuleKey, boolean>> {
  if (process.env.USE_POSTGRES !== "true" && !process.env.DATABASE_URL) {
    return fallback;
  }

  try {
    const { query } = await import("@/lib/db/postgres");
    const result = await query<{ module_key: string; enabled: boolean }>(
      "SELECT module_key, enabled FROM site_modules",
    );

    if (result.rows.length === 0) return fallback;

    const enabled = { ...fallback };
    for (const row of result.rows) {
      if (MODULE_KEYS.includes(row.module_key as ModuleKey)) {
        enabled[row.module_key as ModuleKey] = row.enabled;
      }
    }
    return enabled;
  } catch (error) {
    if (isDbConnectionError(error)) return fallback;
    return fallback;
  }
}

export async function isModuleEnabled(key: ModuleKey): Promise<boolean> {
  const modules = await getEnabledModules();
  return modules[key] ?? true;
}

export async function updateModules(
  modules: Partial<Record<ModuleKey, boolean>>,
): Promise<void> {
  const { query } = await import("@/lib/db/postgres");
  for (const [key, enabled] of Object.entries(modules)) {
    await query(
      `INSERT INTO site_modules (module_key, enabled, policy_version, synced_at)
       VALUES ($1, $2, 0, NOW())
       ON CONFLICT (module_key) DO UPDATE SET
         enabled = EXCLUDED.enabled,
         synced_at = NOW()`,
      [key, enabled],
    );
  }
}

/** @deprecated Use updateModules */
export const updateModuleCache = updateModules;
