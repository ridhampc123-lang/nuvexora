"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminDepartmentsQuery, useCreateAdminDepartmentMutation, useUpdateAdminDepartmentMutation, useDeleteAdminDepartmentMutation, useAdminUsersQuery } from "@/hooks/use-api-queries";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, X, Plus, Landmark, HandCoins, Users } from "lucide-react";

interface Department {
  _id: string;
  name: string;
  headOfDepartment: { _id: string; name: string; email: string };
  budget: number;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function DepartmentsPage() {
  const { data: departments = [], isLoading } = useAdminDepartmentsQuery();
  const { data: users = [] } = useAdminUsersQuery();
  
  const createDept = useCreateAdminDepartmentMutation();
  const updateDept = useUpdateAdminDepartmentMutation();
  const deleteDept = useDeleteAdminDepartmentMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    headOfDepartment: "",
    budget: 0,
    description: "",
    status: "active"
  });

  const openDrawer = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        headOfDepartment: dept.headOfDepartment?._id || "",
        budget: dept.budget,
        description: dept.description || "",
        status: dept.status
      });
    } else {
      setEditingDept(null);
      setFormData({
        name: "",
        headOfDepartment: "",
        budget: 0,
        description: "",
        status: "active"
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      updateDept.mutate(
        { id: editingDept._id, ...formData },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createDept.mutate(formData, { onSuccess: () => setIsDrawerOpen(false) });
    }
  };

  const columns: Column<Department>[] = [
    {
      header: "Department",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
            <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{row.description || "No description"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Head of Dept",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.headOfDepartment ? (
            <>
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[9px] font-bold">
                {row.headOfDepartment.name.charAt(0)}
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {row.headOfDepartment.name}
              </div>
            </>
          ) : (
            <span className="text-xs text-slate-400 italic">Unassigned</span>
          )}
        </div>
      ),
    },
    {
      header: "Budget Allocation",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono text-xs">
          <HandCoins className="w-3.5 h-3.5 text-emerald-500" />
          ${row.budget.toLocaleString()}
        </div>
      )
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          row.status === "active" 
            ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80" 
            : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openDrawer(row)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => deleteDept.mutate(row._id)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Company Departments"
        description="Manage organizational units, assign department heads, and allocate operating budgets."
        columns={columns}
        data={isLoading ? [] : departments}
        searchPlaceholder="Search departments..."
        actionButton={
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        }
      />

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingDept ? "Edit Department" : "New Department"}
                    </h2>
                    <p className="text-xs text-slate-500">Configure organizational unit</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Department Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engineering, Sales, HR"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Head of Department
                    </label>
                    <select
                      value={formData.headOfDepartment}
                      onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    >
                      <option value="">-- Select HOD --</option>
                      {users.map((user: any) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Operating Budget ($)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Description / Mandate
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                      placeholder="Brief description of the department's role..."
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createDept.isPending || updateDept.isPending}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                  >
                    {createDept.isPending || updateDept.isPending ? "Saving..." : editingDept ? "Save Changes" : "Create Department"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
