-- Add Hero stats fields to gym_settings
ALTER TABLE gym_settings
  ADD COLUMN IF NOT EXISTS hero_stat_members text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_stat_years text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_stat_award text DEFAULT '';
