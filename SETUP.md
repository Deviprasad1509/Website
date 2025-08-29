# BuisBuz E-commerce Setup Guide

## Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for setup to complete

### 2. Run SQL Schema
1. Go to SQL Editor in Supabase Dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the query to create all tables and policies

### 3. Create Admin User
1. Go to Authentication > Users in Supabase Dashboard
2. Create a new user manually or sign up through the app
3. After creating the user, go to SQL Editor and run:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

### 4. Environment Variables
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Test the Application
1. Run `npm run dev` locally to test
2. Try signing up a new user
3. Try signing in with the admin user
4. Verify admin panel access

## Deployment

### Firebase Hosting
1. Make sure Firebase CLI is installed: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Build and deploy: `npm run deploy`

### Environment Variables for Production
Make sure your production environment has the same Supabase credentials.

## Troubleshooting

### Database Connection Issues
- Check that environment variables are correctly set
- Verify Supabase project URL and API key
- Ensure RLS policies are correctly applied

### Login/Signup Issues
- Check browser console for detailed error messages
- Verify user creation in Supabase Auth dashboard
- Check if profile was created in profiles table

### Admin Access Issues
- Verify user role is set to 'admin' in profiles table
- Check that admin guard is working properly
- Ensure user is authenticated before checking role

### Build Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

## Sample Test Users

For testing, you can create these users:

**Admin User:**
- Email: admin@buisbuz.com
- Password: admin123
- Role: admin (set manually in database)

**Regular User:**
- Email: user@buisbuz.com  
- Password: user123
- Role: user (default)

## Features to Test

1. **User Authentication:**
   - Sign up new user
   - Sign in existing user
   - Password reset (if implemented)

2. **User Features:**
   - Browse books
   - Add to cart
   - Checkout process
   - View orders
   - Access library

3. **Admin Features:**
   - Admin dashboard access
   - Manage books
   - View all orders
   - User management

4. **General:**
   - Responsive design
   - Error handling
   - Performance
