"use client"

import Link from 'next/link';
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Play, Clock, BookOpen, Target, Star, ChevronRight, Video } from 'lucide-react';
import { useState } from 'react';

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
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-slate-50">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Treinamentos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Trajetória Vibra</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero da trilha */}
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-0 p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-white/80 text-emerald-700 border-emerald-200">
                    {curso.categoria}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <Clock className="h-4 w-4" />
                    {curso.duracaoTotal}
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">{curso.titulo}</h1>
                <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">{curso.descricao}</p>
                
                {/* Estatísticas rápidas */}
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    <span>{curso.totalVideos} vídeos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span>{curso.percent}% concluído</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>{curso.concluidos} aulas finalizadas</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 min-w-fit">
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
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  asChild
                >
                  <Link href="#modulos" className="flex items-center gap-2">
                    Ver todos os módulos
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Lista de módulos - Sem box branca */}
          <div id="modulos" className="space-y-6">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Conteúdo do curso</h2>
                <div className="flex gap-2">
                  {accordionValue.length === 0 ? (
                    <button 
                      onClick={abrirTodosModulos}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Abrir todos os módulos
                    </button>
                  ) : (
                    <button 
                      onClick={fecharTodosModulos}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Fechar todos os módulos
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <Accordion 
              type="multiple" 
              value={accordionValue} 
              onValueChange={setAccordionValue}
              className="space-y-4"
            >
              {curso.modulos.map((modulo) => (
                <AccordionItem 
                  key={modulo.id} 
                  value={modulo.id}
                  className="bg-white border border-gray-200 rounded-lg data-[state=open]:border-slate-300"
                >
                  <AccordionTrigger className="p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg data-[state=open]:rounded-t-lg data-[state=closed]:rounded-lg transition-colors">
                    <div className="flex justify-between items-center w-full pr-4">
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">{modulo.titulo}</h3>
                        <p className="text-sm text-gray-600">{modulo.resumo}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="p-4 space-y-3">
                    {modulo.aulas.map((aula) => (
                      <div 
                        key={aula.id} 
                        className="flex items-center justify-between py-3 px-3 hover:bg-slate-50 hover:border-l-4 hover:border-l-emerald-200 rounded-lg transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {/* Status da aula */}
                          {aula.status === 'concluida' && (
                            <div className="w-4 h-4 bg-emerald-500 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform"></div>
                          )}
                          {aula.status === 'disponivel' && (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0 group-hover:border-emerald-300 group-hover:scale-110 transition-all"></div>
                          )}
                          
                          {/* Ícone de vídeo */}
                          <Video className="h-4 w-4 text-gray-400 flex-shrink-0 group-hover:text-emerald-500 transition-colors" />
                          
                          {/* Título da aula */}
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            {aula.titulo}
                          </span>
                        </div>
                        
                        {/* Duração */}
                        <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                          {aula.duracao}
                        </span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 