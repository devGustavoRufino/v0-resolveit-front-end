"use client"

// =============================================================
// ResolveIT — Sistema de Toast (notificações)
//
// Provider leve para exibir avisos no canto da tela. As telas
// disparam toasts via useToast().push(...).
// =============================================================

import { createContext, useCallback, useContext, useState } from "react"
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: number
  type: ToastType
  title: string
  description?: string
}

interface ToastValue {
  push: (toast: Omit<Toast, "id">) => void
}

const ToastContext = createContext<ToastValue | null>(null)

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
}

const ACCENTS: Record<ToastType, string> = {
  success: "border-primary/40 text-primary",
  error: "border-destructive/40 text-destructive",
  info: "border-border text-foreground",
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { ...toast, id }])
      setTimeout(() => remove(id), 5000)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((t) => {
          const Icon = ICONS[t.type]
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border bg-card px-4 py-3.5 shadow-2xl",
                "animate-in slide-in-from-bottom-4 fade-in duration-300",
                ACCENTS[t.type],
              )}
            >
              <Icon className="mt-0.5 size-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{t.title}</p>
                {t.description && <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Fechar notificação"
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>")
  return ctx
}
