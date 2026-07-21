-- ============================================================================
-- MEMBER MANAGEMENT SYSTEM — New table for TitanForge Gym
-- Run this in Supabase SQL Editor
-- ============================================================================

-- 1. members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id text NOT NULL UNIQUE,                -- e.g. "TF-001" (auto-generated)
  name text NOT NULL,
  phone text NOT NULL,
  email text DEFAULT '',
  plan text DEFAULT 'basic',                     -- basic, warrior, titan
  membership_start date NOT NULL DEFAULT CURRENT_DATE,
  membership_end date NOT NULL,
  fees_paid boolean DEFAULT true,
  fees_amount numeric DEFAULT 0,                 -- last paid amount
  last_checkin timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'inactive')),
  notes text DEFAULT '',
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,  -- optional link to lead
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. check_ins table (attendance)
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  check_in_date date NOT NULL DEFAULT CURRENT_DATE,
  check_in_time time NOT DEFAULT CURRENT_TIME,
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_member_id ON members(member_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_member_id ON check_ins(member_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON check_ins(check_in_date);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Public read for active members count only (no personal data)
CREATE POLICY "Public read active count" ON members FOR SELECT USING (status = 'active');

-- Admin full access
CREATE POLICY "Admin all members" ON members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all check_ins" ON check_ins FOR ALL USING (auth.role() = 'authenticated');

-- Function to auto-generate member_id
CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS text AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SPLIT_PART(member_id, '-', 2) AS integer)), 0) + 1
  INTO next_num
  FROM members;
  RETURN 'TF-' || LPAD(next_num::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

