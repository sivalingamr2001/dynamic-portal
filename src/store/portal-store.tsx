import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { ALLOCATION_ITEMS } from "@/data/allocations"
import type { AllocationItem } from "@/data/types"

interface PortalContextValue {
  items: AllocationItem[]
  counts: { total: number; pending: number; amend: number; approved: number }
  approveItem: (id: string, qty: number) => void
  approveAllPending: () => void
  submitAmendments: (ids: string[]) => void
  addAllocation: (input: AddAllocationInput) => void
}

interface AllocationLinePayload {
  headerId: string
  lineId: string
  organizationId: string
  inventoryItemId: string
  itemName: string
  b3Quantity: number
  targetDate: string
  b3ApprovedQuantity: number
  approvalFlag: boolean
  approvedDate: string
  approvedBy: string
  closureFlag: boolean
}

interface AddAllocationInput {
  customer: string
  region: string
  headerId: string
  transactionDate: string
  customerOrItemSpecific: string
  customerId: string
  territoryId: string
  billToCustomer: string
  shipToCustomer: string
  createdBy: string
  createdDate: string
  updatedBy: string
  updatedDate: string
  remarks: string
  expectedUse: string
  operatingUnitId: string
  preparedBy: string
  budgetWeek: string
  lines: AllocationLinePayload[]
}

const PortalContext = createContext<PortalContextValue | null>(null)

let idCounter = 100

export function PortalProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AllocationItem[]>(ALLOCATION_ITEMS)

  const approveItem = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: "APPROVED", approvedQty: qty } : it)),
    )
  }, [])

  const approveAllPending = useCallback(() => {
    setItems((prev) =>
      prev.map((it) =>
        it.status === "PENDING" || it.status === "AMENDMENT_PENDING"
          ? { ...it, status: "APPROVED" }
          : it,
      ),
    )
  }, [])

  const submitAmendments = useCallback((ids: string[]) => {
    setItems((prev) =>
      prev.map((it) => (ids.includes(it.id) ? { ...it, status: "AMENDMENT_PENDING" } : it)),
    )
  }, [])

  const addAllocation = useCallback((allocation: AddAllocationInput) => {
    setItems((prev) => [
      ...allocation.lines.map((line) => {
        const status: AllocationItem["status"] = line.approvalFlag ? "APPROVED" : "PENDING"
        return {
          id: `new-${idCounter++}`,
          itemCode: line.inventoryItemId,
          itemName: line.itemName,
          customer: allocation.customer,
          region: allocation.region,
          binQty: line.b3Quantity,
          approvedQty: line.b3ApprovedQuantity,
          targetDate: line.targetDate,
          status,
        }
      }),
      ...prev,
    ])
  }, [])

  const counts = useMemo(
    () => ({
      total: items.length,
      pending: items.filter((i) => i.status === "PENDING").length,
      amend: items.filter((i) => i.status === "AMENDMENT_PENDING").length,
      approved: items.filter((i) => i.status === "APPROVED").length,
    }),
    [items],
  )

  const value = useMemo(
    () => ({ items, counts, approveItem, approveAllPending, submitAmendments, addAllocation }),
    [items, counts, approveItem, approveAllPending, submitAmendments, addAllocation],
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal() {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error("usePortal must be used within PortalProvider")
  return ctx
}
