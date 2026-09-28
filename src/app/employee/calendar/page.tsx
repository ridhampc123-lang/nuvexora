"use client";

import React, { useState, useMemo } from "react";
import { useEmployeeMeetingsQuery, useEmployeeTasksQuery } from "@/hooks/use-api-queries";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  CalendarCheck2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MeetingRoomModal } from "@/components/common/meeting-room-modal";

export default function EmployeeCalendarPage() {
  const { data: meetings = [], isLoading: loadingMeetings } = useEmployeeMeetingsQuery();
  const { data: tasks = [], isLoading: loadingTasks } = useEmployeeTasksQuery();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isRoomOpen, setIsRoomOpen] = useState(false);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(1);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(1);
  };
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.getDate());
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper to format YYYY-MM-DD
  const getDateStr = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  const getDayEvents = (day: number) => {
    const dateStr = getDateStr(day);

    const dayMeetings = meetings.filter((m: any) => {
      if (!m.meetingDate) return false;
      const d = new Date(m.meetingDate).toISOString().split("T")[0];
      return d === dateStr && m.status !== "cancelled";
    });

    const dayTasks = tasks.filter((t: any) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate).toISOString().split("T")[0];
      return d === dateStr;
    });

    return { dayMeetings, dayTasks };
  };

  const selectedDateEvents = useMemo(() => {
    return getDayEvents(selectedDay);
  }, [selectedDay, meetings, tasks, currentDate]);

  const selectedDateStr = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    selectedDay
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            <span>Schedule & Event Calendar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track scheduled sprint meetings, engineering syncs, and assigned task deadlines.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-sm">
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Today
          </button>
          <div className="h-4 w-[1px] bg-slate-800" />
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="font-bold text-white min-w-[130px] text-center text-xs sm:text-sm">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout: Calendar Grid + Day Details Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Grid */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/60">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 auto-rows-fr flex-1 bg-slate-900/40">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-[90px] sm:min-h-[110px] p-2 border-r border-b border-slate-800/40 bg-slate-950/20"
              />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday =
                new Date().toDateString() ===
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              const isSelected = selectedDay === day;
              const { dayMeetings, dayTasks } = getDayEvents(day);
              const hasEvents = dayMeetings.length > 0 || dayTasks.length > 0;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[90px] sm:min-h-[110px] p-2 border-r border-b border-slate-800/60 transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-indigo-950/40 ring-2 ring-indigo-500/50 inset-0 z-10"
                      : isToday
                      ? "bg-slate-800/40 hover:bg-slate-800/60"
                      : "hover:bg-slate-800/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : isSelected
                          ? "bg-white text-slate-900 font-extrabold"
                          : "text-slate-300"
                      }`}
                    >
                      {day}
                    </span>

                    {hasEvents && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    )}
                  </div>

                  {/* Badges preview */}
                  <div className="space-y-1">
                    {dayMeetings.slice(0, 2).map((m: any) => (
                      <div
                        key={m._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMeeting(m);
                          setIsRoomOpen(true);
                        }}
                        className="flex items-center gap-1 p-1 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-[9px] font-bold text-indigo-300 truncate cursor-pointer transition-colors"
                        title={`${m.title} (${m.timeSlot})`}
                      >
                        <Video className="w-2.5 h-2.5 shrink-0 text-indigo-400" />
                        <span className="truncate">{m.title}</span>
                      </div>
                    ))}

                    {dayMeetings.length > 2 && (
                      <div className="text-[8px] text-indigo-400 font-semibold pl-1">
                        +{dayMeetings.length - 2} more meetings
                      </div>
                    )}

                    {dayTasks.slice(0, 1).map((t: any) => (
                      <div
                        key={t._id}
                        className="flex items-center gap-1 p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-bold text-emerald-300 truncate"
                        title={t.title}
                      >
                        <CheckSquare className="w-2.5 h-2.5 shrink-0 text-emerald-400" />
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Sidebar */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CalendarCheck2 className="w-4 h-4 text-indigo-400" />
                  <span>Agenda for Day</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedDateStr}</p>
              </div>
            </div>

            {/* Meetings list */}
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Meetings ({selectedDateEvents.dayMeetings.length})</span>
              </div>

              {selectedDateEvents.dayMeetings.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-500">
                  No meetings scheduled for this date.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.dayMeetings.map((m: any) => (
                    <div
                      key={m._id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white">{m.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {m.topic || "Discussion session"}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {m.timeSlot}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Host: {m.organizerName || "Admin"}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMeeting(m);
                          setIsRoomOpen(true);
                        }}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Meeting Room</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks list */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                <span>Tasks Due ({selectedDateEvents.dayTasks.length})</span>
              </div>

              {selectedDateEvents.dayTasks.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-500">
                  No tasks due on this date.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateEvents.dayTasks.map((t: any) => (
                    <div
                      key={t._id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-white truncate font-medium">{t.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        {t.status || "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-slate-400 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Calendar automatically synchronizes with management meetings in real-time.</span>
          </div>
        </div>
      </div>

      {/* Virtual Meeting Room Modal */}
      <MeetingRoomModal
        isOpen={isRoomOpen}
        onClose={() => setIsRoomOpen(false)}
        meeting={selectedMeeting}
      />
    </div>
  );
}
