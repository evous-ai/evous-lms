"use client"

import { LMSSidebar } from "@/components/lms-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { Video, Clock, Search, X, Home } from "lucide-react"
import { useState, useMemo } from "react"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

// Dados dos treinamentos (igual ao dashboard)
const treinamentos = [
  {
    id: "rebranding",
    titulo: "Rebranding",
    categoria: "Identidade Visual",
    status: "concluido",
    progresso: 100,
    videos: 1,
    duracao: "15min",
    cor: "blue",
    acao: "Revisar",
    acaoVariant: "outline" as const,
    acaoHref: "/trilha/trajetoria-vibra"
  },
  {
    id: "trajetoria-vibra",
    titulo: "Trajetória Vibra",
    categoria: "Estratégia Comercial",
    status: "em-andamento",
    progresso: 45,
    videos: 8,
    duracao: "2h30min",
    cor: "green",
    acao: "Continuar",
    acaoVariant: "default" as const,
    acaoHref: "/trilha/trajetoria-vibra"
  },
  {
    id: "mitos-verdades",
    titulo: "Mitos e Verdades",
    categoria: "Produtos & Combustíveis",
    status: "nao-iniciado",
    progresso: 0,
    videos: 2,
    duracao: "45min",
    cor: "purple",
    acao: "Começar",
    acaoVariant: "default" as const,
    acaoHref: "/trilha/trajetoria-vibra"
  },
  {
    id: "lentes-digitais",
    titulo: "Lentes Digitais",
    categoria: "Tecnologia",
    status: "nao-iniciado",
    progresso: 0,
    videos: 3,
    duracao: "1h15min",
    cor: "orange",
    acao: "Começar",
    acaoVariant: "default" as const,
    acaoHref: "/trilha/trajetoria-vibra"
  },
  {
    id: "presbiopia",
    titulo: "Presbiopia",
    categoria: "Tratamento",
    status: "em-andamento",
    progresso: 25,
    videos: 4,
    duracao: "1h45min",
    cor: "pink",
    acao: "Continuar",
    acaoVariant: "default" as const,
    acaoHref: "/trilha/trajetoria-vibra"
  },
  {
    id: "hipermetropia",
    titulo: "Hipermetropia",
    categoria: "Patologia",
    status: "nao-iniciado",
    progresso: 0,
    videos: 2,
    duracao: "50min",
    cor: "indigo",
    acao: "Começar",
    acaoVariant: "default" as const,
    acaoHref: "/trilha/trajetoria-vibra"
  }
]

// Categorias disponíveis
const categorias = ["Todas", "Identidade Visual", "Estratégia Comercial", "Produtos & Combustíveis", "Tecnologia", "Tratamento", "Patologia"]

// Status disponíveis
const status = ["Todos", "concluido", "em-andamento", "nao-iniciado"]

export default function MeusTreinamentosPage() {
  const [busca, setBusca] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [statusFiltro, setStatusFiltro] = useState("Todos")

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "em-andamento":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "nao-iniciado":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // Função para obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case "concluido":
        return "Curso Concluído"
      case "em-andamento":
        return "Em Andamento"
      case "nao-iniciado":
        return "Não Iniciado"
      default:
        return "Não Iniciado"
    }
  }

  // Filtrar treinamentos
  const treinamentosFiltrados = useMemo(() => {
    return treinamentos.filter(treinamento => {
      const matchBusca = treinamento.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                        treinamento.categoria.toLowerCase().includes(busca.toLowerCase())
      const matchCategoria = categoriaFiltro === "Todas" || treinamento.categoria === categoriaFiltro
      const matchStatus = statusFiltro === "Todos" || treinamento.status === statusFiltro
      
      return matchBusca && matchCategoria && matchStatus
    })
  }, [busca, categoriaFiltro, statusFiltro])

  const limparFiltros = () => {
    setBusca("")
    setCategoriaFiltro("Todas")
    setStatusFiltro("Todos")
  }

  const temFiltrosAtivos = busca || categoriaFiltro !== "Todas" || statusFiltro !== "Todos"

  return (
    <SidebarProvider>
      <LMSSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50 dark:bg-background">
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
                <BreadcrumbPage className="text-foreground">Meus Treinamentos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Título da página */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Meus Treinamentos</h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Gerencie e acompanhe todos os seus treinamentos disponíveis.
            </p>
          </div>

          {/* Seção: Treinamentos Disponíveis */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-foreground">Treinamentos Disponíveis</h2>
              
              {/* Filtros e Busca */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Campo de busca */}
                <div className="relative flex-1 sm:flex-none sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar treinamentos..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10 pr-4 bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Filtro de categoria */}
                <div className="w-full sm:w-48">
                  <Combobox
                    options={categorias.map(cat => ({ value: cat, label: cat }))}
                    value={categoriaFiltro}
                    onValueChange={setCategoriaFiltro}
                    placeholder="Categoria"
                    searchPlaceholder="Buscar categoria..."
                    emptyText="Nenhuma categoria encontrada."
                  />
                </div>

                {/* Filtro de status */}
                <div className="w-full sm:w-48">
                  <Combobox
                    options={status.map(st => ({ value: st, label: st }))}
                    value={statusFiltro}
                    onValueChange={setStatusFiltro}
                    placeholder="Status"
                    searchPlaceholder="Buscar status..."
                    emptyText="Nenhum status encontrado."
                  />
                </div>

                {/* Botão limpar filtros */}
                {temFiltrosAtivos && (
                  <Button variant="outline" onClick={limparFiltros} className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">
                    <X className="h-4 w-4 mr-2" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {/* Lista de treinamentos */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {treinamentosFiltrados.map((treinamento) => (
                <Card key={treinamento.id} className="bg-card border-border rounded-2xl shadow-none p-2">
                  <div className="p-4 space-y-4">
                    {/* Header do card */}
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="bg-background text-foreground border-border">
                        {treinamento.categoria}
                      </Badge>
                      <Badge className={getStatusColor(treinamento.status)}>
                        {getStatusText(treinamento.status)}
                      </Badge>
                    </div>

                    {/* Título e descrição */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{treinamento.titulo}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          <span>{treinamento.videos} vídeos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{treinamento.duracao}</span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium text-foreground">{treinamento.progresso}%</span>
                      </div>
                      <Progress value={treinamento.progresso} className="h-2" />
                    </div>

                    {/* Botão de ação */}
                    <Button 
                      variant={treinamento.acaoVariant} 
                      className="w-full"
                      asChild
                    >
                      <Link href={treinamento.acaoHref}>
                        {treinamento.acao}
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Mensagem quando não há resultados */}
            {treinamentosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Nenhum treinamento encontrado com os filtros aplicados.</p>
                <Button variant="outline" onClick={limparFiltros} className="mt-4">
                  Limpar filtros
                </Button>
              </div>
            )}
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 