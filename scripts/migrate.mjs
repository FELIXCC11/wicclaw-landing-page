import { readFile } from "node:fs/promises";
import pg from "pg";
if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL through the secure environment.");
const pool = new pg.Pool({ connectionString:process.env.DATABASE_URL, max:1,
  ssl:process.env.DATABASE_SSL === "true" ? {rejectUnauthorized:true} : undefined });
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(87241923)");
  await client.query("CREATE TABLE IF NOT EXISTS wicclaw_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  for (const name of ["001_preorders.sql","002_shop_accounts.sql","003_checkout_launch.sql"]) {
    if ((await client.query("SELECT name FROM wicclaw_migrations WHERE name=$1",[name])).rowCount) continue;
    await client.query(await readFile(new URL("../db/"+name,import.meta.url),"utf8"));
    await client.query("INSERT INTO wicclaw_migrations (name) VALUES ($1)",[name]);
    console.log("Applied",name);
  }
  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Migration failed; transaction rolled back.", {type:error.name,code:error.code});
  process.exitCode=1;
} finally { client.release(); await pool.end(); }
