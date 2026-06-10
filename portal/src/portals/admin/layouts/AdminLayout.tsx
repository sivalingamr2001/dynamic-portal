// src/portals/admin/layouts/AdminLayout.tsx
import React from "react";
import { Link } from "@tanstack/react-router";
import { useThemeStore } from "@store/themeStore";
import { useAuthStore } from "@store/authStore";
import { cn } from "@utils/cn";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Users", path: "/admin/users" },
  { label: "Settings", path: "/admin/settings" },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarCollapsed, toggleSidebar } = useThemeStore();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
      <aside
        className={cn(
          "flex flex-col bg-violet-950 text-white transition-all duration-200",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-violet-900">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500 font-bold text-sm">
              A
            </div>
            {!sidebarCollapsed && <span className="font-semibold">Admin</span>}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-violet-400 hover:text-white text-xs hidden sm:block"
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-violet-300 hover:bg-violet-900 hover:text-white transition-colors"
              activeProps={{ className: "bg-violet-800 text-white" }}
            >
              {!sidebarCollapsed && item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-violet-900 p-3">
          <div className="flex items-center gap-3 p-2">
            <div className="h-8 w-8 shrink-0 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0) ?? "A"}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{user?.name}</p>
                <button
                  onClick={() => logout()}
                  className="text-xs text-violet-400 hover:text-white"
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
