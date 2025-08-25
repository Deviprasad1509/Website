-- Storage bucket setup for BuisBuz Ebook Store
-- Run this in your Supabase SQL Editor after creating the 'book-assets' bucket in the Storage UI

-- Note: First create the 'book-assets' bucket in your Supabase Storage dashboard
-- Set it to PUBLIC so files can be accessed by users

-- 1. Storage policies for book-assets bucket
-- Allow authenticated users to upload files
INSERT INTO storage.policies (id, name, bucket_id, policy, definition, check)
VALUES (
    'authenticated-uploads-policy',
    'Authenticated users can upload files',
    'book-assets',
    'INSERT',
    'auth.role() = ''authenticated''',
    'auth.role() = ''authenticated'''
)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view/download files (needed for book covers and PDFs)
INSERT INTO storage.policies (id, name, bucket_id, policy, definition, check)
VALUES (
    'public-view-policy',
    'Public can view files',
    'book-assets',
    'SELECT',
    'bucket_id = ''book-assets''',
    'bucket_id = ''book-assets'''
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to update their uploads
INSERT INTO storage.policies (id, name, bucket_id, policy, definition, check)
VALUES (
    'authenticated-update-policy',
    'Users can update files',
    'book-assets',
    'UPDATE',
    'auth.role() = ''authenticated''',
    'auth.role() = ''authenticated'''
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to delete their uploads
INSERT INTO storage.policies (id, name, bucket_id, policy, definition, check)
VALUES (
    'authenticated-delete-policy',
    'Users can delete files',
    'book-assets',
    'DELETE',
    'auth.role() = ''authenticated''',
    'auth.role() = ''authenticated'''
)
ON CONFLICT (id) DO NOTHING;

-- Alternative approach using CREATE POLICY (if the above doesn't work)
-- Uncomment these if you need to use CREATE POLICY instead:

/*
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'book-assets' AND auth.role() = 'authenticated'
);

-- Allow public access to download files
CREATE POLICY "Public can view files" ON storage.objects
FOR SELECT USING (bucket_id = 'book-assets');

-- Allow authenticated users to update their uploads  
CREATE POLICY "Users can update files" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'book-assets' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Users can delete files" ON storage.objects
FOR DELETE USING (
    bucket_id = 'book-assets' AND auth.role() = 'authenticated'
);
*/

-- Storage setup complete message
DO $$
BEGIN
    RAISE NOTICE 'Storage policies configured successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'Make sure you have:';
    RAISE NOTICE '1. Created a bucket named "book-assets" in Storage dashboard';
    RAISE NOTICE '2. Set the bucket to PUBLIC';
    RAISE NOTICE '3. Enabled RLS on storage.objects (should be default)';
    RAISE NOTICE '';
    RAISE NOTICE 'Your file upload system is now ready!';
END $$;
