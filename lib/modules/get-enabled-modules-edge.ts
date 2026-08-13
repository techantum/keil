import type { NextRequest } from "next/server";
import { MODULE_KEYS, type ModuleKey } from "./registry";
import { MODULES_COOKIE, parseModulesCookie } from "./module-cookie";

const fallback: Record<ModuleKey, boolean> = Object.fromEntries(
  MODULE_KEYS.map((k) => [k, true]),
) as Record<ModuleKey, boolean>;

/** Edge-safe module lookup for middleware — reads cookie cache, then env fallback. */
export function getEnabledModulesEdge(request?: NextRequest): Record<ModuleKey, boolean> {
  if (request) {
    const cookie = request.cookies.get(MODULES_COOKIE)?.value;
    if (cookie) return parseModulesCookie(cookie);
  }

  const raw = process.env.ENABLED_MODULES_JSON;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<Record<ModuleKey, boolean>>;
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
  return fallback;
}
