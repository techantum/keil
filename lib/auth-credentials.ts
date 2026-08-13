import { promises as fs } from "fs";
import path from "path";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Node-only. Do not import this file from middleware (Edge runtime).

const STORE = path.join(process.cwd(), "data", "admin-credentials.json");

export type PasswordTarget = "admin" | "super_admin";

type CredentialStore = {
  adminPasswordHash?: string;
  superAdminPasswordHash?: string;
};

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (next.length !== expected.length) return false;
  return timingSafeEqual(next, expected);
}

function verifyPlain(password: string, expected: string): boolean {
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function readStore(): Promise<CredentialStore> {
  try {
    const raw = await fs.readFile(STORE, "utf8");
    return JSON.parse(raw) as CredentialStore;
  } catch {
    return {};
  }
}

async function writeStore(data: CredentialStore): Promise<void> {
  await fs.mkdir(path.dirname(STORE), { recursive: true });
  await fs.writeFile(STORE, JSON.stringify(data, null, 2), "utf8");
}

export function getEnvCredentials() {
  return {
    adminUsername: process.env.ADMIN_USERNAME || "admin",
    adminPassword: process.env.ADMIN_PASSWORD || "admin123",
    superAdminUsername: process.env.SUPER_ADMIN_USERNAME || "superadmin",
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || "superadmin123",
  };
}

export async function passwordMatches(
  target: PasswordTarget,
  password: string,
): Promise<boolean> {
  const env = getEnvCredentials();
  const store = await readStore();
  const hashed =
    target === "super_admin"
      ? store.superAdminPasswordHash
      : store.adminPasswordHash;
  if (hashed) return verifyHash(password, hashed);
  const plain =
    target === "super_admin" ? env.superAdminPassword : env.adminPassword;
  return verifyPlain(password, plain);
}

export async function setPassword(
  target: PasswordTarget,
  newPassword: string,
): Promise<void> {
  const store = await readStore();
  const hashed = hashPassword(newPassword);
  if (target === "super_admin") store.superAdminPasswordHash = hashed;
  else store.adminPasswordHash = hashed;
  await writeStore(store);
}
