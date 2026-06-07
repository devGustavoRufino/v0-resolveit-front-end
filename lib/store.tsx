"use client"

// =============================================================
// ResolveIT — Estado Global (Context API)
//
// Gerencia em memória todo o estado compartilhado entre as telas:
// ativos, logs de integração, contagem de incidentes e o usuário.
// As telas leem e escrevem aqui, mantendo tudo sincronizado.
//
// Os dados iniciais vêm da camada de API (lib/api.ts), que tenta
// o backend Flask e cai para mock quando indisponível.
// =============================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  getAssets,
  getIntegrationLogs,
  getConnections,
  createAsset as apiCreateAsset,
  createIncident as apiCreateIncident,
  type Asset,
  type IntegrationLog,
  type Connection,
} from "@/lib/api"

export interface AppUser {
  name: string
  email: string
  role: string
  initials: string
}

interface StoreValue {
  // dados
  assets: Asset[]
  logs: IntegrationLog[]
  connections: Connection[]
  openIncidents: number
  user: AppUser
  loading: boolean
  lastSync: Date | null
  // ações
  addAsset: (data: Omit<Asset, "id">) => Promise<Asset>
  openIncident: (assetId: string, description: string) => Promise<string>
}

const StoreContext = createContext<StoreValue | null>(null)

function nowStamp(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [logs, setLogs] = useState<IntegrationLog[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [openIncidents, setOpenIncidents] = useState(7)
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const user: AppUser = useMemo(
    () => ({
      name: "Administrador",
      email: "admin@resolveit.io",
      role: "Administrador do Sistema",
      initials: "AD",
    }),
    [],
  )

  // Carga inicial dos dados
  useEffect(() => {
    Promise.all([getAssets(), getIntegrationLogs(), getConnections()]).then(([a, l, c]) => {
      setAssets(a)
      setLogs(l)
      setConnections(c)
      setLastSync(new Date())
      setLoading(false)
    })
  }, [])

  // Cadastra um novo ativo e registra log de sincronização
  const addAsset = useCallback(async (data: Omit<Asset, "id">) => {
    const created = await apiCreateAsset(data)
    setAssets((prev) => [created, ...prev])
    const log: IntegrationLog = {
      id: `LOG-${Math.floor(100000 + Math.random() * 899999)}`,
      timestamp: nowStamp(new Date()),
      action: "Ativo adicionado à CMDB",
      reference: created.id,
      status: "success",
    }
    setLogs((prev) => [log, ...prev])
    setLastSync(new Date())
    return created
  }, [])

  // Abre incidente: gera ticket, registra log, incrementa contador
  const openIncident = useCallback(
    async (assetId: string, description: string) => {
      const res = await apiCreateIncident({ assetId, description })
      const asset = assets.find((a) => a.id === assetId)
      const log: IntegrationLog = {
        id: `LOG-${Math.floor(100000 + Math.random() * 899999)}`,
        timestamp: nowStamp(new Date()),
        action: `Incidente criado no ServiceNow${asset ? ` — ${asset.name}` : ""}`,
        reference: res.ticketNumber,
        status: "success",
      }
      setLogs((prev) => [log, ...prev])
      setOpenIncidents((n) => n + 1)
      setLastSync(new Date())
      return res.ticketNumber
    },
    [assets],
  )

  const value: StoreValue = {
    assets,
    logs,
    connections,
    openIncidents,
    user,
    loading,
    lastSync,
    addAsset,
    openIncident,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore deve ser usado dentro de <StoreProvider>")
  return ctx
}
