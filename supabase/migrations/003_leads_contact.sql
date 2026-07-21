-- ============================================================================
-- TitanForge Gym — Leads expansion + Contact/Trial tables
-- ============================================================================

-- 1. Add new columns to existing leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fitness_goal text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS experience_level text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_time text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS days_per_week integer;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS consented boolean DEFAULT false;

-- Add RLS policy for public insert (contact form and trial signup)
CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);
