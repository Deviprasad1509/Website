import { supabase } from './supabase/client'
// Firebase client import kept for any non-database usage
import { db as firestore } from './firebase/client'

class DatabaseService {
  // Ebooks

  async getEbooks(filters?: { category?: string; featured?: boolean; limit?: number }) {
    try {
      let query = supabase.from('ebooks').select('*');
      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.featured !== undefined) query = query.eq('is_featured', filters.featured);
      query = query.order('created_at', { ascending: false });
      if (filters?.limit) query = query.limit(filters.limit);
      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      console.error('Error fetching ebooks:', error);
      return { data: null as any, error: error as any };
    }
  }

  async getEbookById(id: string) {
    try {
      const { data, error } = await supabase.from('ebooks').select('*').eq('id', id).single();
      if (error) return { data: null, error };
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching ebook:', error);
      return { data: null as any, error: error as any };
    }
  }

  async createEbook(ebook: any) {
    try {
      const { data, error } = await supabase.from('ebooks').insert([{ ...ebook }]).single();
      return { data, error };
    } catch (error) {
      console.error('Error creating ebook:', error);
      return { data: null as any, error: error as any };
    }
  }

  async updateEbook(id: string, updates: any) {
    try {
      const { data, error } = await supabase.from('ebooks').update(updates).eq('id', id).single();
      return { data, error };
    } catch (error) {
      console.error('Error updating ebook:', error);
      return { data: null as any, error: error as any };
    }
  }

  async deleteEbook(id: string) {
    try {
      const { error } = await supabase.from('ebooks').delete().eq('id', id);
      return { success: !error, error };
    } catch (error) {
      console.error('Error deleting ebook:', error);
      return { success: false, error: error as any };
    }
  }

  // User Profile
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) return { data: null, error };
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { data: null as any, error: error as any };
    }
  }

  async updateProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).single();
      return { data, error };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null as any, error: error as any };
    }
  }

  async getAllProfiles() {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return { data: null as any, error: error as any };
    }
  }

  // Orders
  async createOrder(orderData: {
    userId: string;
    totalAmount: number;
    items: Array<{ ebookId: string; price: number }>;
  }) {
    const { userId, totalAmount, items } = orderData;
    try {
      // Insert order
      const { data: order, error: orderError } = await supabase.from('orders').insert([
        {
          user_id: userId,
          total_amount: totalAmount,
          payment_status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]).select('*').single();
      if (orderError || !order) throw orderError;
      const orderId = order.id;
      // Insert order items
      const { data: orderItems, error: itemsError } = await supabase.from('order_items').insert(
        items.map(i => ({ order_id: orderId, ebook_id: i.ebookId, price: i.price }))
      ).select();
      return { data: { order, items: orderItems }, error: null };
    } catch (error) {
      console.error('Error creating order:', error);
      return { data: null as any, error: error as any };
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
    try {
      // Update order
      const { data, error } = await supabase.from('orders').update({ payment_status: status, ...paymentData }).eq('id', orderId).select('*').single();
      if (error) throw error;
      if (status === 'completed') {
        await this.addBooksToUserLibrary(orderId);
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating order payment status:', error);
      return { data: null as any, error: error as any };
    }
  }

  private async addBooksToUserLibrary(orderId: string) {
    try {
      // Fetch order
      const { data: order, error: orderError } = await supabase.from('orders').select('*').eq('id', orderId).single();
      if (orderError || !order) return;
      // Fetch order items
      const { data: items, error: itemsError } = await supabase.from('order_items').select('*').eq('order_id', orderId);
      if (itemsError || !items) return;
      // Insert user_library entries
      for (const item of items) {
        const upsertObj = {
          user_id: order.user_id,
          ebook_id: item.ebook_id,
          download_count: 0,
          purchased_at: new Date().toISOString(),
        };
        await supabase.from('user_library').upsert([upsertObj], { onConflict: ['user_id', 'ebook_id'] });
      }
    } catch (e) {
      console.error('Error adding books to library:', e);
    }
  }

  async getUserOrders(userId: string) {
    try {
      // Fetch orders for user
      const { data: orders, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error || !orders) return { data: null, error };
      // Attach order_items for each order
      const withItems = await Promise.all(orders.map(async (order: any) => {
        const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
        return { ...order, order_items: items || [] };
      }));
      return { data: withItems, error: null };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return { data: null as any, error: error as any };
    }
  }

  async getAllOrders() {
    try {
      // Fetch all orders
      const { data: orders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error || !orders) return { data: null, error };
      // Attach order_items for each order
      const withItems = await Promise.all(orders.map(async (order: any) => {
        const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
        return { ...order, order_items: items || [] };
      }));
      return { data: withItems, error: null };
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return { data: null as any, error: error as any };
    }
  }

  // User Library
  async getUserLibrary(userId: string) {
    try {
      const libSnap = await getDocs(query(collection(firestore, 'user_library'), where('user_id', '==', userId), orderBy('purchased_at', 'desc')))
      const items = [] as any[]
      for (const d of libSnap.docs) {
        const lib = d.data() as any
        const ebookSnap = await getDoc(doc(firestore, 'ebooks', lib.ebook_id))
        items.push({ ...lib, ebooks: { id: ebookSnap.id, ...ebookSnap.data() } })
      }
      return { data: items as any, error: null as any }
    } catch (error) {
      console.error('Error fetching user library:', error)
      return { data: null as any, error: error as any }
    }
  }

  async checkUserOwnsEbook(userId: string, ebookId: string) {
    try {
      const libId = `${userId}_${ebookId}`
      const snap = await getDoc(doc(firestore, 'user_library', libId))
      return { owns: snap.exists(), error: null as any }
    } catch (error) {
      console.error('Error checking book ownership:', error)
      return { owns: false, error: error as any }
    }
  }

  // Analytics for admin
  async getDashboardStats() {
    try {
      const [profilesSnap, ebooksSnap, ordersSnap] = await Promise.all([
        getDocs(collection(firestore, 'profiles')),
        getDocs(collection(firestore, 'ebooks')),
        getDocs(collection(firestore, 'orders')),
      ])
      const totalUsers = profilesSnap.size
      const totalBooks = ebooksSnap.size
      const totalOrders = ordersSnap.size
      const recentOrdersSnap = await getDocs(query(collection(firestore, 'orders'), orderBy('created_at', 'desc'), qLimit(5)))
      const recentOrders = recentOrdersSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      const completedOrdersSnap = await getDocs(query(collection(firestore, 'orders'), where('payment_status', '==', 'completed')))
      const totalRevenue = completedOrdersSnap.docs.reduce((sum, d) => sum + Number((d.data() as any).total_amount || 0), 0)
      return { totalUsers, totalBooks, totalOrders, totalRevenue, recentOrders }
    } catch (error) {
      console.error('Error computing dashboard stats:', error)
      return { totalUsers: 0, totalBooks: 0, totalOrders: 0, totalRevenue: 0, recentOrders: [] as any[] }
    }
  }
}

export const db = new DatabaseService()
export default db
