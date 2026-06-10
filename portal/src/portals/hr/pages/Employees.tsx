// src/portals/hr/pages/Employees.tsx
import React, { useState } from "react";
import { DataTable, Column, Button, Input, Modal } from "@components";
import { useEmployees } from "../hooks/useEmployees";
import { Employee } from "../services/hrService";

const Employees: React.FC = () => {
  const { data: employees = [], isLoading, error } = useEmployees();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);

  const filtered = employees.filter((e) =>
    `${e.name} ${e.department} ${e.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Employee>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "department", header: "Department", sortable: true },
    { key: "role", header: "Role" },
    {
      key: "status",
      header: "Status",
      render: (val) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            val === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          {String(val)}
        </span>
      ),
    },
    { key: "startDate", header: "Start Date", sortable: true },
    {
      key: "id",
      header: "Actions",
      align: "right",
      render: (_, row) => (
        <Button size="sm" variant="ghost" onClick={() => setSelected(row)}>
          View
        </Button>
      ),
    },
  ];

  if (error) return <div className="p-8 text-red-500">Failed to load employees</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employees</h1>
          <p className="text-slate-500">{filtered.length} employees</p>
        </div>
        <Button>+ Add Employee</Button>
      </div>

      <Input
        placeholder="Search employees…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        containerClassName="max-w-xs"
      />

      <DataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        loading={isLoading}
        keyExtractor={(row) => String(row["id"])}
        onRowClick={(row) => setSelected(row as unknown as Employee)}
      />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        description={selected?.role}
        footer={
          <Button variant="secondary" onClick={() => setSelected(null)}>
            Close
          </Button>
        }
      >
        <dl className="space-y-3 text-sm">
          {selected &&
            Object.entries(selected).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="font-medium text-slate-500 capitalize">{k}</dt>
                <dd className="text-slate-900 dark:text-white">{String(v)}</dd>
              </div>
            ))}
        </dl>
      </Modal>
    </div>
  );
};

export default Employees;
