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
import { useState, useEffect, useMemo } from "react"
import { useCompanyColor, useCompanyLogo } from "@/components/providers/company-provider"
import { getCategoriesByCompanyClient, Category } from "@/lib/categories"
import { useOptimizedCourses } from "@/hooks/use-optimized-courses"

import { useDashboardFilters } from "@/hooks/use-dashboard-filters"
import { DashboardFilters } from "@/components/dashboard/DashboardFilters"
import { FilterResults } from "@/components/dashboard/FilterResults"
import { NoResultsMessage } from "@/components/dashboard/NoResultsMessage"
import { CoursesGrid } from "@/components/dashboard/CoursesGrid"
import { CoursesSkeleton } from "@/components/dashboard/CoursesSkeleton"

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
}

export default function DashboardClient({ user, profile }: DashboardClientProps) {
  const [categorias, setCategorias] = useState<Category[]>([])
  const [loadingCategorias, setLoadingCategorias] = useState(true)
  
  // Hook otimizado para cursos
  const { treinamentos, loading: loadingCursos } = useOptimizedCourses(6, user?.id)
  


  // Hook para filtros
  const {
    filters,
    treinamentosFiltrados,
    statusOptions,
    temFiltrosAtivos,
    limparFiltros,
    atualizarFiltro
  } = useDashboardFilters(treinamentos)



  // Hooks para dados da empresa
  const primaryColor = useCompanyColor()
  const { darkLogo } = useCompanyLogo()

  // Buscar categorias do banco de dados
  useEffect(() => {
    const fetchCategorias = async () => {
      if (!profile?.company_id) {
        console.log('Company ID não encontrado no perfil:', profile)
        setLoadingCategorias(false)
        return
      }

      try {
        console.log('Buscando categorias para company_id:', profile.company_id)
        setLoadingCategorias(true)
        const result = await getCategoriesByCompanyClient(profile.company_id)
        
        if (result.success && result.categories) {
          console.log('Categorias carregadas com sucesso:', result.categories.length)
          setCategorias(result.categories)
        } else {
          console.warn('Erro ao buscar categorias:', result.error)
          setCategorias([])
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
        setCategorias([])
      } finally {
        setLoadingCategorias(false)
      }
    }

    fetchCategorias()
  }, [profile?.company_id, profile])

  // Preparar opções de categorias para o filtro
  const opcoesCategorias = useMemo(() => {
    const categoriasBase = ["Todas as Categorias"]
    if (categorias.length > 0) {
      categorias.forEach(cat => categoriasBase.push(cat.name))
    }
    return categoriasBase
  }, [categorias])

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
                loadingCategorias={loadingCategorias}
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
            {loadingCursos ? (
              <CoursesSkeleton count={6} />
            ) : treinamentosFiltrados.length > 0 ? (
              <CoursesGrid treinamentos={treinamentosFiltrados} />
            ) : (
              <NoResultsMessage
                hasCourses={treinamentos.length > 0}
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
