"use client";

import React from "react";
import { Bell } from "lucide-react";

export default function EmployeeNotificationsPage() {
  const notifications: any[] = [];

  return (
    <div className="space-y-8 text-white max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-400" />
          <span>Notifications Feed</span>
        </h1>
        <p className="text-xs text-slate-400">Real-time alerts for task assignments, approvals, and meeting links.</p>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-xl mx-auto">
            <Bell className="w-12 h-12 text-slate-650 mx-auto opacity-55 animate-pulse" />
            <h3 className="text-lg font-bold text-white">No New Notifications</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              You are all caught up! There are no unread notifications or security alerts in your feed.
            </p>
          </div>
        ) : (
          notifications.map((n, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{n.title}</div>
                <div className="text-slate-400">{n.time}</div>
              </div>
              <span className="text-blue-400 font-semibold cursor-pointer hover:underline">Mark Read</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
