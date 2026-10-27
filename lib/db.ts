import "server-only";
import { Pool } from "pg";

let pool: Pool | undefined;

export function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      statement_timeout: 10000,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined,
    });
  }
  return pool;
}
