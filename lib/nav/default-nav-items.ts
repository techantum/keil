import { NAV_KEYS, NAV_REGISTRY, type NavKey } from "./registry";

export type SiteNavItem = {
  key: NavKey;
  label: string;
  slug: string;
  enabled: boolean;
  sortOrder: number;
  moduleKey: (typeof NAV_REGISTRY)[NavKey]["moduleKey"];
  hasDropdown: boolean;
  canonicalSlug: string;
};

export function defaultNavItems(): SiteNavItem[] {
  return NAV_KEYS.map((key, index) => {
    const def = NAV_REGISTRY[key];
    return {
      key,
      label: def.defaultLabel,
      slug: def.canonicalSlug,
      enabled: true,
      sortOrder: index,
      moduleKey: def.moduleKey,
      hasDropdown: def.hasDropdown,
      canonicalSlug: def.canonicalSlug,
    };
  });
}
