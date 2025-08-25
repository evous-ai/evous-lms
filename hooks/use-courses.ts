import { useState, useEffect } from 'react'
import { Course } from '@/lib/courses-server'

export function useLatestCourses(limit: number = 6, userId?: string) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
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
    }

    fetchCourses()
  }, [limit, userId])

  return { courses, loading, error }
}

export function useCoursesByCategory(categorySlug: string, limit: number = 6) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!categorySlug) {
      setCourses([])
      return
    }

    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/courses?type=category&category=${categorySlug}&limit=${limit}`)
        
        if (!response.ok) {
          throw new Error('Erro ao buscar cursos da categoria')
        }
        
        const data = await response.json()
        setCourses(data.courses || [])
      } catch (err) {
        console.error('Erro ao buscar cursos por categoria:', err)
        setError('Erro ao carregar cursos da categoria')
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [categorySlug, limit])

  return { courses, loading, error }
}

export function useCoursesWithProgress(userId: string, limit: number = 6) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setCourses([])
      return
    }

    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/courses?type=progress&userId=${userId}&limit=${limit}`)
        
        if (!response.ok) {
          throw new Error('Erro ao buscar cursos com progresso')
        }
        
        const data = await response.json()
        setCourses(data.courses || [])
      } catch (err) {
        console.error('Erro ao buscar cursos com progresso:', err)
        setError('Erro ao carregar cursos com progresso')
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [userId, limit])

  return { courses, loading, error }
}
