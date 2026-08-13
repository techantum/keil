import type { LandingPage, LandingRedirectRule, LandingSection } from "@/types/landing-page";

export const LANDING_REDIRECTS_COOKIE = "landing_redirects";

export function slugifyAnchor(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "section"
  );
}

/** Stable DOM id / hash for a landing section */
export function sectionAnchorId(section: LandingSection, index = 0): string {
  const base = slugifyAnchor(
    section.navLabel || section.label || section.title || section.type || "section",
  );
  return `${base}-${index}`;
}

export function getLandingNavItems(page: LandingPage) {
  return page.sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.enabled && section.showInNav !== false)
    .filter(({ section }) => section.type !== "cta" && section.type !== "leaders")
    .map(({ section, index }) => {
      const fallback =
        section.type === "hero"
          ? "Home"
          : section.type.charAt(0).toUpperCase() + section.type.slice(1);
      return {
        id: sectionAnchorId(section, index),
        label:
          section.navLabel?.trim() ||
          section.label?.trim() ||
          section.title?.trim() ||
          fallback,
        type: section.type,
      };
    });
}

export function buildRedirectRules(pages: LandingPage[]): LandingRedirectRule[] {
  return pages
    .filter((p) => p.status === "published")
    .map((p) => ({
      landingSlug: p.slug,
      mode: p.redirect?.mode || "all_pages_active",
      paths: (p.redirect?.paths || []).map(normalizePath),
    }))
    .filter((r) => r.mode !== "all_pages_active");
}

export function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "/";
  let p = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

export function encodeRedirectsCookie(rules: LandingRedirectRule[]): string {
  return encodeURIComponent(JSON.stringify(rules));
}

export function parseRedirectsCookie(raw?: string): LandingRedirectRule[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return Array.isArray(parsed) ? (parsed as LandingRedirectRule[]) : [];
  } catch {
    return [];
  }
}

/** Resolve where a public pathname should redirect, if anywhere */
export function resolveLandingRedirect(
  pathname: string,
  rules: LandingRedirectRule[],
): string | null {
  const path = normalizePath(pathname);

  // Never redirect landing, admin, api, or asset-like paths
  if (
    path.startsWith("/lp") ||
    path.startsWith("/admin") ||
    path.startsWith("/api") ||
    path.startsWith("/_next")
  ) {
    return null;
  }

  const anySlug = rules.find((r) => r.mode === "any_slug");
  if (anySlug) {
    return `/lp/${anySlug.landingSlug}`;
  }

  for (const rule of rules) {
    if (rule.mode !== "specific_pages") continue;
    if (rule.paths.includes(path)) {
      return `/lp/${rule.landingSlug}`;
    }
  }

  return null;
}
