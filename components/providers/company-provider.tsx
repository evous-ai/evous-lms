'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Company } from '@/lib/types'
import { getDefaultCompany } from '@/lib/company'
import { DEFAULT_COMPANY } from '@/lib/company-defaults'

interface CompanyContextType {
  company: Company | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

interface CompanyProviderProps {
  children: ReactNode
  initialCompany?: Company | null
}

export function CompanyProvider({ children, initialCompany }: CompanyProviderProps) {
  const [company, setCompany] = useState<Company | null>(initialCompany || DEFAULT_COMPANY)
  const [loading, setLoading] = useState(!initialCompany)
  const [error, setError] = useState<string | null>(null)

  const fetchCompany = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await getDefaultCompany()
      
      if (result.success && result.company) {
        setCompany(result.company)
      } else {
        // Se falhar, mantém os dados padrão
        console.warn('Falha ao buscar dados da empresa, usando dados padrão:', result.error)
        setCompany(DEFAULT_COMPANY)
      }
    } catch (err) {
      console.error('Erro no CompanyProvider:', err)
      // Em caso de erro, mantém os dados padrão
      setCompany(DEFAULT_COMPANY)
    } finally {
      setLoading(false)
    }
  }

  const refetch = async () => {
    await fetchCompany()
  }

  useEffect(() => {
    // Se não temos dados iniciais, busca da API
    if (!initialCompany) {
      fetchCompany()
    }
  }, [initialCompany])

  const value: CompanyContextType = {
    company,
    loading,
    error,
    refetch
  }

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  const context = useContext(CompanyContext)
  
  if (context === undefined) {
    throw new Error('useCompany deve ser usado dentro de um CompanyProvider')
  }
  
  return context
}

// Hook para acessar apenas a empresa (sem loading/error)
export function useCompanyData() {
  const { company } = useCompany()
  return company
}

// Hook para acessar apenas a cor primária
export function useCompanyColor() {
  const { company } = useCompany()
  return company?.primary_color || DEFAULT_COMPANY.primary_color
}

// Hook para acessar apenas o logo
export function useCompanyLogo() {
  const { company } = useCompany()
  return {
    logo: company?.logo || DEFAULT_COMPANY.logo,
    darkLogo: company?.dark_logo || DEFAULT_COMPANY.dark_logo,
    icon: company?.icon || DEFAULT_COMPANY.icon
  }
}
