import { useEffect, useState } from "react"
import { Radio, Search, Bell, User2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Link } from "react-router-dom"

const TICKER = [
  "TAMV-RDM-2026 · KERNEL MD-X4 v1.0.0",
  "FEDERACIONES 7/7 ACTIVAS",
  "BookPI™ ledger · sincronizado",
  "Isabella IA™ · HITL ON",
  "Real del Monte · 19.97°N · 98.67°W · 2,700 msnm",
  "Cinturón Volcánico Transmexicano",
  "Modo Isla: standby",
]

export function TopCommandBar() {
  const [time, setTime] = useState(() => new Date())
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
    return () => clearInterval(id)
  }, [])

  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-border/40">
      <div className="flex items-center gap-4 px-5 h-16">
        <div className="flex items-center gap-2 text-accent shrink-0">
          <Radio className="h-3.5 w-3.5 animate-pulse-soft" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">EN VIVO</span>
        </div>
        <span className="text-border/60 font-mono text-xs">//</span>
        <div className="flex-1 overflow-hidden hidden md:block">
          <div className="flex gap-10 whitespace-nowrap animate-ticker font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {[...TICKER, ...TICKER].map((t, i) => <span key={i} className="shrink-0">{t}</span>)}
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-3 h-9 rounded-md border border-border/40 bg-background/40 w-64">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input placeholder="Comando o ruta…" className="bg-transparent outline-none text-xs flex-1 placeholder:text-muted-foreground/70" />
          <kbd className="font-mono text-[9px] text-muted-foreground border border-border/40 px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
          <span className="hidden sm:inline tabular-nums">{time.toISOString().slice(11, 19)}Z</span>
          <button className="h-9 w-9 grid place-items-center rounded-md border border-border/40 hover:bg-white/[0.04] text-muted-foreground hover:text-foreground" aria-label="Alertas">
            <Bell className="h-3.5 w-3.5" />
          </button>
          <Link to={email ? "/app/identidad" : "/auth/login"} className="h-9 px-3 grid place-items-center rounded-md border border-border/40 hover:bg-white/[0.04] text-muted-foreground hover:text-foreground flex flex-row gap-2">
            <User2 className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-widest">{email ? email.split("@")[0] : "Acceder"}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}