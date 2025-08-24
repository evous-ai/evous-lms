"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LMSSidebar } from '@/components/lms-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { CourseModulesList } from '@/components/course/CourseModulesList'
import { truncateText } from '@/lib/utils'
import { Home, Clock, Play } from 'lucide-react'
import Link from 'next/link'

// Interface para os dados do curso
interface Aula {
  id: string;
  titulo: string;
  duracao: string;
  status: 'concluida' | 'disponivel' | 'bloqueada' | 'nao_iniciada';
  video_url?: string | null;
  description?: string | null;
}

interface Modulo {
  id: string;
  titulo: string;
  resumo: string;
  aulas: Aula[];
}

interface Course {
  id: string;
  titulo: string;
  descricao: string;
  totalVideos: number;
  concluidos: number;
  percent: number;
  duracaoTotal: string;
  categoria: string;
  modulos: Modulo[];
}

interface CourseDetailsClientProps {
  user: {
    id: string
    email?: string
  }
  profile: {
    full_name?: string | null
    country?: string | null
  } | null
  course: Course
  courseId: string
}

export default function CourseDetailsClient({ user, profile, course, courseId }: CourseDetailsClientProps) {
  // Estado para controlar quais módulos estão expandidos
  const [accordionValue, setAccordionValue] = useState<string[]>(() => {
    // Inicializar todos os módulos como expandidos
    return course.modulos.map(modulo => modulo.id)
  })

  const fecharTodosModulos = () => {
    setAccordionValue([])
  }

  const expandirTodosModulos = () => {
    setAccordionValue(course.modulos.map(modulo => modulo.id))
  }

  const getFirstAvailableLesson = () => {
    // Lógica para obter a primeira aula disponível
    return `/trilha/${courseId}/${course.modulos[0]?.aulas[0]?.id || 'aula-1'}`
  }

  return (
    <SidebarProvider>
      <LMSSidebar user={user} profile={profile} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-slate-50 dark:bg-gray-950">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">{course.titulo}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero da trilha */}
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 border-0 p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-background/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                    {course.categoria}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <Clock className="h-4 w-4" />
                    {course.duracaoTotal}
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-foreground leading-tight">{course.titulo}</h1>
                <CardDescription className="text-base text-muted-foreground">
                  {truncateText(course.descricao, 150)}
                </CardDescription>
              </div>
              
              <div className="flex flex-col gap-3 min-w-fit justify-center">
                <Button 
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-base font-semibold transition-all duration-200"
                  asChild
                >
                  <Link href={getFirstAvailableLesson()} className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    {course.concluidos > 0 ? 'Continuar curso' : 'Começar curso'}
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Lista de módulos - Sem box branca */}
          <div id="modulos" className="space-y-6">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Conteúdo do curso</h2>
                <div className="flex gap-2">
                  {accordionValue.length === 0 ? (
                    <button 
                      onClick={expandirTodosModulos}
                      className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                      Abrir todos os módulos
                    </button>
                  ) : (
                    <button 
                      onClick={fecharTodosModulos}
                      className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                      Fechar todos os módulos
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <CourseModulesList
              modulos={course.modulos}
              expandedModules={accordionValue}
              courseId={courseId}
              onModuleToggle={(moduleId) => {
                if (accordionValue.includes(moduleId)) {
                  setAccordionValue(accordionValue.filter(id => id !== moduleId));
                } else {
                  setAccordionValue([...accordionValue, moduleId]);
                }
              }}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
