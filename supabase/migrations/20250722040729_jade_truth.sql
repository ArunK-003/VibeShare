/*
  # Add Foreign Key Relationship Between Songs and User Profiles

  1. Changes
    - Add foreign key constraint from songs.user_id to user_profiles.id
    - This enables Supabase to resolve the relationship for join queries

  2. Security
    - Uses CASCADE delete to maintain referential integrity
*/

-- Add foreign key constraint between songs.user_id and user_profiles.id
ALTER TABLE public.songs 
ADD CONSTRAINT fk_songs_user_profiles 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;