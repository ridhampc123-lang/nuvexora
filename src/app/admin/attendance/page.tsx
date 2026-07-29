"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminAttendanceQuery, useCreateAdminAttendanceMutation, useUpdateAdminAttendanceMutation, useDeleteAdminAttendanceMutation, useAdminEmployeesQuery } from "@/hooks/use-api-queries";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Plus, CalendarDays, Fingerprint, CalendarCheck } from "lucide-react";

interface Attendance {
  _id: string;
  employeeId: { _id: string; name: string; email: string; employeeId: string };
  date: string;
  checkIn: string;
  checkOut?: string;
  status: "present" | "late" | "absent" | "half_day";
  createdAt: string;
}

export default function AttendancePage() {
  const { data: attendanceRecords = [], isLoading } = useAdminAttendanceQuery();
  const { data: employees = [] } = useAdminEmployeesQuery();
  
  const createAtt = useCreateAdminAttendanceMutation();
  const updateAtt = useUpdateAdminAttendanceMutation();
  const deleteAtt = useDeleteAdminAttendanceMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAtt, setEditingAtt] = useState<Attendance | null>(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    checkIn: "",
    checkOut: "",
    status: "present"
  });

  const openDrawer = (record?: Attendance) => {
    if (record) {
      setEditingAtt(record);
      setFormData({
        employeeId: record.employeeId?._id || "",
        date: new Date(record.date).toISOString().split("T")[0],
        checkIn: record.checkIn ? new Date(record.checkIn).toISOString().slice(0, 16) : "",
        checkOut: record.checkOut ? new Date(record.checkOut).toISOString().slice(0, 16) : "",
        status: record.status
      });
    } else {
      setEditingAtt(null);
      setFormData({
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
        checkIn: "",
        checkOut: "",
        status: "present"
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure payload fields match model format
    const payload = {
      ...formData,
      checkIn: formData.checkIn ? new Date(formData.checkIn).toISOString() : undefined,
      checkOut: formData.checkOut ? new Date(formData.checkOut).toISOString() : undefined,
    };

    if (editingAtt) {
      updateAtt.mutate(
        { id: editingAtt._id, ...payload },
        { onSuccess: () => setIsDrawerOpen(false) }
      );
    } else {
      createAtt.mutate(payload, { onSuccess: () => setIsDrawerOpen(false) });
    }
  };

  const columns: Column<Attendance>[] = [
    {
      header: "Employee",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{row.employeeId?.name || "Unknown"}</div>
            <div className="text-[10px] text-slate-400 font-mono">{row.employeeId?.employeeId || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Date",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
          {new Date(row.date).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Check-In / Out",
      cell: (row) => (
        <div className="flex flex-col gap-0.5 text-[11px] font-mono">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-10">IN:</span> 
            {row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span className="w-10">OUT:</span> 
            {row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          row.status === "present" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" :
          row.status === "late" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30" :
          row.status === "half_day" ? "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30" :
          "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
        }`}>
          {row.status.replace("_", " ")}
        </span>
      ),
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
            onClick={() => deleteAtt.mutate(row._id)}
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
        title="Attendance Logs"
        description="Monitor employee daily check-ins, tardiness, and overall attendance records."
        columns={columns}
        data={isLoading ? [] : attendanceRecords}
        searchPlaceholder="Search logs..."
        actionButton={
          <button
            onClick={() => openDrawer()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            Log Attendance
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
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingAtt ? "Edit Log" : "New Log"}
                    </h2>
                    <p className="text-xs text-slate-500">Manual attendance override</p>
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
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
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
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Check-In
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-[11px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Check-Out
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-[11px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    >
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="half_day">Half Day</option>
                      <option value="absent">Absent</option>
                    </select>
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
                    disabled={createAtt.isPending || updateAtt.isPending}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    {createAtt.isPending || updateAtt.isPending ? "Saving..." : editingAtt ? "Save Changes" : "Log Attendance"}
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
