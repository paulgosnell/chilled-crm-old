-- Replace 'YOUR_USER_ID' with your actual user ID from Supabase
DO $$
DECLARE
    user_id UUID := 'YOUR_USER_ID';
BEGIN

DELETE FROM contacts WHERE user_id = user_id;
DELETE FROM companies WHERE user_id = user_id;
DELETE FROM deals WHERE user_id = user_id;
DELETE FROM tasks WHERE user_id = user_id;

END $$;