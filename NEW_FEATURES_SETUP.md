# Quick Setup for New Features

Since you already have Supabase configured, you just need to run these scripts to add the new functionality:

## 1. Database Migration (Required)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**  
3. Copy and paste the contents of `database/migration-new-features.sql`
4. Click **Run**

This will add:
- ✅ Categories table for catalog management
- ✅ New columns to ebooks table (tags, is_featured, pdf_url, cover_image)
- ✅ Proper indexes and triggers
- ✅ Security policies
- ✅ Default categories (Fiction, Non-Fiction, etc.)

## 2. Storage Bucket Setup (For File Uploads)

### Step A: Create the Bucket (Manual)
1. In Supabase dashboard, go to **Storage**
2. Click **New Bucket**
3. Name: `book-assets`
4. Set to **Public** ✅
5. Click **Create bucket**

### Step B: Configure Policies (SQL)
1. Go back to **SQL Editor**
2. Copy and paste the contents of `database/storage-setup.sql`  
3. Click **Run**

## 3. Test the New Features

### Admin Dashboard
1. Make sure your user has `role = 'admin'` in the profiles table
2. Go to `/admin` in your app
3. You should see:
   - **Products** - Enhanced with file uploads and featured book toggle
   - **Catalog** - NEW! Manage categories (add/edit/delete)
   - Dashboard with updated statistics

### Frontend Features
- Categories page now shows dynamic data from database
- Book detail pages support PDF downloads for owned books
- User library page shows purchased books with download buttons
- Search and filtering works across all new fields

## 4. What's New

### For Admins:
- 📁 **Catalog Management** - Create/edit/delete book categories
- 🖼️ **File Uploads** - Upload book covers and PDF files
- ⭐ **Featured Books** - Mark books as featured on homepage
- 🏷️ **Tags System** - Add searchable tags to books

### For Users:
- 📚 **Enhanced Library** - Download purchased books as PDF
- 🔍 **Better Search** - Search by tags and enhanced metadata  
- 📂 **Dynamic Categories** - Categories now come from database
- ⭐ **Featured Section** - See featured books on homepage

## 5. File Structure

After setup, your Supabase project will have:

```
Storage Buckets:
└── book-assets/
    ├── book-covers/
    └── book-pdfs/

New Database Tables:
├── categories (NEW)
├── ebooks (enhanced with new columns)
└── [existing tables remain unchanged]
```

## 6. Verification

### Test Database Migration:
```sql
-- Run this to verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'ebooks');

-- Check new columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'ebooks' 
AND column_name IN ('tags', 'is_featured', 'pdf_url', 'cover_image');
```

### Test Storage:
1. Go to Storage dashboard
2. You should see `book-assets` bucket
3. Try uploading a test file - it should work

### Test Admin Features:
1. Login as admin
2. Go to `/admin/catalog` - you should see category management
3. Go to `/admin/products` - you should see file upload options
4. Try adding a new category or book with files

## 7. Troubleshooting

**If migration fails:**
- Check that your user has proper permissions
- Try running each section of the migration script separately

**If file uploads don't work:**
- Ensure the `book-assets` bucket is set to **Public**
- Check that storage policies are created
- Verify your Supabase URL and anon key are correct

**If admin features don't show:**
- Verify your user's role is set to 'admin' in the profiles table
- Clear browser cache and reload

That's it! Your new features should now be fully functional. The application now has complete catalog management and file upload capabilities. 🎉
