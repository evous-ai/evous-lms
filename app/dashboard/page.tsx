import { requireAuth, getAuthenticatedUser } from '@/lib/auth-server'
import { getDashboardData } from '@/lib/hooks-server'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  await requireAuth()
  const { user, profile } = await getAuthenticatedUser()
  
  // Buscar dados server-side
  const dashboardData = await getDashboardData(
    user.id, 
    profile?.company_id || ''
  )
  
  return (
    <DashboardClient 
      user={user} 
      profile={profile} 
      initialData={dashboardData}
    />
  )
}
