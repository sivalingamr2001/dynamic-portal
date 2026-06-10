// src/portals/admin/pages/AdminDashboard.tsx
import React from "react";
import { Link } from "@tanstack/react-router";

const stats = [
  { label: "Total Users", value: "1,284", delta: "+23" },
  { label: "Active Sessions", value: "342", delta: "+12" },
  { label: "Portals Active", value: "3", delta: "0" },
  { label: "API Errors (24h)", value: "7", delta: "-14" },
];

const AdminDashboard: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
      <p className="text-slate-500">System health and management overview</p>
    </div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{s.value}</p>
          <p className="mt-1 text-xs font-medium text-slate-400">{s.delta} from yesterday</p>
        </div>
      ))}
    </div>
    <div className="flex gap-3">
      <Link
        to="/admin/users"
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
      >
        Manage Users
      </Link>
      <Link
        to="/admin/settings"
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Settings
      </Link>
    </div>
  </div>
);

export default AdminDashboard;
