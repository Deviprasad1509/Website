import { createClient } from './supabase/client'

class FileUploadService {
  private supabase = createClient()

  async uploadBookCover(file: File, bookId: string): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `book-covers/${bookId}_${Date.now()}.${fileExt}`

      const { data, error } = await this.supabase.storage
        .from('book-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error('Error uploading book cover:', error)
        return { url: null, error }
      }

      // Get the public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('book-assets')
        .getPublicUrl(fileName)

      return { url: publicUrl, error: null }
    } catch (err) {
      console.error('Error in uploadBookCover:', err)
      return { url: null, error: err as Error }
    }
  }

  async uploadBookPdf(file: File, bookId: string): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `book-pdfs/${bookId}_${Date.now()}.${fileExt}`

      const { data, error } = await this.supabase.storage
        .from('book-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error('Error uploading book PDF:', error)
        return { url: null, error }
      }

      // Get the public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('book-assets')
        .getPublicUrl(fileName)

      return { url: publicUrl, error: null }
    } catch (err) {
      console.error('Error in uploadBookPdf:', err)
      return { url: null, error: err as Error }
    }
  }

  async deleteFile(filePath: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await this.supabase.storage
        .from('book-assets')
        .remove([filePath])

      if (error) {
        console.error('Error deleting file:', error)
        return { success: false, error }
      }

      return { success: true, error: null }
    } catch (err) {
      console.error('Error in deleteFile:', err)
      return { success: false, error: err as Error }
    }
  }

  // Helper function to extract file path from URL
  extractFilePathFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/book-assets/')
      return urlParts.length > 1 ? urlParts[1] : null
    } catch {
      return null
    }
  }
}

export const fileUploadService = new FileUploadService()
export default fileUploadService
