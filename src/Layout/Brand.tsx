import { Boxes } from "lucide-react"
import { cn } from "@/lib/utils"
import { PORTAL_META } from "./nav-config"

export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
        <Boxes className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
          {PORTAL_META.company}
        </span>
        <span className="text-[0.7rem] text-sidebar-foreground/50">{PORTAL_META.portal}</span>
      </span>
    </div>
  )
}
