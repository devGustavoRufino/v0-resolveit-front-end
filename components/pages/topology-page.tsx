"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Server, Router, Wifi, Laptop, ShieldAlert, Network as NetworkIcon } from "lucide-react"
import { getConnections, type Connection } from "@/lib/api"

function deviceIcon(type: string) {
  switch (type) {
    case "Servidor":
      return Server
    case "Switch":
    case "Roteador":
      return Router
    case "Access Point":
      return Wifi
    case "Notebook":
    case "Desktop":
      return Laptop
    case "Firewall":
      return ShieldAlert
    default:
      return NetworkIcon
  }
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
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConnections().then((data) => {
      setConnections(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6 p-8">
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Conexões de Rede</h2>
          <p className="text-sm text-muted-foreground">
            Mapeamento de dispositivos por origem e destino
          </p>
        </div>

        <div className="divide-y divide-border/60">
          {loading ? (
            <p className="px-6 py-10 text-center text-muted-foreground">Carregando topologia...</p>
          ) : (
            connections.map((c) => (
              <div key={c.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
                <DeviceNode name={c.source} type={c.sourceType} />

                <div className="flex shrink-0 flex-col items-center px-2">
                  <ArrowRight className="size-5 text-primary" />
                  <span className="mt-1 whitespace-nowrap text-xs text-muted-foreground">
                    {c.protocol}
                  </span>
                </div>

                <DeviceNode name={c.target} type={c.targetType} />
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border px-6 py-3 text-xs text-muted-foreground">
          {connections.length} conexões mapeadas
        </div>
      </div>
    </div>
  )
}
