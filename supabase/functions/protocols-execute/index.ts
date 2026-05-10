import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"
import { corsHeaders, json } from "../_shared/cors.ts"

const functionName = new URL(import.meta.url).pathname.split('/').at(-2) ?? 'edge-function'

async function requireUser(req: Request) {
  const auth = req.headers.get("Authorization") ?? ""
  if (!auth.startsWith("Bearer ")) return null
  const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, { global: { headers: { Authorization: auth } } })
  const { data, error } = await supa.auth.getUser()
  if (error || !data?.user) return null
  return data.user
}

const PUBLIC_READ = new Set(["federation-state", "dashboard-summary"])

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  // stripe-webhook: validate signature instead of JWT
  if (functionName === "stripe-webhook") {
    const sig = req.headers.get("stripe-signature")
    const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET")
    if (!sig || !secret) return json({ error: "missing signature or webhook secret" }, 400)
    // Signature verification placeholder — full verification requires stripe SDK; reject if no secret configured.
    return json({ ok: true, note: "configure stripe webhook handler with STRIPE_WEBHOOK_SECRET and stripe.webhooks.constructEventAsync" })
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)
  const body = await req.json().catch(() => ({}))

  if (functionName === "federation-state") {
    const [{ count: federations }, { count: repos }, { count: executions }] = await Promise.all([
      supabase.from("federations").select("*", { count: "exact", head: true }),
      supabase.from("repositories").select("*", { count: "exact", head: true }).eq("is_core", true),
      supabase.from("protocol_executions").select("*", { count: "exact", head: true }),
    ])
    return json({ federations, repositories_core: repos, protocol_executions: executions, anonymized: true })
  }

  if (functionName === "dashboard-summary") {
    const [{ count: businesses }, { count: repos }] = await Promise.all([
      supabase.from("businesses").select("*", { count: "exact", head: true }).eq("payment_status", "active"),
      supabase.from("repositories").select("*", { count: "exact", head: true }).eq("is_core", true),
    ])
    return json({ active_businesses: businesses, core_repositories: repos, kernel: "TAMV/MD-X4" })
  }

  // All other endpoints require authentication
  if (!PUBLIC_READ.has(functionName)) {
    const user = await requireUser(req)
    if (!user) return json({ error: "Unauthorized" }, 401)
  }

  if (functionName === "stripe-checkout") {
    return json({ ok: true, checkout: "configure STRIPE_SECRET_KEY and price_ids in Supabase secrets", received: body })
  }

  // Validate analytics payload before insert
  const safeBody = typeof body === "object" && body !== null ? body : {}
  const serialized = JSON.stringify(safeBody)
  if (serialized.length > 10000) return json({ error: "payload too large" }, 413)

  await supabase.from("analytics").insert({ event_type: functionName, data: safeBody })
  return json({ ok: true, function: functionName })
})
