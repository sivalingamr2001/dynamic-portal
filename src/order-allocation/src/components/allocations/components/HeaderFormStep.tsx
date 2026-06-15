import React, { useEffect, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'

import { getPreparedByEmployeesApi, getWeeksDropdownApi, getOperatingUnitsApi } from '@/api/allocationApi'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AllocationFormFooter } from './HeaderForm/AllocationFormFooter'
import { BillToDetailsPanel } from './HeaderForm/BillToDetailsPanel'
import { GeographicHeaderGrid } from './HeaderForm/GeographicHeaderGrid'
import { ShipToDetailsPanel } from './HeaderForm/ShipToDetailsPanel'
import type { EmployeeDto, OperatingUnitDto } from '@/api/allocationApi'

// Enforced type checking constraints across the schema layer
export const headerSchema = z.object({
  requestDate: z.string().min(1),
  region: z.string().min(1, 'Region selection is required'),
  subRegion: z.string().min(1, 'Sub-region selection is required'),
  operatingUnit: z.string().min(1, 'Operating unit is required'), // Synced missing state field entry
  weeks: z.string().min(1, 'Week profile selection is required'),
  preparedBy: z.string().min(1, 'Preparer tracking profile is required'),
  customerType: z.enum(['existing', 'new']),
  billToId: z.string().optional(),
  billToCustomer: z.string().optional(),
  billToLocation: z.string().optional(),
  billToAddress: z.string().optional(),
  shipToId: z.string().optional(),
  shipToCustomer: z.string().optional(),
  shipToLocation: z.string().optional(),
  shipToAddress: z.string().optional(),
  remarks: z.string().optional(),
})

interface HeaderFormStepProps {
  form: UseFormReturn<z.infer<typeof headerSchema>>
  onNextStep: () => void
}

export const HeaderFormStep: React.FC<HeaderFormStepProps> = ({ form, onNextStep }) => {
  const { currentUser } = useAuth()
  const { watch, setValue } = form

  const currentRequestDate = watch('requestDate')
  const selectedRegion = watch('region')
  const selectedSubRegion = watch('subRegion')

  const [availableRegions, setAvailableRegions] = useState<string[]>([])
  const [availableSubRegions, setAvailableSubRegions] = useState<string[]>([])
  const [weekOptions, setWeekOptions] = useState<string[]>([])
  const [preparedByOptions, setPreparedByOptions] = useState<EmployeeDto[]>([])
  const [operatingOptions, setOperatingOptions] = useState<OperatingUnitDto[]>([]) // Fixed explicit assignment baseline

  useEffect(() => {
    if (!currentUser) return

    const regions = [currentUser.region]
    const subRegions = currentUser.subRegion
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)

    setAvailableRegions(regions)
    setAvailableSubRegions(subRegions)

    if (regions.length === 1) {
      setValue('region', regions[0], { shouldValidate: true })
    }

    if (subRegions.length === 1) {
      setValue('subRegion', subRegions[0], { shouldValidate: true })
    }
  }, [currentUser, setValue])

  useEffect(() => {
    if (!selectedRegion) {
      setWeekOptions([])
      setPreparedByOptions([])
      return
    }

    let mounted = true

    getWeeksDropdownApi()
      .then((data) => {
        if (mounted) setWeekOptions(data)
      })
      .catch((error) => {
        console.error('Failed to load week options:', error)
        if (mounted) setWeekOptions([])
      })

    getOperatingUnitsApi()
      .then((data) => {
        if (mounted) setOperatingOptions(data || [])
      })
      .catch((error) => {
        console.error('Failed to load operating unit options:', error)
        if (mounted) setOperatingOptions([])
      })

    getPreparedByEmployeesApi(selectedRegion)
      .then((data) => {
        if (mounted) setPreparedByOptions(data)
      })
      .catch((error) => {
        console.error('Failed to load preparer options:', error)
        if (mounted) setPreparedByOptions([])
      })

    return () => {
      mounted = false
    }
  }, [selectedRegion])

  const hasSelectedGeo = !!selectedRegion && !!selectedSubRegion

  return (
    <motion.form
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      onSubmit={form.handleSubmit(onNextStep)}
      className="w-full"
    >
      <Card className="shadow-sm border-border w-full">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-semibold text-foreground tracking-tight">
            Allocation Details
          </CardTitle>
          <div className="text-[11px] font-medium bg-muted px-2 py-0.5 rounded text-muted-foreground border border-border">
            Date: <span className="text-foreground font-mono">{currentRequestDate}</span>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2 space-y-4">
          <GeographicHeaderGrid
            form={form}
            availableRegions={availableRegions}
            availableSubRegions={availableSubRegions}
            operatingUnits={operatingOptions}
            availableWeeks={weekOptions}
            preparedByOptions={preparedByOptions}
          />

          <AnimatePresence initial={false}>
            {hasSelectedGeo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-dashed border-border">
                  <BillToDetailsPanel
                    form={form}
                    region={selectedRegion}
                    subRegion={selectedSubRegion}
                  />

                  <ShipToDetailsPanel
                    form={form}
                    region={selectedRegion}
                    subRegion={selectedSubRegion}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AllocationFormFooter form={form} />
        </CardContent>
      </Card>
    </motion.form>
  )
}
