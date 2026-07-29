"use client";

import React, { useState } from "react";
import { CalendarDays, Plus, CheckCircle2, Clock, X } from "lucide-react";

export default function EmployeeLeavePage() {
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([
    { id: "LR-101", type: "ANNUAL", startDate: "2026-08-10", endDate: "2026-08-14", days: 5, reason: "Summer Vacation", status: "APPROVED" },
    { id: "LR-102", type: "SICK", startDate: "2026-06-04", endDate: "2026-06-04", days: 1, reason: "Medical Appointment", status: "APPROVED" }
  ]);

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-400" />
            <span>Leave Management</span>
          </h1>
          <p className="text-xs text-slate-400">
            Apply for leave, check accrued balances, and track request approval statuses.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
        >
          Apply New Leave
        </button>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Annual Paid Leave Balance</div>
          <div className="text-3xl font-extrabold text-blue-400">15 Days</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Sick Leave Balance</div>
          <div className="text-3xl font-extrabold text-emerald-400">7 Days</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Casual Leave Balance</div>
          <div className="text-3xl font-extrabold text-purple-400">4 Days</div>
        </div>
      </div>

      {/* Requests History */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold">My Leave Requests</h2>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="p-3">ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Days</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="p-3 font-mono text-blue-400">{r.id}</td>
                  <td className="p-3 font-bold text-white">{r.type}</td>
                  <td className="p-3 text-slate-300">{r.startDate} to {r.endDate}</td>
                  <td className="p-3 font-bold">{r.days} Days</td>
                  <td className="p-3 text-slate-300">{r.reason}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {r.status}
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
