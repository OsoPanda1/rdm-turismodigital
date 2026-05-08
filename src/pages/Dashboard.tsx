import { useState } from "react"
import TamvcrumsEcg from "@/components/tamv/tamvcrums-ecg"
import FederationRing from "@/components/tamv/federation-ring"

type View = "ecg" | "ring"

export default function DashboardPage() {
  const [view, setView] = useState<View>("ecg")
  return (
    <main className="min-h-screen bg-background p-6 text-foreground space-y-4">
      <h1 className="font-serif text-4xl">Dashboard TAMV</h1>
      <div className="flex gap-2">
        <button className="border px-3 py-1 rounded" onClick={() => setView("ecg")}>ECG</button>
        <button className="border px-3 py-1 rounded" onClick={() => setView("ring")}>Anillo 195</button>
      </div>
      {view === "ecg" ? <TamvcrumsEcg /> : <FederationRing />}
    </main>
  )
}
