import type { FooterContent } from "@/types";

export type LandingSectionType =
  | "hero"
  | "about"
  | "team"
  | "features"
  | "leaders"
  | "solutions"
  | "benefits"
  | "applications"
  | "process"
  | "gallery"
  | "cta"
  | "text"
  | "cards"
  | "custom";

/** How a landing CTA behaves when clicked */
export type LandingCtaAction =
  | "modal"
  | "section"
  | "path"
  | "external";

export const LANDING_CTA_ACTIONS: { value: LandingCtaAction; label: string; desc: string }[] = [
  { value: "modal", label: "Modal popup", desc: "Open Get a Project Consultation form" },
  { value: "section", label: "Same page section", desc: "Scroll to another section (use #anchor)" },
  { value: "path", label: "Internal page", desc: "Go to a path on this site (e.g. /contact)" },
  { value: "external", label: "External URL", desc: "Open an external link" },
];

export type LandingSectionItem = {
  title: string;
  description?: string;
  image?: string;
  icon?: string;
  link?: string;
  role?: string;
};

export type LandingSection = {
  id: string;
  type: LandingSectionType;
  enabled: boolean;
  /** Show this section title in the landing page navbar */
  showInNav?: boolean;
  /** Optional override for navbar label */
  navLabel?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  /** Second body paragraph (Why KEIL) */
  descriptionSecondary?: string;
  /** Optional mid-copy heading (About: From Concept to Commissioning) */
  subHeading?: string;
  image?: string;
  badgeText?: string;
  buttonText?: string;
  buttonLink?: string;
  /** Primary CTA click behavior (default: modal) */
  buttonAction?: LandingCtaAction;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  /** Secondary CTA click behavior */
  secondaryButtonAction?: LandingCtaAction;
  /** Why KEIL — navy promise card */
  promiseTitle?: string;
  promiseItems?: string[];
  /** Optional decorative image/icon URL for promise card */
  promiseImage?: string;
  items?: LandingSectionItem[];
};

export type LandingPageSeo = {
  title?: string;
  description?: string;
  keywords?: string[];
};

/** Per-landing-page brand assets (override site-wide branding on /lp/{slug}) */
export type LandingPageBranding = {
  navbarLogo?: string;
  footerLogo?: string;
  favicon?: string;
  ogImage?: string;
  /** Phone shown as the call button in this landing page navbar */
  navbarPhone?: string;
  /** Headings, trust bar, outline buttons (default navy) */
  primaryColor?: string;
  /** CTAs, accents, phone button (default red) */
  secondaryColor?: string;
};

export const DEFAULT_LANDING_BRANDING: LandingPageBranding = {
  navbarLogo: "",
  footerLogo: "",
  favicon: "",
  ogImage: "",
  navbarPhone: "",
  primaryColor: "#002B5B",
  secondaryColor: "#E31C23",
};

/**
 * all_pages_active — no site redirects; landing only at /lp/{slug}
 * any_slug — redirect any public path to this landing page
 * specific_pages — redirect only listed paths to this landing page
 */
export type LandingRedirectMode =
  | "all_pages_active"
  | "any_slug"
  | "specific_pages";

export type LandingRedirectConfig = {
  mode: LandingRedirectMode;
  /** Paths like "/", "/about" used when mode is specific_pages */
  paths: string[];
};

export type LandingPageStatus = "draft" | "published";

export type LandingPage = {
  id: string;
  title: string;
  slug: string;
  status: LandingPageStatus;
  designImage: string;
  sections: LandingSection[];
  seo: LandingPageSeo;
  branding: LandingPageBranding;
  /** Unique footer for this landing page */
  footer?: FooterContent;
  redirect: LandingRedirectConfig;
  createdAt: string;
  updatedAt: string;
};

export type CreateLandingPageInput = {
  title: string;
  slug: string;
  designImage: string;
  sections: LandingSection[];
  seo?: LandingPageSeo;
  branding?: LandingPageBranding;
  footer?: FooterContent;
  status?: LandingPageStatus;
  redirect?: LandingRedirectConfig;
};

export type UpdateLandingPageInput = Partial<{
  title: string;
  slug: string;
  designImage: string;
  sections: LandingSection[];
  seo: LandingPageSeo;
  branding: LandingPageBranding;
  footer?: FooterContent;
  status: LandingPageStatus;
  redirect: LandingRedirectConfig;
}>;

export type LandingRedirectRule = {
  landingSlug: string;
  mode: LandingRedirectMode;
  paths: string[];
};

export const DEFAULT_LANDING_REDIRECT: LandingRedirectConfig = {
  mode: "all_pages_active",
  paths: [],
};
