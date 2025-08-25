import { createClient as createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AuthenticatedUser, AuthStatus } from './types'

/**
 * Função para API routes que verifica autenticação sem redirecionar
 * Retorna os dados do usuário ou null se não autenticado
 */
export async function getAuthenticatedUserForAPI(): Promise<AuthenticatedUser | null> {
  const supabase = createServerClient()
  
  // Busca o usuário autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return null // Retorna null em vez de fazer redirect
  }
  
  // Busca o perfil do usuário
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profileError) {
    // Se não encontrar perfil, cria um básico
    console.warn('Perfil não encontrado para usuário:', user.id)
  }
  
  return {
    user,
    profile: profile || null
  }
}

/**
 * Função utilitária para páginas que precisam de autenticação
 * Retorna os dados do usuário e perfil, ou redireciona para login
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  const supabase = createServerClient()
  
  // Busca o usuário autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/')
  }
  
  // Busca o perfil do usuário
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profileError) {
    // Se não encontrar perfil, cria um básico
    console.warn('Perfil não encontrado para usuário:', user.id)
  }
  
  return {
    user,
    profile: profile || null
  }
}

/**
 * Função para verificar se o usuário está autenticado sem redirecionar
 * Útil para componentes que precisam saber o status da autenticação
 */
export async function checkAuthStatus(): Promise<AuthStatus> {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { isAuthenticated: !!user, user: user || null }
}

/**
 * Função para verificar se o usuário está autenticado e redirecionar se necessário
 * Para páginas que devem ser acessadas apenas por usuários NÃO autenticados
 */
export async function requireGuest() {
  const { isAuthenticated } = await checkAuthStatus()
  
  if (isAuthenticated) {
    redirect('/dashboard')
  }
}

/**
 * Função para verificar se o usuário está autenticado e redirecionar se necessário
 * Para páginas que devem ser acessadas apenas por usuários autenticados
 */
export async function requireAuth() {
  const { isAuthenticated } = await checkAuthStatus()
  
  if (!isAuthenticated) {
    redirect('/')
  }
}
