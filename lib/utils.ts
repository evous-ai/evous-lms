import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Course } from '@/lib/courses-server'
import { Treinamento } from '@/lib/types/dashboard'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte um objeto Course do Supabase para o formato Treinamento esperado pelo dashboard
 */
export function convertCourseToTreinamento(course: Course): Treinamento {
  const totalVideos = course.modules?.reduce((acc, module) => 
    acc + (module.videos?.length || 0), 0) || 0
  
  const videosConcluidos = course.progress?.videosConcluidos || 0
  const percent = course.progress && totalVideos > 0 
    ? Math.round((videosConcluidos / totalVideos) * 100) 
    : 0

  // Calcular tempo total dos vídeos
  let totalDurationSeconds = 0
  course.modules?.forEach(module => {
    module.videos?.forEach(video => {
      totalDurationSeconds += video.duration || 0
    })
  })

  // Converter para formato legível
  let duracao = '0 min'
  if (totalDurationSeconds > 0) {
    const hours = Math.floor(totalDurationSeconds / 3600)
    const minutes = Math.floor((totalDurationSeconds % 3600) / 60)
    duracao = hours > 0 ? `${hours}h${minutes}min` : `${minutes}min`
  }

  // Determinar status baseado no progresso
  let status: 'concluido' | 'em-andamento' | 'nao-iniciado' = 'nao-iniciado'
  if (percent === 100 && totalVideos > 0) {
    status = 'concluido'
  } else if (percent > 0) {
    status = 'em-andamento'
  }

  // Mapear cor da categoria para o formato esperado
  const getCorFromCategory = (categoryColor: string | null | undefined): 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo' => {
    if (!categoryColor) return 'blue'
    
    const colorMap: Record<string, 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo'> = {
      'blue': 'blue',
      'green': 'green',
      'purple': 'purple',
      'orange': 'orange',
      'pink': 'pink',
      'indigo': 'indigo',
      // Mapear cores hex para cores nomeadas
      '#3B82F6': 'blue',
      '#10B981': 'green',
      '#8B5CF6': 'purple',
      '#F59E0B': 'orange',
      '#EC4899': 'pink',
      '#6366F1': 'indigo'
    }
    
    return colorMap[categoryColor.toLowerCase()] || 'blue'
  }

  return {
    id: course.id,
    titulo: course.title,
    categoria: course.categories?.name || 'Sem categoria',
    status: status,
    progresso: percent,
    videos: totalVideos,
    duracao: duracao,
    cor: getCorFromCategory(course.categories?.color),
    acao: 'Ver curso',
    acaoVariant: 'default' as const,
    acaoHref: `/trilha/${course.id}`
  }
}

/**
 * Trunca texto para um comprimento máximo especificado
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text || text.length <= maxLength) {
    return text
  }
  return `${text.substring(0, maxLength)}...`
}
