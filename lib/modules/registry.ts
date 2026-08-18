import {
  LayoutDashboard,
  Package,
  FolderTree,
  Briefcase,
  Image as ImageIcon,
  Users,
  MessageSquare,
  Mail,
  FileText,
  Palette,
  Building2,
  Search,
  BarChart3,
  Blocks,
  type LucideIcon,
} from "lucide-react";

export const MODULE_KEYS = [
  "products",
  "categories",
  "services",
  "gallery",
  "clients",
  "testimonials",
  "crm",
  "content",
  "seo",
  "analytics",
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];

export type ModuleDefinition = {
  key: ModuleKey;
  label: string;
  adminRoutes: string[];
  publicRoutes: string[];
  icon: LucideIcon;
  adminNav?: boolean;
};

export const MODULES: Record<ModuleKey, ModuleDefinition> = {
  products: {
    key: "products",
    label: "Products",
    adminRoutes: ["/admin/products"],
    publicRoutes: ["/products"],
    icon: Package,
    adminNav: true,
  },
  categories: {
    key: "categories",
    label: "Categories",
    adminRoutes: ["/admin/categories"],
    publicRoutes: [],
    icon: FolderTree,
    adminNav: true,
  },
  services: {
    key: "services",
    label: "Services",
    adminRoutes: ["/admin/services"],
    publicRoutes: ["/services"],
    icon: Briefcase,
    adminNav: true,
  },
  gallery: {
    key: "gallery",
    label: "Gallery",
    adminRoutes: ["/admin/gallery"],
    publicRoutes: ["/gallery"],
    icon: ImageIcon,
    adminNav: false,
  },
  clients: {
    key: "clients",
    label: "Clients",
    adminRoutes: ["/admin/clients"],
    publicRoutes: ["/clients"],
    icon: Users,
    adminNav: false,
  },
  testimonials: {
    key: "testimonials",
    label: "Testimonials",
    adminRoutes: ["/admin/testimonials"],
    publicRoutes: ["/testimonials"],
    icon: MessageSquare,
    adminNav: false,
  },
  crm: {
    key: "crm",
    label: "Leads & CRM",
    adminRoutes: ["/admin/leads"],
    publicRoutes: [],
    icon: Mail,
    adminNav: true,
  },
  content: {
    key: "content",
    label: "CMS",
    adminRoutes: [
      "/admin/cms",
      "/admin/cms/home",
      "/admin/cms/landing-pages",
      "/admin/cms/design-previews",
      "/admin/cms/about",
      "/admin/cms/contact",
      "/admin/cms/footer",
    ],
    publicRoutes: ["/lp"],
    icon: FileText,
    adminNav: true,
  },
  seo: {
    key: "seo",
    label: "SEO",
    adminRoutes: ["/admin/seo"],
    publicRoutes: [],
    icon: Search,
    adminNav: true,
  },
  analytics: {
    key: "analytics",
    label: "Analytics",
    adminRoutes: ["/admin/analytics"],
    publicRoutes: [],
    icon: BarChart3,
    adminNav: true,
  },
};

export const ADMIN_CORE_NAV = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, moduleKey: null as ModuleKey | null },
  { name: "Branding", href: "/admin/branding", icon: Palette, moduleKey: null },
  { name: "Company", href: "/admin/company", icon: Building2, moduleKey: null },
  { name: "Modules", href: "/admin/modules", icon: Blocks, moduleKey: null },
] as const;

export function getModuleForPath(pathname: string): ModuleKey | null {
  for (const mod of Object.values(MODULES)) {
    if (
      mod.adminRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`)) ||
      mod.publicRoutes.some((r) => pathname === r || pathname.startsWith(`${r}/`))
    ) {
      return mod.key;
    }
  }
  return null;
}
