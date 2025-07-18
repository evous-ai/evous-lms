"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Check, Music } from "lucide-react";

interface Soundtrack {
  id: string;
  name: string;
  category: string;
  duration: string;
  description: string;
  audioUrl: string;
}

interface SoundtrackModalProps {
  selectedSoundtrack?: string;
  onSelectSoundtrack: (soundtrackId: string) => void;
  onClose: () => void;
}

const soundtracks: Soundtrack[] = [
  {
    id: "soundtrack-1",
    name: "This is Kids",
    category: "Educacional",
    duration: "3:24",
    description: "Música alegre e educativa para crianças",
    audioUrl: "/1 This is Kids.mp3"
  },
  {
    id: "soundtrack-2",
    name: "Sport Action Regular",
    category: "Motivacional",
    duration: "4:30",
    description: "Energia e ação para momentos dinâmicos",
    audioUrl: "/Sport Action Regular.mp3"
  },
  {
    id: "soundtrack-3",
    name: "Short",
    category: "Corporativa",
    duration: "1:07",
    description: "Trilha curta e profissional",
    audioUrl: "/Short (1-07).mp3"
  },
  {
    id: "soundtrack-4",
    name: "The Motivational",
    category: "Motivacional",
    duration: "6:42",
    description: "Música motivacional inspiradora",
    audioUrl: "/The Motivational.mp3"
  },
  {
    id: "soundtrack-5",
    name: "The Sport",
    category: "Dinâmico",
    duration: "9:00",
    description: "Trilha esportiva e energética",
    audioUrl: "/The Sport.wav"
  }
];

export function SoundtrackModal({ selectedSoundtrack, onSelectSoundtrack, onClose }: SoundtrackModalProps) {
  const [playingSoundtrack, setPlayingSoundtrack] = useState<string | null>(null);
  const [audioRefs, setAudioRefs] = useState<Record<string, HTMLAudioElement>>({});

  // Parar todos os áudios quando o modal for fechado
  useEffect(() => {
    return () => {
      Object.values(audioRefs).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      setPlayingSoundtrack(null);
    };
  }, [audioRefs]);

  const handleSoundtrackSelect = (soundtrackId: string) => {
    onSelectSoundtrack(soundtrackId);
    onClose();
  };

  const handlePlayPreview = (soundtrackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Se clicou no mesmo, para o áudio
    if (playingSoundtrack === soundtrackId) {
      if (audioRefs[soundtrackId]) {
        audioRefs[soundtrackId].pause();
        audioRefs[soundtrackId].currentTime = 0;
      }
      setPlayingSoundtrack(null);
      return;
    }
    
    // Parar áudio anterior se estiver tocando
    if (playingSoundtrack && audioRefs[playingSoundtrack]) {
      audioRefs[playingSoundtrack].pause();
      audioRefs[playingSoundtrack].currentTime = 0;
    }
    
    // Tocar novo áudio
    const soundtrack = soundtracks.find(s => s.id === soundtrackId);
    if (soundtrack) {
      try {
        const audio = new Audio(soundtrack.audioUrl);
        audio.volume = 0.5;
        
        audio.addEventListener('ended', () => {
          setPlayingSoundtrack(null);
        });
        
        audio.addEventListener('error', () => {
          console.log('Erro ao carregar áudio, usando fallback');
          playSyntheticAudio(soundtrackId);
        });
        
        audio.play().then(() => {
          setPlayingSoundtrack(soundtrackId);
          setAudioRefs(prev => ({ ...prev, [soundtrackId]: audio }));
        }).catch(error => {
          console.error('Erro ao tocar áudio:', error);
          playSyntheticAudio(soundtrackId);
        });
      } catch (error) {
        console.error('Erro ao criar áudio:', error);
        playSyntheticAudio(soundtrackId);
      }
    }
  };

  const playSyntheticAudio = (soundtrackId: string) => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const frequencies = {
        'soundtrack-1': 440,
        'soundtrack-2': 523,
        'soundtrack-3': 587,
        'soundtrack-4': 659,
        'soundtrack-5': 698,
      };
      
      oscillator.frequency.setValueAtTime(frequencies[soundtrackId as keyof typeof frequencies] || 440, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
      
      setPlayingSoundtrack(soundtrackId);
      
      setTimeout(() => {
        setPlayingSoundtrack(null);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao criar áudio sintético:', error);
      setPlayingSoundtrack(null);
    }
  };

  return (
    <div className="w-[450px] p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Selecionar Trilha Sonora</h3>
        </div>
        
        <div className="space-y-2">
          {soundtracks.map((soundtrack) => (
            <div
              key={soundtrack.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedSoundtrack === soundtrack.id ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => handleSoundtrackSelect(soundtrack.id)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-muted-foreground" />
                  </div>
                  {selectedSoundtrack === soundtrack.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{soundtrack.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{soundtrack.description}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {soundtrack.duration}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{soundtrack.category}</span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 flex-shrink-0"
                  onClick={(e) => handlePlayPreview(soundtrack.id, e)}
                >
                  {playingSoundtrack === soundtrack.id ? (
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