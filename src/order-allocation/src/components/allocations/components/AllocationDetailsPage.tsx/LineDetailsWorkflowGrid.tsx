import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import portalConfig from '@/config/portalConfig'
import type { AllocationLineDetail } from '@/pages/allocations/AllocationDetailsPage'
import { Check, Edit2, X } from 'lucide-react'
import React, { useState } from 'react'

interface LineDetailsGridProps {
  lines: AllocationLineDetail[]
  isEditable: boolean
  onUpdateLine: (id: string, fields: Partial<AllocationLineDetail>) => void
}

export const LineDetailsWorkflowGrid: React.FC<LineDetailsGridProps> = ({ lines, isEditable, onUpdateLine }) => {
  // Modal tracking state contexts
  const [activeLine, setActiveLine] = useState<AllocationLineDetail | null>(null)
  const [modalType, setModalType] = useState<'approve' | 'cancel' | 'edit' | null>(null)
  
  // Input tracking registers
  const [quantityInput, setQuantityInput] = useState<number>(0)
  const [reasonInput, setReasonInput] = useState<string>('')

  const openActionModal = (line: AllocationLineDetail, type: 'approve' | 'cancel' | 'edit') => {
    setActiveLine(line)
    setModalType(type)
    setQuantityInput(type === 'approve' ? line.requestedQuantity : line.requestedQuantity)
    setReasonInput(line.cancellationReason || '')
  }

  const handleCommitModalAction = () => {
    if (!activeLine || !modalType) return

    if (modalType === 'approve') {
      if (quantityInput <= 0 || quantityInput > activeLine.requestedQuantity) {
        alert('Approved volume must settle strictly between 1 and the requested target parameter limit.')
        return
      }
      onUpdateLine(activeLine.id, { 
        status: 'approve', 
        approvedQuantity: quantityInput, 
        cancelledQuantity: activeLine.requestedQuantity - quantityInput 
      })
    } else if (modalType === 'cancel') {
      if (!reasonInput) {
        alert('Please assign an structural cancellation reason code.')
        return
      }
      onUpdateLine(activeLine.id, { 
        status: 'cancel', 
        cancelledQuantity: activeLine.requestedQuantity, 
        approvedQuantity: 0, 
        cancellationReason: reasonInput 
      })
    } else if (modalType === 'edit') {
      if (quantityInput < 1) return
      onUpdateLine(activeLine.id, { requestedQuantity: quantityInput, status: 'pending' })
    }

    setModalType(null)
    setActiveLine(null)
  }

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="p-3.5 pb-1">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Line Allocation Items Engine</CardTitle>
      </CardHeader>
      <CardContent className="p-3.5 pt-0">
        <div className="rounded border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="h-8 hover:bg-transparent">
                <TableHead className="text-[10px] px-3 font-semibold h-8 w-12 text-center">Row</TableHead>
                <TableHead className="text-[10px] px-3 font-semibold h-8">Warehouse</TableHead>
                <TableHead className="text-[10px] px-3 font-semibold h-8">Item SKU</TableHead>
                <TableHead className="text-[10px] px-3 font-semibold h-8 text-right">Req Qty</TableHead>
                <TableHead className="text-[10px] px-3 font-semibold h-8 text-right">Allocated Qty</TableHead>
                <TableHead className="text-[10px] px-3 font-semibold h-8 text-center">Decision Status</TableHead>
                <TableHead className="text-[10px] px-3 font-semibold h-8 text-center w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line) => {
                const isLinePending = line.status === 'pending'
                return (
                  <TableRow key={line.id} className="h-9 hover:bg-muted/20 transition-colors">
                    <TableCell className="text-xs py-1 px-3 text-center font-medium text-muted-foreground">{line.lineNumber}</TableCell>
                    <TableCell className="text-xs py-1 px-3 font-medium text-foreground">{line.warehouse}</TableCell>
                    <TableCell className="text-xs py-1 px-3 font-mono text-foreground">{line.itemCode}</TableCell>
                    <TableCell className="text-xs py-1 px-3 text-right font-medium tabular-nums text-foreground">{line.requestedQuantity}</TableCell>
                    <TableCell className="text-xs py-1 px-3 text-right font-bold tabular-nums text-primary">
                      {line.status === 'approve' ? line.approvedQuantity : line.status === 'cancel' ? 0 : '—'}
                    </TableCell>
                    <TableCell className="text-xs py-1 px-3 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border uppercase ${
                        line.status === 'approve' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        line.status === 'cancel' ? 'bg-red-50 text-red-600 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {line.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-1 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Process Accept Button */}
                        <Button size="icon" variant="ghost" className="w-6 h-6 hover:bg-emerald-50 hover:text-emerald-600" onClick={() => openActionModal(line, 'approve')}>
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                        {/* Process Reject Button */}
                        <Button size="icon" variant="ghost" className="w-6 h-6 hover:bg-red-50 hover:text-red-500" onClick={() => openActionModal(line, 'cancel')}>
                          <X className="w-3.5 h-3.5" />
                        </Button>
                        {/* Process Volume Correction Input */}
                        <Button size="icon" variant="ghost" disabled={!isEditable} className="w-6 h-6 hover:bg-slate-100" onClick={() => openActionModal(line, 'edit')}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Action Dialog Overlay Modals Container */}
      <Dialog open={modalType !== null} onOpenChange={() => setModalType(null)}>
        <DialogContent className="sm:max-w-xs p-4 gap-3">
          <DialogHeader>
            <DialogTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {modalType === 'approve' && 'Authorize Row Allocation Volume'}
              {modalType === 'cancel' && 'Reject Row Allocation Event'}
              {modalType === 'edit' && 'Modify Request Target Volume'}
            </DialogTitle>
          </DialogHeader>

          {modalType === 'approve' && (
            <div className="space-y-2">
              <Label className="text-[11px] text-muted-foreground">Confirm Approved Quantity (Max: {activeLine?.requestedQuantity})</Label>
              <Input type="number" min="1" max={activeLine?.requestedQuantity} value={quantityInput} onChange={(e) => setQuantityInput(Number(e.target.value))} className="h-8 text-xs" />
            </div>
          )}

          {modalType === 'edit' && (
            <div className="space-y-2">
              <Label className="text-[11px] text-muted-foreground">Adjust Requested Target Units</Label>
              <Input type="number" min="1" value={quantityInput} onChange={(e) => setQuantityInput(Number(e.target.value))} className="h-8 text-xs" />
            </div>
          )}

          {modalType === 'cancel' && (
            <div className="space-y-2">
              <Label className="text-[11px] text-muted-foreground">Reason for Refusal/Cancellation</Label>
              <Select value={reasonInput} onValueChange={setReasonInput}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select reason code" />
                </SelectTrigger>
                <SelectContent>
                  {portalConfig.forms.approval?.decision?.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                  )) ?? (
                    <>
                      <SelectItem value="out_of_stock" className="text-xs">Out of Stock</SelectItem>
                      <SelectItem value="customer_request" className="text-xs">Customer Request Change</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="flex flex-row items-center justify-end gap-1.5 pt-1">
            <Button size="sm" variant="outline" className="h-7 text-xs px-2.5" onClick={() => setModalType(null)}>Cancel</Button>
            <Button size="sm" className="h-7 text-xs px-3 font-semibold" onClick={handleCommitModalAction}>Confirm Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
