import { createClient } from './supabase/client'
import type { Database } from './database.types'

type Tables = Database['public']['Tables']
type Ebook = Tables['ebooks']['Row']
type Profile = Tables['profiles']['Row']
type Order = Tables['orders']['Row']
type OrderItem = Tables['order_items']['Row']
type UserLibrary = Tables['user_library']['Row']

class DatabaseService {
  private supabase = createClient()

  // Ebooks
  async getEbooks(filters?: { 
    category?: string; 
    featured?: boolean; 
    limit?: number 
  }) {
    let query = this.supabase
      .from('ebooks')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.featured !== undefined) {
      query = query.eq('is_featured', filters.featured)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching ebooks:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  async getEbookById(id: string) {
    const { data, error } = await this.supabase
      .from('ebooks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching ebook:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  async createEbook(ebook: Tables['ebooks']['Insert']) {
    const { data, error } = await this.supabase
      .from('ebooks')
      .insert(ebook)
      .select()
      .single()

    if (error) {
      console.error('Error creating ebook:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  async updateEbook(id: string, updates: Tables['ebooks']['Update']) {
    const { data, error } = await this.supabase
      .from('ebooks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating ebook:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  async deleteEbook(id: string) {
    const { data, error } = await this.supabase
      .from('ebooks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting ebook:', error)
      return { success: false, error }
    }

    return { success: true, error: null }
  }

  // User Profile
  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  async updateProfile(userId: string, updates: Tables['profiles']['Update']) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  async getAllProfiles() {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching profiles:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  // Orders
  async createOrder(orderData: {
    userId: string;
    totalAmount: number;
    items: Array<{ ebookId: string; price: number }>;
  }) {
    const { userId, totalAmount, items } = orderData

    // Create the order
    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        payment_status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return { data: null, error: orderError }
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      ebook_id: item.ebookId,
      price: item.price
    }))

    const { data: createdItems, error: itemsError } = await this.supabase
      .from('order_items')
      .insert(orderItems)
      .select()

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return { data: null, error: itemsError }
    }

    return { 
      data: { 
        order, 
        items: createdItems 
      }, 
      error: null 
    }
  }

  async updateOrderPaymentStatus(
    orderId: string, 
    status: 'pending' | 'completed' | 'failed',
    paymentData?: {
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      paymentId?: string;
    }
  ) {
    const updates: Tables['orders']['Update'] = {
      payment_status: status,
      ...paymentData
    }

    const { data, error } = await this.supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating order payment status:', error)
      return { data: null, error }
    }

    // If payment is completed, add books to user library
    if (status === 'completed') {
      await this.addBooksToUserLibrary(orderId)
    }

    return { data, error: null }
  }

  private async addBooksToUserLibrary(orderId: string) {
    // Get order details with items
    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .select(`
        user_id,
        order_items(ebook_id)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Error fetching order for library:', orderError)
      return
    }

    // Add books to user library
    const libraryItems = (order.order_items as any[]).map((item: any) => ({
      user_id: order.user_id,
      ebook_id: item.ebook_id
    }))

    const { error: libraryError } = await this.supabase
      .from('user_library')
      .insert(libraryItems)

    if (libraryError) {
      console.error('Error adding books to library:', libraryError)
    }
  }

  async getUserOrders(userId: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          ebooks(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user orders:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  async getAllOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        profiles(first_name, last_name, email),
        order_items(
          *,
          ebooks(title, author)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all orders:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  // User Library
  async getUserLibrary(userId: string) {
    const { data, error } = await this.supabase
      .from('user_library')
      .select(`
        *,
        ebooks(*)
      `)
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false })

    if (error) {
      console.error('Error fetching user library:', error)
      return { data: null, error }
    }

    return { data, error: null }
  }

  async checkUserOwnsEbook(userId: string, ebookId: string) {
    const { data, error } = await this.supabase
      .from('user_library')
      .select('id')
      .eq('user_id', userId)
      .eq('ebook_id', ebookId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking book ownership:', error)
      return { owns: false, error }
    }

    return { owns: !!data, error: null }
  }

  // Analytics for admin
  async getDashboardStats() {
    const [
      { count: totalUsers },
      { count: totalBooks },
      { count: totalOrders },
      { data: recentOrders }
    ] = await Promise.all([
      this.supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true }),
      this.supabase
        .from('ebooks')
        .select('*', { count: 'exact', head: true }),
      this.supabase
        .from('orders')
        .select('*', { count: 'exact', head: true }),
      this.supabase
        .from('orders')
        .select(`
          *,
          profiles(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    // Calculate total revenue
    const { data: completedOrders } = await this.supabase
      .from('orders')
      .select('total_amount')
      .eq('payment_status', 'completed')

    const totalRevenue = completedOrders?.reduce(
      (sum, order) => sum + Number(order.total_amount), 
      0
    ) || 0

    return {
      totalUsers: totalUsers || 0,
      totalBooks: totalBooks || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      recentOrders: recentOrders || []
    }
  }
}

export const db = new DatabaseService()
export default db
