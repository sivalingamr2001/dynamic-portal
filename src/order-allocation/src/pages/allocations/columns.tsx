import type { ColDef } from "ag-grid-community";
import { CheckCircle2, AlertCircle } from "lucide-react";

const ItemCodeRenderer = (params: any) => (
  <span className="text-blue-600 font-medium cursor-pointer hover:underline text-xs">
    {params.value}
  </span>
);

const TargetDateRenderer = (params: any) => {
  if (!params.value) return null;
  return (
    <div className="flex items-center gap-1 text-destructive font-semibold text-[11px] bg-destructive/10 px-1.5 py-0.5 rounded border border-destructive/20 w-fit my-0.5">
      <AlertCircle className="h-3 w-3 shrink-0" />
      <span>{params.value}</span>
      <span className="text-[9px] opacity-80 font-normal tracking-wide">(OD)</span>
    </div>
  );
};

const ActionColumnRenderer = (params: any) => {
  const status = params.data?.status;
  
  if (status === "Approved") {
    return (
      <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>Approved</span>
      </div>
    );
  }

  if (status === "Amend") {
    return (
      <button className="h-5 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] tracking-wide uppercase rounded transition-colors shadow-sm">
        Approve Amend
      </button>
    );
  }

  return (
    <button className="h-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] tracking-wide uppercase rounded flex items-center justify-center gap-1 transition-colors shadow-sm">
      <CheckCircle2 className="h-2.5 w-2.5" />
      <span>Approve</span>
    </button>
  );
};

export const binApprovalColumns: ColDef[] = [
  { field: "id", headerName: "#", width: 45, flex: 0, sortable: false, filter: false, valueGetter: "node.rowIndex + 1" },
  { field: "itemCode", headerName: "Item Code", width: 100, cellRenderer: ItemCodeRenderer },
  { field: "itemName", headerName: "Item Name", width: 170 },
  { field: "customer", headerName: "Customer", width: 140 },
  { field: "region", headerName: "Region", width: 110 },
  { field: "binQty", headerName: "Bin Qty", width: 95, type: "numericColumn", valueFormatter: (p) => p.value?.toLocaleString() },
  { 
    field: "approvedQty", 
    headerName: "Approved Qty", 
    width: 115,
    type: "numericColumn",
    cellRenderer: (params: any) => {
      if (params.data?.status === "Approved") {
        return <span className="text-emerald-600 font-bold">{params.value?.toLocaleString()}</span>;
      }
      return (
        <input 
          type="number" 
          defaultValue={params.value}
          className="w-full max-w-[85px] h-5 px-1.5 text-right font-semibold text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary"
        />
      );
    }
  },
  { field: "targetDate", headerName: "Target Date", width: 135, cellRenderer: TargetDateRenderer },
  { field: "action", headerName: "Action", width: 115, flex: 0, cellRenderer: ActionColumnRenderer }
];
