export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          updated_at?: string
        }
      }
      ebooks: {
        Row: {
          id: string
          title: string
          author: string
          description: string
          price: number
          cover_image: string | null
          pdf_url: string | null
          category: string
          tags: string[] | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          description: string
          price: number
          cover_image?: string | null
          pdf_url?: string | null
          category: string
          tags?: string[] | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          description?: string
          price?: number
          cover_image?: string | null
          pdf_url?: string | null
          category?: string
          tags?: string[] | null
          is_featured?: boolean
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          payment_status: 'pending' | 'completed' | 'failed'
          payment_id: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          ebook_id: string
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          ebook_id: string
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          ebook_id?: string
          price?: number
        }
      }
      user_library: {
        Row: {
          id: string
          user_id: string
          ebook_id: string
          purchased_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ebook_id: string
          purchased_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ebook_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'admin'
      payment_status: 'pending' | 'completed' | 'failed'
    }
  }
}
