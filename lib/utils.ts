import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Course } from './courses-server'
import { Treinamento } from './types/dashboard'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte dados de Course para Treinamento (formato do dashboard)
 */
export function convertCourseToTreinamento(course: Course): Treinamento {
  // Calcular número total de vídeos
  const totalVideos = course.modules?.reduce((acc, module) => {
    return acc + (module.videos?.length || 0)
  }, 0) || 0
  
  // Determinar status baseado no progresso (por enquanto fixo)
  const status = 'nao-iniciado' as const
  
  // Determinar ação baseada no status
  const acao = 'Começar' // Por enquanto fixo, pode ser atualizado depois
  
  return {
    id: course.id,
    titulo: course.title,
    categoria: course.categories?.name || 'Sem categoria',
    status,
    progresso: 0, // Progresso padrão, pode ser atualizado depois
    videos: totalVideos,
    duracao: totalVideos > 0 ? `${totalVideos} vídeos` : '0 vídeos',
    cor: (course.categories?.color as 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo') || 'blue',
    acao,
    acaoVariant: 'default' as const,
    acaoHref: `/trilha/${course.id}`
  }
}
