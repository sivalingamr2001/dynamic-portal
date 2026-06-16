import { cn } from "@/lib/utils"
import type { FulfillmentStatus, ItemStatus } from "@/data/types"

const ITEM_STYLES: Record<ItemStatus, { label: string; className: string }> = {
  APPROVED: { label: "Approved", className: "bg-success/12 text-success border-success/25" },
  PENDING: { label: "Pending", className: "bg-warning/15 text-warning border-warning/30" },
  AMEND: { label: "Amend", className: "bg-accent text-accent-foreground border-primary/25" },
  AMENDMENT_PENDING: {
    label: "Amend Pending",
    className: "bg-accent text-accent-foreground border-primary/25",
  },
}

const FULFILLMENT_STYLES: Record<FulfillmentStatus, string> = {
  Fulfilled: "bg-success/12 text-success border-success/25",
  Partial: "bg-warning/15 text-warning border-warning/30",
  Open: "bg-muted text-muted-foreground border-border",
}

const BASE = "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold"

export function StatusBadge({ status }: { status: ItemStatus }) {
  const { label, className } = ITEM_STYLES[status]
  return <span className={cn(BASE, className)}>{label}</span>
}

export function FulfillmentBadge({ status }: { status: FulfillmentStatus }) {
  return <span className={cn(BASE, FULFILLMENT_STYLES[status])}>{status}</span>
}
