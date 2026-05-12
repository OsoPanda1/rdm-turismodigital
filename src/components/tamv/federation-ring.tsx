"use client"

import { useMemo, useState } from "react"
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery"
import { FederationNode } from "@/types/eoct"

const TOTAL_NODES = 195

function statusColor(node: FederationNode) {
  const status = node.status || (node.ecg_rhythm > 85 ? "SATURATING" : "OK")
  switch (status) {
    case "SATURATING":
      return "bg-rose-500"
    case "OFFLINE":
      return "bg-slate-600"
    case "BOOTSTRAP":
      return "bg-amber-400"
    default:
      return "bg-cyan-400"
  }
}

export default function FederationRing() {
  const [selectedFederation, setSelectedFederation] = useState<number | "ALL">("ALL")
  const queryOptions = useMemo(
    () => ({
      table: "tamv_federation_ring",
      select: "id,created_at,federation_id,ecg_rhythm,quantum_hash,status",
      order: { column: "created_at", ascending: true },
      limit: TOTAL_NODES,
    }),
    [],
  )
  const { data, status, error } = useSupabaseQuery<FederationNode>(queryOptions)
  const nodes = data ?? []

  const filteredNodes = useMemo(
    () => (selectedFederation === "ALL" ? nodes : nodes.filter((n) => n.federation_id === selectedFederation)),
    [nodes, selectedFederation],
  )

  const counters = useMemo(() => {
    return filteredNodes.reduce(
      (acc, node) => {
        const label = node.status || (node.ecg_rhythm > 85 ? "SATURATING" : "OK")
        acc[label] = (acc[label] ?? 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [filteredNodes])

  if (status === "loading") return <div>Cargando anillo EOCT…</div>
  if (status === "error") return <div>Error: {error}</div>

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold">Anillo federado EOCT</h3>
        <select
          className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-sm"
          value={selectedFederation}
          onChange={(e) => setSelectedFederation(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
        >
          <option value="ALL">Todas las federaciones</option>
          {Array.from({ length: 7 }).map((_, i) => (
            <option key={i} value={i + 1}>
              Federación {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Pill label="Nodos visibles" value={String(filteredNodes.length)} />
        {Object.entries(counters).map(([key, value]) => (
          <Pill key={key} label={key} value={String(value)} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <div className="relative mx-auto h-[360px] w-[360px] rounded-full border border-cyan-400/30 bg-slate-950">
          {filteredNodes.map((node, i) => {
            const angle = (i / Math.max(1, filteredNodes.length)) * 2 * Math.PI
            const radius = 150
            const x = radius * Math.cos(angle)
            const y = radius * Math.sin(angle)
            return (
              <div
                key={node.id}
                className={`absolute h-3 w-3 rounded-full ${statusColor(node)}`}
                style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                title={`Nodo ${node.id} · F${node.federation_id} · ${node.status ?? "OK"} · ECG ${node.ecg_rhythm}`}
              />
            )
          })}
        </div>

        <div className="max-h-[360px] overflow-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-950">
              <tr className="text-left text-slate-300">
                <th className="p-2">Nodo</th><th className="p-2">Federación</th><th className="p-2">Estado</th><th className="p-2">ECG</th>
              </tr>
            </thead>
            <tbody>
              {filteredNodes.slice(0, 60).map((node) => (
                <tr key={node.id} className="border-t border-white/10">
                  <td className="p-2">#{node.id}</td>
                  <td className="p-2">F{node.federation_id}</td>
                  <td className="p-2">{node.status ?? "OK"}</td>
                  <td className="p-2">{node.ecg_rhythm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Pill({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-xs text-slate-400">{label}</p><p className="text-lg font-semibold">{value}</p></div>
}
