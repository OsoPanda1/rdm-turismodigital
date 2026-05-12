import { useMemo, useState } from "react"
import TamvcrumsEcg from "@/components/tamv/tamvcrums-ecg"
import FederationRing from "@/components/tamv/federation-ring"
import OperationsConsole from "@/components/tamv/operations-console"
import { useNetworkStore } from "@/stores"

type View = "ecg" | "ring" | "ops"

const views: { key: View; title: string; description: string }[] = [
  { key: "ecg", title: "Señal ECG territorial", description: "Pulso histórico por minuto de todos los eventos TAMVCRUMS." },
  { key: "ring", title: "Anillo de 195 nodos", description: "Distribución geofederada, estados y latencias activas por federación." },
  { key: "ops", title: "Consola operativa", description: "Telemetría de red, IA Isabella y economía MSR en una sola superficie." },
]

export default function DashboardPage() {
  const [view, setView] = useState<View>("ecg")
  const nodes = useNetworkStore((state) => state.nodes)
  const status = useNetworkStore((state) => state.status)
  const lastSync = useNetworkStore((state) => state.lastSync)

  const activeNodes = useMemo(() => nodes.filter((node) => node.status === "active").length, [nodes])

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-white/10 bg-gradient-to-br from-cyan-950/40 via-slate-950 to-violet-950/40">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Panel de control</p>
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Dashboard TAMV / RDM Digital</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Reorganizamos la visualización en módulos de operación real para evitar vistas estáticas: estado de red,
            actividad ECG, nodos federados y simulación canary de punta a punta.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Metric label="Estado de red" value={status.toUpperCase()} />
            <Metric label="Nodos activos" value={`${activeNodes}/${nodes.length}`} />
            <Metric label="Última sincronía" value={lastSync ? new Date(lastSync).toLocaleString("es-MX") : "pendiente"} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-5 px-6 py-8">
        <div className="grid gap-3 md:grid-cols-3">
          {views.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`rounded-2xl border p-4 text-left transition ${
                view === item.key
                  ? "border-cyan-300/60 bg-cyan-400/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <p className="text-sm font-semibold text-cyan-200">{item.title}</p>
              <p className="mt-2 text-xs text-slate-300">{item.description}</p>
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-4 md:p-6">
          {view === "ecg" && <TamvcrumsEcg />}
          {view === "ring" && <FederationRing />}
          {view === "ops" && <OperationsConsole />}
        </div>
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-cyan-100">{value}</p>
    </div>
  )
}
