"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Image, Smile, Paperclip, Send } from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  time: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    name: 'Erling Highland',
    avatar: '/avatar_default.png',
    text: 'Excelente introdução! A explicação sobre os fundamentos da meditação foi muito clara.',
    time: '2d'
  },
  {
    id: '2',
    name: 'Brooklyn Simmons',
    avatar: '/avatar_default_002.png',
    text: 'Gostei muito da abordagem prática. Já comecei a aplicar algumas técnicas.',
    time: '2d'
  },
  {
    id: '3',
    name: 'Dianne Russell',
    avatar: '/avatar_default_003.png',
    text: 'Perfeito para iniciantes como eu. A progressão dos conceitos é muito bem feita.',
    time: '2d'
  },
  {
    id: '4',
    name: 'Ben Mingo',
    avatar: '/avatar_default.png',
    text: 'A parte sobre respiração foi reveladora. Nunca tinha pensado nisso dessa forma.',
    time: '2d'
  }
];

export function CommentsPanel() {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setCommentText('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Comentários</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{mockComments.length} comentários</p>
      </div>

      {/* Lista de comentários */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {mockComments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatar} alt={comment.name} />
                  <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">{comment.name}</span>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="text-sm text-foreground">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <button className="hover:text-foreground">Like</button>
                    <span>·</span>
                    <button className="hover:text-foreground">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input para novo comentário */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Adicionar comentário..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1"
          />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={handleCommentSubmit}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 