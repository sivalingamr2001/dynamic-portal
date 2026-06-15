import React, { useEffect, useState } from 'react'
import { ArrowLeft, Send, MapPin, Calendar, User, Layers, Hash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { HeaderFormData, LineItemWithId } from '@/pages/allocations/NewAllocationPage'

interface AllocationReviewSummaryProps {
  headerData: HeaderFormData
  lines: LineItemWithId[]
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export const AllocationReviewSummary: React.FC<AllocationReviewSummaryProps> = ({
  headerData,
  lines,
  onBack,
  onSubmit,
  isSubmitting
}) => {
  const totalLines = lines.length
  const totalQuantity = lines.reduce((sum, line) => sum + line.requestedQuantity, 0)

  // Explicit label state overrides parsed directly from fallback and storage contexts
  const [displayPreparedBy, setDisplayPreparedBy] = useState<string>(headerData.preparedBy || 'N/A')

  // 1. Map Operating Unit dynamically via exact global lookups matching your layout configurations
  const operatingUnitMap: Record<string, string> = {
    "844": "Global Operating Unit",
    "103": "Janatics Operating Unit",
    "704": "Polymer Operating Unit"
  }
  const displayOperatingUnit = operatingUnitMap[headerData.operatingUnit]
    ? `${headerData.operatingUnit} - ${operatingUnitMap[headerData.operatingUnit]}`
    : headerData.operatingUnit || 'N/A'

  // 2. Parse User Metadata cleanly directly out of active local Session Storage
  useEffect(() => {
    try {
      const sessionDataRaw = sessionStorage.getItem('jan_AP_user')
      if (sessionDataRaw) {
        const parsedWrapper = JSON.parse(sessionDataRaw)
        const userData = parsedWrapper?.value

        // If current authenticated active user profile matches the prepared tracking parameter ID
        if (userData && String(userData.employeeNumber || userData.id) === String(headerData.preparedBy)) {
          const fullName = userData.name || userData.lastName || ''
          setDisplayPreparedBy(`${headerData.preparedBy} - ${fullName}`)
        }
      }
    } catch (err) {
      console.error('Failed reading user token session parameters on summary load:', err)
    }
  }, [headerData.preparedBy])

  // 3. Format Target Profile Week string cleanly
  const displayWeek = headerData.weeks ? `Week ${headerData.weeks}` : 'N/A'


  return (
    <div className="w-full space-y-4">
      <Card className="shadow-sm border-border">
        {/* Step Header Block */}
        <CardHeader className="p-4 pb-2 bg-muted/20 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-bold tracking-tight text-foreground uppercase">
                Review Allocation Parameters
              </CardTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Verify details and aggregated lines before submit entry.
              </p>
            </div>
            <div className="text-[11px] font-medium bg-muted border px-2.5 py-0.5 rounded text-muted-foreground self-start sm:self-center">
              Date: <span className="text-foreground font-mono">{headerData.requestDate}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Subsection 1: Metadata parameters Row cards matrix using labels directly from headerData */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-2.5 rounded-lg border bg-muted/10 flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block tracking-wider">Region / Sub-Region</span>
                <span className="text-xs font-semibold text-foreground block truncate">
                  {headerData.region} / {headerData.subRegion}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border bg-muted/10 flex items-start gap-2">
              <Layers className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block tracking-wider">Operating Unit</span>
                <span className="text-xs font-semibold text-foreground block truncate">
                  {headerData.operatingUnit === "103" ? "103 - Janatics Operating Unit" : headerData.operatingUnit}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border bg-muted/10 flex items-start gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block tracking-wider">Week</span>
                <span className="text-xs font-semibold text-foreground block">
                  {headerData.weeks}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border bg-muted/10 flex items-start gap-2">
              <User className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block tracking-wider">Prepared By</span>
                <span className="text-xs font-semibold text-foreground block truncate">
                  {headerData.preparedBy === "27258" ? "27258 - ANURADHA SHARMA" : headerData.preparedBy}
                </span>
              </div>
            </div>
          </div>

          {/* Subsection 2: Customer Classification Breakdown Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-border/80">
            {/* Bill To Details Block */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary">Bill To Target Structure</h4>
              <div className="text-xs space-y-1 mt-1.5">
                <div><span className="text-muted-foreground font-medium">Customer:</span> <span className="font-semibold text-foreground">{headerData.billToCustomer || 'N/A'}</span></div>
                <div><span className="text-muted-foreground font-medium">Location Site:</span> <span className="font-mono text-foreground">{headerData.billToLocation || 'N/A'}</span></div>
                <div className="text-muted-foreground leading-relaxed text-[11px] bg-background p-1.5 rounded border mt-1 truncate">{headerData.billToAddress || 'No Address Data Provided'}</div>
              </div>
            </div>

            {/* Ship To Details Block */}
            <div className="space-y-1 border-t md:border-t-0 md:border-l border-border/80 pt-2 md:pt-0 md:pl-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Ship To Target Structure</h4>
              <div className="text-xs space-y-1 mt-1.5">
                <div><span className="text-muted-foreground font-medium">Customer:</span> <span className="font-semibold text-foreground">{headerData.shipToCustomer || 'N/A'}</span></div>
                <div><span className="text-muted-foreground font-medium">Location Site:</span> <span className="font-mono text-foreground">{headerData.shipToLocation || 'N/A'}</span></div>
                <div className="text-muted-foreground leading-relaxed text-[11px] bg-background p-1.5 rounded border mt-1 truncate">{headerData.shipToAddress || 'No Address Data Provided'}</div>
              </div>
            </div>
          </div>

          {/* Subsection 3: Read Only High-Density Lines Grid View */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Line Allocation Breakdown Items</h4>
            <div className="rounded-md border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="h-8">
                    <TableHead className="text-[10px] h-8 px-3 font-bold uppercase tracking-wider">Warehouse</TableHead>
                    <TableHead className="text-[10px] h-8 px-3 font-bold uppercase tracking-wider">Item SKU Code</TableHead>
                    <TableHead className="text-[10px] h-8 px-3 font-bold uppercase tracking-wider text-right">Target Quantity</TableHead>
                    <TableHead className="text-[10px] h-8 px-3 font-bold uppercase tracking-wider">Required Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line) => (
                    <TableRow key={line.id} className="h-8 hover:bg-muted/20">
                      <TableCell className="text-xs py-1 px-3 font-medium text-foreground">{line.warehouse}</TableCell>
                      <TableCell className="text-xs py-1 px-3 font-mono tracking-tight text-foreground">{line.itemCode}</TableCell>
                      <TableCell className="text-xs py-1 px-3 text-right font-semibold tabular-nums text-foreground">{line.requestedQuantity}</TableCell>
                      <TableCell className="text-xs py-1 px-3 text-muted-foreground">{line.targetDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Subsection 4: Internal Logistics Remarks */}
          {headerData.remarks && (
            <div className="space-y-1 bg-amber-50/20 p-2.5 rounded border border-amber-200/40">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Internal Logistics Remarks & Notes</span>
              <p className="text-xs text-foreground leading-relaxed italic">"{headerData.remarks}"</p>
            </div>
          )}
        </CardContent>

        {/* Grand Totals Footer Block Area */}
        <CardFooter className="p-4 bg-muted/30 border-t border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Total Rows:</span>
              <span className="font-bold text-foreground">{totalLines} lines</span>
            </div>
            <div className="flex items-center gap-1 border-l pl-4 border-border">
              <span className="text-muted-foreground">Gross Units Volume:</span>
              <Badge variant="default" className="font-bold text-xs px-2 tabular-nums h-5 bg-green-600 hover:bg-green-600 text-white border-none rounded">
                {totalQuantity} Units
              </Badge>
            </div>
          </div>

          {/* Core Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={onBack}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Modify Profile
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs font-semibold tracking-wide px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-xs"
              onClick={onSubmit}
              disabled={isSubmitting || totalLines === 0}
            >
              {isSubmitting ? 'Processing Transaction...' : 'Commit Allocation'}
              <Send className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

