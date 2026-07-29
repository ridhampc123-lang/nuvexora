"use client";

import React, { useState } from "react";
import { Folder, Upload, Download, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function EmployeeFilesPage() {
  const [files, setFiles] = useState([
    { name: "architecture-blueprint-v2.pdf", project: "Veloce SaaS", size: "4.2 MB", version: "v2.1", date: "2026-07-20" },
    { name: "rag-eval-metrics-benchmark.csv", project: "Omni RAG AI", size: "1.8 MB", version: "v1.0", date: "2026-07-22" },
    { name: "design-tokens-export.json", project: "Design Specs", size: "240 KB", version: "v4.2", date: "2026-07-24" },
  ]);

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Folder className="w-6 h-6 text-amber-400" />
            <span>Assigned Files & Deliverable Vault</span>
          </h1>
          <p className="text-xs text-slate-400">
            Access assigned project specifications, download assets, and upload client deliverables.
          </p>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md">
          <Upload className="w-4 h-4" />
          <span>Upload Deliverable</span>
        </button>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold">Assigned Documents & Asset Files</h2>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="p-3">File Name</th>
                <th className="p-3">Project</th>
                <th className="p-3">Version</th>
                <th className="p-3">Size</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {files.map((f) => (
                <tr key={f.name} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>{f.name}</span>
                  </td>
                  <td className="p-3 text-slate-300">{f.project}</td>
                  <td className="p-3 font-mono text-cyan-400">{f.version}</td>
                  <td className="p-3 text-slate-400">{f.size}</td>
                  <td className="p-3 text-slate-400">{f.date}</td>
                  <td className="p-3 text-right space-x-2">
                    <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
