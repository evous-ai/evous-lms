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
export async function getCourseById(courseId: string) {
  try {
    // Buscar curso real do banco de dados
    const course = await getCourseWithModules(courseId)
    
    if (!course) {
      return {
        course: null,
        error: 'Curso não encontrado'
      }
    }

    // Converter dados do banco para o formato esperado pela página
    const courseData = {
      id: course.id,
      titulo: course.title,
      descricao: course.description || 'Descrição não disponível',
      totalVideos: course.modules?.reduce((acc, module) => acc + (module.videos?.length || 0), 0) || 0,
      concluidos: 0, // Por enquanto fixo, pode ser implementado depois
      percent: 0, // Por enquanto fixo, pode ser implementado depois
      duracaoTotal: '0 min', // Por enquanto fixo, pode ser implementado depois
      categoria: course.categories?.name || 'Sem categoria',
      modulos: course.modules?.map((module, moduleIndex) => ({
        id: `m${moduleIndex + 1}`,
        titulo: `Módulo ${moduleIndex + 1}`, // Por enquanto genérico, pode ser implementado depois
        resumo: `${module.videos?.length || 0} vídeos`,
        aulas: module.videos?.map((video, videoIndex) => ({
          id: video.id,
          titulo: `Aula ${videoIndex + 1}`, // Por enquanto genérico, pode ser implementado depois
          duracao: video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : '0:00',
          status: 'disponivel' as const // Por enquanto fixo, pode ser implementado depois
        })) || []
      })) || []
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
