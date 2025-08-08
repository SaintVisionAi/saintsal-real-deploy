import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nivrmhkdgtmmbtswyvey.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdnJtaGtkZ3RtbWJ0c3d5dmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MTA1MjEsImV4cCI6MjA2MjA4NjUyMX0.Y0lx7FA97zV3GkKAmu_5aV8Bz98AYyqvHdHEau6Tvfc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key (for admin operations)
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdnJtaGtkZ3RtbWJ0c3d5dmV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjUxMDUyMSwiZXhwIjoyMDYyMDg2NTIxfQ.a7TZ8WPFSX96EbZl4b7PQLuEzPkss9jdi6vUDEJsJPc'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string
          is_admin: boolean
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone: string
          is_admin?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          is_admin?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}