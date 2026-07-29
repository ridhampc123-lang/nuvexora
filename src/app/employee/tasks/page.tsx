"use client";

import React, { useState } from "react";
import { CheckSquare, Upload, MessageSquare, Clock, AlertCircle, CheckCircle2, Play, Pause } from "lucide-react";

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

const mockTasks: TaskItem[] = [
  {
    id: "TSK-301",
    title: "Refactor Next.js App Router Edge Cache Headers",
    project: "Veloce Cloud Systems",
    priority: "HIGH",
    status: "IN_PROGRESS",
    estimatedHours: 8,
    loggedHours: 5.5,
    description: "Implement stale-while-revalidate headers across Vercel edge network for sub-350ms TTFB.",
    deliverables: ["edge-cache-config.ts", "http-benchmarks.pdf"],
    comments: [
      { author: "Marcus Vance", text: "Ensure cache invalidation key includes tenant ID.", time: "Yesterday 4:00 PM" }
    ]
  },
  {
    id: "TSK-302",
    title: "Review Pull Request #142 for RAG Vector Pipeline",
    project: "Omni Global RAG AI",
    priority: "MEDIUM",
    status: "BACKLOG",
    estimatedHours: 4,
    loggedHours: 1.0,
    description: "Verify pgvector semantic search accuracy with top-k=5 retrieval parameters.",
    deliverables: [],
    comments: []
  }
];

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks);
  const [activeTask, setActiveTask] = useState<TaskItem>(mockTasks[0]);
  const [commentInput, setCommentInput] = useState("");
  const [deliverableInput, setDeliverableInput] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const updateStatus = (id: string, newStatus: TaskItem["status"]) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    setTasks(updated);
    if (activeTask.id === id) {
      setActiveTask({ ...activeTask, status: newStatus });
    }
  };

  const addComment = () => {
    if (!commentInput.trim()) return;
    const newComment = { author: "Alexander Vance", text: commentInput, time: "Just now" };
    const updated = { ...activeTask, comments: [...activeTask.comments, newComment] };
    setActiveTask(updated);
    setTasks(tasks.map((t) => (t.id === activeTask.id ? updated : t)));
    setCommentInput("");
  };

  const addDeliverable = () => {
    if (!deliverableInput.trim()) return;
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
                activeTask.id === t.id
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
      </div>
    </div>
  );
}
