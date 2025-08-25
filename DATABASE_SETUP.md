# BuisBuz Ebook Store - Database Setup Guide

This guide will help you set up the Supabase database for your ebook store application.

## Prerequisites

1. A Supabase account (https://supabase.com)
2. A new Supabase project created

## Setup Steps

### 1. Create Your Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - Name: `buisbuz-ebook-store`
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
5. Click "Create new project"

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# You can find these in your Supabase project settings > API
```

To find your Supabase credentials:
1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Go to "API" section
4. Copy the "Project URL" and "anon public" key

### 3. Run Database Schema

1. In your Supabase dashboard, go to "SQL Editor"
2. Copy and paste the contents of `database/schema.sql`
3. Click "Run" to execute the schema

This will create:
- All necessary tables (profiles, ebooks, orders, order_items, user_library, categories)
- Proper indexes for performance
- Triggers for automatic timestamp updates
- Default categories

### 4. Set Up Row Level Security (RLS) Policies

1. In the SQL Editor, create a new query
2. Copy and paste the contents of `database/rls-policies.sql`
3. Click "Run" to execute the policies

This will set up proper security policies that:
- Allow users to view and manage their own data
- Allow admins to manage all data
- Protect sensitive information

### 5. Set Up Storage for Files

1. Go to "Storage" in your Supabase dashboard
2. Create a new bucket called `book-assets`
3. Set the bucket to **Public** (for book covers and PDFs)
4. Configure the bucket policies:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public access to download files
CREATE POLICY "Public can view files" ON storage.objects
FOR SELECT USING (bucket_id = 'book-assets');

-- Allow authenticated users to update their uploads
CREATE POLICY "Users can update files" ON storage.objects
FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Users can delete files" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 6. Enable Authentication

1. Go to "Authentication" in your Supabase dashboard
2. Go to "Settings" tab
3. Enable the authentication providers you want:
   - Email/Password (recommended)
   - Google, GitHub, etc. (optional)

### 7. Set Up Authentication Triggers (Optional)

To automatically create user profiles when someone signs up:

```sql
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
```

### 8. Add Sample Data (Optional)

To populate your database with sample books for testing:

1. In the SQL Editor, create a new query
2. Copy and paste the contents of `database/sample-data.sql`
3. Click "Run" to execute

This will add 20 sample books across different categories.

### 9. Create Your First Admin User

After setting up authentication and creating your first account through the app:

1. Go to "Table Editor" in Supabase
2. Open the `profiles` table
3. Find your user record
4. Change the `role` field from `user` to `admin`
5. Save the changes

Now you can access the admin dashboard!

## Verification Steps

### Test Database Connection

1. Start your Next.js development server: `npm run dev`
2. Visit your homepage - you should see books loading (if you added sample data)
3. Try signing up for a new account
4. Check if the profile was created in the `profiles` table

### Test Admin Functions

1. Sign in with your admin account
2. Go to `/admin` route
3. You should see the admin dashboard with statistics
4. Try adding a new book in Product Management
5. Try managing categories in Catalog Management

### Test File Uploads

1. In admin, try uploading a book cover and PDF
2. Check the `book-assets` bucket in Supabase Storage
3. Files should appear in organized folders

## Folder Structure

Your Supabase project should have this structure:

```
Storage Buckets:
└── book-assets/
    ├── book-covers/
    │   └── [book-id]_[timestamp].jpg
    └── book-pdfs/
        └── [book-id]_[timestamp].pdf

Tables:
├── profiles (user data)
├── ebooks (book catalog)
├── categories (book categories)
├── orders (purchase orders)
├── order_items (items in orders)
└── user_library (purchased books)
```

## Troubleshooting

### Common Issues

1. **"relation does not exist" error**: Make sure you ran the schema.sql file completely

2. **Permission denied errors**: Check that RLS policies are set up correctly

3. **File upload fails**: Ensure the `book-assets` bucket exists and is public

4. **Can't access admin**: Make sure your user's role is set to 'admin' in the profiles table

### Getting Help

- Check Supabase documentation: https://supabase.com/docs
- Review the SQL logs in your Supabase dashboard
- Check browser console for JavaScript errors
- Verify environment variables are set correctly

## Security Notes

- Never commit your `.env.local` file to version control
- Use the `anon` key for client-side operations
- The `service_role` key should only be used server-side
- RLS policies are crucial for data security - don't disable them
- Regularly review and audit your database permissions

## Performance Tips

- The schema includes optimized indexes for common queries
- Consider adding more indexes as your data grows
- Monitor query performance in the Supabase dashboard
- Use connection pooling in production
- Consider CDN for file storage in production

Your database should now be fully set up and ready to use with the BuisBuz ebook store!
