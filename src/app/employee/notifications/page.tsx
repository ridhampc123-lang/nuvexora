"use client";

import React from "react";
import { Bell, CheckCircle2 } from "lucide-react";

export default function EmployeeNotificationsPage() {
  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-400" />
          <span>Notifications Feed</span>
        </h1>
        <p className="text-xs text-slate-400">Real-time alerts for task assignments, approvals, and meeting links.</p>
      </div>

      <div className="space-y-3">
        {[
          { title: "New Task Assigned: API Gateway Rate Limiter", time: "10 mins ago" },
          { title: "Leave Request Approved by HR Manager", time: "2 hours ago" },
          { title: "Project Milestone Reached: 90% Code Coverage", time: "1 day ago" }
        ].map((n, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white">{n.title}</div>
              <div className="text-slate-400">{n.time}</div>
            </div>
            <span className="text-blue-400 font-semibold">Mark Read</span>
          </div>
        ))}
      </div>
    </div>
  );
}
