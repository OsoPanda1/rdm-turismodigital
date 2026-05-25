import { type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

export function ModulePlaceholder({ icon: Icon, eyebrow, title, description, links }: {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  links?: { to: string; label: string }[]
}) {
  return (
    <div className="px-6 pb-10 pt-2">
      <div className="glass rounded-xl p-10 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative">
          <div className="h-14 w-14 grid place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 mb-6">
            <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-2">{eyebrow}</p>
          <h1 className="font-serif text-3xl text-platinum mb-3">{title}</h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
          {links?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="px-3 py-1.5 text-xs font-mono uppercase tracking-widest border border-border/60 hover:border-primary/40 hover:text-primary transition-all rounded-md">{l.label}</Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}