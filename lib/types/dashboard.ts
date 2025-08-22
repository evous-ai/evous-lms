export interface Treinamento {
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
}

export interface DashboardFilters {
  busca: string
  categoria: string
  status: string
}

export interface DashboardStats {
  totalCursos: number
  cursosEmAndamento: number
  cursosConcluidos: number
  cursosNaoIniciados: number
}
