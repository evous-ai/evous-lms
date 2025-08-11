export default async function TrilhaPage({ params }: { params: Promise<{ slug: string }> }) {
  await params // Para compatibilidade com Next.js 15

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Trajetória Vibra</h1>
      <p className="text-muted-foreground text-lg mb-6">
        A história e evolução da Vibra no mercado brasileiro
      </p>
      
      <div className="bg-white border rounded-2xl p-6 shadow-none">
        <h2 className="text-xl font-semibold mb-4">Módulos do Curso</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">Fundação e História</h3>
            <p className="text-sm text-muted-foreground">Conheça as origens da Vibra</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">Evolução e Inovação</h3>
            <p className="text-sm text-muted-foreground">Descubra como a Vibra se reinventou</p>
          </div>
        </div>
      </div>
    </div>
  )
} 