// src/portals/admin/pages/Users.tsx
import React, { useState } from "react";
import { DataTable, Column, Button, Input } from "@components";
import { useUsers } from "../hooks/useUsers";
import { AdminUser } from "../services/adminService";

const Users: React.FC = () => {
  const { data: users = [], isLoading } = useUsers();
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) =>
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "User",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (v) => (
        <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
          {String(v)}
        </span>
      ),
    },
    { key: "portal", header: "Portal Access" },
    {
      key: "lastActive",
      header: "Last Active",
      sortable: true,
      render: (v) => <span className="text-slate-500 text-xs">{String(v)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (v) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${v === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
        >
          {String(v)}
        </span>
      ),
    },
    {
      key: "id",
      header: "",
      align: "right",
      render: () => (
        <Button size="sm" variant="ghost">
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
        <Button>+ Invite User</Button>
      </div>
      <Input
        placeholder="Search users…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        containerClassName="max-w-xs"
      />
      <DataTable
        data={filtered as unknown as Record<string, unknown>[]}
        columns={columns as Column<Record<string, unknown>>[]}
        loading={isLoading}
        keyExtractor={(r) => String(r["id"])}
      />
    </div>
  );
};

export default Users;
