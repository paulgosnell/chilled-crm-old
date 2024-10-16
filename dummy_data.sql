-- Replace 'YOUR_USER_ID' with your actual user ID from Supabase
DO $$
DECLARE
    user_id UUID := '21a9c2f2-3a25-42da-8d7e-2a429f93c6c2';
BEGIN

-- Insert dummy contacts
INSERT INTO contacts (user_id, name, email, company, industry, location, phone, avatar)
VALUES
    (user_id, 'John Doe', 'john@example.com', 'Tech Corp', 'Technology', 'New York, USA', '+1 123-456-7890', 'https://api.dicebear.com/6.x/initials/svg?seed=John%20Doe'),
    (user_id, 'Jane Smith', 'jane@example.com', 'Health Inc.', 'Healthcare', 'Los Angeles, USA', '+1 987-654-3210', 'https://api.dicebear.com/6.x/initials/svg?seed=Jane%20Smith'),
    (user_id, 'Bob Johnson', 'bob@example.com', 'Finance Co', 'Finance', 'Chicago, USA', '+1 555-123-4567', 'https://api.dicebear.com/6.x/initials/svg?seed=Bob%20Johnson'),
    (user_id, 'Alice Brown', 'alice@example.com', 'Edu Learn', 'Education', 'Boston, USA', '+1 444-555-6666', 'https://api.dicebear.com/6.x/initials/svg?seed=Alice%20Brown'),
    (user_id, 'Charlie Green', 'charlie@example.com', 'Green Energy', 'Renewable Energy', 'San Francisco, USA', '+1 777-888-9999', 'https://api.dicebear.com/6.x/initials/svg?seed=Charlie%20Green');

-- Insert dummy companies
INSERT INTO companies (user_id, name, industry, location, contact, logo)
VALUES
    (user_id, 'Tech Corp', 'Technology', 'New York, USA', 'John Doe', 'https://api.dicebear.com/6.x/initials/svg?seed=Tech%20Corp'),
    (user_id, 'Health Inc.', 'Healthcare', 'Los Angeles, USA', 'Jane Smith', 'https://api.dicebear.com/6.x/initials/svg?seed=Health%20Inc.'),
    (user_id, 'Finance Co', 'Finance', 'Chicago, USA', 'Bob Johnson', 'https://api.dicebear.com/6.x/initials/svg?seed=Finance%20Co'),
    (user_id, 'Edu Learn', 'Education', 'Boston, USA', 'Alice Brown', 'https://api.dicebear.com/6.x/initials/svg?seed=Edu%20Learn'),
    (user_id, 'Green Energy', 'Renewable Energy', 'San Francisco, USA', 'Charlie Green', 'https://api.dicebear.com/6.x/initials/svg?seed=Green%20Energy');

-- Insert dummy deals
INSERT INTO deals (user_id, name, company, value, stage, contact)
VALUES
    (user_id, 'Cloud Migration', 'Tech Corp', 50000, 'Pitch', 'John Doe'),
    (user_id, 'Healthcare Software', 'Health Inc.', 75000, 'Meet', 'Jane Smith'),
    (user_id, 'Financial Consulting', 'Finance Co', 100000, 'Won', 'Bob Johnson'),
    (user_id, 'E-learning Platform', 'Edu Learn', 60000, 'Pitch', 'Alice Brown'),
    (user_id, 'Solar Panel Installation', 'Green Energy', 85000, 'Meet', 'Charlie Green');

-- Insert dummy tasks
INSERT INTO tasks (user_id, title, priority, category, attached_to_type, attached_to_name, status, due_date)
VALUES
    (user_id, 'Follow up with Tech Corp', 'High', 'Sales', 'Company', 'Tech Corp', 'Open', NOW() + INTERVAL '2 days'),
    (user_id, 'Prepare healthcare proposal', 'Medium', 'Project Management', 'Deal', 'Healthcare Software', 'Open', NOW() + INTERVAL '5 days'),
    (user_id, 'Review financial report', 'Low', 'Finance', 'Company', 'Finance Co', 'Done', NOW() - INTERVAL '1 day'),
    (user_id, 'Schedule demo with Edu Learn', 'Medium', 'Sales', 'Deal', 'E-learning Platform', 'Open', NOW() + INTERVAL '3 days'),
    (user_id, 'Research green energy trends', 'Low', 'Research', 'Company', 'Green Energy', 'Open', NOW() + INTERVAL '7 days');

END $$;