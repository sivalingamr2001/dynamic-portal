import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { LoginCredentials, User } from "../shared/types/auth.types";
import { tokenManager } from "../shared/api/httpClient";
import { authService } from "../shared/services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasPortalAccess: (portal: string) => boolean;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (credentials) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          try {
            const { user, tokens } = await authService.login(credentials);
            tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
            set((state) => {
              state.user = user;
              state.isAuthenticated = true;
              state.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : "Login failed";
              state.isLoading = false;
            });
            throw error;
          }
        },

        logout: async () => {
          try {
            await authService.logout();
          } finally {
            tokenManager.clearTokens();
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.error = null;
            });
          }
        },

        refreshUser: async () => {
          try {
            const user = await authService.getMe();
            set((state) => {
              state.user = user;
              state.isAuthenticated = true;
            });
          } catch {
            tokenManager.clearTokens();
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
            });
          }
        },

        setUser: (user) =>
          set((state) => {
            state.user = user;
          }),

        clearError: () =>
          set((state) => {
            state.error = null;
          }),

        hasRole: (role) => {
          const user = get().user;
          return user?.roles.includes(role as never) ?? false;
        },

        hasPermission: (permission) => {
          const user = get().user;
          return user?.permissions.includes(permission as never) ?? false;
        },

        hasPortalAccess: (portal) => {
          const user = get().user;
          if (!user) return false;
          // Super admins get all portals
          if (user.roles.includes("SUPER_ADMIN" as never)) return true;
          return user.portalAccess.includes(portal);
        },
      })),
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);
