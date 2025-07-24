/*
  # Music Room Database Schema

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `name` (text)
      - `admin_id` (uuid, references auth.users)
      - `created_at` (timestamp)
    - `songs`
      - `id` (uuid, primary key)
      - `room_id` (uuid, references rooms)
      - `user_id` (uuid, references auth.users)
      - `file_url` (text)
      - `file_name` (text)
      - `order` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
    - Users can read all rooms but only create/update their own
    - Users can read all songs in a room and manage their own songs

  3. Storage
    - Create storage bucket for song files
    - Set up public access policies for uploaded files
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms table
CREATE POLICY "Anyone can read rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create rooms"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Admins can update their rooms"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = admin_id)
  WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Admins can delete their rooms"
  ON rooms
  FOR DELETE
  TO authenticated
  USING (auth.uid() = admin_id);

-- Create policies for songs table
CREATE POLICY "Anyone can read songs"
  ON songs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add songs"
  ON songs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their songs"
  ON songs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their songs"
  ON songs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for songs
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('songs', 'songs', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create storage policies
CREATE POLICY "Anyone can view song files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'songs');

CREATE POLICY "Authenticated users can upload song files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'songs');

CREATE POLICY "Users can update their song files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'songs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their song files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'songs' AND auth.uid()::text = (storage.foldername(name))[1]);