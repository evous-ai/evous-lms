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
interface VideoDetailsClientProps {
  user: {
    id: string
    email?: string
  }
  profile: {
    full_name?: string | null
    country?: string | null
  } | null
  course: {
    id: string
    titulo: string
    categoria: string
    modulos: Array<{
      id: string
      titulo: string
      aulas: Array<{
        id: string
        titulo: string
        duracao: string
        video_url?: string | null
        description?: string | null
        status: 'concluida' | 'disponivel' | 'bloqueada' | 'nao_iniciada'
      }>
    }>
  }
  video: {
    id: string
    titulo: string
    duracao: string
    video_url?: string | null
    description?: string | null
  }
  module: {
    id: string
    titulo: string
  } | undefined
  courseId: string
  videoId: string
}

export default function VideoDetailsClient({ 
  user, 
  profile, 
  course, 
  video, 
  module, 
  courseId, 
  videoId 
}: VideoDetailsClientProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'progresso'>('progresso');
  const [isMobile, setIsMobile] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Calcular informações de navegação
  const allVideos = course.modulos.flatMap(modulo => 
    modulo.aulas.map(aula => ({ ...aula, moduleId: modulo.id }))
  );
  const currentVideoIndex = allVideos.findIndex(v => v.id === videoId);
  const prevVideo = currentVideoIndex > 0 ? allVideos[currentVideoIndex - 1] : null;
  const nextVideo = currentVideoIndex < allVideos.length - 1 ? allVideos[currentVideoIndex + 1] : null;

  // Função para converter dados do curso para o formato esperado pelo ProgressSidebar
  const convertCourseForSidebar = (course: VideoDetailsClientProps['course']) => {
    const totalVideos = course.modulos.reduce((acc, modulo) => acc + modulo.aulas.length, 0);
    
    return {
      id: course.id,
      titulo: course.titulo,
      descricao: `Curso sobre ${course.categoria}`,
      totalVideos,
      concluidos: course.modulos.reduce((acc, modulo) => 
        acc + modulo.aulas.filter(aula => aula.status === 'concluida').length, 0),
      percent: course.modulos.reduce((acc, modulo) => 
        acc + modulo.aulas.filter(aula => aula.status === 'concluida').length, 0) / totalVideos * 100,
      duracaoTotal: `${totalVideos} vídeos`,
      categoria: course.categoria,
      modulos: course.modulos.map(modulo => ({
        ...modulo,
        resumo: `${modulo.aulas.length} vídeos`,
        aulas: modulo.aulas.map(aula => ({
          ...aula,
          status: aula.status // Usar o status real do vídeo
        }))
      }))
    };
  };

  // Detectar se é mobile e ajustar estado inicial do sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        // Verificar se o sidebar estava aberto anteriormente
        const wasSidebarOpen = localStorage.getItem('sidebarOpen') === 'true';
        
        // Aguardar a página carregar antes de abrir o sidebar
        setTimeout(() => {
          setIsSidebarOpen(wasSidebarOpen);
        }, 100); // Delay de 100ms para evitar movimento instantâneo
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Marcar página como carregada
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Salvar estado do sidebar no localStorage quando mudar
  useEffect(() => {
    if (isPageLoaded && !isMobile) {
      localStorage.setItem('sidebarOpen', isSidebarOpen.toString());
    }
  }, [isSidebarOpen, isPageLoaded, isMobile]);

  // Função para navegar para o próximo vídeo preservando o estado do sidebar
  const navigateToNextVideo = () => {
    if (nextVideo) {
      // Preservar o estado atual do sidebar antes de navegar
      localStorage.setItem('sidebarOpen', isSidebarOpen.toString());
      // Navegar para o próximo vídeo
      window.location.href = `/trilha/${courseId}/${nextVideo.id}`;
    }
  };

  // Função para navegar para o vídeo anterior preservando o estado do sidebar
  const navigateToPrevVideo = () => {
    if (prevVideo) {
      // Preservar o estado atual do sidebar antes de navegar
      localStorage.setItem('sidebarOpen', isSidebarOpen.toString());
      // Navegar para o vídeo anterior
      window.location.href = `/trilha/${courseId}/${prevVideo.id}`;
    }
  };

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
                        <BreadcrumbLink href={`/trilha/${courseId}`} className="text-muted-foreground hover:text-foreground">
                          {course.titulo}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-foreground">
                          {video.titulo}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  
                  {/* Header da lição */}
                  <section className="mb-4">
                    <h1 className="text-3xl font-bold text-foreground">{video.titulo}</h1>
                    <p className="text-lg text-muted-foreground mt-2">
                      {module?.titulo} • {video.duracao}
                    </p>
                  </section>

                  {/* Player */}
                  <section className="mb-6">
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
                      {video.video_url ? (
                        <video
                          className="h-full w-full"
                          controls
                          playsInline
                          preload="metadata"
                        >
                          <source src={video.video_url} type="video/mp4" />
                          Seu navegador não suporta vídeo HTML5.
                        </video>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-white">
                          <p>URL do vídeo não disponível</p>
                        </div>
                      )}
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

                  {/* Descrição */}
                  {video.description && (
                    <section className="mb-10">
                      <h2 className="text-lg font-semibold mb-2">Descrição</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
                        {video.description}
                      </p>
                    </section>
                  )}

                  {/* Navegação entre aulas */}
                  <section className="mb-6">
                    <div className="flex items-center justify-between">
                      {prevVideo ? (
                        <Button 
                          variant="outline" 
                          onClick={navigateToPrevVideo}
                          className="flex items-center gap-2"
                        >
                          ← Aula anterior
                        </Button>
                      ) : (
                        <div></div>
                      )}
                      
                      {nextVideo ? (
                        <Button 
                          variant="outline" 
                          onClick={navigateToNextVideo}
                          className="flex items-center gap-2"
                        >
                          Próxima aula →
                        </Button>
                      ) : (
                        <div></div>
                      )}
                    </div>
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
                ? "w-0"
                : isSidebarOpen 
                  ? "w-[360px]" 
                  : "w-[48px]"
            )}>
              {/* Sidebar principal (ProgressSidebar) */}
              <ProgressSidebar 
                isOpen={isSidebarOpen} 
                onToggle={() => setIsSidebarOpen((v) => !v)}
                mode={sidebarMode}
                courseData={convertCourseForSidebar(course)}
                courseId={courseId}
              />
            </div>
            
            {/* Toggles - POSICIONAMENTO DINÂMICO */}
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
                            setIsSidebarOpen(false);
                          } else {
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
        lessonTitle={video.titulo}
      />
    </SidebarProvider>
  );
}
