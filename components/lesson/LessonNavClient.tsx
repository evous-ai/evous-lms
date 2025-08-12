'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface LessonNavClientProps {
  anterior: string
  proxima: string
}

export default function LessonNavClient({ anterior, proxima }: LessonNavClientProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant="outline"
        size="icon"
        className="rounded-full"
      >
        <Link href={anterior}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      
      <Button
        asChild
        variant="outline"
        size="icon"
        className="rounded-full"
      >
        <Link href={proxima}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
} 