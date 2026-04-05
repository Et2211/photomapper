-- Run this in your Supabase SQL editor to set up the database

-- 1. Create the photos table
CREATE TABLE IF NOT EXISTS photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

-- 4. Only authenticated users can insert their own photos
DROP POLICY IF EXISTS "Public insert access" ON photos;
CREATE POLICY "Authenticated insert"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5. Users can delete their own photos
CREATE POLICY "Owner delete"
  ON photos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Users can update their own photos
CREATE POLICY "Owner update"
  ON photos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Create the storage bucket (run in Supabase dashboard or via API)
-- Bucket name: photomapper
-- Public: true

-- 8. Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url   TEXT,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 9. Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 10. Anyone can read profiles (display names are public)
CREATE POLICY "Public read access"
  ON profiles FOR SELECT
  USING (true);

-- 11. Authenticated users can insert their own profile
CREATE POLICY "Owner insert"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 12. Users can update their own profile
CREATE POLICY "Owner update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
