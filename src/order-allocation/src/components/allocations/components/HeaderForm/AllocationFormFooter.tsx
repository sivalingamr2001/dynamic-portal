import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { ChevronRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const AllocationFormFooter: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  const { register } = form
  return (
    <div className="space-y-3 pt-2">
      <div className="space-y-1">
        <Label htmlFor="remarks" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Allocation Processing Remarks & Instructions
        </Label>
        <Textarea
          id="remarks"
          className="text-xs p-2.5 min-h-[54px] max-h-[120px] bg-background border-border/80 focus-visible:ring-primary/40 resize-y shadow-xs"
          placeholder="Provide internal freight router tags, clearance exceptions, or priority routing rules..."
          {...register('remarks')}
        />
      </div>

      <div className="pt-1">
        <Button 
          type="submit" 
          size="sm" 
          className="w-full h-8 text-xs font-semibold tracking-wide shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
        >
          Confirm Details & Open Line Builder
          <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </div>
  )
}
