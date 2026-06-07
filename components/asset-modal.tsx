"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/lib/toast"

interface AssetModalProps {
  open: boolean
  onClose: () => void
}

const TYPES = ["Servidor", "Notebook", "Desktop", "Switch", "Roteador", "Firewall", "Access Point", "Impressora"]

export function AssetModal({ open, onClose }: AssetModalProps) {
  const { addAsset } = useStore()
  const { push } = useToast()
  const [name, setName] = useState("")
  const [type, setType] = useState(TYPES[0])
  const [ip, setIp] = useState("")
  const [owner, setOwner] = useState("")
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const reset = () => {
    setName("")
    setType(TYPES[0])
    setIp("")
    setOwner("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // Adiciona ao estado global (POST na API Flask) e registra log
    const created = await addAsset({ name, type, ip, owner, status: "online" })
    setSaving(false)
    push({
      type: "success",
      title: "Ativo cadastrado",
      description: `${created.name} (${created.id}) foi adicionado ao inventário.`,
    })
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Novo Ativo</h2>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <Field label="Nome do equipamento">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: NB-FINANCE-22"
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </Field>

          <Field label="Tipo">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Endereço IP">
            <input
              required
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Ex.: 10.0.1.42"
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </Field>

          <Field label="Usuário responsável">
            <input
              required
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Ex.: Marina Costa"
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              {saving ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}
