-- Add before/after image columns to transformations
ALTER TABLE transformations
  ADD COLUMN IF NOT EXISTS before_image_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS after_image_url text DEFAULT '';
