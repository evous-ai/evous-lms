"use client"

import { useState, useReducer, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle-theme";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { SoundtrackModal } from "@/components/modals/soundtrack-modal";
import { LayoutModal } from "@/components/modals/layout-modal";
import { MediaUploadModal } from "@/components/modals/media-upload-modal";
import { AIGenerationModal } from "@/components/modals/ai-generation-modal";
import { VideoGenerationModal } from "@/components/modals/video-generation-modal";
import { UndoRedoButtons } from "@/components/undo-redo-buttons";
import { AudioPlayButton } from "@/components/audio-play-button";
import { DraggableSceneThumbnail } from "@/components/draggable-scene-thumbnail";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  Pencil,
  Pause,
  ChevronDown,
} from "lucide-react";
import { Avatar as ShadcnAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Image from "next/image";
import { useUndoRedo } from "@/hooks/use-undo-redo";

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

  const assetSlots = layoutTemplate.assetFields
    // Remover avatarImage do painel de ativos
    .filter(field => field !== 'avatarImage')
    .map(field => getAssetByField(scene, field));
  const showAtivos = layoutTemplate.assetFields.filter(f => f !== 'avatarImage').length > 0;
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
                <label className="text-sm font-semibold mb-2 block capitalize">{field === 'descricao' ? 'Descrição' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
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
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Narração</h2>
          <AudioPlayButton 
            text={scene.texts['narracao'] || ''} 
            disabled={!scene.texts['narracao']?.trim()}
          />
        </div>
        <textarea
          rows={3}
          placeholder="Texto da narração"
          value={scene.texts['narracao'] || ''}
          onChange={e => {
            handleInput('narracao', e.target.value);
            // Auto-resize
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          onFocus={e => {
            // Auto-resize no foco
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y min-h-[80px] max-h-[300px] overflow-y-auto"
          style={{ minHeight: '80px', maxHeight: '300px' }}
        />
      </section>

      {/* Ativos */}
      {showAtivos && (
        <section>
          <h2 className="text-sm font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Ativos</h2>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {layoutTemplate.assetFields
                .filter(field => field !== 'avatarImage')
                .map((field, idx) => {
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
              {layoutTemplate.assetFields.filter(f => f !== 'avatarImage').length > 0 && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => onMediaUpload(layoutTemplate.assetFields.filter(f => f !== 'avatarImage')[0])}
                >
                  <Upload className="w-4 h-4" /> Inserir mídia
                </Button>
              )}
              {layoutTemplate.assetFields.filter(f => f !== 'avatarImage').length > 0 && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => onAIGeneration(layoutTemplate.assetFields.filter(f => f !== 'avatarImage')[0])}
                >
                  <Sparkles className="w-4 h-4" /> Gerar com IA
                </Button>
              )}
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
        <div className="relative w-full h-full flex flex-col items-center justify-center aspect-video rounded-xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #132726 70%, #00826A 90%, #A7FFA2 100%)' }}>
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
            <div
              className="absolute"
              style={{
                right: '8%',
                top: '50%',
                transform: 'translateY(-50%) scale(1.1)',
                width: '36%',
                height: '60%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                marginLeft: '-20px',
                aspectRatio: '1/1', // círculo perfeito
                borderRadius: '50%', // círculo perfeito
                overflow: 'hidden', // máscara
              }}
            >
              <Image
                src={frameImage.url}
                alt="Frame decorativo"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <div className="flex flex-col items-center justify-center h-full w-1/2 text-left absolute left-10">
              <h1 className="text-4xl font-bold text-white mb-4 w-full">
                {scene.texts.titulo || 'Título de abertura'}
              </h1>
              <p className="text-2xl text-[#A7FFA2] w-full">
                {scene.texts.descricao || 'Descrição da abertura...'}
              </p>
          </div>
        </div>
      );
    case 'avatar-central':
      return (
        <div className="relative w-full h-full flex items-end justify-center aspect-video rounded-xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #132726 70%, #00826A 90%, #A7FFA2 100%)' }}>
          {avatar && (
            <div style={{ position: 'relative', width: '100%', height: '90%' }}>
              <Image
                src={avatar.url}
                alt="Avatar"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
        </div>
      );
    case 'avatar-lateral':
      return (
        <div className="w-full h-full flex items-center p-8 gap-8 aspect-video rounded-xl"
          style={{ background: 'linear-gradient(135deg, #132726 70%, #00826A 90%, #A7FFA2 100%)' }}>
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
            <h1 className="text-2xl font-bold text-white mb-3">{scene.texts.titulo || 'Título'}</h1>
            <p className="text-lg text-[#A7FFA2]">{scene.texts.subtitulo || 'Subtítulo...'}</p>
          </div>
        </div>
      );
    case 'avatar-apresentador':
        return (
          <div className="w-full h-full flex items-end p-8 gap-8 aspect-video rounded-xl"
            style={{ background: 'linear-gradient(135deg, #132726 70%, #00826A 90%, #A7FFA2 100%)' }}>
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
              <h1 className="text-2xl font-bold text-white mb-3">{scene.texts.titulo || 'Título'}</h1>
              <p className="text-lg text-[#A7FFA2]">{scene.texts.subtitulo || 'Subtítulo...'}</p>
            </div>
          </div>
        );
    case 'texto-central':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 aspect-video rounded-xl"
          style={{ background: 'linear-gradient(135deg, #132726 70%, #00826A 90%, #A7FFA2 100%)' }}>
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">{scene.texts.titulo || 'Título'}</h1>
          <p className="text-2xl text-[#A7FFA2] leading-relaxed">{scene.texts.subtitulo || 'Subtítulo...'}</p>
        </div>
      );
    case 'lista-itens':
      return (
        <div className="w-full h-full flex flex-col p-8 aspect-video rounded-xl"
          style={{ background: 'linear-gradient(135deg, #132726 70%, #00826A 90%, #A7FFA2 100%)' }}>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">{scene.texts.titulo || 'Título'}</h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 w-full max-w-4xl">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-md min-h-[52px] h-[52px] w-full">
                  <div className="w-3 h-3 bg-[#00826A] rounded-full flex-shrink-0"></div>
                  <span className="text-lg font-medium text-black">
                    {scene.texts[`item${i}` as keyof SceneTexts] || `Item ${i}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'fechamento':
      return (
        <div className="w-full h-full flex items-center justify-center aspect-video rounded-xl"
          style={{ background: 'linear-gradient(135deg, #132726 70%, #00826A 90%, #A7FFA2 100%)' }}>
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

// Lista dinâmica de imagens de IA disponíveis
const IA_SAMPLE_IMAGES = [
  '/evous_sample_asset_IA_001.png',
  '/evous_sample_asset_IA_002.png',
  '/evous_sample_asset_IA_003.png',
  '/evous_sample_asset_IA_004.png',
  '/evous_sample_asset_IA_005.png',
  '/evous_sample_asset_IA_006.png',
  // Adicione mais arquivos seguindo o padrão acima
];

// Adicionar lista de trilhas sonoras disponíveis
const SOUNDTRACKS = [
  {
    id: "soundtrack-1",
    name: "This is Kids",
    audioUrl: "/1 This is Kids.mp3",
  },
  {
    id: "soundtrack-2",
    name: "Sport Action Regular",
    audioUrl: "/Sport Action Regular.mp3",
  },
  {
    id: "soundtrack-3",
    name: "Short",
    audioUrl: "/Short (1-07).mp3",
  },
  {
    id: "soundtrack-4",
    name: "The Motivational",
    audioUrl: "/The Motivational.mp3",
  },
  {
    id: "soundtrack-5",
    name: "The Sport",
    audioUrl: "/The Sport.wav",
  },
];

export default function VideoPreviewPage() {
  const initialScenes: Scene[] = [
    {
      id: "scene-1",
      layoutId: "abertura",
      texts: {
        titulo: "Você sabia?",
        descricao: "A IA pode automatizar até 40% do seu tempo de trabalho.",
        narracao: "Você sabia que a inteligência artificial pode automatizar até 40% do seu tempo de trabalho? Isso significa mais foco no que realmente importa."
      },
      assets: [
        { id: 'logo', type: 'logo', url: '/logo_lubrax_darkmode.png', name: 'Logo' },
        { id: 'frameImage', type: 'image', url: '/sample_asset_evous.png', name: 'Asset decorativo' }
      ]
    },
    {
      id: "scene-2",
      layoutId: "avatar-central",
      texts: {
        narracao: "Com o apoio da IA, tarefas repetitivas e processos demorados são resolvidos em segundos, liberando tempo e energia para a inovação."
      },
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
        item4: "Relatórios automáticos",
        narracao: "Veja só os benefícios: mais tempo livre, menos erros, resultados mais rápidos e relatórios automáticos. Tudo isso com o poder da IA."
      },
      assets: []
    },
    {
      id: "scene-4",
      layoutId: "fechamento",
      texts: {
        narracao: "Chegou a hora de transformar a sua rotina com inteligência artificial. Evolua com a Lubrax."
      },
              assets: [{ id: 'logo', type: 'logo', url: '/logo_lubrax_darkmode.png', name: 'Logo' }]
    }
  ];

  // Hook para gerenciar undo/redo das cenas
  const {
    state: sceneList,
    updateState: updateSceneList,
    undo: undoScenes,
    redo: redoScenes,
    canUndo: canUndoScenes,
    canRedo: canRedoScenes
  } = useUndoRedo<Scene[]>(initialScenes);

  // Hook para gerenciar undo/redo do título do vídeo
  const {
    state: videoTitle,
    updateState: updateVideoTitle,
    undo: undoTitle,
    redo: redoTitle,
    canUndo: canUndoTitle,
    canRedo: canRedoTitle
  } = useUndoRedo<string>("Uma historinha colorida que ensina");

  // Atalhos de teclado para undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          if (canUndoScenes) undoScenes();
          if (canUndoTitle) undoTitle();
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          if (canRedoScenes) redoScenes();
          if (canRedoTitle) redoTitle();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndoScenes, canRedoScenes, canUndoTitle, canRedoTitle, undoScenes, redoScenes, undoTitle, redoTitle]);

  const [selectedSceneId, setSelectedSceneId] = useState("scene-1");
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [isAIGenerationModalOpen, setIsAIGenerationModalOpen] = useState(false);
  const [isVideoGenerationModalOpen, setIsVideoGenerationModalOpen] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [isLayoutChangeModalOpen, setIsLayoutChangeModalOpen] = useState(false);
  const [pendingLayoutChange, setPendingLayoutChange] = useState<{ layoutId: string } | null>(null);
  const [activeAssetField, setActiveAssetField] = useState<string | null>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedSoundtrack, setSelectedSoundtrack] = useState<typeof SOUNDTRACKS[0] | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Avança para a próxima cena ou reseta para a primeira
  const goToNextScene = useCallback(() => {
    if (sceneList.length === 0) return; // Não há cenas para navegar
    
    const currentIndex = sceneList.findIndex(scene => scene.id === selectedSceneId);
    if (currentIndex < sceneList.length - 1) {
      setSelectedSceneId(sceneList[currentIndex + 1].id);
    } else {
      // Última cena: volta para a primeira e para a reprodução
      setIsPlaying(false);
      setSelectedSceneId(sceneList[0].id);
    }
  }, [sceneList, selectedSceneId]);

  // Efeito para controlar reprodução automática
  useEffect(() => {
    if (isPlaying) {
      playTimeoutRef.current = setTimeout(() => {
        goToNextScene();
      }, 4500); // 4.5 segundos por cena
    } else if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
    };
  }, [isPlaying, selectedSceneId, sceneList.length, goToNextScene]);

  // Sincronizar áudio com play/pause
  useEffect(() => {
    if (!selectedSoundtrack || !audioRef.current) return;
    if (isPlaying) {
      (audioRef.current as HTMLAudioElement).play();
    } else {
      (audioRef.current as HTMLAudioElement).pause();
    }
  }, [isPlaying, selectedSoundtrack]);

  // Parar áudio ao fim da timeline
  useEffect(() => {
    if (!selectedSoundtrack || !audioRef.current) return;
    if (!isPlaying && audioRef.current) {
      (audioRef.current as HTMLAudioElement).pause();
    }
  }, [isPlaying, selectedSoundtrack]);

  // Resetar áudio ao voltar para Cena 1 após o fim
  useEffect(() => {
    if (!selectedSoundtrack || !audioRef.current || sceneList.length === 0) return;
    if (!isPlaying && selectedSceneId === sceneList[0].id) {
      (audioRef.current as HTMLAudioElement).currentTime = 0;
    }
  }, [isPlaying, selectedSceneId, selectedSoundtrack, sceneList]);

  // Tempo de exibição por cena (em segundos)
  const SCENE_DURATION = 4.5;
  // Tempo total do vídeo
  const totalDuration = Math.max(sceneList.length * SCENE_DURATION, 0);
  // Estado para controlar o tempo atual (em segundos)
  const [currentTime, setCurrentTime] = useState(0);
  // Estado para controlar o progresso da cena atual (0 a 1) - REMOVIDO: não utilizado
  // const [sceneProgress, setSceneProgress] = useState(0);

  // Atualiza o tempo durante o play
  useEffect(() => {
    if (!isPlaying || sceneList.length === 0) return;
    const start = Date.now();
    let frame: number;
    const currentSceneIndex = sceneList.findIndex(scene => scene.id === selectedSceneId);
    const tick = () => {
      const elapsed = (Date.now() - start) / 1000;
      setCurrentTime(currentSceneIndex * SCENE_DURATION + Math.min(elapsed, SCENE_DURATION));
      if (elapsed < SCENE_DURATION && isPlaying) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, selectedSceneId, sceneList, SCENE_DURATION]);

  // Resetar tempo ao pausar ou trocar de cena manualmente
  useEffect(() => {
    if (!isPlaying && sceneList.length > 0) {
      const currentSceneIndex = sceneList.findIndex(scene => scene.id === selectedSceneId);
      setCurrentTime(currentSceneIndex * SCENE_DURATION);
    }
  }, [isPlaying, selectedSceneId, sceneList, SCENE_DURATION]);

  // Atualizar tempo total ao adicionar/remover cenas
  useEffect(() => {
    if (!isPlaying && sceneList.length > 0) {
      const currentSceneIndex = sceneList.findIndex(scene => scene.id === selectedSceneId);
      setCurrentTime(currentSceneIndex * SCENE_DURATION);
    }
  }, [sceneList, selectedSceneId, SCENE_DURATION, isPlaying]);

  // Função para formatar tempo em mm:ss
  function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  const addNewScene = () => {
    // Se não há cenas, escolher um layout aleatório
    let layoutId = "abertura"; // layout padrão
    if (sceneList.length > 0) {
      const lastScene = sceneList[sceneList.length - 1];
      layoutId = lastScene.layoutId;
    } else {
      // Escolher um layout aleatório entre os disponíveis
      const allLayouts = LAYOUT_TEMPLATES.flatMap(cat => cat.layouts);
      const randomIndex = Math.floor(Math.random() * allLayouts.length);
      layoutId = allLayouts[randomIndex].id;
    }
    
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      layoutId: layoutId,
      texts: {},
      assets: [],
    };
    updateSceneList([...sceneList, newScene]);
    setSelectedSceneId(newScene.id);
  };

  const deleteScene = (sceneId: string) => {
    // REMOVIDO: Restrição que impedia excluir a última cena
    const sceneIndex = sceneList.findIndex(scene => scene.id === sceneId);
    const newSceneList = sceneList.filter(scene => scene.id !== sceneId);
    updateSceneList(newSceneList);
    
    // Se não há mais cenas, não há cena selecionada
    if (newSceneList.length === 0) {
      setSelectedSceneId("");
    } else if (sceneId === selectedSceneId) {
      // Se a cena excluída era a selecionada, seleciona a anterior ou a primeira
      setSelectedSceneId(newSceneList[Math.max(0, sceneIndex - 1)].id);
    }
  };

  const updateScene = (updatedScene: Scene) => {
    updateSceneList(sceneList.map(scene => scene.id === updatedScene.id ? updatedScene : scene));
    forceUpdate();
  };

  // Função para reordenar cenas via drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sceneList.findIndex(scene => scene.id === active.id);
      const newIndex = sceneList.findIndex(scene => scene.id === over?.id);

      const newSceneList = arrayMove(sceneList, oldIndex, newIndex);
      updateSceneList(newSceneList);
    }
  };

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Distância mínima para ativar o drag
      },
    }),
    useSensor(KeyboardSensor)
  );
  
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
    if (!selectedScene) return;
    const lostFields = checkContentLoss(selectedScene.layoutId, layoutId, selectedScene.texts);
    if (lostFields.length > 0) {
      setPendingLayoutChange({ layoutId });
      setIsLayoutChangeModalOpen(true);
    } else {
      applyLayoutChange(layoutId);
    }
  };

  const applyLayoutChange = (layoutId: string) => {
    if (!selectedScene) return;
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
    if (!selectedScene) return;
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
    if (!activeAssetField || !selectedScene) return;

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
  
  // Substituir handleAIGenerationModal para simular geração de IA
  const handleAIGenerationModal = () => {
    if (!selectedScene) return;
    // Escolher uma imagem aleatória do diretório
    const randomIndex = Math.floor(Math.random() * IA_SAMPLE_IMAGES.length);
    const randomImage = IA_SAMPLE_IMAGES[randomIndex];
    const name = `Imagem IA ${randomIndex + 1}`;
    // Sempre substituir/inserir apenas o frameImage
    const newAsset: Asset = { id: 'frameImage', type: 'frameImage', url: randomImage, name };
    updateScene({
      ...selectedScene,
      assets: [
        // Mantém todos os assets exceto frameImage
        ...selectedScene.assets.filter(a => a.id !== 'frameImage'),
        newAsset
      ]
    });
    setActiveAssetField(null);
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
  
  // NOVO: Cena selecionada com fallback para quando não há cenas
  const selectedScene = sceneList.find(scene => scene.id === selectedSceneId) || null;
  
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
                onChange={(e) => updateVideoTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1"
                autoFocus
              />
            ) : (
              <div 
                className="group text-xl font-semibold cursor-pointer hover:bg-muted transition-colors px-2 py-1 rounded flex items-center gap-2"
                onClick={() => setIsEditingTitle(true)}
              >
                <span>{videoTitle}</span>
                <Pencil className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <UndoRedoButtons
              canUndo={canUndoScenes || canUndoTitle}
              canRedo={canRedoScenes || canRedoTitle}
              onUndo={() => {
                if (canUndoScenes) undoScenes();
                if (canUndoTitle) undoTitle();
              }}
              onRedo={() => {
                if (canRedoScenes) redoScenes();
                if (canRedoTitle) redoTitle();
              }}
            />
            <Separator orientation="vertical" className="h-6" />
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
                    onValueChange={id => {
                      if (id !== selectedSceneId) setSelectedSceneId(id);
                    }}
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
                    onClick={() => selectedScene && deleteScene(selectedScene.id)}
                    disabled={!selectedScene}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {selectedScene ? (
                  <DynamicSceneForm 
                    scene={selectedScene} 
                    onUpdateScene={updateScene}
                    onMediaUpload={handleMediaUpload}
                    onAIGeneration={handleAIGeneration}
                    onRemoveAsset={handleRemoveAsset}
                  />
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Nenhuma cena criada</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Adicione sua primeira cena para começar a criar seu vídeo
                    </p>
                    <Button onClick={addNewScene} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Criar primeira cena
                    </Button>
                  </div>
                )}
              </div>
            </aside>

            <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden max-w-full px-6 mt-4 relative">
              <div className="flex gap-2 justify-end flex-shrink-0 w-full max-w-4xl mx-auto">
                <Menubar className="border-none bg-transparent p-0">
                  <MenubarMenu>
                    <MenubarTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                      <UserPlus className="w-5 h-5" /> Avatar
                      <ChevronDown className="w-4 h-4" />
                    </MenubarTrigger>
                    <MenubarContent>
                      <div className="flex flex-col gap-2 p-4 min-w-[200px]">
                        {AVATARS.map((avatar) => (
                          <button
                            key={avatar.url}
                            className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-muted transition-colors ${selectedScene && getAssetByField(selectedScene, 'avatarImage')?.url === avatar.url ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => {
                              if (!selectedScene) return;
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
                    </MenubarContent>
                  </MenubarMenu>
                  
                  <MenubarMenu>
                    <MenubarTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                      <Music className="w-4 h-4" /> Trilha sonora
                      <ChevronDown className="w-4 h-4" />
                    </MenubarTrigger>
                    <MenubarContent>
                      <SoundtrackModal
                        selectedSoundtrack={selectedSoundtrack?.id}
                        onSelectSoundtrack={id => {
                          const found = SOUNDTRACKS.find(s => s.id === id);
                          setSelectedSoundtrack(found);
                        }}
                        onClose={() => {}}
                      />
                    </MenubarContent>
                  </MenubarMenu>
                  
                  <MenubarMenu>
                    <MenubarTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                      <Layout className="w-4 h-4" /> Mudar layout
                      <ChevronDown className="w-4 h-4" />
                    </MenubarTrigger>
                    <MenubarContent>
                      <LayoutModal 
                        selectedLayout={selectedScene?.layoutId || ""} 
                        onSelectLayout={(_, layoutType) => selectedScene && handleLayoutSelect(layoutType)} 
                        onClose={() => {}}
                      />
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>

              <section className="flex-1 flex justify-center items-center min-h-[400px] max-h-[500px] overflow-hidden" style={{ marginTop: 32, marginBottom: 32 }}>
                <div className="relative w-full max-w-4xl aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl overflow-hidden shadow-lg">
                  {selectedScene ? (
                    <div className="w-full h-full relative">
                      <DynamicScenePreview scene={selectedScene} />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                      <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                        <Plus className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Nenhuma cena selecionada</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        As prévias das cenas serão exibidas aqui assim que você adicionar cenas ao seu projeto
                      </p>
                      <Button onClick={addNewScene} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Adicionar primeira cena
                      </Button>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">16:9</div>
                </div>
              </section>

              <footer className="bg-card border border-border rounded-xl px-6 py-4 flex-shrink-0 absolute left-0 right-0 bottom-4 z-10 w-full max-w-5xl mx-auto" style={{boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)'}}>
                <div className="flex items-center gap-4 w-full overflow-hidden">
                  <div className="flex flex-col items-center justify-center" style={{ minWidth: 60 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full p-2"
                      onClick={() => setIsPlaying(prev => !prev)}
                      disabled={sceneList.length === 0}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <span
                      className="text-xs text-muted-foreground mt-1 font-mono text-center"
                      style={{ width: '110px', display: 'inline-block', letterSpacing: '0.5px' }}
                    >
                      {formatTime(currentTime)} / {formatTime(totalDuration)}
                    </span>
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sceneList.map(scene => scene.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="flex gap-4 overflow-x-auto flex-1 min-w-0 pb-2">
                        {sceneList.map((scene, index) => {
                          const isCurrent = selectedSceneId === scene.id;
                          // Calcular progresso da barra para a cena atual
                          let progress = 0;
                          if (isPlaying && isCurrent) {
                            const currentSceneIndex = sceneList.findIndex(s => s.id === selectedSceneId);
                            const sceneStart = currentSceneIndex * SCENE_DURATION;
                            const elapsed = Math.max(0, Math.min(currentTime - sceneStart, SCENE_DURATION));
                            progress = elapsed / SCENE_DURATION;
                          }
                          return (
                            <DraggableSceneThumbnail
                              key={scene.id}
                              scene={scene}
                              index={index}
                              isCurrent={isCurrent}
                              isPlaying={isPlaying}
                              progress={progress}
                              onSelect={() => setSelectedSceneId(scene.id)}
                              onDelete={(e) => { e.stopPropagation(); deleteScene(scene.id); }}
                            />
                          );
                        })}
                        <Button variant="outline" className="w-32 h-20 border-dashed border-2 rounded-lg text-xs flex items-center justify-center shadow-sm gap-2 flex-shrink-0" onClick={addNewScene}>
                          <Plus className="w-4 h-4" /> Adicionar cena
                        </Button>
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </footer>
              {selectedSoundtrack && (
                <div className="w-full flex justify-center mt-2">
                  <Badge variant="secondary" className="flex items-center gap-2 justify-center" style={{ minWidth: 120, width: `${sceneList.length * 8}rem`, maxWidth: '100%' }}>
                    <Music className="w-4 h-4 mr-1" />
                    {selectedSoundtrack.name}
                  </Badge>
                  <audio ref={audioRef} src={selectedSoundtrack.audioUrl} preload="auto" />
                </div>
              )}
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
        {isLayoutChangeModalOpen && pendingLayoutChange && selectedScene && (
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