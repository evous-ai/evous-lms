import { Filter } from "lucide-react"

interface FilterResultsProps {
  filteredCount: number
  totalCount: number
  hasActiveFilters: boolean
}

export function FilterResults({ filteredCount, totalCount, hasActiveFilters }: FilterResultsProps) {
  if (!hasActiveFilters) return null

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Filter className="h-4 w-4" />
      <span>
        {filteredCount} de {totalCount} cursos encontrados
      </span>
    </div>
  )
}
