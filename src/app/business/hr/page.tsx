"use client";

import React, { useState } from "react";
import { Users, UserCheck, Calendar, CheckCircle2, Clock } from "lucide-react";

interface EmployeeItem {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  status: "active" | "on_leave";
  joiningDate: string;
}

const initialEmployees: EmployeeItem[] = [
  { id: "1", employeeId: "NUV-001", name: "Dr. Aris Thorne", department: "AI Engineering", position: "Principal AI Architect", status: "active", joiningDate: "Jan 15, 2024" },
  { id: "2", employeeId: "NUV-002", name: "Elena Rostova", department: "Infrastructure", position: "Staff DevOps Lead", status: "active", joiningDate: "Mar 01, 2024" },
  { id: "3", employeeId: "NUV-003", name: "Sarah Jenkins", department: "Mobile Engineering", position: "Senior iOS Engineer", status: "active", joiningDate: "Jun 10, 2024" },
  { id: "4", employeeId: "NUV-004", name: "David Kim", department: "Full Stack Web", position: "Senior Next.js Engineer", status: "on_leave", joiningDate: "Nov 01, 2024" },
];

export default function HrmsPage() {
  const [employees] = useState<EmployeeItem[]>(initialEmployees);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">HRMS & Staff Directory</h1>
        <p className="text-xs text-slate-500 mt-1">Employee records, department allocations, attendance logs, and leave request management.</p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{emp.employeeId}</td>
                  <td className="px-6 py-4 font-extrabold text-slate-900">{emp.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{emp.position}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      emp.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {emp.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{emp.joiningDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
