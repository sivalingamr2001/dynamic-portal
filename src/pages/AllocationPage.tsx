import { PageHeader } from "@/Layout/PageHeader"
import { Button } from "@/components/ui/button"
import { AllocationForm } from "@/features/Allocation/AllocationForm"
import { useAllocationForm } from "@/features/Allocation/hooks/useAllocationForm"
import { ClipboardList, Send } from "lucide-react"

export function AllocationPage() {
  const form = useAllocationForm()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={ClipboardList}
        title="New BIN Allocation"
        description="Forecast commitment — allocate stock by customer or open pool"
        action={
          <Button onClick={form.submit} disabled={!form.canSubmit}>
            <Send /> Submit for Approval
          </Button>
        }
      />

      <div className="w-full">
        <AllocationForm form={form} />
      </div>
    </div>
  )
}
