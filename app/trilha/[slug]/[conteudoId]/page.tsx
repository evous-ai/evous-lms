export default async function ConteudoPage({ params }: { params: Promise<{ slug: string; conteudoId: string }> }) {
  await params; // Para evitar warning de variável não utilizada

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Aula 3 – Governança e Cultura</h1>
      <p className="text-muted-foreground mb-6">
        Curso: Trajetória Vibra • 12:30
      </p>
      
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* COLUNA ESQUERDA */}
        <div className="space-y-6">
          <div className="bg-white border rounded-2xl p-6 shadow-none">
            <h2 className="text-lg font-semibold mb-4">Player de Vídeo</h2>
            <div className="aspect-video bg-slate-200 flex items-center justify-center rounded-lg">
              <p className="text-slate-500">Player será implementado aqui</p>
            </div>
          </div>
          
          <div className="bg-white border rounded-2xl p-6 shadow-none">
            <h2 className="text-lg font-semibold mb-4">Transcrição</h2>
            <p className="text-sm text-muted-foreground">
              Transcrição da aula será exibida aqui...
            </p>
          </div>
        </div>
        
        {/* COLUNA DIREITA */}
        <div className="space-y-6">
          <div className="bg-white border rounded-2xl p-6 shadow-none">
            <h2 className="text-lg font-semibold mb-4">Comentários</h2>
            <p className="text-sm text-muted-foreground">
              Sistema de comentários será implementado aqui...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 