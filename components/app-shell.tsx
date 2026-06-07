"use client"

import { useState } from "react"
import { Sidebar, type Page } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { AssetsPage } from "@/components/pages/assets-page"
import { IncidentPage } from "@/components/pages/incident-page"
import { TopologyPage } from "@/components/pages/topology-page"

const META: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Visão geral do ambiente de TI" },
  ativos: { title: "Gestão de Ativos", subtitle: "Inventário de dispositivos da organização" },
  incidente: { title: "Abrir Incidente", subtitle: "Integração automatizada com o ServiceNow" },
  topologia: { title: "Topologia de Rede", subtitle: "Conexões entre dispositivos" },
}

export function AppShell() {
  const [page, setPage] = useState<Page>("dashboard")
  const meta = META[page]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar current={page} onNavigate={setPage} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto">
          {page === "dashboard" && <DashboardPage />}
          {page === "ativos" && <AssetsPage />}
          {page === "incidente" && <IncidentPage />}
          {page === "topologia" && <TopologyPage />}
        </main>
      </div>
    </div>
  )
}
