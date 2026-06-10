// src/portals/hr/pages/Payroll.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, Column } from "@components";
import { queryKeys } from "@api/queryKeys";
import { hrService } from "../services/hrService";

interface PayrollRecord {
  id: string;
  employee: string;
  period: string;
  gross: number;
  deductions: number;
  net: number;
  status: "paid" | "pending" | "processing";
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const Payroll: React.FC = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: queryKeys.hr.payroll(),
    queryFn: hrService.getPayroll,
  });

  const columns: Column<PayrollRecord>[] = [
    { key: "employee", header: "Employee", sortable: true },
    { key: "period", header: "Pay Period" },
    { key: "gross", header: "Gross Pay", align: "right", render: (v) => fmtCurrency(Number(v)) },
    {
      key: "deductions",
      header: "Deductions",
      align: "right",
      render: (v) => fmtCurrency(Number(v)),
    },
    {
      key: "net",
      header: "Net Pay",
      align: "right",
      render: (v) => <span className="font-semibold">{fmtCurrency(Number(v))}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (v) => {
        const colors = {
          paid: "bg-emerald-100 text-emerald-700",
          pending: "bg-amber-100 text-amber-700",
          processing: "bg-blue-100 text-blue-700",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors[v as keyof typeof colors]}`}
          >
            {String(v)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payroll</h1>
      <DataTable
        data={data as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        loading={isLoading}
        keyExtractor={(row) => String(row["id"])}
      />
    </div>
  );
};

export default Payroll;
