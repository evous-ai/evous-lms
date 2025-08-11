export default function DashboardGestor() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard do Gestor</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Bem-vindo ao painel de controle do gestor
        </p>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Funcionalidades do Gestor</h2>
          <ul className="text-left space-y-2">
            <li>• Gerenciamento de usuários</li>
            <li>• Relatórios avançados</li>
            <li>• Configurações do sistema</li>
            <li>• Monitoramento de atividades</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 