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
  }
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
 * Busca os últimos N cursos publicados
 */
export async function getLatestCourses(limit: number = 6): Promise<Course[]> {
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
      modules(
        id,
        videos(
          id,
          duration,
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
    console.error('Erro ao buscar cursos:', error)
    return []
  }

  // Mapear os dados para o formato correto
  return (courses || []).map(course => {
    // Calcular progresso real do curso
    let totalVideos = 0
    let videosConcluidos = 0

    course.modules?.forEach(module => {
      module.videos?.forEach(video => {
        totalVideos++
        if (video.progress_videos && video.progress_videos.length > 0) {
          const hasCompleted = video.progress_videos.some((p: { status: string }) => p.status === 'completed')
          if (hasCompleted) videosConcluidos++
        }
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
        videosConcluidos
      }
    } as Course
  })
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
export async function getCourseWithModules(courseId: string): Promise<Course | null> {
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
    modules: course.modules || []
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
