"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Video, 
  Clock, 
  Plus, 
  User, 
  ExternalLink, 
  Check, 
  X, 
  Sparkles,
  ShieldCheck,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface MeetingItem {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  organizer: string;
  link: string;
  status: string;
}

const initialMeetings: MeetingItem[] = [];

export default function ClientMeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingItem[]>(initialMeetings);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [sessionType, setSessionType] = useState("Architecture Review");
  const [meetingDate, setMeetingDate] = useState("2026-08-02");
  const [meetingTime, setMeetingTime] = useState("02:00 PM EST");
  const [organizer, setOrganizer] = useState("Alexander Vance (Lead Architect)");

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a meeting title.");
      return;
    }

    const newMeeting: MeetingItem = {
      id: `m-${Date.now()}`,
      title,
      type: sessionType,
      date: meetingDate,
      time: `${meetingTime} (60 Mins)`,
      organizer,
      link: `https://meet.google.com/nuv-${Math.random().toString(36).substring(7)}`,
      status: "Confirmed"
    };

    setMeetings([newMeeting, ...meetings]);
    toast.success("Strategy call scheduled successfully! Calendar invite sent.");
    setShowScheduleModal(false);
    setTitle("");
  };

  const handleExportICS = (m: MeetingItem) => {
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${m.title}\nDESCRIPTION:${m.type} with Nuvexora Team\nLOCATION:${m.link}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${m.title.replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.info("Calendar (.ics) file exported to downloads.");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Technical Strategy & Sprint Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Schedule Meetings</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Book 1-on-1 strategy sessions, live code walkthroughs, and architecture reviews directly with Nuvexora project leads and engineers.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book Strategy Call</span>
        </button>
      </div>

      {/* Meetings Grid */}
      {meetings.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Strategy Calls Scheduled Yet</div>
          <p className="text-slate-500 max-w-sm mx-auto text-xs">Book your first strategy session, code walkthrough, or architecture review using the button above.</p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book Strategy Call</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meetings.map((m) => (
            <div key={m.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                    {m.status}
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {m.time}
                  </span>
                </div>

                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {m.type}
                </span>

                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-2 leading-snug">{m.title}</h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Host: <strong className="text-slate-800 dark:text-slate-200">{m.organizer}</strong></span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-extrabold mt-1">Date: {m.date}</div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleExportICS(m)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .ics</span>
                </button>

                <a
                  href={m.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Google Meet</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleScheduleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Book Technical Strategy Call</h3>
                  <p className="text-[11px] text-slate-500">Instant calendar sync with Nuvexora leads</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Session Agenda Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sprint #15 Architecture & Microservices Walkthrough"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Session Type</label>
                  <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Architecture Review">Architecture Review</option>
                    <option value="Sprint Demo">Sprint Demo & Code Signoff</option>
                    <option value="Executive Briefing">Executive Strategy Sync</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Nuvexora Host</label>
                  <select
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Alexander Vance (Lead Architect)">Alexander Vance (Architect)</option>
                    <option value="Ridham Langnecha (CTO)">Ridham Langnecha (CTO)</option>
                    <option value="Elena Rostova (UI Lead)">Elena Rostova (UI Lead)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Select Date</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Select Time Slot</label>
                  <select
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="10:00 AM EST">10:00 AM EST</option>
                    <option value="02:00 PM EST">02:00 PM EST</option>
                    <option value="04:00 PM EST">04:00 PM EST</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Confirm Booking</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
