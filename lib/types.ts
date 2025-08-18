import { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  country: string | null
  address: string | null
  email: string | null
  updated_at: string
}

export interface AuthUser {
  user: User
  profile: Profile | null
}

export interface SignupData {
  email: string
  password: string
  full_name: string
  country: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ProfileUpdateData {
  full_name?: string
  avatar_url?: string
  country?: string
  address?: string
  email?: string
  username?: string
}
