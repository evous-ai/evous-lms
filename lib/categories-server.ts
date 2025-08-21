import { createClient } from '@/utils/supabase/server'
import { Category } from './categories'

// Função para buscar categorias no server-side (para uso em API routes ou Server Components)
export async function getCategoriesByCompany(companyId: string): Promise<{ success: boolean; categories?: Category[]; error?: string }> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('company_id', companyId)
      .order('name', { ascending: true })

    if (error) {
      console.error('Erro ao buscar categorias:', error)
      return { success: false, error: error.message }
    }

    return { success: true, categories: data || [] }
  } catch (error) {
    console.error('Exceção ao buscar categorias:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}
