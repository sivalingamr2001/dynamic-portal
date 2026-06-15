import { DynamicGrid, type BulkAction, type GridActionItem } from "@/components/DynamicGrid/Index";
import { Badge } from "@/components/ui/badge";
import type { ColDef, GridApi } from "ag-grid-community";
import { Download, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const mockRows = [
    {
        id: "1",
        itemCode: "PCB-001",
        itemName: "PCB Assembly Rev3",
        customer: "ABC Electronics Ltd",
        region: "Maharashtra",
        approQty: 480,
        allocated: 450,
        progress: 94,
        status: "Partial",
    },
    {
        id: "2",
        itemCode: "RES-010K",
        itemName: "Resistor 10K 1%",
        customer: "ABC Electronics Ltd",
        region: "Maharashtra",
        approQty: 10000,
        allocated: 10000,
        progress: 100,
        status: "Fulfilled",
    },
];

export const MyAllocationsPage = () => {
    const navigate = useNavigate();
    const [lastAction, setLastAction] = useState<string | null>(null);

    const handleCreate = () => navigate("/allocations/new");

    const colDefs = useMemo<ColDef<any>[]>(
        () => [
            {
                field: "itemCode",
                headerName: "Item Code",
                minWidth: 120,
                // Custom renderer turns flat data into an active navigation handle link
                cellRenderer: ({ value, data }: any) => {
                    if (!value) return null;
                    return (
                        <button
                            type="button"
                            className="text-left font-mono font-bold text-primary hover:text-primary/80 hover:underline transition-all duration-150 p-0 h-auto bg-transparent border-none cursor-pointer focus:outline-none"
                            onClick={(e) => {
                                e.stopPropagation(); // Stops ag-Grid from triggering row selection event hooks
                                navigate(`/allocations/details/${data?.id || value}`);
                            }}
                        >
                            {value}
                        </button>
                    );
                }
            },
            { field: "itemName", headerName: "Item Name", minWidth: 240, flex: 1 },
            { field: "customer", headerName: "Customer", minWidth: 180 },
            { field: "region", headerName: "Region", minWidth: 140 },
            { field: "approQty", headerName: "Appr. Qty", minWidth: 110, type: "numericColumn" },
            { field: "allocated", headerName: "Allocated", minWidth: 110, type: "numericColumn" },
            {
                field: "progress",
                headerName: "Fill Progress",
                minWidth: 200,
                cellRenderer: ({ value }: any) => (
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold">{value}%</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                                className={`h-full ${value === 100 ? "bg-emerald-500" : "bg-amber-500"}`}
                                style={{ width: `${value}%` }}
                            />
                        </div>
                    </div>
                ),
            },
            {
                field: "status",
                headerName: "Status",
                minWidth: 120,
                cellRenderer: ({ value }: any) => (
                    <Badge variant={value === "Fulfilled" ? "secondary" : "default"}>
                        {value}
                    </Badge>
                ),
            },
        ],
        [navigate] // Injected navigate dependency to guarantee fresh routing execution closures
    );

    const customActions = useMemo<GridActionItem[]>(
        () => [
            {
                label: "Add New",
                icon: <Plus className="h-3 w-3" />,
                variant: "primary",
                onClick: handleCreate,
            },
            {
                label: "Export CSV",
                icon: <Download className="h-3 w-3" />,
                variant: "secondary",
                onClick: (api: GridApi | null) => {
                    api?.exportDataAsCsv({ fileName: "allocations.csv" });
                    setLastAction("CSV export triggered");
                },
            },
        ],
        [handleCreate]
    );

    const bulkActions = useMemo<BulkAction<any>[]>(
        () => [
            {
                label: "Delete Selected",
                icon: <Trash2 className="h-3 w-3" />,
                variant: "danger",
                onClick: (rows) => setLastAction(`Delete: ${rows.map((row) => row.itemName).join(", ")}`),
            },
            {
                label: "Export Selected",
                icon: <Download className="h-3 w-3" />,
                variant: "secondary",
                onClick: (rows, api) => {
                    api?.exportDataAsCsv({ onlySelected: true, fileName: "selected_allocations.csv" });
                    setLastAction(`Exported ${rows.length} rows`);
                },
            },
        ],
        []
    );

    return (
        <div className="space-y-4 p-0 min-h-screen bg-slate-50">
            <div className="h-[calc(100vh-260px)] min-h-[55rem]">
                <DynamicGrid<any>
                    rowData={mockRows}
                    colDefs={colDefs}
                    rowSelection="multiple"
                    customActions={customActions}
                    bulkActions={bulkActions}
                    pageSize={50}
                    showPagination
                />
            </div>
        </div>
    );
};
