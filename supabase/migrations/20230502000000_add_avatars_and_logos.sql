-- Add avatar column to contacts table
ALTER TABLE contacts ADD COLUMN avatar TEXT;

-- Add logo column to companies table
ALTER TABLE companies ADD COLUMN logo TEXT;

-- Update existing dummy data with placeholder avatars and logos
UPDATE contacts SET avatar = 'https://api.dicebear.com/6.x/initials/svg?seed=' || name WHERE avatar IS NULL;
UPDATE companies SET logo = 'https://api.dicebear.com/6.x/initials/svg?seed=' || name WHERE logo IS NULL;