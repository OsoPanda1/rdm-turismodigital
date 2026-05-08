import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  async function submit() {
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    if (result.error) setMessage(result.error.message)
    else {
      setMessage("Acceso Supabase correcto")
      navigate("/dashboard")
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300 mb-3">ID-NVIDA</p>
        <h1 className="text-3xl font-semibold mb-6">{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
        <div className="space-y-3">
          <input className="w-full rounded-xl bg-slate-900 border border-white/15 p-3" placeholder="correo" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-xl bg-slate-900 border border-white/15 p-3" placeholder="contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full rounded-xl bg-cyan-400 p-3 font-semibold text-slate-950" onClick={submit}>Continuar</button>
        </div>
        {message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}
      </section>
    </main>
  )
}
