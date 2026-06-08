"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  getDevices,
  getLogs,
  getConnections,
  createDevice as apiCreateDevice,
  createIncident as apiCreateIncident,
  type Device,
  type Log,
  type Connection,
  type User,
  getUsers,
} from "@/lib/api"

export interface AppUser extends User {
  initials: string
}

interface StoreValue {
  devices: Device[]
  logs: Log[]
  connections: Connection[]
  users: User[]
  loading: boolean
  addDevice: (data: Omit<Device, "id">) => Promise<Device>
  openIncident: (device_id: number, description: string, caller_id: number) => Promise<any>
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const [d, l, c, u] = await Promise.all([getDevices(), getLogs(), getConnections(), getUsers()])
        setDevices(d)
        setLogs(l)
        setConnections(c)
        setUsers(u)
      } catch (err) {
        console.error("Erro ao carregar dados reais da API:", err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const addDevice = useCallback(async (data: Omit<Device, "id">) => {
    const created = await apiCreateDevice(data)
    setDevices((prev) => [created, ...prev])
    return created
  }, [])

  const openIncident = useCallback(async (device_id: number, description: string, caller_id: number) => {
    const incident = await apiCreateIncident({ device_id, description, caller_id })
    // Após abrir, recarrega logs para mostrar o novo na tabela
    const updatedLogs = await getLogs()
    setLogs(updatedLogs)
    return incident
  }, [])

  const value: StoreValue = {
    devices,
    logs,
    connections,
    users,
    loading,
    addDevice,
    openIncident,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore deve ser usado dentro de StoreProvider")
  return ctx
}