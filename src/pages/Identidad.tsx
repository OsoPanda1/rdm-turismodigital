import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { User } from "@supabase/supabase-js"

type Profile = { id: string; name: string | null; email: string | null; role: string; avatar_url: string | null; created_at: string }
type RoleRow = { role: string }
type LogRow = { id: string; created_at: string; event_type: string; data: Record<string, unknown> | null }

const ROLE_BADGES: Record<string, { label: string; color: string; description: string }> = {
  admin: { label: "Operador soberano", color: "#EF4444", description: "Acceso total al kernel del Nodo Cero" },
  operator: { label: "Operador federado", color: "#F59E0B", description: "Gestiona dominios y protocolos" },
  merchant: { label: "Comercio activo", color: "#10B981", description: "Mercado Soberano federado" },
  tourist: { label: "Visitante federado", color: "#3B82F6", description: "Identidad Ciudadana inicial" },
  user: { label: "Ciudadano TAMV", color: "#A855F7", description: "Identidad activa en la red" },
}

export default function IdentidadPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [history, setHistory] = useState<LogRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: sessionData } = await supabase.auth.getUser()
      const u = sessionData.user
      if (cancelled) return
      setUser(u)
      if (!u) { setLoading(false); return }
      const [{ data: prof }, { data: rls }, { data: logs }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", u.id),
        supabase.from("analytics").select("id,created_at,event_type,data").eq("user_id", u.id).order("created_at", { ascending: false }).limit(20),
      ])
      if (cancelled) return
      setProfile((prof as Profile) ?? null)
      setRoles(((rls as RoleRow[]) ?? []).map((r) => r.role))
      setHistory(((logs as LogRow[]) ?? []))
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) return <div className="min-h-screen bg-background text-muted-foreground p-10 font-mono text-xs">Cargando identidad…</div>
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground p-10">
        <h1 className="font-serif text-2xl mb-2">Identidad Ciudadana</h1>
        <p className="text-sm text-muted-foreground mb-6">Necesitas autenticarte para ver tus insignias e historial.</p>
        <a href="/auth/login" className="inline-block border border-border px-4 py-2 text-xs font-mono uppercase tracking-widest">Iniciar sesión</a>
      </div>
    )
  }

  const allBadges = Array.from(new Set([...(profile ? [profile.role] : []), ...roles]))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">III · IDENTIDAD CIUDADANA</p>
          <h1 className="font-serif text-2xl">{profile?.name || user.email}</h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">{user.id}</p>
        </div>
        <a href="/" className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">← inicio</a>
      </header>

      <main className="p-6 grid lg:grid-cols-2 gap-6 max-w-6xl">
        <section className="border border-border/60 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Insignias activas</p>
          {allBadges.length === 0 ? (
            <p className="text-xs text-muted-foreground">Sin insignias asignadas todavía.</p>
          ) : (
            <ul className="space-y-3">
              {allBadges.map((r) => {
                const b = ROLE_BADGES[r] ?? { label: r, color: "#888", description: "Rol federado" }
                return (
                  <li key={r} className="flex items-start gap-3 border border-border/40 p-3">
                    <span className="h-3 w-3 rounded-full mt-1" style={{ backgroundColor: b.color, boxShadow: `0 0 12px ${b.color}66` }} />
                    <div>
                      <p className="text-sm font-medium">{b.label}</p>
                      <p className="text-[11px] text-muted-foreground">{b.description}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <div className="mt-6 pt-4 border-t border-border/40 space-y-2 text-[11px] text-muted-foreground font-mono">
            <div>EMAIL: <span className="text-foreground">{user.email}</span></div>
            <div>ROL DE PERFIL: <span className="text-foreground">{profile?.role ?? "tourist"}</span></div>
            <div>ALTA: <span className="text-foreground">{profile?.created_at ? new Date(profile.created_at).toLocaleString() : "—"}</span></div>
          </div>
        </section>

        <section className="border border-border/60 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Historial · últimas 20 trazas</p>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground">Aún no hay actividad registrada en analytics.</p>
          ) : (
            <ul className="space-y-2 max-h-[480px] overflow-y-auto pr-2">
              {history.map((h) => (
                <li key={h.id} className="border-l-2 border-accent/60 pl-3 py-1">
                  <p className="text-xs">{h.event_type}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{new Date(h.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}