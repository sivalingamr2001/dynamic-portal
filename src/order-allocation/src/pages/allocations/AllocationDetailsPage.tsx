import { AllocationDetailsHeaderCard } from '@/components/allocations/components/AllocationDetailsPage.tsx/AllocationDetailsHeaderCard'
import { AllocationDetailsSidebarSummary } from '@/components/allocations/components/AllocationDetailsPage.tsx/AllocationDetailsSidebarSummary'
import { LineDetailsWorkflowGrid } from '@/components/allocations/components/AllocationDetailsPage.tsx/LineDetailsWorkflowGrid'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'



// Component Type Definitions
export interface AllocationLineDetail {
    id: string
    lineNumber: number
    warehouse: string
    itemCode: string
    requestedQuantity: number
    approvedQuantity?: number
    cancelledQuantity?: number
    targetDate: string
    status: 'pending' | 'approve' | 'cancel' | 'hold'
    cancellationReason?: string
    updatedAt: string
}

export interface AllocationHeaderDetail {
    id: string
    requestId: string
    createdDate: string
    createdAt: string
    allocationBasis: 'customer_specific' | 'item_specific'
    customerType?: 'existing' | 'new'
    region: string
    subRegion: string
    operatingUnit: string
    weeks: string
    preparedBy: string
    billToCustomer?: string
    billToLocation?: string
    billToAddress?: string
    shipToCustomer?: string
    shipToLocation?: string
    shipToAddress?: string
    remarks?: string
    status: 'pending' | 'partially_approved' | 'approved' | 'rejected'
}

export const AllocationDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [loading, setLoading] = useState<boolean>(true)
    const [header, setHeader] = useState<AllocationHeaderDetail | null>(null)
    const [lines, setLines] = useState<AllocationLineDetail[]>([])
    const [isActionPending, setIsActionPending] = useState<boolean>(false)

    // 1. Fetch data context mock cycle (simulates API parsing delay)
    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => {
            // Hydrating mockup payloads mirroring your precise form models from previous stages
            setHeader({
                id: id || "ah_1718461800000",
                requestId: "REQ-20260615-01",
                createdDate: "2026-06-15",
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                allocationBasis: "customer_specific",
                customerType: "existing",
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
                remarks: "Added priority volume adjustments.",
                status: "pending"
            })

            setLines([
                { id: "al_1", lineNumber: 1, warehouse: "wh_02", itemCode: "200", requestedQuantity: 1, targetDate: "2026-06-22", status: "pending", updatedAt: new Date().toISOString() },
                { id: "al_2", lineNumber: 2, warehouse: "wh_02", itemCode: "205", requestedQuantity: 5, targetDate: "2026-06-22", status: "pending", updatedAt: new Date().toISOString() },
                { id: "al_3", lineNumber: 3, warehouse: "wh_10", itemCode: "310", requestedQuantity: 12, targetDate: "2026-06-25", status: "pending", updatedAt: new Date().toISOString() }
            ])
            setLoading(false)
        }, 600)

        return () => clearTimeout(timer)
    }, [id])

    // 2. Privilege Rule Validation Engine (Checks structural 24hr creation boundaries & approval gates)
    const checkIsEditable = (): boolean => {
        if (!header || header.status !== 'pending') return false
        const creationTime = new Date(header.createdAt).getTime()
        const hoursElapsed = (Date.now() - creationTime) / (1000 * 60 * 60)
        return hoursElapsed <= 24 // Enforces the strict editable rule boundary parameter limit
    }

    const isEditable = checkIsEditable()

    // 3. Line Row Status Modifier Core Handlers
    const handleUpdateLine = (lineId: string, updatedFields: Partial<AllocationLineDetail>) => {
        setLines(prev => prev.map(l => l.id === lineId ? { ...l, ...updatedFields, updatedAt: new Date().toISOString() } : l))
        toast.success('Line entry row adjustments applied to current work cache')
    }

    // 4. Global Workflow Commit Mutators
    const handleFinalizeAllocation = async () => {
        if (lines.some(l => l.status === 'pending')) {
            toast.error('All open allocation lines must be assigned a decision before final commit.')
            return
        }

        setIsActionPending(true)
        try {
            // Simulate pipeline serialization logic mapping down into underlying Dapper databases
            console.log("Committing transaction payload data package...", { header, lines })
            toast.success('Allocation transaction successfully synchronized to Oracle EBS')
            navigate('/allocations/list')
        } catch (err) {
            console.error(err)
            toast.error('Backend pipeline connection failed')
        } finally {
            setIsActionPending(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Hydrating database context logs...</span>
            </div>
        )
    }

    return (
        <div className="w-full space-y-4 p-1">
            {/* Top Controls Toolbar Navigation bar */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium pl-1" onClick={() => navigate('/allocations/list')}>
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to My Allocations
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start w-full">
                {/* Main Workspace Frame panels block */}
                <div className="lg:col-span-2 space-y-4 w-full">
                    {header && (
                        <AllocationDetailsHeaderCard
                            header={header}
                            isEditable={isEditable}
                        />
                    )}

                    <LineDetailsWorkflowGrid
                        lines={lines}
                        isEditable={isEditable}
                        onUpdateLine={handleUpdateLine}
                    />
                </div>

                {/* Dynamic Context Aggregate Side Summary Bar widget panel */}
                {header && (
                    <AllocationDetailsSidebarSummary
                        header={header}
                        lines={lines}
                        onFinalize={handleFinalizeAllocation}
                        isSubmitting={isActionPending}
                    />
                )}
            </div>
        </div>
    )
}
