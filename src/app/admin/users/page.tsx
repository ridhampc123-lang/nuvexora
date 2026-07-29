"use client";

import React from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminUsersQuery, useUpdateUserMutation } from "@/hooks/use-api-queries";

interface UserItem {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CLIENT";
  status: "active" | "deactivated";
  createdAt: string;
}

export default function UsersCMSPage() {
  const { data: users = [], isLoading } = useAdminUsersQuery();
  const updateUserMutation = useUpdateUserMutation();

  const handleRoleChange = (id: string, newRole: string) => {
    updateUserMutation.mutate({ id, role: newRole });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "deactivated" : "active";
    updateUserMutation.mutate({ id, status: newStatus });
  };

  const columns: Column<UserItem>[] = [
    {
      header: "User Account",
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
          <div className="text-[10px] text-slate-400 font-mono">{row.email}</div>
        </div>
      ),
    },
    {
      header: "System Role",
      cell: (row) => {
        const userId = row._id || row.id || "";
        return (
          <select
            value={row.role}
            onChange={(e) => handleRoleChange(userId, e.target.value)}
            disabled={updateUserMutation.isPending}
            className="px-2.5 py-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
          >
            <option value="SUPER_ADMIN">👑 Super Admin</option>
            <option value="ADMIN">🛡️ Admin</option>
            <option value="CLIENT">💼 Client</option>
            <option value="EMPLOYEE">👥 Employee</option>
          </select>
        );
      },
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${row.status === "active" ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80" : "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80"}`}>
          {row.status}
        </span>
      ),
    },
    { header: "Joined", accessorKey: "createdAt" },
    {
      header: "Actions",
      cell: (row) => {
        const userId = row._id || row.id || "";
        return (
          <button
            onClick={() => handleToggleStatus(userId, row.status)}
            disabled={updateUserMutation.isPending}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
              row.status === "active" ? "bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/80" : "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80"
            }`}
          >
            {row.status === "active" ? "Deactivate" : "Activate"}
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="User & Access Control Management"
        description="Assign system roles (SUPER_ADMIN, ADMIN, CLIENT), grant permission overrides, and manage account statuses dynamically."
        columns={columns}
        data={isLoading ? [] : users}
        searchPlaceholder="Search users..."
      />
    </div>
  );
}

