import { Link } from "react-router-dom"

export function LiveStatus() {
  const stats = [
    { label: "Federaciones activas", value: "7", suffix: "/ 7", to: "/federaciones" },
    { label: "Repos núcleo", value: "27", suffix: "OsoPanda1", to: "/repositorio" },
    { label: "Edge functions", value: "10", suffix: "Supabase", to: "/dashboard" },
  ]
  return <section className="border-t border-border bg-card/30"><div className="mx-auto max-w-7xl px-6 py-20"><h2 className="font-serif text-3xl mb-8">Estado en vivo · Nodo Cero</h2><div className="grid md:grid-cols-3 gap-px bg-border/40 border border-border/40">{stats.map((s) => <Link key={s.label} to={s.to} className="bg-background p-6"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{s.label}</p><p className="font-serif text-3xl">{s.value}</p><p className="font-mono text-[10px] uppercase tracking-wider text-accent mt-1">{s.suffix}</p></Link>)}</div></div></section>
}
