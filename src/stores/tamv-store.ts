import { useSyncExternalStore } from "react";

export type StoreApi<TState extends object> = {
  getState: () => TState;
  setState: (updater: Partial<TState> | ((state: TState) => Partial<TState>)) => void;
  subscribe: (listener: () => void) => () => void;
  useStore: <TSelected>(selector: (state: TState) => TSelected) => TSelected;
};

export function createTamvStore<TState extends object>(
  initializer: (set: StoreApi<TState>["setState"], get: StoreApi<TState>["getState"]) => TState,
): StoreApi<TState> {
  let state: TState;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState: StoreApi<TState>["setState"] = (updater) => {
    const patch = typeof updater === "function" ? updater(state) : updater;
    const nextState = { ...state, ...patch };

    if (Object.is(nextState, state)) {
      return;
    }

    state = nextState;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const useStore = <TSelected>(selector: (currentState: TState) => TSelected) =>
    useSyncExternalStore(subscribe, () => selector(state), () => selector(state));

  state = initializer(setState, getState);

  return { getState, setState, subscribe, useStore };
}

export function clampPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

export function clampNonNegative(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

export function createClientId(prefix: string) {
  const randomUUID = globalThis.crypto?.randomUUID;

  if (typeof randomUUID === "function") {
    return `${prefix}-${randomUUID.call(globalThis.crypto)}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
