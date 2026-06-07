// =============================================================
// ResolveIT — Camada de comunicação com a API RESTful (Flask)
// Base URL: http://localhost:5000
//
// O front-end é estritamente a camada de visualização. Toda a
// lógica de negócio real (incluindo a ponte com o ServiceNow)
// é processada pela API externa em Flask.
//
// As funções abaixo usam `fetch`. Caso a API ainda não esteja
// disponível, elas caem para dados simulados (mock) para que a
// interface continue navegável durante o desenvolvimento.
// =============================================================

export const API_BASE_URL = "http://localhost:5000"

export interface Asset {
  id: string
  name: string
  type: string
  ip: string
  owner: string
  status?: "online" | "offline" | "manutencao"
}

export interface IntegrationLog {
  id: string
  timestamp: string
  action: string
  reference: string
  status: "success" | "error"
}

export interface Connection {
  id: string
  source: string
  sourceType: string
  target: string
  targetType: string
  protocol: string
}

export interface IncidentPayload {
  assetId: string
  description: string
}

export interface IncidentResponse {
  ticketNumber: string
  message: string
}

// ----------------------- Dados Mock -----------------------
const MOCK_ASSETS: Asset[] = [
  { id: "AST-1001", name: "SRV-CORE-01", type: "Servidor", ip: "10.0.0.10", owner: "Infraestrutura", status: "online" },
  { id: "AST-1002", name: "NB-FINANCE-22", type: "Notebook", ip: "10.0.1.42", owner: "Marina Costa", status: "online" },
  { id: "AST-1003", name: "SW-CORE-DC", type: "Switch", ip: "10.0.0.2", owner: "Redes", status: "online" },
  { id: "AST-1004", name: "PRN-RH-03", type: "Impressora", ip: "10.0.2.30", owner: "Recursos Humanos", status: "manutencao" },
  { id: "AST-1005", name: "FW-PERIMETER", type: "Firewall", ip: "10.0.0.1", owner: "Segurança", status: "online" },
  { id: "AST-1006", name: "NB-DEV-07", type: "Notebook", ip: "10.0.1.77", owner: "Carlos Lima", status: "offline" },
  { id: "AST-1007", name: "AP-FLOOR-2", type: "Access Point", ip: "10.0.3.12", owner: "Redes", status: "online" },
  { id: "AST-1008", name: "DB-SQL-PROD", type: "Servidor", ip: "10.0.0.15", owner: "Banco de Dados", status: "online" },
]

const MOCK_LOGS: IntegrationLog[] = [
  { id: "LOG-9001", timestamp: "2026-06-07 09:42:11", action: "Sincronização de ativos", reference: "BATCH-0042", status: "success" },
  { id: "LOG-9002", timestamp: "2026-06-07 09:38:55", action: "Incidente criado no ServiceNow", reference: "INC0010231", status: "success" },
  { id: "LOG-9003", timestamp: "2026-06-07 09:31:20", action: "Atualização de CMDB", reference: "CMDB-SYNC-18", status: "success" },
  { id: "LOG-9004", timestamp: "2026-06-07 09:15:03", action: "Incidente criado no ServiceNow", reference: "INC0010229", status: "success" },
  { id: "LOG-9005", timestamp: "2026-06-07 08:58:47", action: "Descoberta de topologia", reference: "TOPO-SCAN-07", status: "success" },
]

const MOCK_CONNECTIONS: Connection[] = [
  { id: "CON-01", source: "FW-PERIMETER", sourceType: "Firewall", target: "SW-CORE-DC", targetType: "Switch", protocol: "Trunk 10Gb" },
  { id: "CON-02", source: "SW-CORE-DC", sourceType: "Switch", target: "SRV-CORE-01", targetType: "Servidor", protocol: "Ethernet 1Gb" },
  { id: "CON-03", source: "SW-CORE-DC", sourceType: "Switch", target: "DB-SQL-PROD", targetType: "Servidor", protocol: "Ethernet 1Gb" },
  { id: "CON-04", source: "SW-CORE-DC", sourceType: "Switch", target: "AP-FLOOR-2", targetType: "Access Point", protocol: "PoE" },
  { id: "CON-05", source: "AP-FLOOR-2", sourceType: "Access Point", target: "NB-DEV-07", targetType: "Notebook", protocol: "Wi-Fi 6" },
  { id: "CON-06", source: "AP-FLOOR-2", sourceType: "Access Point", target: "NB-FINANCE-22", targetType: "Notebook", protocol: "Wi-Fi 6" },
]

// Helper: tenta a API real, cai para mock em caso de falha
async function safeFetch<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as T
  } catch {
    // API indisponível — usa dados simulados para manter a UI navegável
    return fallback
  }
}

// ----------------------- Endpoints -----------------------

// GET /assets
export async function getAssets(): Promise<Asset[]> {
  return safeFetch<Asset[]>("/assets", MOCK_ASSETS)
}

// POST /assets
export async function createAsset(asset: Omit<Asset, "id">): Promise<Asset> {
  const fallback: Asset = { id: `AST-${Math.floor(1000 + Math.random() * 9000)}`, ...asset }
  return safeFetch<Asset>("/assets", fallback, {
    method: "POST",
    body: JSON.stringify(asset),
  })
}

// GET /logs
export async function getIntegrationLogs(): Promise<IntegrationLog[]> {
  return safeFetch<IntegrationLog[]>("/logs", MOCK_LOGS)
}

// GET /connections
export async function getConnections(): Promise<Connection[]> {
  return safeFetch<Connection[]>("/connections", MOCK_CONNECTIONS)
}

// POST /incidents — aciona a ponte com o ServiceNow via Flask
export async function createIncident(payload: IncidentPayload): Promise<IncidentResponse> {
  const ticketNumber = `INC00${Math.floor(10000 + Math.random() * 89999)}`
  const fallback: IncidentResponse = {
    ticketNumber,
    message: `Chamado ${ticketNumber} gerado com sucesso`,
  }
  // Simula latência de rede ao comunicar com o ServiceNow
  await new Promise((r) => setTimeout(r, 1800))
  return safeFetch<IncidentResponse>("/incidents", fallback, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
