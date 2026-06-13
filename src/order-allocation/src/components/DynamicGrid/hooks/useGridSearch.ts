import { useEffect, useRef, useState } from "react";
import type { GridApi } from "ag-grid-community";

interface UseGridSearchResult {
    searchTerm: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useGridSearch(
    gridApiRef: React.RefObject<GridApi | null>,
    onExternalSearch?: (term: string) => void,
): UseGridSearchResult {
    const [searchTerm, setSearchTerm] = useState("");
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (onExternalSearch) onExternalSearch(value);
            else gridApiRef.current?.setGridOption("quickFilterText", value);
        }, 300);
    };

    useEffect(() => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    return { searchTerm, handleSearchChange };
}