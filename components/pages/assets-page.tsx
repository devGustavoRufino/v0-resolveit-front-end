"use client"

import { useMemo, useState } from "react"
import { Plus, Search, Server } from "lucide-react"
import { useStore } from "@/lib/store"
import { StatusBadge } from "@/components/status-badge"
import { AssetModal } from "@/components/asset-modal"

export function AssetsPage() {
  const { devices, loading } = useStore()
  const [query, setQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return devices
    return devices.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.ip.toLowerCase().includes(q) ||
        String(a.id).includes(q) ||
        a.type.toLowerCase().includes(q),
    )
  }, [devices, query])

  return (
    <div className="space-y-6 p-8">
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por nome ou IP..."
              className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Novo Ativo
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Tipo</th>
                <th className="px-6 py-3 font-medium">IP</th>
                <th className="px-6 py-3 font-medium">User ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Nenhum ativo encontrado.</td></tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
                    <td className="px-6 py-3.5 font-mono text-xs text-primary">{a.id}</td>
                    <td className="px-6 py-3.5 font-medium text-foreground">{a.name}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{a.type}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{a.ip}</td>
                    <td className="px-6 py-3.5 text-foreground">{a.user_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AssetModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}