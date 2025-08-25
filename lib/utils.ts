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
  // ✅ Usar progresso baseado em tempo se disponível
  let totalVideos = course.progress?.totalVideos || 0
  let videosConcluidos = course.progress?.videosConcluidos || 0
  
  // ✅ Priorizar progressPercentage baseado em tempo assistido
  let percent = 0
  if (course.progress?.progressPercentage !== undefined) {
    percent = course.progress.progressPercentage
  } else if (course.progress && totalVideos > 0) {
    // Fallback para cálculo anterior se progressPercentage não estiver disponível
    percent = Math.round((videosConcluidos / totalVideos) * 100)
  } else {
    // ✅ Se não temos progresso calculado, calcular manualmente baseado nos módulos
    let calculatedTotalVideos = 0
    let calculatedVideosConcluidos = 0
    let calculatedTotalDuration = 0
    let calculatedWatchedDuration = 0
    
    course.modules?.forEach(module => {
      module.videos?.forEach(video => {
        calculatedTotalVideos++
        calculatedTotalDuration += video.duration || 0
        
        // Verificar se o vídeo foi completado baseado em progress_videos
        if (video.progress_videos && video.progress_videos.length > 0) {
          const userProgress = video.progress_videos[0] // Pegar o primeiro progresso do usuário
          
          if (userProgress.status === 'completed') {
            calculatedVideosConcluidos++
            calculatedWatchedDuration += video.duration || 0
          } else if (userProgress.progress_seconds > 0) {
            // Se o vídeo está em progresso, contar o tempo assistido
            const progressTime = Math.min(userProgress.progress_seconds, video.duration || 0)
            calculatedWatchedDuration += progressTime
          }
        }
      })
    })
    
    // ✅ Calcular percentual baseado em tempo assistido (mais preciso)
    if (calculatedTotalDuration > 0) {
      percent = Math.round((calculatedWatchedDuration / calculatedTotalDuration) * 100)
    } else if (calculatedTotalVideos > 0) {
      // Fallback para cálculo baseado em vídeos completados
      percent = Math.round((calculatedVideosConcluidos / calculatedTotalVideos) * 100)
    }
    
    // ✅ CORREÇÃO: Se há tempo assistido mas percentual é 0, definir como pelo menos 1%
    if (calculatedWatchedDuration > 0 && percent === 0) {
      percent = 1
    }
    
    // Atualizar totalVideos se não estava disponível
    if (totalVideos === 0) {
      totalVideos = calculatedTotalVideos
    }
    
    // Atualizar videosConcluidos se não estava disponível
    if (videosConcluidos === 0) {
      videosConcluidos = calculatedVideosConcluidos
    }
  }

  // ✅ Usar duração total calculada se disponível
  let duracao = '0 min'
  if (course.progress?.totalDuration && course.progress.totalDuration > 0) {
    const totalSeconds = course.progress.totalDuration
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    duracao = hours > 0 ? `${hours}h${minutes}min` : `${minutes}min`
  } else {
    // Fallback para cálculo anterior
    let totalDurationSeconds = 0
    course.modules?.forEach(module => {
      module.videos?.forEach(video => {
        totalDurationSeconds += video.duration || 0
      })
    })

    if (totalDurationSeconds > 0) {
      const hours = Math.floor(totalDurationSeconds / 3600)
      const minutes = Math.floor((totalDurationSeconds % 3600) / 60)
      duracao = hours > 0 ? `${hours}h${minutes}min` : `${minutes}min`
    }
  }

  // ✅ Determinar status baseado no status dos módulos (se disponível)
  let status: 'concluido' | 'em-andamento' | 'nao-iniciado' = 'nao-iniciado'
  
  if (course.modules && course.modules.length > 0) {
    // ✅ Status dos módulos é calculado dinamicamente baseado em progress_videos
    // Usar type assertion para módulos com status calculado
    const modulesWithStatus = course.modules as Array<{
      id: string
      title: string
      description: string | null
      order: number | null
      created_at: string
      updated_at: string
      status: 'not_started' | 'in_progress' | 'completed'
      videos: Array<{
        id: string
        title: string
        description: string | null
        duration: number
        video_url: string
        weight: number
        order: number | null
        rating_video: number
        is_preview: boolean
        created_at: string
        updated_at: string
        progress_videos: Array<{
          user_id: string
          status: string
          progress_seconds: number
          completed_at: string | null
        }>
      }>
    }>
    
    const moduleStatuses = modulesWithStatus.map(m => m.status).filter(Boolean)
    const completedModules = moduleStatuses.filter(s => s === 'completed').length
    const inProgressModules = moduleStatuses.filter(s => s === 'in_progress').length
    
    if (completedModules === modulesWithStatus.length) {
      status = 'concluido'
    } else if (inProgressModules > 0 || completedModules > 0) {
      status = 'em-andamento'
    }
  } else {
    // Fallback para lógica anterior se não houver status dos módulos
    if (percent === 100 && totalVideos > 0) {
      status = 'concluido'
    } else if (percent > 0) {
      status = 'em-andamento'
    }
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

/**
 * Converte o status do módulo para o formato de exibição
 */
export function getModuleStatusDisplay(status: 'not_started' | 'in_progress' | 'completed'): {
  text: string
  color: string
  icon: string
} {
  switch (status) {
    case 'not_started':
      return {
        text: 'Não iniciado',
        color: 'text-gray-500',
        icon: '⭕'
      }
    case 'in_progress':
      return {
        text: 'Em andamento',
        color: 'text-blue-600',
        icon: '🔄'
      }
    case 'completed':
      return {
        text: 'Concluído',
        color: 'text-green-600',
        icon: '✅'
      }
    default:
      return {
        text: 'Desconhecido',
        color: 'text-gray-400',
        icon: '❓'
      }
  }
}

/**
 * Converte o status do módulo para o formato usado no dashboard
 */
export function getModuleStatusForDashboard(status: 'not_started' | 'in_progress' | 'completed'): 'nao-iniciado' | 'em-andamento' | 'concluido' {
  switch (status) {
    case 'not_started':
      return 'nao-iniciado'
    case 'in_progress':
      return 'em-andamento'
    case 'completed':
      return 'concluido'
    default:
      return 'nao-iniciado'
  }
}

/**
 * Formata segundos para formato legível de tempo
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 min'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h${minutes}min`
  } else if (minutes > 0) {
    return `${minutes}min`
  } else {
    return `${seconds}s`
  }
}

/**
 * Formata o progresso de tempo assistido
 */
export function formatProgressTime(watchedSeconds: number, totalSeconds: number): string {
  if (totalSeconds <= 0) return '0 min assistidos'
  
  const watchedFormatted = formatDuration(watchedSeconds)
  const totalFormatted = formatDuration(totalSeconds)
  
  return `${watchedFormatted} de ${totalFormatted}`
}
