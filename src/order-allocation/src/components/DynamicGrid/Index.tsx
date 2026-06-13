import { useCallback, useRef, useState } from "react";
import type { GridApi } from "ag-grid-community";
import type { DynamicGridProps } from "./types";
import { GridToolbar } from "./GridToolbar";
import { GridCore } from "./GridCore";
import { useGridSearch } from "./hooks/useGridSearch";

export function DynamicGrid<T extends Record<string, unknown>>({
    rowData, infiniteSource, colDefs, rowSelection,
    customActions = [], bulkActions = [],
    onRefresh, pageSize = 20, showPagination = true,
    loading = false, onSelectionChanged,
}: DynamicGridProps<T>) {
    const gridApiRef    = useRef<GridApi | null>(null);
    const searchTermRef = useRef<string>("");
    const [selectedRows, setSelectedRows] = useState<T[]>([]);

    const handleExternalSearch = useCallback((term: string) => {
        searchTermRef.current = term;
        gridApiRef.current?.purgeInfiniteCache?.();
    }, []);

    const { searchTerm, handleSearchChange } = useGridSearch(
        gridApiRef,
        infiniteSource ? handleExternalSearch : undefined,
    );

    const handleGridReady = useCallback((api: GridApi) => {
        gridApiRef.current = api;
    }, []);

    const handleSelectionChanged = useCallback((rows: T[]) => {
        setSelectedRows(rows);
        onSelectionChanged?.(rows);
    }, [onSelectionChanged]);

    return (
        <div className="w-full h-[90%] flex flex-col min-h-0 bg-card rounded-lg overflow-hidden border border-border">
            <GridToolbar<T>
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                customActions={customActions}
                bulkActions={bulkActions ?? []}
                selectedRows={selectedRows}
                gridApi={gridApiRef.current}
                onRefresh={onRefresh}
            />
            <div className="flex-1 w-full min-h-0 overflow-hidden">
                <GridCore<T>
                    rowData={rowData}
                    infiniteSource={infiniteSource}
                    colDefs={colDefs}
                    rowSelection={rowSelection}
                    pageSize={pageSize}
                    showPagination={showPagination}
                    loading={loading}
                    onGridReady={handleGridReady}
                    onSelectionChanged={handleSelectionChanged}
                    searchTermRef={searchTermRef}
                />
            </div>
            {rowData && rowData.length > 0 && (
                <div className="px-3 py-1 border-t border-border text-xs text-muted-foreground bg-background/30 flex justify-between">
                    <span>Total Records: {rowData.length}</span>
                    <span>Page Size: {pageSize}</span>
                </div>
            )}
        </div>
    );
}

export type {
    DynamicGridProps, GridActionItem, BulkAction,
    InfiniteDataSource, FetchPageParams, FetchPageResult,
    IconCellValue, LinkCellValue,
} from "./types";

export { IconCellRenderer, LinkCellRenderer, StatusBadgeCellRenderer } from "./CellRenderers";