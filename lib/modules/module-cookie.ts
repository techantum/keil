import { MODULE_KEYS, type ModuleKey } from "./registry";

export const MODULES_COOKIE = "site_modules";

const fallback: Record<ModuleKey, boolean> = Object.fromEntries(
  MODULE_KEYS.map((k) => [k, true]),
) as Record<ModuleKey, boolean>;

export function serializeModulesCookie(
  modules: Partial<Record<ModuleKey, boolean>>,
): string {
  const merged = { ...fallback, ...modules };
  return JSON.stringify(merged);
}

export function parseModulesCookie(value: string | undefined): Record<ModuleKey, boolean> {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as Partial<Record<ModuleKey, boolean>>;
    const enabled = { ...fallback };
    for (const key of MODULE_KEYS) {
      if (typeof parsed[key] === "boolean") {
        enabled[key] = parsed[key]!;
      }
    }
    return enabled;
  } catch {
    return fallback;
  }
}

export function modulesCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  };
}
