"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Play, Pause, Check } from "lucide-react";

interface Avatar {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface AvatarModalProps {
  selectedAvatar?: string;
  onSelectAvatar: (avatarId: string) => void;
  onClose: () => void;
}

const avatars: Avatar[] = [
  {
    id: "avatar-1",
    name: "João Silva",
    image: "👨‍💼",
    description: "Executivo profissional"
  },
  {
    id: "avatar-2", 
    name: "Maria Santos",
    image: "👩‍🏫",
    description: "Professora amigável"
  },
  {
    id: "avatar-3",
    name: "Carlos Oliveira",
    image: "👨‍🔬",
    description: "Cientista experiente"
  },
  {
    id: "avatar-4",
    name: "Ana Costa",
    image: "👩‍💻",
    description: "Tecnóloga moderna"
  },
  {
    id: "avatar-5",
    name: "Pedro Lima",
    image: "👨‍🎓",
    description: "Estudante entusiasta"
  }
];

export function AvatarModal({ selectedAvatar, onSelectAvatar, onClose }: AvatarModalProps) {
  const [playingAvatar, setPlayingAvatar] = useState<string | null>(null);

  const handleAvatarSelect = (avatarId: string) => {
    onSelectAvatar(avatarId);
    onClose();
  };

  const handlePlayPreview = (avatarId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingAvatar(playingAvatar === avatarId ? null : avatarId);
    
    // Simular preview de áudio
    setTimeout(() => {
      setPlayingAvatar(null);
    }, 3000);
  };

  return (
    <div className="w-[450px] p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Selecionar Avatar</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedAvatar === avatar.id ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => handleAvatarSelect(avatar.id)}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl">
                    {avatar.image}
                  </div>
                  {selectedAvatar === avatar.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="font-medium text-sm">{avatar.name}</div>
                  <div className="text-xs text-muted-foreground">{avatar.description}</div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => handlePlayPreview(avatar.id, e)}
                >
                  {playingAvatar === avatar.id ? (
                    <Pause className="w-4 h-4 text-primary" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 