import { defaultSettingsData } from "@/lib/db/default-settings";
import type { Settings } from "@/types";

export function isDbConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const err = error as { code?: string; message?: string };
  if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") return true;

  // pg Pool wraps errors in AggregateError
  if (error instanceof AggregateError) {
    return error.errors.some((e) => isDbConnectionError(e));
  }

  const message = String(err.message || error);
  return (
    message.includes("ECONNREFUSED") ||
    message.includes("connect ECONNREFUSED") ||
    message.includes("Connection terminated") ||
    message.includes("password authentication failed")
  );
}

export function buildDefaultSettings(): Settings {
  return {
    id: "default",
    ...defaultSettingsData,
    updatedAt: new Date(),
  };
}

export const DB_SETUP_HINT =
  "PostgreSQL is not reachable. Start Docker Desktop, then run: npm run db:setup";
