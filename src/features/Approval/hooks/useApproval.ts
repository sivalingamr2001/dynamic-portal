import { useMemo, useState } from "react"
import { usePortal } from "@/store/portal-store"
import type { AllocationItem } from "@/data/types"

export type ApprovalFilter = "all" | "pending" | "amendment" | "approved"
export type SortKey = "customer" | "binQty" | "targetDate"
export type SortDir = "asc" | "desc"

const PENDING_STATES: AllocationItem["status"][] = ["PENDING", "AMENDMENT_PENDING"]

export function useApproval() {
  const { items, counts } = usePortal()
  const [filter, setFilter] = useState<ApprovalFilter>("all")
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("targetDate")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const result = items.filter((item) => {
      if (filter === "pending" && item.status !== "PENDING") return false
      if (filter === "amendment" && item.status !== "AMENDMENT_PENDING") return false
      if (filter === "approved" && item.status !== "APPROVED") return false
      if (!query) return true
      return [item.itemCode, item.itemName, item.customer, item.region]
        .join(" ")
        .toLowerCase()
        .includes(query)
    })

    return [...result].sort((a, b) => {
      let cmp = 0
      if (sortKey === "binQty") cmp = a.binQty - b.binQty
      else if (sortKey === "customer") cmp = a.customer.localeCompare(b.customer)
      else cmp = a.targetDate.localeCompare(b.targetDate)
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [items, filter, search, sortKey, sortDir])

  const pendingCount = useMemo(
    () => items.filter((i) => PENDING_STATES.includes(i.status)).length,
    [items],
  )

  return {
    filtered,
    counts,
    filter,
    setFilter,
    search,
    setSearch,
    sortKey,
    sortDir,
    toggleSort,
    pendingCount,
  }
}
