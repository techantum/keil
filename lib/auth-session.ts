import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminRole = "admin" | "super_admin";

export interface AdminUser {
  username: string;
  role: AdminRole;
}

function getSecretKey() {
  const secret = process.env.SESSION_SECRET || "change-this-to-a-long-random-string";
  return new TextEncoder().encode(secret);
}

export function isSuperAdmin(user: AdminUser): boolean {
  return user.role === "super_admin";
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
