"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MessageSquare, ListChecks, Share2, X, Image, Smile, Paperclip, Send, Copy, Check } from 'lucide-react';

type ActivePanel = 'comments' | 'quiz' | 'share';

interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  time: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
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

const mockQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Qual é o objetivo principal da meditação para iniciantes?',
    options: [
      'Esvaziar completamente a mente',
      'Desenvolver foco e consciência',
      'Dormir melhor à noite',
      'Reduzir o estresse apenas'
    ],
    correctAnswer: 1
  },
  {
    id: '2',
    question: 'Qual técnica é mais adequada para iniciantes?',
    options: [
      'Meditação transcendental',
      'Foco na respiração',
      'Visualização complexa',
      'Mantras em sânscrito'
    ],
    correctAnswer: 1
  },
  {
    id: '3',
    question: 'Quanto tempo é recomendado para iniciantes?',
    options: [
      '1 hora por dia',
      '30 minutos duas vezes ao dia',
      '5-10 minutos por dia',
      'Apenas nos fins de semana'
    ],
    correctAnswer: 2
  }
];

export default function RightSidebarClient() {
  const [activePanel, setActivePanel] = useState<ActivePanel>('comments');
  const [isOpen, setIsOpen] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setCommentText('');
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Erro ao copiar link');
    }
  };

  const getCorrectAnswers = () => {
    return mockQuizQuestions.filter(q => quizAnswers[q.id] === q.correctAnswer).length;
  };

  const renderComments = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Comentários</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-end mb-3">
        <div className="flex flex-col gap-1">
          <Button
            variant={activePanel === 'comments' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('comments')}
            className="h-8 w-8 p-0"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant={activePanel === 'quiz' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('quiz')}
            className="h-8 w-8 p-0"
          >
            <ListChecks className="h-4 w-4" />
          </Button>
          <Button
            variant={activePanel === 'share' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('share')}
            className="h-8 w-8 p-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{mockComments.length} comentários</p>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)] md:h-[calc(100vh-260px)]">
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

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a comment..."
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
    </>
  );

  const renderQuiz = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Quiz</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-end mb-3">
        <div className="flex flex-col gap-1">
          <Button
            variant={activePanel === 'comments' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('comments')}
            className="h-8 w-8 p-0"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant={activePanel === 'quiz' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('quiz')}
            className="h-8 w-8 p-0"
          >
            <ListChecks className="h-4 w-4" />
          </Button>
          <Button
            variant={activePanel === 'share' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('share')}
            className="h-8 w-8 p-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)] md:h-[calc(100vh-260px)]">
        <div className="space-y-6">
          {!quizSubmitted ? (
            <>
              <p className="text-sm text-muted-foreground">
                Teste seus conhecimentos sobre meditação para iniciantes. Selecione a resposta correta para cada pergunta.
              </p>
              
              {mockQuizQuestions.map((question) => (
                <div key={question.id} className="space-y-3">
                  <h4 className="font-medium">{question.question}</h4>
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          value={index}
                          checked={quizAnswers[question.id] === index}
                          onChange={(e) => setQuizAnswers(prev => ({
                            ...prev,
                            [question.id]: parseInt(e.target.value)
                          }))}
                          className="text-emerald-600"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={handleQuizSubmit}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                Enviar respostas
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-emerald-600">
                {getCorrectAnswers()}/{mockQuizQuestions.length} acertos!
              </div>
              <p className="text-sm text-muted-foreground">
                {getCorrectAnswers() === mockQuizQuestions.length 
                  ? 'Parabéns! Você acertou todas as questões.' 
                  : 'Continue estudando para melhorar seus conhecimentos.'}
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
              >
                Tentar novamente
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );

  const renderShare = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Compartilhar</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-end mb-3">
        <div className="flex flex-col gap-1">
          <Button
            variant={activePanel === 'comments' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('comments')}
            className="h-8 w-8 p-0"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant={activePanel === 'quiz' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('quiz')}
            className="h-8 w-8 p-0"
          >
            <ListChecks className="h-4 w-4" />
          </Button>
          <Button
            variant={activePanel === 'share' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('share')}
            className="h-8 w-8 p-0"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Compartilhar esta aula:</p>
          <div className="flex gap-2">
            <Input value={window.location.href} readOnly className="flex-1" />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyLink}
              className="min-w-fit"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Compartilhar via:</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              asChild
              className="flex-1"
            >
              <a 
                href={`https://wa.me/?text=${encodeURIComponent('Confira esta aula: ' + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              asChild
              className="flex-1"
            >
              <a 
                href={`mailto:?subject=${encodeURIComponent('Trajetória Vibra - Introdução à meditação para iniciantes')}&body=${encodeURIComponent('Confira esta aula: ' + window.location.href)}`}
              >
                Email
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activePanel) {
      case 'comments':
        return renderComments();
      case 'quiz':
        return renderQuiz();
      case 'share':
        return renderShare();
      default:
        return renderComments();
    }
  };

  if (!isOpen) {
    return (
      <div className="hidden lg:block">
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(true)}
          className="w-full"
        >
          Mostrar sidebar
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white border rounded-2xl shadow-none p-4 sticky top-6 h-[calc(100vh-3rem)]">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              Comentários / Quiz / Compartilhar
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[360px] p-0">
            <div className="p-4 h-full">
              {renderContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
} 