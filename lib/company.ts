import { createClient } from '@/utils/supabase/client'
import { Company } from './types'

/**
 * Busca uma empresa específica por ID (client-side)
 */
export async function getCompany(id: string): Promise<{ success: boolean; company?: Company; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, company: data }
  } catch (error) {
    console.error('Erro ao buscar empresa:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

/**
 * Busca todas as empresas (client-side)
 */
export async function getCompanies(): Promise<{ success: boolean; companies?: Company[]; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name')

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, companies: data || [] }
  } catch (error) {
    console.error('Erro ao buscar empresas:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

/**
 * Busca a empresa padrão (primeira empresa ou empresa específica)
 * Útil para casos onde só há uma empresa ou queremos uma padrão
 */
export async function getDefaultCompany(): Promise<{ success: boolean; company?: Company; error?: string }> {
  try {
    const supabase = createClient()
    
    // Primeiro tenta buscar pela empresa padrão (Lubrax)
    const { data: defaultCompany, error: defaultError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31')
      .single()

    if (defaultCompany && !defaultError) {
      return { success: true, company: defaultCompany }
    }

    // Se não encontrar, busca a primeira empresa disponível
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, company: companies }
  } catch (error) {
    console.error('Erro ao buscar empresa padrão:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}
