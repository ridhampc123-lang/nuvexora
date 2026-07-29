"use client";

import React from "react";
import { Settings, Shield, Bell, Lock } from "lucide-react";

export default function EmployeeSettingsPage() {
  return (
    <div className="space-y-8 text-white max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" />
          <span>Portal Settings</span>
        </h1>
        <p className="text-xs text-slate-400">
          Configure security settings, notification preferences, and portal theme defaults.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold">Security & Password</h2>
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white" />
          </div>
          <div>
            <label className="text-slate-300 font-semibold">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white" />
          </div>
          <button className="px-6 py-2.5 rounded-xl bg-blue-600 font-bold text-white">Update Password</button>
        </div>
      </div>
    </div>
  );
}
