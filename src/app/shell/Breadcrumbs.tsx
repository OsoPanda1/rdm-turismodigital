import { Link, useLocation } from "react-router-dom"
import { ChevronRight } from "lucide-react"

const LABELS: Record<string, string> = {
  app: "TAMV OS",
  dashboard: "Command Center",
  territory: "Territorio",
  tourism: "Turismo",
  economy: "Economía",
  isabella: "Isabella IA",
  governance: "Gobernanza",
  devops: "DevOps",
  evidence: "Evidencia",
  utamv: "UTAMV",
  identidad: "Identidad",
}

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const parts = pathname.split("/").filter(Boolean)
  if (!parts.length) return null
  return (
    <nav className="px-6 pt-4 pb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      {parts.map((p, i) => {
        const href = "/" + parts.slice(0, i + 1).join("/")
        const last = i === parts.length - 1
        const label = LABELS[p] ?? p
        return (
          <span key={href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 opacity-50" />}
            {last ? <span className="text-foreground">{label}</span> : <Link to={href} className="hover:text-foreground transition-colors">{label}</Link>}
          </span>
        )
      })}
    </nav>
  )
}