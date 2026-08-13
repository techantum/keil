import { PostgresRepository } from "./PostgresRepository";
import type { IDataRepository } from "./IDataRepository";

let repo: IDataRepository | null = null;

function usePostgres(): boolean {
  return (
    process.env.USE_POSTGRES === "true" ||
    Boolean(process.env.DATABASE_URL || process.env.SUPABASE_DB_URL)
  );
}

export function getRepository(): IDataRepository {
  if (!repo) {
    if (usePostgres()) {
      repo = new PostgresRepository();
    } else {
      // Lazy-load Mongo so Postgres-only builds do not require MONGODB_URI at import time.
      const { MongoDBRepository } = require("./MongoDBRepository") as typeof import("./MongoDBRepository");
      repo = new MongoDBRepository();
    }
  }
  return repo;
}
