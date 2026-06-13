import { useCallback, useMemo, useState } from "react";
import type { GridApi, ColDef, IRowNode } from "ag-grid-community";
import { Download, Mail, Plus, Trash2, User } from "lucide-react";
import { DynamicGrid, IconCellRenderer, LinkCellRenderer, StatusBadgeCellRenderer, type BulkAction, type GridActionItem, type InfiniteDataSource } from "@/components/DynamicGrid/Index";

interface EmployeeRow {
    [key: string]: unknown;
    id: number;
    name: string;
    email: string;
    department: string;
    role: string;
    status: string;
    joinDate: string;
    salary: number;
}

const EMPLOYEES: EmployeeRow[] = Array.from({ length: 500 }, (_, index) => ({
    id: index + 1,
    name: `Employee ${index + 1}`,
    email: `employee${index + 1}@company.com`,
    department: ["Engineering", "HR", "Finance", "Sales"][index % 4],
    role: ["Developer", "Manager", "Analyst", "Lead"][index % 4],
    status: index % 2 === 0 ? "Active" : "Inactive",
    joinDate: "2025-01-01",
    salary: 500000 + index * 1000,
}));

async function fetchEmployeePage(
    startRow: number,
    endRow: number,
    searchTerm?: string
) {
    let data = EMPLOYEES;

    if (searchTerm?.trim()) {
        const search = searchTerm.toLowerCase();

        data = data.filter(
            (x) =>
                x.name.toLowerCase().includes(search) ||
                x.email.toLowerCase().includes(search) ||
                x.department.toLowerCase().includes(search)
        );
    }

    return {
        rows: data.slice(startRow, endRow),
        lastRow: data.length,
    };
}

export const NewAllocationPage = () => {
    const [lastAction, setLastAction] = useState("");

    const handleNavigate = useCallback((row: EmployeeRow) => {
        setLastAction(`Opened: ${row.name} (ID ${row.id})`);
    }, []);

    const colDefs = useMemo<ColDef<EmployeeRow>[]>(() => [
        {
            headerName: "Name",
            field: "name",
            minWidth: 160,
            cellRenderer: LinkCellRenderer,
            valueGetter: (p) => ({
                label: p.data?.name ?? "",
                onClick: (node: IRowNode) =>
                    handleNavigate(node.data as EmployeeRow),
            }),
        },
        {
            headerName: "Email",
            field: "email",
            minWidth: 200,
            cellRenderer: IconCellRenderer,
            valueGetter: (p) => ({
                icon: <Mail className="h-3 w-3" />,
                text: p.data?.email ?? "",
            }),
        },
        {
            headerName: "Department",
            field: "department",
            minWidth: 160,
            cellRenderer: IconCellRenderer,
            valueGetter: (p) => ({
                icon: <User className="h-3 w-3" />,
                text: p.data?.department ?? "",
            }),
        },
        {
            headerName: "Role",
            field: "role",
            minWidth: 120,
        },
        {
            headerName: "Status",
            field: "status",
            minWidth: 120,
            cellRenderer: StatusBadgeCellRenderer,
        },
        {
            headerName: "Join Date",
            field: "joinDate",
            minWidth: 130,
        },
        {
            headerName: "Salary (₹)",
            field: "salary",
            minWidth: 140,
            valueFormatter: (p) =>
                p.value != null
                    ? new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                      }).format(p.value)
                    : "",
        },
    ], [handleNavigate]);

    const customActions = useMemo<GridActionItem[]>(() => [
        {
            label: "Add Employee",
            icon: <Plus className="h-3 w-3" />,
            variant: "primary",
            onClick: () => setLastAction("Add Employee clicked"),
        },
        {
            label: "Export CSV",
            icon: <Download className="h-3 w-3" />,
            variant: "secondary",
            onClick: (api: GridApi | null) => {
                api?.exportDataAsCsv({
                    fileName: "employees.csv",
                });
                setLastAction("CSV export triggered");
            },
        },
    ], []);

    const bulkActions = useMemo<BulkAction<EmployeeRow>[]>(() => [
        {
            label: "Delete Selected",
            icon: <Trash2 className="h-3 w-3" />,
            variant: "danger",
            onClick: (rows) =>
                setLastAction(
                    `Delete: ${rows.map((r) => r.name).join(", ")}`
                ),
        },
        {
            label: "Export Selected",
            icon: <Download className="h-3 w-3" />,
            variant: "secondary",
            onClick: (rows, api) => {
                api?.exportDataAsCsv({
                    onlySelected: true,
                    fileName: "selected.csv",
                });
                setLastAction(`Exported ${rows.length} rows`);
            },
        },
    ], []);

    const infiniteSource = useMemo<InfiniteDataSource<EmployeeRow>>(
        () => ({
            pageSize: 50,
            fetchPage: ({ startRow, endRow, searchTerm }) =>
                fetchEmployeePage(startRow, endRow, searchTerm),
        }),
        []
    );

    return (
        <div className="flex flex-col gap-4 h-screen">
            <div className="flex-1 min-h-0">
                <DynamicGrid<EmployeeRow>
                    infiniteSource={infiniteSource}
                    colDefs={colDefs}
                    rowSelection="multiple"
                    customActions={customActions}
                    bulkActions={bulkActions}
                    pageSize={50}
                    showPagination={true}
                />
            </div>
        </div>
    );
};
