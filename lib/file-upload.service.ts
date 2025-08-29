import { storage } from './firebase/client'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

class FileUploadService {

  async uploadBookCover(file: File, bookId: string): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `book-covers/${bookId}_${Date.now()}.${fileExt}`
      const storageRef = ref(storage, `book-assets/${fileName}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      return { url, error: null }
    } catch (err) {
      console.error('Error in uploadBookCover:', err)
      return { url: null, error: err as Error }
    }
  }

  async uploadBookPdf(file: File, bookId: string): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `book-pdfs/${bookId}_${Date.now()}.${fileExt}`
      const storageRef = ref(storage, `book-assets/${fileName}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      return { url, error: null }
    } catch (err) {
      console.error('Error in uploadBookPdf:', err)
      return { url: null, error: err as Error }
    }
  }

  async deleteFile(filePath: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const storageRef = ref(storage, `book-assets/${filePath}`)
      await deleteObject(storageRef)
      return { success: true, error: null }
    } catch (err) {
      console.error('Error in deleteFile:', err)
      return { success: false, error: err as Error }
    }
  }

  // Helper function to extract file path from URL
  extractFilePathFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/o/')
      // Firebase download URLs look like .../o/book-assets%2Fpath?...
      const encodedPath = urlParts.length > 1 ? urlParts[1].split('?')[0] : ''
      return decodeURIComponent(encodedPath).replace('book-assets/', '')
    } catch {
      return null
    }
  }
}

export const fileUploadService = new FileUploadService()
export default fileUploadService
