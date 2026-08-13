const { spawnSync } = require("child_process");
const { join } = require("path");
const { existsSync, readFileSync } = require("fs");

const sqlPath = join(process.cwd(), "scripts", "_seed-landing.sql");
if (!existsSync(sqlPath)) {
  console.error("Missing scripts/_seed-landing.sql — run build-landing-seed-sql.mjs first");
  process.exit(1);
}

const result = spawnSync(
  "docker",
  ["exec", "-i", "cms-starter-postgres", "psql", "-U", "postgres", "-d", "cms_starter"],
  {
    input: readFileSync(sqlPath),
    stdio: ["pipe", "inherit", "inherit"],
  },
);

process.exit(result.status ?? 1);
