export interface Database {
  public: {
    Tables: {
      practice_sessions: {
        Row: {
          id: number
          created_at: string
          date: string
          exercises: {
            name: string
            bpm: number
            duration: number
            notes?: string
          }[]
        }
        Insert: {
          id?: number
          created_at?: string
          date: string
          exercises: {
            name: string
            bpm: number
            duration: number
            notes?: string
          }[]
        }
        Update: {
          id?: number
          created_at?: string
          date?: string
          exercises?: {
            name: string
            bpm: number
            duration: number
            notes?: string
          }[]
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
  }
} 