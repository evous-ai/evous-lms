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

  // Determinar status baseado no progresso
  let status: 'concluido' | 'em-andamento' | 'nao-iniciado' = 'nao-iniciado'
  if (percent === 100 && totalVideos > 0) {
    status = 'concluido'
  } else if (percent > 0) {
    status = 'em-andamento'
  }

  return {
    id: course.id,
    titulo: course.title,
    categoria: course.categories?.name || 'Sem categoria',
    status: status,
    progresso: percent,
    videos: totalVideos,
    duracao: '0 min', // Será calculado se necessário
    cor: 'blue' as const, // Cor padrão
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
