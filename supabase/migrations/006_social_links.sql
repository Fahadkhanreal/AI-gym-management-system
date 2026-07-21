-- Add social media URL fields to gym_settings
ALTER TABLE gym_settings
  ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS twitter_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS linkedin_url text DEFAULT '';
