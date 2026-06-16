import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { RECENT_ENTRIES } from "@/data/allocations"
import { formatDate, formatNumber } from "@/lib/format"

export function RecentEntriesWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Item Entries</CardTitle>
      </CardHeader>
      <CardContent className="flex max-h-96 flex-col gap-2 overflow-y-auto scrollbar-thin">
        {RECENT_ENTRIES.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-1.5 rounded-lg border border-border bg-muted/40 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold">{entry.itemCode}</span>
              <StatusBadge status={entry.status} />
            </div>
            <p className="truncate text-xs text-muted-foreground">{entry.customer}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium tabular-nums">Qty {formatNumber(entry.quantity)}</span>
              <span className="text-muted-foreground">{formatDate(entry.targetDate)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
