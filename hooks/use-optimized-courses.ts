import { useState, useEffect, useMemo, useCallback } from 'react'
import { Course } from '@/lib/courses-server'
import { Treinamento } from '@/lib/types/dashboard'

// Função para converter curso em treinamento (memoizada)
const createCourseToTraining = (userId?: string) => {
  const cores: Array<"blue" | "green" | "purple" | "orange" | "pink" | "indigo"> = 
    ["blue", "green", "purple", "orange", "pink", "indigo"]
  
  return (course: Course): Treinamento => {
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)]
    
    // Calcular dados dinâmicos
    let totalVideos = 0
    let totalDuration = 0
    let videosCompletos = 0
    let videosEmAndamento = 0
    
    // Percorrer módulos e vídeos para calcular métricas
    for (const courseModule of course.modules || []) {
      for (const video of courseModule.videos || []) {
        totalVideos++
        totalDuration += video.duration || 0
        
        if (userId) {
          const userProgress = video.progress_videos?.find(p => p.user_id === userId)
          if (userProgress) {
            if (userProgress.status === 'completed') {
              videosCompletos++
            } else if (userProgress.status === 'in_progress') {
              videosEmAndamento++
            }
          }
        }
      }
    }
    
    // Determinar status e ação baseado no progresso
    let status: "concluido" | "em-andamento" | "nao-iniciado"
    let acao: string
    let acaoVariant: "default" | "outline"
    let progresso: number
    
    if (videosCompletos === 0 && videosEmAndamento === 0) {
      status = "nao-iniciado"
      acao = "Começar"
      acaoVariant = "default"
      progresso = 0
    } else if (videosCompletos === totalVideos && totalVideos > 0) {
      status = "concluido"
      acao = "Revisar"
      acaoVariant = "outline"
      progresso = 100
    } else {
      status = "em-andamento"
      acao = "Continuar"
      acaoVariant = "default"
      progresso = totalVideos > 0 ? Math.round((videosCompletos / totalVideos) * 100) : 0
    }
    
    // Formatar duração
    const formatDuration = (seconds: number) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      
      if (hours > 0) {
        return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`
      }
      return `${minutes}min`
    }
    
    return {
      id: course.id,
      titulo: course.title,
      categoria: course.categories?.name || "Geral",
      status,
      progresso,
      videos: totalVideos || 1,
      duracao: totalDuration > 0 ? formatDuration(totalDuration) : "N/D",
      cor: corAleatoria,
      acao,
      acaoVariant,
      acaoHref: `/trilha/${course.id}`
    }
  }
}

export function useOptimizedCourses(limit: number = 6, userId?: string) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoizar a função de conversão
  const courseToTraining = useMemo(() => createCourseToTraining(userId), [userId])

  // Converter cursos para treinamentos (memoizado)
  const treinamentos = useMemo(() => {
    return courses.map(courseToTraining)
  }, [courses, courseToTraining])

  // Buscar cursos
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const url = userId 
        ? `/api/courses?type=latest&limit=${limit}&userId=${userId}`
        : `/api/courses?type=latest&limit=${limit}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar cursos')
      }
      
      const data = await response.json()
      setCourses(data.courses || [])
    } catch (err) {
      console.error('Erro ao buscar cursos:', err)
      setError('Erro ao carregar cursos')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [limit, userId])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return { 
    courses, 
    treinamentos, 
    loading, 
    error, 
    refetch: fetchCourses 
  }
}
