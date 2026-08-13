import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth-session";
import { getModuleForPath } from "@/lib/modules/registry";
import { getEnabledModulesEdge } from "@/lib/modules/get-enabled-modules-edge";
import { resolveNavRoute } from "@/lib/nav/resolve-nav-route";
import {
  LANDING_REDIRECTS_COOKIE,
  parseRedirectsCookie,
  resolveLandingRedirect,
} from "@/lib/landing-pages/nav";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

function nextNoStore() {
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_session")?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login")) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return nextNoStore();
  }

  if (pathname.startsWith("/admin")) {
    if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
      return nextNoStore();
    }

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (pathname.startsWith("/admin/modules") && session.role !== "super_admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (
      (pathname.startsWith("/api/admin/modules") ||
        pathname.startsWith("/api/admin/nav")) &&
      request.method !== "GET" &&
      session.role !== "super_admin"
    ) {
      return NextResponse.json({ error: "Forbidden — super admin only" }, { status: 403 });
    }

    const moduleKey = getModuleForPath(pathname);
    if (moduleKey && session.role !== "super_admin") {
      const enabled = getEnabledModulesEdge(request);
      if (!enabled[moduleKey]) {
        return NextResponse.redirect(new URL("/admin/modules", request.url));
      }
    }
  }

  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".")
  ) {
    const landingRules = parseRedirectsCookie(
      request.cookies.get(LANDING_REDIRECTS_COOKIE)?.value,
    );
    const landingTarget = resolveLandingRedirect(pathname, landingRules);
    if (landingTarget && landingTarget !== pathname) {
      return NextResponse.redirect(new URL(landingTarget, request.url));
    }

    const navResolution = resolveNavRoute(pathname, request);
    if (navResolution.action === "redirect") {
      return NextResponse.redirect(new URL(navResolution.to, request.url));
    }
    if (navResolution.action === "rewrite") {
      const url = request.nextUrl.clone();
      url.pathname = navResolution.to;
      const rewrite = NextResponse.rewrite(url);
      rewrite.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      return rewrite;
    }

    const moduleKey = getModuleForPath(pathname);
    if (moduleKey) {
      const enabled = getEnabledModulesEdge(request);
      if (!enabled[moduleKey]) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return nextNoStore();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|uploads|robots.txt|sitemap.xml).*)",
  ],
};
