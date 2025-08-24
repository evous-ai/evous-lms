import { getCategoriesByCompany } from './categories-server'
import { getLatestCourses, getCategoryProgress, getCourseWithModules } from './courses-server'

/**
 * Função server-side para buscar dados do dashboard
 * Pode ser usada em qualquer Server Component
 */
export async function getDashboardData(userId: string, companyId: string) {
  try {
    // Buscar dados em paralelo para melhor performance
    const [categorias, cursos, progressoCategorias] = await Promise.all([
      getCategoriesByCompany(companyId),
      getLatestCourses(6),
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
export async function getCoursesData(userId: string, limit: number = 6) {
  try {
    const cursos = await getLatestCourses(limit)
    
    return {
      cursos: cursos || [],
      error: null
    }
  } catch (error) {
    console.error('Erro ao buscar cursos:', error)
    return {
      cursos: [],
      error: 'Erro ao carregar cursos'
    }
  }
}

/**
 * Função server-side para buscar dados de um curso específico por ID
 */
export async function getCourseById(courseId: string, userId?: string) {
  try {
    // Buscar curso real do banco de dados
    const course = await getCourseWithModules(courseId)
    
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

    // Calcular progresso real do curso
    let totalVideos = 0
    let videosConcluidos = 0

    // Converter dados do banco para o formato esperado pela página
    const courseData = {
      id: course.id,
      titulo: course.title,
      descricao: course.description || 'Descrição não disponível',
      totalVideos: 0, // Será calculado
      concluidos: 0, // Será calculado
      percent: 0, // Será calculado
      duracaoTotal: '0 min', // Será calculado
      categoria: course.categories?.name || 'Sem categoria',
      modulos: course.modules
        ?.sort((a, b) => (a.order || 0) - (b.order || 0)) // Ordenar por order
        .map((module) => {
          const moduleVideos = module.videos
            ?.sort((a, b) => (a.order || 0) - (b.order || 0)) // Ordenar vídeos por order
            .map((video) => {
              const status = getVideoStatus(video.progress_videos || [])
              
              // Contar vídeos por status
              totalVideos++
              if (status === 'concluida') videosConcluidos++
              
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

    // Atualizar contadores com valores reais
    courseData.totalVideos = totalVideos
    courseData.concluidos = videosConcluidos

    // Calcular percentual de conclusão
    if (courseData.totalVideos > 0) {
      courseData.percent = Math.round((courseData.concluidos / courseData.totalVideos) * 100)
    }

    // Calcular duração total
    const totalDurationSeconds = courseData.modulos.reduce((acc, module) => 
      acc + module.aulas.reduce((acc2, aula) => {
        const [minutes, seconds] = aula.duracao.split(':').map(Number)
        return acc2 + (minutes * 60 + seconds)
      }, 0), 0
    )
    
    if (totalDurationSeconds > 0) {
      const hours = Math.floor(totalDurationSeconds / 3600)
      const minutes = Math.floor((totalDurationSeconds % 3600) / 60)
      courseData.duracaoTotal = hours > 0 ? `${hours}h${minutes}min` : `${minutes}min`
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
