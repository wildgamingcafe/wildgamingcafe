-- Enable the pg_cron extension (Supabase supports this by default)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cron job to run every day at midnight ('0 0 * * *')
-- It deletes rows from 'games' and 'events' where status is 'Trashed' 
-- AND they haven't been updated in 30 days.

SELECT cron.schedule(
  'purge-trashed-data-daily', 
  '0 0 * * *', 
  $$
    DELETE FROM games WHERE status = 'Trashed' AND updated_at < now() - interval '30 days';
    DELETE FROM events WHERE status = 'Trashed' AND updated_at < now() - interval '30 days';
    DELETE FROM gallery WHERE status = 'Trashed' AND updated_at < now() - interval '30 days';
  $$
);

-- NOTE: You will need to make sure your tables have an 'updated_at' column for this to work perfectly.
-- If they don't, we can add them:
ALTER TABLE games ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
