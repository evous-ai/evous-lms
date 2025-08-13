"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Play } from 'lucide-react';

export default function TrilhaPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Trajetória Vibra</h1>
        <p className="text-muted-foreground text-lg mb-6">
          A história e evolução da Vibra no mercado brasileiro
        </p>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Módulos do Curso</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
              <h3 className="font-medium">Fundação e História</h3>
              <p className="text-sm text-muted-foreground mb-3">Conheça as origens da Vibra</p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/trilha/trajetoria-vibra" className="flex items-center gap-2">
                  Ver módulo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
              <h3 className="font-medium">Evolução e Inovação</h3>
              <p className="text-sm text-muted-foreground mb-3">Descubra como a Vibra se reinventou</p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/trilha/trajetoria-vibra" className="flex items-center gap-2">
                  Ver módulo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3" asChild>
            <Link href="/trilha/trajetoria-vibra" className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Começar curso
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 