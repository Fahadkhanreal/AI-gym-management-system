-- ============================================================================
-- HOTFIX: Allow "member" status in leads table
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Drop existing constraint (if it exists) and recreate with "member" included
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'converted', 'closed', 'member'));
