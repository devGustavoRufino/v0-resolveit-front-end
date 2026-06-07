"use client"

interface TopbarProps {
  title: string
  subtitle: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card/40 px-8 py-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground text-balance">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-foreground">Administrador</p>
          <p className="text-xs text-muted-foreground">admin@resolveit.io</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
          AD
        </div>
      </div>
    </header>
  )
}
