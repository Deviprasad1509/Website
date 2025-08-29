-- COMPLETE SUPABASE DATABASE SETUP FOR BUISBUZ EBOOK STORE
-- Run this script in your Supabase SQL Editor to set up the complete database

-- ============================================================================
-- STEP 1: CREATE CUSTOM TYPES
-- ============================================================================
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');

-- ============================================================================
-- STEP 2: CREATE TABLES
-- ============================================================================

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create categories table for better category management
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ebooks table
CREATE TABLE ebooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cover_image TEXT,
    pdf_url TEXT,
    category TEXT NOT NULL,
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    ebook_id UUID REFERENCES ebooks(id) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_library table (tracks purchased books with download tracking)
CREATE TABLE user_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    ebook_id UUID REFERENCES ebooks(id) NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, ebook_id)
);

-- ============================================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_ebooks_category ON ebooks(category);
CREATE INDEX idx_ebooks_featured ON ebooks(is_featured);
CREATE INDEX idx_ebooks_created_at ON ebooks(created_at);
CREATE INDEX idx_ebooks_price ON ebooks(price);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(payment_status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_ebook_id ON order_items(ebook_id);
CREATE INDEX idx_user_library_user_id ON user_library(user_id);
CREATE INDEX idx_user_library_ebook_id ON user_library(ebook_id);
CREATE INDEX idx_user_library_download_count ON user_library(download_count);
CREATE INDEX idx_user_library_last_downloaded ON user_library(last_downloaded_at);
CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================================================
-- STEP 4: CREATE FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ebooks_updated_at BEFORE UPDATE ON ebooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to handle payment completion
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

-- ============================================================================
-- STEP 5: CREATE VIEWS
-- ============================================================================

-- View for user library with ebook details
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
  e.description,
  e.tags,
  e.is_featured
FROM user_library ul
JOIN ebooks e ON ul.ebook_id = e.id;

-- ============================================================================
-- STEP 6: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 7: CREATE RLS POLICIES
-- ============================================================================

-- Profiles table policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Enable insert for authenticated users during signup" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Ebooks table policies
CREATE POLICY "Anyone can view ebooks" ON ebooks
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert ebooks" ON ebooks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update ebooks" ON ebooks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete ebooks" ON ebooks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Orders table policies
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update any order" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Order items table policies
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User library table policies
CREATE POLICY "Users can view their own library" ON user_library
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own library" ON user_library
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own library" ON user_library
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all libraries" ON user_library
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Categories table policies
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories" ON categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update categories" ON categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete categories" ON categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- STEP 8: INSERT DEFAULT DATA
-- ============================================================================

-- Insert default categories
INSERT INTO categories (name, description, slug) VALUES
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
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 9: GRANT PERMISSIONS
-- ============================================================================
GRANT SELECT ON user_library_with_books TO authenticated;

-- ============================================================================
-- STEP 10: INSERT SAMPLE DATA (OPTIONAL)
-- ============================================================================

-- Sample ebooks for testing (uncomment if you want sample data)
/*
INSERT INTO ebooks (title, author, description, price, category, tags, is_featured) VALUES
    ('The Great Adventure', 'John Smith', 'An epic tale of courage and discovery in a mystical world.', 12.99, 'Fiction', ARRAY['adventure', 'fantasy', 'epic'], true),
    ('Digital Marketing Mastery', 'Sarah Johnson', 'Complete guide to modern digital marketing strategies.', 19.99, 'Business', ARRAY['marketing', 'digital', 'business'], true),
    ('Introduction to AI', 'Dr. Michael Chen', 'Understanding artificial intelligence and machine learning.', 24.99, 'Technology', ARRAY['ai', 'machine learning', 'tech'], false),
    ('Love in Paris', 'Emma Wilson', 'A romantic story set in the beautiful city of Paris.', 9.99, 'Romance', ARRAY['love', 'paris', 'romantic'], false),
    ('The Mystery of Blue Manor', 'Robert Brown', 'A thrilling detective story with unexpected twists.', 14.99, 'Mystery', ARRAY['detective', 'thriller', 'suspense'], true),
    ('Free Productivity Guide', 'Lisa Davis', 'Essential tips for better productivity and time management.', 0.00, 'Self-Help', ARRAY['productivity', 'free', 'guide'], false),
    ('History of Ancient Rome', 'Prof. James Wilson', 'Comprehensive study of Roman civilization and empire.', 22.99, 'History', ARRAY['rome', 'ancient', 'civilization'], false),
    ('The Entrepreneur Journey', 'Mark Thompson', 'Real stories from successful entrepreneurs.', 18.99, 'Business', ARRAY['entrepreneurship', 'startup', 'success'], false),
    ('Space Odyssey 2025', 'Alex Rivera', 'Science fiction adventure in the near future.', 16.99, 'Science Fiction', ARRAY['space', 'future', 'adventure'], true),
    ('Mindfulness for Beginners', 'Dr. Anna Lee', 'Introduction to mindfulness and meditation practices.', 13.99, 'Self-Help', ARRAY['mindfulness', 'meditation', 'wellness'], false);
*/

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

-- Your Supabase database is now fully configured with:
-- ✅ All required tables with proper relationships
-- ✅ Download tracking functionality
-- ✅ Row Level Security policies
-- ✅ Performance indexes
-- ✅ Automated triggers
-- ✅ Helper functions for payments and downloads
-- ✅ Default categories
-- ✅ User profile auto-creation on signup

-- Next steps:
-- 1. Set up Storage bucket named 'book-assets'
-- 2. Configure authentication providers
-- 3. Create your first admin user by updating the 'role' field in profiles table
-- 4. Test the application functionality
