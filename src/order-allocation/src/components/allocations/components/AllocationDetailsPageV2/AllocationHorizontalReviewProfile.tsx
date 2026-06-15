import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { AllocationHeaderDetail } from '@/pages/allocations/AllocationDetailsPage'

export const AllocationHorizontalReviewProfile: React.FC<{ header: AllocationHeaderDetail }> = ({ header }) => {
  return (
    <Card className="shadow-xs border-border bg-card">
      <CardContent className="p-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-xs divide-y md:divide-y-0 md:divide-x border-none divide-border/60">
        <div className="pt-1 md:pt-0">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Request ID</span>
          <span className="font-mono font-bold text-foreground mt-0.5 block">{header.requestId}</span>
        </div>
        <div className="pt-1 md:pt-0 md:pl-4">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Territory Area</span>
          <span className="font-medium text-foreground mt-0.5 block truncate">{header.region} ({header.subRegion})</span>
        </div>
        <div className="pt-1 md:pt-0 md:pl-4">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Operating Unit</span>
          <span className="font-medium text-foreground mt-0.5 block truncate">{header.operatingUnit === "103" ? "103 - Janatics OU" : header.operatingUnit}</span>
        </div>
        <div className="pt-1 md:pt-0 md:pl-4">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Target Week</span>
          <span className="font-semibold text-primary mt-0.5 block">{header.weeks}</span>
        </div>
        <div className="pt-1 md:pt-0 md:pl-4">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Prepared By</span>
          <span className="font-medium text-foreground mt-0.5 block truncate">{header.preparedBy} - A. SHARMA</span>
        </div>
        <div className="pt-1 md:pt-0 md:pl-4 col-span-2 md:col-span-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Profile Remarks</span>
          <span className="text-muted-foreground italic truncate mt-0.5 block">{header.remarks || 'None'}</span>
        </div>
      </CardContent>
    </Card>
  )
}
