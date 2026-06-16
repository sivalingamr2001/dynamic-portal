import { Check } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatDate, formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { AllocationItem } from "@/data/types"

interface Props {
  items: AllocationItem[]
  selected: Set<string>
  allSelected: boolean
  onToggle: (id: string) => void
  onToggleAll: () => void
}

function Checkbox({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean
  disabled?: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        "flex size-4 items-center justify-center rounded border transition-colors",
        checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card",
        disabled ? "cursor-not-allowed opacity-40" : "hover:border-primary",
      )}
    >
      {checked && <Check className="size-3" />}
    </button>
  )
}

export function AmendmentTable({ items, selected, allSelected, onToggle, onToggleAll }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
            <th className="w-12 px-3 py-2.5">
              <Checkbox checked={allSelected} onChange={onToggleAll} label="Select all items" />
            </th>
            <th className="px-3 py-2.5 font-medium">Item Code</th>
            <th className="px-3 py-2.5 font-medium">Item Name</th>
            <th className="px-3 py-2.5 font-medium">Customer</th>
            <th className="px-3 py-2.5 font-medium">Region</th>
            <th className="px-3 py-2.5 text-right font-medium">Appr. Qty</th>
            <th className="px-3 py-2.5 font-medium">Target Date</th>
            <th className="px-3 py-2.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const locked = item.status !== "APPROVED"
            const isChecked = selected.has(item.id)
            return (
              <tr
                key={item.id}
                className={cn(
                  "border-b border-border last:border-0 transition-colors",
                  isChecked ? "bg-accent/60" : "hover:bg-muted/30",
                )}
              >
                <td className="px-3 py-2.5">
                  <Checkbox
                    checked={isChecked}
                    disabled={locked}
                    onChange={() => onToggle(item.id)}
                    label={`Select ${item.itemCode}`}
                  />
                </td>
                <td className="px-3 py-2.5 font-mono text-xs font-semibold">{item.itemCode}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{item.itemName}</td>
                <td className="px-3 py-2.5">{item.customer}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{item.region}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatNumber(item.approvedQty)}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                  {formatDate(item.targetDate)}
                </td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            )
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={8} className="px-3 py-10 text-center text-sm text-muted-foreground">
                No eligible items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
