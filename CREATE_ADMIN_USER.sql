-- ====================================================================
-- 🛡️ ADMIN USER CREATION SCRIPT FOR BUISBUZ
-- ====================================================================
-- Run this AFTER setting up the new database schema
-- ====================================================================

-- STEP 1: First, sign up a regular user through the website
-- This will create the user in auth.users and profiles tables

-- STEP 2: Then run this script to make that user an admin
-- Replace 'admin@yourdomain.com' with the actual admin email

-- Option 1: If you know the exact email address
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@yourdomain.com';

-- Option 2: If you want to see all users first
-- Run this to see all registered users:
-- SELECT id, email, first_name, last_name, role, created_at FROM public.profiles ORDER BY created_at DESC;

-- Option 3: Make the first registered user an admin
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE id = (SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1);

-- STEP 3: Verify the admin user was created
SELECT 
    id, 
    email, 
    first_name, 
    last_name, 
    role, 
    is_email_verified,
    created_at
FROM public.profiles 
WHERE role = 'admin';

-- ====================================================================
-- 📝 INSTRUCTIONS:
-- ====================================================================
-- 1. First create a user account through your website's signup process
-- 2. Note down the email address you used
-- 3. Replace 'admin@yourdomain.com' above with your actual email
-- 4. Run the UPDATE statement
-- 5. Run the SELECT statement to verify the admin was created
-- 6. The admin user can now access the /admin panel

-- ====================================================================
-- 🔧 TROUBLESHOOTING:
-- ====================================================================
-- If the admin still can't access the panel:
-- 1. Make sure the user is logged out and logs in again
-- 2. Check browser console for any errors
-- 3. Verify RLS policies are working correctly
-- 4. Ensure the database schema was applied successfully
