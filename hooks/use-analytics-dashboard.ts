import { useState, useEffect, useCallback } from 'react'

// ✅ Tipos para os dados de analytics
export interface AnalyticsOverview {
  totalUsers: number
  activeUsers: number
  totalSessions: number
  averageSessionDuration: string
  bounceRate: string
  conversionRate: string
}

export interface CourseAnalytics {
  totalViews: number
  mostViewed: Array<{
    id: string
    title: string
    views: number
    completion: string
  }>
  averageCompletion: string
  totalCompletions: number
}

export interface VideoAnalytics {
  totalViews: number
  mostWatched: Array<{
    id: string
    title: string
    views: number
    avgWatchTime: string
  }>
  averageWatchTime: string
  completionRate: string
}

export interface UserAnalytics {
  totalRegistered: number
  activeThisWeek: number
  activeThisMonth: number
  newThisWeek: number
  newThisMonth: number
  topEngaged: Array<{
    id: string
    name: string
    courses: number
    videos: number
    timeSpent: string
  }>
}

export interface EngagementAnalytics {
  totalSearches: number
  popularSearches: Array<{
    term: string
    count: number
  }>
  filterUsage: Array<{
    type: string
    value: string
    count: number
  }>
  averageTimeOnPage: string
}

export interface TrendsAnalytics {
  dailyActiveUsers: number[]
  courseCompletions: number[]
  videoViews: number[]
}

export interface AnalyticsData {
  overview: AnalyticsOverview
  courses: CourseAnalytics
  videos: VideoAnalytics
  users: UserAnalytics
  engagement: EngagementAnalytics
  trends: TrendsAnalytics
}

// ✅ Hook para buscar dados de analytics
export const useAnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ Função para buscar dados
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/analytics')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados de analytics')
      }

      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        throw new Error(result.error || 'Erro desconhecido')
      }

    } catch (err) {
      console.error('Erro ao buscar analytics:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Função para atualizar dados
  const refreshData = useCallback(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // ✅ Buscar dados ao montar o componente
  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    data,
    loading,
    error,
    refreshData,
    fetchAnalytics
  }
}
