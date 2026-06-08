// lib/api.ts
export const API_BASE_URL = "https://python-api-itom.onrender.com";

// === INTERFACES DE DADOS ===
export interface User { 
  id: number; 
  name: string; 
  email: string; 
  role: "USER" | "TI" | "ADM"; // Tipagem estrita alinhada ao Enum do Backend
}

export interface Device { 
  id: number; 
  name: string; 
  type: string; 
  ip: string; 
  user_id: number; 
}

export interface Log { 
  id: number; 
  date_hour: string; 
  operation: string; 
  status: "SUCCESS" | "FAILED"; 
  device_id: number | null; 
  user_id: number | null; 
  description: string; 
}

export interface Connection { 
  id: number; 
  type: string; 
  source_id: number; 
  destination_id: number; 
}

export interface Incident { 
  id: number; 
  number: string; 
  title: string; 
  state: string; 
  priority: string; 
  caller_id: number; 
  created_at: string; 
  updated_at: string; 
  description: string; 
  device_id: number; 
}

// === INTERFACES DE PAYLOAD ===
export interface DevicePayload { name: string; type: string; ip: string; user_id: number }
export interface IncidentPayload { device_id: number; description: string; caller_id: number }

// === FUNÇÃO BASE DE CONEXÃO (Ajustada e Protegida) ===
async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  // Garante a formatação correta da URL sem duplicar ou esquecer barras
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...options,
    headers: { 
      "Content-Type": "application/json",
      ...options?.headers,
    },
    // CRUCIAL para o Flask-Login funcionar cross-domain:
    // Permite enviar e receber cookies de sessão mesmo em localhost -> Render
    credentials: "include", 
  });

  if (!res.ok) {
    // Tenta ler a mensagem de erro detalhada retornada pelo Flask-RESTX
    try {
      const errorJson = await res.json();
      throw new Error(errorJson.message || `Erro API: ${res.status}`);
    } catch {
      throw new Error(`Erro de rede ou rota inexistente: ${res.status}`);
    }
  }

  return (await res.json()) as T;
}

// === FUNÇÕES DOS ENDPOINTS (Alinhadas ao app.py e rotas do Flask) ===
export async function getUsers(): Promise<User[]> { 
  return fetchApi<User[]>("/api/user/"); 
}

export async function getDevices(): Promise<Device[]> { 
  return fetchApi<Device[]>("/api/device/"); 
}

export async function getLogs(): Promise<Log[]> { 
  return fetchApi<Log[]>("/api/log/"); 
}

export async function getConnections(): Promise<Connection[]> { 
  return fetchApi<Connection[]>("/api/connection/"); 
}

export async function createDevice(p: DevicePayload): Promise<Device> { 
  return fetchApi<Device>("/api/device/", { 
    method: "POST", 
    body: JSON.stringify(p) 
  }); 
}

export async function createIncident(p: IncidentPayload): Promise<Incident> { 
  return fetchApi<Incident>("/api/incident/", { 
    method: "POST", 
    body: JSON.stringify(p) 
  }); 
}

// Nova função utilitária para chamar o sincronismo do ServiceNow que criamos antes
export async function syncServiceNowDevices(): Promise<{ message: string; inserted: number; updated: number }> {
  return fetchApi<{ message: string; inserted: number; updated: number }>("/api/device/sync/servicenow", { 
    method: "POST" 
  });
}