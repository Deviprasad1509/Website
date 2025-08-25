-- Row Level Security (RLS) Policies for BuisBuz Ebook Store

-- Profiles table policies
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Auto-create profile on signup
CREATE POLICY "Enable insert for authenticated users during signup" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Ebooks table policies
-- Everyone can view ebooks (public read access)
CREATE POLICY "Anyone can view ebooks" ON ebooks
    FOR SELECT USING (true);

-- Only admins can insert, update, delete ebooks
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
-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders (for payment status)
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update any order
CREATE POLICY "Admins can update any order" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Order items table policies
-- Users can view order items for their own orders
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

-- Users can create order items for their own orders
CREATE POLICY "Users can create own order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- User library table policies
-- Users can view their own library
CREATE POLICY "Users can view own library" ON user_library
    FOR SELECT USING (auth.uid() = user_id);

-- Users can add books to their own library (after purchase)
CREATE POLICY "Users can add to own library" ON user_library
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all user libraries
CREATE POLICY "Admins can view all libraries" ON user_library
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- System can add books to user library (for completed purchases)
-- This policy allows the system to add books when payments are completed
CREATE POLICY "System can add books to library on payment completion" ON user_library
    FOR INSERT WITH CHECK (true);

-- Categories table policies
-- Everyone can view categories
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

-- Only admins can manage categories
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
