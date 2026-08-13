import type { ModuleKey } from "@/lib/modules/registry";

export type CmsAdminNavItem = {
  name: string;
  href: string;
  moduleKey: ModuleKey;
};

export const CMS_ADMIN_BASE = "/admin/cms";

export const CMS_ADMIN_NAV: CmsAdminNavItem[] = [
  { name: "Home", href: "/admin/cms/home", moduleKey: "content" },
  { name: "Landing Pages", href: "/admin/cms/landing-pages", moduleKey: "content" },
  { name: "About", href: "/admin/cms/about", moduleKey: "content" },
  { name: "Contact", href: "/admin/cms/contact", moduleKey: "content" },
  { name: "Footer", href: "/admin/cms/footer", moduleKey: "content" },
  { name: "Gallery", href: "/admin/gallery", moduleKey: "gallery" },
  { name: "Clients", href: "/admin/clients", moduleKey: "clients" },
  { name: "Testimonials", href: "/admin/testimonials", moduleKey: "testimonials" },
];

export const CMS_MODULE_KEYS = new Set<ModuleKey>([
  "content",
  "gallery",
  "clients",
  "testimonials",
]);

export function isCmsAdminPath(pathname: string): boolean {
  if (pathname === CMS_ADMIN_BASE || pathname.startsWith(`${CMS_ADMIN_BASE}/`)) {
    return true;
  }
  return CMS_ADMIN_NAV.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}

export function getVisibleCmsNav(
  enabledModules: Record<string, boolean>,
  options?: { showAll?: boolean },
): CmsAdminNavItem[] {
  if (options?.showAll) return [...CMS_ADMIN_NAV];
  return CMS_ADMIN_NAV.filter((item) => enabledModules[item.moduleKey] !== false);
}
