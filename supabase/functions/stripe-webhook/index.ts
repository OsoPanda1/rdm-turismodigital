import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"
import { corsHeaders, json } from "../_shared/cors.ts"

const functionName = new URL(import.meta.url).pathname.split('/').at(-2) ?? 'edge-function'

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
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
  if (functionName === "stripe-checkout") {
    return json({ ok: true, checkout: "configure STRIPE_SECRET_KEY and price_ids in Supabase secrets", received: body })
  }
  await supabase.from("analytics").insert({ event_type: functionName, data: body })
  return json({ ok: true, function: functionName, received: body })
})
