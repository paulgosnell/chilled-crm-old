-- Update users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS product_or_service TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS target_market TEXT;

-- Create a function to update the updated_at column (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_modtime') THEN
        CREATE TRIGGER update_user_modtime
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_modified_column();
    END IF;
END $$;

-- Ensure RLS is enabled on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_policy
        WHERE polname = 'users_policy'
    ) THEN
        DROP POLICY users_policy ON users;
    END IF;
END $$;

-- Create new policy for users table
CREATE POLICY users_policy ON users
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());