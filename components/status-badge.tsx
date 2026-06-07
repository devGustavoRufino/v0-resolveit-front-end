import { cn } from "@/lib/utils"

const STYLES: Record<string, string> = {
  online: "bg-primary/15 text-primary",
  offline: "bg-destructive/15 text-destructive",
  manutencao: "bg-chart-4/15 text-chart-4",
  success: "bg-primary/15 text-primary",
  error: "bg-destructive/15 text-destructive",
}

const LABELS: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  manutencao: "Manutenção",
  success: "Sucesso",
  error: "Erro",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        STYLES[status] ?? "bg-secondary text-secondary-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full", status === "offline" || status === "error" ? "bg-destructive" : status === "manutencao" ? "bg-chart-4" : "bg-primary")} />
      {LABELS[status] ?? status}
    </span>
  )
}
