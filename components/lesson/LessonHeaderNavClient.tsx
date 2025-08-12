"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LessonHeaderNavClientProps {
  prevHref: string;
  nextHref: string;
}

export default function LessonHeaderNavClient({ prevHref, nextHref }: LessonHeaderNavClientProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="rounded-full" asChild>
        <Link href={prevHref}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" className="rounded-full" asChild>
        <Link href={nextHref}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
} 