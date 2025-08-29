import { db as firestore } from './firebase/client'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit as qLimit,
  serverTimestamp,
} from 'firebase/firestore'

class DatabaseService {
  // Ebooks

  async getEbooks(filters?: { category?: string; featured?: boolean; limit?: number }) {
    try {
      const col = collection(firestore, 'ebooks')
      const clauses: any[] = []
      if (filters?.category) clauses.push(where('category', '==', filters.category))
      if (filters?.featured !== undefined) clauses.push(where('is_featured', '==', filters.featured))
      let q = clauses.length ? query(col, ...clauses, orderBy('created_at', 'desc')) : query(col, orderBy('created_at', 'desc'))
      if (filters?.limit) q = query(q, qLimit(filters.limit))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]
      return { data, error: null as any }
    } catch (error) {
      console.error('Error fetching ebooks:', error)
      return { data: null as any, error: error as any }
    }
  }

  async getEbookById(id: string) {
    try {
      const ref = doc(firestore, 'ebooks', id)
      const snap = await getDoc(ref)
      if (!snap.exists()) return { data: null as any, error: new Error('Not found') as any }
      return { data: { id: snap.id, ...snap.data() } as any, error: null as any }
    } catch (error) {
      console.error('Error fetching ebook:', error)
      return { data: null as any, error: error as any }
    }
  }

  async createEbook(ebook: any) {
    try {
      const col = collection(firestore, 'ebooks')
      const docRef = await addDoc(col, { ...ebook, created_at: serverTimestamp() })
      const snap = await getDoc(docRef)
      return { data: { id: snap.id, ...snap.data() } as any, error: null as any }
    } catch (error) {
      console.error('Error creating ebook:', error)
      return { data: null as any, error: error as any }
    }
  }

  async updateEbook(id: string, updates: any) {
    try {
      const ref = doc(firestore, 'ebooks', id)
      await updateDoc(ref, updates)
      const snap = await getDoc(ref)
      return { data: { id: snap.id, ...snap.data() } as any, error: null as any }
    } catch (error) {
      console.error('Error updating ebook:', error)
      return { data: null as any, error: error as any }
    }
  }

  async deleteEbook(id: string) {
    try {
      const ref = doc(firestore, 'ebooks', id)
      await deleteDoc(ref)
      return { success: true, error: null as any }
    } catch (error) {
      console.error('Error deleting ebook:', error)
      return { success: false, error: error as any }
    }
  }

  // User Profile
  async getProfile(userId: string) {
    try {
      const ref = doc(firestore, 'profiles', userId)
      const snap = await getDoc(ref)
      if (!snap.exists()) return { data: null as any, error: new Error('Not found') as any }
      return { data: snap.data() as any, error: null as any }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return { data: null as any, error: error as any }
    }
  }

  async updateProfile(userId: string, updates: any) {
    try {
      const ref = doc(firestore, 'profiles', userId)
      await updateDoc(ref, updates)
      const snap = await getDoc(ref)
      return { data: snap.data() as any, error: null as any }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null as any, error: error as any }
    }
  }

  async getAllProfiles() {
    try {
      const col = collection(firestore, 'profiles')
      const snap = await getDocs(query(col, orderBy('created_at', 'desc')))
      const data = snap.docs.map(d => d.data()) as any[]
      return { data, error: null as any }
    } catch (error) {
      console.error('Error fetching profiles:', error)
      return { data: null as any, error: error as any }
    }
  }

  // Orders
  async createOrder(orderData: {
    userId: string;
    totalAmount: number;
    items: Array<{ ebookId: string; price: number }>;
  }) {
    const { userId, totalAmount, items } = orderData
    try {
      const ordersCol = collection(firestore, 'orders')
      const orderRef = await addDoc(ordersCol, {
        user_id: userId,
        total_amount: totalAmount,
        payment_status: 'pending',
        created_at: serverTimestamp(),
      })
      const orderId = orderRef.id
      const itemsCol = collection(firestore, 'order_items')
      const createdItems: any[] = []
      for (const item of items) {
        const ir = await addDoc(itemsCol, {
          order_id: orderId,
          ebook_id: item.ebookId,
          price: item.price,
        })
        const snap = await getDoc(ir)
        createdItems.push({ id: snap.id, ...snap.data() })
      }
      const orderSnap = await getDoc(orderRef)
      return { data: { order: { id: orderId, ...orderSnap.data() }, items: createdItems } as any, error: null as any }
    } catch (error) {
      console.error('Error creating order:', error)
      return { data: null as any, error: error as any }
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
      const ref = doc(firestore, 'orders', orderId)
      await updateDoc(ref, { payment_status: status, ...paymentData })
      if (status === 'completed') {
        await this.addBooksToUserLibrary(orderId)
      }
      const snap = await getDoc(ref)
      return { data: { id: snap.id, ...snap.data() } as any, error: null as any }
    } catch (error) {
      console.error('Error updating order payment status:', error)
      return { data: null as any, error: error as any }
    }
  }

  private async addBooksToUserLibrary(orderId: string) {
    try {
      const orderRef = doc(firestore, 'orders', orderId)
      const orderSnap = await getDoc(orderRef)
      const order = orderSnap.data() as any
      if (!order) return
      const itemsSnap = await getDocs(query(collection(firestore, 'order_items'), where('order_id', '==', orderId)))
      const batchItems = itemsSnap.docs.map(d => d.data()) as any[]
      for (const item of batchItems) {
        const libId = `${order.user_id}_${item.ebook_id}`
        await setDoc(doc(firestore, 'user_library', libId), {
          user_id: order.user_id,
          ebook_id: item.ebook_id,
          download_count: 0,
          purchased_at: serverTimestamp(),
        }, { merge: true })
      }
    } catch (e) {
      console.error('Error adding books to library:', e)
    }
  }

  async getUserOrders(userId: string) {
    try {
      const ordersSnap = await getDocs(query(collection(firestore, 'orders'), where('user_id', '==', userId), orderBy('created_at', 'desc')))
      const orders = [] as any[]
      for (const d of ordersSnap.docs) {
        const order = { id: d.id, ...d.data() } as any
        const itemsSnap = await getDocs(query(collection(firestore, 'order_items'), where('order_id', '==', d.id)))
        order.order_items = itemsSnap.docs.map(i => ({ id: i.id, ...i.data() }))
        orders.push(order)
      }
      return { data: orders as any, error: null as any }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      return { data: null as any, error: error as any }
    }
  }

  async getAllOrders() {
    try {
      const ordersSnap = await getDocs(query(collection(firestore, 'orders'), orderBy('created_at', 'desc')))
      const orders = [] as any[]
      for (const d of ordersSnap.docs) {
        const order = { id: d.id, ...d.data() } as any
        const itemsSnap = await getDocs(query(collection(firestore, 'order_items'), where('order_id', '==', d.id)))
        order.order_items = itemsSnap.docs.map(i => ({ id: i.id, ...i.data() }))
        orders.push(order)
      }
      return { data: orders as any, error: null as any }
    } catch (error) {
      console.error('Error fetching all orders:', error)
      return { data: null as any, error: error as any }
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
