export interface Category {
  id: string
  name: string
  description: string
  company_id: string
  color: string
  variant: string
  slug?: string | null
}

// Função para buscar categorias no client-side
export async function getCategoriesByCompanyClient(companyId: string): Promise<{ success: boolean; categories?: Category[]; error?: string }> {
  try {
    const { createClient } = await import('@/utils/supabase/client')
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
