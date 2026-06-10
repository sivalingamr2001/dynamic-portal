import { ReactNode } from "react";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T) => ReactNode;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  keyExtractor,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">Loading data…</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className={onRowClick ? "cursor-pointer hover:bg-slate-50" : undefined}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => {
                const value = (row as Record<string, unknown>)[String(column.key)];
                return (
                  <td key={String(column.key)} className="px-4 py-4 align-top text-slate-700">
                    {column.render ? column.render(value, row) : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
