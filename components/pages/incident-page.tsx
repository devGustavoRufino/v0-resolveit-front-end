"use client"

import { useEffect, useState } from "react"
import { Loader2, Zap, AlertTriangle } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/lib/toast"
import type { Page } from "@/components/sidebar"

export function IncidentPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { assets, openIncident } = useStore()
  const { push } = useToast()
  const [assetId, setAssetId] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!assetId && assets[0]) setAssetId(assets[0].id)
  }, [assets, assetId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assetId || !description.trim()) return
    setLoading(true)
    // Gera o incidente no estado global (ponte com o ServiceNow via Flask)
    const ticket = await openIncident(assetId, description)
    setLoading(false)
    // Notificação de sucesso
    push({
      type: "success",
      title: "Incidente gerado com sucesso!",
      description: `Chamado ${ticket} gerado com sucesso no ServiceNow.`,
    })
    // Limpa o formulário
    setDescription("")
    // Volta ao dashboard, onde o novo log aparece no topo
    onNavigate("dashboard")
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Card do formulário */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Abertura de Incidente</h2>
              <p className="text-sm text-muted-foreground">
                Geração automatizada de chamado no ServiceNow
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">
                Dispositivo com falha
              </span>
              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.ip} ({a.type})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">
                Descrição do problema
              </span>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Descreva o problema apresentado pelo dispositivo..."
                className="w-full resize-none rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>

            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Comunicando com o ServiceNow...
                </>
              ) : (
                <>
                  <Zap className="size-5" />
                  Gerar Incidente
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
