import { useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { themeBalham, type ColDef, type GridApi, type GridReadyEvent, type SelectionChangedEvent } from "ag-grid-community";
import type { DynamicGridProps } from "./types";
import { applyAutoCenter, defaultGetRowId } from "./utils/colUtils";
import { useInfiniteDataSource } from "./hooks/useInfiniteDataSource";
import { useGridOverlay } from "./hooks/useGridOverlay";

const LOADING_TMPL = '<span class="ag-overlay-loading-center">Loading…</span>';
const EMPTY_TMPL   = '<span class="ag-overlay-loading-center">No records found</span>';
const DEFAULT_COL: ColDef = {
    flex: 1, minWidth: 120, sortable: true, filter: true, resizable: true, wrapHeaderText: true,
};

interface GridCoreProps<T extends Record<string, unknown>>
    extends Pick<DynamicGridProps<T>, "rowData" | "infiniteSource" | "colDefs" | "rowSelection" | "pageSize" | "showPagination" | "loading"> {
    onGridReady: (api: GridApi) => void;
    onSelectionChanged: (rows: T[]) => void;
    searchTermRef: React.RefObject<string>;
}

export function GridCore<T extends Record<string, unknown>>({
    rowData, infiniteSource, colDefs, rowSelection,
    pageSize = 20, showPagination = true, loading = false,
    onGridReady, onSelectionChanged, searchTermRef,
}: GridCoreProps<T>) {
    const gridApiRef  = useRef<GridApi | null>(null);
    const datasource  = useInfiniteDataSource(infiniteSource, searchTermRef);
    const processedCols  = useMemo(() => colDefs.map(applyAutoCenter<T>), [colDefs]);

    const theme = useMemo(() => themeBalham.withParams({
        spacing: 3, rowHeight: 33, headerHeight: 32, fontSize: 12,
        fontFamily: "var(--font-sans)", borderColor: "var(--border)",
        headerBackgroundColor: "var(--muted)", backgroundColor: "var(--card)",
    }), []);

    const rowSelectionModel = useMemo(() =>
        rowSelection === "multiple"
            ? { mode: "multiRow" as const, checkboxes: true, headerCheckbox: true, selectAll: "currentPage" as const, enableClickSelection: true }
            : { mode: "singleRow" as const, enableClickSelection: true },
    [rowSelection]);

    const handleGridReady = useCallback((e: GridReadyEvent) => {
        gridApiRef.current = e.api;
        onGridReady(e.api);
    }, [onGridReady]);

    const handleSelectionChanged = useCallback((e: SelectionChangedEvent) => {
        onSelectionChanged(e.api.getSelectedRows() as T[]);
    }, [onSelectionChanged]);

    useGridOverlay(gridApiRef, loading, !!(rowData?.length ?? datasource));

    return (
        <AgGridReact<T>
            theme={theme}
            rowData={datasource ? undefined : rowData}
            datasource={datasource}
            rowModelType={datasource ? "infinite" : "clientSide"}
            columnDefs={processedCols}
            defaultColDef={DEFAULT_COL as ColDef<T>}
            rowSelection={rowSelectionModel}
            onGridReady={handleGridReady}
            onSelectionChanged={handleSelectionChanged}
            overlayLoadingTemplate={LOADING_TMPL}
            overlayNoRowsTemplate={EMPTY_TMPL}
            pagination={showPagination && !datasource}
            paginationPageSize={pageSize}
            paginationPageSizeSelector={[20, 50, 100, 200]}
            cacheBlockSize={datasource ? pageSize : undefined}
            maxBlocksInCache={datasource ? 10 : undefined}
            animateRows={false}
            getRowId={(p) => defaultGetRowId(p.data as Record<string, unknown>)}
            maintainColumnOrder enableCellTextSelection ensureDomOrder suppressCellFocus
        />
    );
}