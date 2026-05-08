import { Link } from "react-router-dom"

export default function SimplePage({ title, eyebrow, body }: { title: string; eyebrow: string; body: string }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">{eyebrow}</p>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">{title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">{body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="rounded-md border border-border px-4 py-2 text-sm">Inicio</Link>
          <Link to="/repositorio" className="rounded-md border border-accent/40 px-4 py-2 text-sm text-accent">Repositorio</Link>
        </div>
      </section>
    </main>
  )
}
