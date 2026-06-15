import React, { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { EmployeeDto, OperatingUnitDto } from '@/api/allocationApi'
import type { headerSchema } from '../HeaderFormStep'

interface GeographicHeaderGridProps {
    form: UseFormReturn<z.infer<typeof headerSchema>>
    availableRegions: string[]
    availableSubRegions: string[]
    operatingUnits?: OperatingUnitDto[]
    availableWeeks?: string[]
    preparedByOptions?: EmployeeDto[]
}

export const GeographicHeaderGrid: React.FC<GeographicHeaderGridProps> = ({
    form,
    availableRegions = [],
    availableSubRegions = [],
    operatingUnits = [],
    availableWeeks = [],
    preparedByOptions = []
}) => {
    const { watch, setValue, formState: { errors } } = form

    // Fallbacks shield Radix internals from crashing if values evaluate to undefined
    const region = watch('region') || ""
    const subRegion = watch('subRegion') || ""
    const customerType = watch('customerType') || "existing" // Matches the default field
    const operatingUnit = watch('operatingUnit') || ""
    const weeks = watch('weeks') || ""
    const preparedBy = watch('preparedBy') || ""

    React.useEffect(() => {
        // If there is exactly one available region and it hasn't been set in the form yet
        if (availableRegions.length === 1 && !region) {
            const defaultRegion = availableRegions[0];
            setValue('region', defaultRegion, { shouldValidate: true });

            // Synchronize legacy fields instantly if required by your parent container config
            setValue('region', defaultRegion);
        }
    }, [availableRegions, region, setValue]);

    useEffect(() => {
        // Extract valid non-empty items to guarantee an accurate length count
        const activeSubRegions = availableSubRegions.filter(sr => sr !== "")

        if (activeSubRegions.length === 1 && !subRegion) {
            setValue('subRegion', activeSubRegions[0], { shouldValidate: true })
        }
    }, [availableSubRegions, subRegion, setValue])

    useEffect(() => {
        if (operatingUnits.length === 1 && !operatingUnit) {
            setValue('operatingUnit', String(operatingUnits[0].organizationId), { shouldValidate: true })
        }
    }, [operatingUnits, operatingUnit, setValue])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-muted/30 p-2.5 rounded-lg border border-border/60">

            {/* 1. Region Selector */}
            <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Territory Region</Label>
                <Select value={region} onValueChange={(val) => setValue('region', val, { shouldValidate: true })}>
                    <SelectTrigger className="h-8 text-xs bg-background">
                        <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableRegions.filter(r => r !== "").map((r) => (
                            <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.region?.message && (
                    <p className="text-[10px] text-destructive">{String(errors.region.message)}</p>
                )}
            </div>

            {/* 2. Sub-Region Selector */}
            <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Sub-Territory</Label>
                <Select value={subRegion} onValueChange={(val) => setValue('subRegion', val, { shouldValidate: true })}>
                    <SelectTrigger className="h-8 text-xs bg-background">
                        <SelectValue placeholder="Select sub-region" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableSubRegions.filter(sr => sr !== "").map((sr) => (
                            <SelectItem key={sr} value={sr} className="text-xs">{sr}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.subRegion?.message && (
                    <p className="text-[10px] text-destructive">{String(errors.subRegion.message)}</p>
                )}
            </div>

            {/* 3. FIXED: Customer Classification Mode Toggle (New vs Existing) */}
            <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Customer Category</Label>
                <Select
                    value={customerType}
                    onValueChange={(val: 'existing' | 'new') => {
                        setValue('customerType', val, { shouldValidate: true })

                        // Clean up address parameters instantly on toggle shift
                        setValue('billToId', '')
                        setValue('billToCustomer', '')
                        setValue('billToLocation', '')
                        setValue('billToAddress', '')
                        setValue('shipToId', '')
                        setValue('shipToCustomer', '')
                        setValue('shipToLocation', '')
                        setValue('shipToAddress', '')
                    }}
                >
                    <SelectTrigger className="h-8 text-xs bg-background">
                        <SelectValue placeholder="Select account category" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* FIX: Ensure values are lowercase tokens matching your Zod enum */}
                        <SelectItem value="existing" className="text-xs">Existing Account (Search EBS)</SelectItem>
                        <SelectItem value="new" className="text-xs">New Account (Manual Typ-In)</SelectItem>
                    </SelectContent>
                </Select>
                {errors.customerType?.message && (
                    <p className="text-[10px] text-destructive">{String(errors.customerType.message)}</p>
                )}
            </div>


            {/* 4. Operating Unit Selector */}
            <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Operating Unit</Label>
                <Select value={operatingUnit} onValueChange={(val) => setValue('operatingUnit', val, { shouldValidate: true })}>
                    <SelectTrigger className="h-8 text-xs bg-background">
                        <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {operatingUnits.map((ou) => (
                            <SelectItem key={ou.organizationId} value={String(ou.organizationId)} className="text-xs">
                                {ou.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.operatingUnit?.message && (
                    <p className="text-[10px] text-destructive">{String(errors.operatingUnit.message)}</p>
                )}
            </div>

            {/* 5. Weeks Selector */}
            <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Target Week</Label>
                <Select value={weeks} onValueChange={(val) => setValue('weeks', val, { shouldValidate: true })}>
                    <SelectTrigger className="h-8 text-xs bg-background">
                        <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableWeeks.filter(w => w !== "").map((w) => (
                            <SelectItem key={w} value={w} className="text-xs">{w}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.weeks?.message && (
                    <p className="text-[10px] text-destructive">{String(errors.weeks.message)}</p>
                )}
            </div>

            {/* 6. Prepared By Selector */}
            <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Prepared By</Label>
                <Select value={preparedBy} onValueChange={(val) => setValue('preparedBy', val, { shouldValidate: true })}>
                    <SelectTrigger className="h-8 text-xs bg-background">
                        <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                        {preparedByOptions.map((emp) => (
                            <SelectItem key={emp.employeeNumber} value={String(emp.employeeNumber)} className="text-xs">{emp.lastName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.preparedBy?.message && (
                    <p className="text-[10px] text-destructive">{String(errors.preparedBy.message)}</p>
                )}
            </div>

        </div>
    )
}
