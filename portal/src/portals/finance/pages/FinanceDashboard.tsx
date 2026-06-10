// src/portals/finance/pages/FinanceDashboard.tsx
import React from "react";

const metrics = [
  { label: "Revenue (MTD)", value: "$2.4M", delta: "+8.2%", positive: true },
  { label: "Expenses (MTD)", value: "$1.1M", delta: "+3.1%", positive: false },
  { label: "Net Profit", value: "$1.3M", delta: "+14.6%", positive: true },
  { label: "Pending Invoices", value: "47", delta: "-5", positive: true },
];

const FinanceDashboard: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Finance Overview</h1>
      <p className="text-slate-500">Month-to-date financial performance</p>
    </div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{m.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{m.value}</p>
          <p
            className={`mt-1 text-xs font-medium ${m.positive ? "text-emerald-600" : "text-red-500"}`}
          >
            {m.delta}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default FinanceDashboard;
