const { spawnSync } = require("child_process");
const { join } = require("path");
const { existsSync, readFileSync } = require("fs");

const sqlPath = join(process.cwd(), "scripts", "_seed-landing.sql");
if (!existsSync(sqlPath)) {
  console.error("Missing scripts/_seed-landing.sql — run build-landing-seed-sql.mjs first");
  process.exit(1);
}

const sql = readFileSync(sqlPath);
const env = { ...process.env };

function run(cmd, args, extraEnv = {}) {
  return spawnSync(cmd, args, {
    input: sql,
    stdio: ["pipe", "inherit", "inherit"],
    env: { ...env, ...extraEnv },
  });
}

let result = run("docker", [
  "exec",
  "-i",
  "cms-starter-postgres",
  "psql",
  "-U",
  "postgres",
  "-d",
  "cms_starter",
]);

if (result.error || result.status !== 0) {
  result = run(
    "psql",
    ["-h", "127.0.0.1", "-U", "postgres", "-d", "cms_starter", "-v", "ON_ERROR_STOP=1"],
    { PGPASSWORD: env.PGPASSWORD || "postgres" },
  );
}

process.exit(result.status ?? 1);
