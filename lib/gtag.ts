// Google Analytics Configuration
export const GA_TRACKING_ID = 'G-4R2NGMMBW3'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Eventos específicos para LMS
export const trackCourseView = (courseId: string, courseTitle: string) => {
  event({
    action: 'view_course',
    category: 'course',
    label: courseTitle,
  })
}

export const trackVideoView = (videoId: string, videoTitle: string, courseId: string) => {
  event({
    action: 'view_video',
    category: 'video',
    label: `${courseId}:${videoTitle}`,
  })
}

export const trackVideoProgress = (videoId: string, progressSeconds: number, courseId: string) => {
  event({
    action: 'video_progress',
    category: 'video',
    label: courseId,
    value: progressSeconds,
  })
}

export const trackVideoCompletion = (videoId: string, courseId: string, totalDuration: number) => {
  event({
    action: 'video_completion',
    category: 'video',
    label: courseId,
    value: totalDuration,
  })
}

export const trackCourseCompletion = (courseId: string, courseTitle: string) => {
  event({
    action: 'course_completion',
    category: 'course',
    label: courseTitle,
  })
}

export const trackUserLogin = (userId: string) => {
  event({
    action: 'user_login',
    category: 'user',
    label: userId,
  })
}

export const trackUserSignup = (userId: string) => {
  event({
    action: 'user_signup',
    category: 'user',
    label: userId,
  })
}

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultsCount,
  })
}

export const trackFilter = (filterType: string, filterValue: string) => {
  event({
    action: 'filter',
    category: 'engagement',
    label: `${filterType}:${filterValue}`,
  })
}

// Tipos para TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, string | number | boolean | undefined>
    ) => void
    dataLayer: Array<Record<string, string | number | boolean | undefined>>
  }
}
