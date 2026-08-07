"use client";

import React from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from "@/hooks/use-api-queries";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UserItem {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE" | "CLIENT";
  status: "active" | "deactivated";
  createdAt: string;
}

export default function UsersCMSPage() {
  const { data: users = [], isLoading } = useAdminUsersQuery();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const handleRoleChange = (id: string, newRole: string) => {
    updateUserMutation.mutate(
      { id, role: newRole },
      {
        onSuccess: () => toast.success("User system role updated successfully"),
      }
    );
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "deactivated" : "active";
    updateUserMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => toast.success(`User account marked as ${newStatus}`),
      }
    );
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete user "${name}" from the root database? This action cannot be undone.`)) {
      deleteUserMutation.mutate(id, {
        onSuccess: () => toast.success(`User ${name} permanently deleted from root database`),
        onError: (err: any) => toast.error(err.message || "Failed to delete user"),
      });
    }
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleStatus(userId, row.status)}
              disabled={updateUserMutation.isPending}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                row.status === "active" ? "bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/80" : "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/80"
              }`}
            >
              {row.status === "active" ? "Deactivate" : "Activate"}
            </button>

            <button
              onClick={() => handleDeleteUser(userId, row.name)}
              disabled={deleteUserMutation.isPending}
              className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/80 transition-colors flex items-center gap-1 font-bold text-xs px-2.5"
              title="Delete user permanently from root database"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="User & Access Control Management"
        description="Assign system roles (SUPER_ADMIN, ADMIN, CLIENT, EMPLOYEE), grant permission overrides, and manage or permanently delete user accounts."
        columns={columns}
        data={isLoading ? [] : users}
        searchPlaceholder="Search users by name, email..."
      />
    </div>
  );
}
