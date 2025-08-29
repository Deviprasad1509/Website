// Simple Admin Creator Script
// Run this in your browser console to make yourself admin

// Step 1: Copy and paste this entire script into your browser console while logged into the app
// Step 2: Replace YOUR_EMAIL with your actual email address
// Step 3: Run: createAdminUser('YOUR_EMAIL')

const SUPABASE_URL = 'https://knmhumjfcisudvroerqh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtubWh1bWpmY2lzdWR2cm9lcnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwOTc5NzAsImV4cCI6MjA3MTY3Mzk3MH0.HPTp7jjvwgjvnigMJT1Q0wmbfw5SqjHoYzu1K7Z1IDQ'

async function createAdminUser(email) {
  try {
    console.log('🔧 Starting admin creation process...')
    
    // Import Supabase
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Get current user to check if logged in
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('❌ You must be logged in to run this script')
      console.log('💡 Please log in to your account first, then run this script')
      return false
    }
    
    console.log('👤 Current user:', user.email)
    
    // Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        console.log('❌ User profile not found for:', email)
        console.log('💡 Make sure the user has signed up first')
        return false
      }
      console.error('❌ Error checking profile:', profileError)
      return false
    }
    
    console.log('📊 Found user profile:', profile)
    
    if (profile.role === 'admin') {
      console.log('✅ User is already an admin!')
      return true
    }
    
    // Try to update role - this might work if RLS policies allow self-update
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', email)
      .select()
    
    if (updateError) {
      console.error('❌ Cannot update role automatically:', updateError)
      console.log(`
🔧 MANUAL UPDATE REQUIRED:

Since automatic update failed, please manually update your role:

1. Go to your Supabase Dashboard
2. Navigate to: Table Editor → profiles
3. Find your user row (email: ${email})
4. Change the 'role' column from 'user' to 'admin'
5. Save the changes
6. Refresh your app and try accessing /admin

OR run this SQL query in Supabase SQL Editor:
UPDATE profiles SET role = 'admin' WHERE email = '${email}';
`)
      return false
    }
    
    console.log('✅ Successfully updated user to admin!')
    console.log('📊 Updated profile:', updateData[0])
    console.log('🎉 You can now access the admin panel at /admin')
    console.log('⚡ You may need to refresh the page or log out and back in')
    
    return true
    
  } catch (error) {
    console.error('❌ Script error:', error)
    return false
  }
}

// Instructions
console.log(`
🚀 ADMIN CREATION INSTRUCTIONS:

1. Make sure you're logged into your account
2. Replace 'YOUR_EMAIL' with your actual email address
3. Run: createAdminUser('your-email@example.com')

Example:
createAdminUser('admin@example.com')
`)

// Make function available globally
window.createAdminUser = createAdminUser
