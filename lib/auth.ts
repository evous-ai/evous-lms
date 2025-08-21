import { createClient } from '@/utils/supabase/client'
import { SignupData, LoginData, ProfileUpdateData, AuthUser, Profile } from './types'

// Função para gerar username único baseado no nome completo
function generateUsername(fullName: string): string {
  const base = fullName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .trim()
  
  return base
}

// Função para verificar se username já existe
async function isUsernameAvailable(username: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao verificar username:', error)
    return false
  }
  
  return !data
}

// Função para gerar username único
async function generateUniqueUsername(fullName: string): Promise<string> {
  let username = generateUsername(fullName)
  let counter = 1
  
  while (!(await isUsernameAvailable(username))) {
    username = `${generateUsername(fullName)}${counter}`
    counter++
  }
  
  return username
}

// Cadastro de usuário (client-side)
export async function signUp(userData: SignupData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const supabase = createClient()
    
    // 1. Criar usuário no auth.users com user_metadata para acionar o trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          country: userData.country,
          email: userData.email
        },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`
      }
    })

    if (authError) {
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Erro ao criar usuário' }
    }

    // 2. Força logout imediatamente para evitar sessão ativa
    await supabase.auth.signOut()

    // 3. Aguarda um pouco para garantir que o logout foi processado
    await new Promise(resolve => setTimeout(resolve, 200))

    // 4. Verifica se ainda há sessão ativa e força logout novamente se necessário
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.auth.signOut()
      // Aguarda mais um pouco
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 5. Retorna sucesso - o usuário deve fazer login separadamente
    return {
      success: true,
      user: {
        user: authData.user,
        profile: null
      }
    }
  } catch (error) {
    console.error('signUp - Exceção:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Login de usuário (client-side)
export async function signIn(loginData: LoginData): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    // Buscar perfil do usuário
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      return { success: false, error: 'Erro ao buscar perfil do usuário' }
    }

    return {
      success: true,
      user: {
        user: data.user,
        profile: profileData
      }
    }
  } catch (error) {
    console.error('Erro no login:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Logout
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Erro no logout:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Buscar usuário atual (client-side)
export async function getCurrentUser(): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const supabase = createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    // Buscar perfil do usuário
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return { success: false, error: 'Erro ao buscar perfil do usuário' }
    }

    return {
      success: true,
      user: {
        user,
        profile: profileData
      }
    }
  } catch (error) {
    console.error('getCurrentUser - Exceção:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Atualizar perfil
export async function updateProfile(profileData: ProfileUpdateData): Promise<{ success: boolean; error?: string; profile?: Profile }> {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    // Se o nome foi alterado, verificar se precisa gerar novo username
    let username = undefined
    if (profileData.full_name) {
      const currentProfile = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
      
      if (currentProfile.data?.full_name !== profileData.full_name) {
        username = await generateUniqueUsername(profileData.full_name)
      }
    }

    const updateData: Partial<ProfileUpdateData> = { ...profileData }
    if (username) {
      updateData.username = username
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, profile: data }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}
