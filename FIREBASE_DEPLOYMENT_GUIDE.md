# Firebase Deployment Guide - BuisBuz Ebook Store

This guide will walk you through deploying your Next.js ebook store to Firebase Hosting.

## Prerequisites

1. ✅ Firebase CLI installed globally
2. ✅ Firebase project configuration files created
3. ✅ Next.js configured for static export
4. ⚠️  Firebase project needs to be created
5. ⚠️  Environment variables need to be configured

## Steps to Deploy

✅ **COMPLETED: Project Built Successfully!**

Your Next.js app has been successfully built and exported to the `out` directory. Here are the final deployment steps:

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `buisbuz-ebook-store-2025` (or similar)
4. Enable Google Analytics (optional)
5. Wait for project creation
6. Copy your project ID

### 2. Update Project Configuration

After creating the project, update `.firebaserc`:

```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

### 3. Set Up Environment Variables

Create `.env.local` file with your actual values:

```bash
# Copy from .env.local.example
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual Supabase credentials:
- Get these from your Supabase project dashboard
- Update `NEXT_PUBLIC_APP_URL` with your Firebase hosting URL

### 4. Build and Deploy

```bash
# Install dependencies if not already done
npm install

# Build the project for static export
npm run export

# Deploy to Firebase
npm run deploy
```

### 5. Alternative Manual Deployment

If the CLI gives issues, you can deploy manually:

```bash
# Build the project
npm run export

# Initialize Firebase in this directory (if not done)
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## Configuration Files Created

### `firebase.json`
- Configures hosting settings
- Points to `out` directory (Next.js export output)
- Sets up rewrites for SPA routing
- Configures caching headers

### `next.config.mjs`
Updated with:
- `output: 'export'` for static site generation
- `trailingSlash: true` for better routing
- `distDir: 'out'` for Firebase hosting

### Package.json Scripts
- `npm run export` - Builds the static site
- `npm run deploy` - Builds and deploys to Firebase
- `npm run deploy:preview` - Deploys to preview channel

## Architecture

Your app will use:
- **Frontend**: Firebase Hosting (Static Next.js site)
- **Backend**: Supabase (Database, Auth, Storage)
- **Payments**: Razorpay (when implemented)

## Important Notes

1. **Static Export Limitations**:
   - No server-side API routes
   - All API calls go to Supabase
   - Client-side routing only

2. **Environment Variables**:
   - Only `NEXT_PUBLIC_*` variables work in static exports
   - Server secrets won't work (but not needed with Supabase)

3. **Supabase Integration**:
   - Your Supabase setup remains unchanged
   - All authentication and database operations work as before
   - File uploads continue to use Supabase Storage

## After Deployment

1. **Update Supabase Auth Settings**:
   - Add your Firebase hosting domain to Supabase Auth redirect URLs
   - Update site URL in Supabase settings

2. **Test All Functionality**:
   - User registration/login
   - Book browsing and search
   - Cart operations
   - Admin dashboard
   - File uploads

3. **Custom Domain** (Optional):
   - Set up custom domain in Firebase Console
   - Update DNS records
   - Update environment variables

## Troubleshooting

### Build Issues
- Check for dynamic imports that need static alternatives
- Ensure all images use `unoptimized: true`
- Verify no server-side dependencies

### Authentication Issues
- Update Supabase redirect URLs
- Check environment variables are correct
- Verify CORS settings in Supabase

### File Upload Issues
- Supabase storage should work the same
- Check bucket permissions and policies

## Support

If you encounter issues:
1. Check Firebase Console for deployment logs
2. Verify Supabase configuration
3. Test locally first with `npm run dev`
4. Check browser console for errors

## Commands Reference

```bash
# Development
npm run dev

# Build for production
npm run export

# Deploy to Firebase
npm run deploy

# Deploy to preview channel
npm run deploy:preview

# Firebase login (if needed)
firebase login

# Check Firebase projects
firebase projects:list

# Use specific project
firebase use your-project-id
```
