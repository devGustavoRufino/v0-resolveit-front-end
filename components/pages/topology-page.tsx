"use client"

import { ArrowRight, Server, Router, Wifi, Laptop, ShieldAlert, Network as NetworkIcon } from "lucide-react"
import { useStore } from "@/lib/store"
import { useMemo } from "react"

function deviceIcon(type: string) {
  // Ajustado para os nomes reais que vi no seu Supabase
  if (type.includes("personal_computer")) return Laptop
  if (type.includes("server")) return Server
  if (type.includes("switch")) return Router
  return NetworkIcon
}

function DeviceNode({ name, type }: { name: string; type: string }) {
  const Icon = deviceIcon(type)
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
        <Icon className="size-4.5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{type}</p>
      </div>
    </div>
  )
}

export function TopologyPage() {
  const { connections, devices, loading } = useStore()

  // Cruza IDs das conexões com a lista de dispositivos para obter nomes/tipos
  const processedConnections = useMemo(() => {
    return connections.map((c) => {
      const sourceDev = devices.find((d) => d.id === c.source_id)
      const targetDev = devices.find((d) => d.id === c.destination_id)
      return {
        ...c,
        sourceName: sourceDev?.name || "Desconhecido",
        sourceType: sourceDev?.type || "N/A",
        targetName: targetDev?.name || "Desconhecido",
        targetType: targetDev?.type || "N/A",
      }
    })
  }, [connections, devices])

  return (
    <div className="space-y-6 p-8">
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Conexões de Rede</h2>
          <p className="text-sm text-muted-foreground">Mapa lógico de dependências</p>
        </div>

        <div className="divide-y divide-border/60">
          {loading ? (
            <p className="px-6 py-10 text-center text-muted-foreground">Carregando...</p>
          ) : (
            processedConnections.map((c) => (
              <div key={c.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
                <DeviceNode name={c.sourceName} type={c.sourceType} />
                <div className="flex shrink-0 flex-col items-center px-2">
                  <ArrowRight className="size-5 text-primary" />
                  <span className="mt-1 text-xs text-muted-foreground">{c.type}</span>
                </div>
                <DeviceNode name={c.targetName} type={c.targetType} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
