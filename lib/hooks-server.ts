import { getCategoriesByCompany } from './categories-server'
import { getLatestCourses, getCategoryProgress, getCourseWithModules } from './courses-server'

/**
 * Função server-side para buscar dados do dashboard
 * Pode ser usada em qualquer Server Component
 */
export async function getDashboardData(userId: string, companyId: string) {
  try {
    const [categorias, cursos, progressoCategorias] = await Promise.all([
      getCategoriesByCompany(companyId),
      getLatestCourses(6, userId), // ✅ Dashboard: apenas 6 últimos cursos
      getCategoryProgress(userId, 10)
    ])

    return {
      categorias: categorias.success ? categorias.categories || [] : [],
      cursos: cursos || [],
      progressoCategorias: progressoCategorias || [],
      error: null
    }
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return {
      categorias: [],
      cursos: [],
      progressoCategorias: [],
      error: 'Erro ao carregar dados'
    }
  }
}

/**
 * Função server-side para buscar dados básicos de uma empresa
 */
export async function getCompanyData(companyId: string) {
  try {
    const categorias = await getCategoriesByCompany(companyId)
    
    return {
      categorias: categorias.success ? categorias.categories || [] : [],
      error: null
    }
  } catch (error) {
    console.error('Erro ao buscar dados da empresa:', error)
    return {
      categorias: [],
      error: 'Erro ao carregar dados da empresa'
    }
  }
}

/**
 * Função server-side para buscar cursos com filtros
 */
export async function getCoursesData(userId: string, limit?: number) {
  try {
    // ✅ Se não especificar limite, buscar todos os cursos para meus-treinamentos
    const cursos = await getLatestCourses(limit || 1000, userId) // Passar userId para calcular progresso correto
    
    return {
      cursos: cursos || [],
      error: null
    }
  } catch (error) {
    console.error('Erro ao buscar cursos:', error)
    return {
      cursos: [],
      error: 'Erro ao buscar cursos'
    }
  }
}

/**
 * Função server-side para buscar dados de um curso específico por ID
 */
export async function getCourseById(courseId: string, userId?: string) {
  try {
    // Buscar curso real do banco de dados
    const course = await getCourseWithModules(courseId, userId) // ✅ Passar userId
    
    if (!course) {
      return {
        course: null,
        error: 'Curso não encontrado'
      }
    }

    // Função para determinar o status do vídeo baseado no progresso
    const getVideoStatus = (progressVideos: Array<{
      user_id: string
      status: string
      progress_seconds: number
      completed_at: string | null
    }>): 'concluida' | 'disponivel' | 'bloqueada' | 'nao_iniciada' => {
      if (!progressVideos || progressVideos.length === 0) {
        return 'nao_iniciada'
      }
      
      const userProgress = progressVideos.find(p => p.user_id === userId)
      if (!userProgress) {
        return 'nao_iniciada'
      }
      
      switch (userProgress.status) {
        case 'completed':
          return 'concluida'
        case 'in_progress':
          return 'disponivel'
        case 'not_started':
          return 'nao_iniciada'
        default:
          return 'nao_iniciada'
      }
    }

    // ✅ Usar progresso baseado em tempo se disponível
    let totalVideos = course.progress?.totalVideos || 0
    let videosConcluidos = course.progress?.videosConcluidos || 0
    let percent = course.progress?.progressPercentage || 0
    let duracaoTotal = '0 min'

    // Se não temos progresso calculado, calcular manualmente
    if (!course.progress || course.progress.totalVideos === 0) {
      totalVideos = 0
      videosConcluidos = 0
      
      // Calcular progresso real do curso
      course.modules?.forEach(module => {
        module.videos?.forEach(video => {
          totalVideos++
          if (video.progress_videos && video.progress_videos.length > 0) {
            const hasCompleted = video.progress_videos.some((p: { status: string }) => p.status === 'completed')
            if (hasCompleted) videosConcluidos++
          }
        })
      })

      // Calcular percentual de conclusão
      if (totalVideos > 0) {
        percent = Math.round((videosConcluidos / totalVideos) * 100)
      }
    }

    // ✅ Usar duração total calculada se disponível
    if (course.progress?.totalDuration && course.progress.totalDuration > 0) {
      const totalSeconds = course.progress.totalDuration
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      duracaoTotal = hours > 0 ? `${hours}h${minutes}min` : `${minutes}min`
    }

    // Converter dados do banco para o formato esperado pela página
    const courseData = {
      id: course.id,
      titulo: course.title,
      descricao: course.description || 'Descrição não disponível',
      totalVideos: totalVideos,
      concluidos: videosConcluidos,
      percent: percent,
      duracaoTotal: duracaoTotal,
      categoria: course.categories?.name || 'Sem categoria',
      modulos: course.modules
        ?.sort((a, b) => (a.order || 0) - (b.order || 0)) // Ordenar por order
        .map((module) => {
          const moduleVideos = module.videos
            ?.sort((a, b) => (a.order || 0) - (b.order || 0)) // Ordenar vídeos por order
            .map((video) => {
              const status = getVideoStatus(video.progress_videos || [])
              
              return {
                id: video.id,
                titulo: video.title, // Agora é obrigatório no banco
                duracao: video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '0:00',
                status: status,
                video_url: video.video_url, // Agora é obrigatório no banco
                thumbnail_url: null, // Não existe no banco real
                description: video.description
              }
            }) || []
          
          return {
            id: module.id,
            titulo: module.title, // Agora é obrigatório no banco
            resumo: `${moduleVideos.length} vídeos`,
            aulas: moduleVideos
          }
        }) || []
    }

    // ✅ Calcular duração total se não foi calculada anteriormente
    if (duracaoTotal === '0 min') {
      const totalDurationSeconds = courseData.modulos.reduce((acc, module) => 
        acc + module.aulas.reduce((acc2, aula) => {
          // Converter duração do formato "MM:SS" para segundos
          const [minutes, seconds] = aula.duracao.split(':').map(Number)
          return acc2 + (minutes * 60 + seconds)
        }, 0), 0
      )
      
      if (totalDurationSeconds > 0) {
        const hours = Math.floor(totalDurationSeconds / 3600)
        const minutes = Math.floor((totalDurationSeconds % 3600) / 60)
        courseData.duracaoTotal = hours > 0 ? `${hours}h${minutes}min` : `${minutes}min`
      }
    }

    return {
      course: courseData,
      error: null
    }
  } catch (error) {
    console.error('Erro ao buscar curso:', error)
    return {
      course: null,
      error: 'Erro ao carregar dados do curso'
    }
  }
}
