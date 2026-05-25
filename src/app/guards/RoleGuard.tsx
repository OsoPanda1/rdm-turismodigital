import { useEffect, useState, type ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

type Role = "admin" | "operator" | "merchant" | "tourist" | "user"

export function RoleGuard({ roles, children, fallback = "/auth/login" }: { roles?: Role[]; children: ReactNode; fallback?: string }) {
  const [status, setStatus] = useState<"loading" | "ok" | "deny">("loading")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { if (!cancelled) setStatus("deny"); return }
      if (!roles?.length) { if (!cancelled) setStatus("ok"); return }
      const { data: rls } = await supabase.from("user_roles").select("role").eq("user_id", user.id)
      const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
      const owned = new Set<string>([...((rls ?? []) as { role: string }[]).map((r) => r.role), (prof as { role?: string } | null)?.role].filter(Boolean) as string[])
      const ok = roles.some((r) => owned.has(r))
      if (!cancelled) setStatus(ok ? "ok" : "deny")
    })()
    return () => { cancelled = true }
  }, [roles])

  if (status === "loading") return <div className="p-10 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Verificando rol…</div>
  if (status === "deny") return <Navigate to={fallback} replace />
  return <>{children}</>
}