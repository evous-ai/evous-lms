
"use client"

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from 'lucide-react';

import { CommentsPanel } from '@/components/lesson/CommentsPanel';
import { QuizPanel } from '@/components/lesson/QuizPanel';
import { AttachmentsPanel } from '@/components/lesson/AttachmentsPanel';
import { NotesPanel } from '@/components/lesson/NotesPanel';
import { SharePanel } from '@/components/lesson/SharePanel';
import { Home } from 'lucide-react';
import { useState } from 'react';

// Dados estáticos da lição
const lesson = {
  titulo: 'Introdução à meditação para iniciantes',
  numero: 'Aula 2 de 10',
  duracao: '12:30',
  prevHref: '/trilha/trajetoria-vibra/aula-1',
  nextHref: '/trilha/trajetoria-vibra/aula-3'
};

export default function Aula3GovernancaCulturaPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <main className="bg-slate-50 min-h-screen p-6 pb-20 lg:pb-6">
          {/* Conteúdo principal da aula - centralizado */}
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
            </div>
          </div>

          {/* Tabs - substituindo o ActionsSidebar */}
          <div className="max-w-4xl mx-auto mt-8">
            <Tabs defaultValue="comments" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="comments">Comentários</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
                <TabsTrigger value="attachments">Anexos</TabsTrigger>
                <TabsTrigger value="notes">Notas</TabsTrigger>
                <TabsTrigger value="share">Compartilhar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="comments" className="mt-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <CommentsPanel />
                </div>
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <QuizPanel />
                </div>
              </TabsContent>
              
              <TabsContent value="attachments" className="mt-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <AttachmentsPanel />
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <NotesPanel />
                </div>
              </TabsContent>
              
              <TabsContent value="share" className="mt-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <SharePanel />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
} 