import React from 'react'
import { Copy, Trash2 } from 'lucide-react'
import portalConfig from '../../../config/portalConfig'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { LineItemWithId } from '@/pages/allocations/NewAllocationPage'

interface LineItemsTableProps {
  lines: LineItemWithId[]
  setLines: React.Dispatch<React.SetStateAction<LineItemWithId[]>>
}

export const LineItemsTable: React.FC<LineItemsTableProps> = ({ lines, setLines }) => {
  if (lines.length === 0) return null

  const removeLine = (id: string) => setLines(lines.filter((l) => l.id !== id))
  const duplicateLine = (id: string) => {
    const original = lines.find((l) => l.id === id)
    if (original) {
      const { id: _, ...rest } = original
      setLines([...lines, { ...rest, id: Date.now().toString() }])
    }
  }

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="h-8 hover:bg-transparent">
            <TableHead className="text-[11px] h-8 px-3 font-semibold">Warehouse</TableHead>
            <TableHead className="text-[11px] h-8 px-3 font-semibold">Item SKU</TableHead>
            <TableHead className="text-[11px] h-8 px-3 font-semibold text-right">Qty</TableHead>
            <TableHead className="text-[11px] h-8 px-3 font-semibold">Target Date</TableHead>
            <TableHead className="text-[11px] h-8 px-3 font-semibold text-center w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line) => (
            <TableRow key={line.id} className="h-8 hover:bg-muted/30 transition-colors">
              <TableCell className="text-xs py-1 px-3 max-w-[120px] truncate">
                {portalConfig.warehouses.find((w) => w.id === line.warehouse)?.label || line.warehouse}
              </TableCell>
              <TableCell className="text-xs py-1 px-3 font-medium tracking-tight">{line.itemCode}</TableCell>
              <TableCell className="text-xs py-1 px-3 text-right tabular-nums">{line.requestedQuantity}</TableCell>
              <TableCell className="text-xs py-1 px-3 text-muted-foreground">
                {new Date(line.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </TableCell>
              <TableCell className="py-1 px-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Button size="icon" variant="ghost" className="w-6 h-6 rounded hover:bg-background" onClick={() => duplicateLine(line.id)}>
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  </Button>
                  <Button size="icon" variant="ghost" className="w-6 h-6 rounded hover:bg-destructive/10 text-destructive hover:text-destructive" onClick={() => removeLine(line.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
