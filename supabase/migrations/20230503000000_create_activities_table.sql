-- Create activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    related_to_type TEXT,
    related_to_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for faster queries
CREATE INDEX idx_activities_user_id ON activities(user_id);

-- Enable Row Level Security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own activities
CREATE POLICY activities_policy ON activities
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());