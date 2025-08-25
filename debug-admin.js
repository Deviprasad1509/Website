// Admin Debug Script for Supabase
// Run this in your browser console to debug admin role issues

// Replace these with your actual Supabase URL and anon key from your .env file
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE'

async function debugAdminRole() {
  try {
    console.log('🔍 Starting admin role debugging...')
    
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('❌ Error getting current user:', userError)
      return
    }
    
    if (!user) {
      console.log('❌ No user is currently logged in')
      return
    }
    
    console.log('👤 Current user:', {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata
    })
    
    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.error('❌ Error getting user profile:', profileError)
      
      if (profileError.code === 'PGRST116') {
        console.log('❌ Profile not found in database. Creating profile...')
        
        // Try to create profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || 'User',
            last_name: user.user_metadata?.last_name || 'Name',
            role: 'user'
          })
          .select()
          .single()
        
        if (createError) {
          console.error('❌ Error creating profile:', createError)
        } else {
          console.log('✅ Profile created:', newProfile)
        }
      }
      return
    }
    
    console.log('📊 User profile:', profile)
    
    if (profile.role === 'admin') {
      console.log('✅ User has admin role!')
      
      // Test middleware check
      console.log('🧪 Testing middleware admin route access...')
      try {
        const response = await fetch('/admin', { 
          method: 'GET',
          credentials: 'include'
        })
        console.log('📡 Admin route response status:', response.status)
        
        if (response.status === 200) {
          console.log('✅ Admin route accessible')
        } else if (response.status === 302) {
          console.log('⚠️ Redirected by middleware (likely role check failed)')
        } else {
          console.log('❌ Admin route not accessible, status:', response.status)
        }
      } catch (fetchError) {
        console.error('❌ Error testing admin route:', fetchError)
      }
      
    } else {
      console.log('❌ User does NOT have admin role. Current role:', profile.role)
      console.log('🔧 To fix this, you need to update the role in the database')
      console.log('💡 Use the updateUserToAdmin() function below')
    }
    
  } catch (error) {
    console.error('❌ Debug script error:', error)
  }
}

async function updateUserToAdmin(userEmail) {
  try {
    console.log('🔧 Updating user to admin role...')
    
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Note: This might require service role key for row-level security
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', userEmail)
      .select()
    
    if (error) {
      console.error('❌ Error updating role:', error)
      console.log('💡 You may need to update this directly in Supabase dashboard or use service role key')
    } else {
      console.log('✅ Role updated successfully:', data)
    }
    
  } catch (error) {
    console.error('❌ Update script error:', error)
  }
}

async function listAllUsers() {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, role')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching users:', error)
    } else {
      console.log('👥 All users:', data)
    }
  } catch (error) {
    console.error('❌ List users error:', error)
  }
}

// Instructions
console.log(`
🚀 Admin Debugging Instructions:

1. First, update the SUPABASE_URL and SUPABASE_ANON_KEY variables at the top of this script
2. Run: debugAdminRole()
3. If user doesn't have admin role, try: updateUserToAdmin('your-email@example.com')
4. To see all users: listAllUsers()

Example usage:
debugAdminRole()
updateUserToAdmin('admin@example.com')
listAllUsers()
`)

// Export functions for use
window.debugAdminRole = debugAdminRole
window.updateUserToAdmin = updateUserToAdmin
window.listAllUsers = listAllUsers
