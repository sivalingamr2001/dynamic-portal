import type { ColDef } from "ag-grid-community";

export function applyAutoCenter<T>(col: ColDef<T>): ColDef<T> {
    const field  = String(col.field      ?? "").toLowerCase();
    const header = String(col.headerName ?? "").toLowerCase();
    const shouldCenter =
        field.includes("date") || field.includes("action") ||
        header.includes("date") || header.includes("action");

    if (!shouldCenter) return col;
    return {
        ...col,
        cellStyle: {
            display: "flex", alignItems: "center",
            justifyContent: "center", textAlign: "center",
            ...(col.cellStyle as object | undefined),
        },
        headerClass: `${col.headerClass ?? ""} ag-center-header`.trim(),
    };
}

export function defaultGetRowId(data: Record<string, unknown>): string {
    return String(
        data?.id ?? data?.requestId ?? data?.allocationId ??
        data?.itemCode ?? data?.code ?? data?.sku ?? Math.random()
    );
}