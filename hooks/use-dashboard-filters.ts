import { useState, useMemo } from 'react'
import { Treinamento, DashboardFilters } from '@/lib/types/dashboard'

export function useDashboardFilters(treinamentos: Treinamento[]) {
  const [filters, setFilters] = useState<DashboardFilters>({
    busca: '',
    categoria: 'Todas as Categorias',
    status: 'Todos os Status'
  })

  // Status disponíveis para filtro
  const statusOptions = ["Todos os Status", "Em Andamento", "Concluído", "Não Iniciado"]

  // Treinamentos filtrados
  const treinamentosFiltrados = useMemo(() => {
    return treinamentos.filter(treinamento => {
      const matchBusca = treinamento.titulo.toLowerCase().includes(filters.busca.toLowerCase()) ||
                        treinamento.categoria.toLowerCase().includes(filters.busca.toLowerCase())
      
      const matchCategoria = filters.categoria === "Todas as Categorias" || 
                            treinamento.categoria === filters.categoria
      
      const matchStatus = filters.status === "Todos os Status" || 
        (filters.status === "Em Andamento" && treinamento.status === "em-andamento") ||
        (filters.status === "Concluído" && treinamento.status === "concluido") ||
        (filters.status === "Não Iniciado" && treinamento.status === "nao-iniciado")
      
      return matchBusca && matchCategoria && matchStatus
    })
  }, [treinamentos, filters])

  // Verificar se há filtros ativos
  const temFiltrosAtivos = Boolean(filters.busca) || 
                           filters.categoria !== "Todas as Categorias" || 
                           filters.status !== "Todos os Status"

  // Limpar filtros
  const limparFiltros = () => {
    setFilters({
      busca: '',
      categoria: 'Todas as Categorias',
      status: 'Todos os Status'
    })
  }

  // Atualizar filtros
  const atualizarFiltro = (key: keyof DashboardFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return {
    filters,
    treinamentosFiltrados,
    statusOptions,
    temFiltrosAtivos,
    limparFiltros,
    atualizarFiltro
  }
}
