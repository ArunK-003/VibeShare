/*
  # Update rooms table with settings and password

  1. Changes
    - Add password field for room security
    - Add max_songs_per_user setting (default 10)
    - Add songs_per_round setting (default 1)
    - Add room_code field for short room identification
    - Update RLS policies to handle password verification

  2. Security
    - Passwords are stored as plain text for simplicity (in production, should be hashed)
    - Room codes are unique 6-character strings
    - Updated policies for room access
*/

-- Add new columns to rooms table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rooms' AND column_name = 'password'
  ) THEN
    ALTER TABLE rooms ADD COLUMN password text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rooms' AND column_name = 'max_songs_per_user'
  ) THEN
    ALTER TABLE rooms ADD COLUMN max_songs_per_user integer DEFAULT 10;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rooms' AND column_name = 'songs_per_round'
  ) THEN
    ALTER TABLE rooms ADD COLUMN songs_per_round integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rooms' AND column_name = 'room_code'
  ) THEN
    ALTER TABLE rooms ADD COLUMN room_code text UNIQUE;
  END IF;
END $$;

-- Function to generate unique room code
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
  code_exists boolean := true;
BEGIN
  WHILE code_exists LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    SELECT EXISTS(SELECT 1 FROM rooms WHERE room_code = result) INTO code_exists;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update existing rooms to have room codes
UPDATE rooms SET room_code = generate_room_code() WHERE room_code IS NULL;

-- Make room_code NOT NULL after setting values
ALTER TABLE rooms ALTER COLUMN room_code SET NOT NULL;

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can read rooms" ON rooms;
CREATE POLICY "Anyone can read rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

-- Add function to verify room password
CREATE OR REPLACE FUNCTION verify_room_password(room_identifier text, provided_password text)
RETURNS boolean AS $$
DECLARE
  stored_password text;
BEGIN
  -- Try to find room by code first, then by ID
  SELECT password INTO stored_password
  FROM rooms
  WHERE room_code = room_identifier OR id::text = room_identifier;
  
  IF stored_password IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN stored_password = provided_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;