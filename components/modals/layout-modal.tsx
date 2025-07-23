"use client"

import { Check, Type, User } from "lucide-react";
import LayoutThumbnail from "../layout-thumbnail";

interface LayoutOption {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: React.ReactNode;
  layoutType: "avatar-central" | "avatar-lateral" | "avatar-apresentador" | "texto-central" | "lista-itens";
}

interface LayoutModalProps {
  selectedLayout: string;
  onSelectLayout: (layoutId: string, layoutType: string) => void;
  onClose: () => void;
}

const layouts: LayoutOption[] = [
  // Com avatar como protagonista
  {
    id: "layout-avatar-1",
    name: "Avatar Central",
    category: "Com avatar como protagonista",
    description: "Avatar em destaque no centro",
    layoutType: "avatar-central",
    thumbnail: (
      <div className="w-full h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex flex-col items-center justify-center p-1">
        <div className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold mb-1">
          A
        </div>
        <div className="w-8 h-0.5 bg-blue-300 rounded"></div>
      </div>
    )
  },
  {
    id: "layout-avatar-2",
    name: "Avatar Lateral",
    category: "Com avatar como protagonista",
    description: "Avatar à esquerda com texto à direita",
    layoutType: "avatar-lateral",
    thumbnail: (
      <div className="w-full h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded flex items-center gap-2 p-2">
        <div className="w-6 h-6 bg-teal-300 rounded-full flex items-center justify-center text-teal-700 text-xs font-bold">
          A
        </div>
        <div className="flex-1 space-y-1">
          <div className="w-full h-1 bg-teal-300 rounded"></div>
          <div className="w-3/4 h-1 bg-teal-300 rounded"></div>
        </div>
      </div>
    )
  },
  {
    id: "layout-avatar-3",
    name: "Avatar Apresentador",
    category: "Com avatar como protagonista",
    description: "Avatar como apresentador profissional",
    layoutType: "avatar-apresentador",
    thumbnail: (
      <div className="w-full h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded flex flex-col items-center justify-center p-1">
        <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center text-purple-600 text-xs font-bold mb-1">
          A
        </div>
        <div className="space-y-0.5">
          <div className="w-6 h-0.5 bg-purple-300 rounded"></div>
          <div className="w-4 h-0.5 bg-purple-300 rounded"></div>
        </div>
      </div>
    )
  },
  
  // Com texto como protagonista
  {
    id: "layout-text-1",
    name: "Texto Central",
    category: "Com texto como protagonista",
    description: "Texto em destaque no centro",
    layoutType: "texto-central",
    thumbnail: (
      <div className="w-full h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded flex flex-col items-center justify-center gap-1 p-2">
        <div className="w-12 h-1 bg-orange-300 rounded"></div>
        <div className="w-8 h-1 bg-orange-300 rounded"></div>
      </div>
    )
  },
  {
    id: "layout-text-2",
    name: "Lista de Itens",
    category: "Com texto como protagonista",
    description: "Lista organizada de informações",
    layoutType: "lista-itens",
    thumbnail: (
      <div className="w-full h-16 bg-gradient-to-br from-red-100 to-red-200 rounded flex flex-col justify-center gap-1 p-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-red-400 rounded-full"></div>
          <div className="w-8 h-1 bg-red-300 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-red-400 rounded-full"></div>
          <div className="w-6 h-1 bg-red-300 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-red-400 rounded-full"></div>
          <div className="w-10 h-1 bg-red-300 rounded"></div>
        </div>
      </div>
    )
  }
];

export function LayoutModal({ selectedLayout, onSelectLayout, onClose }: LayoutModalProps) {
  const handleLayoutSelect = (layoutId: string, layoutType: string) => {
    onSelectLayout(layoutId, layoutType);
    onClose();
  };

  const groupedLayouts = layouts.reduce((acc, layout) => {
    if (!acc[layout.category]) {
      acc[layout.category] = [];
    }
    acc[layout.category].push(layout);
    return acc;
  }, {} as Record<string, LayoutOption[]>);

  return (
    <div className="w-[450px] p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Selecionar Layout</h3>
        </div>
        
        <div className="space-y-4">
          {Object.entries(groupedLayouts).map(([category, layoutOptions]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                {category.includes("avatar") ? (
                  <User className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Type className="w-4 h-4 text-muted-foreground" />
                )}
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {category}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {layoutOptions.map((layout) => (
                  <div
                    key={layout.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedLayout === layout.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => handleLayoutSelect(layout.id, layout.layoutType)}
                  >
                    <div className="space-y-2">
                      <div className="relative w-24 h-16 mx-auto">
                        <LayoutThumbnail layoutId={layout.layoutType} />
                        {selectedLayout === layout.id && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <div className="font-medium text-sm">{layout.name}</div>
                        <div className="text-xs text-muted-foreground">{layout.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 