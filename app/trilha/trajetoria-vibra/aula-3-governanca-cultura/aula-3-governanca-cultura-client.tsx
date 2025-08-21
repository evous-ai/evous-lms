"use client"

import { LMSSidebar } from "@/components/lms-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Star } from 'lucide-react';

import { ProgressSidebar } from '@/components/lesson/ProgressSidebar';
import { ContactSupportModal } from '@/components/modals/contact-support-modal';
import { Home, MessageCircle, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Props do componente
interface Aula3GovernancaCulturaClientProps {
  user: {
    id: string
    email?: string
  }
  profile: {
    full_name?: string | null
    country?: string | null
  } | null
}

// Dados estáticos da lição
const lesson = {
  titulo: 'Introdução à meditação para iniciantes',
  numero: 'Aula 2 de 10',
  duracao: '12:30',
  prevHref: '/trilha/trajetoria-vibra',
  nextHref: '/trilha/trajetoria-vibra'
};

export default function Aula3GovernancaCulturaClient({ user, profile }: Aula3GovernancaCulturaClientProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado inicial fechado
  const [sidebarMode, setSidebarMode] = useState<'progresso'>('progresso');
  const [isMobile, setIsMobile] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Detectar se é mobile e ajustar estado inicial do sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // No mobile, sidebar sempre inicia fechado
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        // No desktop, pode iniciar aberto
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <SidebarProvider defaultOpen={false}>
      <LMSSidebar user={user} profile={profile} />
      <SidebarInset 
        className="!bg-slate-50 dark:!bg-gray-950"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <main className="bg-slate-50 dark:bg-gray-950 min-h-screen">
          {/* Layout de 3 colunas: Conteúdo + Progresso (sempre visível) */}
          <div className="flex gap-6">
            {/* Coluna principal: conteúdo da aula */}
            <div className="flex-1 min-w-0 p-6 pb-20 lg:pb-6">
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                  
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
                        <BreadcrumbLink href="/trilha/trajetoria-vibra" className="text-muted-foreground hover:text-foreground">
                          Trajetória Vibra
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-foreground">
                          {lesson.titulo}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  
                  {/* Header da lição */}
                  <section className="mb-4">
                    <h1 className="text-3xl font-bold text-foreground">{lesson.titulo}</h1>
                  </section>

                  {/* Player */}
                  <section className="mb-6">
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
                      <video
                        className="h-full w-full"
                        controls
                        playsInline
                        preload="metadata"
                      >
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                        Seu navegador não suporta vídeo HTML5.
                      </video>
                    </div>
                  </section>

                  {/* Rating */}
                  <section className="mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-muted-foreground">Avalie esta aula:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-colors duration-200"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= (hoverRating || rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {rating} de 5 estrelas
                        </span>
                      )}
                    </div>
                  </section>

                  {/* Introdução */}
                  <section className="mb-10">
                    <h2 className="text-lg font-semibold mb-2">Introdução</h2>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                      A meditação é uma ferramenta poderosa para melhorar o bem‑estar mental e emocional,
                      reduzir o estresse e cultivar presença no dia a dia. Nesta aula introdutória, vamos
                      abordar conceitos básicos, postura, respiração e como criar uma rotina simples para começar.
                    </p>
                  </section>

                  {/* Footer local - Completar Aula */}
                  <section className="mt-8 pt-4 border-t border-transparent flex justify-end">
                    <Button size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white w-full md:w-auto">
                      Completar Aula
                    </Button>
                  </section>

                  {/* Footer - Bloco de Suporte */}
                  <section className="mt-12 pt-8">
                    <div className="text-center space-y-4 bg-slate-100 dark:bg-slate-900/30 rounded-xl p-8">
                      <div className="flex justify-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                          <MessageCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Precisa de ajuda?
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                          Tem alguma dúvida sobre esta aula ou quer compartilhar feedback? 
                          Nossa equipe está aqui para ajudar!
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => setIsContactModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        size="lg"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </Button>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Coluna direita: sidebar de progresso (sempre visível) */}
            <div className={cn(
              "flex-shrink-0 transition-all duration-300 ease-in-out relative",
              isMobile 
                ? "w-0" // No mobile não ocupa espaço quando fechado
                : isSidebarOpen 
                  ? "w-[360px]" 
                  : "w-[48px]"
            )}>
              {/* Sidebar principal (ProgressSidebar) */}
              <ProgressSidebar 
                isOpen={isSidebarOpen} 
                onToggle={() => setIsSidebarOpen((v) => !v)}
                mode={sidebarMode}
              />
            </div>
            
            {/* Toggles - POSICIONAMENTO DINÂMICO (empurrados pelo sidebar) */}
            <div 
              className="fixed pointer-events-none z-50 transition-all duration-300 ease-in-out" 
              style={{ 
                right: isSidebarOpen ? '360px' : '48px', 
                top: '0', 
                height: '100vh' 
              }}
            >
              {/* Toggle para Progresso */}
              <div className="absolute -left-4 top-6 pointer-events-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full hover:scale-110 transition-transform"
                        onClick={() => {
                          if (isSidebarOpen && sidebarMode === 'progresso') {
                            // Se já está aberto em modo progresso, comprime
                            setIsSidebarOpen(false);
                          } else {
                            // Abre em modo progresso
                            setSidebarMode('progresso');
                            setIsSidebarOpen(true);
                          }
                        }}
                        aria-label="Mostrar ementa do treinamento"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Ementa do Treinamento</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
      
      {/* Modal de Contato com Suporte */}
      <ContactSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        lessonTitle={lesson.titulo}
      />
    </SidebarProvider>
  );
}
