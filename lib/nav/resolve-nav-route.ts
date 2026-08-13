import type { NextRequest } from "next/server";
import type { ModuleKey } from "@/lib/modules/registry";
import { getEnabledModulesEdge } from "@/lib/modules/get-enabled-modules-edge";
import { defaultNavItems, type SiteNavItem } from "./default-nav-items";
import { isNavItemVisible } from "./nav-utils";
import { NAV_COOKIE, parseNavCookie } from "./nav-cookie";
import { normalizeNavSlug } from "./registry";

export function getNavItemsEdge(request?: NextRequest): SiteNavItem[] {
  if (request) {
    const cookie = request.cookies.get(NAV_COOKIE)?.value;
    if (cookie) return parseNavCookie(cookie);
  }
  return defaultNavItems();
}

export type NavRouteResolution =
  | { action: "next" }
  | { action: "redirect"; to: string }
  | { action: "rewrite"; to: string };

export function resolveNavRoute(
  pathname: string,
  request: NextRequest,
): NavRouteResolution {
  const navItems = getNavItemsEdge(request);
  const modules = getEnabledModulesEdge(request);
  const path = normalizeNavSlug(pathname.split("?")[0] || "/");

  for (const item of navItems) {
    const slug = normalizeNavSlug(item.slug);
    const canonical = normalizeNavSlug(item.canonicalSlug);
    const visible = isNavItemVisible(item, modules);

    const matchesSlug = path === slug || (slug !== "/" && path.startsWith(`${slug}/`));
    const matchesCanonical =
      path === canonical || (canonical !== "/" && path.startsWith(`${canonical}/`));

    if (matchesSlug) {
      if (!visible) return { action: "redirect", to: "/" };
      if (slug !== canonical) {
        const suffix = path.slice(slug.length);
        return { action: "rewrite", to: `${canonical}${suffix}` };
      }
      return { action: "next" };
    }

    if (matchesCanonical && slug !== canonical) {
      if (!visible) return { action: "redirect", to: "/" };
      const suffix = path.slice(canonical.length);
      return { action: "redirect", to: `${slug}${suffix}` };
    }
  }

  return { action: "next" };
}
