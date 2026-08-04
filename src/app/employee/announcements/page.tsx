"use client";

import React from "react";
import { Megaphone, Calendar } from "lucide-react";

export default function EmployeeAnnouncementsPage() {
  const announcements: any[] = [];

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-amber-400" />
          <span>Company Announcements</span>
        </h1>
        <p className="text-xs text-slate-400">
          Official company news, executive updates, and engineering policy changes.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-xl mx-auto">
            <Megaphone className="w-12 h-12 text-slate-650 mx-auto opacity-55" />
            <h3 className="text-lg font-bold text-white">No Announcements</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              There are no active company announcements or team updates published at this time. Check back later for official communications.
            </p>
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.title} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-blue-400">{a.author}</span>
                <span>{a.date}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{a.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{a.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
