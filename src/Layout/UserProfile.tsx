import { useEffect, useRef, useState } from "react"
import { ChevronsUpDown, LogOut, Settings, UserRound } from "lucide-react"
import { cn } from "@/lib/utils"
import { PORTAL_META } from "./nav-config"

const MENU = [
  { icon: UserRound, label: "My profile" },
  { icon: Settings, label: "Preferences" },
  { icon: LogOut, label: "Sign out" },
]

export function UserProfile() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const { user } = PORTAL_META
  const initials = user.name.split(" ").map((p) => p[0]).join("")

  return (
    <div ref={ref} className="relative px-3 pb-4">
      {open && (
        <div className="absolute bottom-full left-3 right-3 mb-2 animate-fade-in overflow-hidden rounded-lg border border-sidebar-border bg-card py-1 shadow-lg">
          {MENU.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Icon className="size-4 text-muted-foreground" />
              {label}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2 text-left transition-colors hover:bg-sidebar-accent",
        )}
      >
        <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
          {initials}
        </span>
        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</span>
          <span className="truncate text-xs text-sidebar-foreground/50">{user.role}</span>
        </span>
        <ChevronsUpDown className="size-4 text-sidebar-foreground/50" />
      </button>
    </div>
  )
}
