"use client";

import React from "react";
import { Video, ExternalLink, Calendar, Clock } from "lucide-react";

export default function EmployeeMeetingsPage() {
  const meetings: any[] = [];

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Video className="w-6 h-6 text-purple-400" />
          <span>Meetings & Calendar Sync</span>
        </h1>
        <p className="text-xs text-slate-400">
          Review scheduled video standups, client architecture reviews, and meeting notes.
        </p>
      </div>

      {meetings.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-xl mx-auto">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-white">No Scheduled Meetings</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            You do not have any strategy sessions or engineering standup syncs scheduled for today or tomorrow.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meetings.map((m) => (
            <div key={m.title} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {m.date} • {m.time}
                </span>
                <h3 className="text-base font-bold text-white leading-snug">{m.title}</h3>
                <p className="text-xs text-slate-400">Host: {m.host} ({m.attendees} Attendees)</p>
              </div>

              <a
                href={m.link}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Join Meeting</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
