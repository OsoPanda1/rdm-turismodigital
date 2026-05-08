import { useMemo } from "react";
import { economyStore, isabellaStore, networkStore, useEconomyStore, useIsabellaStore, useNetworkStore } from "@/stores";

const riskStyles = {
  low: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  high: "border-rose-500/40 bg-rose-500/10 text-rose-100",
};

function formatDate(date: Date | null) {
  if (!date) {
    return "sin sincronía";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function OperationsConsole() {
  const nodes = useNetworkStore((state) => state.nodes);
  const networkStatus = useNetworkStore((state) => state.status);
  const lastSync = useNetworkStore((state) => state.lastSync);
  const quantumEncryptionActive = useNetworkStore((state) => state.quantumEncryptionActive);
  const msrBridgeConnected = useNetworkStore((state) => state.msrBridgeConnected);
  const bookpiAnchorActive = useNetworkStore((state) => state.bookpiAnchorActive);

  const isabellaStatus = useIsabellaStore((state) => state.status);
  const guardianMode = useIsabellaStore((state) => state.guardianMode);
  const lastProtocol = useIsabellaStore((state) => state.lastProtocol);
  const empathyIndex = useIsabellaStore((state) => state.empathyIndex);
  const interactions = useIsabellaStore((state) => state.interactions);

  const tcBalance = useEconomyStore((state) => state.tcBalance);
  const msrBalance = useEconomyStore((state) => state.msrBalance);
  const tamvBalance = useEconomyStore((state) => state.tamvBalance);
  const phoenixFund = useEconomyStore((state) => state.phoenixFund);
  const infraFund = useEconomyStore((state) => state.infraFund);
  const reserveFund = useEconomyStore((state) => state.reserveFund);
  const recentTransactions = useEconomyStore((state) => state.recentTransactions);

  const health = useMemo(() => networkStore.getState().getHealth(), [nodes, quantumEncryptionActive, msrBridgeConnected, bookpiAnchorActive]);

  const handleSimulation = () => {
    networkStore.getState().recordSync();
    isabellaStore.getState().recordInteraction();
    economyStore.getState().addTransaction({
      type: "reward",
      amount: 1,
      description: "Pulso canary federado verificado",
      msrHash: `msr-${Date.now().toString(36)}`,
    });
    economyStore.getState().distributeFunds(10);
  };

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-slate-950 p-5 text-slate-100 shadow-2xl shadow-cyan-950/30">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">TAMV operativo</p>
          <h2 className="mt-2 font-serif text-3xl">Consola federada segura</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Integra red, Isabella AI y economía MSR con validación de entradas, métricas por capa y distribución Phoenix 20/30/50 sin ponderar regiones sobre otras.
          </p>
        </div>
        <button
          className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/10"
          onClick={handleSimulation}
          type="button"
        >
          Simular canary
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <article className={`rounded-2xl border p-4 ${riskStyles[health.riskLevel]}`}>
          <p className="text-xs uppercase tracking-widest opacity-80">Riesgo</p>
          <p className="mt-2 text-2xl font-bold capitalize">{health.riskLevel}</p>
          <p className="text-xs opacity-80">{health.activeNodes}/{health.totalNodes} nodos activos · {health.averageLatency} ms</p>
        </article>
        <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Cobertura L0-L7</p>
          <p className="mt-2 text-2xl font-bold">{health.layerCoverage}%</p>
          <p className="text-xs text-slate-400">Estado: {networkStatus} · {formatDate(lastSync)}</p>
        </article>
        <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Isabella AI</p>
          <p className="mt-2 text-2xl font-bold capitalize">{isabellaStatus}</p>
          <p className="text-xs text-slate-400">Empatía {empathyIndex}% · guardián {guardianMode ? "activo" : "pausado"} · {interactions} eventos</p>
        </article>
        <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Balances</p>
          <p className="mt-2 text-2xl font-bold">{tcBalance} TC</p>
          <p className="text-xs text-slate-400">{msrBalance} MSR · {tamvBalance} TAMV</p>
        </article>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={quantumEncryptionActive ? "text-emerald-300" : "text-rose-300"}>Cifrado cuántico {quantumEncryptionActive ? "ON" : "OFF"}</span>
            <span className={msrBridgeConnected ? "text-emerald-300" : "text-rose-300"}>MSR Bridge {msrBridgeConnected ? "conectado" : "desconectado"}</span>
            <span className={bookpiAnchorActive ? "text-emerald-300" : "text-rose-300"}>BookPI {bookpiAnchorActive ? "anclado" : "sin ancla"}</span>
            <span className="text-cyan-300">Protocolo {lastProtocol}</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {nodes.map((node) => (
              <div key={node.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{node.name}</p>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs">{node.layer}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{node.region} · {node.latency} ms · {node.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <h3 className="font-semibold">Fondos Phoenix</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Resiliencia 20%</dt><dd>{phoenixFund.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt>Infraestructura 30%</dt><dd>{infraFund.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt>Reserva 50%</dt><dd>{reserveFund.toFixed(2)}</dd></div>
          </dl>
          <h3 className="mt-5 font-semibold">Ledger local</h3>
          <div className="mt-3 space-y-2">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-slate-400">Sin transacciones locales todavía.</p>
            ) : (
              recentTransactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="rounded-xl bg-slate-950/70 p-3 text-sm">
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-xs text-slate-400">{tx.type} · {tx.amount} · {tx.msrHash}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
