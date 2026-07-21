-- ============================================================================
-- Admin sidebar navigation order (global for all admin users)
-- Stores JSON array of href paths in desired order
-- ============================================================================

-- Add sidebar_order column to gym_settings (single-row config table)
ALTER TABLE gym_settings ADD COLUMN IF NOT EXISTS sidebar_order jsonb DEFAULT '[]';
