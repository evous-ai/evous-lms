import { requireAuth, getAuthenticatedUser } from '@/lib/auth-server'
import { getCoursesData } from '@/lib/hooks-server'
import { convertCourseToTreinamento } from '@/lib/utils'
import MeusTreinamentosClient from './meus-treinamentos-client'

export default async function MeusTreinamentosPage() {
  await requireAuth()
  const { user, profile } = await getAuthenticatedUser()
  
  // ✅ Buscar todos os cursos para meus-treinamentos (sem limite)
  const coursesData = await getCoursesData(user.id)
  
  // ✅ Converter dados do Supabase para formato Treinamento
  const treinamentos = coursesData.cursos.map(convertCourseToTreinamento)
  
  return <MeusTreinamentosClient user={user} profile={profile} treinamentos={treinamentos} />
} 