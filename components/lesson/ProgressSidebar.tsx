"use client"

import { Button } from '@/components/ui/button';
import { PanelRightOpen, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CourseModulesList } from '@/components/course';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TutorPanel } from './TutorPanel';

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
        { id: 'aula-1-origens-vibra', titulo: 'Aula 1 – Origens da Vibra no Brasil', duracao: '18:45', status: 'concluida' as const, href: '/trilha/trajetoria-vibra/aula-3-governanca-cultura' },
        { id: 'aula-2-expansao-nacional', titulo: 'Aula 2 – Expansão Nacional', duracao: '22:15', status: 'concluida' as const, href: '/trilha/trajetoria-vibra/aula-3-governanca-cultura' },
        { id: 'aula-3-governanca-cultura', titulo: 'Aula 3 – Governança e Cultura', duracao: '12:30', status: 'disponivel' as const, href: '/trilha/trajetoria-vibra/aula-3-governanca-cultura' },
        { id: 'aula-4-portfolio-inovacao', titulo: 'Aula 4 – Portfólio e Inovação', duracao: '16:10', status: 'nao_iniciada' as const, href: '/trilha/trajetoria-vibra/aula-3-governanca-cultura' },
        { id: 'aula-5-esg', titulo: 'Aula 5 – Sustentabilidade e ESG', duracao: '15:20', status: 'nao_iniciada' as const, href: '/trilha/trajetoria-vibra/aula-3-governanca-cultura' },
      ],
    },
    {
      id: 'm2',
      titulo: 'Atualidade e Futuro',
      resumo: '3 vídeos · 45min',
      aulas: [
        { id: 'aula-6-mercado-concorrencia', titulo: 'Aula 6 – Mercado e Concorrência', duracao: '09:50', status: 'nao_iniciada' as const, href: '/trilha/trajetoria-vibra/aula-3-governanca-cultura' },
        { id: 'aula-7-parcerias-estrategicas', titulo: 'Aula 7 – Parcerias Estratégicas', duracao: '11:05', status: 'nao_iniciada' as const, href: '/trilha/trajetoria-vibra/aula-3-governanca-cultura' },
        { id: 'aula-8-visao-futuro', titulo: 'Aula 8 – Visão de Futuro', duracao: '24:10', status: 'nao_iniciada' as const, href: '/trilha/trajetoria-vibra/aula-3-governanca-cultura' },
      ],
    },
  ],
};

interface ProgressSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  mode?: 'progresso' | 'tutor';
}

export function ProgressSidebar({ isOpen = false, onToggle, mode = 'progresso' }: ProgressSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1', 'm2']); // Todos os módulos expandidos por padrão
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // breakpoint md
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle módulo expandido/colapsado
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // No mobile, sempre mostrar como overlay
  if (isMobile) {
    if (!isOpen) {
      // Botão flutuante para abrir o sidebar no mobile
      return (
        <div className="fixed top-6 right-6 z-50 md:hidden">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={onToggle}
                  aria-label="Mostrar progresso do curso"
                >
                  <PanelRightOpen className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Ver progresso do curso</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }

    // Sidebar como overlay no mobile
    return (
      <>
        {/* Overlay de fundo */}
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
        
        {/* Sidebar mobile */}
        <aside className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-950 z-50 shadow-2xl md:hidden">
          {/* Header mobile */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h3 className="text-lg font-bold text-foreground">
              {mode === 'progresso' ? 'Conteúdo do curso' : 'Tutor do módulo'}
            </h3>
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggle}
              aria-label="Fechar sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Conteúdo mobile */}
          <div className="overflow-y-auto h-full">
            {mode === 'progresso' ? (
              <div className="p-4">
                <CourseModulesList
                  modulos={cursoMock.modulos}
                  onModuleToggle={toggleModule}
                  expandedModules={expandedModules}
                />
              </div>
            ) : (
              <TutorPanel />
            )}
          </div>
        </aside>
      </>
    );
  }

  // Comportamento desktop (mantém o atual)
  if (!isOpen) {
    // Modo comprimido: apenas borda esquerda (sem toggle)
    return (
      <aside className="sticky top-0 h-screen border-l bg-transparent">
        {/* Sem toggle aqui - os toggles são controlados pela página principal */}
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
          <h3 className="text-xl font-bold text-foreground">
            {mode === 'progresso' ? 'Conteúdo do curso' : 'Tutor IA'}
          </h3>
          <div className="flex items-center gap-2">
            {onToggle && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 rounded-full"
                      onClick={onToggle}
                      aria-label="Ocultar sidebar"
                    >
                      <PanelRightOpen className="h-3 w-3 rotate-180" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Ocultar sidebar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo do sidebar baseado no modo */}
      {mode === 'progresso' ? (
        // Lista de módulos usando o componente reutilizável
        <div className="px-6 py-4 bg-white dark:bg-gray-950">
          <CourseModulesList
            modulos={cursoMock.modulos}
            onModuleToggle={toggleModule}
            expandedModules={expandedModules}
          />
        </div>
      ) : (
        // Painel do Tutor
        <TutorPanel />
      )}
    </aside>
  );
} 