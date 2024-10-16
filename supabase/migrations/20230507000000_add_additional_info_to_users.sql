-- Add additional_info column to users table
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS additional_info TEXT;