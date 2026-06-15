import React from 'react'
import { MapPin, Layers, Calendar, User, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AllocationHeaderDetail } from '@/pages/allocations/AllocationDetailsPage'

interface AllocationDetailsHeaderProps {
  header: AllocationHeaderDetail
  isEditable: boolean
}

export const AllocationDetailsHeaderCard: React.FC<AllocationDetailsHeaderProps> = ({ header, isEditable }) => {
  // Compute exact ticking threshold metrics remaining until expiration rule drops
  const creationTime = new Date(header.createdAt).getTime()
  const millisecondsRemaining = (creationTime + 24 * 60 * 60 * 1000) - Date.now()
  const hoursLeft = Math.max(0, Math.floor(millisecondsRemaining / (1000 * 60 * 60)))

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="p-3.5 pb-2 bg-muted/20 border-b border-border/60 flex flex-row items-center justify-between space-y-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              Request Profile Matrix: {header.requestId}
            </CardTitle>
            <Badge variant="outline" className="text-[10px] h-5 py-0 capitalize px-2 font-medium bg-background">
              Status: {header.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Expiration Rules Indicator Ribbon */}
        {isEditable ? (
          <div className="text-[10px] font-medium bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" /> Modifications Unlock Gate: {hoursLeft}h Left
          </div>
        ) : (
          <div className="text-[10px] font-medium bg-slate-100 text-slate-500 border px-2 py-0.5 rounded flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Modifications Locked (24hr limit or processed)
          </div>
        )}
      </CardHeader>

      <CardContent className="p-3.5 space-y-3.5 text-xs">
        {/* Core Dropdown Labels Mirror Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="p-2 border rounded bg-muted/5 flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground uppercase block tracking-tight font-medium">Territory/Sub</span>
              <span className="font-semibold text-foreground">{header.region} / {header.subRegion}</span>
            </div>
          </div>
          <div className="p-2 border rounded bg-muted/5 flex items-start gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground uppercase block tracking-tight font-medium">Operating Unit</span>
              <span className="font-semibold text-foreground">{header.operatingUnit === "103" ? "103 - Janatics Unit" : header.operatingUnit}</span>
            </div>
          </div>
          <div className="p-2 border rounded bg-muted/5 flex items-start gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground uppercase block tracking-tight font-medium">Target Week</span>
              <span className="font-semibold text-foreground">{header.weeks}</span>
            </div>
          </div>
          <div className="p-2 border rounded bg-muted/5 flex items-start gap-1.5">
            <User className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground uppercase block tracking-tight font-medium">Prepared By</span>
              <span className="font-semibold text-foreground">{header.preparedBy} - ANURADHA SHARMA</span>
            </div>
          </div>
        </div>

        {/* Dynamic Structural Addresses Split Panel Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/30 p-2.5 rounded border border-border/80">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary border-b pb-1 mb-1.5">Bill To Structure</h4>
            <div className="space-y-0.5">
              <div><span className="text-muted-foreground">Client:</span> <span className="font-medium text-foreground">{header.billToCustomer || 'N/A'}</span></div>
              <div><span className="text-muted-foreground">Site:</span> <span className="font-mono text-foreground">{header.billToLocation || 'N/A'}</span></div>
              <p className="text-[11px] text-muted-foreground truncate bg-background p-1 rounded border border-dashed mt-1">{header.billToAddress}</p>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-3 border-border/80">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 border-b pb-1 mb-1.5">Ship To Structure</h4>
            <div className="space-y-0.5">
              <div><span className="text-muted-foreground">Client:</span> <span className="font-medium text-foreground">{header.shipToCustomer || 'N/A'}</span></div>
              <div><span className="text-muted-foreground">Site:</span> <span className="font-mono text-foreground">{header.shipToLocation || 'N/A'}</span></div>
              <p className="text-[11px] text-muted-foreground truncate bg-background p-1 rounded border border-dashed mt-1">{header.shipToAddress}</p>
            </div>
          </div>
        </div>

        {header.remarks && (
          <div className="text-[11px] leading-relaxed text-foreground italic bg-amber-50/40 p-2 rounded border border-amber-200/30">
            <span className="text-[9px] font-bold uppercase block tracking-wider text-amber-800 not-italic">Processing Note:</span>
            "{header.remarks}"
          </div>
        )}
      </CardContent>
    </Card>
  )
}
