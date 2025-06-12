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
      practice_items: {
        Row: {
          id: string
          created_at: string
          name: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          user_id?: string
        }
      }
      practice_sessions: {
        Row: {
          id: string
          created_at: string
          duration: number
          name: string
          notes: string | null
          target_bpm: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          duration: number
          name: string
          notes?: string | null
          target_bpm: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          duration?: number
          name?: string
          notes?: string | null
          target_bpm?: number
          user_id?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 