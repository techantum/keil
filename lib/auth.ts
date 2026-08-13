import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import {
  getEnvCredentials,
  passwordMatches,
} from "@/lib/auth-credentials";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSession,
  verifySessionToken,
  type AdminRole,
  type AdminUser,
} from "@/lib/auth-session";

export type { AdminRole, AdminUser };
export { isSuperAdmin, createSession, verifySessionToken } from "@/lib/auth-session";

export async function validateCredentials(
  username: string,
  password: string,
): Promise<AdminUser | null> {
  const { adminUsername, superAdminUsername } = getEnvCredentials();

  if (username === superAdminUsername && (await passwordMatches("super_admin", password))) {
    return { username, role: "super_admin" };
  }
  if (username === adminUsername && (await passwordMatches("admin", password))) {
    return { username, role: "admin" };
  }
  return null;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAuth(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return null;
}

export async function requireAdminApi(): Promise<AdminUser | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function requireSuperAdminApi(): Promise<AdminUser | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden — super admin only" }, { status: 403 });
  }
  return session;
}
