-- ====================================================================
-- 🚀 BUISBUZ EBOOK STORE - OPTIMIZED SUPABASE DATABASE SCHEMA
-- ====================================================================
-- This is a completely NEW and IMPROVED database schema
-- Please DELETE the old tables before running this script
-- ====================================================================

-- ============================================================================
-- STEP 1: DROP EXISTING TABLES (IF THEY EXIST)
-- ============================================================================
-- Run these first to clean up any existing schema
DROP TABLE IF EXISTS public.user_library CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.ebooks CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;

-- ============================================================================
-- STEP 2: CREATE ENUMS
-- ============================================================================
CREATE TYPE public.user_role AS ENUM ('user', 'admin');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- ============================================================================
-- STEP 3: CREATE TABLES
-- ============================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    role public.user_role NOT NULL DEFAULT 'user',
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Categories table
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Ebooks table
CREATE TABLE public.ebooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cover_image TEXT,
    pdf_url TEXT,
    category TEXT NOT NULL,
    isbn TEXT,
    publisher TEXT DEFAULT '',
    publication_date DATE,
    page_count INTEGER DEFAULT 0,
    language TEXT DEFAULT 'English',
    file_size INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Orders table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    order_number TEXT UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_status public.payment_status DEFAULT 'pending',
    payment_method TEXT,
    payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    billing_address JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Order items table
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    ebook_id UUID REFERENCES public.ebooks(id) ON DELETE CASCADE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- User library table (tracks purchased/free books)
CREATE TABLE public.user_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    ebook_id UUID REFERENCES public.ebooks(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 3,
    last_downloaded_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, ebook_id)
);

-- ============================================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);
CREATE INDEX idx_categories_sort_order ON public.categories(sort_order);

CREATE INDEX idx_ebooks_category ON public.ebooks(category);
CREATE INDEX idx_ebooks_is_featured ON public.ebooks(is_featured);
CREATE INDEX idx_ebooks_is_active ON public.ebooks(is_active);
CREATE INDEX idx_ebooks_price ON public.ebooks(price);
CREATE INDEX idx_ebooks_created_at ON public.ebooks(created_at);
CREATE INDEX idx_ebooks_title_search ON public.ebooks USING gin(to_tsvector('english', title || ' ' || author || ' ' || description));

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_ebook_id ON public.order_items(ebook_id);

CREATE INDEX idx_user_library_user_id ON public.user_library(user_id);
CREATE INDEX idx_user_library_ebook_id ON public.user_library(ebook_id);
CREATE INDEX idx_user_library_purchased_at ON public.user_library(purchased_at);
CREATE INDEX idx_user_library_is_active ON public.user_library(is_active);

-- ============================================================================
-- STEP 5: CREATE FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::TEXT FROM 1 FOR 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, is_email_verified)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle email confirmation
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        UPDATE public.profiles 
        SET is_email_verified = TRUE
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add book to user library
CREATE OR REPLACE FUNCTION public.add_to_user_library(
    p_user_id UUID,
    p_ebook_id UUID,
    p_order_id UUID DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_library (user_id, ebook_id, order_id, max_downloads)
    SELECT 
        p_user_id,
        p_ebook_id,
        p_order_id,
        CASE 
            WHEN e.price = 0 THEN -1  -- Unlimited downloads for free books
            ELSE 3                    -- 3 downloads for paid books
        END
    FROM public.ebooks e
    WHERE e.id = p_ebook_id
    ON CONFLICT (user_id, ebook_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to track download
CREATE OR REPLACE FUNCTION public.track_download(
    p_user_id UUID,
    p_ebook_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    library_record RECORD;
    can_download BOOLEAN := FALSE;
BEGIN
    -- Get library record
    SELECT * INTO library_record
    FROM public.user_library
    WHERE user_id = p_user_id AND ebook_id = p_ebook_id AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if can download
    IF library_record.max_downloads = -1 OR library_record.download_count < library_record.max_downloads THEN
        can_download := TRUE;
        
        -- Update download count
        UPDATE public.user_library
        SET 
            download_count = download_count + 1,
            last_downloaded_at = TIMEZONE('utc'::TEXT, NOW())
        WHERE id = library_record.id;
        
        -- Update ebook download count
        UPDATE public.ebooks
        SET download_count = download_count + 1
        WHERE id = p_ebook_id;
    END IF;
    
    RETURN can_download;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 6: CREATE TRIGGERS
-- ============================================================================

-- Updated at triggers
CREATE TRIGGER trigger_profiles_updated_at 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_categories_updated_at 
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_ebooks_updated_at 
    BEFORE UPDATE ON public.ebooks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at 
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Order number generation trigger
CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- User signup trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Email confirmation trigger
CREATE OR REPLACE TRIGGER on_auth_user_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmation();

-- ============================================================================
-- STEP 7: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 8: CREATE RLS POLICIES
-- ============================================================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Enable insert for authenticated users during signup" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies
CREATE POLICY "Anyone can view active categories" ON public.categories
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can do everything with categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Ebooks policies
CREATE POLICY "Anyone can view active ebooks" ON public.ebooks
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can do everything with ebooks" ON public.ebooks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all orders" ON public.orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Order items policies
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User library policies
CREATE POLICY "Users can view their own library" ON public.user_library
    FOR SELECT USING (auth.uid() = user_id AND is_active = TRUE);

CREATE POLICY "Users can insert into their own library" ON public.user_library
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own library" ON public.user_library
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all libraries" ON public.user_library
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- STEP 9: INSERT DEFAULT DATA
-- ============================================================================

-- Insert default categories
INSERT INTO public.categories (name, description, slug, sort_order) VALUES
    ('Fiction', 'Novels, short stories, and imaginative literature', 'fiction', 1),
    ('Non-Fiction', 'Factual books, biographies, and educational content', 'non-fiction', 2),
    ('Self-Help', 'Personal development and improvement guides', 'self-help', 3),
    ('Science Fiction', 'Futuristic and scientific storytelling', 'science-fiction', 4),
    ('Romance', 'Love stories and romantic novels', 'romance', 5),
    ('Mystery', 'Detective stories and suspenseful narratives', 'mystery', 6),
    ('Biography', 'Life stories of notable individuals', 'biography', 7),
    ('History', 'Historical events and periods', 'history', 8),
    ('Business', 'Entrepreneurship and business strategy', 'business', 9),
    ('Technology', 'Technical knowledge and innovation', 'technology', 10)
ON CONFLICT (name) DO NOTHING;

-- Insert sample ebooks
INSERT INTO public.ebooks (title, author, description, price, category, tags, is_featured, language, page_count) VALUES
    ('The Digital Revolution', 'Sarah Chen', 'A comprehensive guide to understanding how digital technology is reshaping our world.', 24.99, 'Technology', ARRAY['digital', 'technology', 'future'], true, 'English', 320),
    ('Free Guide to Productivity', 'Mike Johnson', 'Essential tips and techniques for maximizing your daily productivity and time management.', 0.00, 'Self-Help', ARRAY['productivity', 'free', 'time-management'], false, 'English', 150),
    ('The Mystery of Echo Valley', 'Emma Wilson', 'A thrilling detective story set in a small mountain town with dark secrets.', 14.99, 'Mystery', ARRAY['detective', 'thriller', 'small-town'], true, 'English', 280),
    ('Ancient Civilizations Uncovered', 'Dr. Robert Martinez', 'Explore the fascinating world of ancient civilizations and their lasting impact.', 19.99, 'History', ARRAY['ancient', 'civilization', 'archaeology'], false, 'English', 420),
    ('Love in the Digital Age', 'Amanda Foster', 'A modern romance novel about finding love through technology and social media.', 12.99, 'Romance', ARRAY['modern', 'technology', 'social-media'], false, 'English', 250)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 10: CREATE VIEWS FOR EASY DATA ACCESS
-- ============================================================================

-- View for user library with book details
CREATE OR REPLACE VIEW public.user_library_with_details AS
SELECT 
    ul.id,
    ul.user_id,
    ul.ebook_id,
    ul.purchased_at,
    ul.download_count,
    ul.max_downloads,
    ul.last_downloaded_at,
    ul.is_active,
    e.title,
    e.author,
    e.description,
    e.price,
    e.cover_image,
    e.pdf_url,
    e.category,
    e.tags,
    e.language,
    e.page_count,
    e.file_size,
    CASE 
        WHEN ul.max_downloads = -1 THEN true
        WHEN ul.download_count < ul.max_downloads THEN true
        ELSE false
    END AS can_download
FROM public.user_library ul
JOIN public.ebooks e ON ul.ebook_id = e.id
WHERE ul.is_active = true AND e.is_active = true;

-- ============================================================================
-- STEP 11: GRANT PERMISSIONS
-- ============================================================================
GRANT SELECT ON public.user_library_with_details TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ============================================================================
-- 🎉 SETUP COMPLETE!
-- ============================================================================

-- Your new Supabase database is ready with:
-- ✅ Improved table structure with better data types
-- ✅ Enhanced admin role management
-- ✅ Better email verification handling
-- ✅ Optimized indexes for performance
-- ✅ Comprehensive RLS policies
-- ✅ Automated triggers for data consistency
-- ✅ Sample data for testing
-- ✅ Helpful views for common queries

-- NEXT STEPS:
-- 1. Delete your old database tables in Supabase dashboard
-- 2. Run this script in your Supabase SQL Editor
-- 3. Create your first admin user using the admin creation script
-- 4. Test the application functionality

-- ADMIN USER CREATION:
-- After running this schema, create an admin user with:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
