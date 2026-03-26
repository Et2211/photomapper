-- Run this in your Supabase SQL editor to set up the database

-- 1. Create the photos table
CREATE TABLE IF NOT EXISTS photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username    TEXT NOT NULL,
  photo_name  TEXT NOT NULL,
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  url         TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to read photos
CREATE POLICY "Public read access"
  ON photos FOR SELECT
  USING (true);

-- 4. Allow anyone to insert photos
CREATE POLICY "Public insert access"
  ON photos FOR INSERT
  WITH CHECK (true);

-- 5. Create the storage bucket (run in Supabase dashboard or via API)
-- Bucket name: photomapper
-- Public: true
