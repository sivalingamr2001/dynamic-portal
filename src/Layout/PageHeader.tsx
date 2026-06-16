import { CalendarDays, type LucideIcon } from "lucide-react"
import { PORTAL_META } from "./nav-config"

interface Props {
  icon: LucideIcon
  title: React.ReactNode // Broadened type context to receive raw strings or custom node elements seamlessly
  description: React.ReactNode
  action?: React.ReactNode
}

export function PageHeader({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3">
      <div className="flex items-center gap-2.5">
        {/* Shrunk icon wrapper footprint container from size-11 down to size-8 */}
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm">
          <Icon className="size-5" />
        </span>
        <div className="flex flex-col">
          {/* Compressed text headers to match compact form style guides */}
          <div className="text-sm font-bold tracking-tight text-foreground text-balance">
            {title}
          </div>
          <div className="text-xs text-muted-foreground/90 text-pretty">
            {description}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action}
        {/* Condensed metadata date indicator tag element blocks */}
        <span className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground sm:flex h-7">
          <CalendarDays className="size-3 shrink-0" />
          {PORTAL_META.date}
        </span>
      </div>
    </div>
  )
}
