"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/api"
import { useToast } from "@/lib/toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { push } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        push({ type: "info", title: "Sucesso", description: "Login realizado!" })
        router.push("/dashboard") // Redireciona para o seu painel
      } else {
        push({ type: "error", title: "Erro", description: "Credenciais inválidas" })
      }
    } catch (error) {
      push({ type: "error", title: "Erro", description: "Falha ao conectar com a API" })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form onSubmit={handleLogin} className="w-96 rounded-xl border border-border bg-card p-8 shadow-xl">
        <h1 className="mb-6 text-xl font-bold">Login ResolveIT</h1>
        <input 
          type="email" placeholder="Email" className="mb-4 w-full rounded border p-2"
          onChange={(e) => setEmail(e.target.value)} required 
        />
        <input 
          type="password" placeholder="Senha" className="mb-6 w-full rounded border p-2"
          onChange={(e) => setPassword(e.target.value)} required 
        />
        <button type="submit" className="w-full rounded bg-primary py-2 text-primary-foreground">
          Entrar
        </button>
      </form>
    </div>
  )
}