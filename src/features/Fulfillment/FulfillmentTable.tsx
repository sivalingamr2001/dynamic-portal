import { FulfillmentBadge } from "@/components/ui/status-badge"
import { formatNumber, formatSignedNumber } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { FulfillmentLine } from "@/data/types"

export function FulfillmentTable({ lines }: { lines: FulfillmentLine[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[920px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
            <th className="px-3 py-2.5 font-medium">Item Code</th>
            <th className="px-3 py-2.5 font-medium">Item Name</th>
            <th className="px-3 py-2.5 font-medium">Customer</th>
            <th className="px-3 py-2.5 font-medium">Region</th>
            <th className="px-3 py-2.5 text-right font-medium">Appr. Qty</th>
            <th className="px-3 py-2.5 text-right font-medium">Allocated</th>
            <th className="px-3 py-2.5 font-medium">Fill Progress</th>
            <th className="px-3 py-2.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => {
            const diff = line.allocated - line.approvedQty
            const fillPct =
              line.approvedQty === 0
                ? 0
                : Math.round((line.allocated / line.approvedQty) * 100)
            const barPct = Math.min(100, fillPct)
            const over = fillPct > 100
            return (
              <tr key={line.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-3 py-2.5 font-mono text-xs font-semibold">{line.itemCode}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{line.itemName}</td>
                <td className="px-3 py-2.5">{line.customer}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{line.region}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatNumber(line.approvedQty)}</td>
                <td className="px-3 py-2.5 text-right">
                  <span className="inline-flex items-center justify-end gap-1.5 tabular-nums">
                    <span className="font-medium">{formatNumber(line.allocated)}</span>
                    {diff !== 0 && (
                      <span className={cn("text-xs", diff < 0 ? "text-warning" : "text-success")}>
                        {formatSignedNumber(diff)}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          over ? "bg-warning" : line.status === "Fulfilled" ? "bg-success" : "bg-primary",
                        )}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-medium tabular-nums">{fillPct}%</span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-col gap-1">
                    <FulfillmentBadge status={line.status} />
                    <span className="text-[0.7rem] text-muted-foreground">{line.daysToOd}d OD</span>
                  </div>
                </td>
              </tr>
            )
          })}
          {lines.length === 0 && (
            <tr>
              <td colSpan={8} className="px-3 py-10 text-center text-sm text-muted-foreground">
                No fulfillment lines match the current filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
