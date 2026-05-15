-- Migration: Replace semester/cv_url with education/achievements
-- Run this against your Neon database

-- Add new columns
ALTER TABLE students ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS achievements TEXT;

-- Drop old columns (if they exist)
ALTER TABLE students DROP COLUMN IF EXISTS semester;
ALTER TABLE students DROP COLUMN IF EXISTS cv_url;

-- Update the profile score trigger function
CREATE OR REPLACE FUNCTION calculate_profile_score()
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
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trg_update_profile_score ON students;
CREATE TRIGGER trg_update_profile_score
BEFORE INSERT OR UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION calculate_profile_score();
