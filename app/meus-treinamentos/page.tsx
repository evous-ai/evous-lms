import { requireAuth, getAuthenticatedUser } from '@/lib/auth-server'
import MeusTreinamentosClient from './meus-treinamentos-client'

export default async function MeusTreinamentosPage() {
  await requireAuth()
  const { user, profile } = await getAuthenticatedUser()
  
  return <MeusTreinamentosClient user={user} profile={profile} />
} 