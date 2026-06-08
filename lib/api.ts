// 🛑 MODO MOCK ATIVADO: Simulando a API para focar no Front-end

// Simulador de delay para as telas de loading
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------
// INTERFACES (Exatamente os nomes que o store.tsx pede)
// ---------------------------------------------------------

export interface Asset {
  id: number;
  name: string;
  ip_address: string;
  type: string;
  status: string;
  location?: string;
}

export interface IntegrationLog {
  id: number;
  date_hour: string;
  operation: string;
  description: string;
  status: string;
}

export interface Connection {
  id: number;
  source_device: string;
  target_device: string;
  status: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// ---------------------------------------------------------
// FUNÇÕES MOCKADAS (Exatamente os nomes que o store.tsx pede)
// ---------------------------------------------------------

export async function getAssets(): Promise<Asset[]> {
  await delay(800); 
  return [
    { id: 1, name: "SRV-BD-PROD-01", ip_address: "10.0.0.15", type: "Servidor", status: "Ativo", location: "Datacenter A" },
    { id: 2, name: "SW-CORE-RECIFE", ip_address: "10.0.1.1", type: "Switch", status: "Ativo", location: "Rack 02" },
    { id: 3, name: "RT-BGP-EDGE", ip_address: "10.0.254.1", type: "Roteador", status: "Inativo", location: "Datacenter B" },
    { id: 4, name: "FW-PALOALTO-01", ip_address: "10.0.0.254", type: "Firewall", status: "Alerta", location: "Rack 01" },
  ];
}

export async function getIntegrationLogs(): Promise<IntegrationLog[]> {
  await delay(600);
  return [
    { id: 101, date_hour: "08/06/2026 14:15:00", operation: "Sincronização", description: "Ativos sincronizados com a CMDB do ServiceNow", status: "Sucesso" },
    { id: 102, date_hour: "08/06/2026 15:30:22", operation: "Criação de Incidente", description: "Criado INC0010923 para RT-BGP-EDGE", status: "Sucesso" },
    { id: 103, date_hour: "08/06/2026 16:45:10", operation: "Alerta de Monitoramento", description: "Perda de pacotes detectada no SW-CORE-RECIFE", status: "Alerta" },
    { id: 104, date_hour: "08/06/2026 17:01:05", operation: "Autenticação", description: "Falha de login de usuário administrador", status: "Erro" },
  ];
}

export async function getConnections(): Promise<Connection[]> {
  await delay(500);
  return [
    { id: 1, source_device: "SW-CORE-RECIFE", target_device: "SRV-BD-PROD-01", status: "Online" },
    { id: 2, source_device: "SW-CORE-RECIFE", target_device: "RT-BGP-EDGE", status: "Offline" },
  ];
}

export async function createAsset(payload: any): Promise<Asset> {
  await delay(1000);
  // Simula a criação devolvendo o que foi enviado + um ID aleatório
  return { id: Math.floor(Math.random() * 1000), ...payload };
}

export async function createIncident(payload: any): Promise<any> {
  await delay(1200);
  return {
    success: true,
    incident_number: `INC00${Math.floor(Math.random() * 10000)}`,
    message: "Incidente criado com sucesso no ServiceNow.",
  };
}

export async function getUsers(): Promise<User[]> {
  await delay(400);
  return [
    { id: 1, name: "Administrador Sistema", email: "admin@resolveit.io", role: "Admin" },
  ];
}

export async function syncServiceNowDevices(): Promise<any> {
  await delay(1500);
  return { message: "Sincronização concluída", inserted: 2, updated: 4 };
}