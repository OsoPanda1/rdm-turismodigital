import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard, Map, Compass, Coins, Bot, Landmark, Cpu, FileSearch, Hexagon, ChevronLeft, ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const NAV = [
  { to: "/app/dashboard", label: "Command Center", icon: LayoutDashboard, group: "OPS" },
  { to: "/app/territory", label: "Territorio", icon: Map, group: "OPS" },
  { to: "/app/tourism", label: "Turismo", icon: Compass, group: "OPS" },
  { to: "/app/economy", label: "Economía", icon: Coins, group: "OPS" },
  { to: "/app/isabella", label: "Isabella IA", icon: Bot, group: "IA" },
  { to: "/app/governance", label: "Gobernanza", icon: Landmark, group: "GOV" },
  { to: "/app/devops", label: "DevOps", icon: Cpu, group: "INFRA" },
  { to: "/app/evidence", label: "Evidencia", icon: FileSearch, group: "INFRA" },
  { to: "/app/utamv", label: "UTAMV", icon: Hexagon, group: "RED" },
] as const

export function EnterpriseSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()

  const grouped = NAV.reduce<Record<string, typeof NAV[number][]>>((acc, item) => {
    ;(acc[item.group] ??= []).push(item)
    return acc
  }, {})

  return (
    <aside
      className={cn(
        "relative shrink-0 transition-[width] duration-300 ease-out border-r border-border/40",
        "glass-strong",
        collapsed ? "w-[68px]" : "w-[248px]",
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/40">
        <div className="relative">
          <Hexagon className="h-7 w-7 text-primary" strokeWidth={1.25} />
          <span className="absolute inset-0 grid place-items-center text-[9px] font-mono text-primary">7</span>
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-serif text-sm tracking-wide text-platinum">TAMV OS</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Nodo · Cero</p>
          </div>
        )}
      </div>

      <nav className="px-2 py-4 space-y-5 overflow-y-auto h-[calc(100vh-64px-44px)]">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            {!collapsed && (
              <p className="px-3 mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">{group}</p>
            )}
            <ul className="space-y-0.5">
              {items.map((it) => {
                const active = pathname === it.to || pathname.startsWith(it.to + "/")
                const Icon = it.icon
                return (
                  <li key={it.to}>
                    <NavLink
                      to={it.to}
                      className={cn(
                        "group relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
                        active
                          ? "bg-gradient-to-r from-primary/15 via-primary/5 to-transparent text-foreground ring-platinum"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]",
                      )}
                      title={collapsed ? it.label : undefined}
                    >
                      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-primary rounded-r glow-gold" />}
                      <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} strokeWidth={1.5} />
                      {!collapsed && <span className="truncate">{it.label}</span>}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute bottom-3 right-3 h-7 w-7 grid place-items-center rounded-md border border-border/40 text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>
  )
}