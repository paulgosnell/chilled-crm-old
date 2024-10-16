-- Add subscription_plan column to users table if it doesn't exist
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS subscription_plan TEXT;

-- Add trial_ends_at column to users table if it doesn't exist
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;