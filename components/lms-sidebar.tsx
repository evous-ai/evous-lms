"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  House,
  BookOpen,
  Library,
  BarChart3,
  Target,
} from "lucide-react"

import { NavUserAluno } from "@/components/nav-user-aluno"
import { AreaIndisponivelModal } from "@/components/modals/area-indisponivel-modal"
import { useLinkInterceptor } from "@/hooks/use-link-interceptor"
import { PoweredByEvous } from "@/components/powered-by-evous"
import { useCompanyLogo } from "@/components/providers/company-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

// Props do componente
interface LMSSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    id: string
    email?: string
  }
  profile: {
    full_name?: string | null
    country?: string | null
  } | null
}

function DynamicLogo() {
  const { theme } = useTheme()
  const { state } = useSidebar()
  const { logo, darkLogo, icon } = useCompanyLogo()
  
  const [logoConfig, setLogoConfig] = React.useState({
    src: darkLogo,
    width: 120,
    height: 40,
  })

  React.useEffect(() => {
    if (state === "collapsed") {
      setLogoConfig({
        src: icon,
        width: 40,
        height: 40,
      })
    } else if (theme === "light") {
      setLogoConfig({
        src: logo,
        width: 120,
        height: 40,
      })
    } else {
      setLogoConfig({
        src: darkLogo,
        width: 120,
        height: 40,
      })
    }
  }, [state, theme, logo, darkLogo, icon])

  // Log para depuração
  if (!logoConfig.width || !logoConfig.height) {
    console.error("Logo state inválido:", logoConfig)
    return null // Não renderiza nada se width/height não estiverem definidos
  }

  return (
    <div className={state === "collapsed" ? "flex items-center justify-center py-3 min-h-[60px] w-full" : "px-4 py-3 flex items-center justify-start min-h-[60px] w-full overflow-hidden"}>
      <Image
        src={logoConfig.src}
        alt="Logo da Empresa"
        width={logoConfig.width}
        height={logoConfig.height}
        priority
        className={state === "collapsed" ? "transition-all duration-200 object-contain flex-shrink-0 mx-auto" : "transition-all duration-200 object-contain flex-shrink-0"}
        style={{ width: "auto", height: "auto" }}
      />
    </div>
  )
}

export function LMSSidebar({ user, profile, ...props }: LMSSidebarProps) {
  const { modalConfig, closeModal, interceptLink } = useLinkInterceptor()
  const { state } = useSidebar()

  // Gerar iniciais do nome ou email
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user.email) {
      return user.email.split('@')[0].slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  // Dados do usuário para o footer
  const userData = {
    user: {
      name: profile?.full_name || user.email?.split('@')[0] || 'Usuário',
      email: user.email || 'sem-email@exemplo.com',
      initials: getInitials(),
    },
  }

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (!interceptLink(href, e)) {
      // Se o link foi interceptado, não fazer nada (o modal será mostrado)
      return
    }
    // Se não foi interceptado, permitir navegação normal
  }

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="flex-shrink-0">
          <DynamicLogo />
        </SidebarHeader>
        
        <SidebarContent>
          {/* 1. INÍCIO */}
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Início">
                  <Link href="/dashboard">
                    <House />
                    <span>Início</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* 2. APRENDER */}
          <SidebarGroup>
            <SidebarGroupLabel>Aprender</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Meus Treinamentos">
                  <Link href="/meus-treinamentos">
                    <BookOpen />
                    <span>Meus Treinamentos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Biblioteca"
                  onClick={(e) => handleLinkClick("/biblioteca", e)}
                >
                  <Library />
                  <span>Biblioteca</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* 3. MEU PROGRESSO */}
          <SidebarGroup>
            <SidebarGroupLabel>Meu Progresso</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Meu Desempenho">
                  <Link href="/dashboard">
                    <BarChart3 />
                    <span>Meu Desempenho</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Missões Ativas"
                  onClick={(e) => handleLinkClick("/missoes", e)}
                >
                  <Target />
                  <span>Missões Ativas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        
        {/* Footer com usuário */}
        <SidebarFooter>
          <NavUserAluno user={userData.user} />
          {state !== "collapsed" && (
            <div className="px-4 py-4 border-t border-border">
              <PoweredByEvous size="sm" />
            </div>
          )}
        </SidebarFooter>
        
        <SidebarRail />
      </Sidebar>

      {/* Modal de área indisponível */}
      <AreaIndisponivelModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
      />
    </>
  )
} 