// =============================================================
// ResolveIT — Camada de comunicação com a API RESTful (Flask)
//
// O front-end é estritamente a camada de visualização. Toda a
// lógica de negócio real (incluindo a ponte com o ServiceNow)
// é processada pela API externa em Flask.
// =============================================================

// Quando a API Python for hospedada (ex: Render), troque este link
export const API_BASE_URL = "http://localhost:5000"

// ----------------------- Interfaces (Modelos do Banco) -----------------------

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface Device {
  id: number
  name: string
  type: string
  ip: string
  user_id: number 
}

export interface Log {
  id: number
  date_hour: string
  operation: string
  status: string
  device_id: number | null
  user_id: number | null
  description: string
}

export interface Connection {
  id: number
  type: string
  source_id: number
  destination_id: number
}

export interface Incident {
  id: number
  number: string
  title: string
  state: string
  priority: string
  caller_id: number
  created_at: string
  updated_at: string
  description: string
  device_id: number
}

// ----------------------- Payloads (Dados para Envio) -----------------------

export interface DevicePayload {
  name: string
  type: string
  ip: string
  user_id: number
}

export interface IncidentPayload {
  device_id: number
  description: string
  caller_id: number
}

// ----------------------- Função Auxiliar de Fetch -----------------------

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  
  if (!res.ok) {
    throw new Error(`Erro na API: HTTP ${res.status}`)
  }
  
  return (await res.json()) as T
}

// ----------------------- Endpoints -----------------------

export async function getUsers(): Promise<User[]> {
  return fetchApi<User[]>("/api/users")
}

export async function getDevices(): Promise<Device[]> {
  return fetchApi<Device[]>("/api/devices")
}

export async function createDevice(payload: DevicePayload): Promise<Device> {
  return fetchApi<Device>("/api/devices", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function getLogs(): Promise<Log[]> {
  return fetchApi<Log[]>("/api/logs")
}

export async function getConnections(): Promise<Connection[]> {
  return fetchApi<Connection[]>("/api/connections")
}

export async function createIncident(payload: IncidentPayload): Promise<Incident> {
  return fetchApi<Incident>("/api/incidents", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}