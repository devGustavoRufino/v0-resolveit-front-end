"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Para redirecionar após o login
import { API_BASE_URL } from "@/lib/api";

export default function AutoLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Iniciando autenticação automática...");
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function executarAutoLogin() {
      try {
        setStatus("Conectando ao servidor seguro no Render...");
        
        // Dados do usuário que será logado automaticamente
        const payload = {
          email: "americo.neto@extreme.digital", // Substitua por um e-mail real do seu banco
          password: "3009"               // Substitua pela senha real
        };

        // Requisição direto para o namespace de autenticação do seu Flask
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        // Se o Flask-RESTX devolver erro (400, 401, 500)
        if (!res.ok) {
          const dadosErro = await res.json().catch(() => ({}));
          throw new Error(dadosErro.message || `Erro do servidor: ${res.status}`);
        }

        const dadosUsuario = await res.json();
        
        setStatus(`Sucesso! Bem-vindo de volta, ${dadosUsuario.name || "Usuário"}.`);
        
        // Redireciona o usuário para a Dashboard de Testes após 1.5 segundos
        setTimeout(() => {
          router.push("/admin/test"); 
        }, 1500);

      } catch (err: any) {
        console.error("Falha no login automático:", err);
        setErro(err.message || "Não foi possível realizar o login automático.");
        setStatus("");
      }
    }

    executarAutoLogin();
  }, [router]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontFamily: "sans-serif",
      backgroundColor: "#f8fafc"
    }}>
      <div style={{
        padding: "40px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "400px"
      }}>
        <h2 style={{ color: "#1e293b", marginBottom: "15px" }}>🔒 Login Automático</h2>
        
        {status && (
          <div>
            <div className="spinner" style={{
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              animation: "spin 1s linear infinite",
              margin: "20px auto"
            }} />
            <p style={{ color: "#64748b", fontSize: "14px" }}>{status}</p>
          </div>
        )}

        {erro && (
          <div style={{ marginTop: "15px" }}>
            <p style={{ color: "#ef4444", fontWeight: "bold", fontSize: "14px" }}>⚠️ Falha na Autenticação</p>
            <p style={{ color: "#94a3b8", fontSize: "12px" }}>{erro}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: "15px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}