"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface PoweredByEvousProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PoweredByEvous({ size = "md", className = "" }: PoweredByEvousProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar hidratação incorreta
  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeConfig = {
    sm: {
      textSize: "text-xs",
      logoHeight: 16,
      logoWidth: 48,
      gap: "gap-1"
    },
    md: {
      textSize: "text-sm",
      logoHeight: 20,
      logoWidth: 60,
      gap: "gap-2"
    },
    lg: {
      textSize: "text-base",
      logoHeight: 24,
      logoWidth: 72,
      gap: "gap-2"
    }
  }

  const config = sizeConfig[size]

  // Determinar qual logo usar baseado no tema resolvido
  const getLogoSrc = () => {
    if (!mounted) {
      // Durante SSR, usar logo dark como padrão
      return "/evous_logo.svg"
    }
    
    // No cliente, usar o tema resolvido
    const currentTheme = resolvedTheme || theme
    return currentTheme === "light" ? "/evous_logo_light.svg" : "/evous_logo.svg"
  }

  return (
    <div className={`flex items-center justify-center ${config.gap} ${className}`}>
      <span className={`text-muted-foreground ${config.textSize}`}>
        Powered by
      </span>
      <a href="https://www.evous.ai" target="_blank" rel="noopener noreferrer" className="inline-flex">
        <Image
          src={getLogoSrc()}
          alt="Evous"
          width={config.logoWidth}
          height={config.logoHeight}
          className="object-contain"
          style={{ width: "auto", height: "auto" }}
        />
      </a>
    </div>
  )
}
