"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Search, Server } from "lucide-react"
import { getAssets, type Asset } from "@/lib/api"
import { StatusBadge } from "@/components/status-badge"
import { AssetModal } from "@/components/asset-modal"

export function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    getAssets().then((data) => {
      setAssets(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return assets
    return assets.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.ip.toLowerCase().includes(q) ||
        a.owner.toLowerCase().includes(q),
    )
  }, [assets, query])

  return (
    <div className="space-y-6 p-8">
      <div className="rounded-xl border border-border bg-card">
        {/* Cabeçalho da tabela */}
        <div className="flex flex-col gap-4 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar ativos..."
              className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Tipo</th>
                <th className="px-6 py-3 font-medium">IP</th>
                <th className="px-6 py-3 font-medium">Responsável</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    Carregando ativos...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    <Server className="mx-auto mb-2 size-6 opacity-50" />
                    Nenhum ativo encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
                    <td className="px-6 py-3.5 font-mono text-xs text-primary">{a.id}</td>
                    <td className="px-6 py-3.5 font-medium text-foreground">{a.name}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{a.type}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">{a.ip}</td>
                    <td className="px-6 py-3.5 text-foreground">{a.owner}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={a.status ?? "online"} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-6 py-3 text-xs text-muted-foreground">
          {filtered.length} de {assets.length} ativos
        </div>
      </div>

      <AssetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(asset) => setAssets((prev) => [asset, ...prev])}
      />
    </div>
  )
}
