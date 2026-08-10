"use client";

import React, { useState, useMemo } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminLeaveRequestsQuery, useUpdateAdminLeaveRequestMutation, useDeleteAdminLeaveRequestMutation, useCreateAdminLeaveRequestMutation, useAdminEmployeesQuery } from "@/hooks/use-api-queries";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarOff, X, Plus, Clock, FileText, CheckCircle2, XCircle, Filter, CalendarDays, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface LeaveRequest {
  _id: string;
  employeeId: { _id: string; name: string; email: string; employeeId: string };
  type: "sick" | "casual" | "vacation" | "unpaid";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  declineReason?: string;
  reviewedBy?: { _id: string; name: string };
  createdAt: string;
}

export default function LeaveRequestsPage() {
  const { data: leaveRequests = [], isLoading } = useAdminLeaveRequestsQuery();
  const { data: employees = [] } = useAdminEmployeesQuery();
  
  const createLeave = useCreateAdminLeaveRequestMutation();
  const updateLeave = useUpdateAdminLeaveRequestMutation();
  const deleteLeave = useDeleteAdminLeaveRequestMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Reject / Decline Modal State
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineTargetId, setDeclineTargetId] = useState<string | null>(null);
  const [declineReasonText, setDeclineReasonText] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    type: "casual",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
    status: "pending",
    declineReason: ""
  });

  const openDrawer = (leave?: LeaveRequest) => {
    if (leave) {
      setEditingLeave(leave);
      setFormData({
        employeeId: leave.employeeId?._id || "",
        type: leave.type,
        startDate: new Date(leave.startDate).toISOString().split("T")[0],
        endDate: new Date(leave.endDate).toISOString().split("T")[0],
        reason: leave.reason,
        status: leave.status,
        declineReason: leave.declineReason || ""
      });
    } else {
      setEditingLeave(null);
      setFormData({
        employeeId: "",
        type: "casual",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        reason: "",
        status: "pending",
        declineReason: ""
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLeave) {
      updateLeave.mutate(
        { id: editingLeave._id, ...formData },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createLeave.mutate(formData, { onSuccess: () => setIsDrawerOpen(false) });
    }
  };

  const handleApprove = (id: string) => {
    updateLeave.mutate({ id, status: "approved" }, {
      onSuccess: () => toast.success("Leave request approved successfully.")
    });
  };

  const openDeclineModal = (id: string) => {
    setDeclineTargetId(id);
    setDeclineReasonText("");
    setDeclineModalOpen(true);
  };

  const handleConfirmDecline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declineTargetId) return;
    if (!declineReasonText.trim()) {
      toast.error("Please enter a reason for declining this request.");
      return;
    }

    updateLeave.mutate(
      { id: declineTargetId, status: "rejected", declineReason: declineReasonText },
      {
        onSuccess: () => {
          toast.info("Leave request declined with reason provided.");
          setDeclineModalOpen(false);
          setDeclineTargetId(null);
          setDeclineReasonText("");
        }
      }
    );
  };

  // Filtered Leave Records
  const filteredLeaveRequests = useMemo(() => {
    return leaveRequests.filter((leave: LeaveRequest) => {
      // Month Filter
      if (selectedMonth !== "ALL") {
        const leaveDate = new Date(leave.startDate || leave.createdAt);
        const monthKey = `${leaveDate.getFullYear()}-${String(leaveDate.getMonth() + 1).padStart(2, "0")}`;
        if (monthKey !== selectedMonth) return false;
      }
      // Status Filter
      if (selectedStatus !== "ALL" && leave.status.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [leaveRequests, selectedMonth, selectedStatus]);

  const columns: Column<LeaveRequest>[] = [
    {
      header: "Employee",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
            <CalendarOff className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{row.employeeId?.name || "Unknown"}</div>
            <div className="text-[10px] text-slate-400 font-mono">{row.employeeId?.employeeId || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Leave Details",
      cell: (row) => (
        <div>
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
            row.type === 'sick' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-900/30' :
            row.type === 'casual' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-900/30' :
            row.type === 'vacation' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-900/30' :
            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {row.type} Leave
          </span>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-slate-400" />
            {new Date(row.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(row.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      ),
    },
    {
      header: "Reason & Notes",
      cell: (row) => (
        <div className="space-y-1 max-w-[240px]">
          <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-50" />
            <span className="truncate" title={row.reason}>{row.reason}</span>
          </div>
          {row.status === "rejected" && row.declineReason && (
            <div className="text-[10px] text-rose-500 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded-md border border-rose-200 dark:border-rose-900/40 flex items-start gap-1">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
              <span><strong>Declined:</strong> {row.declineReason}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <div className="flex flex-col items-start gap-1">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.status === "approved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
            row.status === "pending" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30" :
            "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
          }`}>
            {row.status}
          </span>
          {row.reviewedBy && (
            <span className="text-[9px] text-slate-400">by {row.reviewedBy.name}</span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "pending" && (
            <>
              <button
                onClick={() => handleApprove(row._id)}
                disabled={updateLeave.isPending}
                className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-colors"
                title="Approve Request"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => openDeclineModal(row._id)}
                disabled={updateLeave.isPending}
                className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors"
                title="Decline Request"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => openDrawer(row)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => deleteLeave.mutate(row._id)}
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
      {/* Month & Status Filter Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Leave Organization & Filters</h3>
            <p className="text-[11px] text-slate-500">Filter requests by month date ranges and status</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
            <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="ALL">All Months</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="2026-05">May 2026</option>
            </select>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected / Declined</option>
            </select>
          </div>
        </div>
      </div>

      <AdminDataTable
        title="Leave Requests"
        description="Review, approve, or decline employee time-off requests with decline reasons."
        columns={columns}
        data={isLoading ? [] : filteredLeaveRequests}
        searchPlaceholder="Search requests..."
        actionButton={
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-orange-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Leave Record
          </button>
        }
      />

      {/* Decline Reason Modal */}
      <AnimatePresence>
        {declineModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  <span>Decline Leave Request</span>
                </h3>
                <button
                  onClick={() => setDeclineModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmDecline} className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Please specify the reason for declining this leave request. The reason will be stored and visible to the employee.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Decline Reason <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={declineReasonText}
                    onChange={(e) => setDeclineReasonText(e.target.value)}
                    placeholder="e.g. Overlapping project milestone deployment week or insufficient coverage..."
                    className="w-full p-3 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeclineModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateLeave.isPending}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 disabled:opacity-50"
                  >
                    Confirm Decline
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Drawer */}
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
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <CalendarOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingLeave ? "Edit Request" : "New Request"}
                    </h2>
                    <p className="text-xs text-slate-500">Manage time off record</p>
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
                      Employee
                    </label>
                    <select
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    >
                      <option value="">-- Select Employee --</option>
                      {employees.map((emp: any) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.employeeId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Leave Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    >
                      <option value="sick">Sick Leave</option>
                      <option value="casual">Casual Leave</option>
                      <option value="vacation">Vacation</option>
                      <option value="unpaid">Unpaid Leave</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Reason
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                      placeholder="Explain reason for leave..."
                    />
                  </div>

                  {formData.status === "rejected" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                        Decline Reason
                      </label>
                      <textarea
                        rows={2}
                        value={formData.declineReason}
                        onChange={(e) => setFormData({ ...formData, declineReason: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all resize-none"
                        placeholder="Reason for declining request..."
                      />
                    </div>
                  )}
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
                    disabled={createLeave.isPending || updateLeave.isPending}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all disabled:opacity-50"
                  >
                    {createLeave.isPending || updateLeave.isPending ? "Saving..." : editingLeave ? "Save Changes" : "Submit Request"}
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
