/*
  # Add Storage Policies for Audio Files

  1. Storage Setup
    - Create songs bucket for audio files
    - Set up RLS policies for file access
    
  2. Security
    - Allow authenticated users to upload files
    - Allow public read access to audio files
    - Users can delete their own files
*/

-- Create storage bucket for songs (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'songs');

-- Allow public read access to audio files
CREATE POLICY "Public can view audio files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'songs');

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own audio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'songs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own files
CREATE POLICY "Users can update their own audio files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'songs' AND auth.uid()::text = (storage.foldername(name))[1]);