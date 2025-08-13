"use client"

import { LMSSidebar } from "@/components"
import { SidebarProvider } from "@/components/ui/sidebar"

export function LMSSidebarDemo() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen">
        <LMSSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">Demonstração do LMS Sidebar</h1>
          <p className="text-gray-600">
            Este é o novo sidebar otimizado para a plataforma LMS da Evous.
          </p>
          <div className="mt-8 space-y-4">
            <div className="p-4 border rounded-lg">
              <h2 className="font-semibold mb-2">Estrutura Implementada:</h2>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Início</strong> - Acesso rápido ao dashboard</li>
                <li><strong>Aprender</strong> - Minhas Trilhas e Biblioteca</li>
                <li><strong>Meu Progresso</strong> - Desempenho e Missões Ativas</li>
                <li><strong>Usuário</strong> - Perfil e configurações no footer</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h2 className="font-semibold mb-2">Características:</h2>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>✅ Sidebar colapsível com ícones</li>
                <li>✅ Logo dinâmico (claro/escuro)</li>
                <li>✅ Tooltips quando colapsado</li>
                <li>✅ Responsivo para mobile</li>
                <li>✅ Estrutura simplificada e intuitiva</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
} 