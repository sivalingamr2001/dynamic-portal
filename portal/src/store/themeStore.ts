import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
type ColorScheme = "blue" | "purple" | "green" | "orange";

interface ThemeState {
  theme: Theme;
  colorScheme: ColorScheme;
  sidebarCollapsed: boolean;
  isDark: boolean;
}

interface ThemeActions {
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const getSystemTheme = (): boolean => window.matchMedia("(prefers-color-scheme: dark)").matches;

const applyTheme = (theme: Theme): boolean => {
  const isDark = theme === "system" ? getSystemTheme() : theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  return isDark;
};

export const useThemeStore = create<ThemeState & ThemeActions>()(
  devtools(
    persist(
      (set, get) => ({
        theme: "system",
        colorScheme: "blue",
        sidebarCollapsed: false,
        isDark: getSystemTheme(),

        setTheme: (theme) => {
          const isDark = applyTheme(theme);
          set({ theme, isDark });
        },

        setColorScheme: (colorScheme) => set({ colorScheme }),

        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      }),
      { name: "theme-store" }
    ),
    { name: "ThemeStore" }
  )
);

// Sync system theme changes
if (typeof window !== "undefined") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const store = useThemeStore.getState();
    if (store.theme === "system") {
      const isDark = applyTheme("system");
      useThemeStore.setState({ isDark });
    }
  });
}
