import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Video, Clock } from "lucide-react"
import Link from "next/link"
import { useAnalytics } from "@/hooks/use-analytics"

export interface TrainingCardProps {
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
  href?: string // Novo prop para o link principal do card
}

export function TrainingCard({
  id,
  titulo,
  categoria,
  status,
  progresso,
  videos,
  duracao,
  cor,
  acao,
  acaoVariant,
  acaoHref,
  href
}: TrainingCardProps) {
  const { trackCourse } = useAnalytics()

  // Função para trackear visualização do curso
  const handleCourseView = () => {
    trackCourse(id, titulo)
  }

  // Função para obter a cor do badge baseada no status
  const getStatusBadge = (status: string) => {
    if (status === "concluido") {
      return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Curso Concluído</Badge>
    } else if (status === "em-andamento") {
      return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Em Andamento</Badge>
    } else {
      return <Badge variant="outline" className="border-border/50 dark:border-border/30 text-muted-foreground dark:text-muted-foreground">Não Iniciado</Badge>
    }
  }

  // Função para obter a cor de fundo baseada na categoria (adaptada para dark mode)
  const getCorFundo = (cor: string) => {
    const cores = {
      blue: "bg-blue-100 dark:bg-blue-900/30",
      green: "bg-green-100 dark:bg-green-900/30",
      purple: "bg-purple-100 dark:bg-purple-900/30",
      orange: "bg-orange-100 dark:bg-orange-900/30",
      pink: "bg-pink-100 dark:bg-pink-900/30",
      indigo: "bg-indigo-100 dark:bg-indigo-900/30"
    }
    return cores[cor as keyof typeof cores] || "bg-gray-100 dark:bg-gray-800/30"
  }

  const cardContent = (
    <Card className="bg-card border border-border/50 dark:border-border/20 rounded-2xl shadow-none p-2 transition-colors duration-200 hover:border-border dark:hover:border-border/60">
      <div>
        <div className={`${getCorFundo(cor)} rounded-xl px-5 py-6 mb-4`}>
          <Badge variant="secondary" className="bg-background/80 text-foreground border-border/50 dark:border-border/30">
            {categoria}
          </Badge>
          <h3 className="text-xl font-semibold mt-3 text-foreground">{titulo}</h3>
          <div className="mt-1 text-sm text-muted-foreground flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Video className="h-4 w-4" /> {videos} vídeo{videos !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {duracao}
            </span>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-foreground">Progresso</span>
            <span className="text-muted-foreground">
              {status === "concluido" 
                ? `${videos}/${videos} vídeos · 100%`
                : status === "em-andamento"
                ? `${Math.ceil((progresso / 100) * videos)}/${videos} vídeos · ${progresso}%`
                : `0/${videos} vídeos · 0%`
              }
            </span>
          </div>
          <Progress value={progresso} className="h-2 rounded-full" />
          <div className="mt-3 flex items-center justify-between">
            {getStatusBadge(status)}
            {acaoHref && !href ? (
              <Button size="sm" variant={acaoVariant} asChild onClick={(e) => e.stopPropagation()}>
                <Link href={acaoHref}>
                  {acao}
                </Link>
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant={acaoVariant} 
                onClick={(e) => {
                  e.stopPropagation();
                  if (acaoHref && href) {
                    // Se o card tem href principal, navega programaticamente
                    window.open(acaoHref, '_blank');
                  }
                }}
              >
                {acao}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

  // Se houver href, envolve o card em um Link
  if (href) {
    return (
      <Link href={href} className="block" onClick={handleCourseView}>
        {cardContent}
      </Link>
    )
  }

  // Se não houver href, retorna apenas o card
  return (
    <div onClick={handleCourseView}>
      {cardContent}
    </div>
  )
} 