import { requireAuth, getAuthenticatedUser } from '@/lib/auth-server'
import { getCourseById } from '@/lib/hooks-server'
import { notFound } from 'next/navigation'
import CourseDetailsClient from './course-details-client'

interface TrilhaPageProps {
  params: Promise<{ slug: string }>
}

export default async function TrilhaPage({ params }: TrilhaPageProps) {
  await requireAuth()
  const { user, profile } = await getAuthenticatedUser()
  
  // Aguardar os params - o slug na verdade é o courseId (UUID)
  const { slug: courseId } = await params
  
  // Buscar dados do curso usando a função server-side
  const courseData = await getCourseById(courseId, user.id)
  
  // Se não encontrar o curso, mostrar 404
  if (courseData.error || !courseData.course) {
    notFound()
  }

  return (
    <CourseDetailsClient 
      user={user} 
      profile={profile} 
      course={courseData.course}
      courseId={courseId}
    />
  )
} 