import { useCallback, useRef } from "react";
import type { IGetRowsParams } from "ag-grid-community";
import type { InfiniteDataSource } from "../types";

export function useInfiniteDataSource<T extends Record<string, unknown>>(
    source: InfiniteDataSource<T> | undefined,
    searchTermRef: React.RefObject<string>,
) {
    const sourceRef = useRef(source);
    sourceRef.current = source;

    const getRows = useCallback((params: IGetRowsParams) => {
        const s = sourceRef.current;
        if (!s) { params.failCallback(); return; }

        s.fetchPage({
            startRow:   params.startRow,
            endRow:     params.endRow,
            searchTerm: searchTermRef.current ?? "",
        })
        .then(({ rows, totalCount }) => {
            const lastRow = rows.length < (params.endRow - params.startRow)
                ? params.startRow + rows.length
                : totalCount;
            params.successCallback(rows as object[], lastRow);
        })
        .catch(() => params.failCallback());
    }, [searchTermRef]);

    if (!source) return undefined;
    return { getRows };
}