// src/portals/hr/layouts/HRLayout.tsx
import React from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useThemeStore } from "@store/themeStore";
import { useAuthStore } from "@store/authStore";
import { cn } from "@utils/cn";

const navItems = [
  { label: "Dashboard", path: "/hr", exact: true },
  { label: "Employees", path: "/hr/employees" },
  { label: "Payroll", path: "/hr/payroll" },
];

export const HRLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarCollapsed } = useThemeStore();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-slate-200 bg-white transition-all duration-200",
          "dark:border-slate-700 dark:bg-slate-800",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shrink-0">
            HR
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-slate-900 dark:text-white">HR Portal</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3" aria-label="HR navigation">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                "dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white",
                "transition-colors"
              )}
              activeProps={{
                className: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
              }}
            >
              {!sidebarCollapsed && item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-slate-200 p-3 dark:border-slate-700">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-900 dark:text-white">
                  {user?.name}
                </p>
                <button
                  onClick={() => logout()}
                  className="text-xs text-slate-500 hover:text-red-600 dark:text-slate-400"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </main>
    </div>
  );
};
