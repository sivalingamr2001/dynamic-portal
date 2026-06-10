// src/portals/finance/pages/Invoices.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, Column, Button } from "@components";
import { queryKeys } from "@api/queryKeys";
import { financeService } from "../services/financeService";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const Invoices: React.FC = () => {
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: queryKeys.finance.invoices(),
    queryFn: financeService.getInvoices,
  });

  const columns: Column<Invoice>[] = [
    { key: "id", header: "Invoice #" },
    { key: "client", header: "Client", sortable: true },
    { key: "amount", header: "Amount", align: "right", render: (v) => fmtCurrency(Number(v)) },
    { key: "dueDate", header: "Due Date", sortable: true },
    {
      key: "status",
      header: "Status",
      render: (v) => {
        const c = {
          paid: "bg-emerald-100 text-emerald-700",
          pending: "bg-amber-100 text-amber-700",
          overdue: "bg-red-100 text-red-700",
        };
        return (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${c[v as keyof typeof c]}`}
          >
            {String(v)}
          </span>
        );
      },
    },
    {
      key: "id",
      header: "",
      align: "right",
      render: () => (
        <Button size="sm" variant="ghost">
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoices</h1>
        <Button>+ New Invoice</Button>
      </div>
      <DataTable
        data={invoices as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        loading={isLoading}
        keyExtractor={(r) => String(r["id"])}
      />
    </div>
  );
};

export default Invoices;
