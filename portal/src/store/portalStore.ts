import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { PortalModule } from "../shared/types/portal.types";

interface PortalState {
  currentPortalKey: string | null;
  currentPortal: PortalModule | null;
  loadedPortals: Map<string, PortalModule>;
  isLoading: boolean;
  error: string | null;
}

interface PortalActions {
  setCurrentPortal: (key: string, module: PortalModule) => void;
  cachePortal: (key: string, module: PortalModule) => void;
  getCachedPortal: (key: string) => PortalModule | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentPortal: () => void;
}

export const usePortalStore = create<PortalState & PortalActions>()(
  devtools(
    (set, get) => ({
      currentPortalKey: null,
      currentPortal: null,
      loadedPortals: new Map(),
      isLoading: false,
      error: null,

      setCurrentPortal: (key, module) =>
        set((state) => ({
          currentPortalKey: key,
          currentPortal: module,
          loadedPortals: new Map(state.loadedPortals).set(key, module),
          isLoading: false,
          error: null,
        })),

      cachePortal: (key, module) =>
        set((state) => ({
          loadedPortals: new Map(state.loadedPortals).set(key, module),
        })),

      getCachedPortal: (key) => get().loadedPortals.get(key),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      clearCurrentPortal: () => set({ currentPortalKey: null, currentPortal: null }),
    }),
    { name: "PortalStore" }
  )
);
