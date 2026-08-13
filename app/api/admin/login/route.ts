import { type NextRequest, NextResponse } from "next/server";
import {
  validateCredentials,
  createSession,
  setSessionCookie,
} from "@/lib/auth";
import { getEnabledModules } from "@/lib/modules/get-enabled-modules";
import {
  modulesCookieOptions,
  serializeModulesCookie,
  MODULES_COOKIE,
} from "@/lib/modules/module-cookie";
import { getNavItems } from "@/lib/nav/get-nav-items";
import {
  navCookieOptions,
  serializeNavCookie,
  NAV_COOKIE,
} from "@/lib/nav/nav-cookie";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    const user = await validateCredentials(username, password);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createSession(user);
    await setSessionCookie(token);

    const modules = await getEnabledModules();
    const navItems = await getNavItems();
    const response = NextResponse.json({
      success: true,
      role: user.role,
      username: user.username,
    });
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
