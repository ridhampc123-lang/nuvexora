"use client";

import React from "react";
import { Users, UserCheck, Calendar, CheckCircle2, Clock } from "lucide-react";
import { useBusinessEmployeesQuery } from "@/hooks/use-api-queries";

interface EmployeeItem {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  status: "active" | "on_leave";
  joiningDate: string;
}

export default function HrmsPage() {
  const { data: dbEmployees = [], isLoading } = useBusinessEmployeesQuery();

  const employees: EmployeeItem[] = dbEmployees.map((emp: any, idx: number) => ({
    id: emp._id || emp.id || String(idx),
    employeeId: emp.employeeId || `NUV-${String(idx + 1).padStart(3, "0")}`,
    name: emp.name || emp.userId?.name || "Staff Member",
    department: emp.department || emp.departmentId?.name || "Engineering",
    position: emp.position || emp.jobTitle || "Software Engineer",
    status: emp.status === "on_leave" ? "on_leave" : "active",
    joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : (emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : "Active"),
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">HRMS & Staff Directory</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Employee records, department allocations, attendance logs, and leave request management.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {employees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{emp.employeeId}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">{emp.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[11px] font-semibold">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{emp.position}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        emp.status === "active" ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono">{emp.joiningDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No Employees Found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Add staff members in the Admin panel to populate the HRMS Directory.</p>
          </div>
        )}
      </div>
    </div>
  );
}
