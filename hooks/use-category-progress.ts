import { useState, useEffect } from 'react'
import { CategoryProgress } from '@/lib/courses-server'

export function useCategoryProgress(userId: string, limit: number = 10) {
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setCategoryProgress([])
      return
    }

    const fetchCategoryProgress = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/categories/progress?userId=${userId}&limit=${limit}`)
        
        if (!response.ok) {
          throw new Error('Erro ao buscar progresso por categoria')
        }
        
        const data = await response.json()
        setCategoryProgress(data.categoryProgress || [])
      } catch (err) {
        console.error('Erro ao buscar progresso por categoria:', err)
        setError('Erro ao carregar progresso por categoria')
        setCategoryProgress([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryProgress()
  }, [userId, limit])

  return { categoryProgress, loading, error }
}
