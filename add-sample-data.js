// Script to add realistic sample data to the database
// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })
const crypto = require('crypto')

const { createClient } = require('@supabase/supabase-js')

// Load from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const sampleBooks = [
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description: "Timeless lessons on wealth, greed, and happiness from one of the most important books on personal finance ever written.",
    price: 24.99,
    category: "Business",
    tags: ["finance", "psychology", "money", "investing"],
    is_featured: true
  },
  {
    title: "Atomic Habits",
    author: "James Clear", 
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. Transform your life with tiny changes that compound over time.",
    price: 19.99,
    category: "Self-Help",
    tags: ["habits", "productivity", "self-improvement", "personal development"],
    is_featured: true
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. A novel about possibility and hope.",
    price: 16.99,
    category: "Fiction",
    tags: ["contemporary fiction", "philosophy", "life choices"],
    is_featured: false
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description: "How did our species succeed in the battle for dominance? Why did our foraging ancestors come together to create cities and kingdoms?",
    price: 22.99,
    category: "History",
    tags: ["anthropology", "history", "evolution", "civilization"],
    is_featured: true
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A psychological thriller about a woman's act of violence against her husband and the therapist obsessed with treating her.",
    price: 15.99,
    category: "Mystery",
    tags: ["psychological thriller", "mystery", "crime"],
    is_featured: false
  },
  {
    title: "Educated",
    author: "Tara Westover",
    description: "A memoir about a young girl who leaves her survivalist family and goes to Cambridge and Harvard, despite never having set foot in a classroom.",
    price: 18.99,
    category: "Biography",
    tags: ["memoir", "education", "family", "resilience"],
    is_featured: false
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description: "Set on the desert planet Arrakis, Dune is the story of Paul Atreides and his destiny to bring peace to his war-torn world.",
    price: 21.99,
    category: "Science Fiction",
    tags: ["space opera", "politics", "ecology", "classic sci-fi"],
    is_featured: true
  },
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    description: "A reclusive Hollywood icon finally tells her story to a young journalist, revealing scandalous secrets from her past.",
    price: 17.99,
    category: "Romance",
    tags: ["hollywood", "lgbtq", "historical fiction", "love story"],
    is_featured: false
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship that teaches the principles and practices of writing clean code.",
    price: 29.99,
    category: "Technology",
    tags: ["programming", "software development", "best practices", "coding"],
    is_featured: false
  },
  {
    title: "Becoming",
    author: "Michelle Obama",
    description: "An intimate, powerful memoir by the former First Lady, chronicling her journey from childhood to the White House.",
    price: 20.99,
    category: "Biography",
    tags: ["memoir", "politics", "inspiration", "leadership"],
    is_featured: true
  }
]

async function addSampleBooks() {
  console.log('📚 Adding sample books...')
  
  try {
    // First, clear existing sample/test data
    const { error: deleteError } = await supabase
      .from('ebooks')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all books

    if (deleteError) {
      console.error('Error clearing existing books:', deleteError)
    }

    // Insert new sample books
    const { data, error } = await supabase
      .from('ebooks')
      .insert(sampleBooks)
      .select()

    if (error) {
      throw error
    }

    console.log('✅ Successfully added', data.length, 'sample books')
    return data
  } catch (error) {
    console.error('❌ Error adding sample books:', error)
    return null
  }
}

async function addSampleOrders(books) {
  console.log('🛒 Adding sample orders...')
  
  try {
    // Get users for orders
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email')

    if (usersError || !users || users.length === 0) {
      console.log('❌ No users found to create orders for')
      return
    }

    console.log('👥 Found', users.length, 'users to create orders for')

    const sampleOrders = []
    const orderItems = []
    const libraryEntries = []

    // Create 5 sample orders
    for (let i = 0; i < 5; i++) {
      const user = users[i % users.length]
      const selectedBooks = books.slice(i * 2, (i * 2) + 2) // 2 books per order
      
      if (selectedBooks.length === 0) continue

      const totalAmount = selectedBooks.reduce((sum, book) => sum + book.price, 0)
      const orderId = crypto.randomUUID()

      sampleOrders.push({
        id: orderId,
        user_id: user.id,
        total_amount: totalAmount,
        payment_status: ['completed', 'completed', 'completed', 'pending', 'failed'][i],
        payment_id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_order_id: `order_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_payment_id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString() // Spread over 5 days
      })

      // Add order items
      selectedBooks.forEach(book => {
        orderItems.push({
          order_id: orderId,
          ebook_id: book.id,
          price: book.price
        })

        // Add to library if order is completed
        if (sampleOrders[i].payment_status === 'completed') {
          libraryEntries.push({
            user_id: user.id,
            ebook_id: book.id,
            purchased_at: sampleOrders[i].created_at
          })
        }
      })
    }

    // Insert orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .insert(sampleOrders)
      .select()

    if (ordersError) {
      throw ordersError
    }

    console.log('✅ Added', ordersData.length, 'sample orders')

    // Insert order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select()

    if (itemsError) {
      throw itemsError
    }

    console.log('✅ Added', itemsData.length, 'order items')

    // Insert library entries
    if (libraryEntries.length > 0) {
      const { data: libraryData, error: libraryError } = await supabase
        .from('user_library')
        .insert(libraryEntries)
        .select()

      if (libraryError) {
        console.error('Error adding library entries:', libraryError)
      } else {
        console.log('✅ Added', libraryData.length, 'library entries')
      }
    }

  } catch (error) {
    console.error('❌ Error adding sample orders:', error)
  }
}

async function addMoreUsers() {
  console.log('👥 Adding more sample users...')
  
  const sampleUsers = [
    {
      email: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user'
    },
    {
      email: 'jane.smith@example.com', 
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'user'
    },
    {
      email: 'mike.johnson@example.com',
      first_name: 'Mike', 
      last_name: 'Johnson',
      role: 'user'
    },
    {
      email: 'sarah.wilson@example.com',
      first_name: 'Sarah',
      last_name: 'Wilson', 
      role: 'user'
    },
    {
      email: 'david.brown@example.com',
      first_name: 'David',
      last_name: 'Brown',
      role: 'user'
    }
  ]

  try {
    // Note: These users won't have auth.users entries, so they're for display purposes only
    // In a real app, users would sign up through the auth system
    const { data, error } = await supabase
      .from('profiles')
      .insert(sampleUsers.map(user => ({
        id: crypto.randomUUID(),
        ...user,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date in last 30 days
      })))
      .select()

    if (error) {
      console.error('Error adding sample users:', error)
    } else {
      console.log('✅ Added', data.length, 'sample users')
      return data
    }
  } catch (error) {
    console.error('❌ Error adding sample users:', error)
  }
}

async function main() {
  console.log('🚀 Adding comprehensive sample data...')
  
  // Add sample books
  const books = await addSampleBooks()
  if (!books) {
    console.log('❌ Failed to add books, stopping')
    return
  }

  // Add more sample users (these will be display-only since they don't have auth entries)
  await addMoreUsers()

  // Add sample orders with the new books
  await addSampleOrders(books)

  console.log('🎉 Sample data setup complete!')
  console.log('')
  console.log('📊 You now have:')
  console.log('   • 10 realistic books with proper descriptions and pricing')
  console.log('   • 5 sample orders with different payment statuses')
  console.log('   • User library entries for completed purchases')
  console.log('   • Additional sample users for testing')
  console.log('')
  console.log('🔗 You can now:')
  console.log('   • Test the edit functionality on realistic books')
  console.log('   • View real orders in the admin dashboard')
  console.log('   • See actual user data instead of placeholders')
}

if (require.main === module) {
  main()
}
