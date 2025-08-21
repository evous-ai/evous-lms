import { requireAuth, getAuthenticatedUser } from '@/lib/auth-server'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  await requireAuth()
  const { user, profile } = await getAuthenticatedUser()
  
  return <DashboardClient user={user} profile={profile} />
}
