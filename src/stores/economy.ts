// ============================================================================
// TAMV — Economy Store: TC, MSR, TAMV balances + 20/30/50 Phoenix rule
// ============================================================================
import { clampNonNegative, createClientId, createTamvStore } from "./tamv-store";

export type TxType = "credit" | "debit" | "stake" | "reward" | "donation";

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  description: string;
  timestamp: Date;
  msrHash?: string;
}

export interface EconomyState {
  tcBalance: number;
  msrBalance: number;
  tamvBalance: number;
  stakedAmount: number;
  recentTransactions: Transaction[];
  phoenixFund: number;
  infraFund: number;
  reserveFund: number;

  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => void;
  updateBalances: (tc: number, msr: number, tamv: number) => void;
  setStakedAmount: (amount: number) => void;
  distributeFunds: (profit: number) => void;
}

function normalizeDescription(description: string) {
  return description.trim().slice(0, 180) || "Movimiento TAMV";
}

export const economyStore = createTamvStore<EconomyState>((set) => ({
  tcBalance: 100,
  msrBalance: 0,
  tamvBalance: 0,
  stakedAmount: 0,
  recentTransactions: [],
  phoenixFund: 0,
  infraFund: 0,
  reserveFund: 0,

  addTransaction: (tx) =>
    set((state) => ({
      recentTransactions: [
        {
          ...tx,
          amount: clampNonNegative(tx.amount),
          description: normalizeDescription(tx.description),
          id: createClientId("tx"),
          timestamp: new Date(),
        },
        ...state.recentTransactions.slice(0, 49),
      ],
    })),
  updateBalances: (tcBalance, msrBalance, tamvBalance) =>
    set({
      tcBalance: clampNonNegative(tcBalance),
      msrBalance: clampNonNegative(msrBalance),
      tamvBalance: clampNonNegative(tamvBalance),
    }),
  setStakedAmount: (stakedAmount) => set({ stakedAmount: clampNonNegative(stakedAmount) }),
  distributeFunds: (profit) =>
    set((state) => {
      const normalizedProfit = clampNonNegative(profit);

      return {
        phoenixFund: state.phoenixFund + normalizedProfit * 0.2,
        infraFund: state.infraFund + normalizedProfit * 0.3,
        reserveFund: state.reserveFund + normalizedProfit * 0.5,
      };
    }),
}));

export const useEconomyStore = economyStore.useStore;
