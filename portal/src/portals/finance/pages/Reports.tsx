// src/portals/finance/pages/Reports.tsx
import React from "react";
import { useReports } from "../hooks/useReports";
import { DataTable, Column } from "@components";

interface Report {
  id: string;
  name: string;
  type: string;
  period: string;
  status: string;
  generatedAt: string;
}

const Reports: React.FC = () => {
  const { data: reports = [], isLoading } = useReports();

  const columns: Column<Report>[] = [
    { key: "name", header: "Report", sortable: true },
    { key: "type", header: "Type" },
    { key: "period", header: "Period" },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${v === "ready" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
        >
          {String(v)}
        </span>
      ),
    },
    { key: "generatedAt", header: "Generated", sortable: true },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
      <DataTable
        data={reports as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        loading={isLoading}
        keyExtractor={(r) => String(r["id"])}
      />
    </div>
  );
};

export default Reports;
