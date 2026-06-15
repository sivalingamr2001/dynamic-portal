import React from 'react'
import { Send, Hash, TrendingUp, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { AllocationHeaderDetail, AllocationLineDetail } from '@/pages/allocations/AllocationDetailsPage'

interface AllocationDetailsSidebarProps {
  header: AllocationHeaderDetail
  lines: AllocationLineDetail[]
  onFinalize: () => void
  isSubmitting: boolean
}

export const AllocationDetailsSidebarSummary: React.FC<AllocationDetailsSidebarProps> = ({
  header,
  lines,
  onFinalize,
  isSubmitting
}) => {
  const totalRowsCount = lines.length
  const totalRequestedVolume = lines.reduce((sum, l) => sum + l.requestedQuantity, 0)
  
  const totalApprovedVolume = lines.reduce((sum, l) => sum + (l.status === 'approve' ? (l.approvedQuantity || 0) : 0), 0)
  const totalCancelledVolume = lines.reduce((sum, l) => sum + (l.status === 'cancel' ? l.requestedQuantity : (l.status === 'approve' ? (l.cancelledQuantity || 0) : 0)), 0)
  
  const pendingLinesCount = lines.filter(l => l.status === 'pending').length

  return (
    <Card className="shadow-sm border-border bg-muted/10 sticky top-4">
      <CardHeader className="p-3.5 pb-2 border-b border-border bg-card">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Live Audit Totals Analytics
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3.5 space-y-2.5 text-xs">
        <div className="flex justify-between items-center py-0.5">
          <span className="text-muted-foreground">Context Strategy Type:</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize h-5 font-medium bg-background">
            {header.allocationBasis.replace('_', ' ')}
          </Badge>
        </div>

        <div className="flex justify-between items-center py-0.5 border-t border-dashed pt-2">
          <span className="text-muted-foreground">Gross Logged Rows:</span>
          <span className="font-semibold text-foreground">{totalRowsCount} items</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="text-muted-foreground">Gross Requested Units:</span>
          <span className="font-medium text-foreground tabular-nums">{totalRequestedVolume} units</span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-emerald-700 font-medium">
          <span>Running Approved Units:</span>
          <span className="font-bold tabular-nums">{totalApprovedVolume} units</span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-red-600 font-medium">
          <span>Running Deducted/Cancelled:</span>
          <span className="font-bold tabular-nums">{totalCancelledVolume} units</span>
        </div>

        <div className="flex justify-between items-center py-2 border-t border-b bg-background px-2 my-1 rounded border">
          <span className="font-medium text-foreground">Awaiting Decision:</span>
          <Badge variant={pendingLinesCount > 0 ? "default" : "secondary"} className={`text-[10px] font-bold px-1.5 h-5 ${pendingLinesCount > 0 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
            {pendingLinesCount} remaining
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-3.5 pt-0 bg-card border-t border-border mt-1">
        <Button 
          type="button" 
          size="sm" 
          disabled={isSubmitting || pendingLinesCount > 0}
          className="w-full h-8 text-xs font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/95 shadow-xs" 
          onClick={onFinalize}
        >
          {isSubmitting ? 'Syncing Base Ledger...' : 'Commit Operational Decisions'}
          <Send className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
