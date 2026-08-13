import type { ModuleKey } from "@/lib/modules/registry";

export const NAV_KEYS = [
  "home",
  "about",
  "services",
  "products",
  "gallery",
  "clients",
  "testimonials",
  "contact",
] as const;

export type NavKey = (typeof NAV_KEYS)[number];

export type NavItemDefinition = {
  key: NavKey;
  defaultLabel: string;
  canonicalSlug: string;
  moduleKey: ModuleKey | null;
  hasDropdown: boolean;
};

export const NAV_REGISTRY: Record<NavKey, NavItemDefinition> = {
  home: {
    key: "home",
    defaultLabel: "Home",
    canonicalSlug: "/",
    moduleKey: null,
    hasDropdown: false,
  },
  about: {
    key: "about",
    defaultLabel: "About Us",
    canonicalSlug: "/about",
    moduleKey: null,
    hasDropdown: false,
  },
  services: {
    key: "services",
    defaultLabel: "Services",
    canonicalSlug: "/services",
    moduleKey: "services",
    hasDropdown: true,
  },
  products: {
    key: "products",
    defaultLabel: "Products",
    canonicalSlug: "/products",
    moduleKey: "products",
    hasDropdown: true,
  },
  gallery: {
    key: "gallery",
    defaultLabel: "Gallery",
    canonicalSlug: "/gallery",
    moduleKey: "gallery",
    hasDropdown: false,
  },
  clients: {
    key: "clients",
    defaultLabel: "Clients",
    canonicalSlug: "/clients",
    moduleKey: "clients",
    hasDropdown: false,
  },
  testimonials: {
    key: "testimonials",
    defaultLabel: "Testimonials",
    canonicalSlug: "/testimonials",
    moduleKey: "testimonials",
    hasDropdown: false,
  },
  contact: {
    key: "contact",
    defaultLabel: "Contact Us",
    canonicalSlug: "/contact",
    moduleKey: null,
    hasDropdown: false,
  },
};

export function normalizeNavSlug(slug: string): string {
  const trimmed = slug.trim();
  if (!trimmed) return "/";
  let normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function isValidNavSlug(slug: string): boolean {
  const normalized = normalizeNavSlug(slug);
  if (normalized === "/") return true;
  return /^\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(
    normalized,
  );
}

export function getNavKeyForPath(pathname: string): NavKey | null {
  const normalized = normalizeNavSlug(pathname.split("?")[0] || "/");
  for (const def of Object.values(NAV_REGISTRY)) {
    const canonical = def.canonicalSlug;
    if (normalized === canonical || normalized.startsWith(`${canonical}/`)) {
      return def.key;
    }
  }
  return null;
}
