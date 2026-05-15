import { readFileSync } from "fs";
import { Pool } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set.");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

const advancedSql = `
-- 1. VIEW: vw_student_applications
CREATE OR REPLACE VIEW vw_student_applications AS
SELECT 
    a.id as application_id,
    a.student_id,
    a.status,
    a.applied_at,
    l.id as listing_id,
    l.title as listing_title,
    l.city as listing_city,
    l.stipend as listing_stipend,
    c.id as company_id,
    c.name as company_name,
    c.website as company_website
FROM applications a
JOIN listings l ON a.listing_id = l.id
JOIN companies c ON l.company_id = c.id;

-- 2. FUNCTION: calculate_profile_score
CREATE OR REPLACE FUNCTION calculate_profile_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.profile_score = 0;
    IF NEW.full_name IS NOT NULL AND NEW.full_name != '' THEN NEW.profile_score = NEW.profile_score + 20; END IF;
    IF NEW.university IS NOT NULL AND NEW.university != '' THEN NEW.profile_score = NEW.profile_score + 20; END IF;
    IF NEW.semester IS NOT NULL THEN NEW.profile_score = NEW.profile_score + 10; END IF;
    IF NEW.skills IS NOT NULL AND array_length(NEW.skills, 1) > 0 THEN NEW.profile_score = NEW.profile_score + 20; END IF;
    IF NEW.cv_url IS NOT NULL AND NEW.cv_url != '' THEN NEW.profile_score = NEW.profile_score + 20; END IF;
    IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN NEW.profile_score = NEW.profile_score + 10; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. TRIGGER: trg_update_profile_score
DROP TRIGGER IF EXISTS trg_update_profile_score ON students;
CREATE TRIGGER trg_update_profile_score
BEFORE INSERT OR UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION calculate_profile_score();

-- 4. FUNCTION: get_student_application_stats 
CREATE OR REPLACE FUNCTION get_student_application_stats(p_student_id INTEGER)
RETURNS TABLE (
    total_applications BIGINT,
    active_offers BIGINT,
    interviews BIGINT,
    rejected BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_applications,
        COUNT(*) FILTER (WHERE status = 'offered') as active_offers,
        COUNT(*) FILTER (WHERE status = 'interview') as interviews,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected
    FROM applications
    WHERE student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;
`;

async function run() {
  try {
    await pool.query(advancedSql);
    console.log("✅ Advanced SQL features (View, Functions, Triggers) successfully created.");
  } catch (err) {
    console.error("❌ Error running advanced SQL:", err);
  } finally {
    await pool.end();
  }
}

run();
