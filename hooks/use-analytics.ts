import { useCallback } from 'react'
import {
  event,
  trackCourseView,
  trackVideoView,
  trackVideoProgress,
  trackVideoCompletion,
  trackCourseCompletion,
  trackUserLogin,
  trackUserSignup,
  trackSearch,
  trackFilter,
} from '@/lib/gtag'

export const useAnalytics = () => {
  // Evento customizado genérico
  const trackEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    event({ action, category, label, value })
  }, [])

  // Eventos específicos para LMS
  const trackCourse = useCallback((courseId: string, courseTitle: string) => {
    trackCourseView(courseId, courseTitle)
  }, [])

  const trackVideo = useCallback((videoId: string, videoTitle: string, courseId: string) => {
    trackVideoView(videoId, videoTitle, courseId)
  }, [])

  const trackProgress = useCallback((videoId: string, progressSeconds: number, courseId: string) => {
    trackVideoProgress(videoId, progressSeconds, courseId)
  }, [])

  const trackVideoComplete = useCallback((videoId: string, courseId: string, totalDuration: number) => {
    trackVideoCompletion(videoId, courseId, totalDuration)
  }, [])

  const trackCourseComplete = useCallback((courseId: string, courseTitle: string) => {
    trackCourseCompletion(courseId, courseTitle)
  }, [])

  const trackLogin = useCallback((userId: string) => {
    trackUserLogin(userId)
  }, [])

  const trackSignup = useCallback((userId: string) => {
    trackUserSignup(userId)
  }, [])

  const trackSearchQuery = useCallback((searchTerm: string, resultsCount: number) => {
    trackSearch(searchTerm, resultsCount)
  }, [])

  const trackFilterUsage = useCallback((filterType: string, filterValue: string) => {
    trackFilter(filterType, filterValue)
  }, [])

  return {
    // Evento genérico
    trackEvent,
    
    // Eventos específicos para LMS
    trackCourse,
    trackVideo,
    trackProgress,
    trackVideoComplete,
    trackCourseComplete,
    
    // Eventos de usuário
    trackLogin,
    trackSignup,
    
    // Eventos de engajamento
    trackSearchQuery,
    trackFilterUsage,
  }
}
