-- Migration script for new features added to BuisBuz Ebook Store
-- Run this in your Supabase SQL Editor to add new functionality

-- 1. Create categories table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Add missing columns to existing tables (if they don't exist)
-- Add tags column to ebooks if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ebooks' AND column_name = 'tags') THEN
        ALTER TABLE ebooks ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- Add is_featured column to ebooks if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ebooks' AND column_name = 'is_featured') THEN
        ALTER TABLE ebooks ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add pdf_url column to ebooks if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ebooks' AND column_name = 'pdf_url') THEN
        ALTER TABLE ebooks ADD COLUMN pdf_url TEXT;
    END IF;
END $$;

-- Add cover_image column to ebooks if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ebooks' AND column_name = 'cover_image') THEN
        ALTER TABLE ebooks ADD COLUMN cover_image TEXT;
    END IF;
END $$;

-- 3. Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_ebooks_category ON ebooks(category);
CREATE INDEX IF NOT EXISTS idx_ebooks_featured ON ebooks(is_featured);
CREATE INDEX IF NOT EXISTS idx_ebooks_created_at ON ebooks(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- 4. Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create triggers for updated_at columns (if they don't exist)
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Also ensure ebooks has the trigger
DROP TRIGGER IF EXISTS update_ebooks_updated_at ON ebooks;
CREATE TRIGGER update_ebooks_updated_at BEFORE UPDATE ON ebooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Enable Row Level Security on new table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for categories table
-- Everyone can view categories
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

-- Only admins can manage categories
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
CREATE POLICY "Admins can insert categories" ON categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can update categories" ON categories;
CREATE POLICY "Admins can update categories" ON categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
CREATE POLICY "Admins can delete categories" ON categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 8. Insert default categories (only if they don't exist)
INSERT INTO categories (name, description, slug) 
SELECT * FROM (VALUES
    ('Fiction', 'Imaginative stories and literary works', 'fiction'),
    ('Non-Fiction', 'Factual and educational content', 'non-fiction'),
    ('Self-Help', 'Personal development and improvement', 'self-help'),
    ('Science Fiction', 'Futuristic and scientific storytelling', 'science-fiction'),
    ('Romance', 'Love stories and relationships', 'romance'),
    ('Mystery', 'Suspenseful and puzzle-solving narratives', 'mystery'),
    ('Biography', 'Life stories of notable individuals', 'biography'),
    ('History', 'Historical events and periods', 'history'),
    ('Business', 'Entrepreneurship and business strategy', 'business'),
    ('Technology', 'Technical knowledge and innovation', 'technology')
) AS new_categories(name, description, slug)
WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE categories.name = new_categories.name
);

-- 9. Update any existing books to have proper featured status (optional)
-- Mark some popular books as featured if they aren't already
UPDATE ebooks SET is_featured = true 
WHERE title IN (
    'The Midnight Library',
    'Atomic Habits', 
    'Dune',
    'Educated',
    'Sapiens',
    'Becoming',
    '1984',
    'Project Hail Mary'
) AND is_featured = false;

-- 10. Add some sample tags to existing books (optional)
UPDATE ebooks SET tags = ARRAY['Philosophy', 'Contemporary Fiction', 'Mental Health'] 
WHERE title = 'The Midnight Library' AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE ebooks SET tags = ARRAY['Self-Improvement', 'Psychology', 'Productivity'] 
WHERE title = 'Atomic Habits' AND (tags IS NULL OR array_length(tags, 1) IS NULL);

UPDATE ebooks SET tags = ARRAY['Epic Fantasy', 'Space Opera', 'Politics'] 
WHERE title = 'Dune' AND (tags IS NULL OR array_length(tags, 1) IS NULL);

-- Migration complete message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully! New features added:';
    RAISE NOTICE '- Categories table with management functionality';
    RAISE NOTICE '- Enhanced ebooks table with tags, featured status, and file URLs';
    RAISE NOTICE '- Proper indexes and triggers';
    RAISE NOTICE '- Row Level Security policies';
    RAISE NOTICE '- Default categories and sample data';
    RAISE NOTICE '';
    RAISE NOTICE 'Your database is now ready for the new admin features!';
END $$;
