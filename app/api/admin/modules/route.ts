import { NextResponse } from "next/server";
import { getSession, requireSuperAdminApi } from "@/lib/auth";
import { getEnabledModules, updateModules } from "@/lib/modules/get-enabled-modules";
import { getNavItems } from "@/lib/nav/get-nav-items";
import {
  navCookieOptions,
  serializeNavCookie,
  NAV_COOKIE,
} from "@/lib/nav/nav-cookie";
import { MODULE_KEYS, type ModuleKey } from "@/lib/modules/registry";
import {
  modulesCookieOptions,
  serializeModulesCookie,
  MODULES_COOKIE,
} from "@/lib/modules/module-cookie";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const modules = await getEnabledModules();
    return NextResponse.json({
      modules,
      role: session.role,
      canManage: session.role === "super_admin",
    });
  } catch (error) {
    console.error("Failed to fetch modules:", error);
    return NextResponse.json({ error: "Failed to fetch modules" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireSuperAdminApi();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const incoming = body.modules as Partial<Record<ModuleKey, boolean>> | undefined;

    if (!incoming || typeof incoming !== "object") {
      return NextResponse.json({ error: "modules object is required" }, { status: 400 });
    }

    const updates: Partial<Record<ModuleKey, boolean>> = {};
    for (const key of MODULE_KEYS) {
      if (typeof incoming[key] === "boolean") {
        updates[key] = incoming[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid module keys provided" }, { status: 400 });
    }

    await updateModules(updates);
    const modules = await getEnabledModules();
    const navItems = await getNavItems();

    const response = NextResponse.json({ success: true, modules });
    response.cookies.set(
      MODULES_COOKIE,
      serializeModulesCookie(modules),
      modulesCookieOptions(),
    );
    response.cookies.set(
      NAV_COOKIE,
      serializeNavCookie(navItems),
      navCookieOptions(),
    );
    return response;
  } catch (error) {
    console.error("Failed to update modules:", error);
    return NextResponse.json({ error: "Failed to update modules" }, { status: 500 });
  }
}
