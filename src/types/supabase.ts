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
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          blood_type: string | null
          contact_number: string | null
          cnic_id: string | null
          location: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          blood_type?: string | null
          contact_number?: string | null
          cnic_id?: string | null
          location?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          blood_type?: string | null
          contact_number?: string | null
          cnic_id?: string | null
          location?: string | null
        }
      }
      blood_requests: {
        Row: {
          id: string
          user_id: string
          name: string
          blood_type: string
          location: string
          contact_number: string
          cnic_id: string
          type: 'donor' | 'receiver'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          blood_type: string
          location: string
          contact_number: string
          cnic_id: string
          type: 'donor' | 'receiver'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          blood_type?: string
          location?: string
          contact_number?: string
          cnic_id?: string
          type?: 'donor' | 'receiver'
          created_at?: string
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
