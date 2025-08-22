import { NextRequest, NextResponse } from 'next/server'
import { getLatestCourses, getCoursesByCategory, getCoursesWithProgress } from '@/lib/courses-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '6')
    const categorySlug = searchParams.get('category')
    const userId = searchParams.get('userId')

    let courses

    switch (type) {
      case 'latest':
        courses = await getLatestCourses(limit)
        break
      case 'category':
        if (!categorySlug) {
          return NextResponse.json(
            { error: 'Category slug is required' },
            { status: 400 }
          )
        }
        courses = await getCoursesByCategory(categorySlug, limit)
        break
      case 'progress':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }
        courses = await getCoursesWithProgress(userId, limit)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid type parameter. Use: latest, category, or progress' },
          { status: 400 }
        )
    }

    // Adicionar userId aos cursos se fornecido
    const coursesWithUserId = courses.map(course => ({
      ...course,
      _userId: userId // Campo interno para usar no frontend
    }))

    return NextResponse.json({ courses: coursesWithUserId })
  } catch (error) {
    console.error('Erro na API de cursos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
