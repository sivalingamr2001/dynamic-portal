import { Search, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { FilterTabs, type TabOption } from "@/components/ui/filter-tabs"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/Layout/PageHeader"
import { FulfillmentMetrics } from "@/features/Fulfillment/FulfillmentMetrics"
import { FulfillmentTable } from "@/features/Fulfillment/FulfillmentTable"
import { useFulfillment, type FulfillmentFilter } from "@/features/Fulfillment/hooks/useFulfillment"
import { formatNumber, formatSignedNumber } from "@/lib/format"

export function FulfillmentPage() {
  const { filtered, filter, setFilter, search, setSearch, metrics } = useFulfillment()

  const tabs: TabOption<FulfillmentFilter>[] = [
    { value: "all", label: "All" },
    { value: "Fulfilled", label: "Fulfilled", badge: metrics.fulfilled },
    { value: "Partial", label: "Partial", badge: metrics.partial },
    { value: "Open", label: "Open", badge: metrics.open },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Truck}
        title="Fulfillment Tracker"
        description={`Track OA allocation — ${metrics.lines} line(s)`}
      />

      <FulfillmentMetrics metrics={metrics} />

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

          <FulfillmentTable lines={filtered} />

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <span>
              Fulfilled: <span className="font-semibold text-success">{metrics.fulfilled}</span>
            </span>
            <span>
              Partial: <span className="font-semibold text-warning">{metrics.partial}</span>
            </span>
            <span>
              Open: <span className="font-semibold text-foreground">{metrics.open}</span>
            </span>
            <span className="sm:ml-auto">
              Overall Fill Rate: <span className="font-semibold text-foreground">{metrics.fillRate}%</span>
            </span>
            <span>
              Unallocated:{" "}
              <span className="font-semibold text-warning">{formatSignedNumber(metrics.unallocated)}</span> units
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
