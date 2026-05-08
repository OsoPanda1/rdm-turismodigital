import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"

export function LogoutButton() {
  const navigate = useNavigate()
  async function logout() { await supabase.auth.signOut(); navigate("/") }
  return <Button variant="outline" onClick={logout} className="font-mono text-xs uppercase tracking-[0.2em] bg-transparent">Cerrar sesión</Button>
}
