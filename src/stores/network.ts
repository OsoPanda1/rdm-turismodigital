// ============================================================================
// TAMV — Network Store: nodos federados, MSR Bridge y cifrado cuántico
// ============================================================================
import { clampNonNegative, createTamvStore } from "./tamv-store";

export type NetworkStatus = "online" | "offline" | "syncing" | "maintenance";
export type NodeStatus = "active" | "idle" | "error";
export type NetworkLayer = "L0" | "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7";

export interface NetworkNode {
  id: string;
  name: string;
  status: NodeStatus;
  latency: number;
  region: string;
  layer: NetworkLayer;
}

export interface NetworkHealth {
  activeNodes: number;
  totalNodes: number;
  averageLatency: number;
  layerCoverage: number;
  riskLevel: "low" | "medium" | "high";
}

export interface NetworkState {
  status: NetworkStatus;
  nodes: NetworkNode[];
  quantumEncryptionActive: boolean;
  msrBridgeConnected: boolean;
  bookpiAnchorActive: boolean;
  lastSync: Date | null;

  setStatus: (status: NetworkStatus) => void;
  addNode: (node: NetworkNode) => void;
  removeNode: (id: string) => void;
  updateNodeStatus: (id: string, status: NodeStatus) => void;
  updateNodeLatency: (id: string, latency: number) => void;
  toggleQuantumEncryption: () => void;
  setMsrBridgeStatus: (connected: boolean) => void;
  setBookpiAnchor: (active: boolean) => void;
  recordSync: () => void;
  getHealth: () => NetworkHealth;
}

const NETWORK_LAYERS: NetworkLayer[] = ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7"];

const initialNodes: NetworkNode[] = [
  { id: "nexus-rdm", name: "Nexus-RDM (Nodo Cero)", status: "active", latency: 6, region: "Real del Monte, MX", layer: "L0" },
  { id: "nexus-alpha", name: "Nexus-Alpha", status: "active", latency: 12, region: "LATAM", layer: "L1" },
  { id: "nexus-beta", name: "Nexus-Beta", status: "active", latency: 8, region: "NA", layer: "L2" },
  { id: "nexus-gamma", name: "Nexus-Gamma", status: "idle", latency: 23, region: "EU", layer: "L3" },
  { id: "phoenix-swarm", name: "Phoenix Swarm", status: "active", latency: 14, region: "P2P libp2p", layer: "L4" },
  { id: "anubis-zk", name: "ANUBIS ZK Layer", status: "active", latency: 11, region: "ZK Mesh", layer: "L5" },
  { id: "bookpi-vault", name: "BookPI Vault (IPFS)", status: "active", latency: 19, region: "Filebase / IPFS", layer: "L6" },
  { id: "msr-bridge", name: "MSR Blockchain Bridge", status: "active", latency: 27, region: "EVM Sidechain", layer: "L7" },
];

function normalizeNode(node: NetworkNode): NetworkNode {
  return {
    ...node,
    id: node.id.trim().toLowerCase(),
    name: node.name.trim(),
    region: node.region.trim(),
    latency: clampNonNegative(node.latency),
  };
}

function calculateHealth(state: Pick<NetworkState, "nodes" | "quantumEncryptionActive" | "msrBridgeConnected" | "bookpiAnchorActive">): NetworkHealth {
  const activeNodes = state.nodes.filter((node) => node.status === "active").length;
  const averageLatency = state.nodes.length
    ? Math.round(state.nodes.reduce((sum, node) => sum + node.latency, 0) / state.nodes.length)
    : 0;
  const coveredLayers = new Set(state.nodes.filter((node) => node.status !== "error").map((node) => node.layer));
  const layerCoverage = Math.round((coveredLayers.size / NETWORK_LAYERS.length) * 100);
  const securityGaps = [state.quantumEncryptionActive, state.msrBridgeConnected, state.bookpiAnchorActive].filter(Boolean).length;

  const riskLevel = layerCoverage < 75 || securityGaps < 2 || averageLatency > 80 ? "high" : layerCoverage < 100 || activeNodes < state.nodes.length ? "medium" : "low";

  return { activeNodes, totalNodes: state.nodes.length, averageLatency, layerCoverage, riskLevel };
}

export const networkStore = createTamvStore<NetworkState>((set, get) => ({
  status: "online",
  nodes: initialNodes,
  quantumEncryptionActive: true,
  msrBridgeConnected: true,
  bookpiAnchorActive: true,
  lastSync: new Date(),

  setStatus: (status) => set({ status }),
  addNode: (node) =>
    set((state) => {
      const normalizedNode = normalizeNode(node);
      if (!normalizedNode.id || state.nodes.some((currentNode) => currentNode.id === normalizedNode.id)) {
        return {};
      }

      return { nodes: [...state.nodes, normalizedNode] };
    }),
  removeNode: (id) => set((state) => ({ nodes: state.nodes.filter((node) => node.id !== id) })),
  updateNodeStatus: (id, status) =>
    set((state) => ({ nodes: state.nodes.map((node) => (node.id === id ? { ...node, status } : node)) })),
  updateNodeLatency: (id, latency) =>
    set((state) => ({ nodes: state.nodes.map((node) => (node.id === id ? { ...node, latency: clampNonNegative(latency) } : node)) })),
  toggleQuantumEncryption: () => set((state) => ({ quantumEncryptionActive: !state.quantumEncryptionActive })),
  setMsrBridgeStatus: (msrBridgeConnected) => set({ msrBridgeConnected }),
  setBookpiAnchor: (bookpiAnchorActive) => set({ bookpiAnchorActive }),
  recordSync: () => set({ lastSync: new Date(), status: "online" }),
  getHealth: () => calculateHealth(get()),
}));

export const useNetworkStore = networkStore.useStore;
