// Node.js script to manually update user roles
// You need to install supabase-js: npm install @supabase/supabase-js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

// Load from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing')
  console.error('\n💡 Make sure these are set in your .env.local file')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function makeUserAdmin(userEmail) {
  console.log(`🔧 Making user '${userEmail}' an admin...`)
  
  try {
    // First, check if user exists
    const { data: existingUser, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', userEmail)
      .single()
    
    if (findError) {
      if (findError.code === 'PGRST116') {
        console.log('❌ User not found with email:', userEmail)
        console.log('💡 Make sure the user has signed up and a profile exists')
        return
      }
      throw findError
    }
    
    console.log('👤 Found user:', {
      id: existingUser.id,
      email: existingUser.email,
      name: `${existingUser.first_name} ${existingUser.last_name}`,
      currentRole: existingUser.role
    })
    
    if (existingUser.role === 'admin') {
      console.log('✅ User is already an admin!')
      return
    }
    
    // Update role to admin
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .eq('email', userEmail)
      .select()
    
    if (error) {
      throw error
    }
    
    console.log('✅ Successfully updated user to admin!')
    console.log('📊 Updated user:', data[0])
    
  } catch (error) {
    console.error('❌ Error making user admin:', error)
  }
}

async function listAllUsers() {
  console.log('👥 Fetching all users...')
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, role, created_at')
      .order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    console.log('📋 All users:')
    console.table(data.map(user => ({
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      created: new Date(user.created_at).toLocaleDateString()
    })))
    
  } catch (error) {
    console.error('❌ Error fetching users:', error)
  }
}

async function removeAdminRole(userEmail) {
  console.log(`🔧 Removing admin role from '${userEmail}'...`)
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role: 'user',
        updated_at: new Date().toISOString()
      })
      .eq('email', userEmail)
      .select()
    
    if (error) {
      throw error
    }
    
    if (data.length === 0) {
      console.log('❌ User not found with email:', userEmail)
      return
    }
    
    console.log('✅ Successfully removed admin role!')
    console.log('📊 Updated user:', data[0])
    
  } catch (error) {
    console.error('❌ Error removing admin role:', error)
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  const email = args[1]
  
  if (!command) {
    console.log(`
🚀 Admin Role Management Script

Usage:
  node update-admin-role.js make-admin <email>     - Make user an admin
  node update-admin-role.js remove-admin <email>   - Remove admin role
  node update-admin-role.js list                   - List all users

Examples:
  node update-admin-role.js make-admin admin@example.com
  node update-admin-role.js list
  
⚠️  Important: Make sure to set your SUPABASE_SERVICE_ROLE_KEY environment variable
    or update the script with your service role key (not the anon key!)
`)
    return
  }
  
  switch (command) {
    case 'make-admin':
      if (!email) {
        console.log('❌ Please provide an email address')
        return
      }
      await makeUserAdmin(email)
      break
      
    case 'remove-admin':
      if (!email) {
        console.log('❌ Please provide an email address')
        return
      }
      await removeAdminRole(email)
      break
      
    case 'list':
      await listAllUsers()
      break
      
    default:
      console.log('❌ Unknown command:', command)
      console.log('Available commands: make-admin, remove-admin, list')
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  makeUserAdmin,
  listAllUsers,
  removeAdminRole
}
