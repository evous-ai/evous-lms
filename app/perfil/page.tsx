import { requireAuth, getAuthenticatedUser } from '@/lib/auth'
import { LMSSidebar } from "@/components/lms-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Home } from "lucide-react"
import { PerfilForm } from './perfil-form'

export default async function PerfilPage() {
  // Verifica se o usuário está autenticado
  await requireAuth()
  
  const { user, profile } = await getAuthenticatedUser()

  return (
    <SidebarProvider>
      <LMSSidebar user={user} profile={profile} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50 dark:bg-background">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                Meu Perfil
              </h1>
              <p className="text-muted-foreground text-base md:text-lg">
                Gerencie suas informações pessoais e configurações
              </p>
            </div>
          </div>

          {/* Formulário de Perfil */}
          <PerfilForm user={user} profile={profile} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 