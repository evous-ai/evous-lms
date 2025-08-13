"use client"

import { LMSSidebar } from "@/components/lms-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { Award, Target, Star, Search, Filter, X } from "lucide-react"
import { useState, useMemo } from "react"
import { TrainingCard } from "@/components/TrainingCard"

// Dados dos treinamentos
const treinamentos: Array<{
  id: string
  titulo: string
  categoria: string
  status: "concluido" | "em-andamento" | "nao-iniciado"
  progresso: number
  videos: number
  duracao: string
  cor: "blue" | "green" | "purple" | "orange" | "pink" | "indigo"
  acao: string
  acaoVariant: "default" | "outline"
  acaoHref?: string
}> = [
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
const status = ["Todos", "Em Andamento", "Concluído", "Não Iniciado"]

export default function Page() {
  const [busca, setBusca] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [statusFiltro, setStatusFiltro] = useState("Todos")



  // Filtros aplicados
  const treinamentosFiltrados = useMemo(() => {
    return treinamentos.filter(treinamento => {
      const matchBusca = treinamento.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                        treinamento.categoria.toLowerCase().includes(busca.toLowerCase())
      
      const matchCategoria = categoriaFiltro === "Todas" || treinamento.categoria === categoriaFiltro
      
      const matchStatus = statusFiltro === "Todos" || 
        (statusFiltro === "Em Andamento" && treinamento.status === "em-andamento") ||
        (statusFiltro === "Concluído" && treinamento.status === "concluido") ||
        (statusFiltro === "Não Iniciado" && treinamento.status === "nao-iniciado")
      
      return matchBusca && matchCategoria && matchStatus
    })
  }, [busca, categoriaFiltro, statusFiltro])

  // Limpar filtros
  const limparFiltros = () => {
    setBusca("")
    setCategoriaFiltro("Todas")
    setStatusFiltro("Todos")
  }

  // Verificar se há filtros ativos
  const temFiltrosAtivos = busca || categoriaFiltro !== "Todas" || statusFiltro !== "Todos"

  return (
    <SidebarProvider>
      <LMSSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50 dark:bg-background">
          {/* Mensagem de Boas-vindas */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Olá, Edgar! 👋</h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Pronto para continuar sua jornada? Aqui estão seus treinamentos e seu progresso.
            </p>
          </div>

          {/* 1. Seção: Sua Jornada */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Sua Jornada</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Card className="p-4 bg-card border-border shadow-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pontuação</p>
                    <p className="text-xl font-bold text-foreground">1.250</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border shadow-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progresso</p>
                    <p className="text-xl font-bold text-foreground">3/5</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border shadow-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nível</p>
                    <p className="text-xl font-bold text-foreground">Explorador</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* 2. Seção: Treinamentos Disponíveis */}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={limparFiltros}
                    className="flex items-center gap-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <X className="h-4 w-4" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {/* Resultados da busca */}
            {temFiltrosAtivos && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>
                  {treinamentosFiltrados.length} de {treinamentos.length} treinamentos encontrados
                </span>
              </div>
            )}

            {/* Grid de treinamentos */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {treinamentosFiltrados.map((treinamento) => (
                <TrainingCard
                  key={treinamento.id}
                  id={treinamento.id}
                  titulo={treinamento.titulo}
                  categoria={treinamento.categoria}
                  status={treinamento.status}
                  progresso={treinamento.progresso}
                  videos={treinamento.videos}
                  duracao={treinamento.duracao}
                  cor={treinamento.cor}
                  acao={treinamento.acao}
                  acaoVariant={treinamento.acaoVariant}
                  acaoHref="/trilha/trajetoria-vibra"
                  href="/trilha/trajetoria-vibra"
                />
              ))}
            </div>

            {/* Mensagem quando não há resultados */}
            {treinamentosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium text-foreground">Nenhum treinamento encontrado</p>
                  <p className="text-sm">Tente ajustar os filtros ou a busca</p>
                </div>
                <Button variant="outline" onClick={limparFiltros} className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">
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
