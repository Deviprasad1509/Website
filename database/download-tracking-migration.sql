-- Migration script to add download tracking to user_library table
-- Run this in your Supabase SQL Editor

-- Add download tracking columns to user_library table
ALTER TABLE user_library 
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_downloaded_at TIMESTAMP WITH TIME ZONE;

-- Update existing records to have download_count = 0
UPDATE user_library 
SET download_count = 0 
WHERE download_count IS NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_library_download_count ON user_library(download_count);
CREATE INDEX IF NOT EXISTS idx_user_library_last_downloaded ON user_library(last_downloaded_at);

-- Function to handle payment completion and add books to library
CREATE OR REPLACE FUNCTION handle_payment_completion(
  p_user_id UUID,
  p_order_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Insert books from order into user library
  INSERT INTO user_library (user_id, ebook_id, purchased_at, download_count)
  SELECT 
    p_user_id,
    oi.ebook_id,
    NOW(),
    0
  FROM order_items oi
  WHERE oi.order_id = p_order_id
  ON CONFLICT (user_id, ebook_id) 
  DO NOTHING; -- Don't duplicate if already exists
END;
$$ LANGUAGE plpgsql;

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(
  p_user_id UUID,
  p_ebook_id UUID
) RETURNS VOID AS $$
BEGIN
  UPDATE user_library 
  SET 
    download_count = download_count + 1,
    last_downloaded_at = NOW()
  WHERE user_id = p_user_id 
    AND ebook_id = p_ebook_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policy for user_library table (if not exists)
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own library" ON user_library;
DROP POLICY IF EXISTS "Users can insert into their own library" ON user_library;
DROP POLICY IF EXISTS "Users can update their own library" ON user_library;

-- Create RLS policies
CREATE POLICY "Users can view their own library" 
ON user_library FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own library" 
ON user_library FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own library" 
ON user_library FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a view for easy querying of user library with ebook details
CREATE OR REPLACE VIEW user_library_with_books AS
SELECT 
  ul.id,
  ul.user_id,
  ul.ebook_id,
  ul.purchased_at,
  ul.download_count,
  ul.last_downloaded_at,
  e.title,
  e.author,
  e.price,
  e.cover_image,
  e.pdf_url,
  e.category,
  e.description
FROM user_library ul
JOIN ebooks e ON ul.ebook_id = e.id;

-- Grant access to the view
GRANT SELECT ON user_library_with_books TO authenticated;
