"use client";

import React, { useState, useMemo } from "react";
import { useEmployeeMeetingsQuery } from "@/hooks/use-api-queries";
import {
  Video,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  Search,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  Globe,
  Radio,
  CalendarDays,
  CalendarPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MeetingRoomModal } from "@/components/common/meeting-room-modal";
import { toast } from "sonner";

export default function EmployeeMeetingsPage() {
  const { data: meetings = [], isLoading, isRefetching, refetch } = useEmployeeMeetingsQuery();
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "today" | "past">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  // Filter meetings based on tab and search
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m: any) => {
      const matchSearch =
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.organizerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      const meetingDateStr = m.meetingDate ? new Date(m.meetingDate).toISOString().split("T")[0] : "";

      if (activeTab === "today") {
        return meetingDateStr === todayStr && m.status !== "cancelled";
      }
      if (activeTab === "upcoming") {
        return meetingDateStr >= todayStr && m.status !== "cancelled" && m.status !== "completed";
      }
      if (activeTab === "past") {
        return meetingDateStr < todayStr || m.status === "completed";
      }
      return true;
    });
  }, [meetings, searchQuery, activeTab, todayStr]);

  const stats = useMemo(() => {
    const total = meetings.length;
    const todayCount = meetings.filter((m: any) => {
      const d = m.meetingDate ? new Date(m.meetingDate).toISOString().split("T")[0] : "";
      return d === todayStr && m.status !== "cancelled";
    }).length;
    const upcomingCount = meetings.filter((m: any) => {
      const d = m.meetingDate ? new Date(m.meetingDate).toISOString().split("T")[0] : "";
      return d >= todayStr && m.status === "scheduled";
    }).length;

    return { total, todayCount, upcomingCount };
  }, [meetings, todayStr]);

  const handleJoinMeeting = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsRoomOpen(true);
  };

  const handleCopyLink = (meeting: any) => {
    const link =
      meeting.meetingLink?.trim() ||
      `https://meet.jit.si/nuvexora-${meeting._id || "room"}`;
    navigator.clipboard.writeText(link);
    setCopiedId(meeting._id);
    toast.success("Meeting link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateGoogleCalendarUrl = (meeting: any) => {
    const title = encodeURIComponent(meeting.title || "Nuvexora Meeting");
    const details = encodeURIComponent(
      `Topic: ${meeting.topic || ""}\nHost: ${meeting.organizerName || ""}\nMeeting Link: ${meeting.meetingLink || ""}`
    );
    const dateObj = new Date(meeting.meetingDate || Date.now());
    const dateStr = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}/${dateStr}`;
  };

  return (
    <div className="space-y-8 text-white max-w-7xl mx-auto">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              Live Workspace Sync
            </span>
          </div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <Video className="w-8 h-8 text-indigo-400" />
            <span>Scheduled Meetings & Video Calls</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Review invitations from management, join active conference rooms, and stay aligned on client architecture and sprint reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2 border border-slate-700/50 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-indigo-400" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.upcomingCount}</div>
            <div className="text-xs text-slate-400 font-medium">Upcoming Sessions</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.todayCount}</div>
            <div className="text-xs text-slate-400 font-medium">Scheduled for Today</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-xs text-slate-400 font-medium">Total Meeting Records</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: "all", label: "All Meetings" },
              { id: "upcoming", label: "Upcoming" },
              { id: "today", label: "Today" },
              { id: "past", label: "Past / Completed" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search meetings by topic or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Meetings Grid / List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse space-y-4">
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-6 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
              <div className="h-10 bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 max-w-xl mx-auto shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 opacity-70" />
          </div>
          <h3 className="text-xl font-bold text-white">No Meetings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {searchQuery
              ? `No meeting invitations matching "${searchQuery}". Try a different keyword.`
              : activeTab === "today"
              ? "You do not have any meetings scheduled for today."
              : "You are all caught up! When an administrator or team leader invites you to a meeting, it will appear here instantly."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
              refetch();
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMeetings.map((m: any) => {
            const meetingDate = m.meetingDate ? new Date(m.meetingDate) : new Date();
            const dateStr = meetingDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const isToday = m.meetingDate?.startsWith(todayStr);

            return (
              <motion.div
                key={m._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl bg-slate-900 border flex flex-col justify-between transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 group ${
                  isToday ? "border-indigo-500/40 bg-gradient-to-b from-indigo-950/20 to-slate-900" : "border-slate-800"
                }`}
              >
                <div className="space-y-4">
                  {/* Badge & Timing Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 ${
                        isToday
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {m.timeSlot}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        m.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : m.status === "cancelled"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  {/* Title & Topic */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {m.topic || "Discussion & Sync session"}
                    </p>
                  </div>

                  {/* Metadata: Date & Host */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{dateStr}</span>
                      <span className="text-[10px] text-slate-500">({m.timezone || "UTC"})</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">
                        Host: <strong className="text-slate-200">{m.organizerName}</strong>
                        {m.companyName ? ` (${m.companyName})` : ""}
                      </span>
                    </div>

                    {/* Attendees pills */}
                    {Array.isArray(m.invitedEmployees) && m.invitedEmployees.length > 0 && (
                      <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-500">Invited:</span>
                        {m.invitedEmployees.slice(0, 3).map((u: any, idx: number) => (
                          <span
                            key={u._id || idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/50"
                          >
                            {u.name || u.email || "Colleague"}
                          </span>
                        ))}
                        {m.invitedEmployees.length > 3 && (
                          <span className="text-[10px] text-slate-500">
                            +{m.invitedEmployees.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-5 mt-5 border-t border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleJoinMeeting(m)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meeting</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(m)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
                    title="Copy Meeting Link"
                  >
                    {copiedId === m._id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={generateGoogleCalendarUrl(m)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
                    title="Add to Google Calendar"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-indigo-400" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Embedded Virtual Meeting Room Modal */}
      <MeetingRoomModal
        isOpen={isRoomOpen}
        onClose={() => setIsRoomOpen(false)}
        meeting={selectedMeeting}
      />
    </div>
  );
}
