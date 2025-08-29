@echo off
echo 🚀 BuisBuz App Deployment Script
echo ================================

echo.
echo Step 1: Installing dependencies...
npm install

echo.
echo Step 2: Building production version...
npm run build

echo.
echo Step 3: Deploying to Firebase...
firebase deploy --only hosting

echo.
echo ✅ Deployment Complete!
echo.
echo Your app is now live at:
echo https://buisbuz-ebook-store-2025-aa12f.web.app
echo.
echo Next steps:
echo 1. Run database migration in Supabase (see DEPLOY_NOW.md)
echo 2. Make yourself admin using browser console script
echo 3. Test all new features
echo.
pause
