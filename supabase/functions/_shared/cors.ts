export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } })
}

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"

export async function requireUser(req: Request) {
  const auth = req.headers.get("Authorization") ?? ""
  if (!auth.startsWith("Bearer ")) return { user: null, error: "missing bearer" }
  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
    { global: { headers: { Authorization: auth } } },
  )
  const { data, error } = await supa.auth.getUser()
  if (error || !data?.user) return { user: null, error: "unauthorized" }
  return { user: data.user, error: null }
}

export function unauthorized() {
  return json({ error: "Unauthorized" }, 401)
}
