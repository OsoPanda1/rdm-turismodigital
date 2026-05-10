import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"
import { corsHeaders } from "../_shared/cors.ts"

const MAX_MESSAGE_LENGTH = 2000

async function requireUser(req: Request) {
  const auth = req.headers.get("Authorization") ?? ""
  if (!auth.startsWith("Bearer ")) return null
  const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, { global: { headers: { Authorization: auth } } })
  const { data, error } = await supa.auth.getUser()
  if (error || !data?.user) return null
  return data.user
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  const user = await requireUser(req)
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } })
  const { message = "" } = await req.json().catch(() => ({}))
  if (typeof message !== "string" || message.length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    return new Response(JSON.stringify({ error: `message must be a string between 1 and ${MAX_MESSAGE_LENGTH} chars` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } })
  }
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
