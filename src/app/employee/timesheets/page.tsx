"use client";

import React, { useState } from "react";
import { Clock, Plus, Calendar, CheckCircle2, X } from "lucide-react";

export default function EmployeeTimesheetsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);

  // Form State
  const [date, setDate] = useState("2026-08-04");
  const [project, setProject] = useState("Development Project");
  const [task, setTask] = useState("");
  const [hours, setHours] = useState(1);
  const [type, setType] = useState("BILLABLE");

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    setLogs([{ date, project, task, hours, type }, ...logs]);
    setTask("");
    setShowLogForm(false);
  };

  const totalHours = logs.reduce((acc, curr) => acc + curr.hours, 0);
  const billableHours = logs.filter(l => l.type === "BILLABLE").reduce((acc, curr) => acc + curr.hours, 0);
  const nonBillableHours = logs.filter(l => l.type === "NON_BILLABLE").reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            <span>My Timesheets & Work Logs</span>
          </h1>
          <p className="text-xs text-slate-400">
            Track daily work logs, billable vs non-billable hours, and weekly summaries.
          </p>
        </div>

        <button
          onClick={() => setShowLogForm(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Work Hours</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Total Hours (Logged)</div>
          <div className="text-3xl font-extrabold text-white">{totalHours.toFixed(1)} Hrs</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Billable Hours</div>
          <div className="text-3xl font-extrabold text-emerald-400">{billableHours.toFixed(1)} Hrs</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Non-Billable Hours</div>
          <div className="text-3xl font-extrabold text-amber-400">{nonBillableHours.toFixed(1)} Hrs</div>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold">Daily Work Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="p-3">Date</th>
                <th className="p-3">Project</th>
                <th className="p-3">Task Description</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No work logs found. Click the button above to record your first daily log.
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-300">{log.date}</td>
                    <td className="p-3 font-bold text-white">{log.project}</td>
                    <td className="p-3 text-slate-300">{log.task}</td>
                    <td className="p-3 font-bold text-blue-400">{log.hours} Hrs</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.type === "BILLABLE" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {log.type}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Work Hours Modal */}
      {showLogForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleLogSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-white">Record Daily Work Hours</h3>
              <button 
                type="button"
                onClick={() => setShowLogForm(false)}
                className="p-1 rounded-lg hover:bg-slate-850 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Project Module</label>
                <input
                  type="text"
                  required
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Deliverable Task</label>
                <input
                  type="text"
                  required
                  placeholder="Describe your task outputs..."
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Hours</label>
                  <input
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.5"
                    required
                    value={hours}
                    onChange={(e) => setHours(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  >
                    <option value="BILLABLE">🟢 BILLABLE</option>
                    <option value="NON_BILLABLE">🟡 NON_BILLABLE</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogForm(false)}
                className="flex-1 py-2 rounded-xl border border-slate-800 hover:bg-slate-850 text-xs font-bold text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
              >
                Save Log
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
