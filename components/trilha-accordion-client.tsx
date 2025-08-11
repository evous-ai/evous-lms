'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle, Clock } from 'lucide-react';

interface Aula {
  id: string;
  titulo: string;
  duracao: string;
  status: 'concluida' | 'disponivel' | 'bloqueada';
}

interface Modulo {
  id: string;
  titulo: string;
  resumo: string;
  aulas: Aula[];
}

interface TrilhaAccordionClientProps {
  modulos: Modulo[];
}

export function TrilhaAccordionClient({ modulos }: TrilhaAccordionClientProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const fecharTodos = () => setOpenItems([]);
  const abrirTodos = () => setOpenItems(modulos.map(m => m.id));

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'concluida':
        return { label: 'Concluída', variant: 'default', icon: CheckCircle, color: 'text-green-600' };
      case 'disponivel':
        return { label: 'Em andamento', variant: 'secondary', icon: Clock, color: 'text-blue-600' };
      case 'bloqueada':
        return { label: 'Bloqueada', variant: 'outline', icon: Lock, color: 'text-gray-500' };
      default:
        return { label: 'Não iniciado', variant: 'outline', icon: Clock, color: 'text-gray-500' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">2 módulos · 8 vídeos · 2h30min de duração total</span>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={abrirTodos}>
            Abrir todos
          </Button>
          <Button variant="outline" size="sm" onClick={fecharTodos}>
            Fechar todos os módulos
          </Button>
        </div>
      </div>

      <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
        {modulos.map((modulo) => (
          <AccordionItem key={modulo.id} value={modulo.id} className="bg-white border rounded-2xl shadow-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex justify-between items-center w-full pr-4">
                <span className="font-semibold text-left">{modulo.titulo}</span>
                <span className="text-sm text-gray-500">{modulo.resumo}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-4 space-y-2">
                {modulo.aulas.map((aula) => {
                  const statusInfo = getStatusInfo(aula.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div
                      key={aula.id}
                      className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{aula.titulo}</h4>
                          <p className="text-xs text-gray-500">{aula.duracao}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge variant={statusInfo.variant as "default" | "secondary" | "outline"} className="text-xs">
                          {statusInfo.label}
                        </Badge>
                        
                        {(aula.status === 'disponivel' || aula.status === 'concluida') && (
                          <Button
                            size="sm"
                            className="bg-emerald-700 hover:bg-emerald-800 text-white"
                            asChild
                          >
                            <Link href={`/trilha/trajetoria-vibra/${aula.id}`}>
                              Assistir
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
} 