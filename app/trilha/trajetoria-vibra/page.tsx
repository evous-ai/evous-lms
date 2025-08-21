import { requireAuth, getAuthenticatedUser } from '@/lib/auth-server'
import TrajetoriaVibraClient from './trajetoria-vibra-client'

export default async function TrajetoriaVibraPage() {
  await requireAuth()
  const { user, profile } = await getAuthenticatedUser()
  
  return <TrajetoriaVibraClient user={user} profile={profile} />
} 