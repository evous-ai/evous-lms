import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export function CourseHeader() {
  return (
    <div className="w-full bg-background border-b border-border z-50 sticky top-0">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center gap-3">
        <Link 
          href="/trilha/trajetoria-vibra" 
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <span className="font-medium text-base md:text-lg text-foreground whitespace-normal">
          A Base da Prática Diária de Meditação
        </span>
      </div>
    </div>
  )
} 