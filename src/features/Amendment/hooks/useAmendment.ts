import { useMemo, useState } from "react"
import { usePortal } from "@/store/portal-store"

export type AmendmentFilter = "all" | "approved" | "amend-pending"

export function useAmendment() {
  const { items, submitAmendments } = usePortal()
  const [filter, setFilter] = useState<AmendmentFilter>("approved")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const eligible = useMemo(
    () => items.filter((i) => i.status === "APPROVED" || i.status === "AMENDMENT_PENDING"),
    [items],
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return eligible.filter((item) => {
      if (filter === "approved" && item.status !== "APPROVED") return false
      if (filter === "amend-pending" && item.status !== "AMENDMENT_PENDING") return false
      if (!query) return true
      return [item.itemCode, item.itemName, item.customer]
        .join(" ")
        .toLowerCase()
        .includes(query)
    })
  }, [eligible, filter, search])

  const selectableIds = useMemo(
    () => filtered.filter((i) => i.status === "APPROVED").map((i) => i.id),
    [filtered],
  )

  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selected.has(id))

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggleAll = () =>
    setSelected((prev) => {
      if (selectableIds.every((id) => prev.has(id))) return new Set()
      return new Set(selectableIds)
    })

  const submit = () => {
    if (selected.size === 0) return
    submitAmendments([...selected])
    setSelected(new Set())
  }

  const counts = useMemo(
    () => ({
      approved: eligible.filter((i) => i.status === "APPROVED").length,
      amendPending: eligible.filter((i) => i.status === "AMENDMENT_PENDING").length,
    }),
    [eligible],
  )

  return {
    filtered,
    filter,
    setFilter,
    search,
    setSearch,
    selected,
    toggle,
    toggleAll,
    allSelected,
    submit,
    counts,
  }
}
