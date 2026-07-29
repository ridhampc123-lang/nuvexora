"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminMilestonesQuery, useCreateAdminMilestoneMutation, useUpdateAdminMilestoneMutation, useDeleteAdminMilestoneMutation, useAdminProjectsQuery } from "@/hooks/use-api-queries";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X, Plus, Clock, Target, CalendarDays } from "lucide-react";

interface Milestone {
  _id: string;
  projectId: { _id: string; title: string };
  title: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed";
}

export default function MilestonesPage() {
  const { data: milestones = [], isLoading } = useAdminMilestonesQuery();
  const { data: projects = [] } = useAdminProjectsQuery();
  
  const createMilestone = useCreateAdminMilestoneMutation();
  const updateMilestone = useUpdateAdminMilestoneMutation();
  const deleteMilestone = useDeleteAdminMilestoneMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    dueDate: "",
    status: "pending"
  });

  const openDrawer = (milestone?: Milestone) => {
    if (milestone) {
      setEditingMilestone(milestone);
      setFormData({
        projectId: milestone.projectId?._id || "",
        title: milestone.title,
        dueDate: milestone.dueDate ? new Date(milestone.dueDate).toISOString().split("T")[0] : "",
        status: milestone.status
      });
    } else {
      setEditingMilestone(null);
      setFormData({
        projectId: "",
        title: "",
        dueDate: "",
        status: "pending"
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
    };

    if (editingMilestone) {
      updateMilestone.mutate(
        { id: editingMilestone._id, ...payload },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createMilestone.mutate(payload, { onSuccess: () => setIsDrawerOpen(false) });
    }
  };

  const columns: Column<Milestone>[] = [
    {
      header: "Milestone",
      cell: (row) => (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center shrink-0 mt-0.5">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white line-clamp-1" title={row.title}>{row.title}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Project: {row.projectId?.title || "Unknown"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Target Date",
      cell: (row) => (
        row.dueDate ? (
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${
            new Date(row.dueDate) < new Date() && row.status !== 'completed'
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-slate-700 dark:text-slate-300'
          }`}>
            <CalendarDays className="w-3.5 h-3.5 opacity-70" />
            {new Date(row.dueDate).toLocaleDateString()}
          </div>
        ) : (
          <span className="text-xs text-slate-400">No deadline</span>
        )
      )
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === "completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
          row.status === "in_progress" ? "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30" :
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
        }`}>
          {row.status.replace("_", " ")}
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
            onClick={() => deleteMilestone.mutate({ id: row._id, projectId: row.projectId._id })}
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
        title="Project Milestones"
        description="Track key deliverables, phases, and major milestones across all projects."
        columns={columns}
        data={isLoading ? [] : milestones}
        searchPlaceholder="Search milestones..."
        actionButton={
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-fuchsia-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
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
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
                    <Flag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingMilestone ? "Edit Milestone" : "New Milestone"}
                    </h2>
                    <p className="text-xs text-slate-500">Key project deliverable</p>
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
                      Project
                    </label>
                    <select
                      required
                      disabled={!!editingMilestone} // Cannot change project once created for embedded milestones
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all disabled:opacity-50"
                    >
                      <option value="">-- Select Project --</option>
                      {projects.map((proj: any) => (
                        <option key={proj._id} value={proj._id}>
                          {proj.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Milestone Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all"
                      placeholder="e.g. Beta Release"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Target Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-mono"
                      />
                    </div>
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
                    disabled={createMilestone.isPending || updateMilestone.isPending}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-600/20 transition-all disabled:opacity-50"
                  >
                    {createMilestone.isPending || updateMilestone.isPending ? "Saving..." : editingMilestone ? "Save Changes" : "Add Milestone"}
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
