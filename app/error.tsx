"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Algo deu errado!</h1>
          <p className="text-gray-600">
            Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Tentar novamente
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="flex-1">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Início
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 