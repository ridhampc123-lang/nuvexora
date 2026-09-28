"use client";

import React, { useState } from "react";
import {
  useAdminMeetingsQuery,
  useAdminTasksQuery,
  useAdminEmployeesQuery,
  useCreateAdminMeetingMutation,
} from "@/hooks/use-api-queries";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Users,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MeetingRoomModal } from "@/components/common/meeting-room-modal";
import { toast } from "sonner";

export default function CalendarPage() {
  const { data: meetings = [], isLoading: loadingMeetings } = useAdminMeetingsQuery();
  const { data: tasks = [], isLoading: loadingTasks } = useAdminTasksQuery();
  const { data: employees = [] } = useAdminEmployeesQuery();
  const createMeeting = useCreateAdminMeetingMutation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Form data for quick scheduling
  const [formData, setFormData] = useState({
    title: "Sprint Sync & Planning",
    organizerName: "Admin",
    organizerEmail: "admin@nuvexora.com",
    companyName: "Nuvexora Technologies",
    meetingDate: new Date().toISOString().split("T")[0],
    timeSlot: "10:00 AM - 11:00 AM",
    timezone: "UTC",
    topic: "Engineering sprint sync & deliverable review",
    status: "scheduled",
    meetingLink: "",
    invitedEmployees: [] as string[],
  });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDayEvents = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayStr}`;

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

    return { dayMeetings, dayTasks, dateStr };
  };

  const handleOpenSchedule = (dateStr?: string) => {
    setFormData({
      title: "Technical Review & Sync",
      organizerName: "Nuvexora Admin",
      organizerEmail: "admin@nuvexora.com",
      companyName: "Nuvexora Technologies",
      meetingDate: dateStr || new Date().toISOString().split("T")[0],
      timeSlot: "11:00 AM - 12:00 PM",
      timezone: "UTC",
      topic: "System architecture & milestone checkpoint",
      status: "scheduled",
      meetingLink: "",
      invitedEmployees: [],
    });
    setIsScheduleOpen(true);
  };

  const toggleEmployee = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      invitedEmployees: prev.invitedEmployees.includes(id)
        ? prev.invitedEmployees.filter((item) => item !== id)
        : [...prev.invitedEmployees, id],
    }));
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMeeting.mutate(
      {
        ...formData,
        meetingDate: new Date(formData.meetingDate).toISOString(),
      },
      {
        onSuccess: () => {
          setIsScheduleOpen(false);
          toast.success("Meeting scheduled and employees notified!");
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-500" />
            <span>Enterprise Calendar</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Schedule strategy sessions, coordinate with employees, and monitor milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenSchedule()}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meeting</span>
          </button>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Today
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="font-bold text-slate-900 dark:text-white min-w-[130px] text-center text-xs sm:text-sm">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-fr">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20"
            />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday =
              new Date().toDateString() ===
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const { dayMeetings, dayTasks, dateStr } = getDayEvents(day);

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-slate-800/50 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30 group relative ${
                  isToday ? "bg-indigo-50/30 dark:bg-indigo-900/10" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                      isToday
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {day}
                  </div>

                  {/* Quick Schedule Button on hover */}
                  <button
                    type="button"
                    onClick={() => handleOpenSchedule(dateStr)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all"
                    title={`Schedule meeting for ${dateStr}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {dayMeetings.map((m: any) => (
                    <div
                      key={m._id}
                      onClick={() => {
                        setSelectedMeeting(m);
                        setIsDetailOpen(true);
                      }}
                      className="flex flex-col gap-0.5 p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors"
                      title={`${m.title} - Click for details`}
                    >
                      <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-700 dark:text-indigo-400 truncate">
                        <Video className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{m.title}</span>
                      </div>
                      <div className="text-[8px] text-indigo-600/80 dark:text-indigo-400/80 truncate">
                        {m.timeSlot}
                      </div>
                    </div>
                  ))}

                  {dayTasks.map((t: any) => (
                    <div
                      key={t._id}
                      className="flex items-center gap-1 p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 truncate"
                    >
                      <CheckSquare className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meeting Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedMeeting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedMeeting.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedMeeting.topic || "Discussion & Review"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">Schedule:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {new Date(selectedMeeting.meetingDate).toLocaleDateString()} • {selectedMeeting.timeSlot}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">Organizer:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedMeeting.organizerName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {selectedMeeting.status}
                  </span>
                </div>
                {selectedMeeting.invitedEmployees?.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="font-semibold text-slate-500 block mb-1">Invited Attendees:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMeeting.invitedEmployees.map((e: any, idx: number) => (
                        <span
                          key={e._id || idx}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-medium"
                        >
                          {e.name || e.email || "Employee"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailOpen(false);
                    setIsRoomOpen(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Live Room</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Schedule Meeting Drawer / Modal */}
      <AnimatePresence>
        {isScheduleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScheduleOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Schedule Meeting on Calendar
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Creates a conference session and sends invitations to selected employees.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date</label>
                    <input
                      required
                      type="date"
                      value={formData.meetingDate}
                      onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time Slot</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 10:00 AM - 11:00 AM"
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Topic</label>
                  <input
                    required
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                {/* Invite Employees */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Invite Employees
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      {formData.invitedEmployees.length} selected
                    </span>
                  </label>
                  <div className="max-h-36 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50 dark:bg-slate-950">
                    {employees.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">No employees available</div>
                    ) : (
                      employees.map((emp: any) => {
                        const uid = String(emp.userId?._id || emp.userId || emp._id);
                        const isSelected = formData.invitedEmployees.includes(uid);
                        return (
                          <button
                            key={emp._id}
                            type="button"
                            onClick={() => toggleEmployee(uid)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors ${
                              isSelected ? "bg-indigo-50 dark:bg-indigo-950/60 font-semibold" : "hover:bg-slate-100 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 dark:border-slate-600"
                              }`}
                            >
                              {isSelected && <span className="text-[9px]">✓</span>}
                            </div>
                            <span className="truncate text-slate-900 dark:text-white">{emp.name}</span>
                            <span className="text-[10px] text-slate-400 truncate">({emp.department})</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsScheduleOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMeeting.isPending}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {createMeeting.isPending ? "Scheduling..." : "Save & Notify"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Virtual Meeting Room Modal */}
      <MeetingRoomModal
        isOpen={isRoomOpen}
        onClose={() => setIsRoomOpen(false)}
        meeting={selectedMeeting}
      />
    </div>
  );
}
