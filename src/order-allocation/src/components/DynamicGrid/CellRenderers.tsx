import type { ICellRendererParams } from "ag-grid-community";
import type { IconCellValue, LinkCellValue } from "./types";

// ── IconCellRenderer ──────────────────────────────────────────────────────────
// Usage: cellRenderer: IconCellRenderer
//        valueGetter: (p) => ({ icon: <Tag />, text: p.data.status })
export function IconCellRenderer({ value }: ICellRendererParams<unknown, IconCellValue>) {
    if (!value?.icon && !value?.text) return null;
    return (
        <span className="flex items-center gap-1.5 text-xs">
            {value.icon && (
                <span className="h-3.5 w-3.5 flex items-center text-muted-foreground shrink-0">
                    {value.icon}
                </span>
            )}
            <span>{value.text}</span>
        </span>
    );
}

// ── LinkCellRenderer ──────────────────────────────────────────────────────────
// Usage: cellRenderer: LinkCellRenderer
//        valueGetter: (p) => ({ label: p.data.name, onClick: (node) => navigate(...) })
export function LinkCellRenderer({ value, node }: ICellRendererParams<unknown, LinkCellValue>) {
    if (!value) return null;
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        value.onClick(node);
    };
    return (
        <button onClick={handleClick} type="button"
            className="text-primary underline underline-offset-2 hover:opacity-75 text-xs truncate max-w-full text-left">
            {value.label}
        </button>
    );
}

// ── StatusBadgeCellRenderer ───────────────────────────────────────────────────
const STATUS_PALETTE: Record<string, string> = {
    active:   "bg-green-100  text-green-800  dark:bg-green-900  dark:text-green-300",
    inactive: "bg-gray-100   text-gray-700   dark:bg-gray-800   dark:text-gray-300",
    pending:  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error:    "bg-red-100    text-red-800    dark:bg-red-900    dark:text-red-300",
    approved: "bg-blue-100   text-blue-800   dark:bg-blue-900   dark:text-blue-300",
};

export function StatusBadgeCellRenderer({ value }: ICellRendererParams<unknown, string>) {
    const cls = STATUS_PALETTE[String(value ?? "").toLowerCase()] ?? "bg-gray-100 text-gray-700";
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>
            {value}
        </span>
    );
}