import type { ColDef, GridApi, IRowNode } from "ag-grid-community";
import type React from "react";

export type ActionVariant = "primary" | "secondary" | "danger";

export interface BulkAction<T> {
    label: string;
    icon?: React.ReactNode;
    variant?: ActionVariant;
    onClick: (selectedRows: T[], api: GridApi | null) => void | Promise<void>;
}

export interface GridActionItem {
    label: string;
    icon?: React.ReactNode;
    variant?: ActionVariant;
    onClick: (api: GridApi | null) => void | Promise<void>;
}

export interface InfiniteDataSource<T> {
    fetchPage: (params: FetchPageParams) => Promise<FetchPageResult<T>>;
    pageSize?: number;
}

export interface FetchPageParams {
    startRow: number;
    endRow: number;
    searchTerm: string;
}

export interface FetchPageResult<T> {
    rows: T[];
    totalCount: number;
}

export interface DynamicGridProps<T extends Record<string, unknown>> {
    rowData?: T[];
    infiniteSource?: InfiniteDataSource<T>;
    colDefs: ColDef<T>[];
    title?: string;
    description?: string;
    rowSelection?: "single" | "multiple";
    pageSize?: number;
    showPagination?: boolean;
    loading?: boolean;
    onRefresh?: () => void | Promise<void>;
    onSelectionChanged?: (selectedRows: T[]) => void;
    customActions?: GridActionItem[];
    bulkActions?: BulkAction<T>[];
}

export interface IconCellValue {
    icon: React.ReactNode;
    text: string;
}

export interface LinkCellValue {
    label: string;
    onClick: (node: IRowNode) => void;
}