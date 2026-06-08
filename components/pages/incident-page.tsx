"use client"

import { useEffect, useState } from "react"
import { Loader2, Zap, AlertTriangle } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/lib/toast"
import type { Page } from "@/components/sidebar"

export function IncidentPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { devices, openIncident, users } = useStore()
  const { push } = useToast()
  
  // Estados para o formulário
  const [device_id, setDeviceId] = useState<number | "">("")
  const [description, setDescription] = useState("")
  const [caller_id, setCallerId] = useState<number | "">("")
  const [loading, setLoading] = useState(false)

  // Seleciona o primeiro dispositivo e primeiro usuário como padrão
  useEffect(() => {
    if (!device_id && devices.length > 0) setDeviceId(devices[0].id)
    if (!caller_id && users.length > 0) setCallerId(users[0].id)
  }, [devices, users, device_id, caller_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (device_id === "" || caller_id === "" || !description.trim()) return
    
    setLoading(true)
    try {
      // Agora enviamos exatamente o que a sua API espera: device_id, description e caller_id
      await openIncident(Number(device_id), description, Number(caller_id))
      
      push({
        type: "success",
        title: "Incidente gerado!",
        description: `Chamado registrado com sucesso no sistema.`,
      })
      setDescription("")
      onNavigate("dashboard")
    } catch (err) {
      push({ type: "error", title: "Erro", description: "Falha ao abrir incidente." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Abertura de Incidente</h2>
              <p className="text-sm text-muted-foreground">Registrar novo chamado no banco de dados</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Dispositivo com falha</span>
              <select
                value={device_id}
                onChange={(e) => setDeviceId(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} — {d.ip}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Usuário solicitante</span>
              <select
                value={caller_id}
                onChange={(e) => setCallerId(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Descrição</span>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 font-bold text-primary-foreground hover:bg-primary/90"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Zap /> Gerar Incidente</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}