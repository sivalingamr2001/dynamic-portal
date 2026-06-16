import React, { useEffect, type ChangeEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import type { EmployeeDto, OperatingUnitDto } from '@/api/allocationApi'

export const headerSchema = z.object({
    requestDate: z.string().min(1),
    region: z.string().min(1, 'Region selection is required'),
    subRegion: z.string().min(1, 'Sub-region selection is required'),
    operatingUnit: z.string().min(1, 'Operating unit is required'), 
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

interface GeographicHeaderGridProps {
    form: UseFormReturn<z.infer<typeof headerSchema>>
    availableRegions: string[]
    availableSubRegions: string[]
    operatingUnits?: OperatingUnitDto[]
}

export const GeographicHeaderGrid: React.FC<GeographicHeaderGridProps> = ({
    form,
    availableRegions = [],
    availableSubRegions = [],
    operatingUnits = [],
}) => {
    const { watch, setValue, formState: { errors } } = form

    const region = watch('region') || ""
    const subRegion = watch('subRegion') || ""
    const operatingUnit = watch('operatingUnit') || ""

    // 1. Core Flattened List Processing for Sub-Regions
    // This securely breaks apart comma-joined strings like "DELHI 1,DEL-NOIDA" into standard array items
    const parsedSubRegions = React.useMemo(() => {
        return availableSubRegions
            .flatMap((sr) => (typeof sr === 'string' && sr.includes(',') ? sr.split(',') : sr))
            .map((sr) => (typeof sr === 'string' ? sr.trim() : sr))
            .filter((sr) => sr !== "")
    }, [availableSubRegions])

    useEffect(() => {
        if (availableRegions.length === 1 && !region) {
            const defaultRegion = availableRegions[0];
            setValue('region', defaultRegion, { shouldValidate: true });
            setValue('region', defaultRegion);
        }
    }, [availableRegions, region, setValue]);

    // 2. Updated Auto-Select Hook to use clean parsed arrays
    useEffect(() => {
        if (parsedSubRegions.length === 1 && !subRegion) {
            setValue('subRegion', parsedSubRegions[0], { shouldValidate: true })
        }
    }, [parsedSubRegions, subRegion, setValue])

    useEffect(() => {
        if (operatingUnits.length === 1 && !operatingUnit) {
            setValue('operatingUnit', String(operatingUnits[0].organizationId), { shouldValidate: true })
        }
    }, [operatingUnits, operatingUnit, setValue])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-muted/30 p-2.5 rounded-lg border border-border/60">

            {/* Region Selector */}
            <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Territory Region</label>
                <select value={region} onChange={(e: ChangeEvent<HTMLSelectElement>) => setValue('region', e.target.value, { shouldValidate: true })} className="h-8 w-full rounded-md border border-input bg-input/20 px-2 py-1 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30">
                    <option value="">Select region</option>
                    {availableRegions.filter(r => r !== "").map((r) => (
                        <option key={r} value={r} className="text-xs">{r}</option>
                    ))}
                </select>
                {errors.region?.message && (
                    <p className="text-[10px] text-destructive">{String(errors.region.message)}</p>
                )}
            </div>

            {/* Sub-Region Selector (Updated to render individual row options) */}
            <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Sub-Territory</label>
                <select value={subRegion} onChange={(e: ChangeEvent<HTMLSelectElement>) => setValue('subRegion', e.target.value, { shouldValidate: true })} className="h-8 w-full rounded-md border border-input bg-input/20 px-2 py-1 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30">
                    <option value="">Select sub-region</option>
                    {parsedSubRegions.map((sr) => (
                        <option key={sr} value={sr} className="text-xs">{sr}</option>
                    ))}
                </select>
                {errors.subRegion?.message && (
                    <p className="text-[10px] text-destructive">{String(errors.subRegion.message)}</p>
                )}
            </div>

            {/* Operating Unit Selector */}
            <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Operating Unit</label>
                <select value={operatingUnit} onChange={(e: ChangeEvent<HTMLSelectElement>) => setValue('operatingUnit', e.target.value, { shouldValidate: true })} className="h-8 w-full rounded-md border border-input bg-input/20 px-2 py-1 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30">
                    <option value="">Select unit</option>
                    {operatingUnits.map((ou) => (
                        <option key={ou.organizationId} value={String(ou.organizationId)} className="text-xs">
                            {ou.name}
                        </option>
                    ))}
                </select>
                {errors.operatingUnit?.message && (
                    <p className="text-[10px] text-destructive">{String(errors.operatingUnit.message)}</p>
                )}
            </div>
        </div>
    )
}
