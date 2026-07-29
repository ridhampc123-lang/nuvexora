"use client";

import React, { useState } from "react";
import { UserCheck, Play, Pause, Square, Clock } from "lucide-react";

export default function EmployeeAttendancePage() {
  const [clockedIn, setClockedIn] = useState(true);
  const [onBreak, setOnBreak] = useState(false);

  const history = [
    { date: "2026-07-24", clockIn: "09:00 AM", clockOut: "In Progress", total: "4h 32m", status: "PRESENT" },
    { date: "2026-07-23", clockIn: "08:55 AM", clockOut: "05:15 PM", total: "8h 20m", status: "PRESENT" },
    { date: "2026-07-22", clockIn: "09:05 AM", clockOut: "05:00 PM", total: "7h 55m", status: "PRESENT" },
  ];

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-emerald-400" />
          <span>Attendance & Work Clock</span>
        </h1>
        <p className="text-xs text-slate-400">
          Clock in/out, manage break intervals, and review monthly attendance logs.
        </p>
      </div>

      {/* Action Clock Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-center max-w-xl mx-auto shadow-xl">
        <div className="space-y-1">
          <div className="text-4xl font-extrabold text-white font-mono">04 : 32 : 18</div>
          <p className="text-xs text-slate-400">Shift Started: 09:00 AM (EST)</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setClockedIn(!clockedIn)}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 ${
              clockedIn ? "bg-rose-600 hover:bg-rose-500 text-white" : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {clockedIn ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{clockedIn ? "Clock Out" : "Clock In"}</span>
          </button>

          <button
            onClick={() => setOnBreak(!onBreak)}
            disabled={!clockedIn}
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 ${
              onBreak ? "bg-amber-600 text-white animate-pulse" : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Pause className="w-4 h-4" />
            <span>{onBreak ? "End Break" : "Start Break"}</span>
          </button>
        </div>
      </div>

      {/* History */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold">Attendance History</h2>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="p-3">Date</th>
                <th className="p-3">Clock In</th>
                <th className="p-3">Clock Out</th>
                <th className="p-3">Total Working Hours</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {history.map((row) => (
                <tr key={row.date}>
                  <td className="p-3 font-mono">{row.date}</td>
                  <td className="p-3 text-slate-300">{row.clockIn}</td>
                  <td className="p-3 text-slate-300">{row.clockOut}</td>
                  <td className="p-3 font-bold text-blue-400">{row.total}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
