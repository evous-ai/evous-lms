"use client"

import { useState } from 'react';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { MessageSquare, ListChecks, Paperclip, BookOpen, Share2 } from 'lucide-react';
import { CommentsPanel } from './CommentsPanel';
import { QuizPanel } from './QuizPanel';
import { AttachmentsPanel } from './AttachmentsPanel';
import { NotesPanel } from './NotesPanel';
import { SharePanel } from './SharePanel';

type ActionType = 'comments' | 'quiz' | 'attachments' | 'notes' | 'share' | null;

interface ActionsSidebarProps {
  onPanelStateChange?: (isOpen: boolean) => void;
}

export function ActionsSidebar({ onPanelStateChange }: ActionsSidebarProps) {
  // Estado inicial sempre com comentários ativo
  const [activeAction, setActiveAction] = useState<ActionType>('comments');

  const actions = [
    {
      id: 'comments' as ActionType,
      icon: MessageSquare,
      title: 'Comentários',
      description: 'Ver e adicionar comentários sobre a aula',
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      id: 'quiz' as ActionType,
      icon: ListChecks,
      title: 'Quiz',
      description: 'Teste seus conhecimentos com perguntas',
      color: 'text-green-600 hover:text-green-700'
    },
    {
      id: 'attachments' as ActionType,
      icon: Paperclip,
      title: 'Anexos',
      description: 'Materiais complementares da aula',
      color: 'text-purple-600 hover:text-purple-700'
    },
    {
      id: 'notes' as ActionType,
      icon: BookOpen,
      title: 'Notas',
      description: 'Suas anotações pessoais',
      color: 'text-orange-600 hover:text-orange-700'
    },
    {
      id: 'share' as ActionType,
      icon: Share2,
      title: 'Compartilhar',
      description: 'Compartilhar esta aula',
      color: 'text-gray-600 hover:text-gray-700'
    }
  ];

  const handleActionClick = (actionId: ActionType) => {
    if (activeAction === actionId) {
      // Não permitir fechar a aba ativa - sempre deve haver uma selecionada
      return;
    } else {
      setActiveAction(actionId); // Trocar para nova ação
      onPanelStateChange?.(true); // Notificar que o painel está ativo
    }
  };

  const renderContentPanel = () => {
    switch (activeAction) {
      case 'comments':
        return <CommentsPanel />;
      case 'quiz':
        return <QuizPanel />;
      case 'attachments':
        return <AttachmentsPanel />;
      case 'notes':
        return <NotesPanel />;
      case 'share':
        return <SharePanel />;
      default:
        return <CommentsPanel />; // Fallback para comentários
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Menu superior - Desktop e Mobile - vem ANTES do conteúdo */}
      <div className="w-full mt-8 mb-4">
        <Menubar className="justify-around">
          {actions.map((action) => {
            const Icon = action.icon;
            const isActive = activeAction === action.id;
            
            return (
              <MenubarMenu key={action.id}>
                <MenubarTrigger 
                  onClick={() => handleActionClick(action.id)} 
                  aria-label={action.title}
                  className={isActive ? 'bg-accent text-accent-foreground' : ''}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {action.title}
                </MenubarTrigger>
              </MenubarMenu>
            );
          })}
        </Menubar>
      </div>

      {/* Painel de Conteúdo - sempre visível, ABAIXO do menu */}
      <div className="w-full p-4 bg-card border border-border rounded-lg">
        {renderContentPanel()}
      </div>
    </div>
  );
} 