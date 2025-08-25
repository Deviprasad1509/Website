-- Simplified Storage Setup for BuisBuz Ebook Store
-- Run this AFTER creating the 'book-assets' bucket in Storage dashboard

-- First, make sure you created the 'book-assets' bucket in Storage UI and set it to PUBLIC

-- Create storage policies using the standard CREATE POLICY syntax
-- This approach is more reliable than INSERT INTO storage.policies

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'book-assets' AND auth.role() = 'authenticated');

-- Allow anyone to view/download files (needed for book covers and PDFs)
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT 
USING (bucket_id = 'book-assets');

-- Allow authenticated users to update files
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'book-assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete files  
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE 
USING (bucket_id = 'book-assets' AND auth.role() = 'authenticated');

-- Success message
SELECT 'Storage policies created successfully! File uploads should now work.' as status;
