import { Link } from "react-router-dom"
import { Hexagon } from "lucide-react"

const links = [
  { to: "/federaciones", label: "Federaciones" },
  { to: "/territorio", label: "Territorio" },
  { to: "/manuscrito", label: "Manuscrito" },
  { to: "/repositorio", label: "Repositorio" },
  { to: "/mercado", label: "Mercado" },
  { to: "/turismo", label: "Turismo" },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative"><Hexagon className="h-8 w-8 text-primary" strokeWidth={1.25} /><div className="absolute inset-0 flex items-center justify-center"><span className="text-[10px] font-mono font-semibold text-primary">7</span></div></div>
          <div className="leading-tight"><div className="font-serif text-lg tracking-wide">RDM Digital</div><div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Nodo · Cero</div></div>
        </Link>
        <nav className="hidden lg:block"><ul className="flex items-center gap-7 text-sm">{links.map((l) => <li key={l.to}><Link to={l.to} className="text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link></li>)}</ul></nav>
        <Link to="/auth/login" className="font-mono text-xs uppercase tracking-[0.2em] px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground transition-colors">Acceder</Link>
      </div>
    </header>
  )
}
