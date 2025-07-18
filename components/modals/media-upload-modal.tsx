"use client"

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

import { Upload, Image, Video, X } from "lucide-react";

interface MediaUploadModalProps {
  onUpload: (file: File) => void;
  onClose: () => void;
  maxAssets?: number;
  currentAssetsCount?: number;
}

export function MediaUploadModal({ 
  onUpload, 
  onClose, 
  maxAssets = 2, 
  currentAssetsCount = 0 
}: MediaUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const isValidFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      alert('Tipo de arquivo não suportado. Use imagens (JPEG, PNG, GIF, WebP) ou vídeos (MP4, WebM).');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('Arquivo muito grande. Tamanho máximo: 10MB.');
      return false;
    }
    
    return true;
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onClose();
    }
  };

  const isAtLimit = currentAssetsCount >= maxAssets;

  return (
    <div className="w-[450px] p-4 bg-background border border-border rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Inserir Mídia</h3>
        </div>

        {isAtLimit ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">
              Limite de {maxAssets} ativo{maxAssets > 1 ? 's' : ''} atingido
            </div>
            <div className="text-sm text-muted-foreground">
              Remova um ativo existente para adicionar um novo
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Formatos aceitos: JPEG, PNG, GIF, WebP, MP4, WebM (máx. 10MB)
              </div>
              
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      {selectedFile.type.startsWith('image/') ? (
                        <Image className="w-8 h-8 text-primary" />
                      ) : (
                        <Video className="w-8 h-8 text-primary" />
                      )}
                      <span className="font-medium">{selectedFile.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <div className="font-medium">Arraste e solte um arquivo aqui</div>
                      <div className="text-sm text-muted-foreground">ou clique para selecionar</div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Selecionar arquivo
                    </Button>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile}
              >
                Inserir mídia
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 