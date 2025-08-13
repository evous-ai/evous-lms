"use client"

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PanelRightOpen, ChevronDown, ChevronUp, Play, CheckCircle, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Mock do curso (usando a mesma estrutura da página principal)
const cursoMock = {
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
        { id: 'aula-1-origens-vibra', titulo: 'Aula 1 – Origens da Vibra no Brasil', duracao: '18:45', status: 'concluida' as const, href: '/trilha/trajetoria-vibra/aula-1-origens-vibra' },
        { id: 'aula-2-expansao-nacional', titulo: 'Aula 2 – Expansão Nacional', duracao: '22:15', status: 'concluida' as const, href: '/trilha/trajetoria-vibra/aula-2-expansao-nacional' },
        { id: 'aula-3-governanca-cultura', titulo: 'Aula 3 – Governança e Cultura', duracao: '12:30', status: 'em_andamento' as const, href: '/trilha/trajetoria-vibra/aula-3-governanca-cultura' },
        { id: 'aula-4-portfolio-inovacao', titulo: 'Aula 4 – Portfólio e Inovação', duracao: '16:10', status: 'nao_iniciada' as const, href: '/trilha/trajetoria-vibra/aula-4-portfolio-inovacao' },
        { id: 'aula-5-esg', titulo: 'Aula 5 – Sustentabilidade e ESG', duracao: '15:20', status: 'nao_iniciada' as const, href: '/trilha/trajetoria-vibra/aula-5-esg' },
      ],
    },
    {
      id: 'm2',
      titulo: 'Atualidade e Futuro',
      resumo: '3 vídeos · 45min',
      aulas: [
        { id: 'aula-6-mercado-concorrencia', titulo: 'Aula 6 – Mercado e Concorrência', duracao: '09:50', status: 'nao_iniciada' as const, href: '/trilha/trajetoria-vibra/aula-6-mercado-concorrencia' },
        { id: 'aula-7-parcerias-estrategicas', titulo: 'Aula 7 – Parcerias Estratégicas', duracao: '11:05', status: 'nao_iniciada' as const, href: '/trilha/trajetoria-vibra/aula-7-parcerias-estrategicas' },
        { id: 'aula-8-visao-futuro', titulo: 'Aula 8 – Visão de Futuro', duracao: '24:10', status: 'nao_iniciada' as const, href: '/trilha/trajetoria-vibra/aula-8-visao-futuro' },
      ],
    },
  ],
};

interface ProgressSidebarProps {
  aulaAtualId?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ProgressSidebar({ aulaAtualId = 'aula-3-governanca-cultura', isOpen = false, onToggle }: ProgressSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1']); // Módulo 1 expandido por padrão
  


  // Toggle módulo expandido/colapsado
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (!isOpen) {
    // Modo comprimido: apenas borda esquerda e toggle
    return (
      <aside className="sticky top-0 h-screen border-l bg-transparent">
        {/* Toggle para expandir o sidebar */}
        <div className="absolute -left-4 top-6 z-10">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full hover:scale-110 transition-transform"
            onClick={onToggle}
            aria-label="Mostrar progresso"
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sticky top-0 h-screen border-l relative bg-white dark:bg-gray-950">
      {/* Gradiente sutil na lateral direita - inspirado na referência */}
      <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-purple-200/50 to-purple-100/30 dark:from-purple-600/40 dark:to-purple-800/30" />
      
      {/* Header com título e menu de opções */}
      <div className="px-6 pt-6 pb-4 border-b border-border/50 bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">Course Content</h3>
          <div className="flex items-center gap-2">
            {onToggle && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 rounded-full"
                onClick={onToggle}
                aria-label="Ocultar progresso"
              >
                <PanelRightOpen className="h-3 w-3 rotate-180" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 rounded-full"
              aria-label="Opções"
            >
              <MoreVertical className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de módulos - Design "encaixotado" com cards */}
      <div className="px-6 py-4 bg-white dark:bg-gray-950">
        <div className="space-y-4">
          {cursoMock.modulos.map((m, index) => {
            const done = m.aulas.filter(a => a.status === 'concluida').length;
            const isExpanded = expandedModules.includes(m.id);
            const totalDuration = m.aulas.reduce((acc, a) => {
              const [min, sec] = a.duracao.split(':').map(Number);
              return acc + (min * 60 + sec);
            }, 0);
            const durationText = `${Math.floor(totalDuration / 60)}min Total`;
            
            return (
              <div key={m.id} className="space-y-0">
                {/* Card do módulo */}
                <div className="bg-white dark:bg-gray-900 border border-border/60 dark:border-border/40 rounded-lg shadow-sm dark:shadow-none hover:shadow-md dark:hover:bg-gray-800 transition-all duration-200 overflow-hidden">
                  {/* Header do módulo - clicável para expandir/colapsar */}
                  <button
                    onClick={() => toggleModule(m.id)}
                    className="w-full flex items-center justify-between py-4 px-4 bg-muted/30 dark:bg-gray-800/60 hover:bg-muted/50 dark:hover:bg-gray-800/80 transition-colors text-left border-b border-border/40 dark:border-gray-700/60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm text-foreground">{m.titulo}</span>
                      <Badge variant="secondary" className="text-xs bg-background/80 dark:bg-gray-700/80 dark:text-gray-200">
                        {done}/{m.aulas.length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-medium">{durationText}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  
                  {/* Lista de aulas do módulo - visível apenas quando expandido */}
                  {isExpanded && (
                    <div className="p-2 space-y-1">
                      {m.aulas.map((a) => (
                        <div
                          key={a.id}
                          className={cn(
                            "flex items-center justify-between py-2.5 px-3 rounded-md transition-colors text-sm",
                            aulaAtualId === a.id 
                              ? "bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700/60" 
                              : "hover:bg-muted/40 dark:hover:bg-gray-800/60"
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Status visual da aula */}
                            <div className="flex-shrink-0">
                              {a.status === 'concluida' && (
                                <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                              )}
                              {a.status === 'em_andamento' && (
                                <div className="w-4 h-4 bg-purple-100 dark:bg-purple-800/60 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full" />
                                </div>
                              )}
                              {a.status === 'nao_iniciada' && (
                                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded-full" />
                              )}
                            </div>
                            
                            {/* Título da aula */}
                            <span className="font-medium truncate">
                              {a.titulo.replace(/^Aula \d+ – /, '')}
                            </span>
                          </div>
                          
                          {/* Duração e indicadores */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-muted-foreground">{a.duracao}</span>
                            {a.status === 'concluida' && (
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Completed</span>
                            )}
                            {a.status === 'em_andamento' && (
                              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">In Progress</span>
                            )}
                            {a.status === 'nao_iniciada' && (
                              <Play className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Separador visual entre módulos (exceto o último) */}
                {index < cursoMock.modulos.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-border/60 dark:via-gray-700/60 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
} 