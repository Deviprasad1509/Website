# Admin Setup Guide 🔧

This guide will help you fix the "you need admin privileges" issue in your Next.js web application.

## Problem Analysis

Your application uses Supabase for authentication and has the following admin security layers:

1. **Database Role**: Users have a `role` field in the `profiles` table (`'user'` or `'admin'`)
2. **Middleware Protection**: `/admin` routes are protected by Next.js middleware
3. **AdminGuard Component**: Frontend component that checks user role
4. **Auth Context**: Manages user authentication state

The issue is likely that **your user doesn't have the admin role set in the database**.

## Quick Fix Steps

### Step 1: Check Current User Role

1. Open your web application in a browser
2. Make sure you're logged in as the user who should be admin
3. Open Developer Tools (F12) → Console
4. Copy and paste the contents of `debug-admin.js` into the console
5. Update the `SUPABASE_URL` and `SUPABASE_ANON_KEY` variables with your actual values
6. Run: `debugAdminRole()`

This will show you:
- Current user information
- Their role in the database
- Whether admin access is working

### Step 2: Update User to Admin Role

#### Option A: Using the Node.js Script (Recommended)

1. Open terminal in your project directory
2. Make sure you have your environment variables set:
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # NOT the anon key!
   ```

3. Run the script:
   ```bash
   node update-admin-role.js make-admin your-email@example.com
   ```

4. To verify it worked:
   ```bash
   node update-admin-role.js list
   ```

#### Option B: Manual Database Update

1. Go to your Supabase Dashboard
2. Navigate to: **Table Editor** → **profiles** table  
3. Find your user's row (search by email)
4. Edit the `role` column from `'user'` to `'admin'`
5. Save the changes

#### Option C: Using SQL Query

In Supabase Dashboard → SQL Editor:

```sql
UPDATE profiles 
SET role = 'admin', updated_at = NOW() 
WHERE email = 'your-email@example.com';
```

### Step 3: Clear Browser Cache & Reload

1. Clear your browser cache or open an incognito/private window
2. Log out and log back in to your application
3. Try accessing the admin panel at `/admin`

## Troubleshooting Guide

### Issue: Still getting "Access Denied" after updating role

**Check the browser console for debug logs:**

- `🔍 Loading profile for user:` - Should show user loading
- `📊 Profile role specifically:` - Should show `'admin'`
- `🛡️ AdminGuard: Checking access...` - Should show admin access granted

**If role is not 'admin' in console:**
1. Log out completely
2. Clear all browser data for your site
3. Log back in
4. The profile should reload with the correct role

### Issue: Database update fails with permissions error

This usually means you're using the anon key instead of the service role key.

1. Go to Supabase Dashboard → Settings → API
2. Copy the **service_role** key (not the anon key)
3. Update your environment variable:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### Issue: Middleware is redirecting even with admin role

Check that your middleware is working correctly:

1. Open `middleware.ts`
2. Make sure the admin routes array includes `/admin`
3. The middleware should query the `profiles` table for the user's role

### Issue: User profile doesn't exist

If the debug script shows "Profile not found":

1. The user needs to sign up/login first to create a profile
2. Or manually create the profile in Supabase:

```sql
INSERT INTO profiles (id, email, first_name, last_name, role)
VALUES ('user-uuid-here', 'admin@example.com', 'Admin', 'User', 'admin');
```

## How the Admin System Works

### Database Schema
```sql
-- profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Access Flow
1. User logs in → Supabase Auth creates session
2. `AuthContext` loads user profile from `profiles` table
3. User navigates to `/admin` → Middleware checks role
4. `AdminGuard` component double-checks role on frontend
5. If all checks pass → Admin panel loads

## Common Admin Routes

Once you have admin access, you can visit:
- `/admin` - Dashboard overview
- `/admin/products` - Product management
- `/admin/orders` - Order management  
- `/admin/users` - User management
- `/admin/catalog` - Catalog management

## Security Notes

⚠️ **Important Security Considerations:**

1. **Service Role Key**: Never expose your service role key in client-side code
2. **Row Level Security**: Make sure RLS policies are set up correctly
3. **Admin Access**: Only give admin access to trusted users
4. **Environment Variables**: Keep all sensitive keys in `.env.local`

## Getting Help

If you're still having issues:

1. Run the debug script and share the console output
2. Check the browser Network tab for any failed API requests
3. Verify your Supabase project settings and RLS policies
4. Make sure all environment variables are set correctly

## Files Modified

The debugging process added enhanced logging to:
- `lib/auth-context.tsx` - Enhanced user profile loading logs
- `components/admin/admin-guard.tsx` - Added access checking logs

These logs will help you see exactly what's happening during the authentication process.
