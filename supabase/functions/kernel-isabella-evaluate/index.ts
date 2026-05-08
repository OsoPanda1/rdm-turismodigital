import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"
import { corsHeaders, json } from "../_shared/cors.ts"

async function sha256(input: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("")
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  const body = await req.json().catch(() => ({}))
  const action = String(body.action ?? "unknown")
  const text = JSON.stringify(body).toLowerCase()
  const blocked = /(rat|malware|scrap(e|ing)|telegram userbot|reverse shell|vigilancia masiva)/.test(text)
  const decision = blocked ? "reject" : /pago|comercio|publicar|sync/.test(text) ? "alert" : "accept"
  const narrative = `Kernel Isabella ${decision}: ${action}`
  const hash_sha256 = await sha256(`${decision}:${JSON.stringify(body)}:${Date.now()}`)
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)
  await supabase.from("protocol_executions").insert({ protocol: "EOCT-MSR", action, decision, payload: body, hash_sha256 })
  await supabase.from("bookpi_entries").insert({ title: narrative, narrative, hash_sha256, signature: `isabella:${hash_sha256.slice(0, 16)}` })
  return json({ decision, action, hash_sha256, signature: `isabella:${hash_sha256.slice(0, 16)}` })
})
