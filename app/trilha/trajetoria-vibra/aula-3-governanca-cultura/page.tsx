import { requireAuth, getAuthenticatedUser } from '@/lib/auth-server'
import Aula3GovernancaCulturaClient from './aula-3-governanca-cultura-client'

export default async function Aula3GovernancaCulturaPage() {
  await requireAuth()
  const { user, profile } = await getAuthenticatedUser()
  
  return <Aula3GovernancaCulturaClient user={user} profile={profile} />
} 