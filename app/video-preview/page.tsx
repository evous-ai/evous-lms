"use client"

import { useState, useReducer } from "react";
import { Button } from "@/components/ui/button";
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
import { Avatar as ShadcnAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LayoutThumbnail from "@/components/layout-thumbnail";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Image from "next/image";

// ESTRUTURA DE TEMPLATES DE LAYOUT
const LAYOUT_TEMPLATES = [
  {
    category: 'Abertura',
    layouts: [
      {
        id: 'abertura',
        name: 'Abertura',
        textFields: ['titulo', 'descricao'],
        assetFields: ['logo', 'frameImage'],
        description: 'Lado esquerdo inferior: título, abaixo: descrição, canto superior esquerdo: logo, lado direito: frame decorativo.'
      }
    ]
  },
  {
    category: 'Avatar protagonista',
    layouts: [
      {
        id: 'avatar-central',
        name: 'Avatar Central',
        textFields: [],
        assetFields: ['avatarImage'],
        description: 'Avatar centralizado, sem textos.'
      },
      {
        id: 'avatar-lateral',
        name: 'Avatar Lateral',
        textFields: ['titulo', 'subtitulo'],
        assetFields: ['avatarImage'],
        description: 'Avatar à esquerda, textos à direita.'
      },
      {
        id: 'avatar-apresentador',
        name: 'Avatar Apresentador',
        textFields: ['titulo', 'subtitulo'],
        assetFields: ['avatarImage'],
        description: 'Avatar como apresentador, textos à direita.'
      }
    ]
  },
  {
    category: 'Texto protagonista',
    layouts: [
      {
        id: 'texto-central',
        name: 'Texto Central',
        textFields: ['titulo', 'subtitulo'],
        assetFields: [],
        description: 'Texto centralizado em destaque.'
      },
      {
        id: 'lista-itens',
        name: 'Lista de Itens',
        textFields: ['titulo', 'item1', 'item2', 'item3', 'item4'],
        assetFields: [],
        description: 'Título no topo, lista de até 4 itens.'
      }
    ]
  },
  {
    category: 'Fechamento',
    layouts: [
      {
        id: 'fechamento',
        name: 'Fechamento',
        textFields: [],
        assetFields: ['logo'],
        description: 'Logo centralizado, sem texto.'
      }
    ]
  }
];

// INTERFACES
interface SceneTexts {
  titulo?: string;
  descricao?: string;
  subtitulo?: string;
  item1?: string;
  item2?: string;
  item3?: string;
  item4?: string;
  narracao?: string;
}

interface Asset {
  id: string; // Deve corresponder ao 'assetField' do layout (ex: 'logo', 'avatarImage')
  type: 'image' | 'logo' | 'avatar' | 'frameImage';
  url: string;
  name?: string;
}

interface Scene {
  id: string;
  layoutId: string;
  texts: SceneTexts;
  assets: Asset[];
}

// FUNÇÕES UTILITÁRIAS
function getLayoutTemplate(layoutId: string) {
  for (const cat of LAYOUT_TEMPLATES) {
    for (const layout of cat.layouts) {
      if (layout.id === layoutId) return layout;
    }
  }
  return null;
}

/**
 * CORRIGIDO: Simplificado para encontrar um ativo pelo seu ID, que deve corresponder ao 'field' do layout.
 * Esta abordagem é mais robusta do que procurar por 'type'.
 */
function getAssetByField(scene: Scene, field: string): Asset | undefined {
  return scene.assets.find(a => a.id === field);
}

// COMPONENTES DINÂMICOS
function DynamicSceneForm({ scene, onUpdateScene, onMediaUpload, onAIGeneration, onRemoveAsset }: {
  scene: Scene;
  onUpdateScene: (updatedScene: Scene) => void;
  onMediaUpload: (field: string) => void;
  onAIGeneration: (field: string) => void;
  onRemoveAsset: (field: string) => void;
}) {
  const layoutTemplate = getLayoutTemplate(scene.layoutId);
  if (!layoutTemplate) return null;

  const handleInput = (field: keyof SceneTexts, value: string) => {
    onUpdateScene({
      ...scene,
      texts: { ...scene.texts, [field]: value }
    });
  };

  const assetSlots = layoutTemplate.assetFields.map(field => getAssetByField(scene, field));
  const showAtivos = layoutTemplate.assetFields.length > 0;
  const showTextos = layoutTemplate.textFields.length > 0;

  return (
    <div className="p-6 overflow-y-auto flex-1 space-y-8">
      {/* Textos da tela */}
      {showTextos && (
        <section>
          <h2 className="text-sm font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Textos da tela</h2>
          <div className="space-y-4">
            {layoutTemplate.textFields.map(field => (
              <div key={field}>
                <label className="text-sm font-semibold mb-2 block capitalize">{field}</label>
                <input
                  className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={scene.texts[field as keyof SceneTexts] || ''}
                  onChange={e => handleInput(field as keyof SceneTexts, e.target.value)}
                  placeholder={`Digite o ${field}...`}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Narração */}
      <section>
        <h2 className="text-sm font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Narração</h2>
        <textarea
          rows={3}
          placeholder="Texto da narração"
          value={scene.texts['narracao'] || ''}
          onChange={e => handleInput('narracao', e.target.value)}
          className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </section>

      {/* Ativos */}
      {showAtivos && (
        <section>
          <h2 className="text-sm font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Ativos</h2>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {layoutTemplate.assetFields.map((field, idx) => {
                const asset = assetSlots[idx];
                return (
                  <div key={field} className="relative group cursor-pointer w-20 h-20">
                    {asset?.url ? (
                      <div className="w-20 h-20 bg-muted rounded-lg border border-border flex items-center justify-center overflow-hidden">
                        <Image src={asset.url} alt={asset.name || asset.type} width={80} height={80} className="object-contain w-full h-full" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onRemoveAsset(field)}
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="w-20 h-20 bg-muted rounded-lg border border-dashed border-border flex flex-col items-center justify-center overflow-hidden relative text-center"
                        onClick={() => onMediaUpload(field)}
                      >
                        <Upload className="w-4 h-4 text-muted-foreground mb-1"/>
                        <span className="text-xs text-muted-foreground capitalize">{field}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => onMediaUpload(layoutTemplate.assetFields[0])}
              >
                <Upload className="w-4 h-4" /> Inserir mídia
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => onAIGeneration(layoutTemplate.assetFields[0])}
              >
                <Sparkles className="w-4 h-4" /> Gerar com IA
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function DynamicScenePreview({ scene }: { scene: Scene }) {
  const layoutTemplate = getLayoutTemplate(scene.layoutId);
  if (!layoutTemplate) return null;

  const avatar = getAssetByField(scene, 'avatarImage');
  const logo = getAssetByField(scene, 'logo');
  const frameImage = getAssetByField(scene, 'frameImage');

  switch (scene.layoutId) {
    case 'abertura':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl overflow-hidden">
          {logo && (
            <Image
              src={logo.url}
              alt="Logo"
              width={96}
              height={96}
              className="absolute top-10 left-10 w-24 h-24 object-contain"
            />
          )}
          {frameImage && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center">
              <Image
                src={frameImage.url}
                alt="Frame decorativo"
                width={192}
                height={192}
                className="w-48 h-48 object-cover rounded-full shadow-lg"
              />
            </div>
          )}
          <div className="flex flex-col items-center justify-center h-full w-1/2 text-left absolute left-10">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4 w-full">
                {scene.texts.titulo || 'Título de abertura'}
              </h1>
              <p className="text-2xl text-slate-600 dark:text-slate-400 w-full">
                {scene.texts.descricao || 'Descrição da abertura...'}
              </p>
          </div>
        </div>
      );
    case 'avatar-central':
      return (
        <div className="relative w-full h-full flex items-center justify-center aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl">
          {avatar && (
            <Image
              src={avatar.url}
              alt="Avatar"
              width={200}
              height={200}
              className="w-52 h-52 object-contain rounded-full shadow-xl bg-white"
            />
          )}
        </div>
      );
    case 'avatar-lateral':
      return (
        <div className="w-full h-full flex items-center p-8 gap-8 aspect-video bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800 rounded-xl">
          {avatar && (
            <Image
              src={avatar.url}
              alt="Avatar"
              width={160}
              height={160}
              className="w-40 h-40 object-contain rounded-full shadow-xl bg-white"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">{scene.texts.titulo || 'Título'}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">{scene.texts.subtitulo || 'Subtítulo...'}</p>
          </div>
        </div>
      );
    case 'avatar-apresentador':
        return (
          <div className="w-full h-full flex items-end p-8 gap-8 aspect-video bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl">
            {avatar && (
              <Image
                src={avatar.url}
                alt="Avatar"
                width={180}
                height={180}
                className="w-44 h-auto object-contain"
              />
            )}
            <div className="flex-1 mb-8">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">{scene.texts.titulo || 'Título'}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">{scene.texts.subtitulo || 'Subtítulo...'}</p>
            </div>
          </div>
        );
    case 'texto-central':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-6 leading-tight">{scene.texts.titulo || 'Título'}</h1>
          <p className="text-2xl text-slate-600 dark:text-slate-400 leading-relaxed">{scene.texts.subtitulo || 'Subtítulo...'}</p>
        </div>
      );
    case 'lista-itens':
      return (
        <div className="w-full h-full flex flex-col p-8 aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{scene.texts.titulo || 'Título'}</h1>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow-md">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-lg font-medium text-slate-800 dark:text-slate-200">
                  {scene.texts[`item${i}` as keyof SceneTexts] || `Item ${i}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'fechamento':
      return (
        <div className="w-full h-full flex items-center justify-center aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl">
          {logo && <Image src={logo.url} alt="Logo" width={192} height={192} className="w-48 h-48 object-contain" />}
        </div>
      );
    default:
      return <div className="w-full h-full flex items-center justify-center aspect-video bg-muted rounded-xl">Layout não encontrado</div>;
  }
}

// DADOS GLOBAIS E ESTADO PRINCIPAL
const AVATARS = [
  { name: 'João Silva', url: '/avatar_default.png' },
  { name: 'Maria Santos', url: '/avatar_default_003.png' },
  { name: 'Carlos Oliveira', url: '/avatar_default_002.png' },
];

export default function VideoPreviewPage() {
  const initialScenes: Scene[] = [
    {
      id: "scene-1",
      layoutId: "abertura",
      texts: {
        titulo: "Você sabia?",
        descricao: "A IA pode automatizar até 40% do seu tempo de trabalho."
      },
      assets: [{ id: 'logo', type: 'logo', url: '/evous_logo_box.svg', name: 'Logo' }]
    },
    {
      id: "scene-2",
      layoutId: "avatar-central",
      texts: {},
      // CORRIGIDO: O 'id' do asset deve corresponder ao 'assetField' ('avatarImage') para a remoção funcionar.
      assets: [{ id: 'avatarImage', type: 'avatar', url: '/avatar_default.png', name: 'Avatar padrão' }]
    },
    {
      id: "scene-3",
      layoutId: "lista-itens",
      texts: {
        titulo: "Veja os benefícios da IA",
        item1: "Mais tempo livre",
        item2: "Menos erros",
        item3: "Resultados mais rápidos",
        item4: "Relatórios automáticos"
      },
      assets: []
    },
    {
      id: "scene-4",
      layoutId: "fechamento",
      texts: {},
      assets: [{ id: 'logo', type: 'logo', url: '/evous_logo_box.svg', name: 'Logo' }]
    }
  ];

  const [sceneList, setSceneList] = useState<Scene[]>(initialScenes);
  const [selectedSceneId, setSelectedSceneId] = useState("scene-1");
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [isAIGenerationModalOpen, setIsAIGenerationModalOpen] = useState(false);
  const [isVideoGenerationModalOpen, setIsVideoGenerationModalOpen] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [isLayoutChangeModalOpen, setIsLayoutChangeModalOpen] = useState(false);
  const [pendingLayoutChange, setPendingLayoutChange] = useState<{ layoutId: string } | null>(null);
  const [activeAssetField, setActiveAssetField] = useState<string | null>(null);

  const [videoTitle, setVideoTitle] = useState("Uma historinha colorida que ensina");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const selectedScene = sceneList.find(scene => scene.id === selectedSceneId) || sceneList[0];

  const addNewScene = () => {
    const lastScene = sceneList[sceneList.length - 1];
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      layoutId: lastScene.layoutId,
      texts: {},
      assets: [],
    };
    setSceneList(prev => [...prev, newScene]);
    setSelectedSceneId(newScene.id);
  };

  const deleteScene = (sceneId: string) => {
    if (sceneList.length <= 1) return;
    const sceneIndex = sceneList.findIndex(scene => scene.id === sceneId);
    const newSceneList = sceneList.filter(scene => scene.id !== sceneId);
    setSceneList(newSceneList);
    if (sceneId === selectedSceneId) {
      setSelectedSceneId(newSceneList[Math.max(0, sceneIndex - 1)].id);
    }
  };

  const updateScene = (updatedScene: Scene) => {
    setSceneList(prev => prev.map(scene => scene.id === updatedScene.id ? updatedScene : scene));
    forceUpdate();
  };
  
  /**
   * CORRIGIDO: Lógica para verificar corretamente os campos de texto que serão perdidos
   * ao mudar de um layout para outro.
   */
  const checkContentLoss = (currentLayoutId: string, newLayoutId: string, currentTexts: SceneTexts): string[] => {
    const currentTemplate = getLayoutTemplate(currentLayoutId);
    const newTemplate = getLayoutTemplate(newLayoutId);
    if (!currentTemplate || !newTemplate) return [];

    const currentFields = new Set(currentTemplate.textFields);
    const newFields = new Set(newTemplate.textFields);
    const lostFields: string[] = [];
    const fieldDisplayNames: { [key: string]: string } = {
        titulo: "Título", descricao: "Descrição", subtitulo: "Subtítulo",
        item1: "Item 1", item2: "Item 2", item3: "Item 3", item4: "Item 4",
    };

    for (const field of currentFields) {
      const hasContent = currentTexts[field as keyof SceneTexts]?.trim();
      if (!newFields.has(field) && hasContent) {
        lostFields.push(fieldDisplayNames[field] || field);
      }
    }
    return lostFields;
  };

  const mapFieldsBetweenLayouts = (currentTexts: SceneTexts, newLayoutId: string): SceneTexts => {
      const newLayoutTemplate = getLayoutTemplate(newLayoutId);
      if (!newLayoutTemplate) return {};

      const newTexts: SceneTexts = {};
      newLayoutTemplate.textFields.forEach(field => {
          const key = field as keyof SceneTexts;
          if(currentTexts[key]) {
              newTexts[key] = currentTexts[key];
          }
      });
      if(currentTexts.narracao) newTexts.narracao = currentTexts.narracao;
      return newTexts;
  };

  const handleLayoutSelect = (layoutId: string) => {
    const lostFields = checkContentLoss(selectedScene.layoutId, layoutId, selectedScene.texts);
    if (lostFields.length > 0) {
      setPendingLayoutChange({ layoutId });
      setIsLayoutChangeModalOpen(true);
    } else {
      applyLayoutChange(layoutId);
    }
  };

  const applyLayoutChange = (layoutId: string) => {
    const newLayoutTemplate = getLayoutTemplate(layoutId);
    if (!newLayoutTemplate) return;

    const newTexts = mapFieldsBetweenLayouts(selectedScene.texts, layoutId);
    const newAssets = selectedScene.assets.filter(asset => newLayoutTemplate.assetFields.includes(asset.id));

    updateScene({ ...selectedScene, layoutId, texts: newTexts, assets: newAssets });
    setIsLayoutChangeModalOpen(false);
    setPendingLayoutChange(null);
  };
  
  /**
   * CORRIGIDO: Renomeado parâmetro para maior clareza.
   * A lógica agora depende do `id` do ativo corresponder ao `field` do layout.
   */
  const handleRemoveAsset = (fieldToRemove: string) => {
    updateScene({
      ...selectedScene,
      assets: selectedScene.assets.filter(asset => asset.id !== fieldToRemove)
    });
  };

  const handleMediaUpload = (field: string) => {
    setActiveAssetField(field);
    setIsMediaUploadModalOpen(true);
  };

  const handleAIGeneration = (field: string) => {
    setActiveAssetField(field);
    setIsAIGenerationModalOpen(true);
  };

  const handleAssetUpdate = (url: string, name: string) => {
    if (!activeAssetField) return;

    let assetType: Asset['type'] = 'image';
    if (activeAssetField === 'logo') assetType = 'logo';
    if (activeAssetField === 'avatarImage') assetType = 'avatar';
    if (activeAssetField === 'frameImage') assetType = 'frameImage';

    const newAsset: Asset = { id: activeAssetField, type: assetType, url, name };

    updateScene({
      ...selectedScene,
      assets: [
        ...selectedScene.assets.filter(a => a.id !== activeAssetField),
        newAsset
      ]
    });
    setActiveAssetField(null);
  };
  
  const handleMediaUploadModal = (file: File) => {
    handleAssetUpdate(URL.createObjectURL(file), file.name);
  };
  
  const handleAIGenerationModal = () => {
    handleAssetUpdate('/placeholder-ai-generated.png', 'AI Generated Image');
  };

  const handleVideoGenerationConfirm = () => {
    setIsVideoGenerating(true);
    setTimeout(() => {
      setIsVideoGenerating(false);
      setIsVideoGenerationModalOpen(false);
      alert("Vídeo gerado com sucesso! (Simulação)");
    }, 3000);
  };

  const getSceneDisplayName = (scene: Scene, index: number) => `Cena ${index + 1}`;
  const sceneOptions = sceneList.map((scene, index) => ({
    value: scene.id,
    label: getSceneDisplayName(scene, index)
  }));
  
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b bg-card">
          <div className="flex items-center gap-2">
            {/* Removido o logo aqui */}
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {isEditingTitle ? (
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1"
                autoFocus
              />
            ) : (
              <div 
                className="text-xl font-semibold cursor-pointer hover:bg-muted transition-colors px-2 py-1 rounded"
                onClick={() => setIsEditingTitle(true)}
              >
                {videoTitle}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white"
              onClick={() => setIsVideoGenerationModalOpen(true)}
            >
              <Sparkles className="w-4 h-4" /> Gerar vídeo
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-row">
          <main className="flex flex-1 overflow-hidden gap-4 bg-slate-100 dark:bg-muted/30 min-h-0">
            <aside className="w-[350px] min-h-full bg-card border-r border-border/40 flex-shrink-0 flex flex-col">
              <div className="bg-slate-200 dark:bg-muted py-3 flex items-center justify-between flex-shrink-0 w-full p-6">
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
              <div className="flex-1 overflow-y-auto">
                <DynamicSceneForm 
                  scene={selectedScene} 
                  onUpdateScene={updateScene}
                  onMediaUpload={handleMediaUpload}
                  onAIGeneration={handleAIGeneration}
                  onRemoveAsset={handleRemoveAsset}
                />
              </div>
            </aside>

            <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden max-w-full px-6 mt-4 relative">
              <div className="flex gap-2 justify-end flex-shrink-0 w-full max-w-4xl mx-auto">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" /> Avatar
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="flex flex-col gap-2 p-4 min-w-[200px]">
                          {AVATARS.map((avatar) => (
                            <button
                              key={avatar.url}
                              className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-muted transition-colors ${getAssetByField(selectedScene, 'avatarImage')?.url === avatar.url ? 'ring-2 ring-primary' : ''}`}
                              onClick={() => {
                                const newAsset: Asset = { id: 'avatarImage', type: 'avatar', url: avatar.url, name: avatar.name };
                                updateScene({
                                  ...selectedScene,
                                  assets: [ ...selectedScene.assets.filter(a => a.id !== 'avatarImage'), newAsset ]
                                });
                              }}
                            >
                              <ShadcnAvatar className="w-8 h-8"><AvatarImage src={avatar.url} alt={avatar.name} /><AvatarFallback>AV</AvatarFallback></ShadcnAvatar>
                              <span className="text-sm font-medium">{avatar.name}</span>
                            </button>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="flex items-center gap-2">
                            <Music className="w-4 h-4" /> Trilha sonora
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <SoundtrackModal selectedSoundtrack={undefined} onSelectSoundtrack={() => {}} onClose={() => {}}/>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="flex items-center gap-2">
                        <Layout className="w-4 h-4" /> Mudar layout
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <LayoutModal selectedLayout={selectedScene.layoutId} onSelectLayout={(id) => handleLayoutSelect(id)} onClose={() => {}}/>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <section className="flex-1 flex justify-center items-center min-h-[400px] max-h-[500px] overflow-hidden" style={{ marginTop: 32, marginBottom: 32 }}>
                <div className="relative w-full max-w-4xl aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl overflow-hidden shadow-lg">
                  <div className="w-full h-full relative"><DynamicScenePreview scene={selectedScene} /></div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">16:9</div>
                </div>
              </section>

              <footer className="bg-card border border-border rounded-xl px-6 py-4 flex-shrink-0 absolute left-0 right-0 bottom-4 z-10 w-full max-w-5xl mx-auto" style={{boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)'}}>
                <div className="flex items-center gap-4 w-full overflow-hidden">
                  <Button variant="outline" size="icon" className="rounded-full p-2" disabled><Play className="w-5 h-5" /></Button>
                  <div className="flex gap-4 overflow-x-auto flex-1 min-w-0 pb-2">
                    {sceneList.map((scene, index) => (
                      <div 
                        key={scene.id}
                        className={`group relative w-32 h-20 bg-muted rounded-lg border-2 shadow-sm cursor-pointer overflow-hidden flex-shrink-0 ${selectedSceneId === scene.id ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                        onClick={() => setSelectedSceneId(scene.id)}
                      >
                        <div className="w-full h-full pointer-events-none"><LayoutThumbnail layoutId={scene.layoutId} /></div>
                        <div className="absolute bottom-1 left-1"><Badge variant="secondary" className="text-xs bg-white/80 backdrop-blur-sm text-black">Cena {index + 1}</Badge></div>
                        {sceneList.length > 1 && (
                          <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); deleteScene(scene.id); }}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" className="w-32 h-20 border-dashed border-2 rounded-lg text-xs flex items-center justify-center shadow-sm gap-2 flex-shrink-0" onClick={addNewScene}>
                      <Plus className="w-4 h-4" /> Adicionar cena
                    </Button>
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </div>

        {isMediaUploadModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <MediaUploadModal onUpload={handleMediaUploadModal} onClose={() => { setIsMediaUploadModalOpen(false); setActiveAssetField(null); }} />
          </div>
        )}
        {isAIGenerationModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <AIGenerationModal onGenerate={handleAIGenerationModal} onClose={() => { setIsAIGenerationModalOpen(false); setActiveAssetField(null); }} />
          </div>
        )}
        {isVideoGenerationModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <VideoGenerationModal onConfirm={handleVideoGenerationConfirm} onClose={() => setIsVideoGenerationModalOpen(false)} isGenerating={isVideoGenerating} />
          </div>
        )}
        {isLayoutChangeModalOpen && pendingLayoutChange && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4">Atenção à Perda de Conteúdo</h3>
              <p className="text-sm text-muted-foreground mb-4">A mudança de layout pode causar a perda de alguns conteúdos. Campos que serão perdidos:</p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6">
                  <ul className="text-sm text-destructive space-y-1">
                      {checkContentLoss(selectedScene.layoutId, pendingLayoutChange.layoutId, selectedScene.texts).map((field) => (
                          <li key={field} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-destructive rounded-full"></span>{field}
                          </li>
                      ))}
                  </ul>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsLayoutChangeModalOpen(false)}>Cancelar</Button>
                <Button onClick={() => applyLayoutChange(pendingLayoutChange.layoutId)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Trocar Mesmo Assim</Button>
              </div>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}