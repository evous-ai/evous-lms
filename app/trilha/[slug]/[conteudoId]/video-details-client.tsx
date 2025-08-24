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
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [videoProgress, setVideoProgress] = useState<{
    status: 'not_started' | 'in_progress' | 'completed';
    progressSeconds: number;
  } | null>(null);
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isCompletingLesson, setIsCompletingLesson] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState(course);
  const progressUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calcular informações de navegação
  const allVideos = updatedCourse.modulos.flatMap(modulo => 
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

  // Função para atualizar o status do vídeo no curso para o sidebar
  const updateVideoStatusInCourse = (videoId: string, newStatus: 'concluida' | 'disponivel' | 'nao_iniciada') => {
    setUpdatedCourse(prevCourse => {
      const newCourse = { ...prevCourse };
      
      // Encontrar e atualizar o status do vídeo
      newCourse.modulos = newCourse.modulos.map(modulo => ({
        ...modulo,
        aulas: modulo.aulas.map(aula => 
          aula.id === videoId 
            ? { ...aula, status: newStatus }
            : aula
        )
      }));
      
      return newCourse;
    });
  };

  // Função para salvar progresso do vídeo com debounce
  const saveVideoProgress = useCallback(async (status: 'not_started' | 'in_progress' | 'completed', progressSeconds: number = 0) => {
    // Cancelar timeout anterior se existir
    if (progressUpdateTimeoutRef.current) {
      clearTimeout(progressUpdateTimeoutRef.current);
    }

    // Para status 'in_progress', usar debounce de 2 segundos
    if (status === 'in_progress') {
      progressUpdateTimeoutRef.current = setTimeout(async () => {
        await performSaveProgress(status, progressSeconds);
      }, 2000);
    } else {
      // Para outros status, salvar imediatamente
      await performSaveProgress(status, progressSeconds);
    }

    // Função para executar o salvamento real do progresso
    async function performSaveProgress(status: 'not_started' | 'in_progress' | 'completed', progressSeconds: number = 0) {
      if (isSavingProgress) return; // Evitar múltiplas chamadas simultâneas
      
      try {
        setIsSavingProgress(true);
        
        // Garantir que progressSeconds seja um número inteiro
        const finalProgressSeconds = Math.floor(progressSeconds);
        
        const response = await fetch('/api/video-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            videoId,
            status,
            progressSeconds: finalProgressSeconds
          })
        });

        if (response.ok) {
          const data = await response.json();
          setVideoProgress({
            status,
            progressSeconds: finalProgressSeconds
          });
          
          // Se o vídeo foi iniciado, mostrar feedback
          if (status === 'in_progress' && !isVideoStarted) {
            setIsVideoStarted(true);
            console.log('Curso iniciado com sucesso!');
            // Atualizar o status do vídeo no curso para o sidebar
            updateVideoStatusInCourse(videoId, 'disponivel');
          }
          
          // Se o vídeo foi concluído, mostrar feedback e atualizar sidebar
          if (status === 'completed') {
            console.log('Vídeo concluído com sucesso!');
            // Atualizar o status do vídeo no curso para o sidebar
            updateVideoStatusInCourse(videoId, 'concluida');
          }
          
          return data;
        } else {
          console.error('Erro ao salvar progresso:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao salvar progresso:', error);
      } finally {
        setIsSavingProgress(false);
      }
    }
  }, [videoId, isSavingProgress, isVideoStarted]);

  // Função para buscar progresso atual do vídeo
  const fetchVideoProgress = useCallback(async () => {
    try {
      const response = await fetch(`/api/video-progress?videoId=${videoId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.progress) {
          setVideoProgress({
            status: data.progress.status,
            progressSeconds: data.progress.progress_seconds
          });
          setIsVideoStarted(data.progress.status === 'in_progress' || data.progress.status === 'completed');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar progresso:', error);
    }
  }, [videoId]);

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

  // Buscar progresso inicial do vídeo
  useEffect(() => {
    if (isPageLoaded) {
      fetchVideoProgress();
    }
  }, [isPageLoaded, fetchVideoProgress]);

  // Salvar estado do sidebar no localStorage quando mudar
  useEffect(() => {
    if (isPageLoaded && !isMobile) {
      localStorage.setItem('sidebarOpen', isSidebarOpen.toString());
    }
  }, [isSidebarOpen, isPageLoaded, isMobile]);

  // Cleanup do timeout quando componente for desmontado
  useEffect(() => {
    return () => {
      if (progressUpdateTimeoutRef.current) {
        clearTimeout(progressUpdateTimeoutRef.current);
      }
    };
  }, []);

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
                          ref={(videoRef) => {
                            if (videoRef) {
                              // Adicionar eventos ao vídeo apenas uma vez
                              const handlePlay = () => {
                                if (!isVideoStarted) {
                                  saveVideoProgress('in_progress', 0);
                                }
                              };
                              
                              const handleTimeUpdate = () => {
                                if (videoRef.currentTime > 0) {
                                  // Enviar o tempo atual em segundos
                                  const currentTimeSeconds = Math.floor(videoRef.currentTime);
                                  saveVideoProgress('in_progress', currentTimeSeconds);
                                }
                              };
                              
                              const handleEnded = () => {
                                // Quando o vídeo termina, enviar o tempo total
                                if (videoRef.duration) {
                                  const totalDurationSeconds = Math.floor(videoRef.duration);
                                  saveVideoProgress('completed', totalDurationSeconds);
                                } else {
                                  saveVideoProgress('completed', 0);
                                }
                              };

                              // Remover listeners anteriores se existirem
                              videoRef.removeEventListener('play', handlePlay);
                              videoRef.removeEventListener('timeupdate', handleTimeUpdate);
                              videoRef.removeEventListener('ended', handleEnded);

                              // Adicionar novos listeners
                              videoRef.addEventListener('play', handlePlay);
                              videoRef.addEventListener('timeupdate', handleTimeUpdate);
                              videoRef.addEventListener('ended', handleEnded);
                            }
                          }}
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
                    
                    {/* Indicador de status do vídeo */}
                    {videoProgress && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <div className={`w-3 h-3 rounded-full ${
                          videoProgress.status === 'completed' ? 'bg-green-500' :
                          videoProgress.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}></div>
                        <span className="text-muted-foreground">
                          {videoProgress.status === 'completed' ? 'Vídeo concluído' :
                           videoProgress.status === 'in_progress' ? 'Em progresso' :
                           'Não iniciado'}
                        </span>
                        {videoProgress.status === 'in_progress' && videoProgress.progressSeconds > 0 && (
                          <span className="text-muted-foreground">
                            • {Math.floor(videoProgress.progressSeconds / 60)}:{(videoProgress.progressSeconds % 60).toString().padStart(2, '0')}
                          </span>
                        )}
                        {videoProgress.status === 'completed' && (
                          <span className="text-muted-foreground">
                            • Concluído em {Math.floor(videoProgress.progressSeconds / 60)}:{(videoProgress.progressSeconds % 60).toString().padStart(2, '0')}
                          </span>
                        )}
                        {isSavingProgress && (
                          <span className="text-muted-foreground text-xs">
                            Salvando...
                          </span>
                        )}
                      </div>
                    )}
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
                          className="flex items-center gap-2 cursor-pointer"
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
                    {videoProgress?.status === 'completed' ? (
                      // Botão quando a aula está concluída
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 w-full md:w-auto cursor-pointer"
                        disabled
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Aula Concluída
                        </div>
                      </Button>
                    ) : (
                      // Botão para completar a aula
                      <Button 
                        size="lg" 
                        className="bg-emerald-700 hover:bg-emerald-800 text-white w-full md:w-auto cursor-pointer"
                        onClick={async () => {
                          try {
                            setIsCompletingLesson(true);
                            
                            // Buscar o elemento de vídeo para capturar o tempo atual
                            const videoElement = document.querySelector('video') as HTMLVideoElement;
                            let progressSeconds = 0;
                            
                            if (videoElement) {
                              // Se o vídeo tem duração, usar o tempo atual ou duração total
                              if (videoElement.duration) {
                                progressSeconds = Math.max(
                                  Math.floor(videoElement.currentTime),
                                  Math.floor(videoElement.duration * 0.8) // Mínimo 80% da duração
                                );
                              }
                            }
                            
                            // Marcar vídeo como concluído com o progresso capturado
                            await saveVideoProgress('completed', progressSeconds);
                            
                            // Mostrar feedback visual
                            console.log('Aula marcada como concluída manualmente!');
                          } catch (error) {
                            console.error('Erro ao marcar aula como concluída:', error);
                          } finally {
                            setIsCompletingLesson(false);
                          }
                        }}
                        disabled={isCompletingLesson}
                      >
                        <div className="flex items-center gap-2">
                          {isCompletingLesson ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Completando...
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              Completar Aula
                            </>
                          )}
                        </div>
                      </Button>
                    )}
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
                        className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
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
                courseData={convertCourseForSidebar(updatedCourse)}
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
