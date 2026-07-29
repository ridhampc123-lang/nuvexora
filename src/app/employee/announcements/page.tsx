"use client";

import React from "react";
import { Megaphone, Calendar } from "lucide-react";

export default function EmployeeAnnouncementsPage() {
  const announcements = [
    { title: "Nuvexora Q3 All-Hands & AI Innovation Awards", date: "2026-07-24", author: "Executive Team", content: "Join us tomorrow at 11:00 AM EST for our quarterly product roadmap showcase and annual innovation awards." },
    { title: "Updated Remote Work & Security Compliance Policy", date: "2026-07-20", author: "HR Department", content: "Please review the updated SOC2 data privacy guidelines in the Company Policies tab before end of month." }
  ];

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
        {announcements.map((a) => (
          <div key={a.title} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-blue-400">{a.author}</span>
              <span>{a.date}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{a.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
