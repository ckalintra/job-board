import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: number
          title: string
          company: string
          description: string
          location: string
          job_type: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: number
          title: string
          company: string
          description: string
          location: string
          job_type: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: number
          title?: string
          company?: string
          description?: string
          location?: string
          job_type?: string
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}