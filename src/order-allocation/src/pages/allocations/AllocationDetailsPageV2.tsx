import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'


import type { AllocationHeaderDetail, AllocationLineDetail } from '@/pages/allocations/AllocationDetailsPage'
import { AllocationHorizontalReviewProfile } from '../../components/allocations/components/AllocationDetailsPageV2/AllocationHorizontalReviewProfile'
import { TabbedBreakdownControl } from '../../components/allocations/components/AllocationDetailsPageV2/TabbedBreakdownControl'
import { AllocationStatusBarBanner } from '../../components/allocations/components/AllocationDetailsPageV2/AllocationStatusBarBanner'

export const AllocationDetailsPageV2: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [header, setHeader] = useState<AllocationHeaderDetail | null>(null)
  const [lines, setLines] = useState<AllocationLineDetail[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setHeader({
        id: id || "ah_103",
        requestId: "REQ-20260615-01",
        createdDate: "2026-06-15",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        allocationBasis: "customer_specific",
        region: "DEL-NCR",
        subRegion: "DEL-NOIDA",
        operatingUnit: "103",
        weeks: "202626",
        preparedBy: "27258",
        billToCustomer: "DEEP EXPLO SOLUTIONS",
        billToLocation: "ALIGARH",
        billToAddress: "ALIGARH, 19/506 EA, R.K. PURAM, AGRA ROAD, ALIGARH, 202001",
        shipToCustomer: "GOVT. ITI BHAVNAGAR",
        shipToLocation: "BHAVNAGAR",
        shipToAddress: "BHAVNAGAR, BEHIND SIR BHAVSINHJI POLYTECHNIC, BHAVNAGAR, 364002",
        remarks: "Priority volume allocation for Next week processing cycles.",
        status: "pending"
      })

      setLines([
        { id: "al_1", lineNumber: 1, warehouse: "wh_02", itemCode: "200", requestedQuantity: 1, targetDate: "2026-06-22", status: "pending", updatedAt: new Date().toISOString() },
        { id: "al_2", lineNumber: 2, warehouse: "wh_02", itemCode: "205", requestedQuantity: 5, targetDate: "2026-06-22", status: "pending", updatedAt: new Date().toISOString() }
      ])
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [id])

  const isEditable = header ? ((Date.now() - new Date(header.createdAt).getTime()) / 3600000 <= 24 && header.status === 'pending') : false

  const handleUpdateLine = (lineId: string, fields: Partial<AllocationLineDetail>) => {
    setLines(prev => prev.map(l => l.id === lineId ? { ...l, ...fields, updatedAt: new Date().toISOString() } : l))
  }

  const handleCommitData = async () => {
    if (lines.some(l => l.status === 'pending')) {
      toast.error('Cannot commit allocation with unresolved pending row lines.')
      return
    }
    setIsSubmitting(true)
    try {
      toast.success('Decisions successfully synced to core data ledgers.')
      navigate('/allocations/list')
    } catch {
      toast.error('Database syncing timeout exception occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !header) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-1.5">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground font-medium">Assembling workspace matrix...</span>
      </div>
    )
  }

  return (
    <div className="w-full space-y-3.5 max-w-7xl mx-auto p-1">
      {/* Visual Indicator Status Ribbon */}
      <AllocationStatusBarBanner header={header} isEditable={isEditable} />

      {/* Top Controller Navigation Deck */}
      <div className="flex items-center justify-between bg-card p-2 rounded-lg border border-border shadow-xs">
        <Button variant="ghost" size="sm" className="h-7 text-xs font-medium" onClick={() => navigate('/allocations/list')}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Request Queue
        </Button>

        <div className="flex items-center gap-2">
          <div className="text-[11px] font-medium text-muted-foreground mr-2 tabular-nums">
            Total Items Count: <span className="font-bold text-foreground bg-muted px-1.5 py-0.5 rounded border">{lines.length} Rows</span>
          </div>
          <Button size="sm" className="h-7 text-xs font-semibold px-3" onClick={handleCommitData} disabled={isSubmitting || lines.some(l => l.status === 'pending')}>
            <Save className="w-3.5 h-3.5 mr-1.5" /> Commit Ledger Actions
          </Button>
        </div>
      </div>

      {/* Parameter Profile Ribbon Card */}
      <AllocationHorizontalReviewProfile header={header} />

      {/* Full Width Workspace Tab Module */}
      <TabbedBreakdownControl header={header} lines={lines} isEditable={isEditable} onUpdateLine={handleUpdateLine} />
    </div>
  )
}
