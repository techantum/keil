import { Pool, type QueryResultRow } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  pgPool?: Pool;
};

function getConnectionString(): string {
  return (
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    "postgresql://postgres:postgres@localhost:5432/cms_starter"
  );
}

export function getPool(): Pool {
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({
      connectionString: getConnectionString(),
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

    globalForPg.pgPool.on("error", (err) => {
      console.error("Unexpected Postgres pool error:", err);
    });
  }

  return globalForPg.pgPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return getPool().query<T>(text, params);
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await query("SELECT 1");
    return true;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "code" in error
          ? String((error as { code?: string }).code)
          : "unreachable";
    console.warn(`Postgres connection failed (${message}). Falling back to file store.`);
    // Drop broken pool so a later Docker start can reconnect cleanly
    try {
      await globalForPg.pgPool?.end();
    } catch {
      /* ignore */
    }
    globalForPg.pgPool = undefined;
    return false;
  }
}
