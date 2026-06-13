import { useEffect } from "react";
import type { GridApi } from "ag-grid-community";

export function useGridOverlay(
    gridApiRef: React.RefObject<GridApi | null>,
    isLoading: boolean,
    hasRows: boolean,
): void {
    useEffect(() => {
        const api = gridApiRef.current;
        if (!api) return;
        if (isLoading)      api.showLoadingOverlay();
        else if (!hasRows)  api.showNoRowsOverlay();
        else                api.hideOverlay();
    }, [gridApiRef, isLoading, hasRows]);
}