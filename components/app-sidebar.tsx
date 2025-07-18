"use client"

import * as React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  AudioWaveform,
  BookCopy,
  BookOpen,
  Bot,
  Command,
  Flag,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "edgar.fonseca",
    email: "edgar.fonseca@evous.ai",
    avatar: "/avatars/shadcn.jpg",
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
      logo: Command,
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
  const [currentLogoSrc, setCurrentLogoSrc] = React.useState("/evous_logo.svg")
  const [currentWidth, setCurrentWidth] = React.useState(120)
  const [currentHeight, setCurrentHeight] = React.useState(40)
  
  // Debug temporário
  console.log("Sidebar state:", state, "Theme:", theme)
  
  React.useEffect(() => {
    let logoSrc = "/evous_logo.svg" // padrão (dark mode, sidebar expandido)
    let logoWidth = 120
    let logoHeight = 40
    
    // Prioriza o estado do sidebar sobre o tema
    if (state === "collapsed") {
      logoSrc = "/evous_logo_box.svg" // sidebar comprimido
      logoWidth = 40
      logoHeight = 40
      console.log("🔄 Mudando para logo box:", logoSrc)
    } else {
      // Só aplica o tema light se o sidebar estiver expandido
      if (theme === "light") {
        logoSrc = "/evous_logo_light.svg" // light mode
        console.log("☀️ Mudando para logo light:", logoSrc)
      } else {
        console.log("🌙 Usando logo dark padrão:", logoSrc)
      }
    }
    
    console.log("📊 Configuração final:", { logoSrc, logoWidth, logoHeight, state, theme })
    setCurrentLogoSrc(logoSrc)
    setCurrentWidth(logoWidth)
    setCurrentHeight(logoHeight)
  }, [state, theme])
  
  return (
    <div className="px-4 py-3 flex items-center justify-start min-h-[60px] w-full overflow-hidden">
      <Image 
        src={currentLogoSrc} 
        alt="Evous Logo" 
        width={currentWidth} 
        height={currentHeight} 
        priority
        className="transition-all duration-200 object-contain flex-shrink-0"
        onError={(e) => {
          console.error("Erro ao carregar logo:", currentLogoSrc)
          // Fallback para o logo padrão se houver erro
          if (currentLogoSrc !== "/evous_logo.svg") {
            setCurrentLogoSrc("/evous_logo.svg")
            setCurrentWidth(120)
            setCurrentHeight(40)
          }
        }}
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <TeamSwitcher teams={data.teams} />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
