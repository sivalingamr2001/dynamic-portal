import { Boxes, FileCheck2, Layers, PackageCheck, TrendingDown, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatNumber, formatSignedNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

interface Props {
  metrics: {
    lines: number
    approvedQty: number
    allocated: number
    unallocated: number
    fillRate: number
    remainingPct: number
    orderAcks: number
  }
}

interface MetricCard {
  label: string
  value: string
  sub: string
  icon: LucideIcon
  tone: string
}

export function FulfillmentMetrics({ metrics }: Props) {
  const cards: MetricCard[] = [
    {
      label: "Approved Lines",
      value: formatNumber(metrics.lines),
      sub: "active items",
      icon: Layers,
      tone: "text-primary",
    },
    {
      label: "Approved Qty",
      value: formatNumber(metrics.approvedQty),
      sub: "total units",
      icon: Boxes,
      tone: "text-primary",
    },
    {
      label: "Allocated (OA)",
      value: formatNumber(metrics.allocated),
      sub: `${metrics.fillRate}% fill rate`,
      icon: PackageCheck,
      tone: "text-success",
    },
    {
      label: "Unallocated",
      value: formatSignedNumber(metrics.unallocated),
      sub: `${metrics.remainingPct}% remaining`,
      icon: TrendingDown,
      tone: metrics.unallocated < 0 ? "text-warning" : "text-muted-foreground",
    },
    {
      label: "Order Acknowledgements",
      value: formatNumber(metrics.orderAcks),
      sub: "linked to items",
      icon: FileCheck2,
      tone: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map(({ label, value, sub, icon: Icon, tone }) => (
        <Card key={label} className="flex flex-col gap-2 p-4">
          <span className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <Icon className={cn("size-4", tone)} />
          </span>
          <span className="text-2xl font-bold tabular-nums">{value}</span>
          <span className="text-xs text-muted-foreground">{sub}</span>
        </Card>
      ))}
    </div>
  )
}
