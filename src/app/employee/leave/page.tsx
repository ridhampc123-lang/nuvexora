"use client";

import React, { useState, useMemo } from "react";
import { CalendarDays, Plus, CheckCircle2, Clock, X, Loader2, AlertCircle, Filter, FileText } from "lucide-react";
import { toast } from "sonner";
import { useMyLeaveRequestsQuery, useCreateEmployeeLeaveRequestMutation } from "@/hooks/use-api-queries";

export default function EmployeeLeavePage() {
  const { data: requests = [], isLoading } = useMyLeaveRequestsQuery();
  const createLeaveMutation = useCreateEmployeeLeaveRequestMutation();

  const [showModal, setShowModal] = useState(false);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Form State
  const [leaveType, setLeaveType] = useState("casual");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for your leave request.");
      return;
    }

    createLeaveMutation.mutate(
      {
        type: leaveType.toLowerCase(),
        startDate,
        endDate,
        reason,
      },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "Leave request submitted successfully! Awaiting admin approval.");
          setReason("");
          setShowModal(false);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to submit leave request.");
        },
      }
    );
  };

  // Filtered requests by month and status
  const filteredRequests = useMemo(() => {
    return requests.filter((r: any) => {
      // Month Filter
      if (selectedMonth !== "ALL") {
        const d = new Date(r.startDate || r.createdAt);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (monthKey !== selectedMonth) return false;
      }
      // Status Filter
      if (selectedStatus !== "ALL" && (r.status || "").toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [requests, selectedMonth, selectedStatus]);

  // Leave Balances calculation
  const approvedVacation = requests.filter((r: any) => r.status === "approved" && r.type === "vacation").length;
  const approvedSick = requests.filter((r: any) => r.status === "approved" && r.type === "sick").length;
  const approvedCasual = requests.filter((r: any) => r.status === "approved" && r.type === "casual").length;

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-400" />
            <span>Leave Management</span>
          </h1>
          <p className="text-xs text-slate-400">
            Apply for time-off, check request approval statuses, and review admin feedback.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all shrink-0 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Apply New Leave</span>
        </button>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <div className="text-xs text-slate-400">Vacation Leave Balance</div>
          <div className="text-3xl font-extrabold text-blue-400">{Math.max(0, 15 - approvedVacation)} Days Remaining</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <div className="text-xs text-slate-400">Sick Leave Balance</div>
          <div className="text-3xl font-extrabold text-emerald-400">{Math.max(0, 7 - approvedSick)} Days Remaining</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <div className="text-xs text-slate-400">Casual Leave Balance</div>
          <div className="text-3xl font-extrabold text-purple-400">{Math.max(0, 5 - approvedCasual)} Days Remaining</div>
        </div>
      </div>

      {/* Requests History */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        {/* Month & Status Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>My Leave Requests Ledger</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Month Filter */}
            <div className="flex items-center gap-1.5 text-xs bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent font-semibold text-white outline-none cursor-pointer"
              >
                <option value="ALL">All Months</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-05">May 2026</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent font-semibold text-white outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected / Declined</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="p-3">Type</th>
                <th className="p-3">Duration Dates</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status & Admin Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                    <span>Loading leave requests...</span>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No leave requests match the selected month/status filter. Click "Apply New Leave" to submit a request.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r: any) => {
                  const typeUpper = (r.type || "casual").toUpperCase();
                  const statusUpper = (r.status || "pending").toUpperCase();
                  const startDateStr = r.startDate ? new Date(r.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "--";
                  const endDateStr = r.endDate ? new Date(r.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "--";

                  return (
                    <tr key={r._id} className="hover:bg-slate-850/40 transition-all">
                      <td className="p-3 font-bold text-white uppercase tracking-wider font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          r.type === 'sick' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          r.type === 'casual' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {typeUpper} LEAVE
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 font-mono">
                        {startDateStr} &rarr; {endDateStr}
                      </td>
                      <td className="p-3 text-slate-300 max-w-xs truncate" title={r.reason}>
                        {r.reason}
                      </td>
                      <td className="p-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              statusUpper === "APPROVED"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : statusUpper === "REJECTED"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {statusUpper}
                          </span>
                          {r.reviewedBy?.name && (
                            <span className="text-[10px] text-slate-400">by {r.reviewedBy.name}</span>
                          )}
                        </div>

                        {/* Decline Reason Alert */}
                        {statusUpper === "REJECTED" && r.declineReason && (
                          <div className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2 rounded-xl flex items-start gap-1.5 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                            <div>
                              <strong className="text-rose-300">Decline Reason:</strong> {r.declineReason}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
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
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 transition-all font-semibold"
                >
                  <option value="casual">☕ CASUAL LEAVE</option>
                  <option value="sick">🩹 SICK LEAVE</option>
                  <option value="vacation">🌴 VACATION LEAVE</option>
                  <option value="unpaid">⏳ UNPAID LEAVE</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider">Reason for Request</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe reason for your time-off request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLeaveMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createLeaveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
