"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminTasksQuery, useCreateAdminTaskMutation, useUpdateAdminTaskMutation, useDeleteAdminTaskMutation, useAdminProjectsQuery, useAdminUsersQuery } from "@/hooks/use-api-queries";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, X, Plus, AlertCircle, Clock, CalendarDays, User } from "lucide-react";

interface Task {
  _id: string;
  projectId: { _id: string; name?: string; title?: string };
  title: string;
  description?: string;
  assignedTo?: { _id: string; name: string; email: string; role: string };
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "review" | "completed";
  dueDate?: string;
  createdAt: string;
}

export default function TasksPage() {
  const { data: tasks = [], isLoading } = useAdminTasksQuery();
  const { data: projects = [] } = useAdminProjectsQuery();
  const { data: users = [] } = useAdminUsersQuery(); // For assigning to users (employees, devs, etc)
  
  const createTask = useCreateAdminTaskMutation();
  const updateTask = useUpdateAdminTaskMutation();
  const deleteTask = useDeleteAdminTaskMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    status: "todo",
    dueDate: ""
  });

  const openDrawer = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        projectId: task.projectId?._id || "",
        title: task.title,
        description: task.description || "",
        assignedTo: task.assignedTo?._id || "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      });
    } else {
      setEditingTask(null);
      setFormData({
        projectId: "",
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        status: "todo",
        dueDate: ""
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      assignedTo: formData.assignedTo || undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
    };

    if (editingTask) {
      updateTask.mutate(
        { id: editingTask._id, ...payload },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createTask.mutate(payload, { onSuccess: () => setIsDrawerOpen(false) });
    }
  };

  const columns: Column<Task>[] = [
    {
      header: "Task",
      cell: (row) => (
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
            row.priority === "urgent" ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" :
            row.priority === "high" ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
            row.priority === "low" ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" :
            "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          }`}>
            {row.priority === "urgent" ? <AlertCircle className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white line-clamp-1" title={row.title}>{row.title}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Project: {row.projectId?.title || row.projectId?.name || "Unknown"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Assignee",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.assignedTo ? (
            <>
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[9px] font-bold text-indigo-700 dark:text-indigo-400">
                {row.assignedTo.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {row.assignedTo.name}
                </div>
                <div className="text-[9px] text-slate-400 uppercase">{row.assignedTo.role}</div>
              </div>
            </>
          ) : (
            <span className="text-xs text-slate-400 italic flex items-center gap-1">
              <User className="w-3 h-3" /> Unassigned
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === "completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
          row.status === "in_progress" ? "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30" :
          row.status === "review" ? "bg-purple-50 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30" :
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
        }`}>
          {row.status.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Due Date",
      cell: (row) => (
        row.dueDate ? (
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${
            new Date(row.dueDate) < new Date() && row.status !== 'completed'
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-slate-700 dark:text-slate-300'
          }`}>
            <Clock className="w-3.5 h-3.5 opacity-70" />
            {new Date(row.dueDate).toLocaleDateString()}
          </div>
        ) : (
          <span className="text-xs text-slate-400">No deadline</span>
        )
      )
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
            onClick={() => deleteTask.mutate(row._id)}
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
        title="Tasks Board"
        description="Manage project tasks, assign work to team members, and track execution progress."
        columns={columns}
        data={isLoading ? [] : tasks}
        searchPlaceholder="Search tasks..."
        actionButton={
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Create Task
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
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingTask ? "Edit Task" : "New Task"}
                    </h2>
                    <p className="text-xs text-slate-500">Task details and assignment</p>
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
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
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
                      Task Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="e.g. Implement OAuth2 login"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Assign To (Optional)
                    </label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    >
                      <option value="">-- Unassigned --</option>
                      {users.filter((u: any) => u.role !== 'client').map((user: any) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                      placeholder="Task details and acceptance criteria..."
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
                    disabled={createTask.isPending || updateTask.isPending}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                  >
                    {createTask.isPending || updateTask.isPending ? "Saving..." : editingTask ? "Save Changes" : "Create Task"}
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
