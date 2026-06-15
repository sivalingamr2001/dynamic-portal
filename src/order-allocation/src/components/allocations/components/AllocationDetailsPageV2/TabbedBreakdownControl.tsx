import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import type { AllocationHeaderDetail, AllocationLineDetail } from '@/pages/allocations/AllocationDetailsPage'
import { LineDetailsWorkflowGrid } from '../AllocationDetailsPage.tsx/LineDetailsWorkflowGrid'

interface TabbedControlProps {
  header: AllocationHeaderDetail
  lines: AllocationLineDetail[]
  isEditable: boolean
  onUpdateLine: (id: string, fields: Partial<AllocationLineDetail>) => void
}

export const TabbedBreakdownControl: React.FC<TabbedControlProps> = ({ header, lines, isEditable, onUpdateLine }) => {
  return (
    <Tabs defaultValue="lines" className="w-full">
      <TabsList className="h-8 p-0.5 bg-muted/60 border border-border/80 w-full justify-start rounded-md mb-2">
        <TabsTrigger value="lines" className="h-7 text-xs px-4 font-medium data-[state=active]:shadow-2xs">
          Line Item Details List
        </TabsTrigger>
        <TabsTrigger value="addresses" className="h-7 text-xs px-4 font-medium data-[state=active]:shadow-2xs">
          Customer Address Master Records
        </TabsTrigger>
      </TabsList>

      {/* TAB 1: Maximum Width Item Table Component Workspace Grid */}
      <TabsContent value="lines" className="focus-visible:outline-none mt-0">
        <LineDetailsWorkflowGrid lines={lines} isEditable={isEditable} onUpdateLine={onUpdateLine} />
      </TabsContent>

      {/* TAB 2: Isolated Customer Delivery Mapping block */}
      <TabsContent value="addresses" className="focus-visible:outline-none mt-0">
        <Card className="shadow-xs border-border">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-muted/20 border border-dashed rounded-lg space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Bill-To Entity</span>
              <div className="font-semibold text-foreground text-sm">{header.billToCustomer || 'N/A'}</div>
              <div><span className="text-muted-foreground">Location ID Site:</span> <span className="font-mono text-foreground font-semibold">{header.billToLocation || 'N/A'}</span></div>
              <p className="text-muted-foreground border-t border-border pt-1.5 mt-1.5 bg-background p-1.5 rounded leading-normal">{header.billToAddress}</p>
            </div>

            <div className="p-3 bg-muted/20 border border-dashed rounded-lg space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Ship-To Entity</span>
              <div className="font-semibold text-foreground text-sm">{header.shipToCustomer || 'N/A'}</div>
              <div><span className="text-muted-foreground">Location ID Site:</span> <span className="font-mono text-foreground font-semibold">{header.shipToLocation || 'N/A'}</span></div>
              <p className="text-muted-foreground border-t border-border pt-1.5 mt-1.5 bg-background p-1.5 rounded leading-normal">{header.shipToAddress}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
