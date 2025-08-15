"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

// Rotas disponíveis na aplicação
const ROTAS_DISPONIVEIS = new Set([
  "/",
  "/dashboard",
  "/dashboard-gestor",
  "/meus-treinamentos",
  "/perfil",
  "/tutor",
  "/video-preview",
  "/video-success",
  "/auth/callback",
  "/trilha/trajetoria-vibra",
  "/trilha/trajetoria-vibra/aula-1-cerebro-medula",
  "/trilha/trajetoria-vibra/aula-2-neuronios",
  "/trilha/trajetoria-vibra/aula-3-sinapses",
  "/trilha/trajetoria-vibra/aula-4-snc-snp",
  "/trilha/trajetoria-vibra/aula-5-patologias",
  "/trilha/trajetoria-vibra/aula-6-sinais-sintomas",
  "/trilha/trajetoria-vibra/aula-7-glossario",
  "/trilha/trajetoria-vibra/aula-8-aplicacoes-praticas",
])

export function useLinkInterceptor() {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean }>({
    isOpen: false,
  })
  const router = useRouter()

  const interceptLink = useCallback((href: string, e?: React.MouseEvent) => {
    // Se for link externo (http/https), permitir navegação
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return true
    }

    // Se for link interno mas não estiver nas rotas disponíveis
    if (!ROTAS_DISPONIVEIS.has(href)) {
      if (e) {
        e.preventDefault()
      }
      setModalConfig({ isOpen: true })
      return false
    }

    // Se for rota disponível, permitir navegação
    return true
  }, [])

  const closeModal = useCallback(() => {
    setModalConfig({ isOpen: false })
  }, [])

  return {
    modalConfig,
    closeModal,
    interceptLink,
  }
} 