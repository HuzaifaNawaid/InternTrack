-- ============================================
-- InternTrack — Database Initialization Script
-- Version: 1.0
-- Database: Neon PostgreSQL (Serverless)
-- ============================================

-- Clean up existing schema for integer IDs transition
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID generation (Neon supports this by default, but safe to include)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: users — Central authentication table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'company', 'admin')),
  is_banned   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE: students — Student profile data
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
  full_name         TEXT NOT NULL,
  university        TEXT,
  education         TEXT,
  skills            TEXT[],
  achievements      TEXT,
  bio               TEXT,
  profile_score     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE: companies — Company profiles
-- ============================================
CREATE TABLE companies (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  website      TEXT,
  city         TEXT,
  is_verified  BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE: listings — Internship postings
-- ============================================
CREATE TABLE IF NOT EXISTS listings (
  id            SERIAL PRIMARY KEY,
  company_id    INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  city          TEXT,
  stipend       INTEGER,
  skills        TEXT[],
  deadline      DATE NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE: applications — Student applications
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
  id            SERIAL PRIMARY KEY,
  student_id    INTEGER REFERENCES students(id) ON DELETE CASCADE,
  listing_id    INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'applied' CHECK (
                  status IN ('applied', 'shortlisted', 'interview', 'offered', 'rejected')
                ),
  applied_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, listing_id)
);

-- ============================================
-- TABLE: reviews — Company reviews by students
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id                SERIAL PRIMARY KEY,
  student_id        INTEGER REFERENCES students(id) ON DELETE CASCADE,
  company_id        INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  culture_rating    INTEGER CHECK (culture_rating BETWEEN 1 AND 5),
  learning_rating   INTEGER CHECK (learning_rating BETWEEN 1 AND 5),
  stipend_rating    INTEGER CHECK (stipend_rating BETWEEN 1 AND 5),
  comment           TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, company_id)
);

-- ============================================
-- INDEXES — Performance optimization
-- ============================================
CREATE INDEX IF NOT EXISTS idx_students_user_id        ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_user_id       ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_listing_id ON applications(listing_id);
CREATE INDEX IF NOT EXISTS idx_listings_company_id     ON listings(company_id);
CREATE INDEX IF NOT EXISTS idx_listings_deadline       ON listings(deadline);
CREATE INDEX IF NOT EXISTS idx_listings_is_active      ON listings(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_company_id      ON reviews(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email             ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role              ON users(role);

-- ============================================
-- SEED: Default admin account
-- Password should be hashed before insertion.
-- Replace the placeholder below with a bcrypt hash.
-- Example: password "admin123" → hash it in your app first.
-- ============================================
-- INSERT INTO users (email, password, role)
-- VALUES ('admin@interntrack.pk', '<BCRYPT_HASH_HERE>', 'admin')
-- ON CONFLICT (email) DO NOTHING;

-- ============================================
-- ADVANCED SQL CONCEPTS (PHASE 2)
-- ============================================

-- 1. VIEW: vw_student_applications
-- Simplifies querying student applications by joining listings and companies
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
-- Calculates a profile score out of 100 based on completed fields
CREATE OR REPLACE FUNCTION calculate_profile_score()
RETURNS TRIGGER AS \$\$
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
\$\$ LANGUAGE plpgsql;

-- 3. TRIGGER: trg_update_profile_score
-- Automatically runs the function before insert or update on students table
DROP TRIGGER IF EXISTS trg_update_profile_score ON students;
CREATE TRIGGER trg_update_profile_score
BEFORE INSERT OR UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION calculate_profile_score();

-- 4. FUNCTION: get_student_application_stats (STORED PROCEDURE)
-- Returns grouped statistics for a student's applications
CREATE OR REPLACE FUNCTION get_student_application_stats(p_student_id INTEGER)
RETURNS TABLE (
    total_applications BIGINT,
    active_offers BIGINT,
    interviews BIGINT,
    rejected BIGINT
) AS \$\$
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
\$\$ LANGUAGE plpgsql;

