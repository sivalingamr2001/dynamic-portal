import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { themeBalham, type ColDef, type GridApi } from "ag-grid-community";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface GridActionItem {
    label: string;
    onClick: (api: GridApi | null) => void | Promise<void>;
    icon?: React.ReactNode;
    variant?: "primary" | "secondary" | "danger";
}

interface DynamicGridProps {
    rowData: any[];
    colDefs: ColDef[];
    title?: string;
    description?: string;
    customActions?: GridActionItem[];
    onRefresh?: () => void | Promise<void>;
}

export const DynamicGrid: React.FC<DynamicGridProps> = ({
    rowData,
    colDefs,
    customActions = [],
    onRefresh,
}) => {
    const gridApiRef = useRef<GridApi | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const defaultColDef = useMemo<ColDef>(() => ({
        flex: 1,
        minWidth: 90,
        sortable: true,
        filter: true,
        resizable: true,
    }), []);

    /**
     * V33 COMPLIANT PROGRAMMATIC THEMING
     * All variable names are updated to match the v33 theme schema.
     */
    const customGridTheme = useMemo(() => {
        return themeBalham.withParams({
            spacing: 3,                         // Enforces tight layout padding
            rowHeight: 34,                      // Razor thin rows matching blueprint
            headerHeight: 26,                   // Matches row structure height profile
            fontSize: 12,                       // Legible micro typography
            fontFamily: "var(--font-sans)",
            borderColor: "var(--border)",       // Automatically scales with light/dark variables
            headerBackgroundColor: "var(--muted)",
            backgroundColor: "var(--card)"
        });
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        gridApiRef.current?.setGridOption("quickFilterText", value);
    };

    return (
        <div className="w-full h-full flex flex-col min-h-0 bg-card rounded-lg overflow-hidden border border-border">

            {/* Hyper-compact Toolbar Layout Layer */}
            <div className="p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border bg-background/50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            className="w-full pl-8 pr-2 py-1 h-7 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                        />
                    </div>
                </div>

                {/* Actions Deck Panel */}
                <div className="flex items-center gap-1 sm:justify-end">
                    {customActions.map((action, idx) => (
                        <Button
                            key={`${action.label}-${idx}`}
                            size="sm"
                            variant={action.variant === "danger" ? "destructive" : action.variant === "primary" ? "default" : "outline"}
                            onClick={() => action.onClick(gridApiRef.current)}
                            className="h-7 px-2.5 text-xs font-semibold gap-1 shadow-none rounded"
                        >
                            {action.icon && <span className="h-3 w-3 flex items-center justify-center">{action.icon}</span>}
                            {action.label}
                        </Button>
                    ))}

                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onRefresh ? onRefresh() : gridApiRef.current?.refreshCells()}
                        className="h-7 px-2.5 text-xs border gap-1 shadow-none rounded"
                        title="Refresh"
                    >
                        <RefreshCw className="h-3 w-3" />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>
                </div>
            </div>

            {/* Grid Container Block */}
            <div className="flex-1 w-full min-h-0">
                <AgGridReact
                    theme={customGridTheme}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onGridReady={(p) => { gridApiRef.current = p.api; }}
                    pagination={true}
                    paginationPageSize={20}             // Locks view tracking to 20 records
                    suppressCellFocus={true}
                    autoSizeStrategy={{ type: "fitCellContents" }}
                />
            </div>
        </div>
    );
};
