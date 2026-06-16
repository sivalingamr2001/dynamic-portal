import { CheckCheck, CheckCircle2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FilterTabs, type TabOption } from "@/components/ui/filter-tabs"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/Layout/PageHeader"
import { usePortal } from "@/store/portal-store"
import { ApprovalTable } from "@/features/Approval/ApprovalTable"
import { useApproval, type ApprovalFilter } from "@/features/Approval/hooks/useApproval"
import { StatsBar } from "@/Layout/StatsBar"

export function ApprovalPage() {
  const { approveAllPending } = usePortal()
  const { filtered, counts, filter, setFilter, search, setSearch, sortKey, sortDir, toggleSort, pendingCount } =
    useApproval()

  const tabs: TabOption<ApprovalFilter>[] = [
    { value: "all", label: "All", badge: counts.total },
    { value: "pending", label: "Pending", badge: counts.pending },
    { value: "amendment", label: "Amendment", badge: counts.amend },
    { value: "approved", label: "Approved", badge: counts.approved },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={CheckCircle2}
        title="BIN Approval"
        description="Approve item quantities — locked once approved"
        action={
          <Button variant="success" onClick={approveAllPending} disabled={pendingCount === 0}>
            <CheckCheck /> Approve All ({pendingCount})
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FilterTabs options={tabs} value={filter} onChange={setFilter} />
            <div className="relative sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Item, customer, region..."
                className="pl-9"
              />
            </div>
          </div>

          <ApprovalTable items={filtered} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />

          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {counts.total} item(s)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
