"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

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

export function QuizPanel() {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const getCorrectAnswers = () => {
    return mockQuizQuestions.filter(q => quizAnswers[q.id] === q.correctAnswer).length;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold">Quiz</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Teste seus conhecimentos</p>
      </div>

      {/* Conteúdo do Quiz */}
      <ScrollArea className="flex-1 p-4">
        {!quizSubmitted ? (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Teste seus conhecimentos sobre meditação para iniciantes. Selecione a resposta correta para cada pergunta.
            </p>
            
            {mockQuizQuestions.map((question) => (
              <div key={question.id} className="space-y-3">
                <h4 className="font-medium text-sm">{question.question}</h4>
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
          </div>
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
      </ScrollArea>
    </div>
  );
} 