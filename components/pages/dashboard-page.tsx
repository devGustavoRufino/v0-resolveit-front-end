"use client"

import { useEffect, useState } from "react"
import { Server, AlertTriangle, RefreshCw, CheckCircle2, TrendingUp } from "lucide-react"
import { useStore } from "@/lib/store"
import { StatusBadge } from "@/components/status-badge"
import { cn } from "@/lib/utils"

function StatCard({ label, value, hint, icon: Icon, accent }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={cn("flex size-11 items-center justify-center rounded-lg", accent ? "bg-primary/15 text-primary" : "bg-secondary text-foreground")}>
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <TrendingUp className="size-3.5 text-primary" />
        {hint}
      </p>
    </div>
  )
}

function LiveClock() {
  // 1. Inicializamos com null para evitar que o servidor tente adivinhar a hora
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    // 2. Só pegamos a hora exata depois que o componente carrega no navegador do usuário
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 3. Se for o servidor renderizando, mostra um "esqueleto" piscando (efeito pulse do Tailwind)
  if (!now) {
    return <div className="h-8 w-32 animate-pulse rounded bg-secondary/50" />
  }

  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
        {now.toLocaleTimeString("pt-BR")}
      </span>
      <span className="text-sm text-muted-foreground">
        {now.toLocaleDateString("pt-BR")}
      </span>
    </div>
  )
}

export function DashboardPage() {
  const { devices, logs, loading } = useStore()

  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total de Ativos" value={loading ? "—" : String(devices.length)} hint="Dispositivos no banco" icon={Server} accent />
        <StatCard label="Logs do Sistema" value={String(logs.length)} hint="Eventos registrados no banco" icon={AlertTriangle} />
        
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Última Sincronização</p>
              <div className="mt-2"><LiveClock /></div>
            </div>
            <div className="flex size-11 items-center justify-center rounded-lg bg-secondary text-foreground">
              <RefreshCw className="size-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Últimos logs</h2>
          </div>
          <CheckCircle2 className="size-5 text-primary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="px-6 py-3">Horário</th>
                <th className="px-6 py-3">Operação</th>
                <th className="px-6 py-3">Descrição</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 8).map((log) => (
                <tr key={log.id} className="border-b border-border/60 hover:bg-secondary/40">
                  <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{log.date_hour}</td>
                  <td className="px-6 py-3.5 font-bold text-primary">{log.operation}</td>
                  <td className="px-6 py-3.5 text-foreground">{log.description}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={log.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}