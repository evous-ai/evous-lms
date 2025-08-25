import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { DashboardFilters as DashboardFiltersType } from "@/lib/types/dashboard"
import { useAnalytics } from "@/hooks/use-analytics"

interface DashboardFiltersProps {
  filters: DashboardFiltersType
  onFilterChange: (key: keyof DashboardFiltersType, value: string) => void
  onClearFilters: () => void
  statusOptions: string[]
  categoriaOptions: string[]
  loadingCategorias: boolean
  temFiltrosAtivos: boolean
}

export function DashboardFilters({
  filters,
  onFilterChange,
  onClearFilters,
  statusOptions,
  categoriaOptions,
  loadingCategorias,
  temFiltrosAtivos
}: DashboardFiltersProps) {
  const { trackFilterUsage } = useAnalytics()

  // Função para trackear mudanças de filtro
  const handleFilterChange = (key: keyof DashboardFiltersType, value: string) => {
    onFilterChange(key, value)
    
    // Trackear uso de filtros (exceto busca, que é feito no dashboard)
    if (key === 'categoria' && value) {
      trackFilterUsage('categoria', value)
    } else if (key === 'status' && value) {
      trackFilterUsage('status', value)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      {/* Campo de busca */}
      <div className="relative flex-1 sm:flex-none sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cursos..."
          value={filters.busca}
          onChange={(e) => handleFilterChange('busca', e.target.value)}
          className="pl-10 pr-4 bg-background border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Filtro de categoria */}
      <div className="w-full sm:w-48">
        <Combobox
          options={categoriaOptions.map(cat => ({ value: cat, label: cat }))}
          value={filters.categoria}
          onValueChange={(value) => handleFilterChange('categoria', value)}
          placeholder={loadingCategorias ? "Carregando categorias..." : "Categoria"}
          searchPlaceholder="Buscar categoria..."
          emptyText={loadingCategorias ? "Carregando..." : "Nenhuma categoria encontrada."}
        />
      </div>

      {/* Filtro de status */}
      <div className="w-full sm:w-48">
        <Combobox
          options={statusOptions.map(st => ({ value: st, label: st }))}
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
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
          onClick={onClearFilters}
          className="flex items-center gap-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  )
}
