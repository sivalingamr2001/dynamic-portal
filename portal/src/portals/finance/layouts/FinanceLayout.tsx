// src/portals/finance/layouts/FinanceLayout.tsx
import React from "react";
import { Link } from "@tanstack/react-router";
import { useThemeStore } from "@store/themeStore";
import { useAuthStore } from "@store/authStore";
import { cn } from "@utils/cn";

const navItems = [
  { label: "Dashboard", path: "/finance" },
  { label: "Reports", path: "/finance/reports" },
  { label: "Invoices", path: "/finance/invoices" },
];

export const FinanceLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarCollapsed } = useThemeStore();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <aside
        className={cn(
          "flex flex-col bg-emerald-900 text-white transition-all duration-200",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-16 items-center gap-3 px-4 border-b border-emerald-800">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 font-bold text-sm">
            $
          </div>
          {!sidebarCollapsed && <span className="font-semibold">Finance</span>}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-800 hover:text-white transition-colors"
              activeProps={{ className: "bg-emerald-700 text-white" }}
            >
              {!sidebarCollapsed && item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-emerald-800 p-3">
          <div className="flex items-center gap-3 p-2">
            <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{user?.name}</p>
                <button
                  onClick={() => logout()}
                  className="text-xs text-emerald-300 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </main>
    </div>
  );
};
