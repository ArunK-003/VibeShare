/*
  # Add user profiles and update songs table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `display_name` (text)
      - `created_at` (timestamp)

  2. Changes to existing tables
    - Add `display_name` column to songs table for easier querying

  3. Security
    - Enable RLS on `user_profiles` table
    - Add policies for user profiles
    - Update songs policies
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add display_name to songs table for easier querying
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'songs' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE songs ADD COLUMN display_name text;
  END IF;
END $$;

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Update songs policies to include display_name
DROP POLICY IF EXISTS "Users can add songs" ON songs;
CREATE POLICY "Users can add songs"
  ON songs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to get user's song count in a room
CREATE OR REPLACE FUNCTION get_user_song_count(room_uuid uuid, user_uuid uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM songs
    WHERE room_id = room_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;