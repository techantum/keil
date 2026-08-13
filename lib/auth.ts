import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET || "change-this-to-a-long-random-string";
  return new TextEncoder().encode(secret);
}

function getAdminCredentials() {
  return {
    adminUsername: process.env.ADMIN_USERNAME || "admin",
    adminPassword: process.env.ADMIN_PASSWORD || "admin123",
    superAdminUsername: process.env.SUPER_ADMIN_USERNAME || "superadmin",
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || "superadmin123",
  };
}

export type AdminRole = "admin" | "super_admin";

export interface AdminUser {
  username: string;
  role: AdminRole;
}

export function isSuperAdmin(user: AdminUser): boolean {
  return user.role === "super_admin";
}

export async function validateCredentials(
  username: string,
  password: string,
): Promise<AdminUser | null> {
  const {
    adminUsername,
    adminPassword,
    superAdminUsername,
    superAdminPassword,
  } = getAdminCredentials();

  if (username === superAdminUsername && password === superAdminPassword) {
    return { username, role: "super_admin" };
  }
  if (username === adminUsername && password === adminPassword) {
    return { username, role: "admin" };
  }
  return null;
}

export async function createSession(user: AdminUser): Promise<string> {
  return new SignJWT({ username: user.username, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.username !== "string") return null;
    const role = payload.role;
    if (role !== "admin" && role !== "super_admin") return null;
    return { username: payload.username, role };
  } catch {
    return null;
  }
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
