import { useState } from "react"

export default function ComercioRegistro() {
  const [name, setName] = useState("")
  const [commerceType, setCommerceType] = useState("tiendita")
  const [message, setMessage] = useState("")

  async function checkout() {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name, commerce_type: commerceType }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setMessage(data.error ?? "Registro local preparado; configura Stripe secret para checkout real.")
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <section className="mx-auto max-w-xl space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Comercio federado</p>
        <h1 className="font-serif text-4xl">Alta con visibilidad condicionada</h1>
        <input className="w-full rounded border bg-background p-3" placeholder="Nombre del comercio" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="w-full rounded border bg-background p-3" value={commerceType} onChange={(e) => setCommerceType(e.target.value)}>
          <option value="gondola">Góndola 249/200</option>
          <option value="tiendita">Tiendita 299/250</option>
          <option value="plateria">Platería/Restaurante 399/300</option>
          <option value="hotel">Hotel 699/500</option>
          <option value="transporte_externo">Transporte externo 500/50</option>
          <option value="premium">Premium 2699/699</option>
        </select>
        <button className="rounded bg-primary px-4 py-3 text-primary-foreground" onClick={checkout}>Pagar cuota inicial</button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </section>
    </main>
  )
}
