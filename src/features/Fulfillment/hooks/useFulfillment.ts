import { useMemo, useState } from "react"
import { FULFILLMENT_LINES } from "@/data/allocations"

export type FulfillmentFilter = "all" | "Fulfilled" | "Partial" | "Open"

export function useFulfillment() {
  const [filter, setFilter] = useState<FulfillmentFilter>("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return FULFILLMENT_LINES.filter((line) => {
      if (filter !== "all" && line.status !== filter) return false
      if (!query) return true
      return [line.itemCode, line.itemName, line.customer]
        .join(" ")
        .toLowerCase()
        .includes(query)
    })
  }, [filter, search])

  const metrics = useMemo(() => {
    const approvedQty = FULFILLMENT_LINES.reduce((sum, l) => sum + l.approvedQty, 0)
    const allocated = FULFILLMENT_LINES.reduce((sum, l) => sum + l.allocated, 0)
    const unallocated = approvedQty - allocated
    return {
      lines: FULFILLMENT_LINES.length,
      approvedQty,
      allocated,
      unallocated,
      fillRate: approvedQty === 0 ? 0 : Math.round((allocated / approvedQty) * 100),
      remainingPct: approvedQty === 0 ? 0 : Math.round((unallocated / approvedQty) * 100),
      orderAcks: 15,
      fulfilled: FULFILLMENT_LINES.filter((l) => l.status === "Fulfilled").length,
      partial: FULFILLMENT_LINES.filter((l) => l.status === "Partial").length,
      open: FULFILLMENT_LINES.filter((l) => l.status === "Open").length,
    }
  }, [])

  return { filtered, filter, setFilter, search, setSearch, metrics }
}
