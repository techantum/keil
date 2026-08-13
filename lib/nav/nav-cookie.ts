import { defaultNavItems, type SiteNavItem } from "./default-nav-items";

export const NAV_COOKIE = "site_nav";

export function serializeNavCookie(items: SiteNavItem[]): string {
  return JSON.stringify(
    items.map((item) => ({
      key: item.key,
      label: item.label,
      slug: item.slug,
      enabled: item.enabled,
      sortOrder: item.sortOrder,
      moduleKey: item.moduleKey,
      hasDropdown: item.hasDropdown,
      canonicalSlug: item.canonicalSlug,
    })),
  );
}

export function parseNavCookie(value: string | undefined): SiteNavItem[] {
  if (!value) return defaultNavItems();
  try {
    const parsed = JSON.parse(value) as SiteNavItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultNavItems();
    return parsed;
  } catch {
    return defaultNavItems();
  }
}

export function navCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  };
}
