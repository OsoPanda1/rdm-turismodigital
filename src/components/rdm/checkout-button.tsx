import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CheckoutButton({ commerceType = "tiendita" }: { commerceType?: string }) {
  const [loading, setLoading] = useState(false)
  async function checkout() {
    setLoading(true)
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ commerce_type: commerceType }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.url) window.location.href = data.url
    setLoading(false)
  }
  return <Button onClick={checkout} disabled={loading}>{loading ? "Preparando…" : "Pagar con Stripe"}</Button>
}
