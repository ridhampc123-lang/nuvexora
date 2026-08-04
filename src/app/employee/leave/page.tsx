"use client";

import React, { useState } from "react";
import { CalendarDays, Plus, CheckCircle2, Clock, X } from "lucide-react";
import { toast } from "sonner";

export default function EmployeeLeavePage() {
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  // Form State
  const [leaveType, setLeaveType] = useState("ANNUAL");
  const [startDate, setStartDate] = useState("2026-08-10");
  const [endDate, setEndDate] = useState("2026-08-14");
  const [days, setDays] = useState(5);
  const [reason, setReason] = useState("");

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for the leave.");
      return;
    }

    const newRequest = {
      id: `LR-${Math.floor(100 + Math.random() * 900)}`,
      type: leaveType,
      startDate,
      endDate,
      days,
      reason,
      status: "PENDING"
    };

    setRequests([newRequest, ...requests]);
    toast.success("Leave request submitted successfully! Pending HR approval.");
    setReason("");
    setShowModal(false);
  };

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
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
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
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No leave requests recorded. Click "Apply New Leave" to submit a request.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-855/20 transition-all">
                    <td className="p-3 font-mono text-blue-400">{r.id}</td>
                    <td className="p-3 font-bold text-white">{r.type}</td>
                    <td className="p-3 text-slate-300">{r.startDate} to {r.endDate}</td>
                    <td className="p-3 font-bold">{r.days} Days</td>
                    <td className="p-3 text-slate-305">{r.reason}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        r.status === "APPROVED" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleApplyLeave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-white">Apply for Leave</h3>
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-850 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                >
                  <option value="ANNUAL">🌴 ANNUAL PAID LEAVE</option>
                  <option value="SICK">🩹 SICK LEAVE</option>
                  <option value="CASUAL">☕ CASUAL LEAVE</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Reason for Request</label>
                <textarea
                  required
                  placeholder="Describe details regarding your leave request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-20 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-800 hover:bg-slate-850 text-xs font-bold text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
