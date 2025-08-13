'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function AutoRedirectClient() {
  const [countdown, setCountdown] = useState(3)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <p className="text-xs text-muted-foreground text-center">
      Você será redirecionado automaticamente em {countdown}s.
    </p>
  )
} 