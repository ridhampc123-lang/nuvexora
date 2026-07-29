"use client";

import React from "react";
import { Calendar, Video, Clock } from "lucide-react";

export default function EmployeeCalendarPage() {
  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-400" />
          <span>Sprint & Event Calendar</span>
        </h1>
        <p className="text-xs text-slate-400">View upcoming project releases, standups, and company events.</p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold">Upcoming Calendar Events</h2>
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-white">Daily Standup Sync</div>
              <div className="text-slate-400">Today at 10:30 AM</div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold">In 15 Mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
