// lib/api.ts
export const API_BASE_URL = "http://localhost:5000"

export interface User { id: number; name: string; email: string; role: string }
export interface Device { id: number; name: string; type: string; ip: string; user_id: number }
export interface Log { id: number; date_hour: string; operation: string; status: string; device_id: number | null; user_id: number | null; description: string }
export interface Connection { id: number; type: string; source_id: number; destination_id: number }
export interface Incident { id: number; number: string; title: string; state: string; priority: string; caller_id: number; created_at: string; updated_at: string; description: string; device_id: number }

export interface DevicePayload { name: string; type: string; ip: string; user_id: number }
export interface IncidentPayload { device_id: number; description: string; caller_id: number }

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) throw new Error(`Erro API: ${res.status}`)
  return (await res.json()) as T
}

export async function getUsers(): Promise<User[]> { return fetchApi<User[]>("/api/users") }
export async function getDevices(): Promise<Device[]> { return fetchApi<Device[]>("/api/devices") }
export async function getLogs(): Promise<Log[]> { return fetchApi<Log[]>("/api/logs") }
export async function getConnections(): Promise<Connection[]> { return fetchApi<Connection[]>("/api/connections") }
export async function createDevice(p: DevicePayload): Promise<Device> { return fetchApi<Device>("/api/devices", { method: "POST", body: JSON.stringify(p) }) }
export async function createIncident(p: IncidentPayload): Promise<Incident> { return fetchApi<Incident>("/api/incidents", { method: "POST", body: JSON.stringify(p) }) }