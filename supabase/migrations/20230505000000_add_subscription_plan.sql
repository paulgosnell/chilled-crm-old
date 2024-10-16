-- Add subscriptionPlan column to users table
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS subscription_plan TEXT;

-- Add trialEndsAt column to users table
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread'
);

-- Enable Row Level Security on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own notifications
CREATE POLICY notifications_policy ON public.notifications
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());