"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getDevices, 
  getLogs, 
  syncServiceNowDevices, 
  Device, 
  Log 
} from "@/lib/api";

export default function AdminTestPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  // Função para carregar dados (envolvida em useCallback para evitar loops)
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Chamada paralela para as duas rotas principais
      const [deviceData, logData] = await Promise.all([
        getDevices(),
        getLogs()
      ]);

      setDevices(deviceData);
      setLogs(logData);
    } catch (err: any) {
      console.error("Erro ao carregar dados:", err);
      // Tratamento amigável para o "Failed to fetch" (CORS ou Servidor Dormindo)
      if (err.message.includes("fetch")) {
        setError("Não foi possível conectar à API. Verifique se o Render está ativo ou se o CORS foi liberado no app.py.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Função para disparar o sincronismo do ServiceNow
  const handleSync = async () => {
    if (!confirm("Deseja iniciar a sincronização manual com o ServiceNow?")) return;

    try {
      setSyncing(true);
      setStatusMsg("Conectando ao ServiceNow via API Render...");
      
      const result = await syncServiceNowDevices();
      
      setStatusMsg(`Sucesso: ${result.message} (${result.inserted} novos, ${result.updated} atualizados)`);
      // Recarrega a lista após o sync
      await loadData();
    } catch (err: any) {
      setError(`Erro no Sincronismo: ${err.message}`);
      setStatusMsg("");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>ITOM <span>Dashboard</span></h1>
          <p style={styles.subtitle}>Gestão de Ativos & Auditoria em Tempo Real</p>
        </div>
        <button 
          onClick={handleSync} 
          disabled={syncing || loading} 
          style={{...styles.syncBtn, opacity: (syncing || loading) ? 0.6 : 1}}
        >
          {syncing ? "Sincronizando..." : "🔄 Sync ServiceNow"}
        </button>
      </header>

      {/* ALERTAS DE ERRO / STATUS */}
      {error && (
        <div style={styles.errorBanner}>
          <strong>⚠️ Erro de Comunicação:</strong> {error}
          <button onClick={loadData} style={styles.retryBtn}>Tentar Novamente</button>
        </div>
      )}

      {statusMsg && (
        <div style={styles.successBanner}>
          <i className="fa-solid fa-circle-check"></i> {statusMsg}
        </div>
      )}

      {/* GRID DE CONTEÚDO */}
      <main style={styles.grid}>
        
        {/* COLUNA 1: DISPOSITIVOS */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2>💻 Dispositivos (CMDB)</h2>
            <span style={styles.badge}>{devices.length} itens</span>
          </div>
          
          <div style={styles.listScroll}>
            {loading ? <p style={styles.infoText}>Carregando ativos...</p> : 
             devices.length === 0 ? <p style={styles.infoText}>Nenhum ativo encontrado no banco.</p> : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>IP</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map(dev => (
                    <tr key={dev.id}>
                      <td><strong>{dev.name}</strong></td>
                      <td style={styles.mono}>{dev.ip}</td>
                      <td>{dev.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* COLUNA 2: LOGS DE AUDITORIA */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2>📋 Auditoria Global</h2>
            <button onClick={loadData} style={styles.refreshIconBtn} title="Atualizar Logs">
              <i className="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
          
          <div style={styles.listScroll}>
            {loading ? <p style={styles.infoText}>Carregando trilha...</p> : 
             logs.length === 0 ? <p style={styles.infoText}>Sem registros de log.</p> : (
              logs.map(log => (
                <div key={log.id} style={{
                  ...styles.logItem, 
                  borderLeft: `4px solid ${log.status === 'SUCCESS' ? '#10b981' : '#ef4444'}`
                }}>
                  <div style={styles.logHeader}>
                    <span style={styles.logOp}>{log.operation}</span>
                    <span style={styles.logDate}>{new Date(log.date_hour).toLocaleTimeString()}</span>
                  </div>
                  <p style={styles.logDesc}>{log.description}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// ESTILOS EM OBJETO (Para garantir que funcione em qualquer Next.js sem dependências extras)
const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '40px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' },
  title: { margin: 0, fontSize: '32px', fontWeight: 'bold' },
  subtitle: { margin: '5px 0 0', color: '#94a3b8', fontSize: '14px' },
  syncBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  card: { backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #334155' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  badge: { backgroundColor: '#334155', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' },
  listScroll: { height: '500px', overflowY: 'auto', paddingRight: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  mono: { fontFamily: 'monospace', color: '#10b981' },
  infoText: { color: '#64748b', textAlign: 'center', marginTop: '50px' },
  logItem: { backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', marginBottom: '10px' },
  logHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px' },
  logOp: { fontWeight: 'bold', fontSize: '13px' },
  logDate: { color: '#64748b', fontSize: '11px' },
  logDesc: { margin: 0, fontSize: '13px', color: '#94a3b8' },
  errorBanner: { backgroundColor: '#450a0a', border: '1px solid #ef4444', color: '#fecaca', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  retryBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  successBanner: { backgroundColor: '#064e3b', border: '1px solid #10b981', color: '#d1fae5', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  refreshIconBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }
};