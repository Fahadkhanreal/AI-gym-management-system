-- Add is_approved column to testimonials for user-submission flow
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;
-- New testimonials from users start as unapproved
-- Admin approves → is_approved = true AND is_active = true
