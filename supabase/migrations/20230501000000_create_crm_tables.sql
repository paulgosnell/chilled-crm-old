-- Check if companies table exists and create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'companies') THEN
        CREATE TABLE companies (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id),
            name TEXT NOT NULL,
            industry TEXT,
            location TEXT,
            contact TEXT,
            logo TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
    ELSE
        -- If the table already exists, we'll add any missing columns
        BEGIN
            ALTER TABLE companies ADD COLUMN IF NOT EXISTS contact TEXT;
            ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo TEXT;
        EXCEPTION
            WHEN duplicate_column THEN
                -- Do nothing, column already exists
        END;
    END IF;
END $$;

-- ... (rest of the file remains unchanged)