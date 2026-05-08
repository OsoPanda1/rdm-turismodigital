import { useState } from "react"
import { Link } from "react-router-dom"
import { tourismSpots, type TourismCategory } from "@/lib/tourism-data"

export default function TurismoPage() {
  const [category, setCategory] = useState<TourismCategory | "">("")
  const spots = category ? tourismSpots.filter((spot) => spot.category === category) : tourismSpots
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/40"><div className="mx-auto max-w-7xl px-6 py-16"><p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">RDM TURISMO · DIGITAL TWIN</p><h1 className="font-serif text-4xl md:text-5xl mb-4">Explora Real del Monte en tiempo real</h1><p className="max-w-3xl text-muted-foreground">Geolocalización y recomendaciones pasan por Edge Functions Lovable/Supabase.</p></div></section>
      <section className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-6"><div className="flex flex-wrap gap-2">{["", "historia", "cultura", "gastronomia", "naturaleza", "negocios"].map((value) => <button key={value || "todo"} onClick={() => setCategory(value as TourismCategory | "")} className={`rounded-full border px-3 py-1 text-xs ${category === value ? "border-accent text-accent" : "border-border text-muted-foreground"}`}>{value || "Todo"}</button>)}</div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{spots.map((spot) => <article key={spot.id} className="overflow-hidden rounded-xl border border-border/40 bg-card"><img src={spot.imageUrl} alt={spot.name} className="h-44 w-full object-cover max-h-[80vh]" /><div className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{spot.category}</p><h2 className="font-serif text-xl mt-1">{spot.name}</h2><p className="mt-2 text-sm text-muted-foreground">{spot.summary}</p><p className="mt-3 text-xs text-muted-foreground">{spot.address}</p></div></article>)}</div></div>
        <aside className="space-y-6"><IsabellaBox /><Link to="/territorio" className="block border border-border/40 bg-card p-6 text-sm text-muted-foreground">Ver radio de precisión geográfica ±0.05°</Link></aside>
      </section>
    </main>
  )
}

function IsabellaBox() {
  const [message, setMessage] = useState("¿Qué puedo visitar hoy en Real del Monte en 4 horas?")
  const [answer, setAnswer] = useState("")
  async function ask() {
    setAnswer("")
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-chat`, { method: "POST", headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ message }) })
    const text = await res.text()
    setAnswer(text.replace(/^data: /gm, ""))
  }
  return <section className="border border-border/40 bg-card p-6"><p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-3">Isabella IA</p><textarea value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-24 w-full rounded-md border border-border bg-background p-3 text-sm" /><button className="mt-3 rounded bg-primary px-4 py-2 text-primary-foreground" onClick={ask}>Preguntar</button>{answer ? <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{answer}</p> : null}</section>
}
