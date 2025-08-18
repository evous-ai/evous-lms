import { requireAuth, getAuthenticatedUser } from '@/lib/auth'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  await requireAuth()
  const { user, profile } = await getAuthenticatedUser()
  
  return <DashboardClient user={user} profile={profile} />
}
