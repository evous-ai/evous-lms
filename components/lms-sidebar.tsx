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

// Dados do usuário para o footer
const userData = {
  user: {
    name: "edgar.fonseca",
    email: "edgar.fonseca@evous.ai",
    initials: "EF",
  },
}

function DynamicLogo() {
  const { theme } = useTheme()
  const { state } = useSidebar()
  const [logo, setLogo] = React.useState({
    src: "/evous_logo.svg",
    width: 120,
    height: 40,
  })

  React.useEffect(() => {
    if (state === "collapsed") {
      setLogo({
        src: "/evous_logo_box.svg",
        width: 40,
        height: 40,
      })
    } else if (theme === "light") {
      setLogo({
        src: "/evous_logo_light.svg",
        width: 120,
        height: 40,
      })
    } else {
      setLogo({
        src: "/evous_logo.svg",
        width: 120,
        height: 40,
      })
    }
  }, [state, theme])

  // Log para depuração
  if (!logo.width || !logo.height) {
    console.error("Logo state inválido:", logo)
    return null // Não renderiza nada se width/height não estiverem definidos
  }

  return (
    <div className={state === "collapsed" ? "flex items-center justify-center py-3 min-h-[60px] w-full" : "px-4 py-3 flex items-center justify-start min-h-[60px] w-full overflow-hidden"}>
      <Image
        src={logo.src}
        alt="Evous Logo"
        width={logo.width}
        height={logo.height}
        priority
        className={state === "collapsed" ? "transition-all duration-200 object-contain flex-shrink-0 mx-auto" : "transition-all duration-200 object-contain flex-shrink-0"}

      />
    </div>
  )
}

export function LMSSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
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
              <SidebarMenuButton asChild tooltip="Minhas Trilhas">
                <Link href="/trilha">
                  <BookOpen />
                  <span>Minhas Trilhas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Biblioteca">
                <Link href="/biblioteca">
                  <Library />
                  <span>Biblioteca</span>
                </Link>
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
              <SidebarMenuButton asChild tooltip="Missões Ativas">
                <Link href="/missoes">
                  <Target />
                  <span>Missões Ativas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Footer com usuário */}
      <SidebarFooter>
        <NavUserAluno user={userData.user} />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
} 