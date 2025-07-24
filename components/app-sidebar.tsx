"use client"

import * as React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  AudioWaveform,
  BookCopy,
  Flag,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Route,
  House,
  Sparkles,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
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

// This is sample data.
const data = {
  user: {
    name: "edgar.fonseca",
    email: "edgar.fonseca@evous.ai",
    // avatar: undefined, // Não usar imagem
    initials: "EF",
  },
  teams: [
    {
      name: "Marketing",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Financeiro",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Recursos Humanos",
      logo: GalleryVerticalEnd, // Substituído Command por GalleryVerticalEnd
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Fontes de Dados",
      url: "#",
      icon: BookCopy,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Ativos",
      url: "#",
      icon: GalleryVerticalEnd,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Minhas Marcas",
      url: "#",
      icon: Flag,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex-shrink-0">
        <DynamicLogo />
      </SidebarHeader>
      <SidebarContent>
        {/* Link Início */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Início">
                <a href="#">
                  <House />
                  <span>Início</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Bloco: Base de Conhecimento */}
        <SidebarGroup>
          <SidebarGroupLabel>Base de Conhecimento</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Fontes de Dados">
                <a href="#">
                  <BookCopy />
                  <span>Fontes de Dados</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Ativos">
                <a href="#">
                  <GalleryVerticalEnd />
                  <span>Ativos</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Minhas Marcas">
                <a href="#">
                  <Flag />
                  <span>Minhas Marcas</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Bloco: Geração */}
        <SidebarGroup>
          <SidebarGroupLabel>Geração</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Jornadas">
                <a href="#">
                  <Route />
                  <span>Jornadas</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Assistente IA" className="opacity-50 pointer-events-none">
                <a href="#">
                  <Sparkles />
                  <span>Assistente IA</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Bloco: Insights */}
        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <a href="#">
                  <PieChart />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <TeamSwitcher teams={data.teams} />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
