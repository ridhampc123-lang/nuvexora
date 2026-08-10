"use client";

import React, { useState, useEffect, useMemo } from "react";
import { UserCheck, Play, Square, Clock, Pause, Loader2, CalendarCheck, CalendarDays, Filter } from "lucide-react";
import { toast } from "sonner";
import { useMyAttendanceQuery, useCheckInMutation, useCheckOutMutation } from "@/hooks/use-api-queries";

export default function EmployeeAttendancePage() {
  const { data: attendanceData, isLoading } = useMyAttendanceQuery();
  const checkInMutation = useCheckInMutation();
  const checkOutMutation = useCheckOutMutation();

  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [onBreak, setOnBreak] = useState(false);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTimeStr(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayRecord = attendanceData?.todayRecord;
  const isClockedIn = !!(todayRecord && todayRecord.checkIn && !todayRecord.checkOut);
  const rawHistory = attendanceData?.history || [];

  // Filtered History
  const filteredHistory = useMemo(() => {
    return rawHistory.filter((row: any) => {
      if (selectedMonth !== "ALL") {
        const d = new Date(row.date || row.createdAt);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (monthKey !== selectedMonth) return false;
      }
      if (selectedStatus !== "ALL" && (row.status || "").toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [rawHistory, selectedMonth, selectedStatus]);

  const handleClockIn = () => {
    checkInMutation.mutate(undefined, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Successfully clocked in for today's shift.");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to clock in.");
      },
    });
  };

  const handleClockOut = () => {
    checkOutMutation.mutate(undefined, {
      onSuccess: (res: any) => {
        setOnBreak(false);
        toast.info(res?.message || "Successfully clocked out. Today's shift logged.");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to clock out.");
      },
    });
  };

  const handleBreakAction = () => {
    setOnBreak(!onBreak);
    if (!onBreak) {
      toast.info("Break interval started.");
    } else {
      toast.success("Returned from break.");
    }
  };

  // Helper to format minutes into human readable string e.g. 8h 15m
  const formatMinutes = (mins?: number) => {
    if (!mins || mins <= 0) return "--";
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
  };

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-emerald-400" />
          <span>Attendance & Work Clock</span>
        </h1>
        <p className="text-xs text-slate-400">
          Clock in/out, manage break intervals, and review monthly attendance logs in real time.
        </p>
      </div>

      {/* Action Clock Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-center max-w-xl mx-auto shadow-xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="text-sm font-semibold tracking-widest text-emerald-400 uppercase flex items-center justify-center gap-1.5 font-mono">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{currentTimeStr || "00:00:00 AM"}</span>
          </div>

          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {isClockedIn ? (onBreak ? "PAUSED (ON BREAK)" : "ACTIVE SHIFT IN PROGRESS") : "NOT CLOCKED IN"}
          </div>

          <p className="text-xs text-slate-400">
            {isClockedIn && todayRecord?.checkIn ? (
              <span>
                Shift Started:{" "}
                <strong className="text-slate-200 font-mono">
                  {new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </strong>
              </span>
            ) : todayRecord?.checkOut ? (
              <span>
                Shift Completed Today. Total:{" "}
                <strong className="text-emerald-400 font-mono">{formatMinutes(todayRecord.totalWorkingMinutes)}</strong>
              </span>
            ) : (
              "Ready to begin shift"
            )}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          {isClockedIn ? (
            <button
              onClick={handleClockOut}
              disabled={checkOutMutation.isPending}
              className="px-8 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 disabled:opacity-50"
            >
              {checkOutMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
              <span>{checkOutMutation.isPending ? "Clocking Out..." : "Clock Out"}</span>
            </button>
          ) : (
            <button
              onClick={handleClockIn}
              disabled={checkInMutation.isPending}
              className="px-8 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 disabled:opacity-50"
            >
              {checkInMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{checkInMutation.isPending ? "Clocking In..." : "Clock In"}</span>
            </button>
          )}

          <button
            onClick={handleBreakAction}
            disabled={!isClockedIn}
            className={`px-6 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-40 ${
              onBreak ? "bg-amber-600 text-white animate-pulse" : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Pause className="w-4 h-4" />
            <span>{onBreak ? "End Break" : "Start Break"}</span>
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-400" />
            <span>Attendance History Logs</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Month Selector */}
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

            {/* Status Selector */}
            <div className="flex items-center gap-1.5 text-xs bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent font-semibold text-white outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="half_day">Half Day</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="p-3">Date</th>
                <th className="p-3">Clock In</th>
                <th className="p-3">Clock Out</th>
                <th className="p-3">Total Working Hours</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                    <span>Loading attendance records...</span>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No attendance logs match the selected month/status filter. Use the work clock above to log shift hours.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((row: any, idx: number) => {
                  const checkInTime = row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";
                  const checkOutTime = row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Active Shift";
                  const dateStr = row.date ? new Date(row.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "--";
                  const statusUpper = (row.status || "present").toUpperCase();

                  return (
                    <tr key={row._id || idx} className="hover:bg-slate-800/40 transition-all">
                      <td className="p-3 font-mono text-white font-medium">{dateStr}</td>
                      <td className="p-3 text-emerald-400 font-mono">{checkInTime}</td>
                      <td className="p-3 text-slate-300 font-mono">{checkOutTime}</td>
                      <td className="p-3 font-bold text-blue-400 font-mono">
                        {row.checkOut ? formatMinutes(row.totalWorkingMinutes) : "Shift Active"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            statusUpper === "PRESENT"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : statusUpper === "LATE"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {statusUpper}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
