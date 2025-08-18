"use client"

import { LMSSidebar } from "@/components/lms-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { Search, X, Home } from "lucide-react"
import { useState, useMemo } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { TrainingCard } from "@/components/TrainingCard"

// Props do componente
interface MeusTreinamentosClientProps {
  user: {
    id: string
    email?: string
  }
  profile: {
    full_name?: string | null
    country?: string | null
  } | null
}

// Dados dos treinamentos (igual ao dashboard)
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
const status = ["Todos", "concluido", "em-andamento", "nao-iniciado"]

export function MeusTreinamentosClient({ user, profile }: MeusTreinamentosClientProps) {
  const [busca, setBusca] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas")
  const [statusFiltro, setStatusFiltro] = useState("Todos")

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
      <LMSSidebar user={user} profile={profile} />
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
