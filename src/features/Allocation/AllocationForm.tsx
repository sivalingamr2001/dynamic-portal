import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BillToDetailsPanel } from "./BillToDetailsPanel"
import { GeographicHeaderGrid } from "./GeographicHeaderGrid"
import type { useAllocationForm } from "./hooks/useAllocationForm"
import { ItemLinesTable } from "./ItemLinesTable"
import { ShipToDetailsPanel } from "./ShipToDetailsPanel"
import { Building2, Globe, ChevronDown } from "lucide-react"

type FormState = ReturnType<typeof useAllocationForm>

const TYPES = [
  { value: "customer", label: "Select Customer", hint: "Allocate to specific customer", icon: Building2 },
  { value: "open-pool", label: "Open Pool", hint: "Allocate to open pool portfolio", icon: Globe },
] as const

export function AllocationForm({ form }: { form: FormState }) {
  const {
    form: hookForm,
    lines,
    totalQty,
    addRow,
    removeRow,
    updateLine,
    submit,
    canSubmit,
    availableRegions,
    availableSubRegions,
    operatingUnits,
    itemOperatingUnits,
  } = form

  const { register, watch, setValue } = hookForm

  const allocationMode = watch("allocationMode")
  const selectedRegion = watch("region")
  const selectedSubRegion = watch("subRegion")
  const hasSelectedGeo = Boolean(selectedRegion && selectedSubRegion)

  const collapsedSummary = [
    allocationMode === "open-pool" ? "Open Pool" : "Customer Specific",
    selectedRegion ? `Region: ${selectedRegion}` : null,
    selectedSubRegion ? `Sub: ${selectedSubRegion}` : null,
  ].filter(Boolean).join(" | ")

  return (
    <form onSubmit={submit} className="w-full space-y-5">
      <Card className="w-full border-border bg-card shadow-sm">
        <CardContent className="p-5">

          {/* HTML5 Native Collapsible Configuration Panel */}
          <details className="group w-full" open>
            <summary className="flex w-full cursor-pointer list-none items-center justify-between outline-none select-none">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Allocation Type
                </h3>
                <span className="text-xs font-medium text-muted-foreground/70 transition-all duration-200 group-open:invisible group-open:opacity-0">
                  ({collapsedSummary || "No parameters configured"})
                </span>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted">
                <ChevronDown className="h-4 w-4 ease-in-out transition-transform duration-200 group-open:rotate-180" />
              </div>
            </summary>

            {/* Panel Segment Wrapper */}
            <div className="mt-4 flex flex-col gap-5 border-t border-border/60 pt-4">

              {/* Layout Switch Toggle Handles */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TYPES.map(({ value, label, icon: Icon }) => {
                  const isActive = allocationMode === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue("allocationMode", value)}
                      className={cn(
                        "flex items-center justify-center gap-2.5 rounded-lg border py-2.5 px-4 text-sm font-medium transition-all duration-150",
                        isActive
                          ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20"
                          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 compact-icon shrink-0" />
                      {label}
                    </button>
                  )
                })}
              </div>

              {/* Geographic Dropdowns Module */}
              {allocationMode !== "open-pool" && (
                <div className="space-y-4">
                  <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Customer Details
                  </div>
                  <GeographicHeaderGrid
                    form={hookForm}
                    availableRegions={availableRegions}
                    availableSubRegions={availableSubRegions}
                    operatingUnits={operatingUnits}
                  />
                </div>
              )}

              {/* Customer Logistics Split Panels */}
              {hasSelectedGeo && allocationMode !== "open-pool" && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <BillToDetailsPanel
                    form={hookForm}
                    region={selectedRegion}
                    subRegion={selectedSubRegion}
                  />
                  <ShipToDetailsPanel
                    form={hookForm}
                    region={selectedRegion}
                    subRegion={selectedSubRegion}
                  />
                </div>
              )}

              {/* Comments & Notes Execution Box */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Remarks
                </label>
                <textarea
                  {...register("remarks")}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground/60 outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                  placeholder="Add remarks for this allocation"
                />
              </div>

            </div>
          </details>

        </CardContent>
      </Card>

      <ItemLinesTable
        lines={lines}
        totalQty={totalQty}
        itemOperatingUnits={itemOperatingUnits}
        onAddRow={addRow}
        onRemoveRow={removeRow}
        onUpdate={updateLine}
      />

      <div className="flex w-full justify-end">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-5 text-xs font-bold tracking-wide text-primary-foreground shadow transition-all hover:bg-primary/95 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-45"
        >
          Submit
        </button>
      </div>
    </form>
  )
}
