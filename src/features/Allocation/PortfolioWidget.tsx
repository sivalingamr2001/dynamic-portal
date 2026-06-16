import { BarChart3, CheckCircle2, Clock, RefreshCw, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortal } from "@/store/portal-store"
import { cn } from "@/lib/utils"

interface Metric {
  key: "total" | "pending" | "approved" | "amend"
  label: string
  icon: LucideIcon
  tone: string
}

const METRICS: Metric[] = [
  { key: "total", label: "Total Items", icon: BarChart3, tone: "text-primary" },
  { key: "pending", label: "Pending Approval", icon: Clock, tone: "text-warning" },
  { key: "approved", label: "Approved", icon: CheckCircle2, tone: "text-success" },
  { key: "amend", label: "Amendment Pending", icon: RefreshCw, tone: "text-accent-foreground" },
]

export function PortfolioWidget() {
  const { counts } = usePortal()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {METRICS.map(({ key, label, icon: Icon, tone }) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2"
          >
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className={cn("size-4", tone)} />
              {label}
            </span>
            <span className="text-sm font-bold tabular-nums">{counts[key]}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
