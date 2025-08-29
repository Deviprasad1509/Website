"use client"

import { db as firestore } from './firebase/client'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore'

export interface PurchaseStatus {
  canDownload: boolean
  isPurchased: boolean
  isFree: boolean
  downloadCount: number
  maxDownloads: number
  lastDownloadedAt: string | null
}

export class DownloadService {

  /**
   * Check if user can download a specific ebook
   */
  async checkDownloadPermission(userId: string, ebookId: string): Promise<PurchaseStatus> {
    try {
      console.log('🔍 Checking download permission for:', { userId, ebookId })

      // First, get the ebook details to check if it's free
      const ebookSnap = await getDoc(doc(firestore, 'ebooks', ebookId))
      if (!ebookSnap.exists()) throw new Error('Book not found')
      const ebook: any = { id: ebookSnap.id, ...ebookSnap.data() }

      const isFree = ebook.price === 0

      // If it's free, user can always download
      if (isFree) {
        return {
          canDownload: true,
          isPurchased: true,
          isFree: true,
          downloadCount: 0,
          maxDownloads: -1, // Unlimited for free books
          lastDownloadedAt: null
        }
      }

      // For paid books, check if user has purchased it
      const libId = `${userId}_${ebookId}`
      const libSnap = await getDoc(doc(firestore, 'user_library', libId))
      if (!libSnap.exists()) {
        return {
          canDownload: false,
          isPurchased: false,
          isFree: false,
          downloadCount: 0,
          maxDownloads: 3,
          lastDownloadedAt: null
        }
      }
      const libraryItem: any = libSnap.data()

      // Check download limits (3 downloads max for paid books)
      const maxDownloads = 3
      const canDownload = libraryItem.download_count < maxDownloads

      return {
        canDownload,
        isPurchased: true,
        isFree: false,
        downloadCount: libraryItem.download_count,
        maxDownloads,
        lastDownloadedAt: libraryItem.last_downloaded_at
      }

    } catch (error) {
      console.error('❌ Error checking download permission:', error)
      throw error
    }
  }

  /**
   * Handle ebook download - validates permission and tracks download
   */
  async downloadEbook(userId: string, ebookId: string): Promise<{ downloadUrl: string; filename: string }> {
    try {
      console.log('📥 Starting download for:', { userId, ebookId })

      // Check permission first
      const permission = await this.checkDownloadPermission(userId, ebookId)
      
      if (!permission.canDownload) {
        if (!permission.isPurchased) {
          throw new Error('You must purchase this book before downloading')
        } else {
          throw new Error(`Download limit reached (${permission.downloadCount}/${permission.maxDownloads})`)
        }
      }

      // Get ebook details
      const { data: ebook, error: ebookError } = await this.supabase
        .from('ebooks')
        .select('*')
        .eq('id', ebookId)
        .single()

      if (ebookError || !ebook.pdf_url) {
        throw new Error('Book file not found')
      }

      // For paid books, update download count
      if (!permission.isFree) {
        await this.updateDownloadCount(userId, ebookId)
      }

      // Return download information
      return {
        downloadUrl: ebook.pdf_url,
        filename: `${ebook.title} - ${ebook.author}.pdf`
      }

    } catch (error) {
      console.error('❌ Download error:', error)
      throw error
    }
  }

  /**
   * Update download count and timestamp
   */
  private async updateDownloadCount(userId: string, ebookId: string): Promise<void> {
    const libId = `${userId}_${ebookId}`
    const ref = doc(firestore, 'user_library', libId)
    const snap = await getDoc(ref)
    const current = (snap.data() as any) || { download_count: 0 }
    await setDoc(ref, {
      user_id: userId,
      ebook_id: ebookId,
      download_count: (current.download_count || 0) + 1,
      last_downloaded_at: serverTimestamp(),
    }, { merge: true })
    console.log('✅ Download count updated')
  }

  /**
   * Process free book "purchase" - add to user library instantly
   */
  async processFreeBookPurchase(userId: string, ebookId: string): Promise<void> {
    try {
      console.log('🆓 Processing free book purchase:', { userId, ebookId })

      // Check if already in library
      const libId = `${userId}_${ebookId}`
      const existing = await getDoc(doc(firestore, 'user_library', libId))
      if (existing.exists()) {
        console.log('✅ Book already in library')
        return
      }

      // Add to user library
      await setDoc(doc(firestore, 'user_library', libId), {
        user_id: userId,
        ebook_id: ebookId,
        download_count: 0,
        purchased_at: serverTimestamp(),
      })

      console.log('✅ Free book added to library')

    } catch (error) {
      console.error('❌ Error processing free book purchase:', error)
      throw error
    }
  }

  /**
   * Get user's library (purchased books)
   */
  async getUserLibrary(userId: string): Promise<Array<any & { download_count: number; last_downloaded_at: string | null; purchased_at: string }>> {
    try {
      const libSnap = await getDocs(query(collection(firestore, 'user_library') as any, where('user_id', '==', userId)))
      const items: any[] = []
      for (const d of libSnap.docs) {
        const lib = d.data() as any
        const ebookSnap = await getDoc(doc(firestore, 'ebooks', lib.ebook_id))
        items.push({ ...(ebookSnap.data() as any), download_count: lib.download_count, last_downloaded_at: lib.last_downloaded_at, purchased_at: lib.purchased_at })
      }
      return items

    } catch (error) {
      console.error('❌ Error fetching user library:', error)
      throw error
    }
  }

  /**
   * Handle payment completion - add books to user library
   */
  async processPaymentCompletion(userId: string, orderId: string): Promise<void> {
    try {
      console.log('💳 Processing payment completion:', { userId, orderId })

      // Get order items
      const itemsSnap = await getDocs(query(collection(firestore, 'order_items') as any, where('order_id', '==', orderId)))
      const orderItems = itemsSnap.docs.map(d => d.data() as any)

      // Add each book to user library
      for (const item of orderItems) {
        const libId = `${userId}_${item.ebook_id}`
        await setDoc(doc(firestore, 'user_library', libId), {
          user_id: userId,
          ebook_id: item.ebook_id,
          download_count: 0,
          purchased_at: serverTimestamp(),
        }, { merge: true })
      }

      console.log('✅ Books added to user library')

    } catch (error) {
      console.error('❌ Error processing payment completion:', error)
      throw error
    }
  }
}

// Export singleton instance
export const downloadService = new DownloadService()
