import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

// Load env manually
const envContent = readFileSync(".env.local", "utf-8");
const envVars = {};
envContent.split("\n").forEach(line => {
  const [key, ...vals] = line.split("=");
  if (key && vals.length) envVars[key.trim()] = vals.join("=").trim();
});

const DATABASE_URL = envVars.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Run each statement individually using tagged template
const stmts = [
  `ALTER TABLE students ADD COLUMN IF NOT EXISTS education TEXT`,
  `ALTER TABLE students ADD COLUMN IF NOT EXISTS achievements TEXT`,
  `ALTER TABLE students DROP COLUMN IF EXISTS semester`,
  `ALTER TABLE students DROP COLUMN IF EXISTS cv_url`,
  `DROP TRIGGER IF EXISTS trg_update_profile_score ON students`,
  `CREATE OR REPLACE FUNCTION calculate_profile_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.profile_score = 0;
    IF NEW.full_name IS NOT NULL AND NEW.full_name != '' THEN
        NEW.profile_score = NEW.profile_score + 20;
    END IF;
    IF NEW.university IS NOT NULL AND NEW.university != '' THEN
        NEW.profile_score = NEW.profile_score + 20;
    END IF;
    IF NEW.education IS NOT NULL AND NEW.education != '' THEN
        NEW.profile_score = NEW.profile_score + 10;
    END IF;
    IF NEW.skills IS NOT NULL AND array_length(NEW.skills, 1) > 0 THEN
        NEW.profile_score = NEW.profile_score + 20;
    END IF;
    IF NEW.achievements IS NOT NULL AND NEW.achievements != '' THEN
        NEW.profile_score = NEW.profile_score + 20;
    END IF;
    IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN
        NEW.profile_score = NEW.profile_score + 10;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql`,
  `CREATE TRIGGER trg_update_profile_score BEFORE INSERT OR UPDATE ON students FOR EACH ROW EXECUTE FUNCTION calculate_profile_score()`
];

console.log(`Running ${stmts.length} migration statements...\n`);

let success = 0;
let failed = 0;

for (const stmt of stmts) {
  try {
    await sql.query(stmt);
    console.log(`  ✅ ${stmt.substring(0, 60).replace(/\n/g, " ")}...`);
    success++;
  } catch (e) {
    console.error(`  ❌ ${stmt.substring(0, 60).replace(/\n/g, " ")}...`);
    console.error(`     Error: ${e.message}\n`);
    failed++;
  }
}

console.log(`\nMigration complete: ${success} succeeded, ${failed} failed.`);
