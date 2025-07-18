import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  UserPlus,
  Music,
  Layout,
  Trash2,
  ChevronDown,
  Play,
  Plus,
} from "lucide-react";

export default function VideoPreviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb]">
      {/* Topo: Header com título e botões */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="mr-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-xl font-semibold cursor-pointer">
            Uma historinha colorida que ensina
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Avatar
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Music className="w-4 h-4" /> Trilha sonora
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Layout className="w-4 h-4" /> Mudar layout
          </Button>
          <Button className="flex items-center gap-2">
            <Play className="w-4 h-4" /> Gerar vídeo
          </Button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Painel esquerdo */}
        <aside className="w-[350px] bg-white border border-muted rounded-xl shadow-sm overflow-hidden flex-shrink-0">
          <div className="bg-[#ecf1f6] px-6 py-3 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-lg font-medium">Cena 1</span>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-6">
            <section className="mb-6">
              <h2 className="text-sm font-semibold mb-2">Textos da tela</h2>
              <Input className="mb-2" placeholder="Título" />
              <Input placeholder="Subtítulo" />
            </section>

            <section className="mb-6">
              <h2 className="text-sm font-semibold mb-2">Narração</h2>
              <textarea rows={3} placeholder="Texto da narração" className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </section>

            <section>
              <h2 className="text-sm font-semibold mb-2">Ativos</h2>
              <div className="flex gap-2 mb-2">
                <div className="w-20 h-20 bg-muted rounded-lg border" />
                <div className="w-20 h-20 bg-muted rounded-lg border" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Inserir mídia
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Gerar com IA
                </Button>
              </div>
            </section>
          </div>
        </aside>

        {/* Visualização da cena */}
        <section className="flex-1 flex justify-center items-center bg-[#121212] rounded-xl shadow-sm p-4">
          <div className="w-[80%] h-[70%] bg-zinc-900 rounded-xl flex flex-col justify-center items-center p-6">
            <div className="text-2xl font-bold text-white mb-2">Nome do Produto</div>
            <div className="text-base text-muted-foreground">Descrição curta do produto</div>
          </div>
        </section>
      </main>

      {/* Rodapé: timeline com thumbnails */}
      <footer className="bg-white border-t px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full p-2">
            <Play className="w-5 h-5" />
          </Button>
          <div className="flex gap-4 overflow-x-auto">
            <div className="w-32 h-20 bg-muted rounded-lg border flex items-center justify-center text-xs shadow-sm">Cena 1</div>
            <div className="w-32 h-20 bg-muted rounded-lg border flex items-center justify-center text-xs shadow-sm">Cena 2</div>
            <div className="w-32 h-20 bg-muted rounded-lg border flex items-center justify-center text-xs shadow-sm">Cena 3</div>
            <Button variant="outline" className="w-32 h-20 border-dashed border-2 rounded-lg text-xs flex items-center justify-center shadow-sm gap-2">
              <Plus className="w-4 h-4" /> Adicionar cena
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
} 