import { requireAuth, getAuthenticatedUser } from '@/lib/auth-server'
import { getCourseById } from '@/lib/hooks-server'
import { notFound } from 'next/navigation'
import VideoDetailsClient from './video-details-client'

interface VideoDetailsPageProps {
  params: Promise<{ slug: string; conteudoId: string }>
}

export default async function VideoDetailsPage({ params }: VideoDetailsPageProps) {
  await requireAuth()
  const { user, profile } = await getAuthenticatedUser()

  const { slug: courseId, conteudoId: videoId } = await params

  // Buscar dados do curso
  const courseData = await getCourseById(courseId, user.id)

  if (courseData.error || !courseData.course) {
    notFound()
  }

  // Buscar dados específicos do vídeo
  const video = courseData.course.modulos
    ?.flatMap(modulo => modulo.aulas)
    ?.find(aula => aula.id === videoId)

  if (!video) {
    notFound()
  }

  // Buscar dados do módulo para breadcrumb
  const moduleData = courseData.course.modulos?.find(modulo => 
    modulo.aulas.some(aula => aula.id === videoId)
  )

  return (
    <VideoDetailsClient
      user={user}
      profile={profile}
      course={courseData.course}
      video={video}
      module={moduleData}
      courseId={courseId}
      videoId={videoId}
    />
  )
} 