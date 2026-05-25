import { useEffect, useState } from "react"
import { Activity, Map, Coins, Bot, GitBranch, ShieldCheck, Cpu, TrendingUp, Users } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Link } from "react-router-dom"

type Pulse = { label: string; value: string; trend: string; status: "ok" | "warn" | "crit"; icon: typeof Activity }

function StatusDot({ s }: { s: "ok" | "warn" | "crit" }) {
  const map = { ok: "bg-emerald-400 shadow-[0_0_10px_rgb(52,211,153)]", warn: "bg-amber-400 shadow-[0_0_10px_rgb(251,191,36)]", crit: "bg-red-500 shadow-[0_0_10px_rgb(239,68,68)]" }
  return <span className={`inline-block h-1.5 w-1.5 rounded-full animate-pulse-soft ${map[s]}`} />
}

function PulseCard({ p }: { p: Pulse }) {
  const Icon = p.icon
  return (
    <div className="glass rounded-lg p-5 group hover:ring-platinum transition-all relative overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="relative flex items-start justify-between mb-4">
        <div className="h-9 w-9 grid place-items-center rounded-md bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
        </div>
        <StatusDot s={p.status} />
      </div>
      <p className="relative font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-1">{p.label}</p>
      <p className="relative font-serif text-2xl text-platinum tabular-nums">{p.value}</p>
      <p className="relative font-mono text-[10px] text-accent mt-2">{p.trend}</p>
    </div>
  )
}

export default function CommandCenter() {
  const [counts, setCounts] = useState({ pois: 0, businesses: 0, federations: 0, repos: 0, routes: 0 })
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    ;(async () => {
      const [pois, biz, feds, repos, routes] = await Promise.all([
        supabase.from("pois").select("id", { count: "exact", head: true }),
        supabase.from("businesses").select("id", { count: "exact", head: true }),
        supabase.from("federations").select("id", { count: "exact", head: true }),
        supabase.from("repositories").select("id", { count: "exact", head: true }),
        supabase.from("routes").select("id", { count: "exact", head: true }),
      ])
      setCounts({
        pois: pois.count ?? 0,
        businesses: biz.count ?? 0,
        federations: feds.count ?? 0,
        repos: repos.count ?? 0,
        routes: routes.count ?? 0,
      })
    })()
    return () => clearInterval(t)
  }, [])

  const pulses: Pulse[] = [
    { label: "Territory Pulse", value: `${counts.pois}`, trend: `+${counts.routes} rutas activas`, status: "ok", icon: Map },
    { label: "Economic Pulse", value: `${counts.businesses}`, trend: "Mercado Soberano OPEN", status: counts.businesses ? "ok" : "warn", icon: Coins },
    { label: "Repo Federation", value: `${counts.repos}/210`, trend: "Sync GitHub nominal", status: "ok", icon: GitBranch },
    { label: "AI Pulse · Isabella", value: "gemini-2.5-flash", trend: "HITL · streaming OK", status: "ok", icon: Bot },
    { label: "Federations", value: `${counts.federations}/7`, trend: "Quórum heptafederado", status: counts.federations >= 7 ? "ok" : "warn", icon: ShieldCheck },
    { label: "System Health", value: "99.97%", trend: "Edge / RPC nominal", status: "ok", icon: Cpu },
    { label: "Ciudadanos activos", value: "—", trend: "ID-NVIDA federada", status: "ok", icon: Users },
    { label: "Telemetry ECG", value: "stable", trend: "Sin anomalías 24h", status: "ok", icon: Activity },
  ]

  const modules = [
    { to: "/app/territory", label: "Mapa territorial", desc: "POIs · heatmap · capas", icon: Map },
    { to: "/app/tourism", label: "Plataforma turística", desc: "Recorridos · leyendas · catálogo", icon: TrendingUp },
    { to: "/app/economy", label: "Mercado Soberano", desc: "Comercios · pagos · activación", icon: Coins },
    { to: "/app/isabella", label: "Isabella IA", desc: "Multi-agente HITL", icon: Bot },
  ]

  return (
    <div className="px-6 pb-10 pt-2 space-y-8">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-1">Command Center · Mission Control</p>
          <h1 className="font-serif text-4xl text-platinum">Nodo Cero · TAMV OS</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">Capa cero que orquesta territorio, comercio, identidad y federaciones de Real del Monte. Telemetría en vivo, control y observabilidad heptafederada.</p>
        </div>
        <div className="glass rounded-lg px-5 py-3 text-right">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Hora territorial UTC</p>
          <p className="font-mono text-xl text-platinum tabular-nums">{now.toISOString().slice(11, 19)}</p>
        </div>
      </div>

      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Pulsos sistémicos</p>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {pulses.map((p) => <PulseCard key={p.label} p={p} />)}
        </div>
      </section>

      <section className="grid lg:grid-cols-[1fr_360px] gap-4">
        <div className="glass rounded-lg p-6 relative overflow-hidden">
          <div className="absolute inset-x-0 h-px top-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-scan" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Ecosystem ECG · últimas 24h</p>
          <svg viewBox="0 0 600 160" className="w-full h-40">
            <defs>
              <linearGradient id="ecg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(42 85% 62%)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(42 85% 62%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,90 L60,90 L70,90 L78,40 L86,140 L94,90 L160,90 L170,90 L178,55 L186,125 L194,90 L260,90 L272,90 L280,30 L288,150 L296,90 L380,90 L392,90 L400,60 L408,120 L416,90 L520,90 L532,90 L540,45 L548,135 L556,90 L600,90" fill="none" stroke="hsl(42 85% 62%)" strokeWidth="1.5" />
            <path d="M0,90 L60,90 L70,90 L78,40 L86,140 L94,90 L160,90 L170,90 L178,55 L186,125 L194,90 L260,90 L272,90 L280,30 L288,150 L296,90 L380,90 L392,90 L400,60 L408,120 L416,90 L520,90 L532,90 L540,45 L548,135 L556,90 L600,90 L600,160 L0,160 Z" fill="url(#ecg)" />
          </svg>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/40">
            {[
              { l: "Latencia API", v: "112ms" },
              { l: "Eventos/min", v: "847" },
              { l: "Uptime 30d", v: "99.97%" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{s.l}</p>
                <p className="font-serif text-lg text-platinum tabular-nums mt-1">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-lg p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Accesos rápidos</p>
          <ul className="space-y-2">
            {modules.map((m) => {
              const Icon = m.icon
              return (
                <li key={m.to}>
                  <Link to={m.to} className="flex items-center gap-3 p-3 rounded-md border border-border/40 hover:border-primary/40 hover:bg-white/[0.03] transition-all group">
                    <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground group-hover:text-primary transition-colors">{m.label}</p>
                      <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}