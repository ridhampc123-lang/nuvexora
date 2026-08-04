"use client";

import React from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { useAdminCareersQuery } from "@/hooks/use-api-queries";

interface CareerItem {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  isOpen: boolean;
}

export default function CareersCMSPage() {
  const { data: dbCareers = [], isLoading } = useAdminCareersQuery();

  const careers: CareerItem[] = dbCareers.map((item: any) => ({
    id: item._id || item.id,
    title: item.title,
    department: item.department || "Engineering",
    type: item.type || "Full-Time",
    location: item.location || "Remote",
    isOpen: item.isOpen ?? true,
  }));

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

