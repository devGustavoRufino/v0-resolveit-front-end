"use client"

import { useEffect, useState } from "react"
import { Server, AlertTriangle, RefreshCw, CheckCircle2, TrendingUp } from "lucide-react"
import { getAssets, getIntegrationLogs, type Asset, type IntegrationLog } from "@/lib/api"
import { StatusBadge } from "@/components/status-badge"
import { cn } from "@/lib/utils"

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  hint: string
  icon: typeof Server
  accent?: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-lg",
            accent ? "bg-primary/15 text-primary" : "bg-secondary text-foreground",
          )}
        >
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

export function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [logs, setLogs] = useState<IntegrationLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAssets(), getIntegrationLogs()]).then(([a, l]) => {
      setAssets(a)
      setLogs(l)
      setLoading(false)
    })
  }, [])

  const openIncidents = 7
  const lastSync = "07/06/2026 09:42"

  return (
    <div className="space-y-6 p-8">
      {/* Cards de indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total de Ativos"
          value={loading ? "—" : String(assets.length)}
          hint="Inventário sincronizado com a CMDB"
          icon={Server}
          accent
        />
        <StatCard
          label="Incidentes Abertos"
          value={String(openIncidents)}
          hint="Em acompanhamento no ServiceNow"
          icon={AlertTriangle}
        />
        <StatCard
          label="Última Sincronização"
          value={lastSync}
          hint="Integração executada com sucesso"
          icon={RefreshCw}
        />
      </div>

      {/* Logs de integração */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Últimos logs de integração
            </h2>
            <p className="text-sm text-muted-foreground">
              Eventos recentes da ponte com o ServiceNow
            </p>
          </div>
          <CheckCircle2 className="size-5 text-primary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 font-medium">Horário</th>
                <th className="px-6 py-3 font-medium">Ação</th>
                <th className="px-6 py-3 font-medium">Referência</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
                  <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{log.timestamp}</td>
                  <td className="px-6 py-3.5 text-foreground">{log.action}</td>
                  <td className="px-6 py-3.5 font-mono text-xs text-primary">{log.reference}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
