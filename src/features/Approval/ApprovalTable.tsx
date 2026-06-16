import { useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QtyInput } from "@/components/ui/qty-input"
import { StatusBadge } from "@/components/ui/status-badge"
import { usePortal } from "@/store/portal-store"
import { formatDate, formatNumber, formatSignedNumber } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { AllocationItem } from "@/data/types"
import type { SortDir, SortKey } from "./hooks/useApproval"

interface Props {
  items: AllocationItem[]
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
}

const isPending = (item: AllocationItem) =>
  item.status === "PENDING" || item.status === "AMENDMENT_PENDING"

export function ApprovalTable({ items, sortKey, sortDir, onSort }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[920px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
            <th className="w-10 px-3 py-2.5 font-medium">#</th>
            <th className="px-3 py-2.5 font-medium">Item Code</th>
            <th className="px-3 py-2.5 font-medium">Item Name</th>
            <SortableHeader label="Customer" col="customer" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <th className="px-3 py-2.5 font-medium">Region</th>
            <SortableHeader label="BIN Qty" col="binQty" sortKey={sortKey} sortDir={sortDir} onSort={onSort} align="right" />
            <th className="px-3 py-2.5 text-right font-medium">Approved Qty</th>
            <SortableHeader label="Target Date" col="targetDate" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <th className="px-3 py-2.5 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <ApprovalRow key={item.id} item={item} index={index} />
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={9} className="px-3 py-10 text-center text-sm text-muted-foreground">
                No items match the current filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function SortableHeader({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
  align = "left",
}: {
  label: string
  col: SortKey
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
  align?: "left" | "right"
}) {
  const active = sortKey === col
  const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown
  return (
    <th className={cn("px-3 py-2.5 font-medium", align === "right" && "text-right")}>
      <button
        type="button"
        onClick={() => onSort(col)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-foreground",
          align === "right" && "flex-row-reverse",
          active && "text-foreground",
        )}
      >
        {label}
        <Icon className="size-3" />
      </button>
    </th>
  )
}

function ApprovalRow({ item, index }: { item: AllocationItem; index: number }) {
  const { approveItem } = usePortal()
  const [qty, setQty] = useState(item.approvedQty || item.binQty)
  const pending = isPending(item)
  const diff = item.approvedQty - item.binQty

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30">
      <td className="px-3 py-2.5 text-muted-foreground tabular-nums">{index + 1}</td>
      <td className="px-3 py-2.5 font-mono text-xs font-semibold">{item.itemCode}</td>
      <td className="px-3 py-2.5 text-muted-foreground">{item.itemName}</td>
      <td className="px-3 py-2.5">{item.customer}</td>
      <td className="px-3 py-2.5 text-muted-foreground">{item.region}</td>
      <td className="px-3 py-2.5 text-right tabular-nums">{formatNumber(item.binQty)}</td>
      <td className="px-3 py-2.5 text-right">
        {pending ? (
          <QtyInput value={qty} step={10} onChange={setQty} className="ml-auto" />
        ) : (
          <span className="inline-flex items-center justify-end gap-1.5 tabular-nums">
            <span className="font-medium">{formatNumber(item.approvedQty)}</span>
            {diff !== 0 && (
              <span className={cn("text-xs", diff < 0 ? "text-warning" : "text-success")}>
                {formatSignedNumber(diff)}
              </span>
            )}
          </span>
        )}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">{formatDate(item.targetDate)}</td>
      <td className="px-3 py-2.5 text-right">
        {pending ? (
          <Button variant="success" size="xs" onClick={() => approveItem(item.id, qty)}>
            <Check /> Approve
          </Button>
        ) : (
          <span className="inline-flex items-center justify-end gap-1 text-xs text-muted-foreground">
            <Lock className="size-3" />
            <StatusBadge status={item.status} />
          </span>
        )}
      </td>
    </tr>
  )
}
