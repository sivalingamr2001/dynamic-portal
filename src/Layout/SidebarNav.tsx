import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { usePortal } from "@/store/portal-store"
import { NAV_ITEMS } from "./nav-config"

interface Props {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: Props) {
  const { counts } = usePortal()
  const badges = { approval: counts.pending, amendment: counts.amend }

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
        Workflow
      </p>
      {NAV_ITEMS.map(({ to, label, description, icon: Icon, badgeKey }) => {
        const badge = badgeKey ? badges[badgeKey] : 0
        return (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-primary/15 text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    isActive
                      ? "border-sidebar-primary/40 bg-sidebar-primary text-sidebar-primary-foreground"
                      : "border-sidebar-border bg-sidebar-accent/40 text-sidebar-foreground/70 group-hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sidebar-foreground">{label}</span>
                    {badge > 0 && (
                      <span className="rounded-full bg-sidebar-primary px-1.5 py-0.5 text-[0.65rem] font-bold leading-none text-sidebar-primary-foreground">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/45">{description}</span>
                </span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
