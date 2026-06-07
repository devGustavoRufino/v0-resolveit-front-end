"use client"

import { cn } from "@/lib/utils"
import { LayoutDashboard, Server, AlertTriangle, Network, ShieldCheck, CircleDot } from "lucide-react"

export type Page = "dashboard" | "ativos" | "incidente" | "topologia"

interface SidebarProps {
  current: Page
  onNavigate: (page: Page) => void
}

const NAV: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ativos", label: "Gestão de Ativos", icon: Server },
  { id: "incidente", label: "Abrir Incidente", icon: AlertTriangle },
  { id: "topologia", label: "Topologia de Rede", icon: Network },
]

export function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-base font-bold text-sidebar-foreground">
            Resolve<span className="text-primary">IT</span>
          </p>
          <p className="text-xs text-muted-foreground">Gestão de Ativos</p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {NAV.map((item) => {
          const Icon = item.icon
          const active = current === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Status da integração */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2.5">
          <CircleDot className="size-4 text-primary" />
          <div className="leading-tight">
            <p className="text-xs font-medium text-sidebar-foreground">ServiceNow</p>
            <p className="text-xs text-primary">Conectado</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
