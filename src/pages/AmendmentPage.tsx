import { RefreshCw, Search, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FilterTabs, type TabOption } from "@/components/ui/filter-tabs"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/Layout/PageHeader"
import { AmendmentTable } from "@/features/Amendment/AmendmentTable"
import {
  AmendmentProcessWidget,
  ItemStatusWidget,
} from "@/features/Amendment/AmendmentWidgets"
import { useAmendment, type AmendmentFilter } from "@/features/Amendment/hooks/useAmendment"

export function AmendmentPage() {
  const {
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
  } = useAmendment()

  const tabs: TabOption<AmendmentFilter>[] = [
    { value: "all", label: "All" },
    { value: "approved", label: "Approved" },
    { value: "amend-pending", label: "Amend Pending" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={RefreshCw}
        title="Amendment / Cancellation"
        description="Select approved items to amend qty or cancel — will re-enter approval flow"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <FilterTabs options={tabs} value={filter} onChange={setFilter} />
              <div className="relative sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search item, customer..."
                  className="pl-9"
                />
              </div>
            </div>

            <p className="text-xs font-medium text-muted-foreground">Select items to amend</p>

            <AmendmentTable
              items={filtered}
              selected={selected}
              allSelected={allSelected}
              onToggle={toggle}
              onToggleAll={toggleAll}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-muted-foreground">
                {counts.approved} item(s) eligible · {selected.size} selected
              </span>
              <Button onClick={submit} disabled={selected.size === 0}>
                <Send /> Submit for Re-Approval ({selected.size})
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <AmendmentProcessWidget />
          <ItemStatusWidget approved={counts.approved} amendPending={counts.amendPending} />
        </div>
      </div>
    </div>
  )
}
