/**
 * Postgres client entry point (Option C: direct PostgreSQL via pg pool).
 * Use DATABASE_URL for local Docker or VPS-hosted Postgres.
 */
export { query, getPool, checkDatabaseConnection } from "./postgres";
