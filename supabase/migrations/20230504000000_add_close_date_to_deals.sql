-- Add close_date column to deals table
ALTER TABLE deals ADD COLUMN close_date DATE;

-- Update existing deals with a default close date (you can adjust this as needed)
UPDATE deals SET close_date = CURRENT_DATE + INTERVAL '30 days' WHERE close_date IS NULL;

-- Make close_date NOT NULL for future entries
ALTER TABLE deals ALTER COLUMN close_date SET NOT NULL;