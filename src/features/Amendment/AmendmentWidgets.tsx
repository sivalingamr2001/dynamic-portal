import { CheckCircle2, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const STEPS = [
  "Select approved item lines from the table",
  "Choose 'Amend Qty' or 'Cancel' for each",
  "Enter new qty and mandatory reason",
  "Submit — items re-enter Approval screen",
  "Approver reviews and confirms the change",
]

export function AmendmentProcessWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Amendment Process</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <p className="text-xs leading-relaxed text-muted-foreground">{step}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ItemStatusWidget({
  approved,
  amendPending,
}: {
  approved: number
  amendPending: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-success" />
            Approved (eligible)
          </span>
          <span className="text-sm font-bold tabular-nums">{approved}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="size-4 text-accent-foreground" />
            Amend Pending
          </span>
          <span className="text-sm font-bold tabular-nums">{amendPending}</span>
        </div>
      </CardContent>
    </Card>
  )
}
