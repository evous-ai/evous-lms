"use client"

import { LMSSidebar } from "@/components/lms-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

import Link from "next/link"
import Image from "next/image"
import { PoweredByEvous } from "@/components/powered-by-evous"
import { useState, useMemo } from "react"
import { useCompanyColor, useCompanyLogo } from "@/components/providers/company-provider"
import { Category } from "@/lib/categories"
import { Course } from "@/lib/courses-server"

import { useDashboardFilters } from "@/hooks/use-dashboard-filters"
import { DashboardFilters } from "@/components/dashboard/DashboardFilters"
import { FilterResults } from "@/components/dashboard/FilterResults"
import { NoResultsMessage } from "@/components/dashboard/NoResultsMessage"
import { CoursesGrid } from "@/components/dashboard/CoursesGrid"
import { convertCourseToTreinamento } from "@/lib/utils"

interface DashboardClientProps {
  user: {
    id: string
    email?: string
  }
  profile: {
    full_name?: string | null
    country?: string | null
    company_id?: string | null
  } | null
  initialData: {
    categorias: Category[]
    cursos: Course[]
    progressoCategorias: Array<{
      category_id: string
      category_name: string
      category_slug: string | null
      category_color: string | null
      videos_count: number
      total_duration: number
      user_action: string
      progress_count: number
      completion_percentage: number
      status: string
    }>
    error: string | null
  }
}

export default function DashboardClient({ user, profile, initialData }: DashboardClientProps) {
  // Usar dados iniciais do server-side
  const [categorias] = useState<Category[]>(initialData.categorias)
  const [treinamentos] = useState<Course[]>(initialData.cursos)
  
  // Converter cursos para o formato esperado pelo hook
  const treinamentosConvertidos = useMemo(() => 
    treinamentos.map(convertCourseToTreinamento), 
    [treinamentos]
  )
  
  // Hook para filtros (agora usa dados já carregados)
  const {
    filters,
    treinamentosFiltrados,
    statusOptions,
    temFiltrosAtivos,
    limparFiltros,
    atualizarFiltro
  } = useDashboardFilters(treinamentosConvertidos)

  // Hooks para dados da empresa
  const primaryColor = useCompanyColor()
  const { darkLogo } = useCompanyLogo()

  // Preparar opções de categorias para o filtro
  const opcoesCategorias = useMemo(() => {
    const categoriasBase = ["Todas as Categorias"]
    if (categorias.length > 0) {
      categorias.forEach(cat => categoriasBase.push(cat.name))
    }
    return categoriasBase
  }, [categorias])

  // Se houver erro nos dados, mostrar mensagem
  if (initialData.error) {
    return (
      <SidebarProvider>
        <LMSSidebar user={user} profile={profile} />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50 dark:bg-background">
            <Card className="text-white border-0 shadow-none bg-red-600">
              <CardContent className="p-8">
                <h1 className="text-xl font-bold">Erro ao carregar dados</h1>
                <p className="text-red-100">{initialData.error}</p>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <LMSSidebar user={user} profile={profile} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50 dark:bg-background">
          {/* WelcomeHero - Banner pessoal */}
          <Card className="text-white border-0 shadow-none" style={{ backgroundColor: primaryColor }}>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
                <div className="space-y-3 flex-1">
                  <h1 className="text-3xl font-bold">
                    Olá, {profile?.full_name || user?.email || 'Usuário'}! 👋
                  </h1>
                  <p className="text-green-100 text-lg max-w-xl">
                    Bem-vindo à sua área de aprendizagem. Continue de onde parou e mantenha o ritmo!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" className="bg-white text-[#144722] hover:bg-green-50" asChild>
                      <Link href="/trilha/trajetoria-vibra">
                        <Play className="h-4 w-4 mr-2" />
                        Continuar treinamento
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Image 
                    src={darkLogo} 
                    alt="Logo da Empresa" 
                    width={160}
                    height={40}
                    className="h-10 w-auto object-contain"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção: Cursos Disponíveis */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-foreground">Cursos Disponíveis</h2>
              
              {/* Filtros */}
              <DashboardFilters
                filters={filters}
                onFilterChange={atualizarFiltro}
                onClearFilters={limparFiltros}
                statusOptions={statusOptions}
                categoriaOptions={opcoesCategorias}
                loadingCategorias={false} // Não precisa mais carregar
                temFiltrosAtivos={temFiltrosAtivos}
              />
            </div>

            {/* Resultados da busca */}
            <FilterResults
              filteredCount={treinamentosFiltrados.length}
              totalCount={treinamentos.length}
              hasActiveFilters={temFiltrosAtivos}
            />

            {/* Conteúdo principal */}
            {treinamentos.length > 0 ? (
              <CoursesGrid treinamentos={treinamentosFiltrados} />
            ) : (
              <NoResultsMessage
                hasCourses={false}
                onClearFilters={limparFiltros}
              />
            )}
          </section>

          {/* Footer com Powered by Evous */}
          <div className="mt-auto pt-8 pb-4 text-center">
            <PoweredByEvous size="sm" />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
