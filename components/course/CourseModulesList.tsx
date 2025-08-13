'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface Aula {
  id: string;
  titulo: string;
  duracao: string;
  status: 'concluida' | 'disponivel' | 'bloqueada' | 'nao_iniciada';
}

interface Modulo {
  id: string;
  titulo: string;
  resumo: string;
  aulas: Aula[];
}

interface CourseModulesListProps {
  modulos: Modulo[];
  onModuleToggle?: (moduleId: string) => void;
  expandedModules?: string[];
  className?: string;
}

export function CourseModulesList({ 
  modulos, 
  onModuleToggle,
  expandedModules: externalExpandedModules,
  className = ''
}: CourseModulesListProps) {
  // Estado interno para controle de módulos expandidos
  const [internalExpandedModules, setInternalExpandedModules] = useState<string[]>(['m1']);
  
  // Usa estado externo se fornecido, senão usa interno
  const expandedModules = externalExpandedModules || internalExpandedModules;

  const toggleModule = (moduleId: string) => {
    if (onModuleToggle) {
      onModuleToggle(moduleId);
    } else {
      setInternalExpandedModules(prev => 
        prev.includes(moduleId) 
          ? prev.filter(id => id !== moduleId)
          : [...prev, moduleId]
      );
    }
  };

  // Calcular duração total do módulo
  const getModuleDuration = (aulas: Aula[]) => {
    const totalSeconds = aulas.reduce((acc, aula) => {
      const [min, sec] = aula.duracao.split(':').map(Number);
      return acc + (min * 60 + sec);
    }, 0);
    return `${Math.floor(totalSeconds / 60)}min Total`;
  };

  // Calcular aulas concluídas
  const getCompletedCount = (aulas: Aula[]) => {
    const completed = aulas.filter(aula => aula.status === 'concluida').length;
    return `${completed}/${aulas.length}`;
  };

  // Função para obter o status em português
  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'disponivel':
        return 'Em Andamento';
      case 'nao_iniciada':
        return 'Não Iniciada';
      default:
        return 'Bloqueada';
    }
  };

  // Função para obter a variante do badge baseada no status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'default';
      case 'disponivel':
        return 'secondary';
      case 'nao_iniciada':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {modulos.map((modulo) => {
        const isExpanded = expandedModules.includes(modulo.id);
        const totalDuration = getModuleDuration(modulo.aulas);
        const completedCount = getCompletedCount(modulo.aulas);
        
        return (
          <div key={modulo.id}>
            {/* Card do módulo */}
            <div className="bg-white dark:bg-gray-900 border border-border/60 dark:border-border/40 rounded-lg dark:shadow-none transition-all duration-200 overflow-hidden">
              {/* Header do módulo - clicável para expandir/colapsar */}
              <button
                onClick={() => toggleModule(modulo.id)}
                className="w-full flex items-center justify-between py-4 px-4 bg-muted/30 dark:bg-gray-800/60 hover:bg-muted/50 dark:hover:bg-gray-800/80 transition-colors text-left border-b border-border/40 dark:border-gray-700/60"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-foreground">{modulo.titulo}</span>
                  <Badge variant="secondary" className="text-xs bg-background/80 dark:bg-gray-700/80 dark:text-gray-200">
                    {completedCount}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-medium">{totalDuration}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>
              
              {/* Lista de aulas do módulo - visível apenas quando expandido */}
              {isExpanded && (
                <div className="p-2 space-y-1">
                  {modulo.aulas.map((aula) => (
                    <Link
                      key={aula.id}
                      href="/trilha/trajetoria-vibra/aula-3-governanca-cultura"
                      className="flex items-center justify-between py-2.5 px-3 rounded-md transition-colors text-sm hover:bg-muted/40 dark:hover:bg-gray-800/60 block"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Status visual da aula */}
                        <div className="flex-shrink-0">
                          {aula.status === 'concluida' && (
                            <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          )}
                          {aula.status === 'disponivel' && (
                            <div className="w-4 h-4 bg-purple-100 dark:bg-purple-800/60 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
                            </div>
                          )}
                          {aula.status === 'nao_iniciada' && (
                            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                          )}
                        </div>
                        
                        {/* Título da aula */}
                        <span className="font-medium truncate">
                          {aula.titulo.replace(/^Aula \d+ – /, '')}
                        </span>
                      </div>
                      
                      {/* Duração e indicadores */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">{aula.duracao}</span>
                        <Badge variant={getStatusVariant(aula.status)} className="text-xs">
                          {getStatusText(aula.status)}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
} 