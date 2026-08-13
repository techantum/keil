import type { ModuleKey } from "@/lib/modules/registry";
import type { SiteNavItem } from "./default-nav-items";
import { normalizeNavSlug } from "./registry";

export function isNavItemVisible(
  item: SiteNavItem,
  modules: Record<ModuleKey, boolean>,
): boolean {
  if (!item.enabled) return false;
  if (item.moduleKey && modules[item.moduleKey] === false) return false;
  return true;
}

export function findNavItemBySlug(
  items: SiteNavItem[],
  pathname: string,
): SiteNavItem | null {
  const path = normalizeNavSlug(pathname.split("?")[0] || "/");
  return (
    items.find((item) => path === item.slug || path.startsWith(`${item.slug}/`)) ||
    null
  );
}

export function findNavItemByCanonical(
  items: SiteNavItem[],
  pathname: string,
): SiteNavItem | null {
  const path = normalizeNavSlug(pathname.split("?")[0] || "/");
  return (
    items.find(
      (item) =>
        path === item.canonicalSlug || path.startsWith(`${item.canonicalSlug}/`),
    ) || null
  );
}
