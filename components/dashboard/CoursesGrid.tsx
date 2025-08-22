import { memo } from 'react'
import { TrainingCard } from "@/components/TrainingCard"
import { Treinamento } from "@/lib/types/dashboard"

interface CoursesGridProps {
  treinamentos: Treinamento[]
}

export const CoursesGrid = memo(function CoursesGrid({ treinamentos }: CoursesGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {treinamentos.map((treinamento) => (
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
          acaoHref={treinamento.acaoHref || "/trilha/trajetoria-vibra"}
          href={treinamento.acaoHref || "/trilha/trajetoria-vibra"}
        />
      ))}
    </div>
  )
})
