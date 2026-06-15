import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Plus, ArrowLeft, ChevronRight } from 'lucide-react'
import portalConfig from '../../../config/portalConfig'
import { LineItemsTable } from './LineItemsTable'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LineItemWithId } from '@/pages/allocations/NewAllocationPage'

export const lineSchema = z.object({
  warehouse: z.string().min(1, 'Warehouse is required'),
  itemCode: z.string().min(1, 'Item code is required'),
  requestedQuantity: z.number().min(1, 'Quantity must be at least 1'),
  targetDate: z.string().min(1, 'Target date is required'),
})

interface LineFormStepProps {
  form: UseFormReturn<z.infer<typeof lineSchema>>
  lines: LineItemWithId[]
  setLines: React.Dispatch<React.SetStateAction<LineItemWithId[]>>
  onBack: () => void
  onNext: () => void
}

export const LineFormStep: React.FC<LineFormStepProps> = ({ 
  form, 
  lines, 
  setLines, 
  onBack, 
  onNext 
}) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = form

  const onAddLine = handleSubmit((data) => {
    setLines((prev) => [...prev, { ...data, id: Date.now().toString() }])
    reset()
  })

  return (
    <motion.div 
      initial={{ opacity: 0, x: 15 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -15 }} 
      className="space-y-4 w-full"
    >
      {/* Input Form Card */}
      <Card className="shadow-sm border-border w-full">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold tracking-tight">Line Generation Engine</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          <form onSubmit={onAddLine} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 items-end">
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Warehouse Source</Label>
              <Select onValueChange={(val) => setValue('warehouse', val, { shouldValidate: true })}>
                <SelectTrigger className="h-8 text-xs px-2">
                  <SelectValue placeholder="Select WH" />
                </SelectTrigger>
                <SelectContent>
                  {portalConfig.warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id} className="text-xs">{w.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.warehouse && <p className="text-[10px] text-destructive">{errors.warehouse.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">SKU Item Code</Label>
              <Input className="h-8 text-xs px-2" placeholder="SKU entry" {...register('itemCode')} />
              {errors.itemCode && <p className="text-[10px] text-destructive">{errors.itemCode.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Alloc Qty</Label>
              <Input type="number" min="1" className="h-8 text-xs px-2" {...register('requestedQuantity', { valueAsNumber: true })} />
              {errors.requestedQuantity && <p className="text-[10px] text-destructive">{errors.requestedQuantity.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Target Delivery</Label>
              <Input type="date" className="h-8 text-xs px-2" {...register('targetDate')} />
              {errors.targetDate && <p className="text-[10px] text-destructive">{errors.targetDate.message}</p>}
            </div>

            <Button type="submit" size="sm" variant="secondary" className="h-8 text-xs w-full sm:col-span-2 md:col-span-4 mt-2">
              <Plus className="w-3.5 h-3.5 mr-1" /> Inject Item Row
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Grid Data Breakdown */}
      <LineItemsTable lines={lines} setLines={setLines} />

      {/* High-Density Compact Navigation Toolbar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs px-3 font-medium"
          onClick={onBack}
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> 
          Back to Details
        </Button>

        <Button 
          type="button" 
          size="sm" 
          className="h-8 text-xs px-4 font-medium"
          onClick={onNext}
          disabled={lines.length === 0}
        >
          Review Parameters 
          <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </motion.div>
  )
}
