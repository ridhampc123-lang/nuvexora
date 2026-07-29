"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useClientTasksQuery, useUpdateClientTaskMutation } from "@/hooks/use-api-queries";

interface TaskItem {
  _id?: string;
  id?: string;
  title: string;
  project?: string;
  priority?: "urgent" | "high" | "medium";
  status: "todo" | "in_progress" | "review" | "completed" | "pending";
  assignee?: string;
  dueDate?: string;
}

export default function ClientTasksPage() {
  const [filter, setFilter] = useState<string>("all");
  const { data: tasks = [], isLoading } = useClientTasksQuery();
  const updateTaskMutation = useUpdateClientTaskMutation();

  const handleToggleComplete = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    updateTaskMutation.mutate({ id, status: newStatus });
  };

  const taskList: TaskItem[] = isLoading ? [] : tasks;
  const filteredTasks = taskList.filter(t => filter === "all" || t.status === filter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Task Tracker & Engineering Sprints</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Linear-style sprint backlog and pending approvals dynamically synced with Nuvexora API engine.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
          {["all", "pending", "in_progress", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-colors ${
                filter === tab ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
            No tasks found for current filter.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const taskId = t._id || t.id || "";
            return (
              <div key={taskId} className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    t.priority === "urgent" || t.priority === "high" ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400" : "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                  }`}>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t.project || "Veloce Banking Engine"} • Assigned: {t.assignee || "Engineering Lead"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    t.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {t.status.replace("_", " ")}
                  </span>

                  <button
                    onClick={() => handleToggleComplete(taskId, t.status)}
                    disabled={updateTaskMutation.isPending}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      t.status === "completed" ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
                    }`}
                  >
                    {t.status === "completed" ? "Mark Pending" : "Sign Off & Complete"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

