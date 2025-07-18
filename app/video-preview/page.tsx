"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/toggle-theme";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { AvatarModal } from "@/components/modals/avatar-modal";
import { SoundtrackModal } from "@/components/modals/soundtrack-modal";
import { LayoutModal } from "@/components/modals/layout-modal";
import { MediaUploadModal } from "@/components/modals/media-upload-modal";
import { AIGenerationModal } from "@/components/modals/ai-generation-modal";
import { VideoGenerationModal } from "@/components/modals/video-generation-modal";
import {
  ArrowLeft,
  UserPlus,
  Music,
  Layout,
  Trash2,
  Sparkles,
  Plus,
  Play,
  Upload,
  XCircle,
} from "lucide-react";

// Tipos para as cenas
interface SceneTexts {
  titulo: string;
  subtitulo?: string;
  item1?: string;
  item2?: string;
  item3?: string;
  item4?: string;
}

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: number;
  isAIGenerated?: boolean;
  aiPrompt?: string;
}

interface Scene {
  id: string;
  layout: "layout1" | "layout2" | "layout3" | "layout4" | "layout5";
  texts: SceneTexts;
  narration: string;
  assets: Asset[];
  avatar?: string;
  soundtrack?: string;
  selectedLayoutId?: string;
}

// Componente do formulário da cena
function SceneForm({ 
  scene, 
  onUpdateScene,
  onRemoveAsset,
  onMediaUpload,
  onAIGeneration,
  getMaxAssetsForLayout
}: { 
  scene: Scene; 
  onUpdateScene: (updatedScene: Scene) => void;
  onRemoveAsset: (assetId: string) => void;
  onMediaUpload: () => void;
  onAIGeneration: () => void;
  getMaxAssetsForLayout: (layout: string) => number;
}) {
  const updateTexts = (field: keyof SceneTexts, value: string) => {
    onUpdateScene({
      ...scene,
      texts: {
        ...scene.texts,
        [field]: value
      }
    });
  };

  const updateNarration = (value: string) => {
    onUpdateScene({
      ...scene,
      narration: value
    });
  };

  const renderLayoutFields = () => {
    switch (scene.layout) {
      case "layout1":
        return (
          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Avatar Central</h2>
            <Input 
              className="mb-2" 
              placeholder="Título principal" 
              value={scene.texts.titulo}
              onChange={(e) => updateTexts("titulo", e.target.value)}
            />
            <Input 
              placeholder="Subtítulo" 
              value={scene.texts.subtitulo || ""}
              onChange={(e) => updateTexts("subtitulo", e.target.value)}
            />
          </section>
        );

      case "layout2":
        return (
          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Avatar Lateral</h2>
            <Input 
              className="mb-2" 
              placeholder="Título principal" 
              value={scene.texts.titulo}
              onChange={(e) => updateTexts("titulo", e.target.value)}
            />
            <Input 
              placeholder="Subtítulo" 
              value={scene.texts.subtitulo || ""}
              onChange={(e) => updateTexts("subtitulo", e.target.value)}
            />
          </section>
        );

      case "layout3":
        return (
          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Avatar Apresentador</h2>
            <Input 
              className="mb-2" 
              placeholder="Título principal" 
              value={scene.texts.titulo}
              onChange={(e) => updateTexts("titulo", e.target.value)}
            />
            <Input 
              className="mb-2" 
              placeholder="Item 1" 
              value={scene.texts.item1 || ""}
              onChange={(e) => updateTexts("item1", e.target.value)}
            />
            <Input 
              className="mb-2" 
              placeholder="Item 2" 
              value={scene.texts.item2 || ""}
              onChange={(e) => updateTexts("item2", e.target.value)}
            />
            <Input 
              className="mb-2" 
              placeholder="Item 3" 
              value={scene.texts.item3 || ""}
              onChange={(e) => updateTexts("item3", e.target.value)}
            />
            <Input 
              placeholder="Item 4" 
              value={scene.texts.item4 || ""}
              onChange={(e) => updateTexts("item4", e.target.value)}
            />
          </section>
        );

      case "layout4":
        return (
          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Texto Central</h2>
            <Input 
              className="mb-2" 
              placeholder="Título principal" 
              value={scene.texts.titulo}
              onChange={(e) => updateTexts("titulo", e.target.value)}
            />
            <Input 
              placeholder="Subtítulo" 
              value={scene.texts.subtitulo || ""}
              onChange={(e) => updateTexts("subtitulo", e.target.value)}
            />
          </section>
        );

      case "layout5":
        return (
          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Lista de Itens</h2>
            <Input 
              className="mb-2" 
              placeholder="Título principal" 
              value={scene.texts.titulo}
              onChange={(e) => updateTexts("titulo", e.target.value)}
            />
            <Input 
              className="mb-2" 
              placeholder="Item 1" 
              value={scene.texts.item1 || ""}
              onChange={(e) => updateTexts("item1", e.target.value)}
            />
            <Input 
              className="mb-2" 
              placeholder="Item 2" 
              value={scene.texts.item2 || ""}
              onChange={(e) => updateTexts("item2", e.target.value)}
            />
            <Input 
              className="mb-2" 
              placeholder="Item 3" 
              value={scene.texts.item3 || ""}
              onChange={(e) => updateTexts("item3", e.target.value)}
            />
            <Input 
              placeholder="Item 4" 
              value={scene.texts.item4 || ""}
              onChange={(e) => updateTexts("item4", e.target.value)}
            />
          </section>
        );

      default:
        return (
          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Textos da tela</h2>
            <Input 
              className="mb-2" 
              placeholder="Título" 
              value={scene.texts.titulo}
              onChange={(e) => updateTexts("titulo", e.target.value)}
            />
            <Input 
              placeholder="Subtítulo" 
              value={scene.texts.subtitulo || ""}
              onChange={(e) => updateTexts("subtitulo", e.target.value)}
            />
          </section>
        );
    }
  };

  return (
    <div className="p-6 overflow-y-auto flex-1">
      {renderLayoutFields()}

      <section className="mb-6">
        <h2 className="text-sm font-semibold mb-2">Narração</h2>
        <textarea 
          rows={3} 
          placeholder="Texto da narração" 
          value={scene.narration}
          onChange={(e) => updateNarration(e.target.value)}
          className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
        />
      </section>

      <section>
        <h2 className="text-sm font-semibold mb-2">Ativos</h2>
        <div className="space-y-3">
          {/* Thumbnails dos ativos */}
          <div className="flex gap-2 flex-wrap">
            {scene.assets.map((asset) => (
              <div key={asset.id} className="relative group">
                <div className="w-20 h-20 bg-muted rounded-lg border border-border flex items-center justify-center overflow-hidden">
                  {asset.type === 'image' ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <span className="text-xs text-blue-600 font-medium text-center px-1">
                        {asset.name}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                      <span className="text-xs text-purple-600 font-medium text-center px-1">
                        {asset.name}
                      </span>
                    </div>
                  )}
                  {asset.isAIGenerated && (
                    <div className="absolute top-1 left-1">
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-primary-foreground">AI</span>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveAsset(asset.id)}
                >
                  <XCircle className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={onMediaUpload}
              disabled={scene.assets.length >= getMaxAssetsForLayout(scene.layout)}
            >
              <Upload className="w-4 h-4" /> Inserir mídia
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={onAIGeneration}
              disabled={scene.assets.length >= getMaxAssetsForLayout(scene.layout)}
            >
              <Sparkles className="w-4 h-4" /> Gerar com IA
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}



export default function VideoPreviewPage() {
  // Estado das cenas
  const [sceneList, setSceneList] = useState<Scene[]>([
    {
      id: "scene-1",
      layout: "layout1",
      texts: {
        titulo: "Você sabia?",
        subtitulo: "A IA pode automatizar até 40% do seu tempo de trabalho."
      },
      narration: "Você sabia que é possível ganhar mais tempo automatizando tarefas com inteligência artificial?",
      assets: [],
      avatar: "avatar-1"
    },
    {
      id: "scene-2",
      layout: "layout4",
      texts: {
        titulo: "Ganhe produtividade",
        subtitulo: "Automatize tarefas repetitivas e foque no que importa."
      },
      narration: "A automação permite que você reduza tarefas manuais e tenha mais tempo para decisões estratégicas.",
      assets: [{
        id: "grafico-performance",
        name: "Gráfico de Performance",
        type: "image",
        url: "/placeholder-graph.png",
        size: 1024000
      }]
    },
    {
      id: "scene-3",
      layout: "layout5",
      texts: {
        titulo: "Veja os benefícios da IA",
        item1: "Mais tempo livre",
        item2: "Menos erros",
        item3: "Resultados mais rápidos",
        item4: "Relatórios automáticos"
      },
      narration: "Conheça os quatro principais benefícios da inteligência artificial aplicada ao seu dia a dia.",
      assets: [
        {
          id: "icone-beneficio-1",
          name: "Ícone Tempo",
          type: "image",
          url: "/placeholder-time.png",
          size: 512000
        },
        {
          id: "icone-beneficio-2",
          name: "Ícone Resultados",
          type: "image",
          url: "/placeholder-results.png",
          size: 512000
        }
      ]
    },
    {
      id: "scene-4",
      layout: "layout2",
      texts: {
        titulo: "Comece hoje mesmo",
        subtitulo: "Descubra como a IA pode transformar sua rotina. Teste gratuitamente."
      },
      narration: "Descubra como a IA pode transformar sua rotina. Teste gratuitamente.",
      assets: [],
      avatar: "avatar-2"
    }
  ]);

  // Cena selecionada
  const [selectedSceneId, setSelectedSceneId] = useState("scene-1");

  // Estados dos modais

  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [isAIGenerationModalOpen, setIsAIGenerationModalOpen] = useState(false);
  const [isVideoGenerationModalOpen, setIsVideoGenerationModalOpen] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);

  const [videoTitle, setVideoTitle] = useState("Uma historinha colorida que ensina");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Encontrar a cena selecionada
  const selectedScene = sceneList.find(scene => scene.id === selectedSceneId) || sceneList[0];

  // Encontrar o índice da cena selecionada


  // Função para adicionar nova cena
  const addNewScene = () => {
    const newSceneNumber = sceneList.length + 1;
    const lastScene = sceneList[sceneList.length - 1];
    
    // Usar o mesmo layout da última cena, mas com campos vazios
    const newScene: Scene = {
      id: `scene-${newSceneNumber}`,
      layout: lastScene.layout,
      texts: {
        titulo: "",
        subtitulo: "",
        item1: "",
        item2: "",
        item3: "",
        item4: ""
      },
      narration: "",
      assets: [],
      avatar: lastScene.avatar,
      soundtrack: lastScene.soundtrack,
      selectedLayoutId: lastScene.selectedLayoutId
    };

    setSceneList(prev => [...prev, newScene]);
    setSelectedSceneId(newScene.id);
  };

  // Função para excluir cena
  const deleteScene = (sceneId: string) => {
    if (sceneList.length <= 1) return; // Não permite excluir a última cena

    const sceneIndex = sceneList.findIndex(scene => scene.id === sceneId);
    const newSceneList = sceneList.filter(scene => scene.id !== sceneId);
    
    setSceneList(newSceneList);

    // Se a cena excluída era a selecionada, seleciona a anterior ou a próxima
    if (sceneId === selectedSceneId) {
      if (sceneIndex > 0) {
        // Seleciona a cena anterior
        setSelectedSceneId(newSceneList[sceneIndex - 1].id);
      } else {
        // Seleciona a próxima cena (primeira da nova lista)
        setSelectedSceneId(newSceneList[0].id);
      }
    }
  };



  // Atualizar uma cena específica
  const updateScene = (updatedScene: Scene) => {
    setSceneList(prev => 
      prev.map(scene => 
        scene.id === updatedScene.id ? updatedScene : scene
      )
    );
  };

  // Funções para gerenciar seleções dos modais
  const handleAvatarSelect = (avatarId: string) => {
    updateScene({
      ...selectedScene,
      avatar: avatarId
    });
  };

  const handleSoundtrackSelect = (soundtrackId: string) => {
    updateScene({
      ...selectedScene,
      soundtrack: soundtrackId
    });
  };

  const handleLayoutSelect = (layoutId: string, layoutType: string) => {
    // Resetar campos de texto baseado no novo layout
    let newTexts: SceneTexts = { titulo: "" };
    
    if (layoutType === "layout1" || layoutType === "layout2") {
      newTexts = { titulo: "", subtitulo: "" };
    } else if (layoutType === "layout3") {
      newTexts = { titulo: "", item1: "", item2: "", item3: "", item4: "" };
    } else if (layoutType === "layout4") {
      newTexts = { titulo: "", subtitulo: "" };
    } else if (layoutType === "layout5") {
      newTexts = { titulo: "", item1: "", item2: "", item3: "", item4: "" };
    }

    updateScene({
      ...selectedScene,
      layout: layoutType as "layout1" | "layout2" | "layout3" | "layout4" | "layout5",
      texts: newTexts,
      selectedLayoutId: layoutId
    });
  };

  // Função para obter o número máximo de assets por layout
  const getMaxAssetsForLayout = (layout: string): number => {
    switch (layout) {
      case "layout1":
      case "layout2":
      case "layout3":
        return 1; // Layouts com avatar permitem apenas 1 ativo
      case "layout4":
      case "layout5":
        return 2; // Layouts de texto permitem até 2 ativos
      default:
        return 1;
    }
  };

  // Função para remover um asset
  const handleRemoveAsset = (assetId: string) => {
    updateScene({
      ...selectedScene,
      assets: selectedScene.assets.filter(asset => asset.id !== assetId)
    });
  };

  // Função para adicionar um asset via upload
  const handleMediaUpload = (file: File) => {
    const assetId = `asset-${Date.now()}`;
    const newAsset: Asset = {
      id: assetId,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      url: URL.createObjectURL(file),
      size: file.size
    };

    updateScene({
      ...selectedScene,
      assets: [...selectedScene.assets, newAsset]
    });
  };

  // Função para gerar asset com IA
  const handleAIGeneration = (prompt: string) => {
    const assetId = `ai-asset-${Date.now()}`;
    const newAsset: Asset = {
      id: assetId,
      name: `Imagem gerada por IA`,
      type: 'image',
      url: '/placeholder-ai-generated.png', // Placeholder para imagem gerada
      size: 1024000,
      isAIGenerated: true,
      aiPrompt: prompt
    };

    updateScene({
      ...selectedScene,
      assets: [...selectedScene.assets, newAsset]
    });
  };

  // Função para confirmar geração de vídeo
  const handleVideoGenerationConfirm = () => {
    setIsVideoGenerating(true);
    setIsVideoGenerationModalOpen(false);
    
    // Simular geração de vídeo
    setTimeout(() => {
      setIsVideoGenerating(false);
      window.location.href = '/video-success';
    }, 3000);
  };



  // Função para obter o nome da cena para exibição
  const getSceneDisplayName = (scene: Scene, index: number) => {
    return `Cena ${index + 1}`;
  };

  // Função para editar o título do vídeo
  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = (newTitle: string) => {
    setVideoTitle(newTitle);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
  };

  // Opções para o Combobox de seleção de cenas
  const sceneOptions = sceneList.map((scene, index) => ({
    value: scene.id,
    label: getSceneDisplayName(scene, index)
  }));

  // Componente para renderizar thumbnail da timeline
  const renderTimelineThumbnail = (scene: Scene) => {
    switch (scene.layout) {
      case "layout1":
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded flex flex-col items-center justify-center p-1">
            <div className="w-4 h-4 bg-blue-300 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold mb-1">
              A
            </div>
            <div className="w-6 h-0.5 bg-blue-300 rounded"></div>
          </div>
        );

      case "layout2":
        return (
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded flex items-center gap-1 p-1">
            <div className="w-4 h-4 bg-green-300 rounded-full flex items-center justify-center text-green-600 text-xs font-bold">
              A
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="w-full h-0.5 bg-green-300 rounded"></div>
              <div className="w-2/3 h-0.5 bg-green-300 rounded"></div>
            </div>
          </div>
        );

      case "layout3":
        return (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded flex flex-col items-center justify-center p-1">
            <div className="w-5 h-5 bg-purple-300 rounded-full flex items-center justify-center text-purple-600 text-xs font-bold mb-1">
              A
            </div>
            <div className="space-y-0.5">
              <div className="w-4 h-0.5 bg-purple-300 rounded"></div>
              <div className="w-3 h-0.5 bg-purple-300 rounded"></div>
            </div>
          </div>
        );

      case "layout4":
        return (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded flex flex-col items-center justify-center gap-0.5 p-1">
            <div className="w-8 h-0.5 bg-orange-300 rounded"></div>
            <div className="w-5 h-0.5 bg-orange-300 rounded"></div>
          </div>
        );

      case "layout5":
        return (
          <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 rounded flex flex-col justify-center gap-0.5 p-1">
            <div className="flex items-center gap-1">
              <div className="w-0.5 h-0.5 bg-red-400 rounded-full"></div>
              <div className="w-5 h-0.5 bg-red-300 rounded"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-0.5 h-0.5 bg-red-400 rounded-full"></div>
              <div className="w-4 h-0.5 bg-red-300 rounded"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-0.5 h-0.5 bg-red-400 rounded-full"></div>
              <div className="w-6 h-0.5 bg-red-300 rounded"></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-muted rounded flex items-center justify-center">
            <div className="w-6 h-1 bg-muted-foreground/30 rounded"></div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Topo: Header com título e botões */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-card shadow-sm">
        <div className="flex items-center gap-2">
          <img 
            src="/evous_logo_box.svg" 
            alt="Evous Logo" 
            className="h-8 w-auto"
            width={32}
            height={32}
            loading="eager"
          />
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                onBlur={() => handleTitleSave(videoTitle)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleSave(videoTitle);
                  } else if (e.key === 'Escape') {
                    handleTitleCancel();
                  }
                }}
                className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1"
                autoFocus
              />
            </div>
          ) : (
            <div 
              className="text-xl font-semibold cursor-pointer hover:text-primary/80 transition-colors px-2 py-1 rounded"
              onClick={handleTitleEdit}
            >
              {videoTitle}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsVideoGenerationModalOpen(true)}
          >
            <Sparkles className="w-4 h-4" /> Gerar vídeo
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <ModeToggle />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4 bg-muted/30">
        {/* Painel esquerdo */}
        <aside className="w-[350px] bg-card border border-border rounded-xl shadow-sm overflow-hidden flex-shrink-0 flex flex-col">
          <div className="bg-muted px-6 py-3 rounded-t-xl flex items-center justify-between flex-shrink-0">
            <div className="flex-1">
              <Combobox
                options={sceneOptions}
                value={selectedSceneId}
                onValueChange={setSelectedSceneId}
                placeholder="Selecionar cena..."
                searchPlaceholder="Buscar cena..."
                emptyText="Nenhuma cena encontrada."
              />
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground h-8 w-8"
                onClick={() => deleteScene(selectedScene.id)}
                disabled={sceneList.length <= 1}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <SceneForm 
            scene={selectedScene} 
            onUpdateScene={updateScene}
            onRemoveAsset={handleRemoveAsset}
            onMediaUpload={() => setIsMediaUploadModalOpen(true)}
            onAIGeneration={() => setIsAIGenerationModalOpen(true)}
            getMaxAssetsForLayout={getMaxAssetsForLayout}
          />
        </aside>

        {/* Área central com controles da cena, visualização e timeline */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Controles da cena com Navigation Menu */}
          <div className="flex gap-2 justify-end flex-shrink-0">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Avatar
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <AvatarModal
                      selectedAvatar={selectedScene.avatar}
                      onSelectAvatar={handleAvatarSelect}
                      onClose={() => {}}
                    />
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2">
                    <Music className="w-4 h-4" /> Trilha sonora
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <SoundtrackModal
                      selectedSoundtrack={selectedScene.soundtrack}
                      onSelectSoundtrack={handleSoundtrackSelect}
                      onClose={() => {}}
                    />
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2">
                    <Layout className="w-4 h-4" /> Mudar layout
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <LayoutModal
                      selectedLayout={selectedScene.selectedLayoutId || "layout-avatar-1"}
                      onSelectLayout={handleLayoutSelect}
                      onClose={() => {}}
                    />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Visualização da cena */}
          <section className="flex-1 flex justify-center items-center min-h-[400px] max-h-[500px]">
            <div className="bg-muted/20 border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 text-center max-w-md">
              <div className="text-muted-foreground text-lg font-medium mb-2">
                Área de Preview da Cena
              </div>
              <div className="text-muted-foreground/70 text-sm">
                Componente temporariamente removido para reconstrução
              </div>
            </div>
          </section>

          {/* Timeline com thumbnails - colada na parte inferior */}
          <footer className="bg-card border border-border rounded-xl px-6 py-4 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full p-2"
                  disabled
                >
                  <Play className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex gap-4 overflow-x-auto flex-1 min-w-0 max-w-full">
                {sceneList.map((scene, index) => (
                  <div 
                    key={scene.id}
                    className={`group relative w-32 h-20 bg-muted rounded-lg border border-border shadow-sm cursor-pointer transition-colors overflow-hidden flex-shrink-0 ${
                      selectedSceneId === scene.id 
                        ? 'border-primary bg-primary/10' 
                        : 'hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedSceneId(scene.id)}
                  >
                    {/* Thumbnail do layout */}
                    <div className="w-full h-full">
                      {renderTimelineThumbnail(scene)}
                    </div>
                    
                    {/* Badge no canto inferior esquerdo */}
                    <div className="absolute bottom-1 left-1">
                      <Badge variant="secondary" className="text-xs bg-white/80 backdrop-blur-sm">
                        Cena {index + 1}
                      </Badge>
                    </div>
                    
                    {/* Botão de excluir - visível apenas no hover */}
                    {sceneList.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteScene(scene.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-32 h-20 border-dashed border-2 rounded-lg text-xs flex items-center justify-center shadow-sm gap-2 flex-shrink-0"
                  onClick={addNewScene}
                >
                  <Plus className="w-4 h-4" /> Adicionar cena
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Modais */}
      {isMediaUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <MediaUploadModal
            onUpload={handleMediaUpload}
            onClose={() => setIsMediaUploadModalOpen(false)}
            maxAssets={getMaxAssetsForLayout(selectedScene.layout)}
            currentAssetsCount={selectedScene.assets.length}
          />
        </div>
      )}

      {isAIGenerationModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <AIGenerationModal
            onGenerate={handleAIGeneration}
            onClose={() => setIsAIGenerationModalOpen(false)}
            maxAssets={getMaxAssetsForLayout(selectedScene.layout)}
            currentAssetsCount={selectedScene.assets.length}
          />
        </div>
      )}

      {isVideoGenerationModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <VideoGenerationModal
            onConfirm={handleVideoGenerationConfirm}
            onClose={() => setIsVideoGenerationModalOpen(false)}
            isGenerating={isVideoGenerating}
          />
        </div>
      )}
    </div>
  );
} 