"use client"

import Link from 'next/link';
import { LMSSidebar } from "@/components/lms-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Play, Clock, BookOpen, Target, Star } from 'lucide-react';
import { useState } from 'react';
import { CourseModulesList } from '@/components/course';

// Dados estáticos da trilha
const curso = {
  titulo: 'Trajetória Vibra',
  descricao: 'A história e evolução da Vibra no mercado brasileiro',
  totalVideos: 8,
  concluidos: 3,
  percent: 38,
  duracaoTotal: '2h30min',
  categoria: 'Estratégia Comercial',
  modulos: [
    {
      id: 'm1',
      titulo: 'Origens e Expansão',
      resumo: '5 vídeos · 1h45min',
      aulas: [
        { id: 'aula-1-origens-vibra', titulo: 'Aula 1 – Origens da Vibra no Brasil', duracao: '18:45', status: 'concluida' as const },
        { id: 'aula-2-expansao-nacional', titulo: 'Aula 2 – Expansão Nacional', duracao: '22:15', status: 'concluida' as const },
        { id: 'aula-3-governanca-cultura', titulo: 'Aula 3 – Governança e Cultura', duracao: '12:30', status: 'disponivel' as const },
        { id: 'aula-4-portfolio-inovacao', titulo: 'Aula 4 – Portfólio e Inovação', duracao: '16:10', status: 'disponivel' as const },
        { id: 'aula-5-esg', titulo: 'Aula 5 – Sustentabilidade e ESG', duracao: '15:20', status: 'disponivel' as const },
      ],
    },
    {
      id: 'm2',
      titulo: 'Atualidade e Futuro',
      resumo: '3 vídeos · 45min',
      aulas: [
        { id: 'aula-6-mercado-concorrencia', titulo: 'Aula 6 – Mercado e Concorrência', duracao: '09:50', status: 'disponivel' as const },
        { id: 'aula-7-parcerias-estrategicas', titulo: 'Aula 7 – Parcerias Estratégicas', duracao: '11:05', status: 'disponivel' as const },
        { id: 'aula-8-visao-futuro', titulo: 'Aula 8 – Visão de Futuro', duracao: '24:10', status: 'disponivel' as const },
      ],
    },
  ],
};

export default function TrajetoriaVibraPage() {
  const [accordionValue, setAccordionValue] = useState<string[]>(['m1', 'm2']);

  const fecharTodosModulos = () => {
    setAccordionValue([]);
  };

  const abrirTodosModulos = () => {
    setAccordionValue(curso.modulos.map(modulo => modulo.id));
  };

  return (
    <SidebarProvider>
      <LMSSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-slate-50 dark:bg-gray-950">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">Treinamentos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">Trajetória Vibra</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero da trilha */}
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 border-0 p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-background/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                    {curso.categoria}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <Clock className="h-4 w-4" />
                    {curso.duracaoTotal}
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-foreground leading-tight">{curso.titulo}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{curso.descricao}</p>
                
                {/* Estatísticas rápidas */}
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{curso.totalVideos} vídeos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>{curso.percent}% concluído</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span>{curso.concluidos} aulas finalizadas</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 min-w-fit justify-center">
                <Button 
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-base font-semibold transition-all duration-200"
                  asChild
                >
                  <Link href="/trilha/trajetoria-vibra/aula-3-governanca-cultura" className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Continuar curso
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
                      onClick={abrirTodosModulos}
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
              modulos={curso.modulos}
              expandedModules={accordionValue}
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