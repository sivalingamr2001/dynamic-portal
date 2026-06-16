import { BarChart3, CheckCircle2, Clock, RefreshCw, type LucideIcon } from "lucide-react"
import { usePortal } from "@/store/portal-store"
import { cn } from "@/lib/utils"

interface Stat {
  key: "total" | "pending" | "amend" | "approved"
  label: string
  icon: LucideIcon
  tone: string
}

const STATS: Stat[] = [
  { key: "total", label: "Total Items", icon: BarChart3, tone: "text-primary" },
  { key: "pending", label: "Pending", icon: Clock, tone: "text-warning" },
  { key: "amend", label: "Amend", icon: RefreshCw, tone: "text-accent-foreground" },
  { key: "approved", label: "Approved", icon: CheckCircle2, tone: "text-success" },
]

export function StatsBar() {
  const { counts } = usePortal()
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map(({ key, label, icon: Icon, tone }) => (
        <div
          key={key}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"
        >
          <span className={cn("flex size-9 items-center justify-center rounded-lg bg-muted", tone)}>
            <Icon className="size-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold tabular-nums">{counts[key]}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
