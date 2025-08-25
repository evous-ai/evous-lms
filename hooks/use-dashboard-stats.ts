import { useMemo } from 'react'
import { Treinamento, DashboardStats } from '@/lib/types/dashboard'

export function useDashboardStats(treinamentos: Treinamento[]) {
  const stats = useMemo((): DashboardStats => {
    const totalCursos = treinamentos.length
    const cursosEmAndamento = treinamentos.filter(t => t.status === 'em-andamento').length
    const cursosConcluidos = treinamentos.filter(t => t.status === 'concluido').length
    const cursosNaoIniciados = treinamentos.filter(t => t.status === 'nao-iniciado').length

    return {
      totalCursos,
      cursosEmAndamento,
      cursosConcluidos,
      cursosNaoIniciados
    }
  }, [treinamentos])

  return stats
}
