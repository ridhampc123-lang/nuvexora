"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, Upload, MessageSquare, Clock, AlertCircle, CheckCircle2, Play, Pause } from "lucide-react";
import { useEmployeeTasksQuery } from "@/hooks/use-api-queries";
import { useAuth } from "@/providers/auth-provider";

interface TaskItem {
  id: string;
  title: string;
  project: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "BACKLOG" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  estimatedHours: number;
  loggedHours: number;
  description: string;
  deliverables: string[];
  comments: { author: string; text: string; time: string }[];
}

export default function EmployeeTasksPage() {
  const { data: dbTasks = [], isLoading } = useEmployeeTasksQuery();
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [deliverableInput, setDeliverableInput] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (dbTasks.length > 0) {
      const mappedTasks = dbTasks.map((t: any) => ({
        id: t._id?.slice(-6).toUpperCase() || "TSK-300",
        title: t.title,
        project: t.projectId?.title || "Project",
        priority: (t.priority || "MEDIUM").toUpperCase() as any,
        status: (t.status || "TODO").replace("_", " ").toUpperCase() as any,
        estimatedHours: 8,
        loggedHours: 0,
        description: t.description || "Active engineering deliverable assigned to your account.",
        deliverables: [],
        comments: [],
      }));
      setTasks(mappedTasks);
      setActiveTask(mappedTasks[0]);
    }
  }, [dbTasks]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400">Loading assigned tasks...</div>;
  }

  if (dbTasks.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-xl mx-auto text-white">
        <CheckSquare className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
        <h3 className="text-lg font-bold text-white">No Assigned Tasks</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          You are not currently assigned to any active tasks. Please check in with your project manager.
        </p>
      </div>
    );
  }

  const updateStatus = (id: string, newStatus: TaskItem["status"]) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    setTasks(updated);
    if (activeTask && activeTask.id === id) {
      setActiveTask({ ...activeTask, status: newStatus });
    }
  };

  const addComment = () => {
    if (!commentInput.trim() || !activeTask) return;
    const newComment = { author: user?.name || "Employee", text: commentInput, time: "Just now" };
    const updated = { ...activeTask, comments: [...activeTask.comments, newComment] };
    setActiveTask(updated);
    setTasks(tasks.map((t) => (t.id === activeTask.id ? updated : t)));
    setCommentInput("");
  };

  const addDeliverable = () => {
    if (!deliverableInput.trim() || !activeTask) return;
    const updated = { ...activeTask, deliverables: [...activeTask.deliverables, deliverableInput] };
    setActiveTask(updated);
    setTasks(tasks.map((t) => (t.id === activeTask.id ? updated : t)));
    setDeliverableInput("");
  };

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-emerald-400" />
          <span>My Assigned Tasks</span>
        </h1>
        <p className="text-xs text-slate-400">
          Strictly scoped to your assigned deliverables. Update status, track time, upload files, and request clarifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveTask(t)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                activeTask?.id === t.id
                  ? "bg-slate-900 border-blue-500 shadow-lg"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-blue-400">{t.id}</span>
                <span className="text-slate-400">{t.project}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{t.title}</h3>
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                  {t.priority}
                </span>
                <span className="text-emerald-400 font-semibold text-[11px]">{t.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Task Detail View */}
        {activeTask ? (
          <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-mono text-blue-400">{activeTask.id} • {activeTask.project}</span>
                <h2 className="text-xl font-bold text-white mt-1">{activeTask.title}</h2>
              </div>

              {/* Timer Toggle */}
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isTimerRunning ? "bg-amber-600 text-white animate-pulse" : "bg-slate-800 text-slate-200"
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
                <span>{isTimerRunning ? "Timer Running (05:30)" : "Start Time Tracker"}</span>
              </button>
            </div>

            {/* Status Change Buttons */}
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="text-slate-400 self-center mr-2">Update Status:</span>
              {(["BACKLOG", "IN_PROGRESS", "REVIEW", "COMPLETED"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(activeTask.id, s)}
                  className={`px-3 py-1.5 rounded-lg ${
                    activeTask.status === s ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase text-slate-400">Description</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">{activeTask.description}</p>
            </div>

            {/* Deliverables Section */}
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                <Upload className="w-4 h-4 text-blue-400" /> Uploaded Deliverables
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter deliverable file name or link..."
                  value={deliverableInput}
                  onChange={(e) => setDeliverableInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
                <button onClick={addDeliverable} className="px-4 py-2 rounded-xl bg-blue-600 text-xs font-bold">
                  Submit File
                </button>
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                {activeTask.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Comments Section */}
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-white">
                <MessageSquare className="w-4 h-4 text-purple-400" /> Clarifications & Comments
              </h3>
              <div className="space-y-2">
                {activeTask.comments.map((c, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>{c.author}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{c.time}</span>
                    </div>
                    <p className="text-slate-300">{c.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask question or post clarification comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
                <button onClick={addComment} className="px-4 py-2 rounded-xl bg-purple-600 text-xs font-bold">
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-xl">
            Select a task to view details.
          </div>
        )}
      </div>
    </div>
  );
}
