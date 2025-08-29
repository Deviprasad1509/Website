# 🚀 Supabase Database Setup for BuisBuz

## ⚠️ IMPORTANT: Follow These Steps Exactly

The error `ERROR: 42501: must be owner of table users` occurs when trying to modify Supabase's managed `auth.users` table. Our new schema avoids this issue.

## 📋 Step-by-Step Setup

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New query"**

### Step 2: Run the Fixed Schema
1. Open the file `supabase-schema-fixed.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **"Run"** (or press Ctrl/Cmd + Enter)

### Step 3: Verify Tables Were Created
1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `profiles`
   - `ebooks`
   - `orders`
   - `order_items`
   - `user_library`

### Step 4: Create Your Admin User
**Option A: Through the App**
1. Go to your deployed application
2. Sign up with your desired admin email
3. Complete the signup process

**Option B: Manual Creation in Supabase**
1. Go to **Authentication > Users**
2. Click **"Add user"**
3. Fill in email and password
4. Click **"Create user"**

### Step 5: Set Admin Role
1. Go back to **SQL Editor**
2. Run this query (replace with your actual email):
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

### Step 6: Verify Setup
1. Go to **Table Editor > profiles**
2. Find your user and verify:
   - Email is correct
   - Role is set to `admin`
   - Other fields are populated

## 🔧 Environment Variables

Make sure your application has these environment variables set:

### For Local Development (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Get These Values:
1. Go to **Settings > API** in Supabase
2. Copy the **Project URL** 
3. Copy the **anon/public** key

## 🧪 Testing the Setup

### Test 1: User Signup
1. Go to your app's signup page
2. Create a new user account
3. Check that a profile was created in the `profiles` table

### Test 2: User Login
1. Try logging in with the new user
2. Verify authentication works
3. Check that user data loads properly

### Test 3: Admin Access
1. Login with your admin user
2. Try accessing `/admin` route
3. Verify admin panel loads correctly
4. Check that admin-only features work

### Test 4: Data Loading
1. Verify books display on the homepage
2. Check that sample data was inserted
3. Test browsing different book categories

## ❌ Common Issues & Solutions

### Issue: "relation does not exist"
**Solution:** Make sure you ran the complete SQL script in the correct order.

### Issue: "permission denied for table"
**Solution:** The RLS policies should handle permissions. If issues persist, check the policies are created correctly.

### Issue: Profile not created after signup
**Solution:** Check that the trigger `on_auth_user_created` exists and is enabled.

### Issue: Admin panel shows "Access Denied"
**Solution:** 
1. Verify user role is set to 'admin' in profiles table
2. Check that admin policies are created correctly
3. Ensure user is properly authenticated

## 🔍 Debugging Queries

### Check if user exists in profiles:
```sql
SELECT * FROM profiles WHERE email = 'your-email@example.com';
```

### Check user role:
```sql
SELECT email, role FROM profiles WHERE email = 'your-email@example.com';
```

### Check sample books were inserted:
```sql
SELECT title, author, price FROM ebooks LIMIT 5;
```

### Verify RLS policies exist:
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## ✅ Success Checklist

- [ ] SQL schema ran without errors
- [ ] All 5 tables created successfully
- [ ] Sample ebooks data inserted
- [ ] Admin user created and role set
- [ ] Environment variables configured
- [ ] User signup works
- [ ] User login works
- [ ] Admin panel accessible
- [ ] Sample books display on homepage

## 🆘 Need Help?

If you encounter any issues:

1. **Check the PostgreSQL logs** in Supabase Dashboard > Logs
2. **Verify environment variables** are correctly set
3. **Test with browser dev tools** to see detailed error messages
4. **Try creating a fresh Supabase project** if issues persist

## 🎉 Ready to Go!

Once all tests pass, your BuisBuz e-commerce application is fully functional with:
- ✅ User authentication
- ✅ Role-based access control  
- ✅ Admin panel
- ✅ Product catalog
- ✅ Order management
- ✅ User library system
