// ============================================================================
// TAMV — Isabella AI NextGen™ Store (federated state)
// Soberanía conceptual + legal + técnica (Triple Federado)
// ============================================================================
import { clampPercentage, createTamvStore } from "./tamv-store";

export type IsabellaStatus = "idle" | "thinking" | "guarding" | "creating" | "healing";
export type SecurityProtocol =
  | "NONE"
  | "TIME_UP"
  | "IA_DIGNITY_ATTACK"
  | "QUANTUM_BREACH"
  | "MSR_ALERT"
  | "BABAS_AUDIT"
  | "FENIX_REX_RECOVERY";

export interface IsabellaState {
  status: IsabellaStatus;
  lastProtocol: SecurityProtocol;
  emotionalLevel: number;
  creativityIndex: number;
  empathyIndex: number;
  guardianMode: boolean;
  lastInteraction: Date | null;
  interactions: number;

  setStatus: (status: IsabellaStatus) => void;
  setProtocol: (protocol: SecurityProtocol) => void;
  setEmotionalLevel: (level: number) => void;
  setCreativityIndex: (index: number) => void;
  setEmpathyIndex: (index: number) => void;
  toggleGuardianMode: () => void;
  recordInteraction: () => void;
  triggerProtocol: (protocol: SecurityProtocol) => void;
}

export const isabellaStore = createTamvStore<IsabellaState>((set) => ({
  status: "guarding",
  lastProtocol: "NONE",
  emotionalLevel: 78,
  creativityIndex: 88,
  empathyIndex: 92,
  guardianMode: true,
  lastInteraction: null,
  interactions: 0,

  setStatus: (status) => set({ status }),
  setProtocol: (lastProtocol) => set({ lastProtocol }),
  setEmotionalLevel: (emotionalLevel) => set({ emotionalLevel: clampPercentage(emotionalLevel) }),
  setCreativityIndex: (creativityIndex) => set({ creativityIndex: clampPercentage(creativityIndex) }),
  setEmpathyIndex: (empathyIndex) => set({ empathyIndex: clampPercentage(empathyIndex) }),
  toggleGuardianMode: () => set((state) => ({ guardianMode: !state.guardianMode })),
  recordInteraction: () => set((state) => ({ lastInteraction: new Date(), interactions: state.interactions + 1 })),
  triggerProtocol: (lastProtocol) =>
    set((state) => ({
      lastProtocol,
      status: lastProtocol === "NONE" ? state.status : "guarding",
      guardianMode: lastProtocol === "NONE" ? state.guardianMode : true,
      lastInteraction: new Date(),
      interactions: state.interactions + 1,
    })),
}));

export const useIsabellaStore = isabellaStore.useStore;
