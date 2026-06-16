import type { ItemOperatingUnitDto } from "@/api/allocationApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QtyInput } from "@/components/ui/qty-input"
import type { ItemLineDraft } from "@/data/types"
import { formatNumber } from "@/lib/format"
import { Plus, Trash2 } from "lucide-react"
import { type ChangeEvent } from "react"
import { InfiniteItemSelect } from "./InfiniteItemSelect"

interface Props {
  lines: ItemLineDraft[]
  totalQty: number
  onAddRow: () => void
  onRemoveRow: (id: string) => void
  onUpdate: (id: string, patch: Partial<ItemLineDraft>) => void
  itemOperatingUnits: ItemOperatingUnitDto[]
}

export function ItemLinesTable({ lines, totalQty, itemOperatingUnits, onAddRow, onRemoveRow, onUpdate }: Props) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Item Lines</h3>
        <Button variant="outline" size="sm" onClick={onAddRow}>
          <Plus /> Add Row
        </Button>
      </div>

      {/* Main container handling horizontal scrolling */}
      <div className="overflow-x-auto rounded-lg border border-border w-full">
        <div className="min-w-[700px] text-sm">

          {/* Fixed Header Layout (Updated colgroup array mapping parameters to fit new drop layout safely) */}
          <table className="w-full table-fixed border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
            <colgroup>
              <col className="w-12" />
              <col className="w-40" />
              <col className="w-52" />
              <col className="w-1/3" />
              <col className="w-36" />
              <col className="w-44" />
              <col className="w-14" />
            </colgroup>
            <thead>
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Organization</th>
                <th className="px-3 py-2 font-medium">Item Code</th>
                <th className="px-3 py-2 font-medium">Item Name</th>
                <th className="px-3 py-2 font-medium">Qty (BIN)</th>
                <th className="px-3 py-2 font-medium">Target Date</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
          </table>

          {/* Vertical scroll container set to cap height exactly after 7 rows (~336px) */}
          <div className="max-h-[350px] overflow-y-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-40" />
                <col className="w-52" />
                <col className="w-1/3" />
                <col className="w-36" />
                <col className="w-44" />
                <col className="w-14" />
              </colgroup>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={line.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-3 py-2 text-muted-foreground tabular-nums">{index + 1}</td>
                    
                    {/* Organization Cell Selector */}
                    <td className="px-3 py-2">
                      <select
                        value={line.organizationId}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => onUpdate(line.id, { organizationId: e.target.value })}
                        className="h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                      >
                        <option value="">Select org</option>
                        {itemOperatingUnits.map((ou: ItemOperatingUnitDto) => (
                          <option key={ou.organizationId} value={String(ou.organizationId)}>
                            {ou.organizationCode}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Integrated Infinite Scroll Item Code Cell Dropdown Selector */}
                    <td className="px-3 py-2 relative">
                      <InfiniteItemSelect 
                        currentValue={line.itemCode}
                        onSelectCode={(code) => onUpdate(line.id, { itemCode: code })}
                      />
                    </td>

                    {/* Item Name Metadata Cell */}
                    <td className="truncate px-3 py-2 text-xs text-muted-foreground" title={line.itemName}>
                      {line.itemName || "— select item code first"}
                    </td>

                    {/* Quantity Cell */}
                    <td className="px-3 py-2">
                      <QtyInput
                        value={line.qty}
                        step={10}
                        onChange={(qty: number) => onUpdate(line.id, { qty })}
                      />
                    </td>

                    {/* Target Date Input Cell */}
                    <td className="px-3 py-2">
                      <Input
                        type="date"
                        value={line.targetDate}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate(line.id, { targetDate: e.target.value })}
                        className="h-8 w-full text-xs"
                      />
                    </td>

                    {/* Action Deletion Row Button Wrapper Cell */}
                    <td className="px-3 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={lines.length === 1}
                        onClick={() => onRemoveRow(line.id)}
                        aria-label="Delete row"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <div className="flex items-center justify-between text-sm mt-1">
        <span className="text-muted-foreground">{lines.length} item line(s)</span>
        <span className="font-semibold">Total Qty: {formatNumber(totalQty)}</span>
      </div>
    </div>
  )
}
