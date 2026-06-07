"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Settings, ExternalLink, LogOut, UserCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import type { Page } from "@/components/sidebar"

interface TopbarProps {
  title: string
  subtitle: string
  onNavigate: (page: Page) => void
}

export function Topbar({ title, subtitle, onNavigate }: TopbarProps) {
  const { user } = useStore()
  const { push } = useToast()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <header className="flex items-center justify-between border-b border-border bg-card/40 px-8 py-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground text-balance">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 rounded-full py-1 pl-3 pr-1.5 transition-colors hover:bg-secondary"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {user.initials}
          </div>
          <ChevronDown
            className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {/* Cabeçalho do usuário */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-4">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                {user.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Opções */}
            <div className="py-1.5">
              <MenuItem
                icon={UserCircle}
                label="Configurações da Conta"
                onClick={() => {
                  setOpen(false)
                  push({ type: "info", title: "Configurações da Conta", description: "Abrindo preferências do perfil..." })
                }}
              />
              <MenuItem
                icon={Settings}
                label="Preferências do Sistema"
                onClick={() => {
                  setOpen(false)
                  push({ type: "info", title: "Preferências", description: "Painel de preferências em breve." })
                }}
              />
              <MenuItem
                icon={ExternalLink}
                label="Acessar ServiceNow"
                onClick={() => {
                  setOpen(false)
                  push({ type: "success", title: "ServiceNow", description: "Redirecionando para o portal ServiceNow..." })
                }}
              />
            </div>

            <div className="border-t border-border py-1.5">
              <MenuItem
                icon={LogOut}
                label="Sair"
                destructive
                onClick={() => {
                  setOpen(false)
                  push({ type: "info", title: "Sessão encerrada", description: "Você saiu da sua conta." })
                }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  destructive,
}: {
  icon: typeof Settings
  label: string
  onClick: () => void
  destructive?: boolean
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
        destructive
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-secondary",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </button>
  )
}
