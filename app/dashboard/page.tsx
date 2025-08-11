"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Award, Target, Star, Video, Clock } from "lucide-react"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-slate-50">
          {/* Mensagem de Boas-vindas */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Olá, Edgar! 👋</h1>
            <p className="text-muted-foreground text-lg">
              Pronto para continuar sua jornada? Aqui estão seus treinamentos e seu progresso.
            </p>
          </div>

          {/* 1. Seção: Sua Jornada */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Sua Jornada</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-4 bg-white rounded-md shadow-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pontuação</p>
                    <p className="text-xl font-bold">1.250</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white rounded-md shadow-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progresso</p>
                    <p className="text-xl font-bold">3/5</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white rounded-md shadow-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nível</p>
                    <p className="text-xl font-bold">Explorador</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* 2. Seção: Treinamentos Disponíveis */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Treinamentos Disponíveis</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white border rounded-2xl shadow-none p-2">
                <div>
                  <div className="bg-blue-100 rounded-xl px-5 py-6 mb-4">
                    <Badge variant="secondary" className="bg-white text-gray-700">Identidade Visual</Badge>
                    <h3 className="text-xl font-semibold mt-3">Rebranding</h3>
                    <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1"><Video className="h-4 w-4" /> 1 vídeo</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 15min</span>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Progresso</span>
                      <span className="text-muted-foreground">1/1 vídeos · 100%</span>
                    </div>
                    <Progress value={100} className="h-2 rounded-full" />
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="default" className="bg-green-100 text-green-800">Curso Concluído</Badge>
                      <Button size="sm" variant="outline">Revisar</Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border rounded-2xl shadow-none p-2">
                <div>
                  <div className="bg-green-100 rounded-xl px-5 py-6 mb-4">
                    <Badge variant="secondary" className="bg-white text-gray-700">Estratégia Comercial</Badge>
                    <h3 className="text-xl font-semibold mt-3">Trajetória Vibra</h3>
                    <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1"><Video className="h-4 w-4" /> 8 vídeos</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 2h30min</span>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Progresso</span>
                      <span className="text-muted-foreground">4/8 vídeos · 45%</span>
                    </div>
                    <Progress value={45} className="h-2 rounded-full" />
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="default" className="bg-blue-100 text-blue-800">Em Andamento</Badge>
                      <Button size="sm">Continuar</Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border rounded-2xl shadow-none p-2">
                <div>
                  <div className="bg-purple-100 rounded-xl px-5 py-6 mb-4">
                    <Badge variant="secondary" className="bg-white text-gray-700">Produtos & Combustíveis</Badge>
                    <h3 className="text-xl font-semibold mt-3">Mitos e Verdades</h3>
                    <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1"><Video className="h-4 w-4" /> 2 vídeos</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 45min</span>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Progresso</span>
                      <span className="text-muted-foreground">0/2 vídeos · 0%</span>
                    </div>
                    <Progress value={0} className="h-2 rounded-full" />
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline">Não Iniciado</Badge>
                      <Button size="sm">Começar</Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border rounded-2xl shadow-none p-2">
                <div>
                  <div className="bg-orange-100 rounded-xl px-5 py-6 mb-4">
                    <Badge variant="secondary" className="bg-white text-gray-700">Tecnologia</Badge>
                    <h3 className="text-xl font-semibold mt-3">Lentes Digitais</h3>
                    <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1"><Video className="h-4 w-4" /> 3 vídeos</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 1h15min</span>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Progresso</span>
                      <span className="text-muted-foreground">0/3 vídeos · 0%</span>
                    </div>
                    <Progress value={0} className="h-2 rounded-full" />
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline">Não Iniciado</Badge>
                      <Button size="sm">Começar</Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border rounded-2xl shadow-none p-2">
                <div>
                  <div className="bg-pink-100 rounded-xl px-5 py-6 mb-4">
                    <Badge variant="secondary" className="bg-white text-gray-700">Tratamento</Badge>
                    <h3 className="text-xl font-semibold mt-3">Presbiopia</h3>
                    <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1"><Video className="h-4 w-4" /> 4 vídeos</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 1h45min</span>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Progresso</span>
                      <span className="text-muted-foreground">1/4 vídeos · 25%</span>
                    </div>
                    <Progress value={25} className="h-2 rounded-full" />
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="default" className="bg-blue-100 text-blue-800">Em Andamento</Badge>
                      <Button size="sm">Continuar</Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white border rounded-2xl shadow-none p-2">
                <div>
                  <div className="bg-indigo-100 rounded-xl px-5 py-6 mb-4">
                    <Badge variant="secondary" className="bg-white text-gray-700">Patologia</Badge>
                    <h3 className="text-xl font-semibold mt-3">Hipermetropia</h3>
                    <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1"><Video className="h-4 w-4" /> 2 vídeos</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 50min</span>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Progresso</span>
                      <span className="text-muted-foreground">0/2 vídeos · 0%</span>
                    </div>
                    <Progress value={0} className="h-2 rounded-full" />
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline">Não Iniciado</Badge>
                      <Button size="sm">Começar</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
