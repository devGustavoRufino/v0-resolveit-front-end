"use client";

import { useState, useEffect } from "react";
import { 
  getDevices, 
  getLogs, 
  Device, 
  Log 
} from "@/lib/api"; // Ajuste o caminho @/lib se necessário

export default function AdminTestPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loadingSync, setLoadingSync] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState("");
  const [erro, setErro] = useState("");

  // 1. Carrega os dados iniciais da API do Render assim que a página abre
  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setErro("");
      const [listaDevices, listaLogs] = await Promise.all([
        getDevices(),
        getLogs()
      ]);
      setDevices(listaDevices);
      setLogs(listaLogs);
    } catch (err: any) {
      setErro(err.message || "Erro ao conectar com a API no Render.");
    }
  }

  // 2. Função que testa o botão de Sincronização do ServiceNow
  // async function handleSyncServiceNow() {
  //   try {
  //     setLoadingSync(true);
  //     setMensagemStatus("Conectando ao ServiceNow via Render... Aguarde.");
  //     setErro("");

  //     const resultado = await syncServiceNowDevices();
      
  //     setMensagemStatus(resultado.message);
  //     // Recarrega a lista de dispositivos para mostrar os novos CIs na tela
  //     await carregarDados();
  //   } catch (err: any) {
  //     setErro(err.message || "Falha no sincronismo. Verifique os logs de permissão.");
  //     setMensagemStatus("");
  //   } finally {
  //     setLoadingSync(false);
  //   }
  // }

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <h1 style={{ color: "#333" }}>🧪 Painel de Testes: ITOM Integration</h1>
      <p style={{ color: "#666" }}>Testando a conexão do Next.js com o Gunicorn no Render</p>

      {/* Exibição de Erros Globais */}
      {erro && (
        <div style={{ padding: "15px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "6px", marginBottom: "20px" }}>
          <strong>⚠️ Erro detectado:</strong> {erro}
        </div>
      )}

      {/* Seção de Ações / Botões */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
        <h2 style={{ marginTop: 0, fontSize: "18px" }}>Gatilhos de Integração</h2>
        <button
          // onClick={handleSyncServiceNow}
          disabled={loadingSync}
          style={{
            backgroundColor: loadingSync ? "#94a3b8" : "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: loadingSync ? "not-allowed" : "pointer",
            fontWeight: "bold"
          }}
        >
          {loadingSync ? "Sincronizando Ativos..." : "🔄 Sincronizar CIs do ServiceNow"}
        </button>

        {mensagemStatus && (
          <p style={{ marginTop: "15px", color: "#16a34a", fontWeight: "500" }}>ℹ️ {mensagemStatus}</p>
        )}
      </div>

      {/* Grid de Dados */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* Coluna de Dispositivos (CMDB Local) */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginTop: 0, color: "#1e293b" }}>💻 Dispositivos Cadastrados ({devices.length})</h2>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {devices.length === 0 ? <p style={{ color: "#94a3b8" }}>Nenhum dispositivo encontrado.</p> : (
              <ul style={{ paddingLeft: "20px" }}>
                {devices.map((dev) => (
                  <li key={dev.id} style={{ marginBottom: "10px", fontSize: "14px" }}>
                    <strong>{dev.name}</strong> — <span style={{ color: "#0284c7" }}>{dev.ip}</span> ({dev.type})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Coluna da Trilha de Auditoria (Logs Globais) */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginTop: 0, color: "#1e293b" }}>📋 Trilha de Auditoria (Logs)</h2>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {logs.length === 0 ? <p style={{ color: "#94a3b8" }}>Nenhum log registrado.</p> : (
              logs.map((log) => (
                <div 
                  key={log.id} 
                  style={{ 
                    padding: "10px", 
                    borderBottom: "1px solid #e2e8f0", 
                    fontSize: "13px",
                    backgroundColor: log.status === "FAILED" ? "#fff5f5" : "transparent"
                  }}
                >
                  <span style={{ 
                    fontWeight: "bold", 
                    color: log.status === "FAILED" ? "#dc2626" : "#16a34a",
                    marginRight: "10px" 
                  }}>
                    [{log.status}]
                  </span>
                  <strong>{log.operation}</strong>
                  <p style={{ margin: "4px 0", color: "#64748b" }}>{log.description}</p>
                  <small style={{ color: "#94a3b8" }}>{new Date(log.date_hour).toLocaleString("pt-BR")}</small>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}