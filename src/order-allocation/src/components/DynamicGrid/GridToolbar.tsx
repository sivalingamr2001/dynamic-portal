import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GridApi } from "ag-grid-community";
import type { GridActionItem, BulkAction, ActionVariant } from "./types";

interface GridToolbarProps<T> {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    customActions: GridActionItem[];
    bulkActions: BulkAction<T>[];
    selectedRows: T[];
    gridApi: GridApi | null;
    onRefresh?: () => void | Promise<void>;
}

function variantToShad(v?: ActionVariant) {
    if (v === "danger")  return "destructive" as const;
    if (v === "primary") return "default"     as const;
    return "outline" as const;
}

export function GridToolbar<T>({
    searchTerm, onSearchChange,
    customActions, bulkActions,
    selectedRows, gridApi, onRefresh,
}: GridToolbarProps<T>) {
    const hasBulk = selectedRows.length > 0 && bulkActions.length > 0;
    const handleRefresh = () => onRefresh ? onRefresh() : gridApi?.refreshCells();

    return (
        <div className="p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border bg-background/50">
            <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <input type="text" value={searchTerm} onChange={onSearchChange}
                    placeholder="Search..."
                    className="w-full pl-8 pr-2 py-1 h-7 text-xs bg-background border border-input rounded-md
                               focus:outline-none focus:ring-1 focus:ring-ring text-foreground" />
            </div>

            <div className="flex items-center gap-1 flex-wrap sm:justify-end">
                {hasBulk && bulkActions.map((a, i) => (
                    <Button key={`bulk-${i}`} size="sm" variant={variantToShad(a.variant)}
                        onClick={() => a.onClick(selectedRows, gridApi)}
                        className="h-7 px-2.5 text-xs font-semibold gap-1 shadow-none rounded">
                        {a.icon && <span className="h-3 w-3 flex items-center">{a.icon}</span>}
                        {a.label} ({selectedRows.length})
                    </Button>
                ))}

                {customActions.map((a, i) => (
                    <Button key={`action-${i}`} size="sm" variant={variantToShad(a.variant)}
                        onClick={() => a.onClick(gridApi)}
                        className="h-7 px-2.5 text-xs font-semibold gap-1 shadow-none rounded">
                        {a.icon && <span className="h-3 w-3 flex items-center">{a.icon}</span>}
                        {a.label}
                    </Button>
                ))}

                <Button size="sm" variant="secondary" onClick={handleRefresh}
                    className="h-7 px-2.5 text-xs border gap-1 shadow-none rounded" title="Refresh">
                    <RefreshCw className="h-3 w-3" />
                    <span className="hidden sm:inline">Refresh</span>
                </Button>
            </div>
        </div>
    );
}