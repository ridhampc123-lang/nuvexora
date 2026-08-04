"use client";

import React from "react";
import { Calendar } from "lucide-react";

export default function EmployeeCalendarPage() {
  return (
    <div className="space-y-8 text-white max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-400" />
          <span>Sprint & Event Calendar</span>
        </h1>
        <p className="text-xs text-slate-400">View upcoming project releases, standups, and company events.</p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-center">
        <Calendar className="w-12 h-12 text-slate-650 mx-auto opacity-55 animate-pulse" />
        <h2 className="text-lg font-bold">No Upcoming Events</h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          There are no sprint standups, product releases, or corporate events scheduled on your calendar at this time.
        </p>
      </div>
    </div>
  );
}
