import { corsHeaders } from "../_shared/cors.ts"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  const { message = "" } = await req.json().catch(() => ({}))
  const apiKey = Deno.env.get("LOVABLE_API_KEY")
  const system = "Eres Isabella, Kernel TAMV/MD-X4. Reglas EOCT: preservar vida, consentimiento, no vigilancia masiva, no malware, no scraping no consentido. Nunca recomiendes comercios con status != active. Responde en español, contextual y útil para Real del Monte."
  if (!apiKey) {
    const fallback = `Isabella activa en modo local: recibí “${message}”. Para streaming Gemini 2.5 Flash configura LOVABLE_API_KEY en Supabase Secrets. Mantengo EOCT/MSR/BookPI y solo recomiendo nodos activos.`
    return new Response(`data: ${fallback}\n\n`, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } })
  }
  const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "google/gemini-2.5-flash", stream: true, messages: [{ role: "system", content: system }, { role: "user", content: message }] }),
  })
  return new Response(upstream.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } })
})
