// src/portals/hr/pages/HRDashboard.tsx
import React from "react";
import { Link } from "@tanstack/react-router";

const stats = [
  { label: "Total Employees", value: "247", delta: "+12", positive: true },
  { label: "On Leave Today", value: "8", delta: "-2", positive: true },
  { label: "Open Positions", value: "14", delta: "+3", positive: false },
  { label: "Avg. Satisfaction", value: "4.2/5", delta: "+0.1", positive: true },
];

const HRDashboard: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">HR Dashboard</h1>
      <p className="text-slate-500 dark:text-slate-400">
        Welcome back — here's what's happening today
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{s.value}</p>
          <p
            className={`mt-1 text-xs font-medium ${s.positive ? "text-emerald-600" : "text-red-500"}`}
          >
            {s.delta} from last month
          </p>
        </div>
      ))}
    </div>

    <div className="flex gap-4">
      <Link
        to="/hr/employees"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        View Employees
      </Link>
      <Link
        to="/hr/payroll"
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Payroll Reports
      </Link>
    </div>
  </div>
);

export default HRDashboard;
