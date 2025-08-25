import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NoResultsMessageProps {
  hasCourses: boolean
  onClearFilters: () => void
}

export function NoResultsMessage({ hasCourses, onClearFilters }: NoResultsMessageProps) {
  return (
    <div className="text-center py-12">
      <div className="text-muted-foreground mb-4">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium text-foreground">Nenhum curso encontrado</p>
        <p className="text-sm">
          {hasCourses 
            ? "Tente ajustar os filtros ou a busca"
            : "Não há cursos disponíveis no momento. Entre em contato com o administrador."
          }
        </p>
      </div>
      {hasCourses && (
        <Button 
          variant="outline" 
          onClick={onClearFilters} 
          className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
