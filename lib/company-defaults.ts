import { Company } from './types'

/**
 * Dados padrão da empresa Lubrax
 * Usado como fallback quando não há dados no banco
 */
export const DEFAULT_COMPANY: Company = {
  id: 'c9551059-35fb-4c5e-bcb7-bc09ddc25f31',
  name: 'Lubrax',
  primary_color: '#144722',
  logo: '/logo_lubrax_lightmode.png',
  dark_logo: '/logo_lubrax_darkmode.png',
  icon: '/favicon_lubrax.png',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

/**
 * Cores padrão para diferentes empresas
 * Útil para desenvolvimento e fallback
 */
export const COMPANY_COLORS: Record<string, string> = {
  'c9551059-35fb-4c5e-bcb7-bc09ddc25f31': '#144722', // Lubrax
  'default': '#144722' // Cor padrão
}

/**
 * Logos padrão para diferentes empresas
 * Útil para desenvolvimento e fallback
 */
export const COMPANY_LOGOS: Record<string, { logo: string; darkLogo: string; icon: string }> = {
  'c9551059-35fb-4c5e-bcb7-bc09ddc25f31': {
    logo: '/logo_lubrax_lightmode.png',
    darkLogo: '/logo_lubrax_darkmode.png',
    icon: '/favicon_lubrax.png'
  },
  'default': {
    logo: '/logo_lubrax_lightmode.png',
    darkLogo: '/logo_lubrax_darkmode.png',
    icon: '/favicon_lubrax.png'
  }
}
