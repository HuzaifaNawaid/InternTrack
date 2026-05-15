/**
 * InternTrack — Migration Runner
 * Reads init.sql and executes each statement against Neon.
 * Usage: node scripts/run-migration.mjs
 */

import { readFileSync } from "fs";
import { Pool } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set. Check your .env.local file.");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

const rawSql = readFileSync("init.sql", "utf-8");

// Split by semicolons, filter out empty/comment-only statements
const statements = rawSql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

console.log(`📦 Running ${statements.length} SQL statements...\n`);

let success = 0;
let failed = 0;

for (const stmt of statements) {
  // Skip pure comment blocks
  const cleaned = stmt
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .trim();

  if (!cleaned) continue;

  try {
    await pool.query(cleaned);
    const preview = cleaned.substring(0, 60).replace(/\n/g, " ");
    console.log(`  ✅ ${preview}...`);
    success++;
  } catch (err) {
    const preview = cleaned.substring(0, 60).replace(/\n/g, " ");
    console.error(`  ❌ ${preview}...`);
    console.error(`     Error: ${err.message}\n`);
    failed++;
  }
}

await pool.end();

console.log(`\n🏁 Migration complete: ${success} succeeded, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
