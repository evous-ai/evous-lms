import { createClient } from '@/utils/supabase/server'

export interface Course {
  id: string
  title: string
  description: string | null
  cover_image: string | null
  level: string | null
  status: string
  rating_average: number | null
  created_at: string
  updated_at: string
  categories: {
    id: string
    name: string
    slug: string | null
    color: string | null
    variant: string | null
  } | null
  modules?: {
    id: string
    title: string
    description: string | null
    order: number | null
    created_at: string
    updated_at: string
    // ✅ Status é calculado dinamicamente, não existe na tabela modules
    videos: {
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
      progress_videos: {
        user_id: string
        status: string
        progress_seconds: number
        completed_at: string | null
      }[]
    }[]
  }[]
  progress?: {
    totalVideos: number
    videosConcluidos: number
    // ✅ Novos campos de progresso baseado em tempo
    totalDuration: number
    watchedDuration: number
    progressPercentage: number
    modulesCompleted: number
    totalModules: number
  }
}

// ✅ Tipo para status dos módulos
export type ModuleStatus = 'not_started' | 'in_progress' | 'completed'

// ✅ Interface para módulo com status
export interface ModuleWithStatus {
  id: string
  title: string
  description: string | null
  order: number | null
  created_at: string
  updated_at: string
  status: ModuleStatus
  videos: {
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
    progress_videos: {
      user_id: string
      status: string
      progress_seconds: number
      completed_at: string | null
    }[]
  }[]
}

interface CourseWithProgress extends Omit<Course, 'progress'> {
  progress?: {
    status: 'not_started' | 'in_progress' | 'completed'
    progress_seconds: number
    completed_at: string | null
  }
}

interface VideoProgress {
  user_id: string
  status: string
  progress_seconds: number
  completed_at: string | null
}

export interface CategoryProgress {
  category_id: string
  category_name: string
  category_slug: string | null
  category_color: string | null
  videos_count: number
  total_duration: number
  user_action: 'Começar' | 'Continuar' | 'Revisar'
  progress_count: number
  completion_percentage: number
  status: 'nao-iniciado' | 'em-andamento' | 'concluido'
}

/**
 * Busca os últimos N cursos publicados com progresso do usuário
 */
export async function getLatestCourses(limit: number = 6, userId?: string): Promise<Course[]> {
  const supabase = createClient()

  // Se temos userId, buscar progresso específico do usuário
  if (userId) {
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        cover_image,
        level,
        status,
        rating_average,
        created_at,
        updated_at,
        category_id,
        category:categories!category_id(
          id,
          name,
          slug,
          color,
          variant
        ),
        modules(
          id,
          title,
          description,
          order,
          created_at,
          updated_at,
          videos(
            id,
            title,
            description,
            duration,
            video_url,
            weight,
            order,
            rating_video,
            is_preview,
            created_at,
            updated_at,
            progress_videos(
              user_id,
              status,
              progress_seconds,
              completed_at
            )
          )
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Erro ao buscar cursos com progresso do usuário:', error)
      return []
    }

    // Mapear os dados para o formato correto
    return (courses || []).map(course => {
      // ✅ Calcular progresso real baseado no tempo assistido
      const courseProgress = calculateCourseProgress(course.modules, userId)
      
      // ✅ Calcular status dos módulos usando a nova função utilitária
      const modulesWithStatus = calculateCourseModulesStatus(course.modules, userId)

      // 🔍 DEBUG: Log para verificar dados
      console.log(`🔍 DEBUG - Curso: ${course.title}`)
      console.log(`📊 Progresso calculado:`, courseProgress)
      console.log(`🎯 Módulos com status:`, modulesWithStatus.length)
      console.log(`📹 Total de vídeos:`, courseProgress.totalVideos)
      console.log(`✅ Vídeos completados:`, courseProgress.videosCompleted)
      console.log(`⏱️ Progresso: ${courseProgress.progressPercentage}%`)

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        cover_image: course.cover_image,
        level: course.level,
        status: course.status,
        rating_average: course.rating_average,
        created_at: course.created_at,
        updated_at: course.updated_at,
        categories: Array.isArray(course.category) ? course.category[0] || null : course.category || null,
        modules: modulesWithStatus, // ✅ Módulos com status calculado
        progress: {
          totalVideos: courseProgress.totalVideos,
          videosConcluidos: courseProgress.videosCompleted,
          // ✅ Novos campos de progresso baseado em tempo
          totalDuration: courseProgress.totalDuration,
          watchedDuration: courseProgress.watchedDuration,
          progressPercentage: courseProgress.progressPercentage,
          modulesCompleted: courseProgress.modulesCompleted,
          totalModules: courseProgress.totalModules
        }
      } as Course
    })
  } else {
    // Fallback para busca sem progresso (comportamento anterior)
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        cover_image,
        level,
        status,
        rating_average,
        created_at,
        updated_at,
        category_id,
        category:categories!category_id(
          id,
          name,
          slug,
          color,
          variant
        ),
        modules(
          id,
          videos(
            id,
            duration
          )
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Erro ao buscar cursos:', error)
      return []
    }

    // Mapear os dados para o formato correto
    return (courses || []).map(course => {
      // Calcular total de vídeos sem progresso
      let totalVideos = 0
      course.modules?.forEach(module => {
        module.videos?.forEach(() => {
          totalVideos++
        })
      })

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        cover_image: course.cover_image,
        level: course.level,
        status: course.status,
        rating_average: course.rating_average,
        created_at: course.created_at,
        updated_at: course.updated_at,
        categories: Array.isArray(course.category) ? course.category[0] || null : course.category || null,
        modules: course.modules || [],
        progress: {
          totalVideos,
          videosConcluidos: 0 // Sem progresso do usuário
        }
      } as Course
    })
  }
}

/**
 * Busca cursos por categoria
 */
export async function getCoursesByCategory(
  categorySlug: string,
  limit: number = 6
): Promise<Course[]> {
  const supabase = createClient()

  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      cover_image,
      level,
      status,
      rating_average,
      created_at,
      updated_at,
      category_id,
      category:categories!category_id(
        id,
        name,
        slug,
        color,
        variant
      )
    `)
    .eq('status', 'published')
    .eq('categories.slug', categorySlug)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Erro ao buscar cursos por categoria:', error)
    return []
  }

  // Mapear os dados para o formato correto
  return (courses || []).map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    cover_image: course.cover_image,
    level: course.level,
    status: course.status,
    rating_average: course.rating_average,
    created_at: course.created_at,
    updated_at: course.updated_at,
    categories: Array.isArray(course.category) ? course.category[0] || null : course.category || null
  } as Course))
}

/**
 * Busca cursos com progresso do usuário
 */
export async function getCoursesWithProgress(
  userId: string,
  limit: number = 6
): Promise<CourseWithProgress[]> {
  const supabase = createClient()

  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      cover_image,
      level,
      status,
      rating_average,
      created_at,
      updated_at,
      category_id,
      category:categories!category_id(
        id,
        name,
        slug,
        color,
        variant
      ),
      modules!inner(
        id,
        videos!inner(
          id,
          progress_videos!inner(
            status,
            progress_seconds,
            completed_at
          )
        )
      )
    `)
    .eq('status', 'published')
    .eq('modules.videos.progress_videos.user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Erro ao buscar cursos com progresso:', error)
    return []
  }

  // Mapear os dados para o formato correto
  return (courses || []).map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    cover_image: course.cover_image,
    level: course.level,
    status: course.status,
    rating_average: course.rating_average,
    created_at: course.created_at,
    updated_at: course.updated_at,
    categories: Array.isArray(course.category) ? course.category[0] || null : course.category || null
  } as CourseWithProgress))
}

/**
 * Busca um curso específico por ID com todos os módulos e vídeos
 */
export async function getCourseWithModules(courseId: string, userId?: string): Promise<Course | null> {
  const supabase = createClient()

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      cover_image,
      level,
      status,
      rating_average,
      created_at,
      updated_at,
      category_id,
      category:categories!category_id(
        id,
        name,
        slug,
        color,
        variant
      ),
      modules(
        id,
        title,
        description,
        order,
        created_at,
        updated_at,
        videos(
          id,
          title,
          description,
          duration,
          video_url,
          weight,
          order,
          rating_video,
          is_preview,
          created_at,
          updated_at,
          progress_videos(
            user_id,
            status,
            progress_seconds,
            completed_at
          )
        )
      )
    `)
    .eq('id', courseId)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Erro ao buscar curso com módulos:', error)
    return null
  }

  // ✅ Calcular status dos módulos se userId estiver disponível
  const modulesWithStatus = userId 
    ? calculateCourseModulesStatus(course.modules || [], userId)
    : course.modules || []

  // ✅ Calcular progresso baseado em tempo se userId estiver disponível
  const courseProgress = userId 
    ? calculateCourseProgress(course.modules || [], userId)
    : {
        totalDuration: 0,
        watchedDuration: 0,
        progressPercentage: 0,
        modulesCompleted: 0,
        totalModules: course.modules?.length || 0,
        videosCompleted: 0,
        totalVideos: 0
      }

  // Mapear os dados para o formato correto
  return course ? {
    id: course.id,
    title: course.title,
    description: course.description,
    cover_image: course.cover_image,
    level: course.level,
    status: course.status,
    rating_average: course.rating_average,
    created_at: course.created_at,
    updated_at: course.updated_at,
    categories: Array.isArray(course.category) ? course.category[0] || null : course.category || null,
    modules: modulesWithStatus, // ✅ Módulos com status calculado
    progress: {
      totalVideos: courseProgress.totalVideos,
      videosConcluidos: courseProgress.videosCompleted,
      totalDuration: courseProgress.totalDuration,
      watchedDuration: courseProgress.watchedDuration,
      progressPercentage: courseProgress.progressPercentage,
      modulesCompleted: courseProgress.modulesCompleted,
      totalModules: courseProgress.totalModules
    }
  } as Course : null
}

/**
 * Busca um curso específico por ID
 */
export async function getCourseById(courseId: string): Promise<Course | null> {
  const supabase = createClient()

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      cover_image,
      level,
      status,
      rating_average,
      created_at,
      updated_at,
      category_id,
      category:categories!category_id(
        id,
        name,
        slug,
        color,
        variant
      )
    `)
    .eq('id', courseId)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Erro ao buscar curso:', error)
    return null
  }

  // Mapear os dados para o formato correto
  return course ? {
    id: course.id,
    title: course.title,
    description: course.description,
    cover_image: course.cover_image,
    level: course.level,
    status: course.status,
    rating_average: course.rating_average,
    created_at: course.created_at,
    updated_at: course.updated_at,
    categories: Array.isArray(course.category) ? course.category[0] || null : course.category || null
  } as Course : null
}

/**
 * Busca progresso consolidado por categoria para um usuário específico
 */
export async function getCategoryProgress(
  userId: string,
  limit: number = 10
): Promise<CategoryProgress[]> {
  const supabase = createClient()

  // Buscar todas as categorias com cursos e vídeos
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      color,
      courses!inner(
        id,
        modules!inner(
          id,
          videos(
            id,
            duration,
            progress_videos!inner(
              user_id,
              status,
              progress_seconds,
              completed_at
            )
          )
        )
      )
    `)
    .order('name')

  if (categoriesError) {
    console.error('Erro ao buscar categorias:', categoriesError)
    return []
  }

  // Processar dados para consolidar progresso por categoria
  const categoryProgress: CategoryProgress[] = []

  for (const category of categoriesData || []) {
    let videosCount = 0
    let totalDuration = 0
    let completedVideos = 0
    let inProgressVideos = 0

    // Calcular métricas para cada categoria
    for (const course of category.courses || []) {
      for (const courseModule of course.modules || []) {
        for (const video of courseModule.videos || []) {
          videosCount++
          totalDuration += video.duration || 0

          // Verificar progresso do usuário neste vídeo
          const userProgress = video.progress_videos?.find((p: VideoProgress) => p.user_id === userId)
          
          if (userProgress) {
            if (userProgress.status === 'completed') {
              completedVideos++
            } else if (userProgress.status === 'in_progress') {
              inProgressVideos++
            }
          }
        }
      }
    }

    // Determinar ação do usuário
    let userAction: 'Começar' | 'Continuar' | 'Revisar'
    let status: 'nao-iniciado' | 'em-andamento' | 'concluido'
    
    if (completedVideos === 0 && inProgressVideos === 0) {
      userAction = 'Começar'
      status = 'nao-iniciado'
    } else if (completedVideos === videosCount) {
      userAction = 'Revisar'
      status = 'concluido'
    } else {
      userAction = 'Continuar'
      status = 'em-andamento'
    }

    // Calcular porcentagem de conclusão
    const completionPercentage = videosCount > 0 ? Math.round((completedVideos / videosCount) * 100) : 0

    categoryProgress.push({
      category_id: category.id,
      category_name: category.name,
      category_slug: category.slug,
      category_color: category.color,
      videos_count: videosCount,
      total_duration: totalDuration,
      user_action: userAction,
      progress_count: completedVideos + inProgressVideos,
      completion_percentage: completionPercentage,
      status
    })
  }

  // Ordenar por porcentagem de conclusão (maior primeiro) e limitar resultados
  return categoryProgress
    .sort((a, b) => b.completion_percentage - a.completion_percentage)
    .slice(0, limit)
}

// ✅ Função utilitária para calcular status do módulo
export function calculateModuleStatus(
  videos: Array<{
    progress_videos: Array<{
      user_id: string
      status: string
      progress_seconds: number
      completed_at: string | null
    }>
  }>,
  userId: string
): ModuleStatus {
  if (!videos || videos.length === 0) {
    return 'not_started'
  }

  // Contar vídeos com progresso do usuário
  let videosWithProgress = 0
  let videosCompleted = 0

  videos.forEach(video => {
    const userProgress = video.progress_videos?.find(p => p.user_id === userId)
    
    if (userProgress) {
      videosWithProgress++
      if (userProgress.status === 'completed') {
        videosCompleted++
      }
    }
  })

  // Aplicar regras de status
  if (videosWithProgress === 0) {
    // Nenhum vídeo do módulo existe na tabela progress_videos
    return 'not_started'
  } else if (videosCompleted === videos.length) {
    // Todos os vídeos do módulo existem em progress_videos e têm status "completed"
    return 'completed'
  } else {
    // Pelo menos um vídeo do módulo está em progress_videos, mas nem todos estão "completed"
    return 'in_progress'
  }
}

// ✅ Função para calcular status de todos os módulos de um curso
export function calculateCourseModulesStatus(
  modules: Array<{
    id: string
    title: string
    description: string | null
    order: number | null
    created_at: string
    updated_at: string
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
  }>,
  userId: string
): Array<ModuleWithStatus> {
  if (!modules) return []

  return modules.map(module => ({
    id: module.id,
    title: module.title,
    description: module.description,
    order: module.order,
    created_at: module.created_at,
    updated_at: module.updated_at,
    // ✅ Status calculado dinamicamente baseado na tabela progress_videos
    status: calculateModuleStatus(module.videos || [], userId),
    videos: module.videos || []
  }))
}

// ✅ Função para calcular progresso real baseado no tempo assistido
export function calculateModuleProgress(
  videos: Array<{
    duration: number
    progress_videos: Array<{
      user_id: string
      status: string
      progress_seconds: number
      completed_at: string | null
    }>
  }>,
  userId: string
): {
  totalDuration: number
  watchedDuration: number
  progressPercentage: number
  videosCompleted: number
  totalVideos: number
} {
  if (!videos || videos.length === 0) {
    return {
      totalDuration: 0,
      watchedDuration: 0,
      progressPercentage: 0,
      videosCompleted: 0,
      totalVideos: 0
    }
  }

  let totalDuration = 0
  let watchedDuration = 0
  let videosCompleted = 0
  const totalVideos = videos.length

  videos.forEach(video => {
    totalDuration += video.duration || 0
    
    const userProgress = video.progress_videos?.find(p => p.user_id === userId)
    
    if (userProgress) {
      if (userProgress.status === 'completed') {
        // Se o vídeo foi completado, contar toda a duração
        watchedDuration += video.duration || 0
        videosCompleted++
      } else if (userProgress.progress_seconds > 0) {
        // Se o vídeo está em progresso, contar o tempo assistido
        // Mas limitar ao tempo total do vídeo
        const progressTime = Math.min(userProgress.progress_seconds, video.duration || 0)
        watchedDuration += progressTime
      }
    }
  })

  // Calcular porcentagem de progresso
  const progressPercentage = totalDuration > 0 
    ? Math.round((watchedDuration / totalDuration) * 100)
    : 0

  // ✅ CORREÇÃO: Se há tempo assistido mas percentual é 0, definir como pelo menos 1%
  const finalProgressPercentage = watchedDuration > 0 && progressPercentage === 0 
    ? 1 
    : progressPercentage

  return {
    totalDuration,
    watchedDuration,
    progressPercentage: finalProgressPercentage,
    videosCompleted,
    totalVideos
  }
}

// ✅ Função para calcular progresso de todos os módulos de um curso
export function calculateCourseProgress(
  modules: Array<{
    id: string
    title: string
    description: string | null
    order: number | null
    created_at: string
    updated_at: string
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
  }>,
  userId: string
): {
  totalDuration: number
  watchedDuration: number
  progressPercentage: number
  modulesCompleted: number
  totalModules: number
  videosCompleted: number
  totalVideos: number
} {
  if (!modules || modules.length === 0) {
    return {
      totalDuration: 0,
      watchedDuration: 0,
      progressPercentage: 0,
      modulesCompleted: 0,
      totalModules: 0,
      videosCompleted: 0,
      totalVideos: 0
    }
  }

  let totalDuration = 0
  let watchedDuration = 0
  let modulesCompleted = 0
  let videosCompleted = 0
  let totalVideos = 0

  modules.forEach(module => {
    const moduleProgress = calculateModuleProgress(module.videos || [], userId)
    
    totalDuration += moduleProgress.totalDuration
    watchedDuration += moduleProgress.watchedDuration
    videosCompleted += moduleProgress.videosCompleted
    totalVideos += moduleProgress.totalVideos
    
    // Um módulo é considerado completo se todos os vídeos foram completados
    if (moduleProgress.videosCompleted === moduleProgress.totalVideos && moduleProgress.totalVideos > 0) {
      modulesCompleted++
    }
  })

  // Calcular porcentagem de progresso geral do curso
  const progressPercentage = totalDuration > 0 
    ? Math.round((watchedDuration / totalDuration) * 100)
    : 0

  // ✅ CORREÇÃO: Se há tempo assistido mas percentual é 0, definir como pelo menos 1%
  const finalProgressPercentage = watchedDuration > 0 && progressPercentage === 0 
    ? 1 
    : progressPercentage

  return {
    totalDuration,
    watchedDuration,
    progressPercentage: finalProgressPercentage,
    modulesCompleted,
    totalModules: modules.length,
    videosCompleted,
    totalVideos
  }
}
