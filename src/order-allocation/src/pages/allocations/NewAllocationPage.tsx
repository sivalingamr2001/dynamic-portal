import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { HeaderFormStep, headerSchema } from '@/components/allocations/components/HeaderFormStep'
import { LineFormStep, lineSchema } from '@/components/allocations/components/LineFormStep'
import { WorkflowProgress } from '@/components/certifications/WorkflowProgress'
import type { AllocationHeader, AllocationLine } from '@/types'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { AllocationReviewSummary } from '@/components/allocations/components/AllocationReviewSummary'

export type HeaderFormData = z.infer<typeof headerSchema>
export type LineFormData = z.infer<typeof lineSchema>
export type LineItemWithId = LineFormData & { id: string }

export const NewAllocationPage: React.FC = () => {
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    // Step state choreography lifecycle tracking: 1 -> 2 -> 3
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [lines, setLines] = useState<LineItemWithId[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const headerForm = useForm<HeaderFormData>({
        resolver: zodResolver(headerSchema),
        defaultValues: {
            requestDate: new Date().toISOString().split('T')[0],
            allocationBasis: 'customer_specific',
            customerType: 'existing',
            region: '',
            subRegion: '',
            operatingUnit: '',
            weeks: '',
            preparedBy: '',
            remarks: '',
        },
    })

    const lineForm = useForm<LineFormData>({
        resolver: zodResolver(lineSchema),
        defaultValues: {
            warehouse: '',
            itemCode: '',
            requestedQuantity: 1,
            targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
    })

    const totalQuantity = lines.reduce((sum, line) => sum + line.requestedQuantity, 0)

    const handleNext = () => {
        if (step === 1) {
            setStep(2)
        } else if (step === 2) {
            if (lines.length === 0) {
                toast.error('Please add at least one line item before reviewing')
                return
            }
            setStep(3)
        }
    }

    const handleBack = () => {
        if (step === 2) setStep(1)
        if (step === 3) setStep(2)
    }

    const handleCreateAllocation = async () => {
        const headerValues = headerForm.getValues()
        setIsSubmitting(true)
        try {
            const headerId = `ah_${Date.now()}`
            const allocationHeader: AllocationHeader = {
                id: headerId,
                requestId: `REQ-${Date.now()}`,
                createdDate: headerValues.requestDate,
                allocationBasis: headerValues.allocationBasis || 'customer_specific',
                customerId: headerValues.billToId,
                customerName: headerValues.billToCustomer,
                billToId: headerValues.billToId,
                customerType: headerValues.customerType || 'existing',
                shipToId: headerValues.shipToId,
                territory: headerValues.region,
                remarks: headerValues.remarks,
                status: 'pending',
                totalLines: lines.length,
                totalQuantity,
                createdBy: currentUser?.name || '',
                createdByName: currentUser?.name || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            const allocationLines: AllocationLine[] = lines.map((line, idx) => ({
                id: `al_${Date.now()}_${idx}`,
                allocationHeaderId: headerId,
                lineNumber: idx + 1,
                warehouse: line.warehouse,
                itemCode: line.itemCode,
                requestedQuantity: line.requestedQuantity,
                targetDate: line.targetDate,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }))

            console.log({
                header: allocationHeader,
                lines: allocationLines,
            })

            toast.success('Allocation Created Successfully')
            navigate('/allocations/list', { state: { success: true } })
        } catch (error) {
            console.error('Failed to create allocation:', error)
            toast.error('Failed to save allocation')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full space-y-4">
            <div className="w-full">
                <WorkflowProgress
                    steps={['Allocation Details', 'Line Items Breakdown', 'Submit']}
                    currentStep={step - 1}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 items-start w-full">
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <HeaderFormStep
                                key="step-1"
                                form={headerForm}
                                onNextStep={handleNext}
                            />
                        )}
                        {step === 2 && (
                            <LineFormStep
                                key="step-2"
                                form={lineForm}
                                lines={lines}
                                setLines={setLines}
                                onBack={handleBack}
                                onNext={handleNext}
                            />
                        )}
                        {step === 3 && (
                            <motion.div
                                key="step-3"
                                initial={{ opacity: 0, x: 15 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -15 }}
                                className="space-y-4 w-full"
                            >
                                <AllocationReviewSummary
                                    headerData={headerForm.getValues()}
                                    lines={lines}
                                    onBack={handleBack}
                                    onSubmit={handleCreateAllocation}
                                    isSubmitting={isSubmitting}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
