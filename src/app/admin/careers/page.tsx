"use client";

import React, { useState } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";

interface CareerItem {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  isOpen: boolean;
}

const initialCareers: CareerItem[] = [
  { id: "1", title: "Principal AI Systems Architect", department: "AI Engineering", type: "Full-Time", location: "San Francisco / Remote", isOpen: true },
  { id: "2", title: "Senior Full Stack Engineer (Next.js & Node)", department: "Frontend & Web", type: "Full-Time", location: "London / Hybrid", isOpen: true },
  { id: "3", title: "Staff Cloud DevOps Lead", department: "Infrastructure", type: "Full-Time", location: "Remote", isOpen: true },
];

export default function CareersCMSPage() {
  const [careers, setCareers] = useState<CareerItem[]>(initialCareers);

  const columns: Column<CareerItem>[] = [
    { header: "Position Title", accessorKey: "title" },
    { header: "Department", accessorKey: "department" },
    { header: "Type", accessorKey: "type" },
    { header: "Location", accessorKey: "location" },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${row.isOpen ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {row.isOpen ? "Open" : "Closed"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Careers & Open Positions CMS"
        description="Publish job openings, set candidate prerequisites, and track incoming job applications."
        columns={columns}
        data={careers}
        searchPlaceholder="Search job listings..."
      />
    </div>
  );
}
