import { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser

export interface Company {
  id: string
  name: string
  primary_color: string
  logo: string
  dark_logo: string
  icon: string
  created_at?: string
  updated_at?: string
}

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  country: string | null
  address: string | null
  email: string | null
  phone?: string | null
  age?: string | null
  position?: string | null
  notification?: boolean | null
  company_id: string
  company?: Company
  updated_at: string
}

export interface AuthUser {
  user: User
  profile: Profile | null
}

export interface AuthenticatedUser {
  user: {
    id: string
    email?: string
  }
  profile: Profile | null
}

export interface AuthStatus {
  isAuthenticated: boolean
  user: {
    id: string
    email?: string
  } | null
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
  phone?: string
  age?: string
  position?: string
  notification?: boolean
  company_id?: string
}
