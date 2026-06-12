import { DynamicGrid, type GridActionItem } from "@/components/DynamicGrid/Index";
import { binApprovalColumns } from "./columns";
import { Check } from "lucide-react";

const mockApprovalData = Array.from({ length: 20 }).map((_, idx) => {
  const items = [
    { itemCode: "RES-010K", itemName: "Resistor 10K Ω 1%", customer: "ABC Electroni...", region: "Maharashtra", binQty: 10000, approvedQty: 10000, targetDate: "2026-12-10", status: "Approved" },
    { itemCode: "PCB-001", itemName: "PCB Assembly Rev3", customer: "ABC Electroni...", region: "Maharashtra", binQty: 500, approvedQty: 480, targetDate: "2026-12-15", status: "Approved" },
    { itemCode: "PWR-24V", itemName: "Power Supply 24V 5A", customer: "Delta Manufa...", region: "Tamil Nadu", binQty: 50, approvedQty: 45, targetDate: "2026-12-18", status: "Approved" },
    { itemCode: "REL-12V", itemName: "Relay 12V SPDT 10A", customer: "Omega Syste...", region: "Karnataka", binQty: 300, approvedQty: 300, targetDate: "2026-12-28", status: "Pending" },
    { itemCode: "PRS-SNS", itemName: "Pressure Sensor 0-10 Bar", customer: "ABC Electroni...", region: "Maharashtra", binQty: 60, approvedQty: 40, targetDate: "2026-01-25", status: "Amend" }
  ];
  return { ...items[idx % items.length] };
});

export const NewAllocationPage = () => {
  const batchActions: GridActionItem[] = [
    {
        label: "Approve All (8)",
        onClick: (api) => console.log("Batch processing launched.", api),
        icon: <Check className="h-3 w-3" />,
        variant: "primary"
    }
  ];

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <DynamicGrid 
        rowData={mockApprovalData}
        colDefs={binApprovalColumns}
        customActions={batchActions}
      />
    </div>
  );
};
